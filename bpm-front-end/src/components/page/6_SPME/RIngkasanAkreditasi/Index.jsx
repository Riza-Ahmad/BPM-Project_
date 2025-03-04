import React, { useState, useEffect } from "react";
import { useFetch } from "../../../util/useFetch";
import { API_LINK } from "../../../util/Constants";
import Loading from "../../../part/Loading";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import HeaderText from "../../../part/HeaderText";
import Text from "../../../part/Text";
import { useIsMobile } from "../../../util/useIsMobile";
import { useLocation } from "react-router-dom";
import { decodeHtml } from "../../../util/DecodeHtml";
import Button from "../../../part/Button";
import Breadcrumbs from "../../../part/Breadcrumbs";
import Cookies from "js-cookie";

export default function Akreditasi({ onChangePage }) {
  const location = useLocation();
  const idMenu = location.state?.idMenu;
  const activeUser = Cookies.get("activeUser");
  const isMobile = useIsMobile();
  let role = "";
  let roleNama = "";
  let namaPengguna = "";
  if (activeUser) {
    role = JSON.parse(activeUser).RoleID.slice(0, 5);
    roleNama = JSON.parse(activeUser).Role;
    namaPengguna = JSON.parse(activeUser).Nama;
  }
  const [menuData, setMenuData] = useState(null);
  const [prodiData, setProdiData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [breadcrumbs, setBreadcrumbs] = useState([
    { label: "SPME" },
    { label: "Status Akreditasi" },
    { label: "Ringkasan Status Akreditasi" },
  ]);

  useEffect(() => {
    const fetchMenu = async () => {
      setLoading(true);
      const result = await useFetch(
        `${API_LINK}/MasterKategoriDokumen/GetDataKategoriDokumenHeaderByIdMenu`,
        { idKdo: location.state?.idMenu },
        "POST"
      ).finally(() => setLoading(false));

      if (result === "ERROR") {
        setMenuData([]);
      } else {
        const menuArr = Object.values(result);
        setMenuData(menuArr[0]);
      }
    };

    fetchMenu();
  }, [location.state?.idMenu]);

  const normalizePredikat = (predikat) => {
    if (!predikat) return "BELUM TERAKREDITASI";
    const normalized = predikat.trim().toUpperCase();
    switch (normalized) {
      case "A":
        return "A";
      case "B":
        return "B";
      case "C":
        return "C";
      case "UNGGUL":
        return "UNGGUL";
      case "BAIK SEKALI":
        return "BAIK SEKALI";
      case "BAIK":
        return "BAIK";
      default:
        return "BELUM TERAKREDITASI";
    }
  };

  useEffect(() => {
    const fetchAkreditasiData = async () => {
      try {
        const responseProdi = await useFetch(
          `${API_LINK}/MasterAkreditasi/GetAkreditasiProdiForChart`,
          {},
          "POST"
        );
        if (responseProdi && responseProdi.length > 0) {
          setProdiData(responseProdi);
        } else {
          setError(responseProdi.message);
        }
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchAkreditasiData();
  }, []);

  const labels = Array.from(
    new Set(prodiData.map((item) => item.peringkatAkr || "BELUM TERAKREDITASI"))
  );

  const getProdiByPredikat = (predikat) => {
    const normalizedPredikat = normalizePredikat(predikat);
    return prodiData
      .filter(
        (item) => normalizePredikat(item.peringkatAkr) === normalizedPredikat
      )
      .map((item) => item.namaAkr);
  };

  const chartData = {
    labels,
    datasets: [
      {
        label: "Jumlah Program Studi",
        data: labels.map((label) => getProdiByPredikat(label).length),
        backgroundColor: labels.map((_, index) => {
          const colors = [
            "#002147",
            "#00509E",
            "#0074D9",
            "#66A3D2",
            "#A3CBE6",
            "#F0F8FF",
            "#001F3F",
          ];
          return colors[index % colors.length];
        }),
        barThickness: isMobile ? 40 : 150,
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
            return [
              `Jumlah Program Studi: ${jumlah}`,
              ...prodiList.map((prodi) => `- ${prodi}`),
            ];
          },
        },
      },
      legend: {
        display: false,
        position: "top",
        labels: {
          font: {
            size: isMobile ? 8 : 16,
          },
        },
      },
    },
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        categoryPercentage: 0.5,
        barPercentage: 0.5,
        ticks: {
          font: {
            size: isMobile ? 8 : 16,
          },
        },
      },
      y: {
        ticks: {
          beginAtZero: true,
          stepSize: 1,
          font: {
            size: isMobile ? 8 : 16,
          },
        },
      },
    },
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <main
        className="flex-grow-1 p-3 min-vh-100"
        style={{ marginTop: "80px" }}
      >
        <div className="d-flex flex-column mt-1">
          <div className="container mb-3">
            <div className="row">
              <div className="col-sm-10">
                <h1
                  style={{ color: "#2654A1", margin: "0", fontWeight: "700" }}
                >
                  {menuData?.namaKdo
                    ? decodeHtml(menuData.namaKdo)
                    : "Page Title"}
                </h1>
                <Breadcrumbs
                  breadcrumbs={[
                    { label: "SPME" },
                    { label: "Status Akreditasi" },
                    { label: "Ringkasan" },
                  ]}
                />
              </div>
              {role === "ROL01" ? (
                <div className="col-sm-2">
                  <Button
                    classType="btn btn-primary"
                    title="Edit Cover"
                    label="Edit Cover"
                    onClick={() =>
                      onChangePage("editKonten", {
                        breadcrumbs: breadcrumbs,
                        idData: menuData.idKdo,
                        idMenu: idMenu,
                      })
                    }
                  />
                </div>
              ) : (
                ""
              )}
            </div>
            <div className="rounded-4 shadow bg-primary bg-gradient text-white mt-4 mb-5">
              <div className="p-4 mx-2">
                <Text
                  warna="white"
                  isi={menuData.deskripsiKdo}
                  ukuran="1.2rem"
                />
              </div>
            </div>
            <div className="rounded-4 shadow mt-5">
              <div className="p-4 mx-2">
                <HeaderText
                  label="Program Studi yang Terakreditasi"
                  alignText="left"
                  warna="#2654A1b"
                  fontWeight="650"
                  ukuran={isMobile ? "1.5rem" : "2rem"}
                />
                <div style={{ overflowX: "auto", width: "100%" }}>
                  <Bar
                    style={{ minHeight: "40vh", minWidth: "100%" }}
                    data={chartData}
                    options={chartOptions}
                  />
                </div>
              </div>
            </div>
            <div className="mt-5">
              <p className="fs-6 fw-100 fst-italic">
                * Dokumen SK dan Sertifikat Akreditasi dapat diunduh pada menu
                SPME / Dokumen SPME
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
