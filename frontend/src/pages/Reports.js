import React, { useCallback, useEffect, useState } from 'react';
import { api } from '../services/api';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import ReportCharts from '../components/ReportCharts';

const emptyReport = { productions: [], expenses: [], totals: {} };

export default function Reports() {
  const [year, setYear] = useState('2026');
  const [fieldId, setFieldId] = useState('');
  const [fields, setFields] = useState([]);
  const [report, setReport] = useState(emptyReport);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  const loadReport = useCallback(async (selectedYear = year, selectedField = fieldId) => {
    setLoading(true);
    setMessage(null);
    try {
      const res = await api.get('/reports', { params: { year: selectedYear || undefined, fieldId: selectedField || undefined } });
      setReport(res.data);
    } catch (err) {
      setReport(emptyReport);
      setMessage({ type: 'error', text: err.response?.data?.message || 'Izveštaj nije moguće učitati.' });
    } finally {
      setLoading(false);
    }
  }, [year, fieldId]);

  useEffect(() => {
    api.get('/fields').then(res => setFields(res.data)).catch(() => setFields([]));
    loadReport('2026', '');
  }, []); // početno učitavanje

  const formatNumber = value => new Intl.NumberFormat('sr-RS').format(Number(value || 0));

  return (
    <div className="p-6 reports-page">
      <div className="page-heading"><span className="section-label">Analitika gazdinstva</span><h2>Izveštaji</h2><p>Pregledajte rezultate proizvodnje pšenice i strukturu troškova.</p></div>

      <Card title="Filter izveštaja" className="mb-4 report-filter">
        <div className="report-filter-grid">
          <Input label="Godina" type="number" min="2000" max="2100" value={year} onChange={e => setYear(e.target.value)} />
          <div className="input-group">
            <label htmlFor="reportField">Parcela</label>
            <select id="reportField" value={fieldId} onChange={e => setFieldId(e.target.value)}>
              <option value="">Sve parcele</option>
              {fields.map(field => <option key={field.id} value={field.id}>{field.name} — {field.location || 'bez lokacije'}</option>)}
            </select>
          </div>
        </div>
        <Button onClick={() => loadReport()}>Primeni filter</Button>
      </Card>

      {message && <div className={`form-message ${message.type}`}>{message.text}</div>}
      {loading ? <div className="report-loading">Učitavanje izveštaja...</div> : (
        <>
          <div className="report-summary">
            <article><span>Ukupno seme</span><strong>{formatNumber(report.totals?.totalSeed)} kg</strong></article>
            <article><span>Ukupan prinos</span><strong>{formatNumber(report.totals?.totalYield)} kg</strong></article>
            <article><span>Ukupni troškovi</span><strong>{formatNumber(report.totals?.totalExpenses)} RSD</strong></article>
          </div>
          <ReportCharts report={report} />
        </>
      )}
    </div>
  );
}
