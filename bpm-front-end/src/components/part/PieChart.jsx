import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import "bootstrap/dist/css/bootstrap.min.css";

ChartJS.register(ArcElement, Tooltip, Legend);

// Data order status
const orderStatusData = [
  { name: "Pending", value: 30 },
  { name: "Processing", value: 45 },
  { name: "Shipped", value: 60 },
  { name: "Delivered", value: 120 },
];

// Warna-warna untuk pie chart
const COLORS = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#FED766"];

// Konversi data ke format Chart.js
const pieChartData = {
  labels: orderStatusData.map((item) => item.name),
  datasets: [
    {
      data: orderStatusData.map((item) => item.value),
      backgroundColor: COLORS,
      borderColor: COLORS.map((color) => color.replace("1)", "0.8)")),
      borderWidth: 1,
    },
  ],
};

// Konfigurasi chart
const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "bottom",
      labels: {
        color: "#E5E7EB",
      },
    },
    tooltip: {
      callbacks: {
        label: (tooltipItem) => {
          let total = orderStatusData.reduce(
            (sum, item) => sum + item.value,
            0
          );
          let value = tooltipItem.raw;
          let percentage = ((value / total) * 100).toFixed(1);
          return `${tooltipItem.label}: ${value} (${percentage}%)`;
        },
      },
    },
  },
};

const PieChart = () => {
  return (
    <div
      className="bg-white mt-2 mb-5 p-5 bg-light border rounded d-flex flex-column justify-content-center align-items-center"
      style={{ maxHeight: "25rem" }}
    >
      <h2 className="text-center mb-3">Order Status Distribution</h2>
      <Pie data={pieChartData} options={options} />
    </div>
  );
};

export default PieChart;
