import React, { useState, useEffect } from "react";
import PageTitleNav from "../../../part/PageTitleNav";
import TextField from "../../../part/TextField";
import Button from "../../../part/Button";
import Loading from "../../../part/Loading";
import Dropdown from "../../../part/Dropdown";
import SweetAlert from "../../../util/SweetAlert";
import { API_LINK } from "../../../util/Constants";
import { useIsMobile } from "../../../util/useIsMobile";
import { useNavigate, useLocation } from "react-router-dom";

async function fetchAPI(url, body = null, method = "POST") {
  try {
    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      ...(body && { body }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    throw new Error("Failed to fetch data from API");
  }
}

export default function Edit({ onChangePage }) {
  const isMobile = useIsMobile();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    id: location.state?.idData || "", // Make sure this is set correctly
    name: "",
    createdBy: "dianvivi.widiyawati",
    ksrId: "",
    skpId: "",
  });

  const [kriteriaSurvei, setKriteriaSurvei] = useState([]);
  const [skalaPenilaian, setSkalaPenilaian] = useState([]);

  useEffect(() => {
    if (!location.state?.idData) return;

    const editId = location.state.idData; // Use the id from location.state
    const fetchData = async () => {
      try {
        console.log("Fetching data for template ID:", editId); // Debugging ID

        setLoading(true);
        setError(null);

        const [kriteriaData, skalaData, templateData] = await Promise.all([
          fetchAPI(
            `${API_LINK}/MasterKriteriaSurvei/GetDataKriteriaSurvei`,
            JSON.stringify({})
          ),
          fetchAPI(
            `${API_LINK}/SkalaPenilaian/GetSkalaPenilaian`,
            JSON.stringify({})
          ),
          fetchAPI(
            `${API_LINK}/TemplateSurvei/GetDataTemplateSurveiById`,
            JSON.stringify({ id: editId })
          ),
        ]);

        console.log("Fetched Kriteria Survei Data:", kriteriaData); // Debugging data
        console.log("Fetched Skala Penilaian Data:", skalaData); // Debugging data
        console.log("Fetched Template Data:", templateData); // Debugging data

        setKriteriaSurvei(
          kriteriaData.map((item) => ({
            Value: item.ksr_id?.toString() || "",
            Text: item.ksr_nama || "Tidak diketahui",
          }))
        );

        setSkalaPenilaian(
          skalaData.map((item) => ({
            Value: item.skp_id?.toString() || "",
            Text: item.skp_deskripsi || "Tidak diketahui",
          }))
        );

        setFormData({
          name: templateData?.name || "",
          createdBy: templateData?.createdBy || "dianvivi.widiyawati",
          ksrId: templateData?.ksrId?.toString() || "",
          skpId: templateData?.skpId?.toString() || "",
        });
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Gagal memuat data. Silakan coba lagi nanti.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [location.state?.idData]); // Trigger when idData is changed

  const validateForm = () => {
    if (!formData.name) return "Nama Template tidak boleh kosong.";
    if (formData.name.length > 50)
      return "Nama Template tidak boleh lebih dari 50 karakter.";
    if (!formData.ksrId) return "Kriteria Survei harus dipilih.";
    if (!formData.skpId) return "Skala Penilaian harus dipilih.";
    return null;
  };

  const handleSubmit = async () => {
    const errorMessage = validateForm();
    if (errorMessage) {
      SweetAlert("Error", errorMessage, "error", "OK");
      return;
    }

    console.log("Form data before submitting:", formData); // Debugging form data

    setLoading(true);
    try {
      const payload = {
        ...formData,
        id: parseInt(formData.id, 10), // Ensure ID is parsed correctly
        ksrId: parseInt(formData.ksrId, 10),
        skpId: parseInt(formData.skpId, 10),
      };

      console.log("Payload to be sent:", payload); // Debugging payload

      await fetchAPI(
        `${API_LINK}/TemplateSurvei/UpdateTemplateSurvei`,
        JSON.stringify(payload),
        "POST"
      );

      SweetAlert(
        "Sukses",
        "Template survei berhasil diperbarui.",
        "success",
        "OK"
      ).then(() => onChangePage("index"));
    } catch (err) {
      console.error("Error submitting form:", err);
      SweetAlert(
        "Error",
        "Terjadi kesalahan saat memperbarui data.",
        "error",
        "OK"
      );
    } finally {
      setLoading(false);
    }
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
            onClick={() => onChangePage("index")}
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
              label="Dibuat Oleh"
              value={formData.createdBy}
              onChange={(e) =>
                setFormData({ ...formData, createdBy: e.target.value })
              }
              isRequired={true}
            />
            <Dropdown
              label="Kriteria Survei"
              arrData={kriteriaSurvei}
              type="pilih"
              forInput="kriteriaSurvei"
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
              forInput="skalaPenilaian"
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
                onClick={() => onChangePage("index")}
                style={{ flex: 1, margin: "0.5rem" }}
              />
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
