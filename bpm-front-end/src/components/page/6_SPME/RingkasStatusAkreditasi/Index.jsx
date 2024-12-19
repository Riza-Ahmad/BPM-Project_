import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";

export default function Akreditasi() {
  const [institusiData, setInstitusiData] = useState({});
  const [prodiData, setProdiData] = useState([]);

  useEffect(() => {
    const dataInstitusi = {
      akr_peringkat: "A",
      akr_no_SK: "SK12345",
      akr_tahun_SK: "2023",
    };

    const dataProdi = [
      { akr_id: 1, akr_peringkat: "B", prodi: "Pembuatan Peralatan & Perkakas Produksi (P3P)" },
      { akr_id: 2, akr_peringkat: "Unggul", prodi: "Teknik Produksi & Proses Manufaktur (TPM)" },
      { akr_id: 3, akr_peringkat: "Unggul", prodi: "Manajemen Informatika (MIN)" },
      { akr_id: 4, akr_peringkat: "B", prodi: "Mesin Otomotif (MOT)" },
      { akr_id: 5, akr_peringkat: "Baik", prodi: "Mekatronika (MEK)" },
      { akr_id: 6, akr_peringkat: "Baik", prodi: "Teknologi Konstruksi Bangunan Gedung (TKB)" },
      { akr_id: 7, akr_peringkat: "A", prodi: "Teknologi Rekayasa Pemeliharaan Alat Berat (TAB)" },
      { akr_id: 8, akr_peringkat: "B", prodi: "Teknologi Rekayasa Logistik (TRL)" },
      { akr_id: 9, akr_peringkat: "Tidak Terakreditasi", prodi: "Teknologi Rekayasa Perangkat Lunak (RPL)" },
    ];
    setInstitusiData(dataInstitusi);
    setProdiData(dataProdi);
  }, []);

  const labels = ["A", "B", "C", "Unggul", "Baik Sekali", "Baik", "Tidak Terakreditasi"];

  const getProdiByPredikat = (predikat) => {
    return prodiData.filter((item) => item.akr_peringkat === predikat).map((item) => item.prodi);
  };

  const chartData = {
    labels,
    datasets: [
      {
        label: "Jumlah Program Studi",
        data: labels.map((label) => getProdiByPredikat(label).length),
        backgroundColor: "#003366",
      },
    ],
  };

  const chartOptions = {
    plugins: {
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            const predikat = tooltipItem.label;
            const prodiList = getProdiByPredikat(predikat);
            const jumlah = prodiList.length;

            return [`Jumlah Program Studi: ${jumlah}`, ...prodiList.map((prodi) => `- ${prodi}`)];
          },
        },
      },
      legend: {
        display: true,
        position: "bottom",
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <main className="flex-grow-1 p-3" style={{ marginTop: "80px" }}>
        <div className="d-flex flex-column">
          <h1>Ringkasan Status Akreditasi</h1>
          <p>
            Politeknik Astra Memperoleh Predikat{" "}
            <strong>{institusiData.akr_peringkat || "Tidak Tersedia"}</strong>
          </p>
          <p>
            Berdasarkan Surat Keputusan Direktur: {institusiData.akr_no_SK || "Tidak Tersedia"}, Tahun:{" "}
            {institusiData.akr_tahun_SK || "Tidak Tersedia"}
          </p>
          <h2>Akreditasi Program Studi</h2>
          <div style={{ width: "80%", height: "400px", margin: "0 auto" }}>
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>
      </main>
    </div>
  );
}