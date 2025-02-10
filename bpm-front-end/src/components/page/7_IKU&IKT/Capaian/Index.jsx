import React, { useState, useEffect } from "react";
import { useFetch } from "../../../util/useFetch";
import { API_LINK } from "../../../util/Constants";
import { useIsMobile } from "../../../util/useIsMobile";
import Loading from "../../../part/Loading";
import { Bar } from "react-chartjs-2";
import Text from "../../../part/Text";
import HeaderText from "../../../part/HeaderText";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function Index({ onChangePage }) {
  const isMobile = useIsMobile();
  const currentYear = new Date().getFullYear();
  const [tahun, setTahun] = useState(String(currentYear));
  const [standarUtama, setStandarUtama] = useState([]);
  const [selectedStandar, setSelectedStandar] = useState(null);
  const [dataIKU, setDataIKU] = useState([]);
  const [dataIKT, setDataIKT] = useState([]);
  const [selectedIKU, setSelectedIKU] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalIKU, setTotalIKU] = useState(0);
  const [totalIKTByStandarUtama, setTotalIKTByStandarUtama] = useState(0);

  const years = Array.from(
    { length: currentYear - 1995 + 1 },
    (_, i) => 1995 + i
  );
  const title1 = "Capaian Aktual IKU dan IKT Politeknik Astra";
  const optionIndikatorKinerja = {
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: "Kategori Standar",
          font: { size: 16, weight: "bold" },
        },
        ticks: {
          font: { size: 14 },
        },
      },
      y: {
        title: {
          display: true,
          text: "Jumlah Capaian",
          font: { size: 16, weight: "bold" },
        },
        ticks: {
          font: { size: 14 },
          stepSize: 1,
        },
      },
    },
  };

  useEffect(() => {
    const fetchStandarUtama = async () => {
      setLoading(true);
      try {
        const response = await useFetch(
          `${API_LINK}/MasterIndikatorKinerja/GetDataStandarbyTahun`,
          { p1: tahun },
          "POST"
        );
        setStandarUtama(response || []);
      } catch (err) {
        setError("Error fetching standar utama");
      }
      setLoading(false);
    };
    fetchStandarUtama();
  }, [tahun]);

  useEffect(() => {
    if (!selectedStandar) return;
    const fetchIkuData = async () => {
      if (selectedStandar) {
        setLoading(true);
        try {
          const responseIKU = await useFetch(
            `${API_LINK}/MasterIndikatorKinerja/GetDataIKU`,
            { p1: tahun, p2: selectedStandar },
            "POST"
          );
          setDataIKU(responseIKU || []);
          setTotalIKU(
            responseIKU.reduce((sum, item) => sum + item.totalIKU, 0)
          );
        } catch (err) {
          setError("Error fetching IKU data");
        }
        setLoading(false);
      }
    };
    fetchIkuData();
  }, [selectedStandar, tahun]);

  useEffect(() => {
    if (!selectedStandar || !tahun) return;
    const fetchTotalIKTByStandarUtama = async () => {
      try {
        const response = await useFetch(
          `${API_LINK}/MasterIndikatorKinerja/GetDataIKTbyDataIKU`,
          { p1: selectedStandar, p2: tahun },
          "POST"
        );
        setTotalIKTByStandarUtama(response?.[0]?.totalIKTByStandarUtama || 0);
      } catch (err) {
        setError("Failed to fetch IKT data.");
      }
      setLoading(false);
    };
    fetchTotalIKTByStandarUtama();
  }, [selectedStandar, tahun]);

  useEffect(() => {
    if (!selectedIKU) return;
    const fetchDataIKT = async () => {
      try {
        const responseIKT = await useFetch(
          `${API_LINK}/MasterIndikatorKinerja/GetDataIKT`,
          { p1: selectedStandar, p2: selectedIKU, p3: tahun },
          "POST"
        );
        setDataIKT(responseIKT || []);
      } catch (err) {
        setError("Failed to fetch IKT data.");
      }
      setLoading(false);
    };
    fetchDataIKT();
  }, [selectedIKU, selectedStandar, tahun]);

  const handleYearSelection = (year) => {
    setTahun(year);
    setSelectedStandar(null);
    setSelectedIKU(null);
    setDataIKU([]);
    setDataIKT([]);
    setTotalIKU(0);
    setTotalIKTByStandarUtama(0);
  };
  const handleSelectStandar = (id) => {
    setSelectedStandar(id);
    setSelectedIKU(null);
  };

  const handleIKUSelection = (id) => {
    setSelectedIKU(id);
  };

  const generateChartData = (data, labelKey) => {
    return {
      labels: data.map((item) => item[labelKey]),
      datasets: [
        {
          label: "Kesesuaian Melampaui",
          data: data.map((item) => item.jumlahKesesuaianMelampaui),
          backgroundColor: "#002147",
        },
        {
          label: "Kesesuaian Memenuhi",
          data: data.map((item) => item.jumlahKesesuaianMemenuhi),
          backgroundColor: "#00509E",
        },
        {
          label: "Ketidaksesuaian Observasi",
          data: data.map((item) => item.jumlahKetidaksesuaianObservasi),
          backgroundColor: "#0074D9",
        },
        {
          label: "Ketidaksesuaian Minor",
          data: data.map((item) => item.jumlahKetidaksesuaianMinor),
          backgroundColor: "#66A3D2",
        },
        {
          label: "Ketidaksesuaian Major",
          data: data.map((item) => item.jumlahKetidaksesuaianMajor),
          backgroundColor: "#A3CBE6",
        },
      ],
    };
  };
  const filteredData = dataIKU.filter(
    (item) => item.idStandarUtama === selectedStandar
  );
  if (loading) return <Loading />;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <>
      <div className="d-flex flex-column min-vh-100">
        <main className="flex-grow-1 p-3" style={{ marginTop: "60px" }}>
          <div className="container">
            <div className="d-flex justify-content-center align-items-center text-center">
              <h1 style={{ color: "#2654A1", margin: "0", fontWeight: "700" }}>
                {title1}
              </h1>
            </div>
            <div className="p-4">
              <div
                className="shadow bg-white rounded"
                style={{
                  padding: isMobile ? "2rem" : "2rem", // Padding lebih kecil di mobile
                  margin: isMobile ? "2rem" : "2rem", // Margin lebih kecil di mobile
                }}
              >
                <div className="row mt-3">
                  <div className="col-lg-4">
                    <HeaderText
                      label="Tahun Pelaksanaan:"
                      alignText="justify"
                      warna="#2654A1"
                      fontWeight="650"
                      ukuran="2rem"
                    />
                  </div>

                  <div className="col-lg-8">
                    <div className="mb-4">
                      <select
                        onChange={(e) => handleYearSelection(e.target.value)}
                        value={tahun}
                        className="p-2 border rounded"
                        style={{
                          width: "100%",
                          padding: "200px",
                          fontSize: "30px",
                          color: "#2654A1",
                          borderradius: "8px",
                          boxsizing: "border-box",
                          maxHeight: "200px",
                          overflowY: "auto",
                        }}
                      >
                        {years.map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {standarUtama.length > 0 ? (
                  <div
                    className="btn-container bg-white-100 p-4 rounded-md w-full flex flex-wrap gap-4 justify-start"
                    style={{ overflowX: "auto" }}
                  >
                    {standarUtama.map((item) => (
                      <button
                        key={item.idStandarUtama}
                        onClick={() => handleSelectStandar(item.idStandarUtama)}
                        className={`btn ${
                          selectedStandar === item.idStandarUtama
                            ? "btn-primary"
                            : "btn-light"
                        } mb-2`}
                      >
                        {item.judulStandarUtama}
                      </button>
                    ))}
                  </div>
                ) : (
                  <Text
                    isi="Tidak tersedia data IKU dan IKT pada tahun yang dipilih!"
                    alignText="center"
                    ukuran="14px"
                    warna="#2654A1"
                  />
                )}
              </div>

              {selectedStandar && (
                <div className="mb-4">
                  <div
                    className="shadow bg-white rounded"
                    style={{
                      padding: isMobile ? "2rem" : "2rem",
                      margin: isMobile ? "2rem" : "2rem",
                    }}
                  >
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "1rem",
                      }}
                    >
                      <div
                        style={{
                          backgroundColor: "#0071BC",
                          borderRadius: "10px",
                          padding: "1rem",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <div>
                          <HeaderText
                            label="Total IKU"
                            alignText="center"
                            warna="#ffffff"
                            fontWeight="650"
                            ukuran="2rem"
                          />
                          <Text
                            isi={`${totalIKU}`}
                            alignText="center"
                            ukuran="40px"
                            warna="#ffffff"
                          />
                        </div>
                      </div>
                      <div
                        style={{
                          backgroundColor: "#0047AB",
                          borderRadius: "10px",
                          padding: "1rem",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <div>
                          <HeaderText
                            label="Total IKT"
                            alignText="center"
                            warna="#ffffff"
                            fontWeight="650"
                            ukuran="2rem"
                          />
                          <Text
                            isi={`${totalIKTByStandarUtama}`}
                            alignText="center"
                            ukuran="40px"
                            warna="#ffffff"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className="shadow bg-white rounded"
                    style={{
                      padding: isMobile ? "2rem" : "2rem", // Padding lebih kecil di mobile
                      margin: isMobile ? "2rem" : "2rem", // Margin lebih kecil di mobile
                    }}
                  >
                    <div className="mt-5">
                      <HeaderText
                        label="IKU (Indikator Kinerja Utama)"
                        alignText="center"
                        warna="#2654A1"
                        fontWeight="650"
                        ukuran="2rem"
                      />
                      {standarUtama.length > 0 ? (
                        <div
                          style={{
                            width: "90%",
                            height: "500px",
                            margin: "0 auto",
                          }}
                        >
                          <div
                            style={{
                              overflowX: "auto",
                              whiteSpace: "nowrap",
                              maxWidth: "100%",
                            }}
                          >
                            <div style={{ minWidth: "900px" }}>
                              <Bar
                                data={generateChartData(
                                  filteredData,
                                  "judulStandarIKU"
                                )}
                                options={optionIndikatorKinerja}
                              />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <Text
                          isi="Tidak tersedia data IKU yang dipilih!"
                          alignText="center"
                          ukuran="14px"
                          warna="#2654A1"
                        />
                      )}
                    </div>
                  </div>

                  <div
                    className="shadow bg-white rounded"
                    style={{
                      padding: isMobile ? "2rem" : "2rem", // Padding lebih kecil di mobile
                      margin: isMobile ? "2rem" : "2rem", // Margin lebih kecil di mobile
                    }}
                  >
                    <div className="row mt-5">
                      <div className="col-lg-2">
                        <div
                          className="row px-2"
                          style={{ overflow: "auto", maxHeight: "500px" }}
                        >
                          {Array.from(
                            new Set(
                              filteredData.map((item) => item.idStandarIKU)
                            )
                          ).map((id) => (
                            <button
                              key={id}
                              onClick={() => handleIKUSelection(id)}
                              className={`btn ${
                                selectedIKU === id ? "btn-primary" : "btn-light"
                              } w-100 mb-2`}
                            >
                              {
                                filteredData.find(
                                  (item) => item.idStandarIKU === id
                                )?.judulStandarIKU
                              }
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="col-lg-10">
                        <HeaderText
                          label="IKT (Indikator Kinerja Tambahan)"
                          alignText="center"
                          warna="#2654A1"
                          fontWeight="650"
                          ukuran="2rem"
                        />
                        {!selectedIKU ? (
                          <div className="mb-4">
                            <Text
                              isi="Pilih standar IKU yang akan ditampilkan!"
                              alignText="center"
                              ukuran="14px"
                              warna="#2654A1"
                            />
                          </div>
                        ) : !dataIKT || dataIKT.length === 0 ? (
                          <Text
                            isi="Tidak tersedia data IKT yang dipilih!"
                            alignText="center"
                            ukuran="14px"
                            warna="#2654A1"
                          />
                        ) : (
                          <div
                            style={{
                              width: "90%",
                              height: "500px",
                              margin: "0 auto",
                            }}
                          >
                            <div
                              style={{
                                overflowX: "auto",
                                whiteSpace: "nowrap",
                                maxWidth: "100%",
                              }}
                            >
                              <div style={{ minWidth: "900px" }}>
                                <Bar
                                  data={generateChartData(
                                    dataIKT,
                                    "judulStandarIKT"
                                  )}
                                  options={optionIndikatorKinerja}
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
