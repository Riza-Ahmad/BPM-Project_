import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../../part/Button";
import TextField from "../../../part/TextField";
import Table from "../../../part/Table";
import Dropdown from "../../../part/Dropdown";
import Loading from "../../../part/Loading";
import PageTitleNav from "../../../part/PageTitleNav";
import Swal from "sweetalert2";
import { useIsMobile } from "../../../util/useIsMobile";
import { API_LINK } from "../../../util/Constants";
import { useFetch } from "../../../util/useFetch";
import { id } from "date-fns/locale";

function Add() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [loading, setLoading] = useState(true);
  const [templateName, setTemplateName] = useState("");

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
      try {
        setLoadingKriteria(true);
        const data = await useFetch(
          `${API_LINK}/MasterKriteriaSurvei/GetDataKriteriaSurvei`,
          JSON.stringify({}),
          "POST"
        );
        const formattedKriteria = data.map((item) => ({
          value: item.ksr_id,
          Text: item.ksr_nama,
        }));
        setKriteriaOptions(formattedKriteria);
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: error.message || "Failed to fetch kriteria data!",
        });
      } finally {
        setLoadingKriteria(false);
      }
    };

    const fetchSkala = async () => {
      try {
        setLoadingSkala(true);
        const data = await useFetch(
          `${API_LINK}/SkalaPenilaian/GetSkalaPenilaian`,
          JSON.stringify({}),
          "POST"
        );
        const formattedSkala = data.map((item) => ({
          value: item.skp_id,
          Text: item.skp_deskripsi,
        }));
        setSkalaOptions(formattedSkala);
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: error.message || "Failed to fetch skala data!",
        });
      } finally {
        setLoadingSkala(false);
      }
    };

    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchKriteria(), fetchSkala()]);
      setLoading(false);
    };

    fetchData();
  }, []); // Untuk Load Kriteria dan Skala ke Dropdown

  const fetchQuestions = async (kriteriaId) => {
    try {
      setLoading(true);

      // Menyusun objek data sesuai dengan parameter yang dibutuhkan
      const dataToSend = {
        p1: kriteriaId, // Parameter pertama, yaitu kriteriaId
      };

      // Menggunakan fetch untuk pemanggilan API dengan metode POST
      const response = await fetch(
        `${API_LINK}/MasterPertanyaan/GetPertanyaanByKriteria`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dataToSend), // Kirim data dengan kriteria ID
        }
      );

      // Menunggu respons dan mengubahnya menjadi JSON
      const data = await response.json();

      // Format data yang diterima dari API
      const formattedQuestions =
        data?.map((item) => ({
          id: item.pty_id,
          header: item.pty_isheader,
          question: item.pty_pertanyaan,
          scale: item.pty_skala,
        })) || []; // Jika tidak ada data, return array kosong

      setQuestions(formattedQuestions); // Update state dengan data yang diformat
      console.log("Questions:", formattedQuestions); // Debugging: Cek data yang diterima dari API
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.message || "Failed to fetch questions!",
      });
    } finally {
      setLoading(false); // Set loading false setelah data diterima
    }
  };

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

  const handleSave = async (e) => {
    e.preventDefault();

    if (!selectedKriteria || !selectedSkala || !templateName) {
      Swal.fire("Error", "Harap lengkapi semua data!", "error");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        tsu_nama: templateName, // Nama template
        tsu_status: 0, // Status awal: Draft
        tsu_created_by: "dianvivi.widiyawati", // ID pengguna (ambil dari session/context)
        tsu_created_date: new Date(), // Tanggal dibuat (server-side juga menangani GETDATE)
        ksr_id: selectedKriteria, // ID kriteria yang dipilih
        skp_id: selectedSkala, // ID skala yang dipilih
      };

      // Menggunakan API createTemplateSurvei
      const response = await useFetch(
        `${API_LINK}/TemplateSurvei/createTemplateSurvei`,
        JSON.stringify(payload),
        "POST"
      );

      if (response?.success) {
        Swal.fire("Success", "Template berhasil disimpan!", "success");
        navigate("/survei/template");
      } else {
        throw new Error(response?.message || "Gagal menyimpan template!");
      }
    } catch (error) {
      Swal.fire("Error", error.message || "Terjadi kesalahan!", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/survei/template");
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <main className="flex-grow-1 p-3" style={{ marginTop: "80px" }}>
        <div className="d-flex flex-column">
          <div className={isMobile ? "m-0 p-0" : "m-3 mb-0"}>
            <PageTitleNav
              title="Tambah Template Survei"
              breadcrumbs={[
                { label: "Survei", href: "/survei" },
                { label: "Template Survei", href: "/survei/template/" },
                { label: "Tambah Template Survei" },
              ]}
              onClick={() => navigate("/survei/template")}
            />
          </div>
          {/* Form Section */}
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
            {/* Form Title */}
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
                  isRequired
                  placeholder="Masukkan Nama Template"
                  style={{ marginBottom: isMobile ? "1rem" : "2rem" }}
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                />

                {loadingKriteria ? (
                  <p>Loading Kriteria...</p>
                ) : (
                  <Dropdown
                    arrData={[
                      { value: "", Text: "-- Pilih Kriteria Survei --" },
                      ...kriteriaOptions,
                    ]}
                    label="Kriteria"
                    value={selectedKriteria}
                    onChange={(e) => setSelectedKriteria(e.target.value)}
                    isRequired={true}
                    style={{ marginBottom: isMobile ? "1rem" : "2rem" }}
                  />
                )}
                {loadingSkala ? (
                  <p>Loading Skala...</p>
                ) : (
                  <Dropdown
                    arrData={[
                      { value: "", Text: "-- Pilih Skala Penilaian --" },
                      ...skalaOptions,
                    ]}
                    label="Skala"
                    value={selectedSkala}
                    onChange={(e) => setSelectedSkala(e.target.value)}
                    isRequired={true}
                  />
                )}
              </form>
            </div>

            {/* Question Section */}
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

              {/* Question Table */}
              <Table
                arrHeader={["No", "Header", "Pertanyaan", "Skala"]}
                data={
                  questions.map((item, index) => ({
                    id: item.id,
                    No: index + 1,
                    Header: item.header,
                    Pertanyaan: item.question,
                    Skala: item.scale,
                  })) || []
                }
                actions={["Edit", "Delete"]}
                onDelete={(id) => handleDeleteQuestion(id)}
              />
            </div>
            {/* Action Buttons */}
            <div
              className="action-buttons"
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: isMobile ? "1rem" : "2rem",
              }}
            >
              <div className="flex flex-grow-1 m-2">
                <Button
                  width="100%"
                  classType="primary"
                  label="Simpan Template"
                  onClick={handleSave}
                  disabled={loading}
                />
              </div>
              <div className="flex flex-grow-1 m-2">
                <Button
                  width="100%"
                  classType="secondary"
                  label="Batal"
                  onClick={handleCancel}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Add;
