import React from "react";
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
    paddingBottom: size === "small" ? "5px" : "0px",
    position: "relative",
    height: size === "small" ? "100%" : "100%",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  };

  const imgWrapperStyle = {
    height: size === "small" ? (isMobile ? "120px" : "200px") : "200px",
    overflow: "hidden",
    borderRadius: "15px",
  };

  const imgStyle = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  };

  const textContainerStyle = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    overflow: "hidden",
    flex: "1 1 auto",
  };

  const textContentStyle = {
    flex: "1 1 auto", // Untuk memastikan teks fleksibel
    display: "flex",
    flexDirection: "column",
  };

  const textStyle = {
    fontSize: "14px",
    color: "#555",
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "-webkit-box",
    WebkitLineClamp: size === "small" ? 3 : 5,
    WebkitBoxOrient: "vertical",
    marginBottom: size === "small" ? "0rem" : "2.3rem",
  };

  const buttonStyle =
    size === "small"
      ? {
          alignSelf: "flex-start",
        }
      : {
          position: "absolute",
          bottom: "1rem",
          left: "1rem",
          alignSelf: "flex-start",
        };

  return (
    <div style={cardStyle}>
      <div className="row g-0">
        {/* Kolom Gambar */}
        <div className={size === "small" ? "col-md-5 p-1 pb-0" : ""}>
          <div style={imgWrapperStyle}>
            <img
              src={image}
              alt={title}
              style={imgStyle}
              className="img-fluid"
            />
          </div>
        </div>

        {/* Kolom Teks */}
        <div
          className={size === "small" ? "col-md-7 p-2 pb-0" : ""}
          style={textContainerStyle}
        >
          <div style={textContentStyle}>
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
              style={{
                color: "#007bff",
                fontSize: "14px",
                marginBottom: "10px",
              }}
            >
              Oleh {author} | {date}
            </p>

            <p
              className="card-text"
              style={textStyle}
              dangerouslySetInnerHTML={{ __html: description }}
            ></p>
          </div>

          {/* Tombol */}
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
