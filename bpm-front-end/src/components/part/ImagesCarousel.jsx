import React from "react";
import Mahasiswa from "../../assets/element/mahasiswa.png";
import { DOKUMEN_LINK } from "../util/Constants";

const ImagesCarousel = ({ images = [], link = DOKUMEN_LINK }) => {
  const defaultImages = [Mahasiswa, Mahasiswa, Mahasiswa];

  const validImages = images.filter((item) => item !== "");
  const carouselImages = validImages.length > 0 ? validImages : defaultImages;

  const styles = {
    carouselContainer: {
      position: "relative",
    },
    carouselInner: {
      borderRadius: "20px",
    },
    carouselImg: {
      height: "50vh",
      objectFit: "cover",
    },
    controlButton: {
      backgroundColor: "#2654A1",
      borderRadius: "30px",
      height: "50px",
      width: "50px",
      opacity: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    controlLeft: {
      transform: "translateX(-200%)",
    },
    controlRight: {
      transform: "translateX(200%)",
    },
  };

  return (
    <div
      id="carouselExampleAutoplaying"
      className="carousel slide"
      data-bs-ride="carousel"
      style={styles.carouselContainer}
    >
      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target="#carouselExampleAutoplaying"
        data-bs-slide="prev"
      >
        <div
          style={{
            ...styles.controlButton,
            ...styles.controlLeft,
          }}
        >
          <span
            className="carousel-control-prev-icon"
            aria-hidden="true"
            style={{ marginTop: "2px" }}
          ></span>
          <span className="visually-hidden">Previous</span>
        </div>
      </button>

      <div className="carousel-inner" style={styles.carouselInner}>
        {carouselImages.map((image, index) => (
          <div
            key={index}
            className={`carousel-item ${index === 0 ? "active" : ""}`}
          >
            <img
              src={
                typeof image === "string" && validImages.length > 0
                  ? link + image
                  : image
              }
              className="d-block w-100"
              alt={`Slide ${index + 1}`}
              style={{ objectFit: "cover", height: "50vh" }}
            />
          </div>
        ))}
      </div>

      <button
        className="carousel-control-next"
        type="button"
        data-bs-target="#carouselExampleAutoplaying"
        data-bs-slide="next"
      >
        <div
          style={{
            ...styles.controlButton,
            ...styles.controlRight,
          }}
        >
          <span
            className="carousel-control-next-icon"
            aria-hidden="true"
            style={{ marginTop: "2px" }}
          ></span>
          <span className="visually-hidden">Next</span>
        </div>
      </button>
    </div>
  );
};

export default ImagesCarousel;
