import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import Input from '../components/Input';
import Button from '../components/Button';
import Card from '../components/Card';

const Crops = () => {
  const [crops, setCrops] = useState([]);
  const [name, setName] = useState('');
  const [fieldId, setFieldId] = useState('');

  useEffect(() => {
    api.get('/crops').then(res => setCrops(res.data));
  }, []);

  const createCrop = async () => {
    await api.post('/crops', { name, fieldId });
    setName('');
    setFieldId('');
    const res = await api.get('/crops');
    setCrops(res.data);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl mb-4">Usevi</h2>

      <Card title="Novi usev">
        <Input label="Naziv" value={name} onChange={e => setName(e.target.value)} />
        <Input label="Field ID" value={fieldId} onChange={e => setFieldId(e.target.value)} />
        <Button onClick={createCrop}>Dodaj</Button>
      </Card>

      {crops.map(c => (
        <Card key={c.id} title={c.name}>
          <p>Field ID: {c.fieldId}</p>
        </Card>
      ))}
    </div>
  );
};

export default Crops;
