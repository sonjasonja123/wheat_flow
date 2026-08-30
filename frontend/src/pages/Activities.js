import React, { useEffect, useMemo, useState } from 'react';
import { api } from '../services/api';
import { getRole } from '../services/auth';
import Button from '../components/Button';
import Card from '../components/Card';
import Input from '../components/Input';

const initialForm = { productionId: '', title: '', type: '', plannedDate: '', fieldId: '', assignedUserId: '', notes: '' };
const weekDays = ['Pon', 'Uto', 'Sre', 'Čet', 'Pet', 'Sub', 'Ned'];
const productionPhases = [
  { type: 'Setva', dateField: 'sowingDate' },
  { type: 'Đubrenje', dateField: 'fertilizationDate' },
  { type: 'Zaštita', dateField: 'protectionDate' },
  { type: 'Žetva', dateField: 'harvestDate' }
];

const toDateKey = date => [date.getFullYear(), String(date.getMonth() + 1).padStart(2, '0'), String(date.getDate()).padStart(2, '0')].join('-');

export default function Activities() {
  const roleId = Number(getRole());
  const canPlan = [1, 2, 3, 4].includes(roleId);
  const canDelete = [1, 2, 4].includes(roleId);
  const [activities, setActivities] = useState([]);
  const [fields, setFields] = useState([]);
  const [productions, setProductions] = useState([]);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState(null);
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });

  const calendarDays = useMemo(() => {
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();
    const firstDayOffset = (new Date(year, month, 1).getDay() + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return [
      ...Array(firstDayOffset).fill(null),
      ...Array.from({ length: daysInMonth }, (_, index) => new Date(year, month, index + 1))
    ];
  }, [calendarMonth]);

  const activitiesByDate = useMemo(() => activities.reduce((result, activity) => {
    const key = String(activity.plannedDate || '').slice(0, 10);
    if (!result[key]) result[key] = [];
    result[key].push(activity);
    return result;
  }, {}), [activities]);

  const changeMonth = offset => setCalendarMonth(current => new Date(current.getFullYear(), current.getMonth() + offset, 1));

  const load = async () => {
    const requests = [api.get('/activities'), api.get('/fields'), api.get('/productions')];
    if (canPlan) requests.push(api.get('/users'));
    const [activityRes, fieldRes, productionRes, userRes] = await Promise.all(requests);
    setActivities(activityRes.data);
    setFields(fieldRes.data);
    setProductions(productionRes.data);
    setUsers(userRes?.data || []);
  };

  useEffect(() => { load().catch(() => setMessage({ type: 'error', text: 'Aktivnosti nije moguće učitati.' })); }, []);
  const change = event => setForm(current => ({ ...current, [event.target.name]: event.target.value }));

  const selectProduction = event => {
    const productionId = event.target.value;
    const production = productions.find(item => Number(item.id) === Number(productionId));
    setForm(current => ({
      ...current,
      productionId,
      fieldId: production?.fieldId || '',
      type: '',
      title: '',
      plannedDate: ''
    }));
  };

  const selectPhase = event => {
    const type = event.target.value;
    const production = productions.find(item => Number(item.id) === Number(form.productionId));
    const field = fields.find(item => Number(item.id) === Number(production?.fieldId));
    const phase = productionPhases.find(item => item.type === type);
    setForm(current => ({
      ...current,
      type,
      fieldId: production?.fieldId || '',
      title: type && production ? `${type} — ${field?.name || `parcela #${production.fieldId}`}` : '',
      plannedDate: phase && production?.[phase.dateField] ? String(production[phase.dateField]).slice(0, 10) : ''
    }));
  };

  const create = async () => {
    if (!form.productionId) {
      return setMessage({ type: 'error', text: 'Izaberite proizvodnju.' });
    }
    if (!form.type) {
      return setMessage({ type: 'error', text: 'Izaberite fazu proizvodnje.' });
    }
    if (!form.title.trim() || !form.plannedDate) {
      return setMessage({ type: 'error', text: 'Izabrana faza nema unet datum u proizvodnji.' });
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
          <div className="input-group"><label htmlFor="activityProduction">Proizvodnja</label><select id="activityProduction" name="productionId" value={form.productionId} onChange={selectProduction}><option value="">Izaberite proizvodnju</option>{productions.map(production => { const field = fields.find(item => Number(item.id) === Number(production.fieldId)); return <option key={production.id} value={production.id}>Proizvodnja #{production.id} — {field?.name || `parcela #${production.fieldId}`}</option>; })}</select></div>
          <div className="input-group"><label htmlFor="activityType">Faza proizvodnje</label><select id="activityType" name="type" value={form.type} onChange={selectPhase} disabled={!form.productionId}><option value="">Izaberite fazu</option>{productionPhases.map(phase => { const production = productions.find(item => Number(item.id) === Number(form.productionId)); const date = production?.[phase.dateField]; return <option key={phase.type} value={phase.type} disabled={!date}>{phase.type}{date ? ` — ${String(date).slice(0, 10)}` : ' — datum nije unet'}</option>; })}</select></div>
          {form.type && <div className="activity-auto-data"><span>Automatski podaci</span><strong>{form.title}</strong><small>{form.plannedDate ? new Date(`${form.plannedDate}T00:00:00`).toLocaleDateString('sr-RS') : 'Datum nije unet u proizvodnji'}</small></div>}
          <div className="input-group"><label htmlFor="activityUser">Dodeli zaposlenom</label><select id="activityUser" name="assignedUserId" value={form.assignedUserId} onChange={change}><option value="">Bez zaduženja</option>{users.map(user => <option key={user.id} value={user.id}>{user.name} — {user.email}</option>)}</select></div>
          <div className="input-group"><label htmlFor="activityNotes">Komentar</label><textarea id="activityNotes" name="notes" value={form.notes} onChange={change} rows="3" /></div>
          <Button onClick={create}>Sačuvaj aktivnost</Button>
        </Card>
      )}
      {message && <div className={`form-message ${message.type}`} role="alert">{message.text}</div>}
      <section className="activity-calendar mb-6" aria-label="Mesečni kalendar aktivnosti">
        <div className="calendar-toolbar">
          <button type="button" className="calendar-nav" onClick={() => changeMonth(-1)} aria-label="Prethodni mesec">←</button>
          <h3>{calendarMonth.toLocaleDateString('sr-RS', { month: 'long', year: 'numeric' })}</h3>
          <button type="button" className="calendar-nav" onClick={() => changeMonth(1)} aria-label="Sledeći mesec">→</button>
        </div>
        <div className="calendar-grid">
          {weekDays.map(day => <div className="calendar-weekday" key={day}>{day}</div>)}
          {calendarDays.map((date, index) => {
            if (!date) return <div className="calendar-day calendar-day-empty" key={`empty-${index}`} />;
            const key = toDateKey(date);
            const dayActivities = activitiesByDate[key] || [];
            const isToday = key === toDateKey(new Date());
            return (
              <div className={`calendar-day ${isToday ? 'calendar-today' : ''}`} key={key}>
                <span className="calendar-date">{date.getDate()}</span>
                {dayActivities.map(activity => (
                  <div className={`calendar-event ${activity.completed ? 'completed' : ''}`} key={activity.id} title={`${activity.type}: ${activity.title}`}>
                    <strong>{activity.title}</strong>
                    <span>{activity.type}</span>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </section>
      <div className="activity-list">
        {activities.map(activity => (
          <Card key={activity.id} title={activity.title} className={activity.completed ? 'activity-completed' : ''}>
            <p><strong>{activity.type}</strong> · {new Date(activity.plannedDate).toLocaleDateString('sr-RS')}</p>
            {activity.productionId && <p>Proizvodnja: #{activity.productionId}</p>}
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
