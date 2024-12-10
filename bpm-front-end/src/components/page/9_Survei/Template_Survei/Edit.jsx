import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../../../part/Button";
import TextField from "../../../part/TextField";
import Table from "../../../part/Table";
import Dropdown from "../../../part/Dropdown";
import PageTitleNav from "../../../part/PageTitleNav";
import Swal from "sweetalert2";
import { useIsMobile } from "../../../util/useIsMobile";

function Edit() {
  const navigate = useNavigate();
  const { id } = useParams(); // Mendapatkan ID dari URL
  const isMobile = useIsMobile();

  // State untuk template survei
  const [templateName, setTemplateName] = useState("");
  const [selectedKriteria, setSelectedKriteria] = useState(null);
  const [selectedSkala, setSelectedSkala] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  // State untuk dropdown
  const [kriteriaOptions, setKriteriaOptions] = useState([]);
  const [skalaOptions, setSkalaOptions] = useState([]);

  useEffect(() => {
    // Fetch data template untuk edit
    const fetchTemplate = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${API_LINK}/TemplateSurvei/GetTemplate/${id}`
        );
        if (!response.ok) throw new Error("Gagal mengambil data template");

        const result = await response.json();
        setTemplateName(result.template_name);
        setSelectedKriteria(result.kriteria_id);
        setSelectedSkala(result.skala_id);
        setQuestions(result.questions);
      } catch (err) {
        console.error("Fetch error:", err);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Gagal mengambil data template!",
        });
        navigate("/survei/template");
      } finally {
        setLoading(false);
      }
    };

    // Fetch data dropdown
    const fetchDropdownData = async () => {
      try {
        const kriteriaResponse = await fetch(
          `${API_LINK}/MasterKriteriaSurvei/GetDataKriteriaSurvei`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ page: 1, pageSize: 100 }),
          }
        );
        const skalaResponse = await fetch(
          `${API_LINK}/MasterSkalaPenilaian/GetDataSkalaPenilaian`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );

        if (!kriteriaResponse.ok || !skalaResponse.ok) {
          throw new Error("Gagal mengambil data dropdown");
        }

        const kriteriaResult = await kriteriaResponse.json();
        const skalaResult = await skalaResponse.json();

        setKriteriaOptions(
          kriteriaResult.map((item) => ({
            value: item.ksr_id,
            label: item.ksr_nama,
          }))
        );
        setSkalaOptions(
          skalaResult.map((item) => ({
            value: item.skala_id,
            label: item.skala_nama,
          }))
        );
      } catch (err) {
        console.error("Fetch error:", err);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Gagal mengambil data dropdown!",
        });
      }
    };

    fetchTemplate();
    fetchDropdownData();
  }, [id, navigate]);

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

  const handleSave = async () => {
    try {
      const payload = {
        template_id: id,
        template_name: templateName,
        kriteria_id: selectedKriteria,
        skala_id: selectedSkala,
        questions,
      };

      const response = await fetch(
        `${API_LINK}/TemplateSurvei/UpdateTemplate`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) throw new Error("Gagal menyimpan template");

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Template berhasil disimpan!",
      });
      navigate("/survei/template");
    } catch (err) {
      console.error("Save error:", err);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Gagal menyimpan template!",
      });
    }
  };

  const handleCancel = () => {
    navigate("/survei/template");
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <main className="flex-grow-1 p-3" style={{ marginTop: "80px" }}>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="d-flex flex-column">
            <div className={isMobile ? "m-0 p-0" : "m-3 mb-0"}>
              <PageTitleNav
                title="Edit Template Survei"
                breadcrumbs={[
                  { label: "Survei", href: "/survei" },
                  { label: "Template Survei", href: "/survei/template" },
                  { label: "Edit Template Survei" },
                ]}
                onClick={() => navigate("/survei/template")}
              />

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
                <h3 className="text-center">Formulir Edit Template Survei</h3>
                <hr />
                <form>
                  <TextField
                    label="Nama Template"
                    isRequired
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                    placeholder="Masukkan Nama Template"
                  />
                  <Dropdown
                    label="Kriteria Survei"
                    isRequired
                    options={kriteriaOptions}
                    value={selectedKriteria}
                    onChange={(value) => setSelectedKriteria(value)}
                    placeholder="Pilih Kriteria Survei"
                  />
                  <Dropdown
                    label="Skala Penilaian"
                    isRequired
                    options={skalaOptions}
                    value={selectedSkala}
                    onChange={(value) => setSelectedSkala(value)}
                    placeholder="Pilih Skala Penilaian"
                  />
                </form>

                <div className="mt-3">
                  <Button
                    classType="primary"
                    label="Tambah Pertanyaan"
                    onClick={handleAddQuestion}
                  />
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
                    actions={["Edit", "Delete"]}
                    onDelete={(id) => handleDeleteQuestion(id)}
                  />
                </div>

                <div className="d-flex justify-content-between mt-4">
                  <Button
                    classType="primary"
                    label="Simpan"
                    onClick={handleSave}
                  />
                  <Button
                    classType="secondary"
                    label="Batal"
                    onClick={handleCancel}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Edit;
