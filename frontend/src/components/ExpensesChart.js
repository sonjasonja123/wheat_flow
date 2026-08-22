import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ExpensesChart = ({ expenses }) => {
  // Grupisanje troškova po tipu
  const grouped = expenses.reduce((acc, curr) => {
    const key = curr.type || "Nepoznat";
    acc[key] = (acc[key] || 0) + Number(curr.amount || 0);
    return acc;
  }, {});

  const chartData = {
    labels: Object.keys(grouped),
    datasets: [
      {
        label: "Iznos troškova (RSD)",
        data: Object.values(grouped),
        backgroundColor: "rgba(255, 99, 132, 0.6)"
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Troškovi po tipu" }
    }
  };

  return <Bar data={chartData} options={options} />;
};

export default ExpensesChart;
