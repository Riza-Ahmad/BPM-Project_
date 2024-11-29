import { forwardRef, useState } from "react";

const FileUpload = forwardRef(function FileUpload(
  {
    formatFile = "",
    label = "",
    forInput = "",
    isRequired = false,
    isDisabled = false,
    errorMessage,
    hasExisting,
    maxSizeFile = 10 * 1024 * 1024, // Default 10 MB
    ...props
  },
  ref
) {
  const [fileError, setFileError] = useState(""); // Untuk menyimpan pesan error ukuran file

  // Fungsi untuk menangani perubahan file h
  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      // Validasi ukuran file
      if (file.size > maxSizeFile) {
        setFileError(
          `Ukuran berkas tidak boleh lebih dari ${
            maxSizeFile / (1024 * 1024)
          } MB`
        );
        // Mengosongkan file input agar file yang lebih besar tidak tetap dipilih
        event.target.value = null;
      } else {
        setFileError(""); // Reset error jika ukuran file valid
      }
    }
  };

  return (
    <>
      <div className="mb-3">
        <label htmlFor={forInput} className="form-label fw-bold">
          {label}
          {isRequired && <span className="text-danger"> *</span>}
        </label>
        {errorMessage && (
          <span className="fw-normal text-danger">
            <br />
            {errorMessage}
          </span>
        )}

        {!isDisabled ? (
          <>
            <input
              type="file"
              id={forInput}
              name={forInput}
              accept={formatFile}
              className="form-control"
              ref={ref}
              onChange={handleFileChange}
              {...props}
            />
            {/* Menampilkan pesan error jika ukuran file lebih besar */}
            {fileError && (
              <span className="fw-normal text-danger">
                <br />
                {fileError}
              </span>
            )}
            <sub>
              Maksimum ukuran berkas adalah {maxSizeFile / (1024 * 1024)} MB
            </sub>
            {hasExisting && (
              <sub>
                <br />
                Berkas saat ini:{" "}
                <a
                  href={hasExisting}
                  className="text-decoration-none"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  [Unduh Berkas]
                </a>
                <br />
                Unggah ulang jika ingin mengganti berkas yang sudah ada
              </sub>
            )}
          </>
        ) : (
          <>
            <br />
            {hasExisting ? (
              <a
                href={hasExisting}
                className="text-decoration-none"
                target="_blank"
                rel="noopener noreferrer"
              >
                Unduh berkas
              </a>
            ) : (
              "-"
            )}
          </>
        )}
      </div>
    </>);
  }
);

export default FileUpload;
