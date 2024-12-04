import React, { useEffect, useState } from "react";
import TabTahun from "./TabTahunKegiatan";
import HeaderText from "../../../part/HeaderText";
import { API_LINK } from "../../../util/Constants";
import { useIsMobile } from "../../../util/useIsMobile";

export default function Index({ onChangePage }) {
  const [groupedEvents, setGroupedEvents] = useState({});
  const [loading, setLoading] = useState(true);
  const [jenisKegiatan, setJenisKegiatan] = useState([]);
  const [selectedJenisKegiatan, setSelectedJenisKegiatan] = useState(null);
  const isMobile = useIsMobile();

  // Fetch jenis kegiatan data on component mount
  useEffect(() => {
    const fetchJenisKegiatan = async () => {
      try {
        const response = await fetch(
          `${API_LINK}/MasterKegiatan/GetDataJenisKegiatan`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({}),
          }
        );

        if (response.ok) {
          const data = await response.json();
          const formattedData = data.map((item) => ({
            Value: item.jkg_id, // ID untuk nilai dropdown
            Text: item.jkg_nama, // Nama untuk teks dropdown
          }));
          setJenisKegiatan(formattedData); // Menyimpan data ke state
          setSelectedJenisKegiatan(formattedData[0]?.Value || null); // Pilih tab pertama sebagai default
        } else {
          throw new Error("Gagal mengambil data jenis kegiatan");
        }
      } catch (error) {
        console.error("Error fetching jenis kegiatan:", error);
      }
    };

    fetchJenisKegiatan();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch(
        `${API_LINK}/MasterKegiatan/GetDataKegiatan`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Gagal mengambil data kegiatan");
      }

      const data = await response.json();

      // Kelompokkan berdasarkan tahun
      const groupedData = data.reduce((acc, item) => {
        const year = new Date(item.keg_tgl_mulai).getFullYear();
        if (!acc[year]) {
          acc[year] = [];
        }
        acc[year].push({
          id: item.keg_id,
          title: item.keg_nama,
          description: item.keg_deskripsi,
          category: item.keg_kategori,
          startDate: item.keg_tgl_mulai,
          endDate: item.keg_tgl_selesai,
          startTime: item.keg_jam_mulai,
          endTime: item.keg_jam_selesai,
          location: item.keg_tempat,
          linkFolder: item.keg_link_folder,
          image: item.keg_foto_sampul,
          jenisKegiatan: item.jkg_id, // Sesuaikan dengan ID jenis kegiatan
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

  // Filter kegiatan berdasarkan jenis kegiatan yang dipilih
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

      <div className={isMobile ? "m-0" : "m-3"}>
        <div className={"row m-0 g-1"}>
          {/* g-1 to reduce the gap between columns */}
          {jenisKegiatan.map((jenis) => (
            <div
              key={jenis.Value}
              className="col-auto mb-0 d-flex justify-content-center" // col-auto for auto width based on content
            >
              <button
                className={`btn ${
                  selectedJenisKegiatan === jenis.Value
                    ? "shadow"
                    : "btn-outline-white"
                } rounded-top-2 rounded-bottom-0`} // Apply rounded-top to button
                style={{
                  backgroundColor:
                    selectedJenisKegiatan === jenis.Value ? "#2654A1" : "",
                  color:
                    selectedJenisKegiatan === jenis.Value ? "white" : "#AAA7A7",
                  fontSize: "16px",
                  padding: "10px 15px", // Adjust padding to keep the button size fitting its text
                  fontWeight: "650",
                  width: "auto", // Button width adjusts to content
                  whiteSpace: "nowrap", // Prevent text wrapping
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
              <TabTahun
                key={year}
                year={year}
                kegiatanList={filteredEvents[year]}
              />
            ))
          ) : (
            <p>Belum ada kegiatan</p>
          )}
        </div>
      </div>
    </div>
  );
}
