import React from "react";
import PropTypes from "prop-types";
import Icon from "./Icon";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { useLocation } from "react-router-dom";

const PageTitleNav = ({
  title,
  breadcrumbs = null, // Allow breadcrumbs to be null
  color = "#2654A1",
  onClick = () => {},
}) => {
  const navigate = useNavigate(); // Initialize navigate function
  const location = useLocation();
  const idMenu = location.state?.idMenu;

  return (
    <header>
      <div className="row" style={{ display: "flex", alignItems: "center" }}>
        <h2 style={{ color: color, margin: "0" }}>
          <Icon
            type="Bold"
            name="angle-left"
            cssClass="btn px-1 py-0 text"
            onClick={onClick}
            style={{
              fontSize: "22px",
              margin: "10px 10px",
              cursor: "pointer",
              color: color,
            }}
          />
          {title}
        </h2>
      </div>

      <nav className="ms-1">
        <ol className="breadcrumb ms-5">
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
                    onClick={() =>
                      navigate(breadcrumb.href, {
                        state: {
                          idMenu: idMenu,
                        },
                      })
                    }
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

PageTitleNav.propTypes = {
  title: PropTypes.string.isRequired,
  breadcrumbs: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      href: PropTypes.string,
    })
  ), // Removed `.isRequired` to make it optional
  color: PropTypes.string,
  onClick: PropTypes.func,
};

export default PageTitleNav;
