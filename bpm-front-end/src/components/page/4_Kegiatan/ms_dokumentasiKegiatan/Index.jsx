import React, { useEffect, useState } from "react";
import TabTahunKegiatan from "./TabTahunKegiatan"; // Import TabTahunKegiatan
import HeaderText from "../../../part/HeaderText";
import Button from "../../../part/Button";
import { API_LINK } from "../../../util/Constants";
import { useIsMobile } from "../../../util/useIsMobile";
import { useLocation } from "react-router-dom";
import { useFetch } from "../../../util/useFetch";
import { decodeHtml } from "../../../util/DecodeHtml";

export default function Index({ onChangePage }) {
  const [groupedEvents, setGroupedEvents] = useState({});
  const [loading, setLoading] = useState(true);
  const [jenisKegiatan, setJenisKegiatan] = useState([]);
  const [selectedJenisKegiatan, setSelectedJenisKegiatan] = useState(null);
  const isMobile = useIsMobile();
  const location = useLocation();

  useEffect(() => {
    if (!location.state?.idData) return;
    console.log("state", location.state?.idData);
  }, [location.state?.idData]);

  useEffect(() => {
    const fetchJenisKegiatan = async () => {
      try {
        const data = await useFetch(
          `${API_LINK}/MasterKegiatan/GetDataJenisKegiatan`,
          JSON.stringify({}),
          "POST"
        );
        const formattedData = data.map((item) => ({
          Value: item.idJenisKegiatan,
          Text: item.namaJenisKegiatan,
        }));

        setJenisKegiatan(formattedData);
        setSelectedJenisKegiatan(formattedData[0]?.Value || null);
      } catch (error) {
        console.error("Error fetching jenis kegiatan:", error);
      }
    };

    fetchJenisKegiatan();
  }, []);

  const fetchEvents = async () => {
    try {
      const data = await useFetch(
        `${API_LINK}/MasterKegiatan/GetDataKegiatanByCategory`,
        { kategori: 3 },
        "POST"
      );

      const groupedData = data.reduce((acc, item) => {
        const year = new Date(item.tglMulaiKegiatan).getFullYear();
        if (!acc[year]) {
          acc[year] = [];
        }
        acc[year].push({
          id: item.idKegiatan,
          title: decodeHtml(item.namaKegiatan),
          description: item.deskripsiKegiatan,
          category: item.kategoriKegiatan,
          startDate: item.tglMulaiKegiatan,
          endDate: item.tglSelesaiKegiatan,
          startTime: item.jamMulaiKegiatan,
          endTime: item.jamSelesaiKegiatan,
          location: item.tempatKegiatan,
          linkFolder: item.linkFolderKegiatan,
          image: item.fotoSampulKegiatan,
          jenisKegiatan: item.idJenisKegiatan,
        });
        return acc;
      }, {});

      setGroupedEvents(groupedData);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  const filteredEvents = Object.keys(groupedEvents).reduce((acc, year) => {
    const filtered = groupedEvents[year].filter(
      (event) => event.jenisKegiatan === selectedJenisKegiatan
    );
    if (filtered.length > 0) {
      acc[year] = filtered;
    }
    return acc;
  }, {});

  return (
    <div className="container my-5">
      {/* Header */}
      <div
        style={{
          padding: "20px",
          color: "white",
          textAlign: "center",
          borderRadius: "8px",
        }}
      >
        <HeaderText
          label="Dokumentasi Kegiatan <br/>Badan Penjamin Mutu (BPM)"
          warna="#2654A1"
          ukuran="1.8rem"
          fontWeight="700"
          marginBottom="1rem"
          marginTop="4rem"
        />
      </div>

      {/* Button */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginRight: "3rem",
        }}
      >
        <Button
          classType="btn btn-primary"
          title="Kelola Dokumentasi Kegiatan"
          label="Kelola Dokumentasi Kegiatan"
          onClick={() => onChangePage("read")}
        />
      </div>

      {/* Filter jenis kegiatan */}
      <div className={isMobile ? "m-0" : "m-3"}>
        <div className={"row m-0 g-1"}>
          {/* Filter tab kegiatan */}
          {jenisKegiatan.map((jenis) => (
            <div
              key={jenis.Value}
              className="col-auto mb-0 d-flex justify-content-center"
            >
              <button
                className={`btn ${
                  selectedJenisKegiatan === jenis.Value
                    ? "shadow"
                    : "btn-outline-white"
                } rounded-top-2 rounded-bottom-0`}
                style={{
                  backgroundColor:
                    selectedJenisKegiatan === jenis.Value ? "#2654A1" : "",
                  color:
                    selectedJenisKegiatan === jenis.Value ? "white" : "#AAA7A7",
                  fontSize: "16px",
                  padding: "10px 15px",
                  fontWeight: "650",
                  width: "auto",
                  whiteSpace: "nowrap",
                }}
                onClick={() => setSelectedJenisKegiatan(jenis.Value)}
              >
                {jenis.Text}
              </button>
            </div>
          ))}
        </div>

        {/* Tab Tahun */}
        <div
          className={
            isMobile
              ? "shadow p-1 m-0 bg-white rounded-bottom-3"
              : "shadow p-5 pt-3 m-0 bg-white rounded-bottom-5"
          }
          style={{ marginTop: "2rem" }}
        >
          {Object.keys(filteredEvents).length > 0 ? (
            Object.keys(filteredEvents).map((year) => (
              <TabTahunKegiatan
                key={year}
                year={year}
                kegiatanList={filteredEvents[year]}
                selectedId={location.state?.idData}
              />
            ))
          ) : (
            <p className="m-5">Belum ada kegiatan</p>
          )}
        </div>
      </div>
    </div>
  );
}
