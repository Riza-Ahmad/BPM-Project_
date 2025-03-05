import Swal from "sweetalert2";
import Bangunan from "../../../assets/element/bangunan.png";
import Logo from "../../../assets/bpm-logo-biru.png";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import HeaderText from "../../part/HeaderText";
import { useEffect, useState } from "react";
import { useFetch } from "../../util/useFetch";
import { API_LINK } from "../../util/Constants";

export default function Profil() {
  const navigate = useNavigate();
  let activeUser = "";
  let username = "";
  let lastLogin = "";
  let role = "";
  const cookie = Cookies.get("activeUser");
  if (cookie) activeUser = JSON.parse(cookie).Nama;
  if (cookie) username = JSON.parse(cookie).username;
  if (cookie) lastLogin = JSON.parse(cookie).lastLogin;
  if (cookie) role = JSON.parse(cookie).Role;
  const lastLoginDate = new Date(lastLogin);

  const formattedLastLogin =
    lastLoginDate.toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }) +
    " " +
    lastLoginDate.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    }) +
    " WIB";

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Konfirmasi",
      text: "Apakah Anda yakin ingin keluar?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, Keluar",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      navigate("/logout");
    }
  };

  const [jumlahNotifikasi, setJumlahNotifikasi] = useState([]);

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

  return (
    <div
      className="latarGradasi"
      style={{ position: "relative", height: "100vh" }}
    >
      {/* Kotak shadow putih di tengah */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "30rem",
          maxWidth: "90%",
          height: "30rem",
          backgroundColor: "white",
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
          borderRadius: "8px",
          zIndex: 2,
          padding: "3rem",
          textAlign: "center",
        }}
      >
        <img
          src={Logo}
          alt="Logo"
          style={{
            width: "200px",
            height: "auto",
            display: "block",
            margin: "0 auto",
            marginBottom: "1rem",
          }}
        />

        <div className="card-header p-2 mb-2 rounded-4 bg-body-secondary d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center me-4">
            <i
              className={`fi fi-rs-circle-user`}
              style={{
                fontSize: "3.5rem",
                margin: "0.5rem 1rem 0rem 1rem",
                color: "#2654a1",
              }}
            ></i>
            <div className="d-flex flex-column align-items-start me-4 gap-2">
              <HeaderText
                label={activeUser + " (" + role + ")"}
                ukuran="1.2rem"
                warna="#2654a1"
                alignText="left"
                marginTop="0rem"
                marginBottom="0rem"
              />

              <HeaderText
                label={"Login terakhir: " + formattedLastLogin}
                ukuran="0.8rem"
                warna="#575050"
                alignText="left"
                marginTop="0rem"
                marginBottom="0rem"
              />
            </div>
          </div>
        </div>
        <div
          className="card-header p-2 mb-2 rounded-4 bg-body-secondary d-flex justify-content-between align-items-center"
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/notifikasi")}
        >
          <div className="d-flex align-items-center me-4 position-relative">
            <i
              className={`fi fi-rs-bell-notification-social-media`}
              style={{
                fontSize: "1.5rem",
                margin: "0rem 1rem 0rem 1rem",
                color: "#575050",
              }}
            ></i>
            <span
              className="badge rounded-pill bg-danger position-absolute top-3  translate-middle"
              style={{
                fontSize: ".7em",
                zIndex: 2,
                left: 40,
              }}
            >
              {jumlahNotifikasi}
            </span>
            <HeaderText
              label="Notifikasi"
              ukuran="1rem"
              warna="#575050"
              alignText="left"
              marginTop="0rem"
              marginBottom="0rem"
            />
          </div>
        </div>

        <div
          className="card-header p-2 mb-2 rounded-4 bg-body-secondary d-flex justify-content-between align-items-center"
          style={{ cursor: "pointer" }}
        >
          <div className="d-flex align-items-center me-4">
            <i
              className={`fi fi-rs-book-bookmark`}
              style={{
                fontSize: "1.5rem",
                margin: "0rem 1rem 0rem 1rem",
                color: "#575050",
              }}
            ></i>
            <HeaderText
              label="Panduan AMI"
              ukuran="1rem"
              warna="#575050"
              alignText="left"
              marginTop="0rem"
              marginBottom="0rem"
            />
          </div>
        </div>

        {/* Tombol logout dengan SweetAlert */}
        <div
          className="card-header p-2 mb-2 rounded-4 bg-danger d-flex justify-content-between align-items-center"
          style={{ cursor: "pointer", textDecoration: "none" }}
          onClick={handleLogout}
        >
          <div className="d-flex align-items-center me-4">
            <i
              className={`fi fi-rs-leave`}
              style={{
                fontSize: "1.5rem",
                margin: "0rem 1rem 0rem 1rem",
                color: "white",
              }}
            ></i>
            <HeaderText
              label="Keluar"
              warna="white"
              ukuran="1rem"
              alignText="left"
              marginTop="0rem"
              marginBottom="0rem"
            />
          </div>
        </div>
      </div>

      {/* Gambar di bawah */}
      <img
        src={Bangunan}
        alt="Bangunan"
        style={{
          position: "absolute",
          bottom: "0",
          width: "100%",
          left: "0",
          zIndex: 1,
        }}
      />
    </div>
  );
}
