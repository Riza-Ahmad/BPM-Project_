import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import "bootstrap/dist/css/bootstrap.min.css";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

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

const PieChart = ({ judul, sourceData }) => {
  // Menyaring data yang memiliki nilai lebih dari 0 untuk chart
  const filteredData = sourceData.filter((item) => item.value > 0);
  const totalValue = filteredData.reduce((sum, item) => sum + item.value, 0);

  console.log("Filtered Data:", filteredData);

  const pieChartData = {
    labels: sourceData.map((item) => item.label), // Semua label, termasuk yang memiliki value 0
    datasets: [
      {
        data: sourceData.map((item) => (item.value > 0 ? item.value : null)), // Null untuk data yang 0
        backgroundColor: COLORS.slice(0, sourceData.length),
        borderColor: COLORS.slice(0, sourceData.length),
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#BBBBB",
        },
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            let value = tooltipItem.raw;
            let percentage = ((value / totalValue) * 100).toFixed(1);
            return `${tooltipItem.label}: ${value} (${percentage}%)`;
          },
        },
      },
      datalabels: {
        color: "#fff",
        anchor: "end",
        align: "start",
        formatter: (value) => {
          if (value === 0) return ""; // Tidak tampilkan label datanya jika nilai 0
          let percentage = ((value / totalValue) * 100).toFixed(1);
          return `${percentage}%`;
        },
        font: {
          weight: "bold",
        },
      },
    },
  };

  return (
    <div
      className="bg-white mt-2 mb-5 p-5 bg-light border rounded d-flex flex-column justify-content-center align-items-center"
      style={{ maxHeight: "25rem" }}
    >
      <h2 className="text-center text-black mb-3">{judul}</h2>
      <Pie data={pieChartData} options={options} />
    </div>
  );
};

export default PieChart;
