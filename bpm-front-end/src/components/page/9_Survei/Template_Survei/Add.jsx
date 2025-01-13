import React, { useState, useEffect } from "react";
import PageTitleNav from "../../../part/PageTitleNav";
import TextField from "../../../part/TextField";
import Button from "../../../part/Button";
import Loading from "../../../part/Loading";
import Dropdown from "../../../part/Dropdown";
import SweetAlert from "../../../util/SweetAlert";
import Table from "../../../part/Table";
import Paging from "../../../part/Paging";
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
  const [pageCurrent, setPageCurrent] = useState(1);
  const [pageSize] = useState(10);
  const [questions, setQuestions] = useState([]);
  const [questionBank, setQuestionBank] = useState([]);
  const [kriteriaSurvei, setKriteriaSurvei] = useState([]);
  const [skalaPenilaian, setSkalaPenilaian] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const indexOfLastData = pageCurrent * pageSize;
  const indexOfFirstData = indexOfLastData - pageSize;
  const currentData = filteredData.slice(indexOfFirstData, indexOfLastData);
  const handlePageNavigation = (page) => setPageCurrent(page);
  const [formData, setFormData] = useState({
    name: "",
    createdBy: "dianvivi.widiyawati",
    ksrId: "",
    skpId: "",
  });

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
        nama_template: formData.name,
        created_by: formData.createdBy,
        ksr_id: parseInt(formData.ksrId, 10),
        skp_id: parseInt(formData.skpId, 10),
      };

      const response = await fetchAPI(
        `${API_LINK}/TemplateSurvei/CreateTemplateSurvei`,
        JSON.stringify(payload)
      );

      console.log("Response from CreateTemplateSurvei:", response);

      setFormDisabled(true); // Disable form
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

  const handleAddQuestion = () => {
    console.log("Tambah Pertanyaan");
    setQuestions([...questions, { id: questions.length + 1, pertanyaan: "" }]);
  };

  const handleSaveQuestions = () => {
    console.log("Simpan Pertanyaan");
  };

  const handleCancelQuestions = () => {
    setQuestions([]);
    console.log("Batalkan Pertanyaan");
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
              disabled={formDisabled}
            />
            <TextField
              label="Dibuat Oleh"
              value={formData.createdBy}
              onChange={(e) =>
                setFormData({ ...formData, createdBy: e.target.value })
              }
              isRequired={true}
              disabled={formDisabled}
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
              disabled={formDisabled}
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
              disabled={formDisabled}
            />
            {!formDisabled && (
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
            )}
          </form>

          {formDisabled && (
            <div className="mt-5">
              <h3 style={{ textAlign: "center", margin: "1rem 0" }}>
                Daftar Pertanyaan 
                <hr />
              </h3>
              <Button
                classType="primary"
                label="Tambah Pertanyaan"
                onClick={handleAddQuestion}
                style={{ marginBottom: "1rem" }}
              />
              <Table
                arrHeader={["No", "Pertanyaan"]}
                data={currentData.map((item, index) => ({
                  id: item.id,
                  No: index + 1,
                  Pertanyaan: item.pertanyaan,
                }))}
                actions={["Edit", "Delete"]}
                onEdit={(item) =>
                  onChangePage("edit", { state: { idData: item.Key } })
                }
                onDelete={(item) => handleDelete(item.Key)}
              />
              <Paging
                pageSize={pageSize}
                pageCurrent={pageCurrent}
                totalData={filteredData.length}
                navigation={handlePageNavigation}
              />
              <div className="d-flex justify-content-between mt-3">
                <Button
                  classType="primary"
                  label="Simpan"
                  onClick={handleSaveQuestions}
                  style={{ flex: 1, margin: "0.5rem" }}
                />
                <Button
                  classType="danger"
                  label="Batal"
                  onClick={handleCancelQuestions}
                  style={{ flex: 1, margin: "0.5rem" }}
                />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
