import React, { useEffect, useState } from "react";
import PageTitleNav from "../../../part/PageTitleNav";
import HeaderForm from "../../../part/HeaderText";
import Button from "../../../part/Button";
import { useLocation } from "react-router-dom";
import SweetAlert from "../../../util/SweetAlert";
import { useIsMobile } from "../../../util/useIsMobile";
import { API_LINK } from "../../../util/Constants";
import Loading from "../../../part/Loading";
import FileUpload from "../../../part/FileUpload";
import * as XLSX from "xlsx";
import { useFetch } from "../../../util/useFetch";

const template = "/template/Template_BankPertanyaan.xlsx";
const templateIso = "/template/Template_BankPertanyaanISO.xlsx";

// Definisikan struktur header yang diharapkan
const expectedHeaders = [
  "ID Kriteria", // Kolom 1
  "Pertanyaan", // Kolom 2
  "Dokumen Pendukung", // Kolom 3
  "Dokumen Pendukung", // Kolom 4
  "Jenis IKT?", // Kolom 5
];

let parsedData = [];

export default function Add({ onChangePage }) {
  const isMobile = useIsMobile();
  const title = "Tambah Bank Pertanyaan";
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const [currentFilter, setCurrentFilter] = useState({
    param1: "Aktif",
    param2: "",
    param3: "namaKri ASC",
    param4: pageSize,
    param5: pageCurrent,
  });

  const [kriteria, setKriteria] = useState({});

  const fetchKriteria = async () => {
    setLoading(true);
    try {
      const result = await useFetch(
        `${API_LINK}/MasterKriteria/GetDataKriteria`,
        currentFilter,
        "POST"
      );

      if (result === "ERROR" || result === null || result.length === 0) {
        setKriteria([]);
      } else {
        const arrResult = Object.values(result);
        setKriteria(arrResult);
      }
    } catch (err) {
      setError("Gagal mengambil data: " + err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKriteria();
    console.log(kriteria);
  }, []);

  const handleFileChange = (file) => {
    if (!file) {
      SweetAlert(
        "Error",
        "File tidak ditemukan. Silakan pilih file.",
        "error",
        "OK"
      );
      return;
    }

    setSelectedFile(file);

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });

        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        if (!worksheet) {
          SweetAlert(
            "Error",
            "Sheet tidak ditemukan dalam file Excel.",
            "error",
            "OK"
          ).then(() => {
            window.location.reload();
          });
          return;
        }

        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        if (!jsonData || jsonData.length < 2) {
          SweetAlert(
            "Error",
            "File Excel kosong atau tidak valid.",
            "error",
            "OK"
          ).then(() => {
            window.location.reload();
          });
          return;
        }

        // Validasi header
        const fileHeaders = jsonData[1];
        const isValidTemplate = expectedHeaders.every(
          (header, index) => header === fileHeaders[index]
        );

        if (!isValidTemplate) {
          SweetAlert(
            "Error",
            "File tidak sesuai dengan template. Pastikan Anda menggunakan template yang benar.",
            "error",
            "OK"
          ).then(() => {
            window.location.reload();
          });
          return;
        }

        // Validasi data per baris
        const isValidRow = (row) => {
          return (
            row.length >= expectedHeaders.length && // Jumlah kolom sesuai
            row[0] && // Kriteria tidak boleh kosong
            row[1] // Pertanyaan tidak boleh kosong
          );
        };

        parsedData = jsonData
          .slice(2)
          .map((row, index) => {
            if (!isValidRow(row)) {
              SweetAlert(
                "Error",
                `Data tidak valid pada baris ${
                  index + 2
                }. Pastikan semua kolom terisi dengan benar.`,
                "error",
                "OK"
              ).then(() => {
                window.location.reload();
              });
              return null; // Jika baris tidak valid, return null
            }
            return {
              kriteria: row[0] || "",
              pertanyaan: row[1] || "",
              pertanyaanLanjutan: row[2] === 1 ? row[3] || "" : "",
              butuhDokumen: row[2] === 1 ? "Ya" : "Tidak",
              jenisIKT: row[4] === 1 ? "Ya" : "Tidak",
              bagianAuditee: [],
            };
          })
          .filter(Boolean);

        if (parsedData.length === 0) {
          SweetAlert(
            "Error",
            "Tidak ada data yang valid untuk diproses.",
            "error",
            "OK"
          ).then(() => {
            window.location.reload();
          });
          return;
        }
      } catch (error) {
        console.error("Error saat membaca file Excel:", error.message);
        SweetAlert("Error", "Gagal membaca file Excel.", "error", "OK");
      }
    };

    reader.onerror = (error) => {
      console.error("Error membaca file:", error.message);
      SweetAlert(
        "Error",
        "Gagal membaca file. Silakan coba lagi.",
        "error",
        "OK"
      ).then(() => {
        window.location.reload();
      });
    };

    reader.readAsArrayBuffer(file);
  };

  const handleSubmit = async () => {
    if (parsedData.length === 0) {
      SweetAlert("Error", "Tidak ada data untuk disimpan.", "error", "OK");
      return;
    }

    setLoading(true);

    for (let index = 0; index < parsedData.length; index++) {
      try {
        const createResponse = await useFetch(
          `${API_LINK}/MasterBankPertanyaanAudit/CreateBankPertanyaanAudit`,
          parsedData[index],
          "POST"
        );

        if (createResponse === "ERROR") {
          throw new Error(`Gagal menambah data pada indeks ${index}`);
        }
      } catch (error) {
        console.error("Error pada indeks", index, ":", error.message);
        SweetAlert(
          "Gagal!",
          `Error pada data ke-${index + 1}: ${error.message}`,
          "error",
          "OK"
        );
        break;
      }
    }

    setLoading(false);

    SweetAlert(
      "Berhasil!",
      "Semua data berhasil ditambahkan.",
      "success",
      "OK"
    ).then(() => onChangePage("index"));
  };

  if (loading) return <Loading />;
  if (error) return <p>{error}</p>;

  return (
    <div className="d-flex flex-column min-vh-100">
      <main className="flex-grow-1 p-3" style={{ marginTop: "80px" }}>
        <div className="d-flex flex-column">
          <div className="p-3">
            <PageTitleNav
              title={title}
              breadcrumbs={location.state.breadcrumbs}
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
              <HeaderForm label="Formulir Bank Pertanyaan" />
              <div className="mb-3">
                <label className="form-label fw-bold">
                  Template Excel Pertanyaan
                </label>
                <br />
                <a
                  href={template}
                  download="Template_BankPertanyaan.xlsx"
                  style={{ textDecoration: "none" }}
                >
                  Unduh Template Pertanyaan Excel
                </a>
                <br />
                <a
                  href={templateIso}
                  download="Template_BankPertanyaanISO.xlsx"
                  style={{ textDecoration: "none" }}
                >
                  Unduh Template Pertanyaan Excel ISO 9001
                </a>
              </div>

              <FileUpload
                label="Upload Excel Pertanyaan (harus sesuai template)"
                forInput="fileDokumen"
                formatFile=".xlsx"
                onChange={(file) => handleFileChange(file)}
                isRequired={true}
              />
              <div className="d-flex justify-content-between align-items-center">
                <div className="flex-grow-1 m-2">
                  <Button
                    classType="primary"
                    type="submit"
                    label="Simpan"
                    width="100%"
                    onClick={handleSubmit}
                  />
                </div>
                <div className="flex-grow-1 m-2">
                  <Button
                    classType="danger"
                    type="button"
                    label="Batal"
                    width="100%"
                    onClick={() => onChangePage("index")}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
