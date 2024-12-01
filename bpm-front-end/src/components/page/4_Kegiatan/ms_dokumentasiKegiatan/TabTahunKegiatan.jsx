import React, { useState } from "react";
import CardKegiatan from "../../../part/CardKegiatan.jsx";

const TabTahun = ({ year, kegiatanList }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="border rounded-5 shadow-sm mb-3">
      <div
        className=" card p-3  text-gray d-flex justify-content-between align-items-left"
        onClick={() => setIsExpanded(!isExpanded)}
        style={{ cursor: "pointer" }}
      >
        <h5>Pendampingan dan Simulasi Akreditasi {year}</h5>
        <i
          className={`bi ${isExpanded ? "bi-chevron-up" : "bi-chevron-down"}`}
        ></i>
      </div>
      {isExpanded && (
        <div className="p-3 bg-light">
          <div className="row">
            {kegiatanList.map((kegiatan, index) => (
              <div key={index} className="col-md-6 mb-4">
                <CardKegiatan
                  title={kegiatan.title}
                  date={kegiatan.date}
                  time={kegiatan.time}
                  location={kegiatan.location}
                  image={kegiatan.image}
                  galleryLink={kegiatan.galleryLink}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TabTahun;
