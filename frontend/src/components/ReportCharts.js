import React from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement,
  Title, Tooltip, Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

export default function ReportCharts({ report }) {
  const productionData = {
    labels: report.productions.map(item => `Proizvodnja #${item.id}`),
    datasets: [
      { label: 'Seme (kg)', data: report.productions.map(item => Number(item.seedQuantity || 0)), backgroundColor: '#c7dd73' },
      { label: 'Prinos (kg)', data: report.productions.map(item => Number(item.yieldKg || 0)), backgroundColor: '#3f7d5e' }
    ]
  };

  const expensesByType = report.expenses.reduce((result, item) => {
    const type = item.type || 'Ostalo';
    result[type] = (result[type] || 0) + Number(item.amount || 0);
    return result;
  }, {});

  const expenseData = {
    labels: Object.keys(expensesByType),
    datasets: [{
      data: Object.values(expensesByType),
      backgroundColor: ['#173f32', '#3f7d5e', '#c7dd73', '#e3a857', '#8ca7a0', '#6f8268', '#d27963'],
      borderColor: '#fffef9',
      borderWidth: 3
    }]
  };

  const seasonData = {
    labels: (report.seasonComparison || []).map(item => item.year),
    datasets: [
      { label: 'Prihod (RSD)', data: (report.seasonComparison || []).map(item => item.revenue), backgroundColor: '#3f7d5e' },
      { label: 'Troškovi (RSD)', data: (report.seasonComparison || []).map(item => item.expenses), backgroundColor: '#e3a857' },
      { label: 'Dobit (RSD)', data: (report.seasonComparison || []).map(item => item.profit), backgroundColor: '#c7dd73' }
    ]
  };

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom' } }
  };

  return (
    <div className="report-charts">
      <CardChart title="Seme i prinos po proizvodnji">
        {report.productions.length ? <Bar data={productionData} options={commonOptions} /> : <p>Nema podataka za grafikon proizvodnje.</p>}
      </CardChart>
      <CardChart title="Raspodela troškova po tipu">
        {report.expenses.length ? <Doughnut data={expenseData} options={commonOptions} /> : <p>Nema podataka za grafikon troškova.</p>}
      </CardChart>
      <CardChart title="Poređenje sezona">
        {(report.seasonComparison || []).length ? <Bar data={seasonData} options={commonOptions} /> : <p>Nema podataka za poređenje sezona.</p>}
      </CardChart>
    </div>
  );
}

function CardChart({ title, children }) {
  return <div className="report-chart"><h3>{title}</h3><div className="report-chart-canvas">{children}</div></div>;
}
