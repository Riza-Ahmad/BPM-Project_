import { forwardRef, useState, useImperativeHandle, useRef } from "react";

const DropDown = forwardRef(function DropDown(
  {
    arrData,
    type = "",
    label = "",
    forInput,
    isRequired = false,
    isDisabled = false,
    errorMessage,
    showLabel = true,
    value,
    onChange,
    ...props
  },
  ref
) {
  const [error, setError] = useState(false);
  const selectRef = useRef(null);

  // Expose reset, validate, and get value methods to the parent
  useImperativeHandle(ref, () => ({
    reset() {
      setError(false);
    },
    validate() {
      if (isRequired && (!value || value.trim())) {
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
      selectRef.current.focus();
    },
  }));

  let placeholder = "";

  switch (type) {
    case "pilih":
      placeholder = (
        <option value="" disabled>
          {"-- Pilih " + label + " --"}
        </option>
      );
      break;
    case "semua":
      placeholder = (
        <option value="" disabled>
          -- Semua --
        </option>
      );
      break;
    default:
      placeholder = null;
      break;
  }

  const handleChange = (e) => {
    onChange(e);
    if (isRequired) {
      setError(!e.target.value.trim());
    }
  };

  return (
    <div className="mb-3">
      {showLabel && (
        <label htmlFor={forInput} className="form-label fw-bold">
          {label}
          {isRequired ? <span className="text-danger"> *</span> : ""}
        </label>
      )}
      <select
        ref={selectRef}
        className={`form-select ${error ? "is-invalid" : ""}`}
        id={forInput}
        name={forInput}
        disabled={isDisabled}
        value={value}
        onChange={handleChange} // Call the parent onChange
        {...props}
      >
        {placeholder}
        {arrData &&
          arrData.length > 0 &&
          arrData.map((data) => {
            return (
              <option key={data.Value} value={data.Value}>
                {data.Text}
              </option>
            );
          })}
      </select>
      {error && (
        <div className="invalid-feedback">
          {errorMessage || "Field ini wajib diisi."}
        </div>
      )}
    </div>
  );
});

export default DropDown;
