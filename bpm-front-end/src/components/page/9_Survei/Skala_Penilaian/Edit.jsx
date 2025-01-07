import React, { useState, useEffect } from "react";
import SweetAlert from "../../../util/SweetAlert";
import PageTitleNav from "../../../part/PageTitleNav";
import TextField from "../../../part/InputField";
import HeaderForm from "../../../part/HeaderText";
import DropDown from "../../../part/Dropdown";
import Button from "../../../part/Button";
import { useLocation, useParams } from "react-router-dom";
import { API_LINK } from "../../../util/Constants";
import { useIsMobile } from "../../../util/useIsMobile";

export default function EditSkalaPenilaian({ onChangePage }) {
  const isMobile = useIsMobile();
  const { key } = useParams();
  const [formData, setFormData] = useState({
    skp_skala: "",
    skp_deskripsi: "",
    skp_tipe: "",
    skp_status: "",
  });
  const [error, setError] = useState(null);
  const [dropdownData, setDropdownData] = useState({
    skp_tipe: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${API_LINK}/SkalaPenilaian/GetDataSkalaPenilaianById`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ param1: key }), // Gunakan 'key' di sini
          }
        );

        if (!response.ok) throw new Error("Gagal mengambil data");
        const result = await response.json();
        setFormData(result[0] || {});
      } catch (err) {
        setError(err.message);
      }
    };

    if (key) {
      fetchData();
    } else {
      SweetAlert(
        "Error",
        "Key tidak valid atau tidak ditemukan.",
        "error",
        "OK"
      ).then(() => onChangePage("index"));
    }
  }, [key, onChangePage]);

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const response = await fetch(
          `${API_LINK}/SkalaPenilaian/GetDataSkalaPenilaianbyId`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({}),
          }
        );

        if (!response.ok) throw new Error("Gagal mengambil data");

        const result = await response.json();

        // Sesuaikan mapping data dari respon API
        const tipeOptions = result.data?.tipe || []; // Pastikan 'tipe' sesuai dengan respon API

        setDropdownData({
          skp_tipe: tipeOptions.map((item, index) => ({
            key: `tipe-${index}`, // Pastikan menggunakan key unik
            value: item.skp_tipe, // Properti sesuai dengan respon API
            Text: item.skp_tipe, // Properti sesuai dengan respon API
          })),
        });
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
        setError("Gagal mengambil data dropdown");
      }
    };

    fetchDropdownData();
  }, []);

  const handleInputChange = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const { skp_skala, skp_deskripsi, skp_tipe, skp_status } = formData;

      // VALIDASI: Pastikan semua field diisi
      if (!skp_skala || !skp_deskripsi || !skp_tipe) {
        SweetAlert(
          "Peringatan!",
          "Harap lengkapi semua field yang diperlukan.",
          "warning",
          "OK"
        );
        return;
      }

      // VALIDASI: Skala harus berupa angka
      if (!/^-?\d+$/.test(skp_skala)) {
        SweetAlert(
          "Peringatan!",
          "Skala harus berupa angka integer.",
          "warning",
          "OK"
        );
        return;
      }

      // DATA SIAP UNTUK DIKIRIM
      const skalaPenilaianData = {
        skp_skala,
        skp_deskripsi,
        skp_tipe,
        skp_status: skp_status === "Aktif" ? 1 : 0,
        skp_modif_date: new Date().toISOString().slice(0, 19).replace("T", " "),
        skp_modif_by: "Retno Widiastuti",
      };

      // SIMPAN DATA KE API
      const createResponse = await fetch(
        `${API_LINK}/SkalaPenilaian/UpdateSkalaPenilaian`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(skalaPenilaianData),
        }
      );

      if (!createResponse.ok) {
        const errorResponse = await createResponse.json();
        SweetAlert(
          "Gagal!",
          errorResponse.message || "Gagal menyimpan data.",
          "error",
          "OK"
        );
        return;
      }

      // TAMBAH SweetAlert UNTUK BERHASIL
      SweetAlert("Berhasil!", "Data berhasil disimpan.", "success", "OK").then(
        () => onChangePage("index")
      );
    } catch (error) {
      SweetAlert(
        "Gagal!",
        `Terjadi kesalahan: ${error.message}`,
        "error",
        "OK"
      );
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <main className="flex-grow-1 p-3" style={{ marginTop: "80px" }}>
        <div className="d-flex flex-column">
          <PageTitleNav
            title="Edit Skala Penilaian"
            breadcrumbs={[
              { label: "Survei", href: "/survei" },
              { label: "Skala Penilaian", href: "/survei/skala" },
              { label: "Edit Skala Penilaian" },
            ]}
            onClick={() => onChangePage("index")}
          />

          <div
            className={
              isMobile
                ? "shadow p-4 m-2 bg-white rounded"
                : "shadow p-5 m-5 bg-white rounded"
            }
          >
            <HeaderForm label="Formulir Skala Penilaian" />

            <TextField
              label="Skala Penilaian"
              isRequired
              name="skp_skala"
              value={formData.skp_skala || ""}
              onChange={(e) => handleInputChange("skp_skala", e.target.value)}
            />

            <TextField
              label="Deskripsi Skala"
              isRequired
              name="skp_deskripsi"
              value={formData.skp_deskripsi || ""}
              onChange={(e) =>
                handleInputChange("skp_deskripsi", e.target.value)
              }
            />

            <DropDown
              label="Tipe Skala"
              isRequired
              name="skp_tipe"
              value={formData.skp_tipe || ""}
              onChange={(e) => handleInputChange("skp_tipe", e.target.value)}
              arrData={[
                { key: "default", value: "", label: "Pilih tipe skala..." },
                ...(dropdownData.skp_tipe || []), // Use the dynamic data from API
              ]}
            />

            <div className="d-flex justify-content-between mt-4">
              <Button
                classType="primary"
                type="button"
                label="Simpan"
                onClick={handleSubmit}
                width="100%"
              />
              <Button
                classType="danger"
                type="button"
                label="Batal"
                onClick={() => onChangePage("index")}
                width="100%"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
