import React, { useState, useEffect } from "react";
import { API_LINK } from "../../../util/Constants";
import { useIsMobile } from "../../../util/useIsMobile";
import { useFetch } from "../../../util/useFetch";
import { decodeHtml } from "../../../util/DecodeHtml.js";
import BarChart2 from "../../../part/BarChart2";
import PieChart from "../../../part/PieChart";
import Loading from "../../../part/Loading";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "../../../part/Button.jsx";
import * as XLSX from "xlsx";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

const TabPreviewSurvei = ({ idTransaksi, pertanyaan = [], role = null }) => {
  const [selectedQuestion, setSelectedQuestion] = useState("");
  const [selectedQuestionName, setSelectedQuestionName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formDataJawaban, setFormDataJawaban] = useState([]);
  const [filterFormDataJawaban, setFilterFormDataJawaban] = useState([]);
  const [tipeFilter, setTipeFilter] = useState("");

  useEffect(() => {
    if (Array.isArray(pertanyaan) && pertanyaan.length > 0) {
      setSelectedQuestion("");
    }
  }, [pertanyaan]);

  const handleDataChange = (e) => {
    setSelectedQuestion(e.target.value);
    setSelectedQuestionName(e.target.options[e.target.selectedIndex].text); // Ambil teks dari option yang dipilih
  };

  useEffect(() => {
    if (selectedQuestion) {
      const fetchData = async () => {
        setLoading(true);

        try {
          const result = await useFetch(
            `${API_LINK}/TransaksiSurvei/GetDataJawabanTransaksiSurveiByPertanyaanxx`,
            { idTransaksi: idTransaksi, idPertanyaan: selectedQuestion },
            "POST"
          );

          if (result === "ERROR" || result === null || result.length === 0) {
            setFormDataJawaban([]);
          } else {
            const fetchedData = result;

            setTipeFilter(result[0].tipeJawaban);
            const initialFormData = fetchedData.reduce((acc, item) => {
              acc[item.idPenjawab] = {
                idPenjawab: item.idPenjawab,
                deskripsiJawaban: item.deskripsiJawaban,
                jawabanSurvei: decodeHtml(item.jawabanSurvei) || "",
                kriteriaJawaban: item.kriteriaJawaban,
                pertanyaanSurvei: item.pertanyaanSurvei,
                skalaJawaban: item.skalaJawaban,
                tipeJawaban: item.tipeJawaban,
              };
              return acc;
            }, {});

            setFormDataJawaban(initialFormData);
          }
        } catch (err) {
          setError("Gagal mengambil data: " + err);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [selectedQuestion]);

  useEffect(() => {
    if (!formDataJawaban) return;
    console.log("Tipe jawaban: ", tipeFilter);

    if (tipeFilter === "CheckBox") {
      const uniqueLabels = Object.values(formDataJawaban)
        .map((item) => item.deskripsiJawaban.split(","))
        .flat()
        .filter((value, index, self) => self.indexOf(value) === index);

      const labelCount = uniqueLabels.reduce((acc, label) => {
        acc[label] = 0;
        return acc;
      }, {});

      Object.values(formDataJawaban).forEach((item) => {
        if (item.jawabanSurvei) {
          try {
            const selectedValues = JSON.parse(item.jawabanSurvei);
            selectedValues.forEach((value) => {
              if (labelCount[value] !== undefined) {
                labelCount[value] += 1;
              }
            });
          } catch (error) {
            console.error("Error parsing JSON:", item.jawabanSurvei);
          }
        }
      });

      setFilterFormDataJawaban(
        uniqueLabels.map((label) => ({ label, value: labelCount[label] }))
      );
      setTipeFilter("CheckBox");
    } else if (tipeFilter === "RadioButton") {
      // Membuat label yang unik berdasarkan deskripsiJawaban
      const uniqueLabels = Object.values(formDataJawaban)
        .map((item) => item.deskripsiJawaban.split(","))
        .flat()
        .map((value) => value.trim()) // Menghapus spasi di sekitar label
        .filter((value, index, self) => self.indexOf(value) === index); // Menyaring label unik

      // Inisialisasi labelCount untuk setiap label dengan value = 0
      const labelCount = uniqueLabels.reduce((acc, label) => {
        acc[label] = 0; // Set nilai default 0
        return acc;
      }, {});

      Object.values(formDataJawaban).forEach((item) => {
        if (item.jawabanSurvei) {
          // Jika ada jawabanSurvei, tambahkan ke labelCount yang sesuai
          const selectedValue = item.jawabanSurvei.trim();
          if (labelCount[selectedValue] !== undefined) {
            labelCount[selectedValue] += 1; // Menambahkan 1 jika ditemukan kecocokan
          }
        }
      });

      // Mapping data menjadi format [{ label: "Ya", value: 1 }, { label: "Tidak", value: 0 }]
      const finalData = uniqueLabels.map((label) => ({
        label,
        value: labelCount[label] || 0, // Pastikan jika tidak ada jawaban untuk label, set value 0
      }));

      setFilterFormDataJawaban(finalData);
      setTipeFilter("RadioButton");
    } else if (tipeFilter === "TextBox" || tipeFilter === "TextArea") {
      setFilterFormDataJawaban(formDataJawaban);
      setTipeFilter(tipeFilter);

      console.log("Textbox : ", formDataJawaban);
    } else {
      console.log("Tipe");
    }
  }, [formDataJawaban, tipeFilter]);

  const handleDownload = async () => {
    try {
      // Fetch data dari API
      const result = await useFetch(
        `${API_LINK}/TransaksiSurvei/GetDataSurveiEkspor`,
        { idTransaksi: idTransaksi },
        "POST"
      );

      if (!result || result.length === 0) {
        console.warn("No data to export");
        return;
      }

      // Decode semua jawaban sebelum diekspor
      const decodedData = result.map((item) => {
        let newItem = { ...item };
        for (let key in newItem) {
          if (typeof newItem[key] === "string") {
            newItem[key] = decodeHtml(newItem[key]);
          }
        }
        return newItem;
      });

      // Buat workbook dan worksheet baru
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Survey Data");

      // Ambil daftar header
      const headers = Object.keys(decodedData[0]);

      // Tambahkan header ke worksheet
      worksheet.addRow(headers);

      // Tambahkan data ke worksheet
      decodedData.forEach((row) => {
        worksheet.addRow(Object.values(row));
      });

      // Styling untuk header (warna biru, teks bold, border)
      const headerRow = worksheet.getRow(1);
      headerRow.eachCell((cell) => {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "0070C0" }, // Warna biru
        };
        cell.font = { bold: true, color: { argb: "FFFFFF" } }; // Teks putih & bold
        cell.alignment = { horizontal: "center", vertical: "middle" };
        cell.border = {
          top: { style: "thin", color: { argb: "000000" } },
          bottom: { style: "thin", color: { argb: "000000" } },
          left: { style: "thin", color: { argb: "000000" } },
          right: { style: "thin", color: { argb: "000000" } },
        };
      });

      // Set lebar minimal kolom ke 20
      worksheet.columns = headers.map((header) => ({
        header,
        key: header,
        width: 20, // Minimal 20 karakter
      }));

      // Simpan file ke buffer
      const buffer = await workbook.xlsx.writeBuffer();

      // Simpan file dengan FileSaver
      const fileName = `SurveyData_${idTransaksi}.xlsx`;
      saveAs(
        new Blob([buffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        }),
        fileName
      );
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };
  if (loading) return <Loading />;

  return (
    <div className="border rounded-3 shadow-sm p-3 mb-3">
      {role === "ROL01" ? (
        <div className="row">
          <div className="p-3">
            <Button
              iconName="download"
              classType="success"
              type="submit"
              label="Ekspor Jawaban Survei"
              width="15rem"
              onClick={handleDownload}
            />
          </div>
        </div>
      ) : null}
      {/* Dropdown untuk memilih pertanyaan */}
      <div
        className="card p-3 text-white d-flex flex-column"
        style={{
          backgroundColor: "#2654A1",
          borderRadius: "10px",
          border: "1px solid rgba(255, 255, 255, 0.3)",
        }}
      >
        <label className="form-label fw-bold">Pilih Pertanyaan</label>
        <div className="position-relative">
          <select
            className="form-select text-white fw-medium"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              color: "#fff",
              border: "1px solid rgba(255, 255, 255, 0.5)",
              borderRadius: "8px",
              padding: "10px",
              appearance: "none",
            }}
            value={selectedQuestion}
            onChange={handleDataChange}
          >
            <option key={""} value={""} className="text-dark">
              {"-=Select Pertanyaan=-"}
            </option>
            {pertanyaan.length > 0 ? (
              pertanyaan.map((item) => (
                <option
                  key={item.idPertanyaan}
                  value={item.idPertanyaan}
                  className="text-dark"
                >
                  {item.pertanyaanSurvei}
                </option>
              ))
            ) : (
              <option value="" disabled>
                Tidak ada pertanyaan tersedia
              </option>
            )}
          </select>

          {/* Ikon panah custom */}
          <i
            className="fa fa-chevron-down position-absolute"
            style={{
              right: "15px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "rgba(255, 255, 255, 0.7)",
              pointerEvents: "none",
            }}
          ></i>
        </div>

        {tipeFilter === "CheckBox" && (
          <BarChart2
            judul={selectedQuestionName}
            sourceData={filterFormDataJawaban || []}
          />
        )}

        {tipeFilter === "RadioButton" && (
          <PieChart
            judul={selectedQuestionName}
            sourceData={filterFormDataJawaban || []}
          />
        )}

        {(tipeFilter === "TextBox" || tipeFilter === "TextArea") && (
          <>
            <div
              style={{
                maxHeight: "240px",
                overflowY: "auto",
                border: "1px solid gray",
                padding: "8px",
                borderRadius: "4px",
                marginTop: "10px",
              }}
            >
              {Object.values(filterFormDataJawaban).filter(
                (item) => item.jawabanSurvei?.trim() !== ""
              ).length > 0 ? (
                Object.values(filterFormDataJawaban)
                  .filter((item) => item.jawabanSurvei?.trim() !== "") // Pastikan jawaban tidak kosong
                  .map((item) => (
                    <div
                      key={item.idPenjawab}
                      style={{
                        backgroundColor: "#ffffff",
                        padding: "1rem",
                        marginBottom: "1rem",
                        borderRadius: "1rem",
                        color: "gray",
                        display: "flex",
                        alignItems: "center",
                        textAlign: "left",
                      }}
                    >
                      <p style={{ margin: 0 }}>{item.jawabanSurvei}</p>
                    </div>
                  ))
              ) : (
                <p style={{ textAlign: "center", color: "gray" }}>
                  Tidak ada jawaban tersedia.
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TabPreviewSurvei;
