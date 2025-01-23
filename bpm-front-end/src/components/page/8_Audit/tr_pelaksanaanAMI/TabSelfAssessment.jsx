import React, { useEffect, useState } from "react";
import "moment/locale/id";
import HeaderText from "../../../part/HeaderText.jsx";
import { useIsMobile } from "../../../util/useIsMobile.js";
import { decodeHtml } from "../../../util/DecodeHtml.js";
import TextArea from "../../../part/TextArea.jsx";
import RadioButton from "../../../part/RadioButton.jsx";
import FileUpload from "../../../part/FileUploadMulti.jsx";
import DetailData from "../../../part/DetailData.jsx";

const arrJawaban = [
  { Value: "Ya", Text: "Ya" },
  { Value: "Tidak", Text: "Tidak" },
];

const TabSelfAssessment = ({
  header,
  pertanyaan,
  onDataChange,
  mode = "editSA",
  isDraftandAuditor = false,
}) => {
  const [expandedIndexes, setExpandedIndexes] = useState([]); // Mengubah state menjadi array
  const isMobile = useIsMobile();
  const [files, setFiles] = useState({});
  const styleHeader = {
    backgroundColor: "#2654A1",
    color: "#fff",
    textAlign: "center",
  };

  const [formData, setFormData] = useState({});

  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!isInitialized && pertanyaan.length > 0) {
      const initialFormData = pertanyaan.reduce((acc, item) => {
        acc[item.idPertanyaanSA] = {
          jawaban: item.jawaban || "Ya",
          jawabanLanjutan: decodeHtml(item.jawabanLanjutan) || "",
          dokumenBerkas: item.berkasDokumen ? [item.berkasDokumen] : [],
        };
        return acc;
      }, {});

      const initialFiles = pertanyaan.reduce((acc, item) => {
        if (item.berkasDokumen) {
          const berkasArray = item.berkasDokumen
            .split(",")
            .map((file) => file.replace(/"/g, "").trim());

          if (!acc[item.idPertanyaanSA]) {
            acc[item.idPertanyaanSA] = [];
          }

          acc[item.idPertanyaanSA] =
            acc[item.idPertanyaanSA].concat(berkasArray);
        }
        return acc;
      }, {});

      setFormData(initialFormData);
      setFiles(initialFiles);
      setIsInitialized(true);
      onDataChange(initialFormData, initialFiles);
    }
  }, [pertanyaan, isInitialized, onDataChange]);

  const handleInputChange = (id, field, value) => {
    const updatedFormData = {
      ...formData,
      [id]: { ...formData[id], [field]: value },
    };
    setFormData(updatedFormData);
    onDataChange(updatedFormData, files);
  };

  const handleFileChange = (idPertanyaan, file) => {
    const updatedFiles = {
      ...files,
      [idPertanyaan]: file,
    };
    setFiles(updatedFiles);
    onDataChange(formData, updatedFiles);
  };

  const handleExpandToggle = (index) => {
    setExpandedIndexes((prevIndexes) => {
      if (prevIndexes.includes(index)) {
        return prevIndexes.filter((i) => i !== index); // Tutup jika sudah dibuka
      }
      return [...prevIndexes, index]; // Tambahkan jika belum dibuka
    });
  };

  return (
    <div>
      {header.map((kriteria, index) => (
        <div className="border rounded-5 shadow-sm m-0 mb-3 mt-3" key={index}>
          <div
            className={
              isMobile
                ? "card p-1 ps-4 text-gray d-flex justify-content-between align-items-left"
                : "card p-2 ps-4 text-gray d-flex justify-content-between align-items-left"
            }
            onClick={() => handleExpandToggle(index)}
            style={{ cursor: "pointer" }}
          >
            <div className="d-flex align-items-center">
              <HeaderText
                label={kriteria.namaKriteria}
                warna="#2654A1"
                marginBottom="0"
                marginTop="0"
                ukuran={isMobile ? "1rem" : "1.2rem"}
                alignText="left"
              />
              <i
                className={`fi ${
                  expandedIndexes.includes(index)
                    ? "fi-br-angle-small-up"
                    : "fi-br-angle-small-down"
                } ms-auto`}
                style={{ fontSize: "1.5rem", marginRight: "1rem" }}
              ></i>
            </div>
          </div>
          {expandedIndexes.includes(index) && (
            <div className="table-responsive m-3">
              <table
                className="table table-hover table-striped table-bordered"
                style={{ borderCollapse: "collapse", minWidth: "800px" }}
              >
                <thead>
                  <tr>
                    <th style={styleHeader}>No</th>
                    <th style={styleHeader}>Pertanyaan</th>
                    <th style={styleHeader}>Jawaban</th>
                  </tr>
                </thead>
                <tbody>
                  {pertanyaan
                    .filter(
                      (item) => item.namaKriteria === kriteria.namaKriteria
                    )
                    .map((item, index) => (
                      <tr key={item.idPertanyaanSA}>
                        <td
                          style={{
                            border: "1px solid #ddd",
                            padding: "8px",
                            width: "2rem",
                          }}
                        >
                          {index + 1}
                        </td>
                        <td
                          style={{
                            border: "1px solid #ddd",
                            padding: "8px",
                            maxWidth: "28rem",
                          }}
                        >
                          <div
                            dangerouslySetInnerHTML={{
                              __html: decodeHtml(item.pertanyaan),
                            }}
                          ></div>

                          {item.pertanyaanLanjutan && (
                            <>
                              <p>Dokumen Pendukung:</p>
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: decodeHtml(item.pertanyaanLanjutan),
                                }}
                              ></div>
                            </>
                          )}

                          {isDraftandAuditor === false && (
                            <>
                              {" "}
                              {mode === "editSA" && (
                                <>
                                  <div>
                                    <TextArea
                                      label="Jawaban"
                                      value={
                                        formData[item.idPertanyaanSA]
                                          ?.jawabanLanjutan || ""
                                      }
                                      onChange={(e) =>
                                        handleInputChange(
                                          item.idPertanyaanSA,
                                          "jawabanLanjutan",
                                          e.target.value
                                        )
                                      }
                                      isRequired={true}
                                    />
                                  </div>
                                </>
                              )}
                              {mode === "detailSA" && (
                                <>
                                  <DetailData
                                    label="Jawaban"
                                    isi={
                                      formData[item.idPertanyaanSA]
                                        ?.jawabanLanjutan
                                    }
                                    colorIsi="text-black mb-4"
                                  />
                                </>
                              )}
                              {item.isbutuhdokumen === "Ya" ? (
                                <FileUpload
                                  label="Berkas Pendukung"
                                  forInput="upload-file"
                                  formatFile=".pdf, .docx, .xlsx, .zip"
                                  initialFiles={
                                    files[item.idPertanyaanSA]
                                      ? [files[item.idPertanyaanSA]]
                                      : []
                                  }
                                  onChange={(newFiles) =>
                                    handleFileChange(
                                      item.idPertanyaanSA,
                                      newFiles
                                    )
                                  }
                                  isRequired="true"
                                  mode={mode === "editSA" ? "aktif" : "tidak"}
                                />
                              ) : (
                                "-"
                              )}
                            </>
                          )}
                        </td>
                        <td
                          style={{
                            border: "1px solid #ddd",
                            padding: "8px",
                          }}
                        >
                          {mode === "editSA" && (
                            <>
                              <div style={{ marginBottom: "10px" }}>
                                <RadioButton
                                  label="Jawaban"
                                  name={`options-${item.idPertanyaanSA}`}
                                  arrData={arrJawaban}
                                  value={
                                    formData[item.idPertanyaanSA]?.jawaban || ""
                                  }
                                  onChange={(e) =>
                                    handleInputChange(
                                      item.idPertanyaanSA,
                                      "jawaban",
                                      e.target.value
                                    )
                                  }
                                  isRequired={true}
                                />
                              </div>
                            </>
                          )}

                          {mode === "detailSA" && (
                            <>
                              <DetailData
                                label="Jawaban"
                                isi={
                                  formData[item.idPertanyaanSA]?.jawaban || ""
                                }
                                colorIsi="text-black mb-4"
                              />
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default TabSelfAssessment;
