import { useNavigate } from "react-router-dom";
import Bangunan from "../../../assets/element/bangunan.png";
import Icon from "../../part/Icon";
import Logo from "../../../assets/bpm-logo-biru.png";
import InputField from "../../part/InputField";
import { useRef, useState } from "react";
import Button from "../../part/Button";
import Cookies from "js-cookie"; // Import js-cookie for cookie handling
import { API_LINK } from "../../util/Constants";
import { useFetch } from "../../util/useFetch";

export default function Login() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const ipAddress = await useFetch(
        "https://api.ipify.org/?format=json",
        {},
        "GET"
      );

      if (ipAddress === "ERROR")
        throw new Error("Terjadi kesalahan: Gagal mendapatkan alamat IP.");
      else {
        console.log(formData);
        const data = await useFetch(
          `${API_LINK}/Utilities/Login`,
          formData,
          "POST"
        );

        if (data.status === "LOGIN FAILED") {
          alert("Login failed");
          return;
        } else {
          const userData = data[0];

          const sent = {
            username: userData.username,
            role: userData.Role,
            nama: userData.Nama,
          };

          const jwtToken = await useFetch(
            `${API_LINK}/Utilities/CreateJWTToken`,
            sent,
            "POST"
          );

          console.log(jwtToken);

          const loginRecord = {
            username: formData.username,
            role: userData.RoleID.slice(0, 5),
            ip: ipAddress.ip,
            agent: navigator.userAgent,
            app: "APP14",
          };

          console.log(loginRecord);

          const logRec = await useFetch(
            `${API_LINK}/Utilities/CreateLogLogin`,
            loginRecord,
            "POST"
          );

          if (logRec === "ERROR") {
            throw new Error("Terjadi kesalahan: Gagal LOGIN.");
          }

          Cookies.set(
            "activeUser",
            JSON.stringify({
              ...userData,
              username: formData.username,
              lastLogin: logRec[1]
                ? logRec[1].lastLogin
                : new Date().toISOString().split("T")[0] +
                  " " +
                  new Date().toISOString().split("T")[1], // Mendapatkan waktu saat ini dalam format ISO
            }),
            { expires: 1 } // 1 hari masa berlaku cookie
          );

          navigate("/");
        }
      }
    } catch (error) {
      console.error("Login error", error);
    }
  };

  return (
    <div
      className="latarGradasi"
      style={{ position: "relative", height: "100vh" }}
    >
      {/* Icon di atas sebelah kiri */}
      <div
        className="row"
        style={{
          position: "absolute",
          top: "0",
          left: "0",
          display: "flex",
          alignItems: "center",
          zIndex: 2,
        }}
      >
        <Icon
          type="Bold"
          name="angle-left"
          cssClass="btn px-1 py-0 text"
          style={{
            fontSize: "3rem",
            margin: "2rem",
            cursor: "pointer",
            color: "white",
          }}
          onClick={() => navigate("/")}
        />
      </div>

      {/* Kotak shadow putih di tengah */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "30rem",
          maxWidth: "90%", // Tambahkan fallback jika layar kecil
          height: "30rem",
          backgroundColor: "white",
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
          borderRadius: "8px",
          zIndex: 2,
          padding: "3rem",
        }}
      >
        <img
          src={Logo}
          alt="Logo"
          style={{
            width: "200px",
            height: "auto",
            display: "block", // Memastikan elemen menjadi block
            margin: "0 auto", // Mengatur margin horizontal auto agar rata tengah
            marginBottom: "3rem",
          }}
        />

        <InputField
          label="Username"
          value={formData.username}
          onChange={(e) =>
            setFormData({ ...formData, username: e.target.value })
          }
          isRequired={true}
          style={{ textAlign: "center" }}
        />
        <InputField
          type="password"
          label="Password"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          isRequired={true}
          style={{ textAlign: "center" }}
        />
        <div className="mt-5">
          <Button
            classType="primary"
            type="button"
            label="Masuk"
            width="100%"
            onClick={handleLogin}
          />
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
