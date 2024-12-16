import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import SweetAlert from "../../../util/SweetAlert";

export default function Edit() {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    Nama: "",
    Skala: 1,
    Deskripsi: "",
    type: "",
    descriptions: [],
    selectedValue: null, // Menyimpan nilai yang dipilih di preview
  });

  useEffect(() => {
    if (location.state?.idData) {
      const editId = location.state.idData;

      // Fetch data skala berdasarkan ID
      fetch(`/api/skala/${editId}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Gagal mengambil data skala.");
          }
          return response.json();
        })
        .then((data) => {
          setFormData({
            Nama: data.Nama || "",
            Skala: data.Skala || 1,
            Deskripsi: data.Deskripsi || "",
            type: data.type || "Radio Button",
            descriptions: data.descriptions || [],
            selectedValue: data.selectedValue || null,
          });
        })
        .catch((error) =>
          SweetAlert("Error", error.message, "error", "OK").then(() =>
            navigate("/survei/skala")
          )
        );
    }
  }, [location.state?.idData, navigate]);

  const handleTypeChange = (e) => {
    setFormData({ ...formData, type: e.target.value, descriptions: [] });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePreviewChange = (value) => {
    setFormData({ ...formData, selectedValue: value });
  };

  const validateForm = () => {
    if (!formData.Nama.trim()) {
      SweetAlert("Error", "Nama tidak boleh kosong.", "error", "OK");
      return false;
    }
    if (!formData.type) {
      SweetAlert("Error", "Tipe skala harus dipilih.", "error", "OK");
      return false;
    }
    if (
      formData.type === "Radio Button" &&
      formData.descriptions.length < formData.Skala
    ) {
      SweetAlert(
        "Error",
        "Lengkapi deskripsi nilai untuk semua skala.",
        "error",
        "OK"
      );
      return false;
    }
    if (formData.type === "Radio Button" && !formData.selectedValue) {
      SweetAlert(
        "Error",
        "Pilih salah satu nilai pada preview.",
        "error",
        "OK"
      );
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const editId = location.state?.idData;
    fetch(`/api/skala/${editId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Gagal menyimpan perubahan skala.");
        }
        return response.json();
      })
      .then(() => {
        SweetAlert(
          "Berhasil!",
          "Skala penilaian berhasil diperbarui.",
          "success",
          "OK"
        ).then(() => navigate("/survei/skala"));
      })
      .catch((error) => {
        console.error(error);
        SweetAlert("Error", error.message, "error", "OK");
      });
  };

  const handleCancel = () => {
    navigate("/survei/skala");
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "auto" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
        Edit Skala Penilaian
      </h2>

      {/* Dropdown untuk memilih tipe */}
      <div className="mb-3">
        <label>
          <strong>Tipe Skala:</strong>
        </label>
        <select
          className="form-select"
          value={formData.type}
          onChange={handleTypeChange}
        >
          <option value="">Pilih tipe skala...</option>
          <option value="Radio Button">Radio Button</option>
          <option value="TextBox">TextBox</option>
          <option value="TextArea">TextArea</option>
          <option value="CheckBox">CheckBox</option>
        </select>
      </div>

      {/* Implementasi form tergantung tipe */}
      {formData.type === "Radio Button" && (
        <div>
          {/* Input skala */}
          <div className="mb-3">
            <label>
              <strong>Skala *</strong>
            </label>
            <input
              type="number"
              min="1"
              max="10"
              value={formData.Skala || 1}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  Skala: Number(e.target.value),
                  descriptions: [],
                })
              }
              className="form-control"
            />
          </div>

          {/* Input deskripsi nilai */}
          <div className="mb-3">
            <label>
              <strong>Deskripsi Nilai *</strong>
            </label>
            {Array.from({ length: formData.Skala || 1 }, (_, i) => (
              <input
                key={i}
                type="text"
                placeholder={`Deskripsi nilai ${i + 1}`}
                value={formData.descriptions[i] || ""}
                onChange={(e) => {
                  const descriptions = [...formData.descriptions];
                  descriptions[i] = e.target.value;
                  setFormData({ ...formData, descriptions });
                }}
                className="form-control mb-2"
              />
            ))}
          </div>

          {/* Preview nilai */}
          <div className="mb-3">
            <label>
              <strong>Preview:</strong>
            </label>
            <div style={{ marginTop: "10px" }}>
              {Array.from({ length: formData.Skala || 1 }, (_, i) => (
                <label
                  key={i}
                  style={{
                    marginRight: "15px",
                    display: "inline-flex",
                    alignItems: "center",
                  }}
                >
                  <input
                    type="radio"
                    name="preview"
                    value={i + 1}
                    checked={formData.selectedValue === i + 1}
                    onChange={() => handlePreviewChange(i + 1)}
                    style={{ marginRight: "5px" }}
                  />
                  {i + 1}
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tombol aksi */}
      <div style={{ marginTop: "20px", textAlign: "right" }}>
        <button
          className="btn btn-primary"
          onClick={handleSubmit}
          style={{ marginRight: "10px" }}
        >
          Simpan
        </button>
        <button className="btn btn-secondary" onClick={handleCancel}>
          Batal
        </button>
      </div>
    </div>
  );
}
