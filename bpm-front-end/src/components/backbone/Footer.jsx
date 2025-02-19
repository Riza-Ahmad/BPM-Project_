import React from "react";
import { useLocation } from "react-router-dom";
import Icon from "../part/Icon";

function Footer() {
  const location = useLocation();
  let copyrightText = "© 2025. Politeknik Astra / Badan Penjaminan Mutu";

  // Cek jika path termasuk dalam kategori tertentu
  if (location.pathname.startsWith("/evaluasi/ami/")) {
    copyrightText =
      "© 2025. Revalina Azahra Prinawan | Manajemen Informatika - Audit Mutu Internal";
  } else if (location.pathname.startsWith("/tentang")) {
    copyrightText =
      "© 2025. Revalina Azahra Prinawan | Manajemen Informatika - Tentang";
  } else if (location.pathname.startsWith("/berita")) {
    copyrightText =
      "© 2025. Revalina Azahra Prinawan | Manajemen Informatika - Berita";
  } else if (location.pathname.startsWith("/kegiatan")) {
    copyrightText =
      "© 2025. Revalina Azahra Prinawan | Manajemen Informatika - Kegiatan";
  } else if (location.pathname.startsWith("/peraturan")) {
    copyrightText =
      "© 2025. Maritza Alfiani, Fakhri Fauriza Ahmad | Manajemen Informatika - Peraturan";
  } else {
    const pageTitles = {
      "/": "© 2025. Revalina Azahra Prinawan | Manajemen Informatika - Beranda",
    };

    copyrightText = pageTitles[location.pathname] || copyrightText;
  }
  return (
    <footer
      className="py-4"
      style={{ backgroundColor: "rgb(38, 84, 161)", color: "white" }}
    >
      <div className="container">
        <div className="row text-white m-3">
          {/* Column 1: About BPM */}
          <div className="col-lg-5 col-md-6 mb-4">
            <img
              src="../src/assets/bpm-logo.png"
              alt="Logo BPM"
              style={{ width: "200px", height: "auto" }}
            />
            <p style={{ textAlign: "justify" }}>
              Badan Penjamin Mutu (BPM) melaksanakan proses penetapan dan
              pemenuhan standar mutu pengelolaan Politeknik Astra secara
              berkelanjutan guna menjaga dan meningkatkan mutu penyelenggaraan
              program pendidikan dan kegiatan akademik di Politeknik Astra,
              dalam mewujudkan visi dan misi institusi, serta memenuhi kebutuhan
              <i> stakeholders</i>.
            </p>
            <p className="pull-left mt-3 mb-0">{copyrightText}</p>
          </div>

          {/* Column 2: Related Links */}
          <div className="col-lg-3 col-md-6 mb-4">
            <h6 className="mt-5">LINK TERKAIT</h6>
            <ul className="list-unstyled small-text">
              {[
                {
                  name: "LLDIKTI WILAYAH III",
                  link: "https://lldikti3.kemdikbud.go.id/",
                },
                { name: "PDDIKTI", link: "https://pddikti.kemdikbud.go.id/" },
                {
                  name: "SPMI Kemdikbud",
                  link: "https://spmi.kemdikbud.go.id/",
                },
                { name: "BAN-PT", link: "https://banpt.or.id/" },
                { name: "LAM Teknik", link: "https://lamteknik.or.id/" },
                {
                  name: "LAM Infokom",
                  link: "https://laminfokom.or.id/official/",
                },
              ].map((item, index) => (
                <li key={index}>
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div className="col-lg-4 col-md-6 mb-4">
            <h6 className="mt-5">KONTAK</h6>
            <p>
              <strong>Badan Penjaminan Mutu (BPM)</strong>
              <br />
              Email:{" "}
              <a
                href="mailto:bpm@polytechnic.astra.ac.id"
                className="text-white"
              >
                bpm@polytechnic.astra.ac.id
              </a>
              <br />
              Politeknik Astra
              <br />
              Kawasan Industri Delta Silicon 2
              <br />
              Jl. Gaharu Blok F3 No. 1
              <br />
              Cibatu, Kec. Cikarang Selatan, Kab. Bekasi
            </p>
            <Icon
              type="Brands"
              name="instagram"
              cssClass="btn px-1 py-0 text-white"
              title="Visit our Instagram"
              onClick={() =>
                window.open(
                  "https://www.instagram.com/astrapolytechnic/",
                  "_blank"
                )
              }
              style={{
                fontSize: "20px",
                margin: "10px 5px",
                cursor: "pointer",
              }}
            />
            <Icon
              type="Brands"
              name="youtube"
              cssClass="btn px-1 py-0 text-white"
              title="Visit our YouTube channel"
              onClick={() =>
                window.open(
                  "https://www.youtube.com/c/PolmanAstrachannel",
                  "_blank"
                )
              }
              style={{
                fontSize: "20px",
                margin: "10px 5px",
                cursor: "pointer",
              }}
            />
            <Icon
              type="Brands"
              name="facebook"
              cssClass="btn px-1 py-0 text-white"
              title="Visit our Facebook page"
              onClick={() =>
                window.open(
                  "https://www.facebook.com/Astrapolytechnic/",
                  "_blank"
                )
              }
              style={{
                fontSize: "20px",
                margin: "10px 5px",
                cursor: "pointer",
              }}
            />
            <Icon
              type="Brands"
              name="whatsapp"
              cssClass="btn px-1 py-0 text-white"
              title="Contact us on WhatsApp"
              onClick={() =>
                window.open(
                  "https://api.whatsapp.com/send/?phone=6281295582134",
                  "_blank"
                )
              }
              style={{
                fontSize: "20px",
                margin: "10px 5px",
                cursor: "pointer",
              }}
            />
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
