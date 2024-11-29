import { forwardRef, useImperativeHandle, useState, useRef } from "react";

const TextField = forwardRef(function TextField(
  {
    id,
    label = "",
    size = "md",
    placeHolder = "",
    errorMsg = "",
    isRequired = false,
    isDisabled = false,
    maxChar,
    ...props
  },
  ref
) {
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);
  const inputRef = useRef(null);

  useImperativeHandle(ref, () => ({
    reset() {
      setValue("");
      setError(false);
    },
    validate() {
      if (isRequired && !value.trim()) {
        setError(true);
        return false;
      }
      setError(false);
      return true;
    },
    get value() {
      return value;
    },
    focus() {
      inputRef.current.focus();
    },
    value,
  }));

  const sizeClass =
    size === "lg" ? "form-control-lg" : size === "sm" ? "form-control-sm" : "";

  const handleChange = (e) => {
    const newValue = e.target.value;
    if (maxChar && newValue.length <= maxChar) {
      setValue(newValue);
    } else if (!maxChar) {
      setValue(newValue);
    }
    if (isRequired) setError(!newValue.trim());
  };

  return (
    <div className="mb-3">
      {label && (
        <label htmlFor={id} className="form-label fw-bold">
          {label}
          {isRequired && <span className="text-danger"> *</span>}
        </label>
      )}
      <input
        ref={inputRef}
        id={id}
        name={id}
        type="text"
        className={`form-control ${sizeClass} ${error ? "is-invalid" : ""}`}
        placeholder={placeHolder}
        disabled={isDisabled}
        value={value}
        onChange={handleChange}
        onBlur={() => {
          if (isRequired && !value.trim()) setError(true);
        }}
        maxLength={maxChar}
        {...props}
      />
      {error && (
        <div className="invalid-feedback">
          {errorMsg || "Field ini wajib diisi."}
        </div>
      )}
      {maxChar && (
        <div className="small text-muted mt-1">
          {value.length}/{maxChar} characters
        </div>
      )}
    </div>
  );
});

export default TextField;
