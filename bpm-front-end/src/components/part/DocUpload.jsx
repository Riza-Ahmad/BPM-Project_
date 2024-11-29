import React, { useState, useCallback, forwardRef } from "react";
import { FILE_LINK } from "../util/Constants";

const DocUpload = forwardRef(function DocUpload(
  {
    label = "",
    forInput = "",
    isRequired = false,
    isDisabled = false,
    errorMessage,
    hasExisting,
    ...props
  },
  ref
) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [validationError, setValidationError] = useState("");

  // Allowed MIME types
  const allowedExtensions = [
    "application/pdf", // .pdf
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
    "application/msword", // .doc
    "application/vnd.openxmlformats-officedocument.presentationml.presentation", // .pptx
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
    "application/vnd.ms-excel", // .xls
  ];

  const validateFile = (file) => {
    if (!allowedExtensions.includes(file.type)) {
      return `Unsupported file format: ${file.type}. Allowed formats: .pdf, .pptx, .docx, .doc, .xls, .xlsx.`;
    }
    return null;
  };

  // Drag and drop handlers
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragActive(false);
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setDragActive(false);

      if (isDisabled) return;

      const file = e.dataTransfer.files[0];
      if (file) {
        const error = validateFile(file);
        if (error) {
          setValidationError(error);
          setSelectedFile(null);
          return;
        }

        setValidationError("");
        setSelectedFile(file);
        if (ref && ref.current) {
          ref.current.files = e.dataTransfer.files;
        }
      }
    },
    [isDisabled, ref]
  );

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const error = validateFile(file);
      if (error) {
        setValidationError(error);
        setSelectedFile(null);
        return;
      }

      setValidationError("");
      setSelectedFile(file);
    }
  };

  return (
    <div className="mb-3">
      <label htmlFor={forInput} className="form-label fw-bold">
        {label}
        {isRequired ? <span className="text-danger"> *</span> : ""}
        {errorMessage || validationError ? (
          <span className="fw-normal text-danger">
            <br />
            {errorMessage || validationError}
          </span>
        ) : (
          ""
        )}
      </label>
      {!isDisabled && (
        <div
          className={`file-upload-container ${dragActive ? "drag-active" : ""}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          style={{
            border: "2px dashed #ccc",
            borderRadius: "5px",
            padding: "10px",
            textAlign: "center",
            position: "relative",
          }}
        >
          <input
            className="form-control"
            type="file"
            id={forInput}
            name={forInput}
            accept=".pdf,.pptx,.docx,.doc,.xls,.xlsx"
            ref={ref}
            onChange={handleFileChange}
            {...props}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              opacity: 0,
              cursor: "pointer",
            }}
          />
          {selectedFile ? (
            <div
              style={{ minHeight: "20vh" }}
              className="d-flex justify-content-center align-items-center"
            >
              <h2>
                <strong>Selected File: </strong>
                {selectedFile.name}
              </h2>
            </div>
          ) : (
            <div
              style={{ minHeight: "20vh" }}
              className="d-flex justify-content-center align-items-center"
            >
              <h2>
                <strong>
                  Seret atau pilih file PDF, DOCX, XLSX, atau PPTX
                </strong>
              </h2>
            </div>
          )}
        </div>
      )}
      <sub>Maksimum ukuran berkas adalah 10 MB</sub>
      {hasExisting && (
        <sub>
          <br />
          Berkas saat ini:{" "}
          <a
            href={FILE_LINK + hasExisting}
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
    </div>
  );
});

export default DocUpload;
