import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import SweetAlert from "../../../util/SweetAlert";
import { API_LINK } from "../../../util/Constants";
import { useParams } from "react-router-dom";

export default function Edit() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const [formData, setFormData] = useState({
    Nama: "",
    Skala: 1,
    Deskripsi: "",
    type: "",
    descriptions: [],
    selectedValue: null,
  });
  const [loading, setLoading] = useState(true); // Menambahkan state untuk loading

  const fetchSkala = async () => {
    try {
      const response = await fetch(
        `${API_LINK}/SkalaPenilaian/GetDataSkalaPenilaianById`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            skp_id: id,
          }),
        }
      );
      console.log("API response:", response);
      if (!response.ok) throw new Error("Gagal mengambil data skala.");
      const result = await response.json();
      console.log("Result:", result); // Periksa struktur data
      setFormData(result); // Pastikan ini sesuai dengan data yang diterima
    } catch (err) {
      console.error("Error fetching data:", err);
      alert("Gagal mengambil data skala.");
    }
  };

  useEffect(() => {
    fetchSkala();
  });

  

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
    if (!validateForm()) return;

    const editId = location.state?.idData;
    const payload = {
      skp_id: editId, // Mengambil ID dari state
      skp_skala: formData.Skala,
      skp_deskripsi: formData.Deskripsi.trim(),
      skp_tipe: formData.type,
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

      {/* Form dinamis berdasarkan tipe */}
      {formData.type === "Radio Button" && (
        <div>
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

      {/* Form untuk tipe lainnya */}
      {/* Tambahkan kondisi untuk tipe lain sesuai kebutuhan */}

      <div className="mt-4 d-flex justify-content-between">
        <button
          className="btn btn-secondary"
          onClick={handleCancel}
          style={{ paddingLeft: "20px", paddingRight: "20px" }}
        >
          Batal
        </button>
        <button
          className="btn btn-primary"
          onClick={handleSubmit}
          style={{ paddingLeft: "20px", paddingRight: "20px" }}
        >
          Simpan
        </button>
      </div>
    </div>
  );
}
