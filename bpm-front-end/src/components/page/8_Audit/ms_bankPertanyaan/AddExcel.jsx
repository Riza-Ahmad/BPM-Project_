import React, { useState } from "react";
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

// Definisikan parsedData sebagai variabel global
let parsedData = [];

export default function Add({ onChangePage }) {
  const isMobile = useIsMobile();
  const title = "Tambah Bank Pertanyaan";
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

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

        parsedData = jsonData
          .map((row, index) => {
            if (index > 1 && row[0] && row[1]) {
              return {
                kriteria: row[0] || "",
                pertanyaan: row[1] || "",
                pertanyaanLanjutan: row[2] === 1 ? row[3] || "" : "",
                butuhDokumen: row[2] === 1 ? "Ya" : "Tidak",
                jenisIKT: row[4] === 1 ? "Ya" : "Tidak",
                bagianAuditee: [],
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

  const handleSubmit = async () => {
    console.log("Submit Data:", parsedData);

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
        } else {
          console.log(`Data pada indeks ${index} berhasil ditambahkan.`);
        }
      } catch (error) {
        console.error("Error pada indeks", index, ":", error.message);
        SweetAlert(
          "Gagal!",
          `Error pada data ke-${index + 1}: ${error.message}`,
          "error",
          "OK"
        );

        break; // Hentikan proses jika ada error
      } finally {
        setLoading(false);
      }
    }

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
          {/* Breadcrumbs and Page Title */}
          <div className="p-3">
            <PageTitleNav
              title={title}
              breadcrumbs={location.state.breadcrumbs}
              onClick={() => onChangePage("index")}
            />
          </div>
          <div className={isMobile ? "m-0" : "m-3"}>
            {/* Main Content Section */}
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
