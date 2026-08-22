import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { getRole, getUserFromToken } from '../services/auth';
import Input from '../components/Input';
import Button from '../components/Button';
import Card from '../components/Card';
import FarmMap from "../components/FarmMap"; // mapa

const SOIL_TYPES = [
  'Černozem',
  'Smonica',
  'Gajnjača',
  'Ilovača',
  'Aluvijalno zemljište',
  'Peskovito zemljište',
  'Ritska crnica',
  'Crvenica'
];

export default function Fields() {
  const [fields, setFields] = useState([]);
  const [form, setForm] = useState({
    name: '',
    area: '',
    soilType: '',
    location: '',
    season: 2026,
    lat: '', // dodato za mapu
    lng: ''  // dodato za mapu
  });
  const [editingId, setEditingId] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  const user = getUserFromToken();
  const roleId = getRole();
  const canEdit = [1, 2, 4].includes(Number(roleId));

  // Učitavanje parcela
  const loadFields = async () => {
    try {
      const res = await api.get('/fields');
      setFields(res.data);
    } catch (e) {
      console.error('Load error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) loadFields();
    else setLoading(false);
  }, [user]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleMapSelect = ({ lat, lng }) => {
    setForm(current => ({ ...current, lat: String(lat), lng: String(lng) }));
    setMessage({ type: 'success', text: `Koordinate su izabrane na mapi: ${lat}, ${lng}` });
  };

  const validateForm = () => {
    if (!form.name.trim() || !form.area || !form.soilType || !form.location.trim() || !form.season) {
      return 'Popunite sva obavezna polja.';
    }
    if (Number(form.area) <= 0) return 'Površina mora biti veća od 0 hektara.';
    if (!Number.isInteger(Number(form.season)) || Number(form.season) < 1900 || Number(form.season) > 2100) {
      return 'Sezona mora biti cela godina između 1900. i 2100.';
    }
    if ((form.lat && !form.lng) || (!form.lat && form.lng)) {
      return 'Unesite obe koordinate ili ostavite obe prazne.';
    }
    if (form.lat && (Number(form.lat) < -90 || Number(form.lat) > 90)) {
      return 'Latitude mora biti između -90 i 90.';
    }
    if (form.lng && (Number(form.lng) < -180 || Number(form.lng) > 180)) {
      return 'Longitude mora biti između -180 i 180.';
    }
    return null;
  };

  const createField = async () => {
    setMessage(null);
    if (!canEdit) return setMessage({ type: 'error', text: 'Samo Admin i Owner mogu da dodaju parcele.' });
    const validationError = validateForm();
    if (validationError) return setMessage({ type: 'error', text: validationError });
    try {
      await api.post('/fields', form);
      setForm({ name: '', area: '', soilType: '', location: '', season: 2026, lat: '', lng: '' });
      await loadFields();
      setMessage({ type: 'success', text: 'Parcela je uspešno dodata u bazu.' });
    } catch (e) {
      console.error('Create error:', e);
      const status = e.response?.status;
      let errorText = e.response?.data?.message || e.response?.data?.error;
      if (!e.response) errorText = 'Backend nije dostupan. Proverite da li je server pokrenut na portu 5000.';
      else if (status === 401) errorText = 'Prijava je istekla ili nije važeća. Prijavite se ponovo.';
      else if (status === 403) errorText = 'Nemate dozvolu. Samo Admin i Owner mogu da dodaju parcelu.';
      else if (status === 404) errorText = 'Ruta za parcele nije pronađena na backendu.';
      else if (status >= 500 && !errorText) errorText = 'Baza je odbila podatke. Proverite format i ograničenja polja.';
      setMessage({
        type: 'error',
        text: errorText || 'Parcela nije dodata. Server nije vratio detaljan razlog.'
      });
    }
  };

  const removeField = async (id) => {
    if (!canEdit) return alert('Nemate ovlašćenje za brisanje parcela.');
    try {
      await api.delete(`/fields/${id}`);
      loadFields();
    } catch (e) {
      console.error('Delete error:', e);
    }
  };

  const startEdit = (field) => {
    if (!canEdit) return alert('Nemate ovlašćenje za izmenu parcela.');
    setEditingId(field.id);
    setForm({
      name: field.name,
      area: field.area,
      soilType: field.soilType || '',
      location: field.location,
      season: field.season || 2026,
      lat: field.lat || '',
      lng: field.lng || ''
    });
  };

  const saveEdit = async () => {
    if (!canEdit) return alert('Nemate ovlašćenje za izmenu parcela.');
    try {
      await api.put(`/fields/${editingId}`, form);
      setEditingId(null);
      setForm({ name: '', area: '', soilType: '', location: '', season: 2026, lat: '', lng: '' });
      loadFields();
    } catch (e) {
      console.error('Update error:', e);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({ name: '', area: '', soilType: '', location: '', season: 2026, lat: '', lng: '' });
  };

  if (!user) return <p className="p-6">Molimo prijavite se da biste videli parcele.</p>;
  if (loading) return <p className="p-6">Učitavanje parcela...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl mb-4">Parcele</h2>

      {/* Forma za dodavanje/izmenu */}
      {canEdit && (
        <Card title={editingId ? 'Izmena parcele' : 'Dodaj parcelu'} className="mb-6">
          <Input label="Naziv" name="name" value={form.name} onChange={handleChange} />
          <Input label="Površina (ha)" name="area" type="number" min="0.01" step="0.01" value={form.area} onChange={handleChange} />
          <div className="input-group">
            <label htmlFor="soilType">Tip zemljišta</label>
            <select id="soilType" name="soilType" value={form.soilType} onChange={handleChange}>
              <option value="">Izaberi tip zemljišta</option>
              {SOIL_TYPES.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <Input label="Lokacija" name="location" value={form.location} onChange={handleChange} />
          <Input label="Sezona" name="season" type="number" min="1900" max="2100" step="1" value={form.season} onChange={handleChange} />
          <div className="map-picker">
            <div className="map-picker-heading">
              <div>
                <strong>Izaberite lokaciju na mapi</strong>
                <span>Kliknite na željenu tačku da automatski popunite koordinate.</span>
              </div>
              {(form.lat || form.lng) && (
                <button type="button" className="map-clear-button" onClick={() => setForm(current => ({ ...current, lat: '', lng: '' }))}>
                  Obriši izbor
                </button>
              )}
            </div>
            <FarmMap
              apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY || ''}
              locations={[]}
              selectedPosition={form.lat && form.lng ? { lat: Number(form.lat), lng: Number(form.lng) } : null}
              onSelect={handleMapSelect}
            />
          </div>
          <Input label="Latitude" name="lat" type="number" min="-90" max="90" step="0.0000001" placeholder="npr. 43.7238" value={form.lat} onChange={handleChange} />
          <Input label="Longitude" name="lng" type="number" min="-180" max="180" step="0.0000001" placeholder="npr. 20.6873" value={form.lng} onChange={handleChange} />
          {message && <div className={`form-message ${message.type}`} role="alert">{message.text}</div>}
          {editingId ? (
            <>
              <Button onClick={saveEdit}>Sačuvaj izmene</Button>
              <Button onClick={cancelEdit} style={{ marginLeft: '10px' }}>Otkaži</Button>
            </>
          ) : (
            <Button onClick={createField}>Dodaj parcelu</Button>
          )}
        </Card>
      )}

      {/* Mapa parcela */}
      {fields.length > 0 && (
        <Card title="Mapa parcela" className="mb-6">
          <FarmMap
            apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY || ''}
            locations={fields
              .filter(f => f.lat && f.lng)
              .map(f => ({
                id: f.id,
                name: f.name,
                lat: Number(f.lat),
                lng: Number(f.lng)
              }))}
          />
        </Card>
      )}

      {/* Lista parcela */}
      {fields.length === 0 ? (
        <p className="mt-4">Nema parcela.</p>
      ) : (
        fields.map(f => (
          <Card key={f.id} title={f.name} className="mt-4">
            <p>Površina: {f.area} ha</p>
            <p>Zemljište: {f.soilType}</p>
            <p>Lokacija: {f.location}</p>
            <p>Sezona: {f.season}</p>
            <p>Lat: {f.lat ?? '-'}</p>
            <p>Lng: {f.lng ?? '-'}</p>
            {canEdit && (
              <>
                <Button onClick={() => startEdit(f)}>Izmeni</Button>
                <Button onClick={() => removeField(f.id)} style={{ marginLeft: '10px' }}>Obriši</Button>
              </>
            )}
          </Card>
        ))
      )}
    </div>
  );
}
