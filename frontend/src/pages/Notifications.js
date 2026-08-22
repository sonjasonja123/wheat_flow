import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import Card from '../components/Card';
import Button from '../components/Button';


export default function Notifications() {
  const [notifications, setNotifications] = useState([]);

  const loadNotifications = async () => {
    try {
      const res = await api.get('/notifications');

      // Filtriraj notifikacije: samo one koje nisu prošle
      const today = new Date();
      const futureNotifications = res.data.filter(n => new Date(n.date) >= today);

      setNotifications(futureNotifications);
    } catch (err) {
      console.error('Cannot load notifications', err);
    }
  };

  const generateNotifications = async () => {
    try {
      await api.post('/notifications/generate');
      loadNotifications();
    } catch (err) {
      console.error('Cannot generate notifications', err);
    }
  };

  const deleteAll = async () => {
    try {
      await api.delete('/notifications');
      setNotifications([]);
    } catch (err) {
      console.error('Cannot delete notifications', err);
    }
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}.${month}.${year}`;
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  return (
    <div className="p-6">

      <h2 className="text-2xl mb-4">Obaveštenja</h2>

      <Card title="Kontrole">
        <Button onClick={generateNotifications}>Proveri nove notifikacije</Button>
        <Button onClick={deleteAll} className="ml-2">Obriši sve notifikacije</Button>
      </Card>

      {notifications.length === 0 ? (
        <p className="mt-4">Nema obaveštenja.</p>
      ) : (
        <div className="mt-4 space-y-2">
          {notifications.map(n => (
            <Card key={n.id} title={n.title}>
              <p>{n.message}</p>
              <p className="text-sm text-gray-500">Datum: {formatDate(n.date)}</p>
              <p>Status: {n.isRead ? 'Pročitano' : 'Novo'}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
