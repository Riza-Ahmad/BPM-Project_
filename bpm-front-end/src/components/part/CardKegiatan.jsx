import React, { useState } from "react";

const CardKegiatan = ({ title, date, time, location, image, galleryLink }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="border rounded-4 shadow-sm mb-3">
      <div
        className="card-header p-3  rounded-4 bg-body-secondary d-flex justify-content-between align-items-center"
        onClick={() => setIsExpanded(!isExpanded)}
        style={{ cursor: "pointer" }}
      >
        <div>
          <i className="bi bi-folder-fill me-2"></i>
          {title}
        </div>
        <i
          className={`bi ${isExpanded ? "bi-chevron-up" : "bi-chevron-down"}`}
        ></i>
      </div>
      {isExpanded && (
        <div className="card-body p-4">
          <div className="center">
            <img
              src={image}
              alt="Kegiatan"
              className="img-fluid rounded mb-3"
              style={{ maxHeight: "200px", objectFit: "cover" }}
            />
          </div>

          <h5>{title}</h5>
          <p>
            <i className="bi bi-calendar2-event me-2"></i>
            {date}
          </p>
          <p>
            <i className="bi bi-clock me-2"></i>
            {time}
          </p>
          <p>
            <i className="bi bi-geo-alt me-2"></i>
            {location}
          </p>
          <a
            href={galleryLink}
            className="btn btn-primary btn-sm"
            target="_blank"
            rel="noopener noreferrer"
          >
            Galeri Selengkapnya
          </a>
        </div>
      )}
    </div>
  );
};

export default CardKegiatan;
