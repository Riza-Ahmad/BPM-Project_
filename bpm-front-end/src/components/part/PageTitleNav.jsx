import React from "react";
import PropTypes from "prop-types";
import Icon from "./Icon";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const PageTitleNav = ({ 
    title, 
    breadcrumbs, 
    onClick = () => {} 
}) => {
  const navigate = useNavigate(); // Initialize navigate function

  return (
    <header>
        <div className="row" style={{ display: "flex", alignItems: "center" }}>
            <h2 style={{ color: "#2654A1", margin: "0", }}>
                <Icon
                    type="Bold"
                    name="angle-left"
                    cssClass="btn px-1 py-0 text" 
                    onClick={onClick} 
                    style={{ fontSize: "22px", margin: "10px 10px", cursor: "pointer", color: "#2654A1" }}
                />
                {title}
            </h2>
        </div>

        <nav className="ms-1">
            <ol className="breadcrumb ms-5">
                {breadcrumbs.map((breadcrumb, index) => (
                    <li
                        key={index}
                        className={`breadcrumb-item ${breadcrumb.href ? "" : "active"}`}
                        aria-current={breadcrumb.href ? undefined : "page"}
                    >
                        {breadcrumb.href ? (
                            <span
                                style={{
                                    color: '#575050',
                                    textDecoration: 'none', 
                                    cursor: "pointer"
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

PageTitleNav.propTypes = {
  title: PropTypes.string.isRequired,
  breadcrumbs: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      href: PropTypes.string
    })
  ).isRequired,
};

export default PageTitleNav;
