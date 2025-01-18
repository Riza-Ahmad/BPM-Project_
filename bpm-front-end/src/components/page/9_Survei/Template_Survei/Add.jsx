import React, { useState, useEffect } from "react";
import PageTitleNav from "../../../part/PageTitleNav";
import TextField from "../../../part/TextField";
import Button from "../../../part/Button";
import Loading from "../../../part/Loading";
import Dropdown from "../../../part/Dropdown";
import SweetAlert from "../../../util/SweetAlert";
import Table from "../../../part/Table";
import Paging from "../../../part/Paging";
import Modal from "../../../part/Modal";
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formDisabled, setFormDisabled] = useState(false);
  const [pageCurrent, setPageCurrent] = useState(1);
  const [pageSize] = useState(10);
  const [questionBank, setQuestionBank] = useState([]);
  const [kriteriaSurvei, setKriteriaSurvei] = useState([]);
  const [skalaPenilaian, setSkalaPenilaian] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newQuestion, setNewQuestion] = useState("");
  const [existingTemplates, setExistingTemplates] = useState([]);
  const [pertanyaan, setPertanyaan] = useState("");
  const [isHeader, setIsHeader] = useState(false);
  const [jenis, setJenis] = useState("");
  const [questions, setQuestions] = useState([]);
  const [
    templateId, setTemplateId] = useState(null);
  const [createdBy, setCreatedBy] = useState("");
  const isMobile = useIsMobile();
  const indexOfLastData = pageCurrent * pageSize;
  const indexOfFirstData = indexOfLastData - pageSize;
  const currentData = filteredData.slice(indexOfFirstData, indexOfLastData);
  const handlePageNavigation = (page) => setPageCurrent(page);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    ksrId: "",
    skpId: "",
    createdBy: "dianvivi.widiyawati",
  });

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        setLoading(true);

        // Fetch MasterKriteriaSurvei and filter for status 1
        const kriteriaData = await fetchAPI(
          `${API_LINK}/MasterKriteriaSurvei/GetDataKriteriaSurvei`,
          JSON.stringify({})
        );
        const filteredKriteriaData = kriteriaData.filter(
          (item) => item.ksr_status === 1
        );
        setKriteriaSurvei(
          filteredKriteriaData.map((item) => ({
            Value: item.ksr_id,
            Text: item.ksr_nama,
          }))
        );

        // Fetch SkalaPenilaian and filter for status 1
        const skalaData = await fetchAPI(
          `${API_LINK}/SkalaPenilaian/GetSkalaPenilaian`,
          JSON.stringify({})
        );
        const filteredSkalaData = skalaData.filter(
          (item) => item.skp_status === 1
        );
        setSkalaPenilaian(
          filteredSkalaData.map((item) => ({
            Value: item.skp_id,
            Text: item.skp_skala + " (" + item.skp_deskripsi + ")",
          }))
        );
      } catch (err) {
        console.error("Error fetching dropdown data:", err);
        setError("Gagal memuat data dropdown. Silakan coba lagi nanti.");
      } finally {
        setLoading(false);
      }
    };

    fetchDropdownData();
  }, []);

  // Fungsi untuk fetch existing templates
  const fetchExistingTemplates = async () => {
    try {
      const response = await fetch(
        `${API_LINK}/TemplateSurvei/GetTemplateSurvei`,
        {
          method: "POST", // Change to POST
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}), // Send empty body if no specific data is needed
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch data, status: " + response.status);
      }

      const data = await response.json(); // Parse the JSON response
      setExistingTemplates(data); // Save the data to the state
    } catch (err) {
      console.error("Error fetching existing templates:", err);
      SweetAlert(
        "Error",
        "Gagal mengambil data template survei.",
        "error",
        "OK"
      );
    }
  };

  // Panggil fungsi saat komponen dimuat
  useEffect(() => {
    fetchExistingTemplates();
  }, []);

  // Validasi form dengan menunggu data
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

    // Pastikan existingTemplates sudah terisi
    // if (existingTemplates && Array.isArray(existingTemplates)) {
    //   const isDuplicate = existingTemplates.some(
    //     (template) =>
    //       template.nama_template.trim().toLowerCase() ===
    //         formData.name.trim().toLowerCase() &&
    //       template.ksr_id === parseInt(formData.ksrId, 10) &&
    //       template.skp_id === parseInt(formData.skpId, 10)
    //   );

    //   if (isDuplicate) {
    //     return "Template survei dengan nama, kriteria survei, dan skala penilaian yang sama sudah ada.";
    //   }
    // } else {
    //   console.error("existingTemplates is not an array or not yet populated");
    // }

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
        ksr_id: parseInt(formData.ksrId, 10),
        skp_id: parseInt(formData.skpId, 10),
        created_by: formData.createdBy,
      };

      const response = await fetchAPI(
        `${API_LINK}/TemplateSurvei/CreateTemplateSurvei`,
        JSON.stringify(payload)
      );

      console.log("Response from CreateTemplateSurvei:", response);

      // Pastikan templateId diambil dari response
      if (response && response.templateId) {
        setTemplateId(response.templateId); // Simpan templateId dalam state
        setFormDisabled(true); // Disable form
        SweetAlert(
          "Sukses",
          "Template survei berhasil dibuat.",
          "success",
          "OK"
        );
      } else {
        SweetAlert(
          "Error",
          response?.message || "Gagal mendapatkan ID template.",
          "error",
          "OK"
        );
      }
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

  const handleSubmitDetail = async () => {
    if (!templateId) {
      SweetAlert("Error", "Template ID tidak ditemukan.", "error", "OK");
      return;
    }

    if (!pertanyaan) {
      SweetAlert("Error", "Pertanyaan tidak boleh kosong.", "error", "OK");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        tsu_id: templateId, 
        tsd_pertanyaan: pertanyaan,
        tsd_isheader: isHeader ? 1 : 0,
        tsd_jenis: jenis,
        tsd_created_by: createdBy,
      };

      const response = await fetchAPI(
        `${API_LINK}/TemplateSurveiDetail/CreateTemplateSurveiDetail`,
        JSON.stringify(payload)
      );

      console.log("API Response:", response);

      if (response && response.success) {
        SweetAlert(
          "Sukses",
          "Pertanyaan berhasil ditambahkan.",
          "success",
          "OK"
        );
        setCurrentData((prev) => [...prev, payload]);
        setPertanyaan(""); 
      } else {
        SweetAlert(
          "Error",
          response?.message || "Terjadi kesalahan saat menambahkan pertanyaan.",
          "error",
          "OK"
        );
      }
    } catch (err) {
      console.error("Error submitting detail:", err);
      SweetAlert("Error", "Gagal menambahkan pertanyaan.", "error", "OK");
    } finally {
      setLoading(false);
    }
  };

  const handleAddQuestion = () => {
    setModalVisible(true); // Tampilkan modal
  };

  // const handleSaveNewQuestion = async () => {
  //   if (!newQuestion.trim()) {
  //     SweetAlert("Error", "Pertanyaan tidak boleh kosong.", "error", "OK");
  //     return;
  //   }

  //   setLoading(true);
  //   try {
  //     const payload = {
  //       tsu_id: formData.ksrId, // Assuming tsu_id corresponds to ksrId
  //       tsd_pertanyaan: newQuestion,
  //       tsd_isheader: 0, // Set the default value for tsd_isheader (e.g., 0 or 1 depending on your logic)
  //       tsd_jenis: jenis, // Assuming ksrId is needed here
  //       tsd_status: 1, // Set default status (1 = active, or adjust according to your status logic)
  //       tsd_created_by: formData.createdBy,
  //       //tsd_created_date: new Date().toISOString(), // Set the current date and time
  //     };

  //     const response = await fetchAPI(
  //       `${API_LINK}/TemplateSurveiDetail/CreateTemplateSurveiDetail`,
  //       JSON.stringify(payload)
  //     );

  //     console.log("Response from CreatePertanyaan:", response);

  //     // Assuming the response contains the necessary ID or other details, adjust accordingly.
  //     const addedQuestion = {
  //       id: response.id || Math.random(), // Fallback in case the response does not return an ID
  //       pertanyaan: newQuestion,
  //     };
  //     setQuestions([...questions, addedQuestion]);
  //     setFilteredData([...questions, addedQuestion]); // Update table data

  //     SweetAlert("Sukses", "Pertanyaan berhasil ditambahkan.", "success", "OK");
  //     setModalVisible(false); // Close modal
  //     setNewQuestion(""); // Reset input
  //   } catch (err) {
  //     console.error("Error saving new question:", err);
  //     SweetAlert(
  //       "Error",
  //       "Gagal menambahkan pertanyaan. Silakan coba lagi.",
  //       "error",
  //       "OK"
  //     );
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleCancelQuestions = () => {
    setPertanyaan("");
    setIsHeader(false);
    setIsGeneral("multiple_choice");
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
              <form onSubmit={handleSubmitDetail}>
                <div className="row mb-2">
                  {/* Checkbox Header */}
                  <div className="col-2 d-flex align-items-center">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={isHeader}
                        onChange={() => setIsHeader(!isHeader)}
                      />
                      <label className="form-check-label">Header?</label>
                    </div>
                  </div>

                  {/* TextField untuk Pertanyaan */}
                  <div className="col-7">
                    <TextField
                      label={
                        <span>
                          Pertanyaan <span className="text-danger">*</span>
                        </span>
                      }
                      value={pertanyaan}
                      onChange={(e) => setPertanyaan(e.target.value)}
                      required
                    />
                  </div>

                  {/* Dropdown Jenis Pertanyaan */}
                  <div className="col-3">
                    <Dropdown
                      label="Jenis Pertanyaan"
                      arrData={[
                        { Value: "Pilihan Ganda", Text: "Pilihan Ganda" },
                        { Value: "Jawaban Singkat", Text: "Jawaban Singkat" },
                      ]}
                      type="pilih"
                      forInput="jenisPertanyaan"
                      value={jenis} // Ensure the selected value is passed here
                      isRequired={true}
                      errorMessage="Jenis pertanyaan wajib dipilih."
                      onChange={(e) => setJenis(e.target.value)} // Update state when selection changes
                    />
                  </div>
                </div>
              </form>

              {/* Buttons for Actions */}
              <div className="d-flex justify-content-start gap-2 mt-4 mb-4">
                <Button
                  iconName="add"
                  classType="primary"
                  label="Tambah Pertanyaan"
                  onClick={handleSubmitDetail}
                />
                <Button
                  iconName="file-upload"
                  classType="primary"
                  style={{
                    backgroundColor: "#28a745",
                    color: "#fff",
                    border: "none",
                  }}
                  label="Import Pertanyaan"
                />
                <Button
                  iconName="file-download"
                  classType="primary"
                  style={{
                    backgroundColor: "#28a745",
                    color: "#fff",
                    border: "none",
                  }}
                  label="Export Pertanyaan"
                />
              </div>

              {/* Table */}
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

              {/* Pagination */}
              <Paging
                pageSize={pageSize}
                pageCurrent={pageCurrent}
                totalData={filteredData.length}
                navigation={handlePageNavigation}
              />

              {/* Simpan dan Batal Buttons */}
              <div className="d-flex justify-content-between mt-3">
                <Button
                  classType="primary"
                  label="Simpan"
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
