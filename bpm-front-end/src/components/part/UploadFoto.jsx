import { useState, useImperativeHandle, useRef } from "react";
import SweetAlert from "../util/SweetAlert";

const UploadFoto = ({
  id,
  label = "",
  isRequired = false,
  errorMsg = "",
  onChange,
  hasExisting,
  maxSizeFile = 5 * 1024 * 1024,
}) => {
  const [preview, setPreview] = useState(null);
  const inputRef = useRef(); // Tambahkan ref untuk input file

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      // Validasi apakah file adalah gambar
      if (!file.type.startsWith("image/")) {
        SweetAlert("Gagal!", "File harus berupa gambar", "error", "OK");
        inputRef.current.value = ""; // Kosongkan input field jika file tidak valid
        return;
      }

      if (file.size > maxSizeFile) {
        SweetAlert(
          "Gagal!",
          `Ukuran berkas tidak boleh lebih dari ${
            maxSizeFile / (1024 * 1024)
          } MB`,
          "error",
          "OK"
        );
        inputRef.current.value = ""; // Kosongkan input field jika file tidak valid
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result); // Set preview gambar baru
      };
      reader.readAsDataURL(file);

      if (onChange) {
        onChange(file);
      }
    } else {
      // Kosongkan preview jika tidak ada file yang dipilih
      setPreview(null);
    }

    // Kosongkan nilai input setelah proses selesai
    inputRef.current.value = "";
  };

  return (
    <div className="mb-3">
      {label && (
        <label htmlFor={id} className="form-label fw-bold">
          {label}
          {isRequired && <span className="text-danger"> *</span>}
          {errorMsg && (
            <span className="fw-normal text-danger"> {errorMsg}</span>
          )}
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
            style={{
              maxWidth: "100%",
              maxHeight: "150px",
              borderRadius: "8px",
            }}
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
        ref={inputRef} // Hubungkan ref ke input
        style={{ cursor: "pointer" }}
      />

      {hasExisting && (
        <sub>
          <br />
          Gambar saat ini:{" "}
          <a
            href={hasExisting}
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
