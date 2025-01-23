import React, {
  forwardRef,
  useState,
  useImperativeHandle,
  useCallback,
  useRef,
} from "react";

const FileUpload = forwardRef(function FileUpload(
  {
    formatFile = ".pdf", // Allowed formats as a string, e.g., ".pdf,.docx"
    label = "",
    forInput = "",
    isRequired = false,
    isDisabled = false,
    errorMessage,
    hasExisting,
    maxSizeFile = 10 * 1024 * 1024, // Default 10 MB
    onChange, // Function to send file to parent
    ...props
  },
  ref
) {
  const [fileError, setFileError] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const inputRef = useRef(null);

  // Drag and drop handlers
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragActive(false);
  }, []);

  const validateFile = (file) => {
    let error = "";
    const allowedExtensions = formatFile
      .split(",")
      .map((ext) => ext.trim().replace(/^\./, ""));

    const fileExtension = file.name.split(".").pop().toLowerCase();

    // Validate file type
    if (!allowedExtensions.includes(fileExtension)) {
      error = `Format tidak didukung: ${
        file.type || file.name
      }. Format diizinkan: ${formatFile}`;
    }

    // Validate file size
    if (file.size > maxSizeFile) {
      error = `Ukuran berkas tidak boleh lebih dari ${
        maxSizeFile / (1024 * 1024)
      } MB`;
    }

    return error;
  };

  useImperativeHandle(ref, () => ({
    validate() {
      if (!isRequired || selectedFile == null) {
        setFileError("Field ini wajib di isi");
        return false;
      }
      return true;
    },
    reset() {
      setFileError("");
      onChange([]);
    },
    focus() {
      inputRef.current?.focus();
    },
  }));

  const handleFile = (file) => {
    if (!file) return;

    const error = validateFile(file);

    if (error) {
      setFileError(error);
      setSelectedFile(null);
    } else {
      setFileError("");
      setSelectedFile(file);

      // Jika onChange diteruskan sebagai prop, panggil dan kirim file ke parent
      if (onChange) {
        onChange(file); // Mengirim file ke komponen parent
      }
    }
  };

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setDragActive(false);
      if (isDisabled) return;

      const file = e.dataTransfer.files[0];
      handleFile(file);
    },
    [isDisabled, handleFile]
  );

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    handleFile(file);
  };

  return (
    <div className="mb-3">
      <label htmlFor={forInput} className="form-label fw-bold">
        {label}
        {isRequired && <span className="text-danger"> *</span>}
      </label>

      {errorMessage && (
        <span className="text-danger">
          <br />
          {errorMessage}
        </span>
      )}

      {!isDisabled ? (
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
            backgroundColor: dragActive ? "#f9f9f9" : "white",
          }}
        >
          <input
            type="file"
            id={forInput}
            name={forInput}
            accept={formatFile}
            className="form-control"
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
          <div
            style={{ minHeight: "20vh" }}
            className="d-flex justify-content-center align-items-center"
          >
            <h2>
              {selectedFile ? (
                selectedFile.name
              ) : (
                <strong>Drag & drop file here or click to upload</strong>
              )}
            </h2>
          </div>
          <sub>
            Maksimum ukuran berkas: {maxSizeFile / (1024 * 1024)} MB
            {formatFile && ` | Format: ${formatFile}`}
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
            </sub>
          )}
        </div>
      ) : (
        <div>
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
        </div>
      )}
      {fileError && (
        <span className="text-danger">
          {fileError || "Field ini wajib diisi."}
        </span>
      )}
    </div>
  );
});

export default FileUpload;
