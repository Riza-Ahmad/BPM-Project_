import React, { useState } from "react";
import CardBerita from "./CardBerita";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { BERITAFOTO_LINK } from "../util/Constants";
import { useIsMobile } from "../util/useIsMobile";

const SliderBerita = ({ beritaItems }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // Function to truncate description to 150 characters
  const truncateDescription = (description, maxLength = 90) => {
    return description.length > maxLength
      ? description.substring(0, maxLength) + "..."
      : description;
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % beritaItems.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? beritaItems.length - 1 : prevIndex - 1
    );
  };

  const handleCardClick = (item) => {
    navigate("/berita/lihatBerita", { state: item });
  };

  const navButtonStyle = {
    backgroundColor: "#2654A1",
    color: "white",
    fontSize: "20px",
    padding: "5px",
    margin: "5px",
    borderRadius: "100%",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
    transition: "all 0.3s ease",
    border: "none",
    height: "58px",
    width: "58px",
  };

  const iconStyle = {
    fontSize: "23px", // Ukuran simbol
    fontWeight: "bold", // Menambah ketebalan simbol
    transform: "scale(1.5)", // Membesarkan simbol
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        maxWidth: "785px",
        width: "100%",
        margin: "0 auto",
        position: "relative",
        marginBottom: "30px",
      }}
    >
      {/* Button Prev */}
      <button onClick={handlePrev} style={navButtonStyle}>
        <BsChevronLeft color="white" style={iconStyle} />
      </button>

      {/* Slider Wrapper */}
      <div style={{ overflow: "hidden", width: "90%", padding: "3px" }}>
        <div
          style={{
            display: "flex",
            transform: `translateX(-${currentIndex * 100}%)`,
            transition: "transform 0.5s ease-in-out",
          }}
        >
          {beritaItems.map((item, index) => (
            <div
              key={index}
              style={{
                minWidth: "100%",
                boxSizing: "border-box",
              }}
            >
              <CardBerita
                title={item.title}
                author={item.author}
                date={item.formattedDate}
                description={
                  !isMobile ? truncateDescription(item.description) : ""
                } // Truncated description
                image={BERITAFOTO_LINK + item.images[0]} // Only the first image is used
                size="small"
                onClick={() => handleCardClick(item)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Button Next */}
      <button onClick={handleNext} style={navButtonStyle}>
        <BsChevronRight color="white" style={iconStyle} />
      </button>
    </div>
  );
};

export default SliderBerita;
