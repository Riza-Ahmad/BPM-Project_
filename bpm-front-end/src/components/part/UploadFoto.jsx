import { useState, useImperativeHandle, forwardRef, useRef } from "react";
import SweetAlert from "../util/SweetAlert";

const UploadFoto = forwardRef(
  (
    {
      id,
      label = "",
      isRequired = false,
      errorMsg = "Field ini wajib diisi.",
      onChange,
      hasExisting,
      maxSizeFile = 5 * 1024 * 1024,
    },
    ref
  ) => {
    const [preview, setPreview] = useState(null);
    const [error, setError] = useState(false);
    const inputRef = useRef();

    useImperativeHandle(ref, () => ({
      validate() {
        if (isRequired && !preview) {
          setError(true);
          return false;
        }
        setError(false);
        return true;
      },
      reset() {
        setPreview(null);
        setError(false);
        if (inputRef.current) {
          inputRef.current.value = "";
        }
        if (onChange) {
          onChange(null);
        }
      },
      focus() {
        inputRef.current?.focus();
      },
    }));

    const handleFileChange = (event) => {
      const file = event.target.files[0];

      if (file) {
        if (!file.type.startsWith("image/")) {
          SweetAlert("Gagal!", "File harus berupa gambar", "error", "OK");
          inputRef.current.value = "";
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
          inputRef.current.value = "";
          return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result);
        };
        reader.readAsDataURL(file);

        if (onChange) {
          onChange(file);
        }

        setError(false);
      } else {
        setPreview(null);
      }

      inputRef.current.value = "";
    };

    return (
      <div className="mb-3">
        {label && (
          <label htmlFor={id} className="form-label fw-bold">
            {label}
          </label>
        )}

        <div
          className={`form-control m-3 p-3 ${error ? "border-danger" : ""}`}
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
          className={`form-control mt-2 ${error ? "is-invalid" : ""}`}
          accept="image/*"
          onChange={handleFileChange}
          ref={inputRef}
          style={{ cursor: "pointer" }}
        />
        {error && <span className="text-danger small">{errorMsg}</span>}

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
  }
);

export default UploadFoto;
