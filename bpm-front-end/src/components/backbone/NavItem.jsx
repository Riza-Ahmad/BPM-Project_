import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function NavItem() {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [openSubmenu, setOpenSubmenu] = useState(null);

  const toggleDropdown = (menu) => {
    if (openDropdown === menu) {
      setOpenDropdown(null);
      setOpenSubmenu(null);
    } else {
      setOpenDropdown(menu);
      setOpenSubmenu(null);
    }
  };

  const toggleSubmenu = (submenu) => {
    setOpenSubmenu(openSubmenu === submenu ? null : submenu); // Toggle submenu
  };

  return (
    <>
      {/* Beranda */}
      <li className="nav-item">
        <Link className="nav-link" aria-current="page" to="/">
          Beranda
        </Link>
      </li>

      {/* Tentang */}
      <li className="nav-item">
        <Link className="nav-link" aria-current="page" to="/tentang">
          Tentang
        </Link>
      </li>

      {/* Berita */}
      <li className="nav-item">
        <Link className="nav-link" aria-current="page" to="/berita">
          Berita
        </Link>
      </li>

      {/* Kegiatan */}
      <li className="nav-item dropdown">
        <button
          className="nav-link dropdown-toggle"
          onClick={() => toggleDropdown("kegiatan")}
        >
          Kegiatan
        </button>
        {openDropdown === "kegiatan" && (
          <ul className="dropdown-menu">
            <li>
              <Link className="dropdown-item" to="/kegiatan/jadwal">
                Jadwal Kegiatan BPM
              </Link>
            </li>
            <li>
              <Link className="dropdown-item" to="/kegiatan/dokumentasi">
                Dokumentasi Kegiatan BPM
              </Link>
            </li>
          </ul>
        )}
      </li>

      {/* SPMI */}
      <li className="nav-item dropdown">
        <button
          className="nav-link dropdown-toggle"
          aria-expanded={openDropdown === "spmi"}
          onClick={() => toggleDropdown("spmi")}
        >
          SPMI
        </button>
        {openDropdown === "spmi" && (
          <ul className="dropdown-menu">
            <li className="dropdown-submenu">
              <button
                className="dropdown-item dropdown-toggle"
                aria-expanded={openSubmenu === "siklus"}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleSubmenu("siklus");
                }}
              >
                Siklus SPMI
              </button>
              {openSubmenu === "siklus" && (
                <ul className="dropdown-menu">
                  <li>
                    <Link className="dropdown-item" to="/spmi/siklus/penetapan">
                      Penetapan
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="dropdown-item"
                      to="/spmi/siklus/pelaksanaan"
                    >
                      Pelaksanaan
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/spmi/siklus/evaluasi">
                      Evaluasi
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="dropdown-item"
                      to="/spmi/siklus/pengendalian"
                    >
                      Pengendalian
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="dropdown-item"
                      to="/spmi/siklus/peningkatan"
                    >
                      Peningkatan
                    </Link>
                  </li>
                </ul>
              )}
            </li>
            <li>
              <Link className="dropdown-item" to="/spmi/kebijakan-mutu">
                Pernyataan dan Kebijakan Mutu
              </Link>
            </li>
            <li className="dropdown-submenu">
              <button
                className="dropdown-item dropdown-toggle"
                aria-expanded={openSubmenu === "dokumen-spmi"}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleSubmenu("dokumen-spmi");
                }}
              >
                Dokumen SPMI
              </button>
              {openSubmenu === "dokumen-spmi" && (
                <ul className="dropdown-menu">
                  <li>
                    <Link
                      className="dropdown-item"
                      to="/spmi/dokumen/kebijakan"
                    >
                      Kebijakan SPMI
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/spmi/dokumen/manual">
                      Manual SPMI
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/spmi/dokumen/standar">
                      Standar SPMI
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/spmi/dokumen/formulir">
                      Formulir SPMI
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/spmi/dokumen/sop">
                      SOP
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/spmi/dokumen/template">
                      Template Dokumen SPMI
                    </Link>
                  </li>
                </ul>
              )}
            </li>
          </ul>
        )}
      </li>

      {/* SPME */}
      <li className="nav-item dropdown">
        <button
          className="nav-link dropdown-toggle"
          onClick={() => toggleDropdown("spme")}
          aria-expanded={openDropdown === "spme"}
        >
          SPME
        </button>
        {openDropdown === "spme" && (
          <ul className="dropdown-menu">
            <li className="dropdown-submenu">
              <button
                className="dropdown-item dropdown-toggle"
                aria-expanded={openSubmenu === "status"}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleSubmenu("status");
                }}
              >
                Status Akreditasi
              </button>
              {openSubmenu === "status" && (
                <ul className="dropdown-menu">
                  <li>
                    <Link className="dropdown-item" to="/spme/status/tabel">
                      Tabel Ringkasan Status Akreditasi
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="dropdown-item"
                      to="/spme/status/program-studi"
                    >
                      Akreditasi Program Studi
                    </Link>
                  </li>
                </ul>
              )}
            </li>
            <li>
              <Link className="dropdown-item" to="/spme/panduan">
                Panduan Akreditasi
              </Link>
            </li>
          </ul>
        )}
      </li>

      {/* IKU & IKT */}
      <li className="nav-item dropdown">
        <button
          className="nav-link dropdown-toggle"
          aria-expanded={openDropdown === "iku-ikt"}
          onClick={() => toggleDropdown("iku-ikt")}
        >
          IKU & IKT
        </button>
        {openDropdown === "iku-ikt" && (
          <ul className="dropdown-menu">
            <li>
              <Link className="dropdown-item" to="/iku/sk">
                Surat Keputusan
              </Link>
            </li>
            <li>
              <Link className="dropdown-item" to="/iku/lampiran">
                Lampiran SK
              </Link>
            </li>
          </ul>
        )}
      </li>

      {/* Audit */}
      <li className="nav-item">
        <Link className="nav-link" aria-current="page" to="/audit">
          Audit
        </Link>
      </li>

      {/* Survei */}
      <li className="nav-item dropdown">
        <button
          className="nav-link dropdown-toggle"
          onClick={() => toggleDropdown("survei")}
        >
          Survei
        </button>
        {openDropdown === "survei" && (
          <ul className="dropdown-menu">
            <li>
              <Link className="dropdown-item" to="/survei/kriteria">
                Kriteria Survei
              </Link>
            </li>
            <li>
              <Link className="dropdown-item" to="/survei/skala">
                Skala Penilaian
              </Link>
            </li>
            <li>
              <Link className="dropdown-item" to="/survei/pertanyaan">
                Pertanyaan Survei
              </Link>
            </li>
            <li>
              <Link className="dropdown-item" to="/survei/template">
                Template Survei
              </Link>
            </li>
            <li>
              <Link className="dropdown-item" to="/survei">
                Survei
              </Link>
            </li>
            <li>
              <Link className="dropdown-item" to="/survei/daftar">
                Daftar Survei
              </Link>
            </li>
          </ul>
        )}
      </li>

      {/* Peraturan */}
      <li className="nav-item dropdown">
        <button
          className="nav-link dropdown-toggle"
          onClick={() => toggleDropdown("peraturan")}
        >
          Peraturan
        </button>
        {openDropdown === "peraturan" && (
          <ul className="dropdown-menu">
            <li>
              <Link className="dropdown-item" to="/peraturan/kebijakan">
                Kebijakan Peraturan
              </Link>
            </li>
            <li>
              <Link className="dropdown-item" to="/peraturan/eksternal">
                Peraturan Eksternal
              </Link>
            </li>
            <li>
              <Link className="dropdown-item" to="/peraturan/aps">
                Instrumen APS
              </Link>
            </li>
          </ul>
        )}
      </li>

      {/* Masuk Button */}
      <li className="nav-item ms-3">
        <button className="btn bg-white">Masuk</button>
      </li>
    </>
  );
}
