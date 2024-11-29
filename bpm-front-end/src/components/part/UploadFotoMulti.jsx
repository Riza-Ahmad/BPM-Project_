import {
  useState,
  forwardRef,
  useImperativeHandle,
  useRef,
  useEffect,
} from "react";
import { BERITAFOTO_LINK } from "../util/Constants";

const UploadFotoMulti = forwardRef(function UploadFotoMulti(
  {
    id,
    label = "",
    isRequired = false,
    errorMsg = "Field ini wajib diisi.",
    onChange,
    initialImages = [],
  },
  ref
) {
  const [previews, setPreviews] = useState([]);
  const [error, setError] = useState(false);
  const inputRef = useRef();

  const isInitialImagesProcessed = useRef(false);

  useEffect(() => {
    if (initialImages?.length > 0 && !isInitialImagesProcessed.current) {
      isInitialImagesProcessed.current = true;

      const mappedImages = initialImages.map((img) => ({
        type: "path",
        value: img,
        preview: BERITAFOTO_LINK + img,
      }));

      setPreviews(mappedImages);
    }
  }, [initialImages]);

  useImperativeHandle(ref, () => ({
    validate() {
      if (isRequired && previews.length === 0) {
        setError(true);
        return false;
      }
      setError(false);
      return true;
    },
    reset() {
      setPreviews([]);
      setError(false);
      onChange([]);
    },
    focus() {
      inputRef.current?.focus();
    },
  }));

  const handleFileChange = async (event) => {
    const selectedFiles = Array.from(event.target.files);

    const validFiles = selectedFiles.filter((file) =>
      file.type.startsWith("image/")
    );

    if (validFiles.length === 0) return;

    const newPreviews = await Promise.all(
      validFiles.map((file) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve({
              type: "file",
              value: file,
              preview: reader.result,
            });
          };
          reader.onerror = () => reject(new Error("File read error"));
          reader.readAsDataURL(file);
        });
      })
    );

    setPreviews((prev) => {
      const updatedPreviews = [...prev, ...newPreviews];
      onChange(updatedPreviews.map((item) => item.value));
      return updatedPreviews;
    });

    if (isRequired) setError(false);
  };

  const handleRemovePreview = (index) => {
    setPreviews((prev) => {
      const updatedPreviews = prev.filter((_, i) => i !== index);
      onChange(updatedPreviews.map((item) => item.value));
      return updatedPreviews;
    });
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
        className={`preview-container form-control ms-0 m-3 p-3 ${
          error ? "border-danger" : ""
        }`}
        style={{
          border: "2px dashed #ddd",
          borderRadius: "8px",
          minHeight: "150px",
        }}
      >
        {previews.length > 0 ? (
          <div className="preview-grid">
            {previews.map((item, index) => (
              <div key={index} className="preview-item">
                <img
                  src={item.preview}
                  alt={`Preview ${index + 1}`}
                  className="img-thumbnail"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "150px",
                    borderRadius: "8px",
                  }}
                />
                <button
                  className="remove-btn"
                  onClick={() => handleRemovePreview(index)}
                  type="button"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        ) : (
          <span className="text-muted">No Images Selected</span>
        )}
      </div>

      <input
        type="file"
        id={id}
        name={id}
        ref={inputRef}
        className={`form-control mt-2 ${error ? "is-invalid" : ""}`}
        accept="image/*"
        onChange={handleFileChange}
        multiple
      />
      {error && <span className="text-danger small">{errorMsg}</span>}

      <style>
        {`
          .form-control:hover {
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
          }
          .img-thumbnail {
            border-radius: 8px;
            object-fit: cover;
          }
          .preview-grid {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            justify-content: center;
          }
          .preview-item {
            position: relative;
            display: inline-block;
          }
          .remove-btn {
            position: absolute;
            top: 5px;
            right: 5px;
            background-color: rgba(0, 0, 0, 0.5);
            color: white;
            border: none;
            border-radius: 50%;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
            cursor: pointer;
          }
          .remove-btn:hover {
            background-color: rgba(0, 0, 0, 0.8);
          }
        `}
      </style>
    </div>
  );
});

export default UploadFotoMulti;
