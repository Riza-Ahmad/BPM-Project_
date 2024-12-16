import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../../part/Button";
import TextField from "../../../part/TextField";
import Table from "../../../part/Table";
import Dropdown from "../../../part/Dropdown";
import PageTitleNav from "../../../part/PageTitleNav";
import Swal from "sweetalert2";
import { useIsMobile } from "../../../util/useIsMobile";
import { API_LINK } from "../../../util/Constants";

function Add() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // State untuk Dropdown dan Pertanyaan
  const [kriteriaOptions, setKriteriaOptions] = useState([]);
  const [skalaOptions, setSkalaOptions] = useState([]);
  const [questions, setQuestions] = useState([]);

  // State untuk Value Dropdown
  const [selectedKriteria, setSelectedKriteria] = useState(null);
  const [selectedSkala, setSelectedSkala] = useState(null);

  // State loading
  const [loadingKriteria, setLoadingKriteria] = useState(true);
  const [loadingSkala, setLoadingSkala] = useState(true);

  useEffect(() => {
    const fetchKriteria = async () => {
      setLoadingKriteria(true);
      try {
        const response = await fetch(
          `${API_LINK}/MasterKriteriaSurvei/GetDataKriteriaSurvei`
        );
        const result = await response.json();
        const options = result.map((item) => ({
          value: item.ksr_id,
          label: item.ksr_nama,
        }));
        setKriteriaOptions(options);
      } catch (err) {
        Swal.fire("Error", "Gagal mengambil data kriteria!", "error");
      } finally {
        setLoadingKriteria(false);
      }
    };

    const fetchSkala = async () => {
      setLoadingSkala(true);
      try {
        const response = await fetch(
          `${API_LINK}/SkalaPenilaian/GetSkalaPenilaian`
        );
        const result = await response.json();
        const options = result.map((item) => ({
          value: item.skala_id,
          label: item.skala_nama,
        }));
        setSkalaOptions(options);
      } catch (err) {
        Swal.fire("Error", "Gagal mengambil data skala!", "error");
      } finally {
        setLoadingSkala(false);
      }
    };

    fetchKriteria();
    fetchSkala();
  }, []);

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: questions.length + 1,
        header: "",
        question: "",
        scale: "",
      },
    ]);
  };

  const handleDeleteQuestion = (id) => {
    const updatedQuestions = questions.filter((q) => q.id !== id);
    setQuestions(updatedQuestions);
  };

  const handleScaleChange = (id, value) => {
    setQuestions(
      questions.map((q) => (q.id === id ? { ...q, scale: value } : q))
    );
  };

  const handleSave = (e) => {
    e.preventDefault();

    if (!selectedKriteria || !selectedSkala || questions.length === 0) {
      Swal.fire("Error", "Harap lengkapi semua data!", "error");
      return;
    }

    console.log("Data disimpan:", {
      kriteria: selectedKriteria,
      skala: selectedSkala,
      questions: questions,
    });

    Swal.fire("Success", "Template berhasil disimpan!", "success");
    navigate("/survei/template");
  };

  const handleCancel = () => {
    navigate("/survei/template");
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <main className="flex-grow-1 p-3" style={{ marginTop: "80px" }}>
        <PageTitleNav
          title="Tambah Template Survei"
          breadcrumbs={[
            { label: "Survei", href: "/survei" },
            { label: "Template Survei", href: "/survei/template" },
            { label: "Tambah Template Survei" },
          ]}
        />

        <div className="form-container" style={{ marginTop: "2rem" }}>
          <form onSubmit={handleSave}>
            <TextField
              label="Nama Template"
              isRequired
              placeholder="Masukkan Nama Template"
            />

            {loadingKriteria ? (
              <p>Loading Kriteria...</p>
            ) : (
              <Dropdown
                label="Kriteria Survei"
                isRequired
                placeholder="Pilih Kriteria Survei"
                options={kriteriaOptions}
                onChange={(value) => setSelectedKriteria(value)}
              />
            )}

            {loadingSkala ? (
              <p>Loading Skala...</p>
            ) : (
              <Dropdown
                label="Skala Penilaian"
                isRequired
                placeholder="Pilih Skala Penilaian"
                options={skalaOptions}
                onChange={(value) => setSelectedSkala(value)}
              />
            )}

            <div className="my-3">
              <h4>Pertanyaan</h4>
              <Button
                iconName="add"
                classType="primary"
                label="Tambah Pertanyaan Baru"
                onClick={handleAddQuestion}
              />
              <Table
                arrHeader={["No", "Header", "Pertanyaan", "Skala"]}
                data={questions.map((q, index) => ({
                  key: q.id,
                  No: index + 1,
                  header: (
                    <TextField
                      value={q.header}
                      placeholder="Isi Header"
                      onChange={(e) =>
                        setQuestions(
                          questions.map((item) =>
                            item.id === q.id
                              ? { ...item, header: e.target.value }
                              : item
                          )
                        )
                      }
                    />
                  ),
                  question: (
                    <TextField
                      value={q.question}
                      placeholder="Isi Pertanyaan"
                      onChange={(e) =>
                        setQuestions(
                          questions.map((item) =>
                            item.id === q.id
                              ? { ...item, question: e.target.value }
                              : item
                          )
                        )
                      }
                    />
                  ),
                  scale: (
                    <Dropdown
                      placeholder="Pilih Skala"
                      options={skalaOptions}
                      onChange={(value) => handleScaleChange(q.id, value)}
                    />
                  ),
                }))}
                actions={["Delete"]}
                onDelete={(id) => handleDeleteQuestion(id)}
              />
            </div>

            <div className="d-flex justify-content-between">
              <Button classType="primary" label="Simpan" type="submit" />
              <Button
                classType="secondary"
                label="Batal"
                onClick={handleCancel}
              />
            </div>
          </form> 
        </div>
      </main>
    </div>
  );
}

export default Add;
