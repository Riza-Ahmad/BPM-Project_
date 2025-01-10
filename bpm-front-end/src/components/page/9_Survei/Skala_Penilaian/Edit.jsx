import React, { useState, useEffect } from "react";
import SweetAlert from "../../../util/SweetAlert";
import PageTitleNav from "../../../part/PageTitleNav";
import HeaderForm from "../../../part/HeaderText";
import DropDown from "../../../part/Dropdown";
import Button from "../../../part/Button";
import { useParams } from "react-router-dom";
import { API_LINK } from "../../../util/Constants";
import { useIsMobile } from "../../../util/useIsMobile";

export default function Edit({ onChangePage }) {
  const isMobile = useIsMobile();
  const { key } = useParams();
  const [formData, setFormData] = useState({
    skp_tipe: "",
    skp_status: "",
    scale: 4,
    descriptions: [],
    checkedValues: [],
    name: "",
  });

  const tipeOptions = [
    { id: 1, value: "TextArea", label: "TextArea" },
    { id: 2, value: "TextBox", label: "TextBox" },
    { id: 3, value: "CheckBox", label: "CheckBox" },
    { id: 4, value: "RadioButton", label: "RadioButton" },
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

        // Periksa apakah respons berhasil
        if (!response.ok) throw new Error("Gagal mengambil data");

        // Parsing JSON dari respons
        const result = await response.json();

        // Validasi bahwa respons adalah array dan memiliki data
        if (!Array.isArray(result) || result.length === 0) {
          throw new Error("Respons tidak memiliki data yang valid.");
        }

        // Proses data jika respons valid
        const firstItem = result[0]; // Ambil item pertama
        const additionalData = firstItem.skp_additional_data
          ? JSON.parse(firstItem.skp_additional_data)
          : {
              scale: firstItem.skp_skala || 4,
              descriptions: [firstItem.skp_deskripsi || ""],
              checkedValues: [],
              name: "",
            };

        let descriptions;
        if (["CheckBox", "RadioButton"].includes(firstItem.skp_tipe)) {
          descriptions = firstItem.skp_deskripsi
            ? firstItem.skp_deskripsi.split(",").map((desc) => desc.trim())
            : Array(parseInt(firstItem.skp_skala) || 4).fill("");
        } else {
          descriptions = [firstItem.skp_deskripsi || ""];
        }

        setFormData({
          ...firstItem,
          scale: parseInt(firstItem.skp_skala) || 4,
          descriptions: descriptions,
          checkedValues: additionalData.checkedValues || [],
          name: additionalData.name || "",
        });
      } catch (err) {
        console.error("Fetch error:", err);
        SweetAlert("Error", err.message, "error", "OK");
      }
    };

    fetchData();
  }, [key]);

  const handleInputChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const { skp_tipe, scale, descriptions } = formData;

    if (!skp_tipe) {
      SweetAlert("Peringatan!", "Harap pilih tipe skala.", "warning", "OK");
      return false;
    }

    if (!scale || scale < 1) {
      SweetAlert(
        "Peringatan!",
        "Skala harus lebih besar dari 0.",
        "warning",
        "OK"
      );
      return false;
    }

    // Validate descriptions based on type
    if (["TextBox", "TextArea"].includes(skp_tipe)) {
      if (!descriptions[0]) {
        SweetAlert("Peringatan!", "Harap isi deskripsi.", "warning", "OK");
        return false;
      }
    } else {
      const emptyDescriptions = descriptions.some(
        (desc, index) => !desc && index < scale
      );
      if (emptyDescriptions) {
        SweetAlert(
          "Peringatan!",
          "Harap lengkapi semua deskripsi nilai.",
          "warning",
          "OK"
        );
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async () => {
    try {
      if (!validateForm()) return;

      const skalaPenilaianData = {
        skp_id: key,
        skp_skala: formData.scale.toString(),
        skp_deskripsi: formData.descriptions.join(","),
        skp_tipe: formData.skp_tipe,
        skp_modif_by: "Retno Widiastuti",
      };

      console.log("Data sent to Update API:", skalaPenilaianData);

      const response = await fetch(
        `${API_LINK}/SkalaPenilaian/UpdateSkalaPenilaian`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            skp_id: key,
            skp_skala: formData.scale.toString(),
            skp_deskripsi: formData.descriptions.join(","),
            skp_tipe: formData.skp_tipe,
            skp_modif_by: "Admin",
          }),
        }
      );

      if (!response.ok) throw new Error("Gagal menyimpan data");

      const result = await response.json();
      console.log("Update API Response:", result);

      await SweetAlert("Berhasil!", "Data berhasil diperbarui.", "success", "OK");
      onChangePage("index");
    } catch (error) {
      console.error("Update error:", error);
      SweetAlert(
        "Gagal!",
        `Terjadi kesalahan: ${error.message}`,
        "error",
        "OK"
      );
    }
  };

  const renderScaleInput = () => (
    <div style={{ marginBottom: "20px" }}>
      <label>
        <strong>Skala *</strong>
      </label>
      <input
        type="number"
        min="1"
        max="10"
        value={formData.scale}
        onChange={(e) => handleInputChange("scale", Number(e.target.value))}
        style={{
          display: "block",
          width: "80px",
          padding: "5px",
          marginTop: "5px",
          border: "1px solid #ccc",
          borderRadius: "5px",
        }}
      />
    </div>
  );

  // Rest of your render functions remain the same
  const renderDescriptionInputs = () => (
    <div>
      <label>
        <strong>Deskripsi Nilai *</strong>
      </label>
      {Array.from({ length: formData.scale || 4 }, (_, i) => (
        <div key={i} style={{ marginBottom: "10px" }}>
          <input
            type="text"
            placeholder={`Deskripsi untuk nilai ${i + 1}`}
            value={formData.descriptions?.[i] || ""}
            onChange={(e) => {
              const newDescriptions = [...(formData.descriptions || [])];
              newDescriptions[i] = e.target.value;
              handleInputChange("descriptions", newDescriptions);
            }}
            style={{
              width: "100%",
              padding: "5px",
              border: "1px solid #ccc",
              borderRadius: "5px",
            }}
          />
        </div>
      ))}
    </div>
  );

  const renderTypeSpecificInputs = () => {
    switch (formData.skp_tipe) {
      case "RadioButton":
        return (
          <div style={{ marginTop: "20px" }}>
            {renderScaleInput()}
            <div style={{ marginBottom: "20px" }}>
              <label>
                <strong>Preview</strong>
              </label>
              <div style={{ marginTop: "10px" }}>
                {Array.from(
                  { length: formData.scale || 4 },
                  (_, i) => i + 1
                ).map((value) => (
                  <label
                    key={value}
                    style={{
                      marginRight: "15px",
                      display: "inline-flex",
                      alignItems: "center",
                    }}
                  >
                    <input
                      type="radio"
                      name="preview"
                      value={value}
                      checked={formData.name === String(value)}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      style={{ marginRight: "5px" }}
                    />
                    {value}
                  </label>
                ))}
              </div>
            </div>
            {renderDescriptionInputs()}
          </div>
        );

      case "CheckBox":
        return (
          <div style={{ marginTop: "20px" }}>
            {renderScaleInput()}
            <div style={{ marginBottom: "20px" }}>
              <label>
                <strong>Preview</strong>
              </label>
              <div style={{ marginTop: "10px" }}>
                {Array.from(
                  { length: formData.scale || 4 },
                  (_, i) => i + 1
                ).map((value) => (
                  <label
                    key={value}
                    style={{
                      marginRight: "15px",
                      display: "inline-flex",
                      alignItems: "center",
                    }}
                  >
                    <input
                      type="checkbox"
                      value={value}
                      checked={formData.checkedValues?.includes(value)}
                      onChange={(e) => {
                        const checkedValues = formData.checkedValues || [];
                        const newValues = e.target.checked
                          ? [...checkedValues, value]
                          : checkedValues.filter((v) => v !== value);
                        handleInputChange("checkedValues", newValues);
                      }}
                      style={{ marginRight: "5px" }}
                    />
                    {value}
                  </label>
                ))}
              </div>
            </div>
            {renderDescriptionInputs()}
          </div>
        );

      case "TextBox":
      case "TextArea":
        return (
          <div style={{ marginTop: "20px" }}>
            <div>
              <label>
                <strong>Preview *</strong>
              </label>
              <textarea
                rows={formData.skp_tipe === "TextArea" ? "4" : "1"}
                className="form-control"
                value={formData.descriptions[0] || ""}
                onChange={(e) => {
                  handleInputChange("descriptions", [e.target.value]);
                }}
                style={{
                  width: "100%",
                  padding: "5px",
                  border: "1px solid #ccc",
                  borderRadius: "5px",
                }}
              />
            </div>
          </div>
        );

      default:
        return null;
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
            className={`shadow p-${
              isMobile ? "4 m-2" : "5 m-5"
            } bg-white rounded`}
          >
            <HeaderForm label="Formulir Skala Penilaian" />

            <DropDown
              type="pilih"
              label="Tipe Skala"
              isRequired
              name="skp_tipe"
              value={formData.skp_tipe || ""}
              onChange={(e) => handleInputChange("skp_tipe", e.target.value)}
              arrData={tipeOptions}
            />

            {renderTypeSpecificInputs()}

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
