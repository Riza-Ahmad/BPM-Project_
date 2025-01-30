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
    scale: 0,
    descriptions: [],
    checkedValues: [],
    name: "",
  });

  const tipeOptions = [
    { Value: "TextArea", Text: "TextArea" },
    { Value: "TextBox", Text: "TextBox" },
    { Value: "CheckBox", Text: "CheckBox" },
    { Value: "RadioButton", Text: "RadioButton" },
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

        if (!Array.isArray(result) || result.length === 0) {
          throw new Error("Respons tidak memiliki data yang valid.");
        }

        const firstItem = result[0];
        const additionalData = firstItem.skp_additional_data
          ? JSON.parse(firstItem.skp_additional_data)
          : {};

        const convertedData = convertDataOnTypeChange(
          firstItem.skp_tipe,
          firstItem.skp_tipe,
          {
            scale: parseInt(firstItem.skp_skala) || 0,
            descriptions: firstItem.skp_deskripsi
              ? firstItem.skp_deskripsi.split(",").map((desc) => desc.trim())
              : [],
            checkedValues: additionalData.checkedValues || [],
            name: additionalData.name || "",
          }
        );

        setFormData({
          ...firstItem,
          ...convertedData,
        });
      } catch (err) {
        console.error("Fetch error:", err);
        SweetAlert("Error", err.message, "error", "OK");
      }
    };

    fetchData();
  }, [key]);

  const convertDataOnTypeChange = (oldType, newType, currentData) => {
    const { scale, descriptions, checkedValues, name } = currentData;

    switch (newType) {
      case "RadioButton":
      case "CheckBox":
        const newScale = Math.min(Math.max(scale || 1, 1), 10);

        // Strictly trim descriptions to new scale
        const newDescriptions = descriptions.slice(0, newScale);

        // Validate no empty descriptions
        const hasEmptyDescription = newDescriptions.some(
          (desc, index) => index < newScale && !desc.trim()
        );

        if (hasEmptyDescription) {
          SweetAlert(
            "Peringatan!",
            "Harap lengkapi semua deskripsi untuk skala baru.",
            "warning",
            "OK"
          );
          return null;
        }

        return {
          scale: newScale,
          descriptions: newDescriptions,
          checkedValues:
            newType === "CheckBox"
              ? (checkedValues || []).filter((v) => v <= newScale)
              : [],
          name:
            newType === "RadioButton"
              ? name && parseInt(name) <= newScale
                ? name
                : ""
              : "",
        };

      case "TextArea":
      case "TextBox":
        const combinedDescription = descriptions
          .filter((desc) => desc.trim() !== "")
          .join(", ")
          .trim();

        if (!combinedDescription) {
          SweetAlert(
            "Peringatan!",
            "Harap lengkapi deskripsi sebelum mengubah tipe.",
            "warning",
            "OK"
          );
          return null;
        }

        return {
          scale: 1,
          descriptions: [combinedDescription],
          checkedValues: [],
          name: "",
        };

      default:
        return currentData;
    }
  };

  const handleTypeChange = (newType) => {
    setFormData((prevData) => {
      const convertedData = convertDataOnTypeChange(
        prevData.skp_tipe,
        newType,
        prevData
      );

      if (convertedData === null) {
        return prevData;
      }

      return {
        ...prevData,
        ...convertedData,
        skp_tipe: newType,
      };
    });
  };

  const handleInputChange = (name, value) => {
    if (typeof name === "object" && name.target) {
      const { name: fieldName, value: fieldValue } = name.target;
      setFormData((prev) => ({
        ...prev,
        [fieldName]: fieldValue,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const validateForm = () => {
    const { skp_tipe, scale, descriptions } = formData;

    if (!skp_tipe) {
      SweetAlert("Peringatan!", "Harap pilih tipe skala.", "warning", "OK");
      return false;
    }

    switch (skp_tipe) {
      case "TextBox":
      case "TextArea":
        if (!descriptions[0]) {
          SweetAlert("Peringatan!", "Harap isi deskripsi.", "warning", "OK");
          return false;
        }
        break;

      case "RadioButton":
      case "CheckBox":
        if (scale < 1) {
          SweetAlert(
            "Peringatan!",
            "Skala harus lebih besar dari 0.",
            "warning",
            "OK"
          );
          return false;
        }

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
        break;
    }

    return true;
  };

  const handleSubmit = async () => {
    try {
      if (!validateForm()) return;

      // Potong deskripsi sesuai skala baru
      const trimmedDescriptions = formData.descriptions.slice(
        0,
        formData.scale
      );

      const skalaPenilaianData = {
        skp_id: key,
        skp_skala: formData.scale.toString(),
        skp_deskripsi: trimmedDescriptions.join(","), // Hanya simpan deskripsi sesuai skala
        skp_tipe: formData.skp_tipe,
        skp_modif_by: "Admin",
        skp_additional_data: JSON.stringify({
          ...(formData.skp_tipe === "RadioButton"
            ? { name: formData.name }
            : {}),
          ...(formData.skp_tipe === "CheckBox"
            ? { checkedValues: formData.checkedValues }
            : {}),
        }),
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

      const result = await response.json();

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
      {Array.from({ length: formData.scale }, (_, i) => (
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
                {Array.from({ length: formData.scale }, (_, i) => i + 1).map(
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
                  )
                )}
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
                {Array.from({ length: formData.scale }, (_, i) => i + 1).map(
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
                  )
                )}
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
              forInput="skp_tipe"
              value={formData.skp_tipe}
              onChange={(e) => handleTypeChange(e.target.value)}
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
