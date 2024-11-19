import { useState, useEffect } from "react";
import { FILE_LINK } from "../util/Constants";

const UploadFoto = ({ id, label = "", isRequired = false, errorMsg = "", onChange, hasExisting }) => {
  const [preview, setPreview] = useState(null);

  // useEffect(() => {
  //   // Jika hasExisting ada, tampilkan gambar yang ada sebagai preview
  //   if (hasExisting) {
  //     setPreview(FILE_LINK + hasExisting);
  //   }
  // }, [hasExisting]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result); // Set preview gambar baru
      };
      reader.readAsDataURL(file);

      if (onChange) {
        onChange(file);
      }
    }
  };

  return (
    <div className="mb-3">
      {label && (
        <label htmlFor={id} className="form-label fw-bold mt-3">
          {label}
          {isRequired && <span className="text-danger"> *</span>}
          {errorMsg && <span className="fw-normal text-danger"> {errorMsg}</span>}
        </label>
      )}

      <div
        className="form-control m-3 p-3"
        style={{
          border: "2px dashed #ddd",
          borderRadius: "8px",
          minHeight: "150px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {preview ? (
          <img
            src={preview}
            alt="Preview"
            className="img-thumbnail"
            style={{ maxWidth: "100%", maxHeight: "150px", borderRadius: "8px" }}
          />
        ) : (
          <span className="text-muted">No Image Selected</span>
        )}
      </div>

      <input
        type="file"
        id={id}
        name={id}
        className="form-control mt-2"
        accept="image/*"
        onChange={handleFileChange}
        style={{ cursor: "pointer" }}
      />

      {hasExisting && (
        <sub>
          <br />
          Gambar saat ini:{" "}
          <a
            href={FILE_LINK + hasExisting}
            className="text-decoration-none"
            target="_blank"
            rel="noopener noreferrer"
          >
            [Lihat Gambar]
          </a>
          <br />
          Unggah ulang jika ingin mengganti gambar yang sudah ada
        </sub>
      )}

      <style>{`
        .form-control:hover {
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
        }
        .img-thumbnail {
          border-radius: 8px;
          object-fit: cover;
        }
      `}</style>
    </div>
  );
};

export default UploadFoto;
