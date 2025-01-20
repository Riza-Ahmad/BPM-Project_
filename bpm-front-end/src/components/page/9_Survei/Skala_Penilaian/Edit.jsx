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
  const scaleTypes = {
    textarea: "TextArea",
    textbox: "TextBox",
    checkbox: "CheckBox",
    radio: "RadioButton",
  };

  const scaleOptions = [
    { id: 1, value: scaleTypes.textarea, label: "TextArea" },
    { id: 2, value: scaleTypes.textbox, label: "TextBox" },
    { id: 3, value: scaleTypes.checkbox, label: "CheckBox" },
    { id: 4, value: scaleTypes.radio, label: "RadioButton" },
  ];

  const initialFormState = {
    skp_tipe: "",
    skp_status: "",
    scale: 4,
    descriptions: [],
    checkedValues: [],
    name: "",
  };

  const isMobile = useIsMobile();
  const { key } = useParams();
  const [originalData, setOriginalData] = useState(null);
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchScaleData();
  }, [key]);

  const fetchScaleData = async () => {
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

      if (!Array.isArray(result) || result.length === 0) {
        throw new Error("Respons tidak memiliki data yang valid.");
      }

      const processedData = processInitialData(result[0]);
      setOriginalData(processedData);
      setFormData(processedData);
    } catch (err) {
      console.error("Fetch error:", err);
      SweetAlert("Error", err.message, "error", "OK");
    }
  };

  // Data Processing
  const processInitialData = (data) => {
    const additionalData = data.skp_additional_data
      ? JSON.parse(data.skp_additional_data)
      : {
          scale: data.skp_skala || 4,
          descriptions: [data.skp_deskripsi || ""],
          checkedValues: [],
          name: "",
        };

    const descriptions = isMultiOptionType(data.skp_tipe)
      ? data.skp_deskripsi
        ? data.skp_deskripsi.split(",").map((desc) => desc.trim())
        : Array(parseInt(data.skp_skala) || 4).fill("")
      : [data.skp_deskripsi || ""];

    return {
      ...data,
      scale: parseInt(data.skp_skala) || 4,
      descriptions,
      checkedValues: additionalData.checkedValues || [],
      name: additionalData.name || "",
    };
  };

  // Form Handlers
  const handleInputChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      if (!validateForm()) return;
      if (isDataUnchanged()) {
        SweetAlert(
          "Peringatan!",
          "Tidak ada perubahan data untuk disimpan.",
          "warning",
          "OK"
        );
        return;
      }

      await saveFormData();
      await SweetAlert(
        "Berhasil!",
        "Data berhasil diperbarui.",
        "success",
        "OK"
      );
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

  // Validation
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

    if (!validateDescriptions(skp_tipe, descriptions, scale)) {
      return false;
    }

    return true;
  };

  // Helper Functions
  const isDataUnchanged = () => {
    return JSON.stringify(formData) === JSON.stringify(originalData);
  };

  const isMultiOptionType = (type) => {
    return [scaleTypes.checkbox, scaleTypes.radio].includes(type);
  };

  const validateDescriptions = (type, descriptions, scale) => {
    if ([scaleTypes.textbox, scaleTypes.textarea].includes(type)) {
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

  const saveFormData = async () => {
    const skalaPenilaianData = {
      skp_id: key,
      skp_skala: formData.scale.toString(),
      skp_deskripsi: formData.descriptions.join(","),
      skp_tipe: formData.skp_tipe,
      skp_modif_by: "Admin",
    };

    const response = await fetch(
      `${API_LINK}/SkalaPenilaian/UpdateSkalaPenilaian`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(skalaPenilaianData),
      }
    );

    if (!response.ok) throw new Error("Gagal menyimpan data");
    return await response.json();
  };

  // Render Components
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

  const renderOptionPreview = (type) => (
    <div style={{ marginBottom: "20px" }}>
      <label>
        <strong>Preview</strong>
      </label>
      <div style={{ marginTop: "10px" }}>
        {Array.from({ length: formData.scale || 4 }, (_, i) => i + 1).map(
          (value) => (
            <label
              key={value}
              style={{
                marginRight: "15px",
                display: "inline-flex",
                alignItems: "center",
              }}
            >
              <input
                type={type}
                name={type === "radio" ? "preview" : undefined}
                value={value}
                checked={
                  type === "radio"
                    ? formData.name === String(value)
                    : formData.checkedValues?.includes(value)
                }
                onChange={(e) => {
                  if (type === "radio") {
                    handleInputChange("name", e.target.value);
                  } else {
                    const checkedValues = formData.checkedValues || [];
                    const newValues = e.target.checked
                      ? [...checkedValues, value]
                      : checkedValues.filter((v) => v !== value);
                    handleInputChange("checkedValues", newValues);
                  }
                }}
                style={{ marginRight: "5px" }}
              />
              {value}
            </label>
          )
        )}
      </div>
    </div>
  );

  const renderTextInput = () => (
    <div>
      <label>
        <strong>Preview *</strong>
      </label>
      <textarea
        rows={formData.skp_tipe === scaleTypes.textarea ? "4" : "1"}
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
  );

  const renderTypeSpecificInputs = () => {
    switch (formData.skp_tipe) {
      case scaleTypes.radio:
        return (
          <div style={{ marginTop: "20px" }}>
            {renderScaleInput()}
            {renderOptionPreview("radio")}
            {renderDescriptionInputs()}
          </div>
        );

      case scaleTypes.checkbox:
        return (
          <div style={{ marginTop: "20px" }}>
            {renderScaleInput()}
            {renderOptionPreview("checkbox")}
            {renderDescriptionInputs()}
          </div>
        );

      case scaleTypes.textbox:
      case scaleTypes.textarea:
        return <div style={{ marginTop: "20px" }}>{renderTextInput()}</div>;

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
              forInput="skp_tipe"
              value={formData.skp_tipe || ""}
              onChange={(e) => handleInputChange("skp_tipe", e.target.value)}
              arrData={scaleOptions.map((option) => ({
                Value: option.value,
                Text: option.label,
              }))}
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
      </main>
    </div>
  );
}
