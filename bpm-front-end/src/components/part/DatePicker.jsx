import { forwardRef, useImperativeHandle, useState } from "react";

const DatePicker = forwardRef(function DatePicker(
  {
    id,
    label = "",
    size = "md",
    errorMsg = "Field ini wajib diisi.",
    isRequired = false,
    isDisabled = false,
    ...props
  },
  ref
) {
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);

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
      document.getElementById(id)?.focus();
    },
  }));

  const sizeClass =
    size === "lg" ? "form-control-lg" : size === "sm" ? "form-control-sm" : "";

  const handleChange = (e) => {
    const newValue = e.target.value;
    setValue(newValue);
    if (isRequired) {
      setError(!newValue.trim());
    }
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
        id={id}
        name={id}
        type="date"
        className={`form-control ${sizeClass} ${error ? "is-invalid" : ""}`}
        value={value}
        onChange={handleChange}
        onBlur={() => {
          if (isRequired && !value.trim()) setError(true);
        }}
        disabled={isDisabled}
        {...props}
      />
      {error && <span className="text-danger small">{errorMsg}</span>}
    </div>
  );
});

export default DatePicker;
