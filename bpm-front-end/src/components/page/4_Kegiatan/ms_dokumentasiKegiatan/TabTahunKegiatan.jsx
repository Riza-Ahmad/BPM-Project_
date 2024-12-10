import React, { useState } from "react";
import moment from "moment";
import "moment/locale/id"; // Memastikan menggunakan lokal Indonesia
import CardKegiatan from "../../../part/CardKegiatan.jsx";
import HeaderText from "../../../part/HeaderText.jsx";
import { useIsMobile } from "../../../util/useIsMobile.js";

const formatTime = (time) => {
  return moment(time, "HH:mm").format("HH:mm [WIB]");
};

const formatDate = (startDate, endDate) => {
  const options = {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  };

  // Format tanggal awal
  const startFormatted = new Date(startDate).toLocaleDateString(
    "id-ID",
    options
  );

  // Jika tanggal awal dan akhir sama, tampilkan hanya tanggal awal
  if (startDate === endDate) return startFormatted;

  // Jika berbeda, tampilkan rentang tanggal
  const endFormatted = new Date(endDate).toLocaleDateString("id-ID", options);
  return `${startFormatted} - ${endFormatted}`;
};

const TabTahunKegiatan = ({ year, kegiatanList }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isMobile = useIsMobile();

  return (
    <div className="border rounded-5 shadow-sm mb-3 mt-3">
      <div
        className={
          isMobile
            ? "card p-1 ps-4 text-gray d-flex justify-content-between align-items-left"
            : "card p-3 ps-4 text-gray d-flex justify-content-between align-items-left"
        }
        onClick={() => setIsExpanded(!isExpanded)}
        style={{ cursor: "pointer" }}
      >
        <div className="d-flex align-items-center">
          <HeaderText
            label={year}
            warna="#2654A1"
            marginBottom="0"
            marginTop="0"
            ukuran={isMobile ? "1.2rem" : "1.5rem"}
            alignText="left"
          />
          <i
            className={`fi ${
              isExpanded ? "fi-br-angle-small-up" : "fi-br-angle-small-down"
            } ms-auto`}
            style={{ fontSize: "1.5rem", marginRight: "1rem" }}
          ></i>
        </div>
      </div>
      {isExpanded && (
        <div className="p-3 bg-white rounded-5">
          <div className="row">
            {/* Kolom pertama */}
            <div className="col-md-6">
              {kegiatanList
                .slice(0, Math.ceil(kegiatanList.length / 2))
                .map((kegiatan, index) => (
                  <div key={index} className="mb-2">
                    <CardKegiatan
                      title={kegiatan.title}
                      date={formatDate(kegiatan.startDate, kegiatan.endDate)}
                      time={`${formatTime(kegiatan.startTime)} - ${formatTime(
                        kegiatan.endTime
                      )}`}
                      location={kegiatan.location}
                      image={kegiatan.image}
                      galleryLink={kegiatan.linkFolder}
                    />
                  </div>
                ))}
            </div>

            {/* Kolom kedua */}
            <div className="col-md-6">
              {kegiatanList
                .slice(Math.ceil(kegiatanList.length / 2))
                .map((kegiatan, index) => (
                  <div key={index} className="mb-2">
                    <CardKegiatan
                      title={kegiatan.title}
                      date={formatDate(kegiatan.startDate, kegiatan.endDate)}
                      time={`${formatTime(kegiatan.startTime)} - ${formatTime(
                        kegiatan.endTime
                      )}`}
                      location={kegiatan.location}
                      image={kegiatan.image}
                      galleryLink={kegiatan.linkFolder}
                    />
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TabTahunKegiatan;
