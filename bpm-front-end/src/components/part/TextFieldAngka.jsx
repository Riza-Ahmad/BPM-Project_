import { forwardRef } from "react";

const TextFieldAngka = forwardRef(function TextFieldAngka(
  {
    id,
    label = "",
    size = "md",
    placeHolder = "",
    errorMsg,
    isRequired = false,
    isDisabled = false,
    ...props
  },
  ref
) {
  const sizeClass =
    size === "lg" ? "form-control-lg" : size === "sm" ? "form-control-sm" : "";

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
      <input
        id={id}
        name={id}
        type="number" // Tipe input khusus angka
        className={`form-control ${sizeClass}`}
        placeholder={placeHolder}
        ref={ref}
        disabled={isDisabled}
        {...props}
      />
    </div>
  );
});

export default TextFieldAngka;
