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
import { useFetch } from "../../../util/useFetch";
import { id } from "date-fns/locale";

const title = "Pertanyaan Survei";
const breadcrumbs = [{ label: "Pertanyaan Survei" }];

export default function Pertanyaan_Survei({ onChangePage }) {
  // Konfigurasi paging dan state data
  const [pageSize] = useState(10);
  const [pageCurrent, setPageCurrent] = useState(1);
  const [currentData, setCurrentData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  // State untuk pencarian dan filter (client-side)
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState(""); // "" berarti semua status
  const [filterSort, setFilterSort] = useState("[pty_pertanyaan] DESC"); // default sorting
  const [filteredData, setFilteredData] = useState([]);

  const importModalRef = useRef(null);
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // Hitung indeks data untuk paging
  const indexOfLastData = pageCurrent * pageSize;
  const indexOfFirstData = indexOfLastData - pageSize;
  // Jika ada pencarian atau filter, gunakan filteredData; jika tidak, gunakan currentData
  const dataToDisplay =
    searchQuery || filterStatus || filterSort ? filteredData : currentData;
  const currentDataPage = dataToDisplay.slice(
    indexOfFirstData,
    indexOfLastData
  );

  // Fungsi untuk mengambil data dari API (SP akan mengembalikan data terurut berdasarkan pty_created_date DESC)
  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Panggil API tanpa parameter (SP mengembalikan data sesuai urutan yang ada)
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

  // Panggil fetchData saat komponen dimount
  useEffect(() => {
    fetchData();
  }, []);

  // Lakukan filter client-side berdasarkan searchQuery, filterStatus, dan filterSort
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
  }, [searchQuery, filterStatus, filterSort, currentData]);

  // Jika data berubah dan halaman saat ini melebihi total halaman, reset ke halaman pertama
  useEffect(() => {
    const totalPages = Math.ceil(dataToDisplay.length / pageSize);
    if (pageCurrent > totalPages) {
      setPageCurrent(1);
    }
  }, [dataToDisplay, pageCurrent, pageSize]);

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
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data Pertanyaan");
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

  // Handler untuk SearchField (pastikan komponen mengembalikan nilai string)
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

  // Fungsi toggle status pertanyaan (misalnya untuk mengubah status aktif/tidak aktif)
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
                        Text: "Pertanyaan [↑]",
                      },
                      {
                        Value: "[pty_created_date] DESC",
                        Text: "Pertanyaan [↓]",
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
                    defaultValue="Aktif"
                    onChange={handleStatusFilterChange}
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
                  onEdit={(item) =>
                    onChangePage("edit", { id: item.Key })
                  }
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
