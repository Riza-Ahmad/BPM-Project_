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
  const totalValue = sourceData.reduce((sum, item) => sum + item.value, 0);

  // Filter sourceData untuk menghilangkan yang nilai 0
  const filteredData = sourceData.filter((item) => item.value > 0);

  const pieChartData = {
    labels: filteredData.map((item) => item.label),
    datasets: [
      {
        data: filteredData.map((item) => item.value),
        backgroundColor: COLORS.slice(0, filteredData.length),
        borderColor: COLORS.slice(0, filteredData.length),
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
