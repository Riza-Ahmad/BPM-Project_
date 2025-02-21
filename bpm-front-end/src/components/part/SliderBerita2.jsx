import React, { useState } from "react";
import CardBerita from "./CardBerita";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { BERITAFOTO_LINK } from "../util/Constants";
import { useIsMobile } from "../util/useIsMobile";

const SliderBerita2 = ({ beritaItems }) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const truncateDescription = (description, maxLength = 90) => {
    return description.length > maxLength
      ? description.substring(0, maxLength) + "..."
      : description;
  };

  const handleCardClick = (item) => {
    navigate("/berita/lihatBerita", { state: item });
  };

  const sliderWrapperStyle = {
    overflowX: "auto",
    display: "flex",
    scrollSnapType: "x mandatory",
    WebkitOverflowScrolling: "touch",
    gap: "1.6rem",
    padding: isMobile ? "2rem" : "5rem",
    borderRadius: "8px",
    scrollbarWidth: "none",
    msOverflowStyle: "none",
  };

  return (
    <div>
      <div style={sliderWrapperStyle}>
        {beritaItems.map((item, index) => (
          <div
            key={index}
            style={{
              minWidth: "50%",
              boxSizing: "border-box",
            }}
          >
            <CardBerita
              title={item.title}
              author={item.author}
              date={item.formattedDate}
              description={
                !isMobile ? truncateDescription(item.description) : ""
              }
              image={BERITAFOTO_LINK + item.images[0]}
              size="small"
              onClick={() => handleCardClick(item)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SliderBerita2;
