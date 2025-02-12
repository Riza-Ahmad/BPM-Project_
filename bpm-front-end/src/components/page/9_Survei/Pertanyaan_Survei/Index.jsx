import React, { useState, useRef, useEffect } from "react";
import Table from "../../../part/Table";
import Paging from "../../../part/Paging";
import PageTitleNav from "../../../part/PageTitleNav";
import Button from "../../../part/Button";
import TextField from "../../../part/TextField";
import DropDown from "../../../part/Dropdown";
import Modal from "../../../part/Modal";
import Filter from "../../../part/Filter";
import SearchField from "../../../part/SearchField";
import Swal from "sweetalert2";
import { Await, useNavigate } from "react-router-dom";
import { useIsMobile } from "../../../util/useIsMobile";
import { API_LINK, TEMPLATE_LINK } from "../../../util/Constants";
import * as XLSX from "xlsx";
import { useFetch } from "../../../util/useFetch";
import Dropdown from "../../../part/Dropdown";

const title = "Pertanyaan Survei";
const breadcrumbs = [{ label: " Daftar Pertanyaan" }];

const inisialisasiData = [
  {
    Key: null,
    Pertanyaan: null,
    Header: null,
    "Pertanyaan Umum": null,
    Status: null,
    Aksi: null,
    Count: 0,
  },
];

const dataFilterSort = [
  { Value: "[Pertanyaan] ASC", Text: "Pertanyaan [↑]" },
  { Value: "[Pertanyaan] DESC", Text: "Pertanyaan [↓]" },
];

const dataFilterStatus = [
  { Value: "1", Text: "Aktif" },
  { Value: "0", Text: "Tidak Aktif" },
];

let parsedData = [];

