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

const ProductPerformance = ({ labels, sourceData }) => {
  // Jika sourceData bukan array, jadikan array kosong sebagai default
  const dataArray = Array.isArray(sourceData) ? sourceData : [];
  // Ambil semua namaLabel sebagai labels
  const labelss = dataArray.map((item) => item.namaLabel);
  console.log("Source Data :", sourceData);
  console.log("Labellss :", labelss);
  // Siapkan dataset berdasarkan data yang diterima
  const productPerformanceData = {
    labels: labelss,
    datasets: [
      {
        label: "Total Survei",
        data: dataArray.map((item) => item.totalSurvei),
        backgroundColor: "rgb(128, 111, 255)",
      },
      {
        label: "Sudah Terjawab",
        data: dataArray.map((item) => item.totalStatusSudahTerjawab),
        backgroundColor: "rgba(10, 57, 129, 1)",
      },
      {
        label: "Belum Terjawab",
        data: dataArray.map((item) => item.totalStatusBelumTerjawab),
        backgroundColor: "rgba(128, 196, 233, 1)",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
      },
    },
  };
  return (
    <div
      className="bg-white mt-2 mb-5 p-5 bg-light border rounded d-flex flex-column justify-content-center align-items-center"
      style={{ maxHeight: "25rem" }}
    >
      <h2 className="text-center">{labels}</h2>
      <Bar data={productPerformanceData} options={options} />
    </div>
  );
};

export default ProductPerformance;
