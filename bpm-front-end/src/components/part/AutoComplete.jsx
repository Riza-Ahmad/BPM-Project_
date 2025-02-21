import {
  forwardRef,
  useState,
  useRef,
  useImperativeHandle,
  useEffect,
} from "react";
import { FaChevronDown } from "react-icons/fa";

const AutoComplete = forwardRef(function AutoComplete(
  {
    arrData,
    label = "",
    forInput,
    isRequired = false,
    errorMessage,
    showLabel = true,
    value,
    onChange,
    isDisabled = false,
    ...props
  },
  ref
) {
  const [searchTerm, setSearchTerm] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [firstOpen, setFirstOpen] = useState(false);
  const [error, setError] = useState(false);
  const inputRef = useRef(null);

  useImperativeHandle(ref, () => ({
    reset() {
      setSearchTerm("");
      setError(false);
    },
    validate() {
      if (isRequired && !value) {
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
  }));

  useEffect(() => {
    const matchedData = arrData?.find((data) => data.Value === value);
    if (matchedData) {
      setSearchTerm(matchedData.Text);
    }
  }, [value, arrData]);

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    setDropdownOpen(true);
    setFirstOpen(true);
  };

  const handleOptionClick = (selectedValue, text) => {
    onChange({ target: { value: selectedValue } });
    setSearchTerm(text);
    setDropdownOpen(false);
    setFirstOpen(false);
  };

  const filteredData =
    Array.isArray(arrData) && arrData.length > 0
      ? !firstOpen
        ? arrData
        : arrData.filter((data) =>
            data.Text.toLowerCase().includes(searchTerm.toLowerCase())
          )
      : [];

  return (
    <div className="mb-3 position-relative">
      {showLabel && (
        <label htmlFor={forInput} className="form-label fw-bold">
          {label}
          {isRequired ? <span className="text-danger"> *</span> : ""}
        </label>
      )}

      <div className="dropdown-wrapper" style={{ position: "relative" }}>
        <input
          ref={inputRef}
          type="text"
          className={`form-control ${error ? "is-invalid" : ""}`}
          placeholder={`Pilih ${label}...`}
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={() => setDropdownOpen(true)}
          disabled={isDisabled}
          {...props}
        />

        <FaChevronDown
          className="dropdown-icon"
          style={{
            position: "absolute",
            top: "50%",
            right: "10px",
            transform: "translateY(-50%)",
          }}
        />

        {dropdownOpen && filteredData.length > 0 && (
          <ul
            className="dropdown-menu show"
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              width: "100%",
              zIndex: 10,
              maxHeight: "200px",
              overflowY: "auto",
              background: "white",
              border: "1px solid #ddd",
              listStyle: "none",
              padding: 0,
              margin: 0,
            }}
          >
            {filteredData.map((data) => (
              <li
                key={data.Value}
                onClick={() => handleOptionClick(data.Value, data.Text)}
                style={{
                  padding: "10px",
                  cursor: "pointer",
                  borderBottom: "1px solid #f1f1f1",
                }}
              >
                {data.Text}
              </li>
            ))}
          </ul>
        )}
      </div>

      {error && (
        <div className="invalid-feedback">
          {errorMessage || "Field ini wajib diisi."}
        </div>
      )}
    </div>
  );
});

export default AutoComplete;
