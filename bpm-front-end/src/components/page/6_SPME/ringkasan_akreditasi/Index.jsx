import React, { useState, useEffect } from "react";
import { useFetch } from "../../util/useFetch";
import { API_LINK } from "../../util/Constants";
import Loading from "../../part/Loading";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from "chart.js";
import Cookies from "js-cookie";
import { useIsMobile } from "../../util/useIsMobile";
import { useNavigate } from "react-router-dom";

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const Akreditasi = () => {
  const [dataInstitusi, setDataInstitusi] = useState({});
  const [dataProdi, setDataProdi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check login state
    const activeUser = Cookies.get("activeUser");

    if (activeUser) {
      const parsedUser = JSON.parse(activeUser);
      if (parsedUser.RoleID.trim() === "ROL01") {
        setIsAdmin(true);
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(true);
      }
    } else {
      setIsLoggedIn(false);
    }

    // Fetch data from API
    const fetchData = async () => {
      try {
        const result = await useFetch(
          `${API_LINK}/MasterTentang/GetDataTentang`, // Replace with the correct endpoint
          JSON.stringify({}),
          "POST"
        );

        if (result.code === 200) {
          setDataInstitusi(result.data.institusi || {});
          setDataProdi(result.data.prodi || []);
        } else {
          throw new Error(result.message || "Gagal mengambil data.");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Gagal mengambil data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <Loading />;
  if (error) return <p>{error}</p>;

  // Group program studi by accreditation
  const groupedProdiData = dataProdi.reduce((acc, item) => {
    const key = item.akreditasi; // Example: "A", "B", "C"
    if (!acc[key]) acc[key] = [];
    acc[key].push(item.nama_prodi);
    return acc;
  }, {});

  // Bar Chart data
  const barChartData = {
    labels: Object.keys(groupedProdiData), // "A", "B", "C", etc.
    datasets: [
      {
        label: "Jumlah Program Studi",
        data: Object.values(groupedProdiData).map((prodi) => prodi.length), // Count of programs in each accreditation
        backgroundColor: ["#2654A1", "#4CAF50", "#FFC107"], // Different colors for each category
        borderColor: "#000",
        borderWidth: 1,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            const label = tooltipItem.label || "";
            const prodiList = groupedProdiData[label] || [];
            return [`Jumlah: ${prodiList.length}`, ...prodiList];
          },
        },
      },
      legend: {
        display: true,
        position: "top",
      },
    },
  };

  return (
    <div>
      {/* Akreditasi Institusi */}
      <h1>Data Akreditasi Institusi</h1>
      <p>
        Politeknik Astra Memperoleh Predikat{" "}
        <strong>{dataInstitusi.akr_peringkat || "Tidak Tersedia"}</strong>
      </p>
      <p>
        Berdasarkan Surat Keputusan Direktur: {dataInstitusi.akr_no_SK || "Tidak Tersedia"}, Tahun:{" "}
        {dataInstitusi.akr_tahun_SK || "Tidak Tersedia"}
      </p>

      {/* Grafik Akreditasi Program Studi */}
      <h2>Grafik Akreditasi Program Studi</h2>
      <Bar data={barChartData} options={barChartOptions} />
    </div>
  );
};

export default Akreditasi;
