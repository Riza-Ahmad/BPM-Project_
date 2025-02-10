import React, { useState, useRef, useEffect } from "react";
import Table from "../../../part/Table";
import Paging from "../../../part/Paging";
import PageTitleNav from "../../../part/PageTitleNav";
import Button from "../../../part/Button";
import Dropdown from "../../../part/Dropdown";
import Modal from "../../../part/Modal";
import Filter from "../../../part/Filter";
import SearchField from "../../../part/SearchField";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "../../../util/useIsMobile";
import { API_LINK, TEMPLATE_LINK } from "../../../util/Constants";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useFetch } from "../../../util/useFetch";

const title = "Bank Pertanyaan Survei";
const breadcrumbs = [{ label: "Bank Pertanyaan Survei" }];

export default function Pertanyaan_Survei({ onChangePage }) {
  // Konfigurasi paging dan state data
  const [pageSize] = useState(10);
  const [pageCurrent, setPageCurrent] = useState(1);
  const [currentData, setCurrentData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  // State untuk pencarian dan filter (client-side)
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState(""); // "" berarti semua status
  const [filterSort, setFilterSort] = useState("[pty_pertanyaan] DESC"); // default sorting
  const [filterKriteria, setFilterKriteria] = useState(""); // Filter untuk Kriteria Survei, "" berarti semua
  const [filterSkala, setFilterSkala] = useState(""); // Filter untuk Skala Penilaian, "" berarti semua
  const [filteredData, setFilteredData] = useState([]);

  // State untuk opsi dropdown yang diambil dari API
  const [ksrOptions, setKsrOptions] = useState([]);
  const [skpOptions, setSkpOptions] = useState([]);
  const [loadingFilter, setLoadingFilter] = useState(false);
  const [errorFilter, setErrorFilter] = useState(null);

  const importModalRef = useRef(null);
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // Hitung indeks data untuk paging
  const indexOfLastData = pageCurrent * pageSize;
  const indexOfFirstData = indexOfLastData - pageSize;
  // Jika ada pencarian atau filter, gunakan filteredData; jika tidak, gunakan currentData
  const dataToDisplay =
    searchQuery || filterStatus || filterSort || filterKriteria || filterSkala
      ? filteredData
      : currentData;
  const currentDataPage = dataToDisplay.slice(
    indexOfFirstData,
    indexOfLastData
  );

  // Fungsi untuk mengambil data pertanyaan dari API
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const dataJson = await useFetch(
        `${API_LINK}/MasterPertanyaan/GetDataPertanyaan`,
        {},
        "POST"
      );
      console.log("Data Terambil:", dataJson);
      if (dataJson === "ERROR") {
        setIsError(true);
        setCurrentData([]);
      } else {
        setCurrentData(dataJson || []);
        setIsError(false);
      }
    } catch (error) {
      console.error("Error fetch data:", error);
      setIsError(true);
      setCurrentData([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Ambil data opsi Kriteria Survei dari API
  useEffect(() => {
    const fetchKriteria = async () => {
      setLoading(true);
      try {
        const data = await useFetch(
          `${API_LINK}/MasterPertanyaan/GetAllKriteriaSurveiAktif`,
          {},
          "POST"
        );
        if (data && Array.isArray(data)) {
          // Mapping data agar sesuai dengan format Dropdown { Value, Text }
          const mappedOptions = data.map((item) => ({
            Value: item.ksr_id,
            Text: item.ksr_nama,
          }));
          setKsrOptions(mappedOptions);
        }
      } catch (err) {
        setErrorFilter("Gagal mengambil data: " + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchKriteria();
  }, []);

  // Ambil data opsi Skala Penilaian dari API
  useEffect(() => {
    const fetchSkalaPenilaian = async () => {
      setLoadingFilter(true);
      setErrorFilter(null);
      try {
        const skpResponse = await useFetch(
          `${API_LINK}/SkalaPenilaian/GetSkalaPenilaian`,
          {},
          "POST"
        );
        if (skpResponse && Array.isArray(skpResponse)) {
          const filteredSkp = skpResponse.filter(
            (item) => item.skp_status === "Aktif"
          );
          const mappedSkp = filteredSkp.map((item) => ({
            Value: item.skp_id,
            Text: item.skp_tipe,
          }));
          setSkpOptions(mappedSkp);
        }
      } catch (error) {
        setErrorFilter(
          "Gagal mengambil data Skala Penilaian: " + error.message
        );
      } finally {
        setLoadingFilter(false);
      }
    };
    fetchSkalaPenilaian();
  }, []);

  // Panggil fetchData saat komponen dimount
  useEffect(() => {
    fetchData();
  }, []);

  // Lakukan filter client-side berdasarkan searchQuery, filterStatus, filterSort, filterKriteria, dan filterSkala
  useEffect(() => {
    let data = [...currentData];
    // Filter berdasarkan pencarian di field pty_pertanyaan
    if (searchQuery) {
      const searchRegex = new RegExp(searchQuery, "i");
      data = data.filter(
        (item) => item.pty_pertanyaan && searchRegex.test(item.pty_pertanyaan)
      );
    }
    // Filter berdasarkan status jika dipilih (misalnya "Aktif" atau "Tidak Aktif")
    if (filterStatus) {
      data = data.filter((item) => item.pty_status === filterStatus);
    }
    // Filter berdasarkan Kriteria Survei jika dipilih
    if (filterKriteria) {
      data = data.filter((item) => item.ksr_nama === filterKriteria);
    }
    // Filter berdasarkan Skala Penilaian jika dipilih
    if (filterSkala) {
      data = data.filter((item) => item.skp_id === filterSkala);
    }
    // Urutkan data berdasarkan filterSort
    if (filterSort === "[pty_created_date] ASC") {
      data.sort(
        (a, b) => new Date(a.pty_created_date) - new Date(b.pty_created_date)
      );
    } else if (filterSort === "[pty_created_date] DESC") {
      data.sort(
        (a, b) => new Date(b.pty_created_date) - new Date(a.pty_created_date)
      );
    }
    setFilteredData(data);
    setPageCurrent(1); // Reset ke halaman pertama ketika filter berubah
  }, [
    searchQuery,
    filterStatus,
    filterSort,
    filterKriteria,
    filterSkala,
    currentData,
  ]);

  // Jika data berubah dan halaman saat ini melebihi total halaman, reset ke halaman pertama
  useEffect(() => {
    const totalPages = Math.ceil(dataToDisplay.length / pageSize);
    if (pageCurrent > totalPages) {
      setPageCurrent(1);
    }
  }, [dataToDisplay, pageCurrent, pageSize]);

  // Fungsi export ke Excel
  // Fungsi export ke Excel
  const handleExportQuestions = () => {
    const dataToExport = dataToDisplay;
    if (dataToExport.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Data Kosong",
        text: "Tidak ada data untuk diekspor.",
      });
      return;
    }

    // Buat salinan data dan urutkan berdasarkan ID Pertanyaan (ascending)
    const sortedDataQuestions = [...dataToExport].sort(
      (a, b) => Number(a.pty_id) - Number(b.pty_id)
    );

    // ==========================
    // 1. Sheet Data Pertanyaan
    // ==========================
    const headersQuestions = [
      [
        "ID Pertanyaan",
        "Pertanyaan",
        "ID Kriteria Survei",
        "ID Skala Penilaian",
        "Status",
        "Dibuat Oleh",
        "Tanggal Dibuat",
        "Dimodifikasi Oleh",
        "Tanggal Dimodifikasi",
      ],
    ];

    const dataQuestions = sortedDataQuestions.map((item) => [
      item.pty_id,
      item.pty_pertanyaan,
      item.krs_id,
      item.skp_id,
      item.pty_status,
      item.pty_created_by,
      item.pty_created_date,
      item.pty_modif_by,
      item.pty_modif_date,
    ]);

    const worksheetQuestions = XLSX.utils.aoa_to_sheet(headersQuestions);
    XLSX.utils.sheet_add_aoa(worksheetQuestions, dataQuestions, {
      origin: "A2",
    });

    // ==========================
    // 2. Sheet Data Kriteria Survei
    // ==========================
    const headersKriteria = [["ID Kriteria", "Nama Kriteria"]];
    // Gunakan Map untuk mendapatkan pasangan unik ID Kriteria dan Nama Kriteria
    const uniqueKriteriaMap = new Map(
      dataToExport.map((item) => [item.krs_id, item.krs_nama])
    );
    // Ubah ke array dan urutkan berdasarkan ID Kriteria (ascending)
    const uniqueKriteria = Array.from(uniqueKriteriaMap.entries()).sort(
      (a, b) => Number(a[0]) - Number(b[0])
    );
    const dataKriteria = uniqueKriteria.map(([id, nama]) => [id, nama]);

    const worksheetKriteria = XLSX.utils.aoa_to_sheet(headersKriteria);
    XLSX.utils.sheet_add_aoa(worksheetKriteria, dataKriteria, { origin: "A2" });

    // ==========================
    // 3. Sheet Data Skala Penilaian
    // ==========================
    const headersSkala = [["ID Skala", "Tipe Skala", "Deskripsi"]];
    // Gunakan Map untuk mendapatkan pasangan unik ID Skala dan objek {tipe, deskripsi}
    const uniqueSkalaMap = new Map(
      dataToExport.map((item) => [
        item.skp_id,
        { tipe: item.skp_tipe, deskripsi: item.skp_deskripsi },
      ])
    );
    // Ubah ke array dan urutkan berdasarkan ID Skala (ascending)
    const uniqueSkala = Array.from(uniqueSkalaMap.entries()).sort(
      (a, b) => Number(a[0]) - Number(b[0])
    );
    const dataSkala = uniqueSkala.map(([id, obj]) => [
      id,
      obj.tipe,
      obj.deskripsi,
    ]);

    const worksheetSkala = XLSX.utils.aoa_to_sheet(headersSkala);
    XLSX.utils.sheet_add_aoa(worksheetSkala, dataSkala, { origin: "A2" });

    // ==========================
    // Styling untuk Semua Sheet
    // ==========================
    const applyStyles = (worksheet, headers, data) => {
      const range = XLSX.utils.decode_range(worksheet["!ref"]);

      // Styling Header (Bold & Center)
      for (let C = range.s.c; C <= range.e.c; C++) {
        const cellAddress = XLSX.utils.encode_cell({ r: 0, c: C });
        if (worksheet[cellAddress]) {
          worksheet[cellAddress].s = {
            font: { bold: true },
            alignment: { horizontal: "center", vertical: "center" },
            border: {
              top: { style: "thin" },
              bottom: { style: "thin" },
              left: { style: "thin" },
              right: { style: "thin" },
            },
          };
        }
      }

      // Styling Data (Border)
      for (let R = range.s.r + 1; R <= range.e.r; R++) {
        for (let C = range.s.c; C <= range.e.c; C++) {
          const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
          if (worksheet[cellAddress]) {
            worksheet[cellAddress].s = {
              border: {
                top: { style: "thin" },
                bottom: { style: "thin" },
                left: { style: "thin" },
                right: { style: "thin" },
              },
            };
          }
        }
      }

      // Auto Fit Column Width
      const autoFitColumns = (ws, headers, data) => {
        const colWidths = headers[0].map((header, index) => ({
          wch:
            Math.max(
              header.length,
              ...data.map((row) =>
                row[index] ? row[index].toString().length : 0
              )
            ) + 2,
        }));
        ws["!cols"] = colWidths;
      };

      autoFitColumns(worksheet, headers, data);
    };

    applyStyles(worksheetQuestions, headersQuestions, dataQuestions);
    applyStyles(worksheetKriteria, headersKriteria, dataKriteria);
    applyStyles(worksheetSkala, headersSkala, dataSkala);

    // ==========================
    // Membuat Workbook & Menyimpan File
    // ==========================
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      workbook,
      worksheetQuestions,
      "Data Pertanyaan"
    );
    XLSX.utils.book_append_sheet(
      workbook,
      worksheetKriteria,
      "Data Kriteria Survei"
    );
    XLSX.utils.book_append_sheet(
      workbook,
      worksheetSkala,
      "Data Skala Penilaian"
    );

    XLSX.writeFile(workbook, "Pertanyaan_Eksport.xlsx");
  };

  // Variabel global untuk parsedData (data impor)
  let parsedData = [];

  // Fungsi import pertanyaan dari file Excel
  const handleImportQuestions = async () => {
    if (!parsedData || parsedData.length === 0) {
      Swal.fire(
        "Perhatian",
        "Tidak ada data yang valid untuk diimpor.",
        "warning"
      );
      return;
    }
    try {
      for (let index = 0; index < parsedData.length; index++) {
        try {
          const createResponse = await useFetch(
            `${API_LINK}/MasterPertanyaan/CreatePertanyaan`,
            parsedData[index],
            "POST"
          );
          console.log("response", createResponse);
          if (createResponse === "ERROR") {
            throw new Error(`Gagal menambah data pada indeks ${index}`);
          } else {
            console.log(`Data pada indeks ${index} berhasil ditambahkan.`);
          }
        } catch (error) {
          console.error("Error pada indeks", index, ":", error.message);
          Swal.fire(
            "Gagal!",
            `Error pada data ke-${index + 1}: ${error.message}`,
            "error",
            "OK"
          );
          break; // Hentikan proses jika ada error
        }
      }
      // Refresh data setelah impor
      await fetchData();
      Swal.fire("Sukses", "Pertanyaan berhasil diimpor!", "success");
      importModalRef.current.close();
    } catch (error) {
      console.error("Error:", error.message);
      Swal.fire(
        "Gagal",
        "Terjadi kesalahan saat mengimpor pertanyaan.",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Fungsi membaca file Excel dan parsing data
  const handleFileChange = (file) => {
    if (!file) {
      console.error("File tidak ditemukan");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const dataBuffer = new Uint8Array(e.target.result);
        const workbook = XLSX.read(dataBuffer, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        if (!worksheet) {
          console.error("Sheet tidak ditemukan dalam file Excel.");
          return;
        }
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        if (!jsonData || jsonData.length <= 1) {
          console.error("Data di dalam sheet kosong atau tidak valid.");
          return;
        }
        console.log("Data JSON mentah:", jsonData);
        parsedData = jsonData
          .map((row, index) => {
            if (index > 0 && row[0]) {
              return {
                pertanyaan: row[0] || "",
                kriteria: row[1] || "",
                skala: row[2] || "",
                // Ubah isActive menjadi status string ("Aktif" atau "Tidak Aktif")
                pty_status: row[3] === "Aktif" ? "Aktif" : "Tidak Aktif",
              };
            }
          })
          .filter(Boolean);
        console.log("Parsed Data:", parsedData);
      } catch (error) {
        console.error("Error saat membaca file Excel:", error.message);
      }
    };
    reader.onerror = (error) => {
      console.error("Error membaca file:", error.message);
    };
    reader.readAsArrayBuffer(file);
  };

  // Fungsi navigasi paging
  const handlePageNavigation = (page) => {
    const totalPage = Math.ceil(dataToDisplay.length / pageSize);
    setPageCurrent(page > totalPage ? totalPage : page);
  };

  // Handler untuk SearchField
  const handleSearchChange = (value) => {
    setSearchQuery(value);
  };

  // Handler untuk filter status
  const handleStatusFilterChange = (e) => {
    setFilterStatus(e.target.value);
  };

  // Handler untuk filter sort (Pertanyaan ASC/DESC)
  const handleSortFilterChange = (e) => {
    setFilterSort(e.target.value);
  };

  // Handler untuk filter Kriteria Survei
  const handleKriteriaFilterChange = (e) => {
    setFilterKriteria(e.target.value);
  };

  // Handler untuk filter Skala Penilaian
  const handleSkalaFilterChange = (e) => {
    setFilterSkala(e.target.value);
  };

  // Fungsi toggle status pertanyaan
  const handleToggle = async (id) => {
    const parameters = { p1: id, p2: "Admin" };
    const confirm = await Swal.fire({
      title: "Konfirmasi",
      text: "Apakah Anda yakin ingin menonaktifkan pertanyaan ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya",
      cancelButtonText: "Batal",
    });
    if (confirm.isConfirmed) {
      try {
        const response = await fetch(
          `${API_LINK}/MasterPertanyaan/DeletePertanyaan`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(parameters),
          }
        );
        if (!response.ok) throw new Error("Gagal menonaktifkan pertanyaan.");
        Swal.fire("Berhasil", "Pertanyaan berhasil di-nonaktifkan.", "success");
        // Refresh data setelah toggle
        fetchData();
      } catch (err) {
        console.error("Error:", err);
        Swal.fire("Gagal", "Terjadi kesalahan menonaktifkan status.", "error");
      }
    } else {
      Swal.fire("Batal", "Menonaktifkan dibatalkan.", "info");
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <main className="flex-grow-1 p-3" style={{ marginTop: "80px" }}>
        <div className="d-flex flex-column">
          <div className={isMobile ? "m-0 p-0" : "m-3 mb-0"}>
            <PageTitleNav
              title={title}
              breadcrumbs={breadcrumbs}
              onClick={() => navigate("/beranda")}
            />
          </div>
          <div
            className="p-3 mt-2 mb-0"
            style={{ marginLeft: isMobile ? "1rem" : "3rem" }}
          >
            <div className="row" style={{ gap: "1rem", marginLeft: "5px" }}>
              <Button
                iconName="add"
                classType="primary"
                label="Tambah Pertanyaan"
                onClick={() => onChangePage("add")}
              />
              <Button
                iconName="file-upload"
                classType="success"
                label="Import Pertanyaan"
                onClick={() => importModalRef.current.open()}
              />
              <Button
                iconName="file-download"
                classType="success"
                label="Export Pertanyaan"
                onClick={handleExportQuestions}
              />
            </div>
            <div className="row mt-5">
              <div className="col-lg-10 col-md-6">
                <SearchField
                  id="search"
                  placeHolder="Cari Pertanyaan..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  isDisabled={false}
                />
              </div>
              <div className="col-lg-1 col-md-6">
                <Filter>
                  <Dropdown
                    label="Urut Berdasarkan"
                    type="pilih"
                    arrData={[
                      {
                        Value: "[pty_created_date] ASC",
                        Text: "Waktu Dibuat [↑]",
                      },
                      {
                        Value: "[pty_created_date] DESC",
                        Text: "Waktu Dibuat [↓]",
                      },
                    ]}
                    defaultValue="[pty_created_date] DESC"
                    onChange={handleSortFilterChange}
                  />
                  <Dropdown
                    label="Status"
                    type="pilih"
                    arrData={[
                      { Value: "", Text: "Semua" },
                      { Value: "Aktif", Text: "Aktif" },
                      { Value: "Tidak Aktif", Text: "Tidak Aktif" },
                    ]}
                    defaultValue=""
                    onChange={handleStatusFilterChange}
                  />
                  <Dropdown
                    label="Kriteria Survei"
                    type="pilih"
                    arrData={[{ Value: "", Text: "Semua" }, ...ksrOptions]}
                    defaultValue=""
                    onChange={handleKriteriaFilterChange}
                  />
                  <Dropdown
                    label="Skala Penilaian"
                    type="pilih"
                    arrData={[{ Value: "", Text: "Semua" }, ...skpOptions]}
                    defaultValue=""
                    onChange={handleSkalaFilterChange}
                  />
                </Filter>
              </div>
            </div>
          </div>
          <div
            className="table-container bg-white p-3 mt-0 rounded"
            style={{ margin: isMobile ? "1rem" : "3rem" }}
          >
            {isLoading ? (
              <p>Loading...</p>
            ) : isError ? (
              <p className="text-danger text-center mt-4">
                Terjadi kesalahan saat mengambil data.
              </p>
            ) : (
              <>
                <Table
                  arrHeader={[
                    "No",
                    "Pertanyaan",
                    "Kriteria Survei",
                    "Skala Penilaian",
                  ]}
                  data={currentDataPage.map((item, index) => ({
                    ...item,
                    Key: item.pty_id ?? "Tidak Ada",
                    No: indexOfFirstData + index + 1,
                    Pertanyaan: item.pty_pertanyaan ?? "Tidak Ada",
                    "Kriteria Survei": item.ksr_nama ?? "Tidak Ada",
                    "Skala Penilaian": item.skp_id ?? "Tidak Ada",
                    Status: item.pty_status === "Aktif",
                  }))}
                  actions={(row) =>
                    row.Status
                      ? ["Detail", "Edit", "Toggle"]
                      : ["Detail", "Edit", "Toggle"]
                  }
                  onDetail={(item) =>
                    onChangePage("detail", { detailId: item.Key })
                  }
                  onEdit={(item) => onChangePage("edit", { id: item.Key })}
                  onToggle={(item) => handleToggle(item.Key)}
                />
                <Paging
                  pageSize={pageSize}
                  pageCurrent={pageCurrent}
                  totalData={dataToDisplay.length}
                  navigation={handlePageNavigation}
                />
              </>
            )}
          </div>
        </div>
      </main>

      {/* IMPORT MODAL */}
      <Modal
        ref={importModalRef}
        title="Import Pertanyaan"
        size="medium"
        Button1={
          <Button
            classType="primary"
            label="Simpan"
            type="submit"
            style={{
              width: "200px",
              height: "40px",
              fontSize: "15px",
              margin: "10px 0",
            }}
            onClick={handleImportQuestions}
          />
        }
        Button2={
          <Button
            classType="danger"
            label="Batal"
            style={{
              width: "200px",
              height: "40px",
              fontSize: "15px",
              margin: "10px 0",
            }}
            onClick={() => importModalRef.current.close()}
          />
        }
      >
        <div
          className="form-group"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            width: "100%",
          }}
        >
          <label>
            Silahkan unduh format template pertanyaan terlebih dahulu, <br />
            <a
              style={{ color: "blue", textDecoration: "underline" }}
              onClick={(e) => {
                e.preventDefault();
                const templateDokumen = "Template_Survei.xlsx";
                const url = TEMPLATE_LINK + templateDokumen;
                fetch(url, { method: "GET" })
                  .then((response) => {
                    if (response.ok) {
                      window.open(url, "_blank");
                    } else {
                      alert("Gagal mengunduh file.");
                    }
                  })
                  .catch((error) => {
                    console.error("Error:", error);
                    alert("Terjadi kesalahan saat mengakses file.");
                  });
              }}
            >
              Klik disini
            </a>
          </label>
          <label>
            <strong>
              Berkas Pertanyaan <span style={{ color: "red" }}>*</span>
            </strong>
          </label>
          <input
            type="file"
            onChange={(e) => handleFileChange(e.target.files[0])}
            style={{
              width: "100%",
              padding: "10px",
              border: "2px solid",
              borderRadius: "10px",
              marginTop: "5px",
            }}
            name="import-file"
            className="form-control"
          />
        </div>
      </Modal>
    </div>
  );
}
