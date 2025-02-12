import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import PageTitleNav from "../../../part/PageTitleNav";
import HeaderForm from "../../../part/HeaderText";
import Button from "../../../part/Button";
import Dropdown from "../../../part/Dropdown";
import CheckBox from "../../../part/CheckBox";
import InputField from "../../../part/InputField";
import SweetAlert from "../../../util/SweetAlert";
import { useIsMobile } from "../../../util/useIsMobile";
import { API_LINK } from "../../../util/Constants";
import { useFetch } from "../../../util/useFetch";
import SearchField from "../../../part/SearchField";
import Filter from "../../../part/Filter";
import DetailData from "../../../part/DetailData";
import Table from "../../../part/Table";
import Paging from "../../../part/Paging";
import HeaderText from "../../../part/HeaderText";
import { decodeHtml } from "../../../util/DecodeHtml";

// Opsi sorting untuk pertanyaan di modal
const arrSort = [
  { Value: "namaPertanyaan ASC", Text: "Nama Pertanyaan [↑]" },
  { Value: "namaPertanyaan DESC", Text: "Nama Pertanyaan [↓]" },
  { Value: "tanggalBuat ASC", Text: "Waktu Dibuat [↑]" },
  { Value: "tanggalBuat DESC", Text: "Waktu Dibuat [↓]" },
];

