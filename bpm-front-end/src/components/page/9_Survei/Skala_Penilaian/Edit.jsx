import React, { useState, useEffect } from "react";
import SweetAlert from "../../../util/SweetAlert";
import PageTitleNav from "../../../part/PageTitleNav";
import TextField from "../../../part/InputField";
import HeaderForm from "../../../part/HeaderText";
import DropDown from "../../../part/Dropdown";
import Button from "../../../part/Button";
import { useParams } from "react-router-dom";
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

  const tipeOptions = [
    { id: 0, value: "", label: "Pilih tipe skala..." },
    { id: 1, value: "TextArea", label: "TextArea" },
    { id: 2, value: "TextBox", label: "TextBox" },
    { id: 3, value: "CheckBox", label: "CheckBox" },
    { id: 4, value: "RadioButton", label: "RadioButton" }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${API_LINK}/SkalaPenilaian/GetDataSkalaPenilaianById`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ param1: key }),
          }
        );

        if (!response.ok) throw new Error("Gagal mengambil data");
        const result = await response.json();
        
        if (result && result[0]) {
          setFormData(result[0]);
        }
      } catch (err) {
        setError(err.message);
        SweetAlert("Error", err.message, "error", "OK");
      }
    };

    if (key) {
      fetchData();
    }
  }, [key]);

  const handleInputChange = (name, value) => {
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const { skp_skala, skp_deskripsi, skp_tipe, skp_status } = formData;

      if (!skp_skala || !skp_deskripsi || !skp_tipe) {
        SweetAlert(
          "Peringatan!",
          "Harap lengkapi semua field yang diperlukan.",
          "warning",
          "OK"
        );
        return;
      }

      if (!/^-?\d+$/.test(skp_skala)) {
        SweetAlert(
          "Peringatan!",
          "Skala harus berupa angka integer.",
          "warning",
          "OK"
        );
        return;
      }

      const skalaPenilaianData = {
        skp_id: key,
        skp_skala: skp_skala,
        skp_deskripsi: skp_deskripsi,
        skp_tipe: skp_tipe,
        skp_status: skp_status === "Aktif" ? 1 : 0,
        skp_modif_date: new Date().toISOString().slice(0, 19).replace("T", " "),
        skp_modif_by: "Retno Widiastuti"
      };

      console.log("Sending update request:", skalaPenilaianData);

      const createResponse = await fetch(
        `${API_LINK}/SkalaPenilaian/UpdateSkalaPenilaian`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ param1: skalaPenilaianData }),
        }
      );

      const responseData = await createResponse.json();
      console.log("Update response:", responseData);

      if (!createResponse.ok) {
        throw new Error(responseData.message || "Gagal menyimpan data");
      }

      SweetAlert("Berhasil!", "Data berhasil disimpan.", "success", "OK").then(
        () => onChangePage("index")
      );
    } catch (error) {
      console.error("Error in update:", error);
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
              onChange={(e) => handleInputChange("skp_deskripsi", e.target.value)}
            />

            <DropDown
              label="Tipe Skala"
              isRequired
              name="skp_tipe"
              value={formData.skp_tipe || ""}
              onChange={(e) => handleInputChange("skp_tipe", e.target.value)}
              arrData={tipeOptions}
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