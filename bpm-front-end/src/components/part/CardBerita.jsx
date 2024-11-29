import React, { useState, useEffect } from "react";
import { useIsMobile } from "../util/useIsMobile";
import Button from "./Button";
import HeaderText from "./HeaderText";

const CardBerita = ({
  title,
  author,
  date,
  description,
  image,
  size = "large",
  onClick,
}) => {
  const isMobile = useIsMobile();

  const cardStyle = {
    borderRadius: "15px",
    boxShadow: "3px 4px 8px rgba(0, 0, 0, 0.2)",
    marginBottom: "20px",
    maxWidth: "99%",
    padding: "20px",
    paddingBottom: size === "small" ? "5px" : "20px",
    position: "relative",
    height: size === "small" ? "98%" : "100%",
  };

  const imgStyle = {
    width: "100%",
    height: isMobile
      ? size === "small"
        ? "100%"
        : "100%"
      : size === "small"
      ? "100%"
      : "100%",
    objectFit: "cover",
    borderRadius: "15px",
  };

  const textContainerStyle = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    position: "relative",
    paddingBottom: "10px",
    marginBottom: size === "small" ? "0px" : "10px",
  };

  const buttonStyle = {
    alignSelf: "flex-start",
    position: size === "small" ? "relative" : "absolute",
    bottom: size === "small" ? "0px" : "-5px",
    left: size === "small" ? "0" : "15px",
  };

  return (
    <div style={cardStyle}>
      <div className="row g-0">
        <div
          className={size === "small" ? "col-md-5 p-1 pb-0" : "col-md-3 p-1"}
        >
          <img src={image} alt={title} style={imgStyle} className="img-fluid" />
        </div>

        <div
          className={
            size === "small" ? "col-md-7 p-2 pb-0" : "col-md-9 p-3 pt-0 pb-4 "
          }
          style={textContainerStyle}
        >
          <HeaderText
            label={title}
            ukuran="18px"
            warna="black"
            fontWeight="700"
            alignText="left"
            marginBottom="10px"
            marginTop="10px"
          />

          <p
            style={{ color: "#007bff", fontSize: "14px", marginBottom: "10px" }}
          >
            Oleh {author} | {date}
          </p>

          <p
            className="card-text"
            style={{ fontSize: "14px", color: "#555" }}
            dangerouslySetInnerHTML={{ __html: description }}
          ></p>

          <div style={buttonStyle}>
            <Button
              label="Selengkapnya"
              classType="primary"
              onClick={onClick}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardBerita;
