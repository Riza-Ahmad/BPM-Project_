import React, { useState, useEffect } from "react";
import PageTitleNav from "../../../part/PageTitleNav";
import InputField from "../../../part/InputField";
import Button from "../../../part/Button";
import Loading from "../../../part/Loading";
import Dropdown from "../../../part/Dropdown";
import SweetAlert from "../../../util/SweetAlert";
import Swal from "sweetalert2";
import Table from "../../../part/Table";
import Paging from "../../../part/Paging";
import CheckBox from "../../../part/CheckBox";
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
  const [data, setData] = useState([]);
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
  const [templateId, setTemplateId] = useState(null);
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
    pertanyaan: "",
    isHeader: "",
    jenis: "",
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
    console.log("handleSubmit dimulai...");

    const errorMessage = validateForm();
    if (errorMessage) {
      console.error("Validasi form gagal:", errorMessage);
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

      console.log("Payload yang dikirim ke API:", payload);

      const response = await fetchAPI(
        `${API_LINK}/TemplateSurvei/CreateTemplateSurvei`,
        JSON.stringify(payload)
      );

      console.log("Response dari API:", response);

      const templateId =
        response?.templateId || response?.[0]?.templateId || null;

      if (templateId) {
        console.log("Template ID berhasil didapatkan:", templateId);
        setTemplateId(templateId); // Store the templateId
        setFormData((prev) => ({ ...prev, templateId })); // Update formData with templateId
        setFormDisabled(true);
        SweetAlert(
          "Sukses",
          "Template survei berhasil dibuat.",
          "success",
          "OK"
        );
      } else {
        console.error("Template ID gagal didapatkan:", response);
        SweetAlert(
          "Error",
          response?.message || "Gagal mendapatkan ID template.",
          "error",
          "OK"
        );
      }
    } catch (err) {
      console.error("Error saat mengirim data:", err);
      SweetAlert(
        "Error",
        "Terjadi kesalahan saat mengirim data.",
        "error",
        "OK"
      );
    } finally {
      setLoading(false);
      console.log("handleSubmit selesai.");
    }
  };

  const handleSubmitDetail = async () => {
    console.log("handleSubmitDetail dimulai...");

    // Check if templateId is available
    if (!templateId) {
      console.error("Template ID tidak ditemukan.");
      SweetAlert("Error", "Template ID tidak ditemukan.", "error", "OK");
      return;
    }

    // Check if required fields are provided
    if (!formData.pertanyaan) {
      console.error("Pertanyaan kosong.");
      SweetAlert("Error", "Pertanyaan tidak boleh kosong.", "error", "OK");
      return;
    }

    if (!formData.jenis) {
      console.error("Jenis pertanyaan belum dipilih.");
      SweetAlert("Error", "Jenis pertanyaan harus dipilih.", "error", "OK");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        tsu_id: templateId, // Menggunakan templateId yang sudah ada
        tsd_pertanyaan: formData.pertanyaan,
        tsd_isheader: formData.isHeader ? 1 : 0,
        tsd_jenis: formData.jenis,
        tsd_created_by: formData.createdBy,
      };

      console.log("Payload untuk detail pertanyaan:", payload);

      // Mengirim request ke API
      const response = await fetchAPI(
        `${API_LINK}/TemplateSurveiDetail/CreateTemplateSurveiDetail`,
        JSON.stringify(payload)
      );

      console.log("Response dari API:", response);

      if (response && response.success) {
        console.log("Pertanyaan berhasil ditambahkan:", response.data);
        SweetAlert(
          "Sukses",
          "Pertanyaan berhasil ditambahkan.",
          "success",
          "OK"
        );

        // Pastikan response.data berisi data yang valid
        if (response.data) {
          // Menambahkan data pertanyaan baru ke dalam state
          setData((prev) => [...prev, { ...response.data }]);
        }

        // Reset form
        setPertanyaan("");
        setJenis("");
        setIsHeader(false);
      } else {
        console.error("Gagal menambahkan pertanyaan:", response);
        SweetAlert(
          "Error",
          response?.message || "Terjadi kesalahan saat menambahkan pertanyaan.",
          "error",
          "OK"
        );
      }
    } catch (err) {
      console.error("Error saat menambahkan pertanyaan:", err);
      SweetAlert("Error", "Gagal menambahkan pertanyaan.", "error", "OK");
    } finally {
      setLoading(false);
      console.log("handleSubmitDetail selesai.");
    }
  };

  const fetchPertanyaan = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_LINK}/TemplateSurveiDetail/GetTemplateSurveiDetailByTemplateId`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tsu_id: templateId }), // Menggunakan tsu_id untuk filter template
        }
      );

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();

      console.log("Raw result from API:", result);

      if (!result || !Array.isArray(result)) {
        throw new Error("Data pertanyaan tidak valid atau gagal diambil.");
      }

      const filteredQuestions = result.filter(
        (item) =>
          item.tsu_id === templateId &&
          (item.tsd_status === 0 || item.tsd_status === 1)
      );

      const formattedQuestions = filteredQuestions.map((item) => ({
        id: item.tsd_id,
        pertanyaan: item.tsd_pertanyaan,
      }));

      setData(formattedQuestions);
      setFilteredData(formattedQuestions);
    } catch (error) {
      console.error("Error saat mengambil data pertanyaan:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.message || "Gagal mengambil data pertanyaan!",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPertanyaan();
  }, [templateId]); // Ensure the effect is triggered when templateId changes

  const handleAddQuestion = () => {
    setModalVisible(true);
  };

  const handleCancelQuestions = () => {
    setPertanyaan("");
    setIsHeader(false);
    setJenis("null");
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
            <InputField
              label="Nama Template"
              placeholder="Masukkan Nama Template"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              isRequired={true}
              disabled={formDisabled}
            />
            {/* <InputField
              label="Dibuat Oleh"
              value={formData.createdBy}
              onChange={(e) =>
                setFormData({ ...formData, createdBy: e.target.value })
              }
              isRequired={true}
              disabled={formDisabled}
            /> */}
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
                    <CheckBox
                      label="Header?"
                      name="isHeader"
                      arrData={[{ Value: "1" }]} // Only a single checkbox option with value "1"
                      values={formData.isHeader ? ["1"] : []} // Checked if true, otherwise empty array
                      onChange={(newValues) => {
                        setFormData({
                          ...formData,
                          isHeader: newValues.length > 0, // If checked, set to true
                        });
                      }}
                    />
                  </div>

                  {/* InputField untuk Pertanyaan */}
                  <div className="col-7">
                    <InputField
                      label={<span>Pertanyaan</span>}
                      value={formData.pertanyaan}
                      onChange={(e) =>
                        setFormData({ ...formData, pertanyaan: e.target.value })
                      }
                      isRequired={true}
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
                      value={formData.jenis}
                      onChange={(e) =>
                        setFormData({ ...formData, jenis: e.target.value })
                      }
                      isRequired={true}
                      errorMessage="Jenis pertanyaan wajib dipilih."
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

              <Table
                arrHeader={["No", "Pertanyaan"]}
                data={currentData.map((item, index) => ({
                  Key: item.id,
                  No: indexOfFirstData + index + 1,
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
              {/* Simpan dan Batal Buttons
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
              </div> */}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
