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
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

const expectedHeaders = [
  "ID Kriteria",
  "Pertanyaan",
  "Dokumen Pendukung",
  "Dokumen Pendukung Keterangan",
  "Jenis IKT?",
];

let parsedData = [];

export default function Add({ onChangePage }) {
  const isMobile = useIsMobile();
  const title = "Tambah Bank Pertanyaan";
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [pageSize] = useState(100);
  const [pageCurrent, setPageCurrent] = useState(1);

  const [currentFilter, setCurrentFilter] = useState({
    param1: "Aktif",
    param2: "",
    param3: "idKri ASC",
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

  const handleDownload = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Pertanyaan");

    const sheet1Data = [
      [
        "Daftar ID Kriteria dapat dilihat pada Sheet Daftar Kriteria",
        "Isikan Pertanyaan",
        "1 = Butuh, 0 = Tidak Butuh",
        "Dokumen1,Dokumen2,…..(Kosongan Jika Tidak Butuh Dokumen Pendukung)",
        "1 = Ya, 0 = Tidak",
      ],
      [
        "ID Kriteria",
        "Pertanyaan",
        "Dokumen Pendukung",
        "Dokumen Pendukung Keterangan",
        "Jenis IKT?",
      ],
      [11, "Pertanyaan1", 1, "Dokumen1", 0],
      [15, "Pertanyaan2", 0, "", 1],
    ];

    sheet1Data.forEach((row) => {
      worksheet.addRow(row);
    });

    worksheet.columns = [
      { width: 15 },
      { width: 70 },
      { width: 20 },
      { width: 40 },
      { width: 15 },
    ];

    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: false };
      cell.alignment = {
        horizontal: "center",
        vertical: "middle",
        wrapText: true,
      };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });

    worksheet.getRow(2).eachCell((cell) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "B4C6E7" },
      };
      cell.font = { bold: true };
      cell.alignment = {
        horizontal: "center",
        vertical: "middle",
        wrapText: true,
      };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });

    worksheet.getColumn(1).eachCell((cell) => {
      cell.alignment = {
        horizontal: "center",
        vertical: "middle",
        wrapText: true,
      };
    });

    worksheet.getColumn(3).eachCell((cell) => {
      cell.alignment = {
        horizontal: "center",
        vertical: "middle",
        wrapText: true,
      };
    });

    worksheet.getColumn(5).eachCell((cell) => {
      cell.alignment = {
        horizontal: "center",
        vertical: "middle",
        wrapText: true,
      };
    });

    const sheetKriteria = workbook.addWorksheet("Daftar Kriteria");
    sheetKriteria.addRow(["ID Kriteria", "Nama Kriteria"]);
    kriteria.forEach((item) => {
      sheetKriteria.addRow([item.idKri, item.namaKri]);
    });

    sheetKriteria.columns = [{ width: 15 }, { width: 70 }];
    sheetKriteria.getRow(1).eachCell((cell) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "B4C6E7" },
      };
      cell.font = { bold: true };
      cell.alignment = {
        horizontal: "center",
        vertical: "middle",
        wrapText: true,
      };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });

    sheetKriteria.getColumn(1).eachCell((cell) => {
      cell.alignment = {
        horizontal: "center",
        vertical: "middle",
        wrapText: true,
      };
    });

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(
      new Blob([buffer], { type: "application/octet-stream" }),
      "Template_Bank_Pertanyaan.xlsx"
    );
  };

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

        const isValidRow = (row) => {
          return row.length >= expectedHeaders.length && row[0] && row[1];
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
              return null;
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
    if (kriteria.length === 0) {
      SweetAlert(
        "Perhatian!",
        "Harap tambahkan data kriteria terlebih dahulu",
        "warning",
        "OK"
      );
      return;
    }
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
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleDownload();
                  }}
                  style={{ textDecoration: "none", cursor: "pointer" }}
                >
                  Unduh Template Pertanyaan Excel
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
