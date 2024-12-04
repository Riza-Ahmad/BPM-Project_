import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../../part/Button";
import TextField from "../../../part/TextField";
import Table from "../../../part/Table";
import Dropdown from "../../../part/Dropdown";
import PageTitleNav from "../../../part/PageTitleNav";
import Swal from "sweetalert2";
import { useIsMobile } from "../../../util/useIsMobile";

function Add() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // State untuk pertanyaan
  const [questions, setQuestions] = useState([
    { id: 1, header: "", question: "", scale: "Radio Button" },
    { id: 2, header: "", question: "", scale: "Text Area" },
  ]);

  // State untuk dropdown
  const [kriteriaOptions, setKriteriaOptions] = useState([]);
  const [skalaOptions, setSkalaOptions] = useState([]);
  const [loadingKriteria, setLoadingKriteria] = useState(true);
  const [loadingSkala, setLoadingSkala] = useState(true);

  // Fetch data untuk Dropdown
  useEffect(() => {
    const fetchKriteria = async () => {
      setLoadingKriteria(true);
      try {
        const response = await fetch(
          `${API_LINK}/MasterKriteriaSurvei/GetDataKriteriaSurvei`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ page: 1, pageSize: 100 }),
          }
        );
        if (!response.ok) throw new Error("Gagal mengambil data kriteria");

        const result = await response.json();
        const options = result.map((item) => ({
          value: item.ksr_id,
          label: item.ksr_nama,
        }));
        setKriteriaOptions(options);
      } catch (err) {
        console.error("Fetch error:", err);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Gagal mengambil data kriteria!",
        });
      } finally {
        setLoadingKriteria(false);
      }
    };

    const fetchSkala = async () => {
      setLoadingSkala(true);
      try {
        const response = await fetch(
          `${API_LINK}/MasterSkalaPenilaian/GetDataSkalaPenilaian`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );
        if (!response.ok) throw new Error("Gagal mengambil data skala");

        const result = await response.json();
        const options = result.map((item) => ({
          value: item.skala_id,
          label: item.skala_nama,
        }));
        setSkalaOptions(options);
      } catch (err) {
        console.error("Fetch error:", err);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Gagal mengambil data skala!",
        });
      } finally {
        setLoadingSkala(false);
      }
    };

    fetchKriteria();
    fetchSkala();
  }, []);

  // Event Handlers
  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: questions.length + 1,
        header: "",
        question: "",
        scale: "Radio Button",
      },
    ]);
  };

  const handleDeleteQuestion = (id) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  const handleInputChange = (id, field, value) => {
    setQuestions(
      questions.map((q) => (q.id === id ? { ...q, [field]: value } : q))
    );
  };

  const handleSave = () => {
    console.log("Template disimpan dengan pertanyaan:", questions);
    navigate("/survei/template");
  };

  const handleCancel = () => {
    navigate("/survei/template");
  };

  const title = "Tambah Template Survei";
  const breadcrumbs = [
    { label: "Survei / Template Survei / Tambah Template Survei" },
  ];

  return (
    <div className="d-flex flex-column min-vh-100">
      <main className="flex-grow-1" style={{ marginTop: "80px" }}>
        <div className="d-flex flex-column" style={{ padding: "0 3rem" }}>
          <div
            className="mb-0"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <PageTitleNav
              title={title}
              breadcrumbs={breadcrumbs}
              onClick={() => navigate("/survei/template")}
            />
          </div>

          <div
            className="form-container"
            style={{
              marginTop: "2rem",
              padding: isMobile ? "1rem" : "2rem",
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              backgroundColor: "#fff",
            }}
          >
            <div
              className="form-section"
              style={{ marginBottom: isMobile ? "1rem" : "2rem" }}
            >
              <h3
                style={{
                  fontSize: isMobile ? "1.25rem" : "1.5rem",
                  textAlign: "center",
                }}
              >
                Formulir Template Survei
                <hr />
              </h3>
              <form>
                <TextField
                  label="Nama Template"
                  isRequired={true}
                  placeholder="Masukkan Nama Template"
                  style={{ marginBottom: isMobile ? "1rem" : "2rem" }}
                />
                {loadingKriteria ? (
                  <p>Loading Kriteria...</p>
                ) : (
                  <Dropdown
                    label="Kriteria Survei"
                    isRequired={true}
                    placeholder="Pilih Kriteria Survei"
                    options={kriteriaOptions}
                    onChange={(value) =>
                      console.log("Selected Kriteria:", value)
                    }
                    style={{ marginBottom: isMobile ? "1rem" : "2rem" }}
                  />
                )}
                {loadingSkala ? (
                  <p>Loading Skala...</p>
                ) : (
                  <Dropdown
                    label="Skala Penilaian"
                    isRequired={true}
                    placeholder="Pilih Skala Penilaian"
                    options={skalaOptions}
                    onChange={(value) => console.log("Selected Skala:", value)}
                    style={{ marginBottom: isMobile ? "1rem" : "2rem" }}
                  />
                )}
              </form>
            </div>

            <div
              className="question-section"
              style={{ marginBottom: isMobile ? "1rem" : "2rem" }}
            >
              <h3 className="text-center">
                Tambah Pertanyaan
                <hr />
              </h3>
              <div className="mb-3">
                <Button
                  iconName="add"
                  classType="primary"
                  label="Tambah Pertanyaan Baru"
                  onClick={handleAddQuestion}
                  style={{ marginBottom: isMobile ? "1rem" : "2rem" }}
                />
              </div>

              <Table
                arrHeader={["No", "Header", "Pertanyaan", "Skala"]}
                headerToDataMap={{
                  No: "No",
                  Header: "header",
                  Pertanyaan: "question",
                  Skala: "scale",
                }}
                data={questions.map((q, index) => ({
                  key: q.id,
                  No: index + 1,
                  header: q.header,
                  question: q.question,
                  scale: q.scale,
                }))}
                actions={["Delete"]}
                onDelete={(id) => handleDeleteQuestion(id)}
              />
            </div>

            <div
              className="action-buttons"
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: isMobile ? "1rem" : "2rem",
              }}
            >
              <Button classType="primary" label="Simpan" onClick={handleSave} />
              <Button
                classType="secondary"
                label="Batal"
                onClick={handleCancel}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Add;