export default function Detail({ onChangePage }) {
  const { id } = useParams(); // ambil id dari URL
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const idData = location.state?.idData;

  // Form data untuk template survei, termasuk properti pertanyaan
  const [formData, setFormData] = useState({
    idData: "",
    namaTemplate: "",
    ksrId: "",
    skpId: "",
    responden: [],
    pertanyaan: [],
  });

  // Data detail pertanyaan yang sudah ditambahkan
  const [pertanyaan, setPertanyaan] = useState([]);
  const [selectedKriteria, setSelectedKriteria] = useState("");
  const [selectedSkala, setSelectedSkala] = useState("");
  const [idPertanyaan, setIdPertanyaan] = useState("");
  const [idEdit, setIdEdit] = useState("");

  // Opsi untuk Kriteria Survei (ksrOptions) dan Skala Penilaian (skpOptions)
  const [ksrOptions, setKsrOptions] = useState([]);
  const [skpOptions, setSkpOptions] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Refs untuk validasi
  const namaTemplateRef = useRef();
  const respondenRef = useRef();

  // State untuk modal tambah pertanyaan
  const [showModal, setShowModal] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedSort, setSelectedSort] = useState("namaPertanyaan ASC");
  const [pageCurrent, setPageCurrent] = useState(1);
  const [pageSize] = useState(5);
  const [totalData, setTotalData] = useState(0);
  const [filteredData, setFilteredData] = useState([]);
  // Untuk penambahan multi pertanyaan (checkbox)
  const [tambahPertanyaan, setTambahPertanyaan] = useState([]);
  const [isInstrumenFetched, setIsInstrumenFetched] = useState(false);

  // Fungsi untuk membuka dan menutup modal
  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const [aksiIs, setAksiIs] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentData, setCurrentData] = useState([]);

  // Mengatur scroll ketika modal terbuka
  useEffect(() => {
    document.body.style.overflow = showModal ? "hidden" : "auto";
  }, [showModal]);

  const fetchKriteria = async () => {
    setLoading(true);
    setError(null);
    try {
      const pageSizeKri = 10;
      const pageNumberKri = 1;
      const result = await useFetch(
        `${API_LINK}/MasterKriteriaSurvei/GetDataKriteriaSurvei`,
        {
          p1: "Aktif",
          p2: "",
          p3: "namaKri ASC",
          p4: pageSizeKri,
          p5: pageNumberKri,
        },
        "POST"
      );
      if (result === "ERROR" || !result || result.length === 0) {
        setKsrOptions([]);
      } else {
        setKsrOptions(
          result.map((item) => ({
            value: item.idKri,
            Text: item.namaKri,
          }))
        );
      }
    } catch (err) {
      setError("Gagal mengambil data kriteria: " + err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch opsi Skala Penilaian
  const fetchSkalaPenilaian = async () => {
    setLoading(true);
    setError(null);
    try {
      const skpResponse = await useFetch(
        `${API_LINK}/SkalaPenilaian/GetSkalaPenilaian`,
        {},
        "POST"
      );
      if (skpResponse && Array.isArray(skpResponse)) {
        setSkpOptions(
          skpResponse.map((item) => ({
            value: item.skp_id,
            Text: `${item.skp_skala} (${item.skp_deskripsi})`,
          }))
        );
      }
    } catch (error) {
      setError("Gagal mengambil data Skala Penilaian: " + error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchTemplateSurvei = async () => {
      try {
        const body = { idData: idData };
        console.log(body);
        setLoading(true);

        const result = await useFetch(
          `${API_LINK}/TemplateSurvei/GetTemplateSurveiById`,
          body,
          "POST"
        );
        console.log("API Response:", result[0]);

        if (result === "ERROR" || !result || result.length === 0) {
          SweetAlert("Error", "Data template tidak ditemukan", "error", "OK");
          navigate("/survei/template");
        } else {
          const data = result[0];
          setFormData({
            idData: idData,
            namaTemplate: data.namaTemplate,
            ksrId: data.ksrId,
            skpId: data.skpId,
            responden: data.responden ? data.responden.split(",") : [],
            pertanyaan: data.pertanyaan.split(",").map((id) => parseInt(id)),
          });
        }
      } catch (err) {
        setError("Gagal mengambil data template: " + err);
      } finally {
        setLoading(false);
        setIsInstrumenFetched(true); // Mark as fetched
      }
    };
    fetchTemplateSurvei();
  }, [idData]);
  // Fetch data template survei berdasarkan id (untuk mode edit)
  useEffect(() => {
    if (isInstrumenFetched && formData.pertanyaan.length > 0) {
      fetchPertanyaanDetail();
    }
  }, [isInstrumenFetched, formData.pertanyaan]);

  // Fetch detail pertanyaan berdasarkan ID dari template
  const fetchPertanyaanDetail = async () => {
    console.log("awallll CC");
    console.log(formData.pertanyaan);
    setLoading(true);
    try {
      const result = await useFetch(
        `${API_LINK}/MasterPertanyaan/GetDataPertanyaanById`,
        { param: formData.pertanyaan }
      );
      console.log("API ID CC", result);

      if (result === "ERROR" || !result || result.length === 0) {
        setPertanyaan([]);
      } else {
        console.log("Jalan Awal: ", Object.values(result));
        setPertanyaan(Object.values(result));
      }
    } catch (err) {
      setError("Gagal mengambil data pertanyaan: " + err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data master pertanyaan survei untuk modal
  const fetchPertanyaanBank = async () => {
    setIsLoading(true);
    try {
      const result = await useFetch(
        `${API_LINK}/MasterPertanyaan/GetDataBankPertanyaanSurvei`,
        {
          param1: searchKeyword,
          param2: selectedSort,
          param3: pageSize,
          param4: pageCurrent,
          param5: formData.pertanyaan,
          // Tambahkan parameter lain jika diperlukan (misal status atau kriteria)
        },
        "POST"
      );
      console.log({
        param1: searchKeyword,
        param2: selectedSort,
        param3: pageSize,
        param4: pageCurrent,
        param5: formData.pertanyaan,
        // Tambahkan parameter lain jika diperlukan (misal status atau kriteria)
      });
      if (result === "ERROR" || !result || result.length === 0) {
        setFilteredData([]);
        setTotalData(0);
      } else {
        const arrResult = Object.values(result);
        console.log("Jalan: ", arrResult);
        setFilteredData(arrResult);
        // Asumsikan totalData ada pada properti totalData di elemen pertama
        setTotalData(arrResult[0].totalData || 0);
      }
    } catch (error) {
      console.error("Error fetch data:", error);
      setIsError(true);
      setCurrentData([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Panggil fetch data untuk modal saat parameter berubah
  useEffect(() => {
    if (showModal) {
      fetchPertanyaanBank();
    }
  }, [searchKeyword, selectedSort, pageCurrent, showModal]);

  // // Panggil fetch opsi dan data template saat komponen mount
  useEffect(() => {
    fetchKriteria();
    console.log(fetchKriteria);
    fetchSkalaPenilaian();
  }, [idData]);

  // Panggil fetch detail pertanyaan setiap kali formData.pertanyaan berubah

  // Handler perubahan input form
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormData((prevData) => {
        const updatedResponden = prevData.responden || [];
        const newResponden = checked
          ? [...updatedResponden, value]
          : updatedResponden.filter((item) => item !== value);
        return { ...prevData, responden: newResponden };
      });
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  // Submit form edit template survei (update data utama)
  const handleSubmit = async () => {
    // Validasi nama template
    const isNamaTemplateValid = namaTemplateRef.current?.validate();
    if (!isNamaTemplateValid) {
      SweetAlert("Error", "Harap lengkapi nama template.", "error", "OK");
      namaTemplateRef.current?.focus();
      return;
    }
    // Validasi responden (minimal satu pilihan)
    if (formData.responden.length === 0) {
      SweetAlert(
        "Error",
        "Harap pilih setidaknya satu responden.",
        "error",
        "OK"
      );
      respondenRef.current?.focus();
      return;
    }
    try {
      const payload = {
        p1: idData,
        p2: formData.namaTemplate,
        p3: formData.responden || [],
        p4: formData.pertanyaan,
      };
      console.log("Payload:", payload);
      const response = await useFetch(
        `${API_LINK}/TemplateSurvei/UpdateTemplateSurvei`,
        payload,
        "POST"
      );
      if (response === "ERROR")
        throw new Error("Gagal mengupdate template survei.");
      SweetAlert(
        "Berhasil!",
        "Template survei berhasil diperbarui.",
        "success",
        "OK"
      ).then(() => navigate("/survei/template"));
    } catch (err) {
      console.error("Error submitting template survei:", err);
      SweetAlert("Gagal!", err.message, "error", "OK");
    }
  };

  // Menambahkan pertanyaan yang dipilih (multi select) ke template survei
  const handleSubmitPertanyaan = async () => {
    if (tambahPertanyaan.length === 0) {
      return SweetAlert("Informasi", "Pilih satu pertanyaan", "info", "OK");
    }
    try {
      const payload = {
        idTemplate: idData,
        pertanyaan: tambahPertanyaan, // hanya berisi satu ID
      };
      console.log("jalan - jalaaaaan nih");
      console.log(tambahPertanyaan);
      const response = await useFetch(
        `${API_LINK}/TemplateSurvei/AddPertanyaanToTemplate`,
        payload,
        "POST"
      );
      if (response === "ERROR")
        throw new Error("Gagal menambah pertanyaan ke template survei.");
      SweetAlert(
        "Berhasil!",
        "Pertanyaan berhasil ditambahkan.",
        "success",
        "OK"
      ).then(() => {
        // Update formData.pertanyaan dengan menambahkan ID-pertanyaan baru
        setFormData((prevData) => ({
          ...prevData,
          pertanyaan: [...prevData.pertanyaan, ...tambahPertanyaan],
        }));
        // Reset pilihan di modal dan tutup modal
        setTambahPertanyaan([]);
        handleCloseModal();
      });
    } catch (err) {
      console.error("Error adding pertanyaan:", err);
      SweetAlert("Gagal!", err.message, "error", "OK");
    }
  };

  const handleChoosePertanyaan = async (pertanyaanBaru) => {
    const isDuplicate = pertanyaan.some(
      (item) => item.idBank === pertanyaanBaru
    );

    if (isDuplicate) {
      SweetAlert(
        "Perhatian!",
        "Pertanyaan yang dipilih sudah terdapat pada daftar. Silakan pilih pertanyaan yang lain.",
        "info",
        "OK"
      );
      return;
    }

    try {
      // Kirim permintaan ke backend menggunakan useFetch
      const createResponse = await useFetch(
        `${API_LINK}/MasterInstrumenAudit/EditDataInstrumenAuditPertanyaan`,
        { idEdit: idEdit, pertanyaanBaru: pertanyaanBaru }
      );

      // Tangani hasil dari useFetch
      if (createResponse === "ERROR") {
        throw new Error("Gagal menambah data");
      }

      SweetAlert(
        "Berhasil!",
        "Data berhasil diperbarui.",
        "success",
        "OK"
      ).then(() => {
        handleCloseModal(idData);
        window.location.reload();
      });
    } catch (error) {
      console.error("Error:", error.message); // Log kesalahan
      SweetAlert("Gagal!", error.message, "error", "OK"); // Tampilkan kesalahan kepada pengguna
    }
  };

  // Menghapus pertanyaan dari template survei
  const handleDeletePertanyaan = async (idPertanyaan) => {
    const confirm = await SweetAlert(
      "Konfirmasi",
      "Apakah Anda yakin ingin menghapus pertanyaan ini?",
      "warning",
      "Ya, Hapus",
      null,
      "",
      true
    );
    if (confirm) {
      try {
        const payload = { idTemplate: idData, idPertanyaan };
        const response = await useFetch(
          `${API_LINK}/TemplateSurvei/DeletePertanyaanFromTemplate`,
          payload,
          "POST"
        );
        if (response === "ERROR") throw new Error("Gagal menghapus pertanyaan");
        SweetAlert("Berhasil", "Pertanyaan berhasil dihapus", "success", "OK");
        // Update state formData dan detail pertanyaan
        setFormData((prevData) => ({
          ...prevData,
          pertanyaan: prevData.pertanyaan.filter(
            (item) => item !== idPertanyaan
          ),
        }));
        setPertanyaan((prevData) =>
          prevData.filter((item) => item.id !== idPertanyaan)
        );
      } catch (err) {
        console.error(err);
        SweetAlert(
          "Gagal",
          "Terjadi kesalahan saat menghapus pertanyaan",
          "error",
          "OK"
        );
      }
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <main className="flex-grow-1 p-3" style={{ marginTop: "80px" }}>
        <div className="d-flex flex-column">
          {/* Breadcrumbs dan Page Title */}
          <div className="p-3">
            <PageTitleNav
              title="Detail Template Survei"
              breadcrumbs={[
                { label: "Template Survei", href: "/survei/template" },
                { label: "Detail Template Survei" },
              ]}
              onClick={() => onChangePage("index")}
            />
          </div>
          <div className={isMobile ? "m-0" : "m-3"}>
            <div
              className={
                isMobile
                  ? "shadow p-4 m-2 mt-0 bg-white rounded"
                  : "shadow p-5 m-5 mt-0 bg-white rounded"
              }
            >
              <HeaderForm label="Formulir Template Survei" />
              <DetailData label="Nama Template" isi={formData.namaTemplate} />
              {/* Opsi responden */}
              <div className="mb-3">
                <CheckBox
                  ref={respondenRef}
                  arrData={[
                    {
                      Value: "Dosen dan Instruktur",
                      Text: "Dosen dan Instruktur",
                    },
                    { Value: "Tenaga Pendidik", Text: "Tenaga Pendidik" },
                    { Value: "Mitra Kerjasama", Text: "Mitra Kerjasama" },
                  ]}
                  label="Responden"
                  name="responden"
                  isRequired={true}
                  errorMessage="Harap pilih setidaknya satu responden."
                  values={formData.responden || []}
                  onChange={undefined}
                  col="col-4"
                />
              </div>
              <div className="d-flex justify-content-between align-items-center mt-4">
                {/* <div className="flex-grow-1 m-2">
                  <Button
                    classType="danger"
                    type="button"
                    label="Batal"
                    width="100%"
                    onClick={() => navigate("/survei/template")}
                  />
                </div> */}
              </div>
              {/* Menampilkan pertanyaan yang sudah ditambahkan */}
              <div className="border bg-white rounded mt-5">
                <div
                  className="ps-3"
                  style={{
                    backgroundColor: "#F3EFEF",
                    padding: "0.1rem",
                    borderColor: "gray",
                  }}
                >
                  <HeaderText
                    label="Daftar Pertanyaan"
                    warna="#2654A1"
                    ukuran="1.5rem"
                    alignText="left"
                    fontWeight="600"
                    marginBottom="20px"
                  />
                </div>
                <div className="p-3">
                  <Table
                    arrHeader={[
                      "No",
                      "Kriteria",
                      "Pertanyaan",
                      "Tipe",
                      "Skala",
                    ]}
                    data={pertanyaan.map((item, index) => ({
                      Key: item.id,
                      idPer: item.idBank, // pastikan property id sesuai data
                      No: index + 1,
                      Kriteria: item.namaKri || console.log(item.ksr_nama),
                      Pertanyaan: (
                        <div
                          dangerouslySetInnerHTML={{
                            __html: decodeHtml(item.pertanyaan || ""),
                          }}
                        />
                      ),
                      Tipe: item.tipeSka,
                      Skala: item.skala,
                    }))}
                    aksiIs={false}
                  />
                </div>
                {/* {pertanyaan.length === 0 ? (
                    <p>Belum ada pertanyaan yang ditambahkan.</p>
                  ) : ( */}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

