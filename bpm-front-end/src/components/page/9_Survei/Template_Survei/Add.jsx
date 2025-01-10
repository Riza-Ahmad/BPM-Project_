import React, { useState, useEffect } from "react";
import PageTitleNav from "../../../part/PageTitleNav";
import TextField from "../../../part/TextField";
import Button from "../../../part/Button";
import Loading from "../../../part/Loading";
import Dropdown from "../../../part/Dropdown";
import SweetAlert from "../../../util/SweetAlert";
import Table from "../../../part/Table"; // Asumsi Anda memiliki komponen Table reusable
import { API_LINK } from "../../../util/Constants";
import { useIsMobile } from "../../../util/useIsMobile";
import { useNavigate } from "react-router-dom";

async function fetchAPI(url, body, method = "POST") {
  const response = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body,
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
}

export default function Add() {
  const isMobile = useIsMobile();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const [formDisabled, setFormDisabled] = useState(false);
  const [questions, setQuestions] = useState([]); // Daftar pertanyaan di template survei
  const [questionBank, setQuestionBank] = useState([]); // Pertanyaan yang tersedia

  const [formData, setFormData] = useState({
    name: "",
    createdBy: "dianvivi.widiyawati",
    ksrId: "",
    skpId: "",
  });

  const [kriteriaSurvei, setKriteriaSurvei] = useState([]);
  const [skalaPenilaian, setSkalaPenilaian] = useState([]);

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        setLoading(true);
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

        const questionBankData = await fetchAPI(
          `${API_LINK}/MasterPertanyaan/GetDataPertanyaan`,
          JSON.stringify({})
        );
        setQuestionBank(questionBankData);
      } catch (err) {
        console.error("Error fetching dropdown data:", err);
        setError("Gagal memuat data dropdown. Silakan coba lagi nanti.");
      } finally {
        setLoading(false);
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
        ...formData,
        ksrId: parseInt(formData.ksrId, 10),
        skpId: parseInt(formData.skpId, 10),
      };

      const response = await fetchAPI(
        `${API_LINK}/TemplateSurvei/CreateTemplateSurvei`,
        JSON.stringify(payload)
      );

      console.log("Response from CreateTemplateSurvei:", response);

      setFormDisabled(true); // Disable form
      setQuestions([]); // Reset pertanyaan
      SweetAlert("Sukses", "Template survei berhasil dibuat.", "success", "OK");
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

  const handleDetail = (id) => {
    console.log("Detail for question ID:", id);
  };

  const handleEdit = (id) => {
    console.log("Edit for question ID:", id);
  };

  const handleDelete = (id) => {
    setQuestions((prev) => prev.filter((item) => item.id !== id));
    console.log("Delete for question ID:", id);
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
            title="Tambah Template Survei"
            breadcrumbs={[
              { label: "Survei", href: "/survei" },
              { label: "Template Survei", href: "/survei/template" },
              { label: "Tambah Template Survei" },
            ]}
            onClick={() => navigate("/survei/template")}
          />
          <h3 style={{ textAlign: "center", margin: "1rem 0" }}>
            Formulir Template Survei
            <hr />
          </h3>
          <form>
            <TextField
              label="Nama Template"
              placeholder="Masukkan Nama Template"
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
                onClick={() => navigate("/survei/template")}
                style={{ flex: 1, margin: "0.5rem" }}
              />
            </div>
          </form>

          {formDisabled && (
            <div className="mt-4">
              <h3>Daftar Pertanyaan</h3>
              <Table
                arrHeader={["No", "Pertanyaan"]}
                data={questions.map((item, index) => ({
                  id: item.id,
                  No: index + 1,
                  Pertanyaan: item.pertanyaan,
                  Aksi: (
                    <div className="d-flex gap-2">
                      <Button
                        classType="info"
                        label="Detail"
                        onClick={() => handleDetail(item.id)}
                        style={{ marginRight: "0.5rem" }}
                      />
                      <Button
                        classType="warning"
                        label="Edit"
                        onClick={() => handleEdit(item.id)}
                        style={{ marginRight: "0.5rem" }}
                      />
                      <Button
                        classType="danger"
                        label="Hapus"
                        onClick={() => handleDelete(item.id)}
                      />
                    </div>
                  ),
                }))}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
