import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { API_LINK } from "../../../util/Constants";
import { useIsMobile } from "../../../util/useIsMobile";
import PageTitleNav from "../../../part/PageTitleNav";
import SweetAlert from "../../../util/SweetAlert";
import Loading from "../../../part/Loading";
import InputField from "../../../part/InputField";
import Dropdown from "../../../part/Dropdown";
import Button from "../../../part/Button";
import Paging from "../../../part/Paging";
import CheckBox from "../../../part/CheckBox";
import Table from "../../../part/Table";
import { decodeHtml } from "../../../util/DecodeHtml";

export default function Edit() {
  const location = useLocation();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [kriteriaSurvei, setKriteriaSurvei] = useState([]);
  const [skalaPenilaian, setSkalaPenilaian] = useState([]);
  const [templateId, setTemplateId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [error, setError] = useState(null);
  const [pageCurrent, setPageCurrent] = useState(1);
  const [pageSize] = useState(10);
  const indexOfLastData = pageCurrent * pageSize;
  const indexOfFirstData = indexOfLastData - pageSize;
  const currentData = filteredData.slice(indexOfFirstData, indexOfLastData);
  const handlePageNavigation = (page) => setPageCurrent(page);
  const [formData, setFormData] = useState({
    name: "",
    createdBy: "dianvivi.widiyawati",
    modifiedBy: "dianvivi.widiyawati",
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
            body: JSON.stringify({ id: idData }), // Gunakan idData langsung
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

    const fetchPertanyaan = async () => {
      try {
        setLoading(true);

        // Panggilan API ke endpoint TemplateSurveiDetail
        const response = await fetch(
          `${API_LINK}/TemplateSurveiDetail/GetTemplateSurveiDetailByTemplateId`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ tsu_id: idData }), // Gunakan idData langsung
          }
        );

        const result = await response.json();
        console.log("Raw result from API:", result);

        if (!result || !Array.isArray(result)) {
          throw new Error("Data pertanyaan tidak valid atau gagal diambil.");
        }

        const filteredQuestions = result.filter(
          (item) =>
            item.tsu_id === idData &&
            (item.tsd_status === 0 || item.tsd_status === 1)
        );

        const formattedQuestions = filteredQuestions.map((item) => ({
          id: item.tsd_id,
          pertanyaan: item.tsd_pertanyaan,
        }));

        setData(formattedQuestions);
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

    fetchTemplateData();
    fetchPertanyaan(); // Panggil fetchPertanyaan dengan idData langsung
  }, [idData, navigate]);

  // Ambil data dropdown untuk Kriteria Survei dan Skala Penilaian
  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
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

  const handleSubmitDetail = async () => {
    console.log("handleSubmitDetail dimulai...");

    // Check if idData is available
    if (!idData) {
      console.error("ID Template tidak ditemukan.");
      SweetAlert("Error", "ID Template tidak ditemukan.", "error", "OK");
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
        tsu_id: idData,
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

  useEffect(() => {
    if (!idData) {
      navigate("/survei/template");
      return;
    }

    const fetchPertanyaan = async () => {
      try {
        setLoading(true);

        // Panggilan API ke endpoint TemplateSurveiDetail
        const response = await fetch(
          `${API_LINK}/TemplateSurveiDetail/GetTemplateSurveiDetailByTemplateId`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ tsu_id: idData }), // Menggunakan idData sebagai body
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
            item.tsu_id === idData && // Filter berdasarkan idData
            (item.tsd_status === 0 || item.tsd_status === 1) // Status aktif
        );

        const formattedQuestions = filteredQuestions.map((item) => ({
          id: item.tsd_id,
          pertanyaan: item.tsd_pertanyaan,
        }));

        setData(formattedQuestions); // Set data ke state
        setFilteredData(formattedQuestions); // Untuk filter data jika diperlukan
      } catch (error) {
        console.error("Error saat mengambil data pertanyaan:", error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: error.message || "Gagal mengambil data pertanyaan!",
        });
      } finally {
        setLoading(false); // Selesai loading
      }
    };

    fetchPertanyaan();
  }, [idData, templateId, navigate]);

  // useEffect(() => {
  //   fetchPertanyaan();
  // }, [templateId]);

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
            <InputField
              label="Nama Template"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
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
            <div className="d-flex justify-content-between mt-5">
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
