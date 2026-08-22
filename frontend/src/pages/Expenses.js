import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { api } from '../services/api';
import { getRole } from '../services/auth';
import Input from '../components/Input';
import Button from '../components/Button';
import Card from '../components/Card';
import ExpensesChart from "../components/ExpensesChart"; // grafikon

import { ROLES } from '../constants/roles';

const initialForm = {
  fieldId: '',
  productionId: '',
  type: '',
  description: '',
  amount: '',
  date: ''
};

const DEFAULT_EXPENSE_TYPES = [
  'Seme', 'Đubrivo', 'Zaštita bilja', 'Gorivo', 'Navodnjavanje',
  'Mehanizacija', 'Radna snaga', 'Transport', 'Održavanje'
];

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [fields, setFields] = useState([]);
  const [productions, setProductions] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [customType, setCustomType] = useState(false);
  const [message, setMessage] = useState(null);

  const roleId = Number(getRole());
  const canAdd = [ROLES.ADMIN, ROLES.MANAGER, ROLES.OWNER, ROLES.RADNIK].includes(roleId);
  const canEditDelete = [ROLES.ADMIN, ROLES.MANAGER, ROLES.OWNER].includes(roleId);
  const canView = roleId !== ROLES.AGRONOM;

  const loadExpenses = useCallback(async () => {
    if (!canView) {
      setExpenses([]);
      setLoading(false);
      return;
    }
    try {
      const [expensesRes, fieldsRes, productionsRes] = await Promise.all([
        api.get('/expenses'), api.get('/fields'), api.get('/productions')
      ]);
      setExpenses(expensesRes.data);
      setFields(fieldsRes.data);
      setProductions(productionsRes.data);
    } catch (err) {
      console.error('Error loading expenses:', err);
    } finally {
      setLoading(false);
    }
  }, [canView]);

  useEffect(() => {
    loadExpenses();
  }, [loadExpenses]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value, ...(name === 'fieldId' ? { productionId: '' } : {}) }));
  };

  const expenseTypeOptions = useMemo(() => (
    [...new Set([...DEFAULT_EXPENSE_TYPES, ...expenses.map(item => item.type?.trim()).filter(Boolean)])].sort()
  ), [expenses]);

  const availableProductions = useMemo(() => (
    form.fieldId ? productions.filter(item => Number(item.fieldId) === Number(form.fieldId)) : productions
  ), [productions, form.fieldId]);

  const getFieldLabel = (fieldId) => {
    const field = fields.find(item => Number(item.id) === Number(fieldId));
    return field ? field.name : `Parcela #${fieldId}`;
  };

  const createExpense = async () => {
    setMessage(null);
    if (!form.description || !form.amount) {
      return setMessage({ type: 'error', text: 'Unesite opis i iznos troška.' });
    }
    if (Number(form.amount) <= 0) return setMessage({ type: 'error', text: 'Iznos troška mora biti veći od 0.' });
    if (!form.type) return setMessage({ type: 'error', text: 'Izaberite ili unesite tip troška.' });

    try {
      await api.post('/expenses', {
        fieldId: form.fieldId ? Number(form.fieldId) : null,
        productionId: form.productionId ? Number(form.productionId) : null,
        type: form.type,
        description: form.description,
        amount: Number(form.amount),
        date: form.date ? new Date(form.date + 'T00:00:00').toISOString() : null
      });

      setForm(initialForm);
      setCustomType(false);
      await loadExpenses();
      setMessage({ type: 'success', text: 'Trošak je uspešno sačuvan u bazi.' });
    } catch (err) {
      console.error('Error creating expense:', err.response?.data || err);
      setMessage({ type: 'error', text: err.response?.data?.message || err.response?.data?.error || 'Trošak nije sačuvan. Proverite podatke.' });
    }
  };

  const removeExpense = async (id) => {
    if (!canEditDelete) return alert('Nemate dozvolu za brisanje troška.');
    try {
      await api.delete(`/expenses/${id}`);
      loadExpenses();
    } catch (err) {
      console.error('Error deleting expense:', err);
    }
  };

  const formatDate = (date) => date ? new Date(date).toLocaleDateString() : '-';

  if (!canView) return <p className="p-6 text-red-600">Nemate pristup ovom delu.</p>;
  if (loading) return <p className="p-6">Učitavanje troškova...</p>;

  return (
    <div className="container p-6">
      <h2 className="text-2xl mb-4">Troškovi</h2>

      {/* Forma za dodavanje novog troška */}
      {canAdd && (
        <Card title="Novi trošak" className="mb-6">
          <div className="input-group">
            <label htmlFor="expenseField">Parcela</label>
            <select id="expenseField" name="fieldId" value={form.fieldId} onChange={handleChange}>
              <option value="">Izaberite parcelu</option>
              {fields.map(field => (
                <option key={field.id} value={field.id}>{field.name} — {field.location || 'bez lokacije'} (ID: {field.id})</option>
              ))}
            </select>
          </div>
          <div className="input-group">
            <label htmlFor="expenseProduction">Proizvodnja</label>
            <select id="expenseProduction" name="productionId" value={form.productionId} onChange={handleChange}>
              <option value="">Izaberite proizvodnju</option>
              {availableProductions.map(production => (
                <option key={production.id} value={production.id}>
                  Proizvodnja #{production.id} — {production.hybrid || 'bez sorte'} ({getFieldLabel(production.fieldId)})
                </option>
              ))}
            </select>
            {form.fieldId && availableProductions.length === 0 && <span className="field-hint">Izabrana parcela nema proizvodnje.</span>}
          </div>
          <div className="input-group">
            <label htmlFor="expenseType">Tip troška</label>
            <select id="expenseType" name="type" value={customType ? '__custom__' : form.type} onChange={e => {
              const isCustom = e.target.value === '__custom__';
              setCustomType(isCustom);
              setForm(current => ({ ...current, type: isCustom ? '' : e.target.value }));
            }}>
              <option value="">Izaberite tip troška</option>
              {expenseTypeOptions.map(type => <option key={type} value={type}>{type}</option>)}
              <option value="__custom__">Drugo — unesi novu vrednost</option>
            </select>
            {customType && <input className="custom-choice-input" name="type" value={form.type} onChange={handleChange} placeholder="Unesite novi tip troška" autoFocus />}
          </div>
          <Input label="Opis" name="description" value={form.description} onChange={handleChange} />
          <Input label="Iznos (RSD)" name="amount" type="number" value={form.amount} onChange={handleChange} />
          <Input label="Datum" name="date" type="date" value={form.date} onChange={handleChange} />
          {message && <div className={`form-message ${message.type}`} role="alert">{message.text}</div>}
          <Button onClick={createExpense}>Dodaj trošak</Button>
        </Card>
      )}

      {/* Grafik troškova po tipu */}
      {expenses.length > 0 && (
        <Card title="Grafik troškova po tipu" className="mb-6">
          <ExpensesChart expenses={expenses} />
        </Card>
      )}

      {/* Lista troškova */}
      {expenses.length === 0 ? (
        <p>Još nema troškova.</p>
      ) : (
        expenses.map(e => (
          <Card key={e.id} title={`Trošak #${e.id}`} className="mb-4">
            <p>Tip: {e.type ?? '-'}</p>
            <p>Iznos: {e.amount ?? '-'} RSD</p>
            <p>Parcela: {e.fieldId ? getFieldLabel(e.fieldId) : '-'}, Proizvodnja: {e.productionId ? `#${e.productionId}` : '-'}</p>
            <p>Datum: {formatDate(e.date)}</p>
            {canEditDelete && <Button onClick={() => removeExpense(e.id)}>Obriši</Button>}
          </Card>
        ))
      )}
    </div>
  );
}
