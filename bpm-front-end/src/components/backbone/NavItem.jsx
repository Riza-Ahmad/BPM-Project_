import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useFetch } from "../util/useFetch";
import { API_LINK } from "../util/Constants";
import Cookies from "js-cookie";
import Icon from "../part/Icon";

export default function NavItem() {
  const navigate = useNavigate();
  const [menuItems, setMenuItems] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const [openGrandchild, setOpenGrandchild] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [jumlahNotifikasi, setJumlahNotifikasi] = useState([]);

  let username = "";
  const cookie = Cookies.get("activeUser");
  if (cookie) username = JSON.parse(cookie).username;

  const handleNavigation = (linkMenu, idMenu) => {
    navigate(linkMenu, {
      state: { idMenu },
    });
  };

  const toggleDropdown = (menuId) => {
    setOpenDropdown(openDropdown === menuId ? null : menuId);
    setOpenSubmenu(null);
    setOpenGrandchild(null);
  };

  const toggleSubmenu = (submenu) => {
    setOpenSubmenu(openSubmenu === submenu ? null : submenu);
    setOpenGrandchild(null);
  };

  const toggleGrandchild = (grandchild) => {
    setOpenGrandchild(openGrandchild === grandchild ? null : grandchild);
  };

  useEffect(() => {
    const activeUser = Cookies.get("activeUser");
    if (activeUser) {
      setIsLoggedIn(true);
    }

    const fetchMenuItems = async () => {
      const data = await useFetch(
        `${API_LINK}/Utilities/GetListMenu`,
        {},
        "POST"
      );
      if (data !== "ERROR") {
        setMenuItems(buildMenuHierarchy(data));
      } else {
        console.error("Gagal mengambil data menu");
      }
    };

    fetchMenuItems();
  }, []);

  useEffect(() => {
    const fetchNotifikasi = async () => {
      try {
        const data = await useFetch(
          `${API_LINK}/Utilities/GetCountNotifikasi`,
          { untuk: username },
          "POST"
        );
        if (data === "ERROR") {
          throw new Error("Gagal mengambil data");
        }
        setJumlahNotifikasi(data[0].JumlahNotifikasiBelum || 0);
      } catch (error) {
        console.error("Error fetching notifications:", error.message);
      }
    };

    fetchNotifikasi();
  }, []);

  const buildMenuHierarchy = (data) => {
    const menuMap = {};
    const menuHierarchy = [];

    data.forEach((item) => {
      menuMap[item.idMenu] = { ...item, children: [] };
    });

    data.forEach((item) => {
      if (item.parentMenu) {
        menuMap[item.parentMenu].children.push(menuMap[item.idMenu]);
      } else {
        menuHierarchy.push(menuMap[item.idMenu]);
      }
    });

    return menuHierarchy;
  };

  return (
    <nav>
      <ul className="nav">
        {menuItems.map((menu) => (
          <li
            key={menu.idMenu}
            className={`nav-item ${menu.children.length > 0 ? "dropdown" : ""}`}
          >
            {menu.children.length > 0 ? (
              <>
                <button
                  className="nav-link dropdown-toggle"
                  onClick={() => toggleDropdown(menu.idMenu)}
                >
                  {menu.namaMenu}
                </button>
                {openDropdown === menu.idMenu && (
                  <ul className="dropdown-menu">
                    {menu.children.map((child) => (
                      <li
                        key={child.idMenu}
                        className={
                          child.children.length > 0 ? "dropdown-submenu" : ""
                        }
                      >
                        {child.children.length > 0 ? (
                          <button
                            className="dropdown-item dropdown-toggle"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleSubmenu(child.idMenu);
                            }}
                          >
                            {child.namaMenu}
                          </button>
                        ) : (
                          <button
                            className="dropdown-item"
                            onClick={() =>
                              handleNavigation(child.linkMenu, child.idMenu)
                            }
                          >
                            {child.namaMenu}
                          </button>
                        )}
                        {openSubmenu === child.idMenu && (
                          <ul className="dropdown-menu">
                            {child.children.map((grandchild) => (
                              <li key={grandchild.idMenu}>
                                <button
                                  className="dropdown-item"
                                  onClick={() =>
                                    handleNavigation(
                                      grandchild.linkMenu,
                                      grandchild.idMenu
                                    )
                                  }
                                >
                                  {grandchild.namaMenu}
                                </button>
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </>
            ) : (
              <button
                className="nav-link"
                onClick={() => handleNavigation(menu.linkMenu, menu.idMenu)}
              >
                {menu.namaMenu}
              </button>
            )}
          </li>
        ))}
        <li className="nav-item ms-3">
          {isLoggedIn ? (
            <button
              className="btn bg-white"
              onClick={() => handleNavigation("/profile", null)}
            >
              <img
                src="https://cdn-icons-png.flaticon.com/512/1077/1077012.png"
                alt="User Icon"
                style={{ width: "24px", height: "24px" }}
              />
              <span
                className="badge rounded-pill bg-danger position-absolute top-0 end-0"
                style={{
                  fontSize: "0.8rem",
                  marginTop: "0.6rem",
                  marginRight: "1rem",
                }}
              >
                {jumlahNotifikasi}
              </span>
            </button>
          ) : (
            <button
              className="btn bg-white"
              onClick={() => handleNavigation("/login", null)}
            >
              Masuk
            </button>
          )}
        </li>
      </ul>
    </nav>
  );
}
