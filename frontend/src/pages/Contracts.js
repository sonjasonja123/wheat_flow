import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import Button from '../components/Button';
import Card from '../components/Card';
import Input from '../components/Input';

const initialForm = { employeeId: '', startDate: '', endDate: '', salary: '', status: 'Aktivan', notes: '' };

export default function Contracts() {
  const [contracts, setContracts] = useState([]);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState(null);
  const load = async () => {
    const [contractRes, userRes] = await Promise.all([api.get('/contracts'), api.get('/users')]);
    setContracts(contractRes.data);
    setUsers(userRes.data.filter(user => user.roleId !== 1 && user.roleId !== 4));
  };
  useEffect(() => { load().catch(() => setMessage({ type: 'error', text: 'Ugovore nije moguće učitati.' })); }, []);
  const change = event => setForm(current => ({ ...current, [event.target.name]: event.target.value }));
  const create = async () => {
    if (!form.employeeId || !form.startDate || !form.salary) return setMessage({ type: 'error', text: 'Izaberite zaposlenog i unesite početak i zaradu.' });
    try {
      await api.post('/contracts', { ...form, endDate: form.endDate || null });
      setForm(initialForm);
      setMessage({ type: 'success', text: 'Ugovor je uspešno sačuvan.' });
      await load();
    } catch (error) { setMessage({ type: 'error', text: error.response?.data?.message || 'Ugovor nije sačuvan.' }); }
  };
  const remove = async id => { await api.delete(`/contracts/${id}`); await load(); };

  return (
    <div className="container p-6">
      <div className="page-heading"><span className="section-label">Zaposleni</span><h2>Ugovori</h2><p>Evidencija angažovanja i statusa zaposlenih.</p></div>
      <Card title="Novi ugovor" className="mb-6">
        <div className="input-group"><label htmlFor="employeeId">Zaposleni</label><select id="employeeId" name="employeeId" value={form.employeeId} onChange={change}><option value="">Izaberite zaposlenog</option>{users.map(user => <option key={user.id} value={user.id}>{user.name} — {user.email}</option>)}</select></div>
        <Input label="Datum početka" name="startDate" type="date" value={form.startDate} onChange={change} />
        <Input label="Datum završetka (opciono)" name="endDate" type="date" min={form.startDate || undefined} value={form.endDate} onChange={change} />
        <Input label="Ugovorena zarada (RSD)" name="salary" type="number" min="0" value={form.salary} onChange={change} />
        <div className="input-group"><label htmlFor="contractStatus">Status</label><select id="contractStatus" name="status" value={form.status} onChange={change}>{['Aktivan', 'Istekao', 'Raskinut'].map(status => <option key={status}>{status}</option>)}</select></div>
        <Input label="Napomena" name="notes" value={form.notes} onChange={change} />
        <Button onClick={create}>Sačuvaj ugovor</Button>
      </Card>
      {message && <div className={`form-message ${message.type}`} role="alert">{message.text}</div>}
      {contracts.map(contract => <Card key={contract.id} title={contract.employee?.name || `Ugovor #${contract.id}`} className="mt-4"><p>{contract.startDate} — {contract.endDate || 'na neodređeno'}</p><p>{Number(contract.salary).toLocaleString('sr-RS')} RSD · {contract.status}</p>{contract.notes && <p>{contract.notes}</p>}<Button onClick={() => remove(contract.id)}>Obriši</Button></Card>)}
    </div>
  );
}
