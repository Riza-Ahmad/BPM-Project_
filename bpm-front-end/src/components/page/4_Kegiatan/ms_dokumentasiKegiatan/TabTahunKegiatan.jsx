import React, { useState, useEffect } from "react";
import moment from "moment";
import "moment/locale/id";
import CardKegiatan from "../../../part/CardKegiatan.jsx";
import HeaderText from "../../../part/HeaderText.jsx";
import { useIsMobile } from "../../../util/useIsMobile.js";
import { KEGIATANFILE_LINK } from "../../../util/Constants.js";

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

  const startFormatted = new Date(startDate).toLocaleDateString(
    "id-ID",
    options
  );

  if (startDate === endDate) return startFormatted;

  const endFormatted = new Date(endDate).toLocaleDateString("id-ID", options);
  return `${startFormatted} - ${endFormatted}`;
};

const TabTahunKegiatan = ({ year, kegiatanList, selectedId }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isMobile = useIsMobile();

  // Use effect to scroll the selected card into view when selected
  useEffect(() => {
    if (selectedId) {
      const selectedElement = document.getElementById(`kegiatan-${selectedId}`);
      if (selectedElement) {
        selectedElement.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }
  }, [selectedId]);

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
                .map((kegiatan) => (
                  <div
                    key={kegiatan.id}
                    id={`kegiatan-${kegiatan.id}`} // Ensure each card has a unique ID for scrolling
                    className="mb-2"
                  >
                    <CardKegiatan
                      title={kegiatan.title}
                      date={formatDate(kegiatan.startDate, kegiatan.endDate)}
                      time={`${formatTime(kegiatan.startTime)} - ${formatTime(
                        kegiatan.endTime
                      )}`}
                      location={kegiatan.location}
                      image={kegiatan.image}
                      galleryLink={kegiatan.linkFolder}
                      fileNotulen={KEGIATANFILE_LINK + kegiatan.fileNotulen}
                      statusFileNotulen={kegiatan.statusFileNotulen}
                    />
                  </div>
                ))}
            </div>

            {/* Kolom kedua */}
            <div className="col-md-6">
              {kegiatanList
                .slice(Math.ceil(kegiatanList.length / 2))
                .map((kegiatan) => (
                  <div
                    key={kegiatan.id}
                    id={`kegiatan-${kegiatan.id}`} // Ensure each card has a unique ID for scrolling
                    className="mb-2"
                  >
                    <CardKegiatan
                      title={kegiatan.title}
                      date={formatDate(kegiatan.startDate, kegiatan.endDate)}
                      time={`${formatTime(kegiatan.startTime)} - ${formatTime(
                        kegiatan.endTime
                      )}`}
                      location={kegiatan.location}
                      image={kegiatan.image}
                      galleryLink={kegiatan.linkFolder}
                      fileNotulen={KEGIATANFILE_LINK + kegiatan.fileNotulen}
                      statusFileNotulen={kegiatan.statusFileNotulen}
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
