import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import SweetAlert from "../../../util/SweetAlert";
import { API_LINK } from "../../../util/Constants";
import { useParams } from "react-router-dom";

export default function Edit({ onChangePage }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true); // Menambahkan state untuk loading

  const fetchSkala = async () => {
    if (location.state?.idData) {
      const editId = location.state?.idData;
      try {
        const response = await fetch(
          `${API_LINK}/SkalaPenilaian/GetDataSkalaPenilaianById`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              skp_id: editId,
            }),
          }
        );
        if (!response.ok) throw new Error("Gagal mengambil data skala.");
        const result = await response.json();
        setFormData(result[0]); // Pastikan ini sesuai dengan data yang diterima
      } catch (err) {
        console.error("Error fetching data:", err);
        alert("Gagal mengambil data skala.");
      } finally {
        setLoading(false);
      }
    } else {
      console.log("Tidak ada id");
    }
  };

  useEffect(() => {
    fetchSkala();
  }, []);

  // Jika sedang loading, tampilkan indikator loading atau jangan render form
  if (loading) {
    return <div>Loading...</div>; // Anda bisa mengganti dengan spinner atau indikator lain
  }

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
    const editId = location.state?.idData;
    const payload = {
      skp_id: editId, // Mengambil ID dari state
      skp_skala: formData.skp_skala,
      skp_deskripsi: formData.skp_deskripsi.trim(),
      skp_tipe: formData.skp_tipe,
      skp_status: 1, // Contoh: Status aktif, sesuaikan jika berbeda
      skp_modif_by: "Admin", // Ganti dengan nilai sebenarnya (misalnya dari session user)
      skp_modif_date: new Date().toISOString(), // Backend akan override ke waktu sekarang
    };

    fetch(`/api/skala/update`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
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
        Tambah Skala Penilaian
      </h2>

      {/* Dropdown untuk memilih tipe */}
      <div className="mb-3">
        <label>
          <strong>Tipe Skala:</strong>
        </label>
        <select
          className="form-select"
          value={formData.skp_tipe}
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
      {formData.skp_tipe === "Radio Button" && (
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
              value={formData.skp_skala || 4}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  skp_skala: Number(e.target.value),
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
              {Array.from(
                { length: formData.skp_skala || 4 },
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
                    checked={formData.skp_name === String(value)}
                    onChange={(e) =>
                      setFormData({ ...formData, skp_name: e.target.value })
                    }
                    style={{ marginRight: "5px" }}
                  />
                  {value}
                </label>
              ))}
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
