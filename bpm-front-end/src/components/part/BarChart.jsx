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

const ProductPerformance = ({
  labels,
  sourceData,
  maxHeight = "100%",
  role = null,
}) => {
  // Pastikan sourceData berbentuk array
  const dataArray = Array.isArray(sourceData) ? sourceData : [];

  // Pisahkan label panjang menjadi dua baris dengan "\n"
  const formatLabel = (label) => {
    const words = label.split(" ");
    if (words.length > 3) {
      const mid = Math.ceil(words.length / 2);
      return words.slice(0, mid).join(" ") + "\n" + words.slice(mid).join(" ");
    }
    return label;
  };

  const labelss = dataArray.map((item) => formatLabel(item.namaLabel));

  console.log("Source Data :", sourceData);
  console.log("Labellss :", labelss);

  // Ambil nilai tertinggi dari dataset
  const allValues = dataArray.flatMap((item) =>
    role === "ROL01"
      ? [
          item.totalSurvei,
          item.totalStatusSudahTerjawab,
          item.totalStatusBelumTerjawab,
        ]
      : [item.totalStatusSudahTerjawab]
  );

  const maxValue = Math.max(...allValues, 0); // Ambil nilai tertinggi
  const yMax = maxValue > 0 ? maxValue + 5 : 10; // Jika maxValue > 0, tambahkan 5, jika tidak, set default 10

  // Data chart sesuai dengan role
  const productPerformanceData = {
    labels: labelss,
    datasets:
      role === "ROL01"
        ? [
            {
              label: "Total Responden",
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
          ]
        : [
            {
              label: "Sudah Terjawab",
              data: dataArray.map((item) => item.totalStatusSudahTerjawab),
              backgroundColor: "rgba(10, 57, 129, 1)",
            },
          ],
  };

  // Opsi chart
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
      },
    },
    scales: {
      x: {
        ticks: {
          autoSkip: false,
          maxRotation: 0,
          minRotation: 0,
          font: {
            size: 12,
          },
          callback: function (value) {
            return this.getLabelForValue(value).split("\n");
          },
        },
      },
      y: {
        beginAtZero: true,
        suggestedMax: yMax, // Set nilai maksimum Y
        ticks: {
          stepSize: 1, // Paksa Y agar hanya bilangan bulat
          callback: function (value) {
            return Number.isInteger(value) ? value : null; // Hanya tampilkan bilangan bulat
          },
        },
      },
    },
  };

  return (
    <div
      className="bg-white mt-2 mb-2 p-5 bg-light border rounded"
      style={{ maxHeight: maxHeight, width: "100%", overflowX: "auto" }}
    >
      <h2 className="text-center">{labels}</h2>
      {/* Wrapper untuk scroll */}
      <div
        style={{
          width: "100%",
          overflowX: "auto",
          whiteSpace: "nowrap",
        }}
      >
        {/* Chart container */}
        <div
          style={{
            minWidth:
              labelss.length > 4 ? `${labelss.length * 150}px` : "800px",
            height: "400px",
          }}
        >
          <Bar data={productPerformanceData} options={options} />
        </div>
      </div>
    </div>
  );
};

export default ProductPerformance;
