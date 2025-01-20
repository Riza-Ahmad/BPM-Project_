import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { API_LINK } from "../../../util/Constants";
import { useIsMobile } from "../../../util/useIsMobile";
import PageTitleNav from "../../../part/PageTitleNav";
import SweetAlert from "../../../util/SweetAlert";
import Loading from "../../../part/Loading";
import TextField from "../../../part/TextField";
import Dropdown from "../../../part/Dropdown";
import Button from "../../../part/Button";
import { decodeHtml } from "../../../util/DecodeHtml";

export default function Edit() {
  const location = useLocation();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [kriteriaSurvei, setKriteriaSurvei] = useState([]);
  const [skalaPenilaian, setSkalaPenilaian] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    modifiedBy: "dianvivi.widiyawati", // Default value for modifiedBy
    ksrId: "",
    skpId: "",
  });
  const { idData } = location.state || {}; // Ambil idData dari state

  // Ambil data template berdasarkan idData
  useEffect(() => {
    if (!idData) {
      navigate("/survei/template");
      return;
    }

    const fetchTemplateData = async () => {
      try {
        setLoading(true);

        // Panggilan API ke endpoint TemplateSurvei
        const response = await fetch(
          `${API_LINK}/TemplateSurvei/GetDataTemplateSurveiById`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ id: idData }), // Kirim idData sebagai body
          }
        );

        const data = await response.json(); // Parse respons API
        console.log("API Response Data:", data);

        if (data && data.length > 0) {
          const templateData = data[0]; // Ambil data template pertama dari respons

          setFormData({
            name: decodeHtml(templateData.tsu_nama || "Tidak tersedia"), // Decode dan set nama
            modifiedBy: decodeHtml(
              templateData.tsu_modif_by || "Tidak tersedia"
            ),
            ksrId: templateData.ksr_id || "-", // Tambahkan ksrId
            skpId: templateData.skp_id || "-", // Tambahkan skpId
          });
        } else {
          setError("Template data tidak ditemukan.");
        }
      } catch (err) {
        console.error("Error fetching template data:", err);
        setError("Gagal mengambil data template.");
      } finally {
        setLoading(false); // Set loading selesai
      }
    };

    fetchTemplateData();
  }, [idData, navigate]);

  // Ambil data dropdown untuk Kriteria Survei dan Skala Penilaian
  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const kriteriaData = await fetchAPI(
          `${API_LINK}/MasterKriteriaSurvei/GetDataKriteriaSurvei`,
          JSON.stringify({})
        );
        setKriteriaSurvei(
          kriteriaData.map((item) => ({
            Value: item.ksr_id,
            Text: item.ksr_nama,
          }))
        );

        const skalaData = await fetchAPI(
          `${API_LINK}/SkalaPenilaian/GetSkalaPenilaian`,
          JSON.stringify({})
        );
        setSkalaPenilaian(
          skalaData.map((item) => ({
            Value: item.skp_id,
            Text: item.skp_deskripsi,
          }))
        );
      } catch (err) {
        console.error("Error fetching dropdown data:", err);
        setError("Gagal memuat data dropdown. Silakan coba lagi nanti.");
      }
    };

    fetchDropdownData();
  }, []);

  const validateForm = () => {
    if (!formData.name) {
      return "Nama Template tidak boleh kosong.";
    }
    if (formData.name.length > 50) {
      return "Nama Template tidak boleh lebih dari 50 karakter.";
    }
    if (!formData.ksrId) {
      return "Kriteria Survei harus dipilih.";
    }
    if (!formData.skpId) {
      return "Skala Penilaian harus dipilih.";
    }
    if (isNaN(parseInt(formData.ksrId, 10))) {
      return "ID Kriteria Survei harus berupa angka.";
    }
    if (isNaN(parseInt(formData.skpId, 10))) {
      return "ID Skala Penilaian harus berupa angka.";
    }
    return null;
  };

  const handleSubmit = async () => {
    const errorMessage = validateForm();
    if (errorMessage) {
      SweetAlert("Error", errorMessage, "error", "OK");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        id: idData, // Menambahkan id dari state location
        ...formData,
        ksrId: parseInt(formData.ksrId, 10),
        skpId: parseInt(formData.skpId, 10),
      };

      console.log("Payload yang dikirim ke API:", payload);

      const response = await fetchAPI(
        `${API_LINK}/TemplateSurvei/UpdateTemplateSurvei`,
        JSON.stringify(payload)
      );

      console.log("Response dari UpdateTemplateSurvei:", response);

      SweetAlert(
        "Sukses",
        "Template survei berhasil diperbarui.",
        "success",
        "OK"
      ).then(() => navigate("/survei/template"));
    } catch (err) {
      console.error("Error submitting form:", err);
      SweetAlert(
        "Error",
        "Terjadi kesalahan saat mengirim data.",
        "error",
        "OK"
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchAPI = async (url, body, method = "POST") => {
    console.log("URL:", url);
    console.log("Body yang dikirim:", body);

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body,
    });

    if (!response.ok) {
      console.error("Error response status:", response.status);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseData = await response.json();
    console.log("Response dari API:", responseData);
    return responseData;
  };

  if (loading) return <Loading />;
  if (error) return <p>{error}</p>;

  return (
    <div className="d-flex flex-column min-vh-100">
      <main className="flex-grow-1 p-3" style={{ marginTop: "80px" }}>
        <div
          className="form-container"
          style={{
            padding: isMobile ? "1rem" : "2rem",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            backgroundColor: "#fff",
            margin: isMobile ? "1rem" : "2rem",
          }}
        >
          <PageTitleNav
            title="Edit Template Survei"
            breadcrumbs={[
              { label: "Survei", href: "/survei" },
              { label: "Template Survei", href: "/survei/template" },
              { label: "Edit Template Survei" },
            ]}
            onClick={() => navigate("/survei/template")}
          />
          <h3 style={{ textAlign: "center", margin: "1rem 0" }}>
            Formulir Edit Template Survei
            <hr />
          </h3>
          <form>
            <TextField
              label="Nama Template"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              isRequired={true}
            />
            <TextField
              label="Dimodifikasi Oleh"
              value={formData.modifiedBy}
              onChange={(e) =>
                setFormData({ ...formData, modifiedBy: e.target.value })
              }
              isRequired={true}
            />
            <Dropdown
              label="Kriteria Survei"
              arrData={kriteriaSurvei}
              type="pilih"
              value={formData.ksrId}
              onChange={(e) =>
                setFormData({ ...formData, ksrId: e.target.value })
              }
              isRequired={true}
            />
            <Dropdown
              label="Skala Penilaian"
              arrData={skalaPenilaian}
              type="pilih"
              value={formData.skpId}
              onChange={(e) =>
                setFormData({ ...formData, skpId: e.target.value })
              }
              isRequired={true}
            />
            <div className="d-flex justify-content-between">
              <Button
                classType="primary"
                label="Simpan"
                onClick={handleSubmit}
                style={{ flex: 1, margin: "0.5rem" }}
              />
              <Button
                classType="danger"
                label="Batal"
                onClick={() => navigate("/survei/template")}
                style={{ flex: 1, margin: "0.5rem" }}
              />
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