export default function Pertanyaan_Survei({ onChangePage }) {
  const [pageSize] = useState(10);
  const [pageCurrent, setPageCurrent] = useState(1);
  const [currentData, setCurrentData] = useState(inisialisasiData);
  const [formData, setFormData] = useState({ questionText: "" });
  const importModalRef = useRef("");
  const [file, setFile] = useState("");
  const [data, setData] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const searchFilterSort = useRef(null);
  const searchFilterStatus = useRef(null);

  const [currentFilter, setCurrentFilter] = useState({
    p1: 1,
    p2: searchQuery,
    p3: "[Pertanyaan] ASC",
    p4: 1,
  });

  const [pertanyaan, setPertanyaan] = useState("");
  const [jenisPertanyaan, setJenisPertanyaan] = useState("");
  const [loading, setLoading] = useState(false);
  const saveToLocalStorage = (data) => {
    localStorage.setItem("questions", JSON.stringify(data));
  };
  const addModalRef = useRef();
  const updateModalRef = useRef();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [questions, setQuestions] = useState([]);
  const [questionText, setQuestionText] = useState("");
  const [isHeader, setIsHeader] = useState(false);
  const [generalQuestion, setGeneralQuestion] = useState("Ya");
  const [surveyCriteria, setSurveyCriteria] = useState("");
  const [respondent, setRespondent] = useState("");
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [filterStatus, setFilterStatus] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  const fetchData = async () => {
    try {
      const data = await fetch(
        `${API_LINK}/MasterPertanyaan/GetDataPertanyaan`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(currentFilter),
        }
      );
      const dataJson = await data.json();
      if (dataJson) {
        setCurrentData(dataJson);
      } else {
        setCurrentData(inisialisasiData);
      }
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setCurrentFilter((prevFilter) => ({
      ...prevFilter,
      p2: searchQuery,
    }));
  }, [searchQuery]);

  useEffect(() => {
    fetchData();
  }, [currentFilter]);

  useEffect(() => {
    const searchRegex = new RegExp(searchQuery, "i");

    const filtered = currentData.filter((item) => {
      const matchesSearch =
        searchRegex.test(item.Pertanyaan) ||
        searchRegex.test(item.Header) ||
        searchRegex.test(item["Pertanyaan Umum"]);

      const matchesStatus =
        filterStatus === "" ? true : item.Status.toString() === filterStatus;

      const matchesYear =
        filterYear === ""
          ? true
          : new Date(item.CreatedDate).getFullYear().toString() === filterYear;

      return matchesSearch && matchesStatus && matchesYear;
    });

    setFilteredData(filtered);
  }, [searchQuery, filterStatus, filterYear, currentData]);

  const handleExportQuestions = () => {
    const dataToExport = filteredData.length > 0 ? filteredData : currentData; // Gunakan filteredData jika ada, jika tidak gunakan currentData

    if (dataToExport.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Data Kosong",
        text: "Tidak ada data untuk diekspor.",
      });
      return;
    }

    // Konversi data yang sudah difilter atau data keseluruhan menjadi format untuk Excel
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);

    // Buat workbook dan tambahkan worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data Pertanyaan");

    // Generate file Excel dan trigger download
    XLSX.writeFile(workbook, "questions_export.xlsx");
  };

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

      // Jika semua berhasil, lakukan refresh data
      const updatedDataResponse = await fetch(
        `${API_LINK}/MasterPertanyaan/GetDataPertanyaan`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(currentFilter), // Filter data jika diperlukan
        }
      );

      if (updatedDataResponse.ok) {
        const updatedData = await updatedDataResponse.json();
        setCurrentData(updatedData); // Pastikan state processedData diupdate
        Swal.fire("Sukses", "Pertanyaan berhasil diimpor!", "success");
        importModalRef.current.close(); // Tutup modal jika referensi modal valid
      } else {
        const result = await updatedDataResponse.json();
        Swal.fire(
          "Gagal",
          result.message || "Terjadi kesalahan saat memperbarui data.",
          "error"
        );
      }
    } catch (error) {
      console.error("Error:", error.message);
      Swal.fire(
        "Gagal",
        "Terjadi kesalahan saat mengimpor pertanyaan.",
        "error"
      );
    } finally {
      setLoading(false); // Menyelesaikan status loading setelah proses selesai
    }
  };

  const handleFileChange = (file) => {
    if (!file) {
      console.error("File tidak ditemukan");
      return;
    }

    setSelectedFile(file);

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });

        // Ambil sheet pertama
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        if (!worksheet) {
          console.error("Sheet tidak ditemukan dalam file Excel.");
          return;
        }

        // Konversi sheet ke JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        if (!jsonData || jsonData.length <= 1) {
          console.error("Data di dalam sheet kosong atau tidak valid.");
          return;
        }

        console.log("datajson", jsonData);
        parsedData = jsonData
          .map((row, index) => {
            if (index > 0 && row[0]) {
              return {
                question_text: row[0] || "", // Kolom 1: Pertanyaan
                is_header: row[1] === 1 ? 1 : 0, // Kolom 2: Header
                is_general: row[2] === 1 ? 1 : 0, // Kolom 3: General
                is_active: row[3] === 1 ? 1 : 0, // Kolom 4: Status
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

  const handlePageNavigation = (page) => {
    setPageCurrent(page);
  };

  const handleOpenImportModal = () => {
    importModalRef.current.open();
  };

  const handleSearchChange = (value) => {
    setSearchQuery(value); // Mengubah state setiap huruf diinput
  };

  const handleToggle = async (id) => {
    const parameters = { p1: id, p2: "Admin" };

    // Konfirmasi dari SweetAlert
    const confirm = await Swal.fire({
      title: "Konfirmasi",
      text: "Apakah Anda yakin ingin toggle status pertanyaan ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya",
      cancelButtonText: "Batal",
    });

    if (confirm.isConfirmed) {
      try {
        // Kirim request ke API untuk melakukan toggle status pertanyaan
        const response = await fetch(
          `${API_LINK}/MasterPertanyaan/DeletePertanyaan`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(parameters),
          }
        );

        if (!response.ok) throw new Error("Gagal toggle status pertanyaan.");

        // Update status data di frontend tanpa me-refresh
        setData((prevData) => {
          if (!Array.isArray(prevData)) return []; // Validasi prevData adalah array

          const updatedData = prevData.map((item) =>
            item.pty_id === id
              ? { ...item, pty_status: item.pty_status === 1 ? 0 : 1 }
              : item
          );

          // Mengupdate filteredData agar hanya menampilkan data yang statusnya aktif (pty_status = 1)
          setFilteredData(updatedData.filter((item) => item.pty_status === 1));

          return updatedData;
        });

        Swal.fire(
          "Berhasil",
          "Status pertanyaan berhasil di-toggle.",
          "success"
        );
        fetchData();
      } catch (err) {
        console.error("Error:", err);
        Swal.fire("Gagal", "Terjadi kesalahan saat toggle status.", "error");
      }
    } else {
      Swal.fire("Batal", "Toggle dibatalkan.", "info");
    }
  };

  const arrHeader = ["No", "Pertanyaan", "Header", "Pertanyaan Umum"];
  const actions = (row) => {
    if (row.Status === 1) return ["Toggle", "Detail", "Edit"];
    return ["Toggle"];
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
            style={{ marginLeft: "50px", margin: isMobile ? "1rem" : "3rem" }}
          >
            <div className="row" style={{ gap: "1rem", marginLeft: "5px" }}>
              {" "}
              {/* Menambahkan jarak antar elemen */}
              <div className=""></div>
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
                onClick={handleOpenImportModal}
              />
              <Button
                iconName="file-download"
                classType="success"
                label="Export Pertanyaan"
                onClick={handleExportQuestions}
              />
            </div>
            <input
              type="file"
              id="import-file"
              style={{ display: "none" }}
              onChange={handleImportQuestions}
            />
            <div className="row mt-5">
              <div className="col-lg-10 col-md-6">
                <SearchField
                  id="search"
                  placeHolder="Cari sesuatu..."
                  onChange={handleSearchChange}
                  isDisabled={false} // Memastikan input menampilkan nilai terkini dari state
                />
              </div>
              <div className="col-lg-2 col-md-7">
                <div style={{ width: "350px" }}>
                  <Filter>
                    <DropDown
                      ref={searchFilterSort}
                      label="Urut Berdasarkan"
                      type="none"
                      arrData={dataFilterSort}
                      onChange={(e) =>
                        setCurrentFilter({
                          ...currentFilter,
                          p3: e.target.value,
                        })
                      }
                    />
                    <DropDown
                      ref={searchFilterStatus}
                      label="Status"
                      type="semua"
                      arrData={dataFilterStatus}
                      defaultValue=""
                      onChange={(e) =>
                        setCurrentFilter({
                          ...currentFilter,
                          p4: e.target.value,
                        })
                      }
                    />
                  </Filter>
                </div>
              </div>
            </div>
          </div>
          <div
            className="table-container bg-white p-3 mt-0 rounded"
            style={{ margin: isMobile ? "1rem" : "3rem" }}
          >
            <Table
              arrHeader={arrHeader}
              data={currentData.map((item) => ({
                ...item,
                Header: item.Header === 1 ? "Ya" : "Tidak", // Menambahkan kolom HeaderFormatted
                ["Pertanyaan Umum"]:
                  item["Pertanyaan Umum"] === 1 ? "Ya" : "Tidak", // Menambahkan kolom HeaderFormatted
              }))}
              actions={actions}
              onDetail={(item) =>
                onChangePage("detail", { idPertanyaan: item.Key })
              }
              onEdit={(item) =>
                onChangePage("edit", { idPertanyaan: item.Key })
              }
              onToggle={(item) => handleToggle(item.Key)}
            />
            <Paging
              pageSize={pageSize}
              pageCurrent={pageCurrent}
              totalData={data.length}
              navigation={handlePageNavigation}
            />
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
              margin: "10px 0", // Jarak antar tombol
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
              margin: "10px 0", // Jarak antar tombol
            }}
            onClick={() => {
              setFile(null); // Reset file setelah batal
              importModalRef.current.close(); // Menutup modal setelah batal
            }}
          />
        }
      >
        <div
          className="form-group"
          style={{
            display: "flex",
            flexDirection: "column", // Atur elemen form secara vertikal
            gap: "10px", // Jarak antar elemen
            width: "100%", // Elemen form memenuhi modal
          }}
        >
          <label>
            Silahkan unduh format template pertanyaan terlebih dahulu, <br />
            <a
              style={{ color: "blue", textDecoration: "underline" }}
              onClick={(e) => {
                e.preventDefault(); // Mencegah navigasi default
                const templateDokumen = "Template_Kuesioner.xlsx"; // Ganti dengan data dinamis Anda
                const url = TEMPLATE_LINK + templateDokumen;

                // Memanggil API
                fetch(url, {
                  method: "GET",
                })
                  .then((response) => {
                    if (response.ok) {
                      // Jika API berhasil, buka file di tab baru
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
              border: "2px solid ",
              borderRadius: "10px",
              marginTop: "5px",
            }}
            name="import-file"
            className="form-control"
          />
        </div>
      </Modal>

      {/* ADD MODAL */}
      {/* Update Modal */}
    </div>
  );
}
