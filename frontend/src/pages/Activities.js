import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { getRole } from '../services/auth';
import Button from '../components/Button';
import Card from '../components/Card';
import Input from '../components/Input';

const initialForm = { title: '', type: 'Setva', plannedDate: '', fieldId: '', assignedUserId: '', notes: '' };

export default function Activities() {
  const roleId = Number(getRole());
  const canPlan = [1, 2, 3, 4].includes(roleId);
  const canDelete = [1, 2, 4].includes(roleId);
  const [activities, setActivities] = useState([]);
  const [fields, setFields] = useState([]);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState(null);

  const load = async () => {
    const requests = [api.get('/activities'), api.get('/fields')];
    if (canPlan) requests.push(api.get('/users'));
    const [activityRes, fieldRes, userRes] = await Promise.all(requests);
    setActivities(activityRes.data);
    setFields(fieldRes.data);
    setUsers(userRes?.data || []);
  };

  useEffect(() => { load().catch(() => setMessage({ type: 'error', text: 'Aktivnosti nije moguće učitati.' })); }, []);
  const change = event => setForm(current => ({ ...current, [event.target.name]: event.target.value }));

  const create = async () => {
    if (!form.title.trim() || !form.plannedDate) {
      return setMessage({ type: 'error', text: 'Unesite naziv i planirani datum aktivnosti.' });
    }
    try {
      await api.post('/activities', {
        ...form,
        fieldId: form.fieldId || null,
        assignedUserId: form.assignedUserId || null
      });
      setForm(initialForm);
      setMessage({ type: 'success', text: 'Aktivnost je uspešno sačuvana i radnik je obavešten.' });
      await load();
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Aktivnost nije sačuvana.' });
    }
  };

  const toggle = async activity => {
    await api.put(`/activities/${activity.id}`, { completed: !activity.completed, notes: activity.notes });
    await load();
  };
  const remove = async id => {
    await api.delete(`/activities/${id}`);
    await load();
  };

  return (
    <div className="container p-6">
      <div className="page-heading"><span className="section-label">Organizacija rada</span><h2>Kalendar aktivnosti</h2><p>Planirajte poslove, dodelite ih zaposlenima i zabeležite napomene.</p></div>
      {canPlan && (
        <Card title="Nova aktivnost" className="mb-6">
          <Input label="Naziv aktivnosti" name="title" value={form.title} onChange={change} />
          <div className="input-group"><label htmlFor="activityType">Tip</label><select id="activityType" name="type" value={form.type} onChange={change}>{['Setva', 'Đubrenje', 'Zaštita', 'Navodnjavanje', 'Žetva', 'Ostalo'].map(type => <option key={type}>{type}</option>)}</select></div>
          <Input label="Planirani datum" name="plannedDate" type="date" value={form.plannedDate} onChange={change} />
          <div className="input-group"><label htmlFor="activityField">Parcela</label><select id="activityField" name="fieldId" value={form.fieldId} onChange={change}><option value="">Bez parcele</option>{fields.map(field => <option key={field.id} value={field.id}>{field.name}</option>)}</select></div>
          <div className="input-group"><label htmlFor="activityUser">Dodeli zaposlenom</label><select id="activityUser" name="assignedUserId" value={form.assignedUserId} onChange={change}><option value="">Bez zaduženja</option>{users.map(user => <option key={user.id} value={user.id}>{user.name} — {user.email}</option>)}</select></div>
          <div className="input-group"><label htmlFor="activityNotes">Beleška</label><textarea id="activityNotes" name="notes" value={form.notes} onChange={change} rows="3" /></div>
          <Button onClick={create}>Sačuvaj aktivnost</Button>
        </Card>
      )}
      {message && <div className={`form-message ${message.type}`} role="alert">{message.text}</div>}
      <div className="activity-list">
        {activities.map(activity => (
          <Card key={activity.id} title={activity.title} className={activity.completed ? 'activity-completed' : ''}>
            <p><strong>{activity.type}</strong> · {new Date(activity.plannedDate).toLocaleDateString('sr-RS')}</p>
            <p>Parcela: {activity.Field?.name || 'nije izabrana'} · Zadužen: {activity.assignee?.name || 'nije dodeljen'}</p>
            {activity.notes && <p>Beleška: {activity.notes}</p>}
            <Button onClick={() => toggle(activity)}>{activity.completed ? 'Vrati u planirano' : 'Označi završeno'}</Button>
            {canDelete && <Button onClick={() => remove(activity.id)} style={{ marginLeft: 10 }}>Obriši</Button>}
          </Card>
        ))}
        {!activities.length && <p>Nema planiranih aktivnosti.</p>}
      </div>
    </div>
  );
}
