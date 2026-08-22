import React, { useEffect, useMemo, useState } from 'react';
import { api, setAuthToken } from '../services/api';
import { getRole, getUserFromToken } from '../services/auth';
import { ROLES } from '../constants/roles';
import Input from '../components/Input';
import Button from '../components/Button';
import Card from '../components/Card';


const initialForm = {
  fieldId: '',
  sowingDate: '',
  seedQuantity: '',
  hybrid: '',
  fertilizationType: '',
  fertilizationQuantity: '',
  fertilizationDate: '',
  protectionType: '',
  protectionDate: '',
  irrigationSystem: '',
  waterUsed: '',
  harvestDate: '',
  yieldKg: '',
  salePricePerKg: ''
};

const DEFAULT_PROTECTION_OPTIONS = [
  'Herbicid',
  'Fungicid',
  'Insekticid',
  'Biološka zaštita',
  'Bez zaštite'
];

const DEFAULT_IRRIGATION_OPTIONS = [
  'Kap po kap',
  'Prskalice',
  'Kišno krilo',
  'Pivot sistem',
  'Navodnjavanje brazdama',
  'Bez navodnjavanja'
];

export default function Productions() {
  const [productions, setProductions] = useState([]);
  const [fields, setFields] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [customFields, setCustomFields] = useState({});

  const user = getUserFromToken();
  const roleId = Number(getRole());
  const canEdit = [ROLES.ADMIN, ROLES.MANAGER, ROLES.AGRONOM, ROLES.OWNER, ROLES.RADNIK].includes(roleId);
  const canDelete = [ROLES.ADMIN, ROLES.MANAGER, ROLES.OWNER].includes(roleId);

  const hybridOptions = useMemo(() => (
    [...new Set(productions.map(item => item.hybrid?.trim()).filter(Boolean))].sort()
  ), [productions]);

  const fertilizerOptions = useMemo(() => (
    [...new Set(productions.map(item => item.fertilizationType?.trim()).filter(Boolean))].sort()
  ), [productions]);

  const protectionOptions = useMemo(() => (
    [...new Set([
      ...DEFAULT_PROTECTION_OPTIONS,
      ...productions.map(item => item.protectionType?.trim()).filter(value => value && value.length > 2)
    ])].sort()
  ), [productions]);

  const irrigationOptions = useMemo(() => (
    [...new Set([
      ...DEFAULT_IRRIGATION_OPTIONS,
      ...productions.map(item => item.irrigationSystem?.trim()).filter(value => value && value.length > 2)
    ])].sort()
  ), [productions]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || !user) {
      setLoading(false);
      return;
    }

    setAuthToken(token);

    const fetchProductions = async () => {
      try {
        const [productionsRes, fieldsRes] = await Promise.all([
          api.get('/productions'),
          api.get('/fields')
        ]);
        setProductions(productionsRes.data);
        setFields(fieldsRes.data);
      } catch (err) {
        console.error('Error loading productions:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductions();
  }, [user]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validateDates = () => {
    if (form.fertilizationDate && !form.sowingDate) {
      return 'Pre datuma đubrenja morate uneti datum setve.';
    }
    if (form.harvestDate && !form.fertilizationDate) {
      return 'Pre datuma žetve morate uneti datum đubrenja.';
    }
    if (form.sowingDate && form.fertilizationDate && form.sowingDate >= form.fertilizationDate) {
      return 'Datum setve mora biti pre datuma đubrenja.';
    }
    if (form.fertilizationDate && form.harvestDate && form.fertilizationDate >= form.harvestDate) {
      return 'Datum đubrenja mora biti pre datuma žetve.';
    }
    return null;
  };

  const handleChoiceChange = (e) => {
    const { name, value } = e.target;
    const isCustom = value === '__custom__';
    setCustomFields(current => ({ ...current, [name]: isCustom }));
    setForm(current => ({ ...current, [name]: isCustom ? '' : value }));
  };

  const renderChoice = (label, name, options) => (
    <div className="input-group">
      <label htmlFor={name}>{label}</label>
      <select
        id={name}
        name={name}
        value={customFields[name] ? '__custom__' : form[name]}
        onChange={handleChoiceChange}
      >
        <option value="">Izaberite {label.toLowerCase()}</option>
        {options.map(option => <option key={option} value={option}>{option}</option>)}
        <option value="__custom__">Drugo — unesi novu vrednost</option>
      </select>
      {customFields[name] && (
        <input
          className="custom-choice-input"
          name={name}
          value={form[name]}
          onChange={handleChange}
          placeholder={`Unesite novu vrednost za: ${label}`}
          autoFocus
        />
      )}
    </div>
  );

  const createProduction = async () => {
    setMessage(null);
    if (!form.fieldId) return setMessage({ type: 'error', text: 'Izaberite parcelu za proizvodnju.' });
    const dateError = validateDates();
    if (dateError) return setMessage({ type: 'error', text: dateError });
    try {
      await api.post('/productions', form);
      setForm(initialForm);
      setCustomFields({});
      const res = await api.get('/productions');
      setProductions(res.data);
      setMessage({ type: 'success', text: 'Proizvodnja je uspešno sačuvana u bazi.' });
    } catch (err) {
      console.error('Error creating production:', err);
      const status = err.response?.status;
      let errorText = err.response?.data?.message || err.response?.data?.error;
      if (!err.response) errorText = 'Backend nije dostupan. Proverite da li je server pokrenut.';
      else if (status === 401) errorText = 'Prijava je istekla. Prijavite se ponovo.';
      else if (status === 403) errorText = 'Nemate dozvolu za dodavanje proizvodnje.';
      setMessage({ type: 'error', text: errorText || 'Proizvodnja nije sačuvana. Proverite unete podatke.' });
    }
  };

  const removeProduction = async (id) => {
    try {
      await api.delete(`/productions/${id}`);
      const res = await api.get('/productions');
      setProductions(res.data);
    } catch (err) {
      console.error('Error deleting production:', err);
    }
  };

  const startEdit = (p) => {
    setMessage(null);
    setCustomFields({});
    setEditingId(p.id);
    setForm({
      fieldId: p.fieldId || '',
      sowingDate: p.sowingDate ? String(p.sowingDate).slice(0, 10) : '',
      seedQuantity: p.seedQuantity || '',
      hybrid: p.hybrid || '',
      fertilizationType: p.fertilizationType || '',
      fertilizationQuantity: p.fertilizationQuantity || '',
      fertilizationDate: p.fertilizationDate ? String(p.fertilizationDate).slice(0, 10) : '',
      protectionType: p.protectionType || '',
      protectionDate: p.protectionDate ? String(p.protectionDate).slice(0, 10) : '',
      irrigationSystem: p.irrigationSystem || '',
      waterUsed: p.waterUsed || '',
      harvestDate: p.harvestDate ? String(p.harvestDate).slice(0, 10) : '',
      yieldKg: p.yieldKg || '',
      salePricePerKg: p.salePricePerKg || ''
    });
  };

  const saveEdit = async () => {
    setMessage(null);
    if (!form.fieldId) return setMessage({ type: 'error', text: 'Izaberite parcelu za proizvodnju.' });
    const dateError = validateDates();
    if (dateError) return setMessage({ type: 'error', text: dateError });
    try {
      await api.put(`/productions/${editingId}`, form);
      setEditingId(null);
      setForm(initialForm);
      const res = await api.get('/productions');
      setProductions(res.data);
      setMessage({ type: 'success', text: 'Izmene proizvodnje su uspešno sačuvane u bazi.' });
    } catch (err) {
      console.error('Error updating production:', err);
      setMessage({
        type: 'error',
        text: err.response?.data?.message || err.response?.data?.error || 'Izmene nisu sačuvane. Proverite podatke.'
      });
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(initialForm);
    setCustomFields({});
    setMessage(null);
  };

  const formatDate = (date) => (date ? new Date(date).toLocaleDateString() : '-');
  const getFieldLabel = (fieldId) => {
    const field = fields.find(item => Number(item.id) === Number(fieldId));
    return field ? `${field.name} — ${field.location || 'bez lokacije'}` : `Parcela #${fieldId}`;
  };

  if (!user) return <p className="p-6">Molimo prijavite se da biste videli proizvodnje.</p>;

  if (loading) return <p className="p-6">Učitavanje proizvodnji...</p>;

  return (
    <>
  
      <div className="container p-6">
        <h2 className="text-2xl mb-4">Proizvodnja pšenice</h2>

        {canEdit && (
          <Card title={editingId ? 'Izmena proizvodnje' : 'Nova proizvodnja'} className="mb-6">
            <div className="input-group">
              <label htmlFor="productionField">Parcela</label>
              <select id="productionField" name="fieldId" value={form.fieldId} onChange={handleChange}>
                <option value="">Izaberite parcelu</option>
                {fields.map(field => (
                  <option key={field.id} value={field.id}>
                    {field.name} — {field.location || 'bez lokacije'} (ID: {field.id})
                  </option>
                ))}
              </select>
              {fields.length === 0 && <span className="field-hint">Prvo dodajte parcelu u odeljku Parcele.</span>}
            </div>
            <Input label="Datum setve" name="sowingDate" type="date" value={form.sowingDate} onChange={handleChange} />
            <Input label="Količina semena (kg)" name="seedQuantity" value={form.seedQuantity} onChange={handleChange} />
            {renderChoice('Sorta pšenice', 'hybrid', hybridOptions)}
            {renderChoice('Đubrivo', 'fertilizationType', fertilizerOptions)}
            <Input label="Količina đubriva" name="fertilizationQuantity" value={form.fertilizationQuantity} onChange={handleChange} />
            <Input label="Datum đubrenja" name="fertilizationDate" type="date" min={form.sowingDate || undefined} value={form.fertilizationDate} onChange={handleChange} />
            {renderChoice('Zaštita', 'protectionType', protectionOptions)}
            <Input label="Datum zaštite" name="protectionDate" type="date" value={form.protectionDate} onChange={handleChange} />
            {renderChoice('Navodnjavanje', 'irrigationSystem', irrigationOptions)}
            <Input label="Potrošnja vode (m3)" name="waterUsed" value={form.waterUsed} onChange={handleChange} />
            <Input label="Datum žetve" name="harvestDate" type="date" min={form.fertilizationDate || undefined} value={form.harvestDate} onChange={handleChange} />
            <Input label="Prinos (kg)" name="yieldKg" value={form.yieldKg} onChange={handleChange} />
            <Input label="Prodajna cena (RSD/kg)" name="salePricePerKg" type="number" min="0" step="0.01" value={form.salePricePerKg} onChange={handleChange} />

            {message && <div className={`form-message ${message.type}`} role="alert">{message.text}</div>}

            {editingId ? (
              <>
                <Button onClick={saveEdit}>Sačuvaj izmene</Button>
                <Button onClick={cancelEdit} style={{ marginLeft: '10px' }}>Otkaži</Button>
              </>
            ) : (
              <Button onClick={createProduction}>Sačuvaj proizvodnju</Button>
            )}
          </Card>
        )}

        {productions.length === 0 ? (
          <p>Još nema proizvodnji.</p>
        ) : (
          productions.map((p) => (
            <Card key={p.id} title={`Proizvodnja #${p.id}`} className="mt-4">
              <p>Parcela: {p.fieldId ? getFieldLabel(p.fieldId) : '-'}</p>
              <p>Datum setve: {formatDate(p.sowingDate)}</p>
              <p>Količina semena: {p.seedQuantity ?? '-'} kg</p>
              <p>Sorta pšenice: {p.hybrid ?? '-'}</p>
              <p>Đubrivo: {p.fertilizationType ?? '-'} ({p.fertilizationQuantity ?? '-'})</p>
              <p>Datum đubrenja: {formatDate(p.fertilizationDate)}</p>
              <p>Zaštita: {p.protectionType ?? '-'}</p>
              <p>Datum zaštite: {formatDate(p.protectionDate)}</p>
              <p>Navodnjavanje: {p.irrigationSystem ?? '-'} ({p.waterUsed ?? '-'} m3)</p>
              <p>Datum žetve: {formatDate(p.harvestDate)}</p>
              <p>Prinos: {p.yieldKg ?? '-'} kg</p>
              <p>Prodajna cena: {p.salePricePerKg ?? '-'} RSD/kg</p>

              {canEdit && (
                <>
                  <Button onClick={() => startEdit(p)}>Izmeni</Button>
                  {canDelete && <Button onClick={() => removeProduction(p.id)} style={{ marginLeft: '10px' }}>Obriši</Button>}
                </>
              )}
            </Card>
          ))
        )}
      </div>
    </>
  );
}
