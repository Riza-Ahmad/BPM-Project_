import React, { useState, useRef, useEffect } from "react";
import Table from "../../../part/Table";
import Paging from "../../../part/Paging";
import PageTitleNav from "../../../part/PageTitleNav";
import Button from "../../../part/Button";
import TextField from "../../../part/TextField";
import Modal from "../../../part/Modal";
import Filter from "../../../part/Filter";
import SearchField from "../../../part/SearchField";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "../../../util/useIsMobile";
import { API_LINK } from "../../../util/Constants";

const title = "Pertanyaan Survei";
const breadcrumbs = [{ label: " Daftar Pertanyaan" }];

export default function Pertanyaan_Survei({ onChangePage }) {
  const [pageSize] = useState(10);
  const [pageCurrent, setPageCurrent] = useState(1);
  const [selectedQuestion, setSelectedQuestion] = useState("");
  const [formData, setFormData] = useState({ questionText: "" });
  const importModalRef = useRef("");
  const [file, setFile] = useState("");
  const [data, setData] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState(""); // Menyimpan status filter
  const [sortOrder, setSortOrder] = useState("asc"); // Menyimpan urutan sortir
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    console.log(currentData);
    const fetchDataPertanyaan = async () => {
      setLoading(true); // Aktifkan indikator loading
      try {
        // Panggil API
        const response = await fetch(
          `${API_LINK}/MasterPertanyaan/GetDataPertanyaan`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({}), // Parameter kosong
          }
        );

        // Cek status response
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        // Parsing hasil JSON
        const result = await response.json();

        // Cek apakah result adalah array
        if (!Array.isArray(result)) {
          console.error("Data yang diterima bukan array");
          return;
        }

        // Mapping data dan pastikan pty_id ada di setiap item
        const formattedPertanyaan = result.map((item, index) => {
          return {
            Key: item.pty_id || "No ID", // Jika pty_id tidak ada, gunakan fallback
            question: item.pty_pertanyaan,
            isHeader: item.pty_isheader,
            isGeneral: item.pty_isgeneral,
            status: item.pty_status,
            createdBy: item.pty_created_by,
            createdDate: item.pty_created_date
              ? new Date(item.pty_created_date).toISOString()
              : "-",
            role: item.pty_role_responden,
          };
        });

        // Set data ke state
        setData(formattedPertanyaan);
        setFilteredData(formattedPertanyaan);
      } catch (error) {
        console.error("Fetch error:", error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: error.message || "Gagal mengambil data pertanyaan!",
        });
      } finally {
        setLoading(false); // Matikan indikator loading
      }
    };
    fetchDataPertanyaan();
  }, []);

  const addModalRef = useRef();
  const updateModalRef = useRef();
  const detailModalRef = useRef();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [questions, setQuestions] = useState([]);
  const [questionText, setQuestionText] = useState("");
  const [isHeader, setIsHeader] = useState(false);
  const [generalQuestion, setGeneralQuestion] = useState("Ya");
  const [surveyCriteria, setSurveyCriteria] = useState("");
  const [respondent, setRespondent] = useState("");

  const handleAddQuestion = () => {
    const newQuestion = {
      id: questions.length + 1,
      text: questionText,
      generalQuestion,
      surveyCriteria,
      respondent,
    };
    setQuestions([...questions, newQuestion]);
    setQuestionText("");
    setSurveyCriteria("");
    setRespondent("");
    setIsHeader(false);
    setGeneralQuestion("Ya");
    addModalRef.current.close();
    5;
  };

  const handleChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSearch = () => {
    // Ambil nilai pencarian dari SearchField
    const searchQuery = getSearchQuery(); // Ganti dengan cara Anda mendapatkan query pencarian dari SearchField

    // Filter berdasarkan status dan urutan
    let filteredData = originalData.filter((item) => {
      // Filter berdasarkan status
      if (statusFilter && item.status !== statusFilter) return false;

      // Filter berdasarkan query pencarian
      if (
        searchQuery &&
        !item.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
        return false;

      return true;
    });

    // Urutkan data berdasarkan urutan yang dipilih
    filteredData = filteredData.sort((a, b) => {
      if (sortOrder === "asc") {
        return a.name.localeCompare(b.name); // Urutkan berdasarkan nama secara ascending
      } else if (sortOrder === "desc") {
        return b.name.localeCompare(a.name); // Urutkan berdasarkan nama secara descending
      }
      return 0;
    });

    // Update data yang ditampilkan setelah filter dan sort
    setCurrentData(filteredData);
  };

  const handleUpdateQuestion = () => {
    if (!selectedQuestion) return;
    const updatedQuestion = {
      ...selectedQuestion,
      text: formData.questionText,
      generalQuestion,
      surveyCriteria,
      respondent,
    };
    setQuestions(
      questions.map((q) => (q.id === selectedQuestion.id ? updatedQuestion : q))
    );
    setSelectedQuestion(null);
    setFormData({ questionText: "" });
    updateModalRef.current.close();
  };

  const handleExportQuestions = () => {
    if (questions.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Data Kosong",
        text: "Tidak ada pertanyaan untuk diekspor.",
      });
      return;
    }

    const header = "ID,Pertanyaan";
    const csvData = [header, ...questions.map((q) => `${q.id},${q.text}`)].join(
      "\n"
    );

    const blob = new Blob([csvData], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "questions_export.csv";
    link.click();
  };

  const handleImportQuestions = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result;
        const lines = content.split("\n");
        const newQuestions = lines.map((line) => {
          const [id, text] = line.split(",");
          return { id: parseInt(id, 10), text };
        });
        setQuestions(newQuestions);
      };
      reader.readAsText(file);
    }
  };
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };
  const indexOfLastData = pageCurrent * pageSize;
  const indexOfFirstData = indexOfLastData - pageSize;
  const currentData = filteredData.slice(indexOfFirstData, indexOfLastData);
  // const filteredQuestions = Data.filter((question) =>
  //     question.text.toLowerCase().includes(filterValue.toLowerCase())
  // );

  // Mengambil data yang sudah difilter berdasarkan halaman saat ini
  //const currentData = Data.slice(indexOfFirstData, indexOfLastData);

  const handlePageNavigation = (page) => {
    setPageCurrent(page);
  };

  const handleOpenImportModal = () => {
    importModalRef.current.open();
  };

  const handleCheckboxChange = () => {
    setIsHeader(!isHeader);
  };

  const handleEdit = (id) => {
    // ()=>onChangePage('edit')
    if (!id) {
      console.error("ID tidak ada atau tidak valid");
      return; // Hentikan jika id tidak valid
    }

    // Debugging: Cek nilai id
    console.log("ID yang akan digunakan untuk request:", id);

    // Lakukan request ke API dengan id yang valid
    fetch(`MasterPertanyaan/GetDataPertanyaanById/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Request gagal");
        }
        return response.json();
      })
      .then((data) => {
        // Proses data yang diterima
        console.log("Data diterima:", data);
        // Update state atau lakukan tindakan lain dengan data
      })
      .catch((error) => {
        console.error("Terjadi kesalahan:", error);
      });
  };
  const handleSelectChange = (e) => {
    setGeneralQuestion(e.target.value);
  };

  const handleToggle = async (id) => {
    const parameters = { p1: id, p2: "Admin" }; // Mengirimkan ID dan user yang melakukan modifikasi

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
          `${API_LINK}/MasterPertanyaan/TogglePertanyaanStatus`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(parameters),
          }
        );

        if (!response.ok) throw new Error("Gagal toggle status pertanyaan.");

        // Update status data di frontend
        setData((prevData) =>
          prevData.map(
            (item) =>
              item.pty_id === id
                ? { ...item, pty_status: item.pty_status === 1 ? 0 : 1 }
                : item // Toggle status (1 ke 0 atau sebaliknya)
          )
        );

        // Update filteredData agar hanya menampilkan data yang statusnya aktif (pty_status = 1)
        setFilteredData(
          (prevFilteredData) =>
            prevFilteredData.filter((item) => item.pty_status === 1) // Menyaring data yang aktif
        );

        Swal.fire(
          "Berhasil",
          "Status pertanyaan berhasil di-toggle.",
          "success"
        );
      } catch (err) {
        console.error("Error:", err);
        Swal.fire("Gagal", "Terjadi kesalahan saat toggle status.", "error");
      }
    } else {
      Swal.fire("Batal", "Toggle dibatalkan.", "info");
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
                classType="primary"
                label="Import Pertanyaan"
                onClick={handleOpenImportModal}
              />
              <Button
                iconName="file-download"
                classType="primary"
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
                <SearchField />
              </div>

              {/* <div className="col-lg-2 col-md-7" style={{marginLeft:"-70px"}}>  */}
              <div className="col-lg-2 col-md-7">
                <Button
                  iconName="apps-sort"
                  classType="primary dropdown-toggle px-4 border-start"
                  title="Saring atau Urutkan Data"
                  data-bs-toggle="dropdown"
                  data-bs-auto-close="outside"
                  label="Filter"
                />

                <div className="dropdown-menu p-4" style={{ width: "350px" }}>
                  {/* Status Filter */}
                  <div className="mb-3">
                    <label className="form-label">Status</label>
                    <select
                      className="form-select"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)} // Set status filter
                    >
                      <option value="">Semua</option>
                      <option value="aktif">Aktif</option>
                      <option value="tidak-aktif">Tidak Aktif</option>
                    </select>
                  </div>
                  {/* Sort Order Filter */}
                  <div className="mb-3">
                    <label className="form-label">Urutkan Berdasarkan</label>
                    <select
                      className="form-select"
                      value={sortOrder}
                      onChange={(e) => setSortOrder(e.target.value)}
                    >
                      <option value="asc">Ascending</option>
                      <option value="desc">Descending</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className="table-container bg-white p-3 mt-0 rounded"
            style={{ margin: isMobile ? "1rem" : "3rem" }}
          >
            <Table
              arrHeader={["No", "Pertanyaan", "Header", "Pertanyaan Umum"]}
              data={currentData
                // Filter berdasarkan status
                .filter((item) => {
                  if (statusFilter === "") return true; // Jika status filter kosong, tampilkan semua data
                  if (statusFilter === "aktif" && item.status === 1)
                    return true;
                  if (statusFilter === "tidak-aktif" && item.status === 0)
                    return true;
                  return false;
                })
                // Sortir berdasarkan urutan
                .sort((a, b) => {
                  if (sortOrder === "asc") {
                    return a.No - b.No; // Urutkan berdasarkan No secara ascending
                  } else {
                    return b.No - a.No; // Urutkan berdasarkan No secara descending
                  }
                })
                .map((item, index) => ({
                  Key: item.Key,
                  No: indexOfFirstData + index + 1,
                  Pertanyaan: item.question,
                  Header: item.isHeader ? "Ya" : "Tidak",
                  "Pertanyaan Umum": item.isGeneral ? "Ya" : "Tidak",
                  status: item.status,
                }))}
              actions={(item) => {
                if (item.status === 0) {
                  return ["Toggle"];
                } else {
                  return ["Detail", "Edit", "Toggle"];
                }
              }}
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

      {/* Import Modal */}
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
            onClick={() => {
              if (file) {
                handleImportQuestions();
              }
            }}
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
              setFile(null);
              importModalRef.current.close();
            }}
          />
        }
      >
        <div
          className="form-group"
          style={{
            display: "flex",
            flexDirection: "column", // Atur elemen form secara vertikal
            // alignItems: "center", // Tengah horizontal
            // textAlign: "center", // Tengah teks dalam label
            gap: "10px", // Jarak antar elemen
            width: "100%", // Elemen form memenuhi modal
          }}
        >
          <label>
            Silahkan unduh format template pertanyaan terlebih dahulu, <br />
            <a href="#" style={{ color: "blue", textDecoration: "underline" }}>
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
            onChange={handleFileChange}
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
      <Modal
        ref={addModalRef}
        title="Tambah Pertanyaan Survei"
        size="full"
        Button1={
          <Button
            classType="primary"
            label="Simpan"
            onClick={handleAddQuestion}
          />
        }
        Button2={
          <Button
            classType="secondary"
            label="Batal"
            onClick={() => addModalRef.current.close()}
          />
        }
      >
        {/* Header Checkbox */}
        <div>
          <label>Header</label>
          <input
            type="checkbox"
            checked={isHeader}
            onChange={handleCheckboxChange}
          />
        </div>
        <br />

        {/* Pertanyaan Umum */}
        <div>
          <label htmlFor="generalQuestion">Pertanyaan Umum *</label>
          <br />
          <select
            id="generalQuestion"
            value={generalQuestion}
            onChange={handleSelectChange}
            required
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          >
            <option value="" disabled>
              Pilih salah satu
            </option>
            <option value="Ya">Ya</option>
            <option value="Tidak">Tidak</option>
          </select>
        </div>
        <br />

        {/* Input Pertanyaan */}
        <div>
          <TextField
            label="Pertanyaan"
            isRequired={true}
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            placeholder="Masukkan Pertanyaan"
          />
        </div>
        {/* Kriteria dan Responden, tampil jika "Tidak" */}
        {generalQuestion === "Tidak" && (
          <>
            <div>
              <label
                htmlFor="surveyCriteria"
                style={{
                  fontWeight: "bold",
                  display: "block",
                  marginBottom: "8px",
                }}
              >
                Kriteria Survei *
              </label>
              <select
                id="surveyCriteria"
                value={surveyCriteria}
                onChange={(e) => setSurveyCriteria(e.target.value)}
                required
                style={{ width: "100%", padding: "8px", marginTop: "5px" }}
              >
                <option value="" disabled>
                  Pilih Kriteria
                </option>
                <option value="Kepuasan Dosen">Kepuasan Dosen</option>
                <option value="Kepuasan Tenaga Pendidik">
                  Kepuasan Tenaga Pendidik
                </option>
              </select>
            </div>
            <br />
            <div>
              <label
                htmlFor="respondent"
                style={{
                  fontWeight: "bold",
                  display: "block",
                  marginBottom: "8px",
                }}
              >
                Responden *
              </label>
              <select
                id="respondent"
                value={respondent}
                onChange={(e) => setRespondent(e.target.value)}
                required
                style={{ width: "100%", padding: "8px", marginTop: "5px" }}
              >
                <option value="" disabled>
                  Pilih Responden
                </option>
                <option value="Mahasiswa">Mahasiswa</option>
                <option value="Tenaga Pendidik">Tenaga Pendidik</option>
              </select>
            </div>
          </>
        )}
      </Modal>
      {/* Update Modal */}
      <Modal
        ref={updateModalRef}
        title="Update Pertanyaan"
        size="full"
        // Button1={<Button classType="primary" label="Simpan" onClick={handleUpdateQuestion} />}
        // Button2={<Button classType="secondary" label="Batal" onClick={() => updateModalRef.current.close()} />}
      >
        {/* Header */}
        <div>
          <label> Header </label>
          <input
            type="checkbox"
            checked={isHeader}
            onChange={handleCheckboxChange}
          />
        </div>

        {/* Pertanyaan Umum */}
        <div>
          <label>Pertanyaan Umum</label>
          <select value={generalQuestion} onChange={handleSelectChange}>
            <option value="Ya">Ya</option>
            <option value="Tidak">Tidak</option>
          </select>
        </div>

        {/* Kriteria dan Responden, tampil jika "Tidak" */}
        {generalQuestion === "Tidak" && (
          <>
            <div>
              <label>Kriteria Survei</label>
              <select
                value={surveyCriteria}
                onChange={(e) => setSurveyCriteria(e.target.value)}
              >
                <option value="Kepuasan Dosen">Kepuasan Dosen</option>
                <option value="Kepuasan Tenaga Pendidik">
                  Kepuasan Tenaga Pendidik
                </option>
              </select>
            </div>
            <div>
              <label>Responden</label>
              <select
                value={respondent}
                onChange={(e) => setRespondent(e.target.value)}
              >
                <option value="Mahasiswa">Mahasiswa</option>
                <option value="Tenaga Pendidik">Tenaga Pendidik</option>
              </select>
            </div>
          </>
        )}
        <div>
          <label>Pertanyaan</label>
          <input
            type="text"
            value={formData.questionText}
            onChange={(e) =>
              setFormData({ ...formData, questionText: e.target.value })
            }
            placeholder="Masukkan Pertanyaan"
          />
        </div>
      </Modal>
    </div>
  );
}
