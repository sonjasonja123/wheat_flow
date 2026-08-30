import React, { useCallback, useEffect, useState } from 'react';
import { api } from '../services/api';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import ReportCharts from '../components/ReportCharts';

const emptyReport = { productions: [], expenses: [], totals: {}, seasonComparison: [] };

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

  const exportExcel = () => {
    const rows = [
      ['Parcela', 'Datum setve', 'Prinos kg', 'Cena RSD/kg', 'Prihod RSD'],
      ...report.productions.map(item => [
        item.Field?.name || `#${item.fieldId}`,
        item.sowingDate ? String(item.sowingDate).slice(0, 10) : '',
        Number(item.yieldKg || 0),
        Number(item.salePricePerKg || 0),
        Number(item.yieldKg || 0) * Number(item.salePricePerKg || 0)
      ])
    ];
    const html = `<table>${rows.map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`).join('')}</table>`;
    const url = URL.createObjectURL(new Blob([html], { type: 'application/vnd.ms-excel' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `wheat-flow-izvestaj-${year || 'sve-sezone'}.xls`;
    link.click();
    URL.revokeObjectURL(url);
  };

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
        <Button onClick={exportExcel} style={{ marginLeft: 10 }}>Izvezi Excel</Button>
        <Button onClick={() => window.print()} style={{ marginLeft: 10 }}>Sačuvaj kao PDF</Button>
      </Card>

      {message && <div className={`form-message ${message.type}`}>{message.text}</div>}
      {loading ? <div className="report-loading">Učitavanje izveštaja...</div> : (
        <>
          <div className="report-summary">
            <article><span>Ukupno seme</span><strong>{formatNumber(report.totals?.totalSeed)} kg</strong></article>
            <article><span>Ukupan prinos</span><strong>{formatNumber(report.totals?.totalYield)} kg</strong></article>
            <article><span>Ukupni troškovi</span><strong>{formatNumber(report.totals?.totalExpenses)} RSD</strong></article>
            <article><span>Prihod</span><strong>{formatNumber(report.totals?.totalRevenue)} RSD</strong></article>
            <article><span>Dobit / gubitak</span><strong>{formatNumber(report.totals?.profitability)} RSD</strong></article>
          </div>
          <ReportCharts report={report} />
        </>
      )}
    </div>
  );
}
