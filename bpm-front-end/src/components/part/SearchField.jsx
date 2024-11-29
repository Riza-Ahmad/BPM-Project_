import { forwardRef } from "react";
import { FaSearch } from "react-icons/fa";

const SearchField = forwardRef(function SearchField(
  { id, placeHolder = "Cari...", onChange, isDisabled = false, ...props },
  ref
) {
  return (
    <div
      className="input-group mb-3"
      style={{ borderRadius: "15px", boxShadow: "0px 2px 5px rgba(0,0,0,0.2)" }}
    >
      <input
        id={id}
        name={id}
        type="text"
        className="form-control border-0"
        placeholder={placeHolder}
        ref={ref}
        disabled={isDisabled}
        onChange={(e) => onChange(e.target.value)}
        style={{
          borderRadius: "15px",
          paddingLeft: "20px",
          paddingRight: "40px",
        }}
        {...props}
      />
      <span className="input-group-text bg-transparent border-0 position-absolute end-0 me-3 mt-1">
        <FaSearch color="#AAA7A7" />
      </span>
    </div>
  );
});

export default SearchField;
