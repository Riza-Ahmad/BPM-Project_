import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useRef,
  useEffect,
} from "react";
import Button from "./Button";

const UploadFileMulti = forwardRef(function UploadFileMulti(
  {
    id,
    label = "",
    isRequired = false,
    onChange,
    initialFiles = [],
    maxSizeFile = 10 * 1024 * 1024,
    formatFile = ".pdf,.docx",
    mode = "aktif",
    baseURL = "http://localhost:5187/Audit/",
  },
  ref
) {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("Field ini wajib diisi");
  const inputRef = useRef();

  const isInitialFilesProcessed = useRef(false);

  useEffect(() => {
    if (
      initialFiles &&
      Object.keys(initialFiles).length > 0 &&
      !isInitialFilesProcessed.current
    ) {
      isInitialFilesProcessed.current = true;

      const allFiles = Object.values(initialFiles).flatMap((fileGroup) =>
        fileGroup
          .filter((file) => typeof file === "string" || file instanceof File) // Ambil string dan File
          .map((file) => {
            if (typeof file === "string") {
              return {
                type: "path",
                value: file.replace(/\"/g, "").trim(),
                name: file.split("/").pop(),
              };
            } else if (file instanceof File) {
              return {
                type: "file",
                value: file,
                name: file.name,
              };
            }
          })
      );

      setFiles(allFiles);
    }
  }, [initialFiles]);

  useImperativeHandle(ref, () => ({
    validate() {
      if (isRequired && files.length === 0) {
        setError(true);
        return false;
      }
      setError(false);
      return true;
    },
    reset() {
      setFiles([]);
      setError(false);
      onChange([]);
    },
    focus() {
      inputRef.current?.focus();
    },
  }));

  const handleFileChange = (event) => {
    setError(false);
    const selectedFiles = Array.from(event.target.files);

    // Validasi format file
    const allowedExtensions = formatFile
      .split(",")
      .map((ext) => ext.trim().replace(/^\./, "").toLowerCase());
    const invalidFiles = selectedFiles.filter(
      (file) =>
        !allowedExtensions.includes(file.name.split(".").pop().toLowerCase())
    );
    if (invalidFiles.length > 0) {
      setErrorMsg(
        `Format file tidak diizinkan. Format yang diizinkan: ${allowedFormats}`
      );
      setError(true);
      inputRef.current.value = ""; // Kosongkan input field
      return;
    }

    // Validasi ukuran file
    const oversizedFiles = selectedFiles.filter(
      (file) => file.size > maxSizeFile
    );
    if (oversizedFiles.length > 0) {
      setErrorMsg(
        `Ukuran File tidak boleh melebihi ${maxSizeFile / (1024 * 1024)} MB.`
      );
      setError(true);
      inputRef.current.value = ""; // Kosongkan input field
      return;
    }

    // Validasi nama file yang duplikat
    const duplicateFiles = selectedFiles.filter((file) =>
      files.some((existingFile) => existingFile.name === file.name)
    );
    if (duplicateFiles.length > 0) {
      inputRef.current.value = ""; // Kosongkan input field
      return;
    }

    const validFiles = selectedFiles.map((file) => ({
      type: "file",
      value: file,
      name: file.name,
    }));

    setFiles((prev) => {
      const updatedFiles = [...prev, ...validFiles];
      onChange(updatedFiles.map((item) => item.value));
      return updatedFiles;
    });

    inputRef.current.value = ""; // Kosongkan input setelah memproses file
    if (isRequired) setError(false);
  };

  const handleRemoveFile = (index) => {
    setFiles((prev) => {
      const updatedFiles = prev.filter((_, i) => i !== index);
      onChange(updatedFiles.map((item) => item.value));
      return updatedFiles;
    });
  };

  const handleDownload = (file) => {
    if (file.type === "path") {
      // Untuk file dengan tipe path, buka di tab baru
      const link = document.createElement("a");
      link.href = `${baseURL}${file.value}`; // Gabungkan base URL dengan nama file
      link.target = "_blank"; // Buka di tab baru
      link.rel = "noopener noreferrer"; // Tambahan untuk keamanan
      link.click();
    } else if (file.type === "file") {
      // Untuk file tipe File (Blob), tetap gunakan cara lama (unduhan langsung)
      const url = URL.createObjectURL(file.value);
      const link = document.createElement("a");
      link.href = url;
      link.target = "_blank"; // Buka di tab baru
      link.rel = "noopener noreferrer"; // Tambahan untuk keamanan
      link.click();
      URL.revokeObjectURL(url); // Bersihkan URL Blob
    }
  };

  return (
    <div className="mb-3">
      {label && (
        <label htmlFor={id} className="form-label fw-bold mt-3">
          {label}
          {isRequired && <span className="text-danger"> *</span>}
        </label>
      )}

      <div
        className={`file-list-container form-control ms-0 m-3 p-3 ${
          error ? "border-danger" : ""
        }`}
        style={{
          border: "2px dashed #ddd",
          borderRadius: "8px",
          minHeight: "100px",
        }}
      >
        {files.length > 0 ? (
          <ul className="file-list">
            {files.map((item, index) => (
              <li
                key={index}
                className="file-item d-flex justify-content-between align-items-center"
              >
                <span>{item.name}</span> {/* Nama file di sini */}
                <div className="d-flex justify-content-end gap-2">
                  {mode === "aktif" && (
                    <Button
                      classType="danger"
                      iconName="trash"
                      onClick={() => handleRemoveFile(index)}
                    />
                  )}
                  <Button
                    classType="primary"
                    iconName="download"
                    onClick={() => handleDownload(item)}
                  />
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <span className="text-muted">No Files Selected</span>
        )}
      </div>

      {mode === "aktif" && (
        <input
          type="file"
          id={id}
          name={id}
          ref={inputRef}
          className={`form-control mt-2 ${error ? "is-invalid" : ""}`}
          accept={formatFile}
          onChange={handleFileChange}
          multiple
        />
      )}

      {error && <span className="text-danger small">{errorMsg}</span>}

      <style>
        {`
        .file-list-container:hover {
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
        }
        .file-list {
          list-style: none;
          padding: 0;
          width: 100%;
        }
        .file-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #ddd;
          padding: 4px 0;
        }
        /* Tambahan CSS untuk menangani nama file panjang */
        .file-item span {
          word-wrap: break-word;
          word-break: break-word;
          max-width: 100%; /* Sesuaikan dengan lebar yang Anda inginkan */
          overflow: hidden;
          text-overflow: ellipsis;
          
        }
      `}
      </style>
    </div>
  );
});

export default UploadFileMulti;
