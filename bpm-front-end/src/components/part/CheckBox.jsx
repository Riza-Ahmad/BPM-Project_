import { forwardRef, useState, useImperativeHandle } from "react";

const CheckBox = forwardRef(function CheckBox(
  {
    arrData = [],
    label = "",
    name,
    isRequired = false,
    isDisabled = false,
    errorMessage,
    showLabel = true,
    values = [],
    onChange,
    col = "col-6",
    ...props
  },
  ref
) {
  const [error, setError] = useState(false);
  console.log("Jalan jalan");
  console.log(values);
  // Expose reset, validate, and get value methods to the parent
  useImperativeHandle(ref, () => ({
    reset() {
      setError(false);
    },
    validate() {
      if (isRequired && values.length === 0) {
        setError(true);
        return false;
      }
      setError(false);
      return true;
    },
    get value() {
      return values;
    },
  }));

  const handleChange = (e, checkedValue) => {
    if (!onChange) return; // Jangan lakukan apa pun jika onChange tidak didefinisikan

    const newValue = e.target.checked
      ? [...values, checkedValue]
      : values.filter((val) => val !== checkedValue);

    onChange({
      target: {
        name,
        value: newValue,
      },
    });

    if (isRequired) {
      setError(newValue.length === 0);
    }
  };

  return (
    <div className="mb-3">
      {showLabel && (
        <label className="form-label fw-bold">
          {label}
          {isRequired ? <span className="text-danger"> *</span> : ""}
        </label>
      )}
      <div className="row">
        {arrData.map((data, index) => (
          <div className={col} key={data.Value}>
            <div className="form-check">
              <input
                className={`form-check-input ${error ? "is-invalid" : ""}`}
                type="checkbox"
                id={`${name}-${data.Value}`}
                name={name}
                value={data.Value}
                checked={values.includes(data.Value)}
                onChange={(e) => handleChange(e, data.Value)}
                disabled={isDisabled}
                {...props}
              />
              <label
                className="form-check-label"
                htmlFor={`${name}-${data.Value}`}
              >
                {data.Text}
              </label>
            </div>
          </div>
        ))}
      </div>
      {error && (
        <div className="invalid-feedback d-block">
          {errorMessage || "Pilih setidaknya satu opsi."}
        </div>
      )}
    </div>
  );
});

export default CheckBox;
