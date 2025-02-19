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
const COLORS = [
  "#FFB84C",
  "#637A9F",
  "#D6589F",
  "#FC4100",
  "#FF6B6B",
  "#4ECDC4",
  "#FED766",
  "#000957",
  "#B771E5",
  "#6EC207",
];

// Data sales channel
const SALES_CHANNEL_DATA = [
  { name: "Website", value: 45600 },
  { name: "Mobile App", value: 38200 },
  { name: "Marketplace", value: 29800 },
  { name: "Social Media", value: 18700 },
];

const BarChart2 = ({ judul, sourceData }) => {
  // Konfigurasi data untuk Chart.js
  const validData = Array.isArray(sourceData) ? sourceData : [];

  // Konfigurasi data untuk Chart.js
  const salesChartData = {
    labels: validData.map((item) => item.label),
    datasets: [
      {
        label: "Data " + judul,
        data: validData.map((item) => item.value),
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
          color: "#000000",
        },
      },
      title: {
        display: true,
        color: "#FFFFFF",
      },
    },
    scales: {
      x: {
        ticks: { color: "#000000" },
        grid: { color: "#F6DEDE" },
      },
      y: {
        ticks: { color: "#000000" },
        grid: { color: "#F6DEDE" },
      },
    },
  };
  return (
    <div
      className="bg-white mt-2 mb-2 p-5 bg-light border rounded d-flex flex-column justify-content-center align-items-center"
      style={{ maxHeight: "25rem" }}
    >
      <h2 className="text-center text-black mb-3">{judul}</h2>
      <Bar data={salesChartData} options={options} />
    </div>
  );
};

export default BarChart2;
