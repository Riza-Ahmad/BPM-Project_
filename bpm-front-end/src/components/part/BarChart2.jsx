import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "bootstrap/dist/css/bootstrap.min.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Warna-warna untuk bar chart
const COLORS = ["#6366F1", "#8B5CF6", "#EC4899", "#10B981", "#F59E0B"];

// Data sales channel
const SALES_CHANNEL_DATA = [
  { name: "Website", value: 45600 },
  { name: "Mobile App", value: 38200 },
  { name: "Marketplace", value: 29800 },
  { name: "Social Media", value: 18700 },
];

// Konfigurasi data untuk Chart.js
const salesChartData = {
  labels: SALES_CHANNEL_DATA.map((item) => item.name),
  datasets: [
    {
      label: "Sales",
      data: SALES_CHANNEL_DATA.map((item) => item.value),
      backgroundColor: COLORS,
      borderColor: COLORS.map((color) => color.replace("1)", "0.8)")), // Sedikit lebih gelap
      borderWidth: 1,
    },
  ],
};

// Konfigurasi chart
const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
      labels: {
        color: "#E5E7EB",
      },
    },
    title: {
      display: true,
      text: "Sales by Channel",
      color: "#E5E7EB",
    },
  },
  scales: {
    x: {
      ticks: { color: "#E5E7EB" },
      grid: { color: "rgba(255, 255, 255, 0.1)" },
    },
    y: {
      ticks: { color: "#E5E7EB" },
      grid: { color: "rgba(255, 255, 255, 0.1)" },
    },
  },
};

const BarChart2 = () => {
  return (
    <div className="bg-dark bg-opacity-75 shadow-lg rounded p-4 border border-secondary">
      <h2 className="text-center text-light mb-3">Sales by Channel</h2>
      <div className="p-3 bg-light rounded">
        <Bar data={salesChartData} options={options} />
      </div>
    </div>
  );
};

export default BarChart2;
