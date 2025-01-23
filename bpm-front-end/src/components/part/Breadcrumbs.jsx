import React from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const Breadcrumbs = ({
  breadcrumbs = null
}) => {
  const navigate = useNavigate(); // Initialize navigate function

  return (
    <header>
      <nav className="ms-1">
        <ol className="breadcrumb">
          {breadcrumbs &&
            breadcrumbs.map((breadcrumb, index) => (
              <li
                key={index}
                className={`breadcrumb-item ${breadcrumb.href ? "" : "active"}`}
                aria-current={breadcrumb.href ? undefined : "page"}
              >
                {breadcrumb.href ? (
                  <span
                    style={{
                      color: "#575050",
                      textDecoration: "none",
                      cursor: "pointer",
                    }}
                    onClick={() => navigate(breadcrumb.href)} // Use navigate for programmatic routing
                  >
                    {breadcrumb.label}
                  </span>
                ) : (
                  <span>{breadcrumb.label}</span>
                )}
              </li>
            ))}
        </ol>
      </nav>
    </header>
  );
};

Breadcrumbs.propTypes = {
  breadcrumbs: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      href: PropTypes.string,
    })
  )
};

export default Breadcrumbs;
