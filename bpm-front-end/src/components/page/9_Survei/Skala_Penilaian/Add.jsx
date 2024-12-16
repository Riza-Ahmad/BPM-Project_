import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { API_LINK } from "../../../util/Constants";

export default function Add({ onChangePage }) {
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    scale: 1,
    descriptions: [],
  });

  const navigate = useNavigate();

  const handleTypeChange = (e) => {
    setFormData({
      ...formData,
      type: e.target.value,
      scale: 1,
      descriptions: [],
    });
  };

  const handleSave = async () => {
    try {
      const response = await fetch(
        `${API_LINK}/SkalaPenilaian/CreateSkalaPenilaian`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            skp_skala: formData.scale,
            skp_deskripsi: formData.descriptions.join(", "), // Gabungkan deskripsi jika perlu
            skp_tipe: formData.type,
            skp_created_by: "Admin", // Ganti dengan nilai yang sesuai
          }),
        }
      );

      if (response.ok) {
        alert("Skala berhasil ditambahkan!");
        navigate("/survei/skala");
      } else {
        const errorData = await response.json();
        alert(
          `Gagal menyimpan data: ${
            errorData.message || "Error tidak diketahui."
          }`
        );
      }
    } catch (error) {
      alert(`Terjadi kesalahan: ${error.message}`);
    }
  };

  const handleCancel = () => {
    navigate("/survei/skala");
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "auto" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
        Tambah Skala Penilaian
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

      {/* Kondisional untuk tipe */}
      {formData.type === "Radio Button" && (
        <div style={{ marginTop: "20px" }}>
          {/* Input untuk skala */}
          <div style={{ marginBottom: "20px" }}>
            <label>
              <strong>Skala *</strong>
            </label>
            <input
              type="number"
              min="1"
              max="10"
              value={formData.scale || 4}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  scale: Number(e.target.value),
                  name: null,
                })
              }
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

          {/* Preview */}
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
                      type="radio"
                      name="preview"
                      value={value}
                      checked={formData.name === String(value)}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      style={{ marginRight: "5px" }}
                    />
                    {value}
                  </label>
                )
              )}
            </div>
          </div>

          {/* Input deskripsi nilai */}
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
                    setFormData({ ...formData, descriptions: newDescriptions });
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

          {/* Tampilkan deskripsi berdasarkan pilihan */}
          <p
            style={{
              marginTop: "10px",
              color: "#555",
              fontStyle: "italic",
            }}
          >
            {formData.name
              ? formData.descriptions?.[Number(formData.name) - 1] ||
                "Deskripsi belum diisi."
              : "Pilih skala untuk melihat deskripsi."}
          </p>
        </div>
      )}

      {formData.type === "TextBox" && (
        <div style={{ marginTop: "20px" }}>
          <label>
            <strong>Input TextBox:</strong>
          </label>
          <textarea
            rows="1"
            cols="50"
            className="form-control"
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            value={formData.name || ""}
            style={{
              width: "100%",
              padding: "5px",
              border: "1px solid #ccc",
              borderRadius: "5px",
            }}
          />
          <div style={{ marginTop: "20px" }}>
            <label>
              <strong>Deskripsi:</strong>
            </label>
            <input
              type="text"
              placeholder="Deskripsi untuk TextBox"
              value={formData.descriptions[0] || ""}
              onChange={(e) => {
                const newDescriptions = [...(formData.descriptions || [])];
                newDescriptions[0] = e.target.value;
                setFormData({ ...formData, descriptions: newDescriptions });
              }}
              style={{
                width: "100%",
                padding: "5px",
                border: "1px solid #ccc",
                borderRadius: "5px",
                marginTop: "10px",
              }}
            />
          </div>
        </div>
      )}

      {formData.type === "TextArea" && (
        <div style={{ marginTop: "20px" }}>
          <label>
            <strong>Input TextArea:</strong>
          </label>
          <textarea
            rows="4"
            cols="50"
            className="form-control"
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            value={formData.name}
            style={{
              width: "100%",
              padding: "5px",
              border: "1px solid #ccc",
              borderRadius: "5px",
            }}
          />
          <div style={{ marginTop: "20px" }}>
            <label>
              <strong>Deskripsi:</strong>
            </label>
            <input
              type="text"
              placeholder="Deskripsi untuk TextArea"
              value={formData.descriptions[0] || ""}
              onChange={(e) => {
                const newDescriptions = [...(formData.descriptions || [])];
                newDescriptions[0] = e.target.value;
                setFormData({ ...formData, descriptions: newDescriptions });
              }}
              style={{
                width: "100%",
                padding: "5px",
                border: "1px solid #ccc",
                borderRadius: "5px",
                marginTop: "10px",
              }}
            />
          </div>
        </div>
      )}

      {formData.type === "CheckBox" && (
        <div style={{ marginTop: "20px" }}>
          {/* Input untuk skala */}
          <div style={{ marginBottom: "20px" }}>
            <label>
              <strong>Skala *</strong>
            </label>
            <input
              type="number"
              min="1"
              max="10"
              value={formData.scale || 4}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  scale: Number(e.target.value),
                  checkedValues: [],
                })
              }
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

          {/* Preview */}
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
                      type="checkbox"
                      value={value}
                      checked={formData.checkedValues?.includes(value)}
                      onChange={(e) => {
                        const checkedValues = formData.checkedValues || [];
                        if (e.target.checked) {
                          setFormData({
                            ...formData,
                            checkedValues: [...checkedValues, value],
                          });
                        } else {
                          setFormData({
                            ...formData,
                            checkedValues: checkedValues.filter(
                              (v) => v !== value
                            ),
                          });
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

          {/* Input deskripsi nilai */}
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
                    setFormData({ ...formData, descriptions: newDescriptions });
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

          {/* Tampilkan deskripsi berdasarkan pilihan */}
          <p
            style={{
              marginTop: "10px",
              color: "#555",
              fontStyle: "italic",
            }}
          >
            {formData.checkedValues?.length > 0
              ? `Nilai dipilih: ${formData.checkedValues.join(", ")}`
              : "Tidak ada nilai yang dipilih."}
          </p>
          <ul>
            {formData.checkedValues?.map((value) => (
              <li key={value}>
                {value}:{" "}
                {formData.descriptions?.[value - 1] || "Deskripsi belum diisi."}
              </li>
            ))}
          </ul>
        </div>
      )}
      {/* Tombol aksi */}
      <div style={{ marginTop: "20px", textAlign: "right" }}>
        <button
          className="btn btn-primary"
          onClick={handleSave}
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
