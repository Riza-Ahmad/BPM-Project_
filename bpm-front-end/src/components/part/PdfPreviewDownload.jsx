import React from "react";

const PdfPreviewDownload = ({ judul, handleClick }) => {
  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    border: "1px solid #ccc",
    borderRadius: "8px",
    padding: "1rem",
    maxWidth: "100%",
    backgroundColor: "#f9f9f9",
  };

  const iconStyle = {
    fontSize: "5rem", // Menggunakan fontSize untuk ikon besar
    color: "red",
    marginBottom: "0rem", // Jarak ikon dengan elemen berikutnya
  };

  const titleStyle = {
    fontSize: "0.8rem",
    fontWeight: "bold",
    margin: "10px 0", // Jarak judul dengan elemen atas dan bawah
    textAlign: "center",
    marginTop: "0rem",
  };

  const buttonStyle = {
    padding: "10px 20px",
    fontSize: "14px",
    color: "#fff",
    backgroundColor: "#007bff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  };

  const buttonHoverStyle = {
    backgroundColor: "#0056b3",
  };

  return (
    <div className="col" style={containerStyle}>
      <div>
        <i className="fi fi-sr-file-pdf" style={iconStyle}></i>
      </div>
      <div>
        <h3 style={titleStyle}>{judul.toUpperCase()}</h3>
        <button
          onClick={(e) => {
            e.preventDefault(); // Mencegah default behavior
            handleClick();
          }}
          style={buttonStyle}
          onMouseOver={(e) =>
            (e.target.style.backgroundColor = buttonHoverStyle.backgroundColor)
          }
          onMouseOut={(e) =>
            (e.target.style.backgroundColor = buttonStyle.backgroundColor)
          }
        >
          Unduh Dokumen
        </button>
      </div>
    </div>
  );
};

export default PdfPreviewDownload;
