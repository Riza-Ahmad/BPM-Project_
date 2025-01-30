import React, { useState } from "react";
import Text from "./Text";
import HeaderText from "./HeaderText";
import { KEGIATANFILE_LINK } from "../util/Constants";
import { useIsMobile } from "../util/useIsMobile";

const CardKegiatan = ({
  title,
  date,
  time,
  location,
  image,
  galleryLink,
  fileNotulen,
  statusFileNotulen,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isMobile = useIsMobile();
  const iconStyle = {
    fontSize: "1rem",
    marginRight: "8px",
    position: "relative",
    top: "2px",
  };

  return (
    <div className="border rounded-4 shadow-sm mb-3">
      <div
        className="card-header p-2 rounded-4 bg-body-secondary d-flex justify-content-between align-items-center"
        onClick={() => setIsExpanded(!isExpanded)}
        style={{ cursor: "pointer" }}
      >
        <div className="d-flex align-items-center me-4">
          <i
            className={`fi ${
              isExpanded ? "fi fi-sr-folder-open" : "fi-sr-folder"
            } ms-2 mt-1`}
            style={{
              fontSize: "1.5rem",
              marginRight: "1rem",
              color: "#575050",
            }}
          ></i>
          <HeaderText
            label={title}
            warna="#575050"
            alignText="left"
            marginTop="0rem"
            marginBottom="0rem"
            ukuran={isMobile ? "1rem" : "1.1rem"}
          ></HeaderText>
        </div>
      </div>

      {isExpanded && (
        <div className="card-body p-4">
          <div
            className="d-flex justify-content-left align-items"
            style={{ height: "100%" }}
          >
            <img
              src={KEGIATANFILE_LINK + image}
              alt="Kegiatan"
              className="img-fluid rounded mb-3"
              style={{
                minWidth: "100%",
                maxHeight: "200px",
                objectFit: "cover",
                flexShrink: 0,
              }}
            />
          </div>

          <HeaderText
            label={title}
            warna="#575050"
            alignText="justify"
            marginTop="0rem"
            marginBottom="0.7rem"
            ukuran="1.2rem"
          ></HeaderText>
          <p style={{ fontSize: "1rem" }}>
            <i className="fi fi-br-calendar-day" style={iconStyle}></i>
            {date}
          </p>
          <p style={{ fontSize: "1rem" }}>
            <i className="fi fi-rr-clock-three" style={iconStyle}></i>
            {time}
          </p>
          <p style={{ fontSize: "1rem" }}>
            <i className="fi fi-br-marker" style={iconStyle}></i>
            {location}
          </p>

          <a
            href={galleryLink}
            className="btn btn-primary btn-sm"
            target="_blank"
          >
            Galeri Selengkapnya
          </a>

          {statusFileNotulen === "Publik" && (
            <a
              href={fileNotulen}
              className="btn btn-danger btn-sm ms-3"
              target="_blank"
            >
              File Notulen
            </a>
          )}
        </div>
      )}
    </div>
  );
};

export default CardKegiatan;
