import React, { useState, useEffect } from "react";
import { API_LINK } from "../../../util/Constants";
import { useIsMobile } from "../../../util/useIsMobile";
import { useFetch } from "../../../util/useFetch";
import { decodeHtml } from "../../../util/DecodeHtml.js";
import BarChart2 from "../../../part/BarChart2";
import PieChart from "../../../part/PieChart";
import Loading from "../../../part/Loading";
import "bootstrap/dist/css/bootstrap.min.css";

const TabPreviewSurvei = ({ idTransaksi, pertanyaan = [] }) => {
  const [selectedQuestion, setSelectedQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formDataJawaban, setFormDataJawaban] = useState([]);
  const [filterFormDataJawaban, setFilterFormDataJawaban] = useState([]);
  const [tipeFilter, setTipeFilter] = useState("");

  useEffect(() => {
    console.log("Pertanyaan :", pertanyaan);
    if (Array.isArray(pertanyaan) && pertanyaan.length > 0) {
      setSelectedQuestion("");
    }
  }, [pertanyaan]);

  const handleDataChange = (e) => {
    setSelectedQuestion(e.target.value);
    console.log("Terpilih :", selectedQuestion);
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
            console.log("Result nih:", result);
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

            console.log("Data Jawaban : ", initialFormData);
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
    setTipeFilter(formDataJawaban?.[1]?.tipeJawaban);

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
      console.log(
        "filter data: ",
        uniqueLabels.map((label) => ({ label, value: labelCount[label] }))
      );
    } else if (tipeFilter === "RadioButton") {
      console.log("Tipe");
    } else if (tipeFilter === "TextBox") {
      console.log("Tipe");
    } else {
      console.log("Tipe");
    }
  }, [formDataJawaban]);

  if (loading) return <Loading />;

  return (
    <div className="border rounded-3 shadow-sm p-3 mb-3">
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
                  key={item.idDetailJawabanSurvei}
                  value={item.idDetailJawabanSurvei}
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
          <PieChart
            judul={formDataJawaban?.[1]?.pertanyaanSurvei}
            sourceData={filterFormDataJawaban}
          />
        )}
      </div>
    </div>
  );
};

export default TabPreviewSurvei;
