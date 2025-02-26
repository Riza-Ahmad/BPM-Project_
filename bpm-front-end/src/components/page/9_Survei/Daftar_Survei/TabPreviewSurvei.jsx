import React, { useEffect, useState, useRef } from "react";
import "moment/locale/id";
import HeaderText from "../../../part/HeaderText.jsx";
import { useIsMobile } from "../../../util/useIsMobile.js";
import { decodeHtml } from "../../../util/DecodeHtml.js";
import TextArea from "../../../part/TextArea.jsx";
import RadioButton from "../../../part/RadioButton.jsx";
import FileUpload from "../../../part/FileUploadMulti.jsx";
import DetailData from "../../../part/DetailData.jsx";
import CheckBox from "../../../part/CheckBoxTable.jsx";
import InputArea from "../../../part/InputArea";
import InputField from "../../../part/InputField";

const generateArrData = (pertanyaan = []) => {
  if (!Array.isArray(pertanyaan)) {
    return [];
  }

  return pertanyaan.map((item) => ({
    idPertanyaan: item.idDetailJawabanSurvei,
    skalaTipe: item.skalaTipe,
    jawaban: item.jawabanSurvei,
    arrData: item.skalaDeskripsi.split(",").map((text) => ({
      Value: text.trim(),
      Text: text.trim(),
    })),
  }));
};

const TabPreviewSurvei = ({
  header,
  pertanyaan,
  onDataChange,
  mode = "editSurvei",
  isDraftandAuditor = false,
}) => {
  const [expandedIndexes, setExpandedIndexes] = useState([]); // Mengubah state menjadi array
  const isMobile = useIsMobile();
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
        acc[item.idDetailJawabanSurvei] = {
          jawaban: decodeHtml(item.jawabanSurvei) || "",
          komen: item.komenSurvei || "",
        };
        return acc;
      }, {});

      setFormData(initialFormData);
      setIsInitialized(true);
      onDataChange(initialFormData);
    }
  }, [pertanyaan, isInitialized, onDataChange]);

  const handleInputChange = (id, field, value) => {
    const updatedFormData = {
      ...formData,
      [id]: { ...formData[id], [field]: value },
    };
    setFormData(updatedFormData);
    onDataChange(updatedFormData);
  };

  // const handleChange = (e, id, field) => {
  //   const { value, checked, valueNow } = e.target;
  //   // Jika value adalah array, ambil elemen pertamanya sebagai string
  //   console.log("Checked awal: ", checked);
  //   setFormData((prev) => {
  //     const prevData = prev[id]?.[field] || []; // Ambil data sebelumnya atau array kosong
  //     let updatedResponden;
  //     setTimeout(() => console.log("PrevData awal: ", prevData), 0);
  //     setTimeout(() => console.log("Value awal: ", value), 0);

  //     if (checked) {
  //       updatedResponden = [value]; // Tambahkan value jika dicentang
  //     } else {
  //       updatedResponden = prevData.filter(
  //         (item) => String(item) !== String(valueNow)
  //       );
  //     }
  //     setTimeout(() => console.log("hasilnya : ", updatedResponden), 0);

  //     return {
  //       ...prev,
  //       [id]: {
  //         ...prev[id],
  //         [field]: Array.from(new Set(updatedResponden.flat())), // Hapus duplikat & pastikan array tetap satu dimensi
  //       },
  //     };
  //   });
  //   console.log(formData);
  // };

  const handleChange = (e, id, field) => {
    const { value, checked, valueNow } = e.target;
    setFormData((prev) => {
      let updatedResponden;
      updatedResponden = value;

      return {
        ...prev,
        [id]: {
          [field]: updatedResponden, // Hapus duplikat & pastikan array tetap satu dimensi
        },
      };
    });

    onDataChange((prev) => {
      let updatedResponden;
      updatedResponden = value;

      return {
        ...prev,
        [id]: {
          [field]: updatedResponden, // Hapus duplikat & pastikan array tetap satu dimensi
        },
      };
    });
  };

  const handleExpandToggle = (index) => {
    setExpandedIndexes((prevIndexes) => {
      if (prevIndexes.includes(index)) {
        return prevIndexes.filter((i) => i !== index); // Tutup jika sudah dibuka
      }
      return [...prevIndexes, index]; // Tambahkan jika belum dibuka
    });
  };

  const arrDataList = generateArrData(pertanyaan);
  const CheckBoxRef = useRef();

  //console.log("arrDataList :", arrDataList);

  const renderContent = (arrData) => {
    if (arrData.skalaTipe === "RadioButton") {
      return (
        <RadioButton
          id="jawaban"
          label="Pilih salah satu yang sesuai!"
          arrData={arrData.arrData}
          name={`jawaban-${arrData.idPertanyaan}`}
          value={formData[arrData.idPertanyaan]?.jawaban || ""}
          onChange={(e) =>
            handleInputChange(arrData.idPertanyaan, "jawaban", e.target.value)
          }
          isRequired={true}
          col="col-12"
        />
      );
    } else if (arrData.skalaTipe === "TextBox") {
      return (
        <InputArea
          label="Tuliskan pendapatmu di sini!"
          initialValue={formData.jawaban}
          name={`jawaban-${arrData.idPertanyaan}`}
          value={formData[arrData.idPertanyaan]?.jawaban || ""}
          onChange={(e) =>
            handleInputChange(arrData.idPertanyaan, "jawaban", e.target.value)
          }
          isRequired={true}
          col="col-12"
        />
      );
    } else if (arrData.skalaTipe === "CheckBox") {
      return (
        <CheckBox
          ref={CheckBoxRef}
          label="Jawaban boleh lebih dari satu!"
          arrData={arrData.arrData}
          name={`jawaban-${arrData.idPertanyaan}`}
          values={formData[arrData.idPertanyaan]?.jawaban || []}
          onChange={(e) => {
            handleChange(e, arrData.idPertanyaan, "jawaban");
          }}
          isRequired={true}
        />
      );
    } else {
      return (
        <InputField
          label="Isi jawabanmu di sini, ya!"
          initialValue={formData.jawaban}
          name={`jawaban-${arrData.idPertanyaan}`}
          value={formData[arrData.idPertanyaan]?.jawaban || ""}
          onChange={(e) =>
            handleInputChange(arrData.idPertanyaan, "jawaban", e.target.value)
          }
          isRequired={true}
          col="col-12"
        />
      );
    }
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
                      (item) => item.kriteriaSurvei === kriteria.namaKriteria
                    )
                    .map((item, index) => (
                      <tr key={item.idDetailJawabanSurvei}>
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
                              __html: decodeHtml(item.pertanyaanSurvei),
                            }}
                          ></div>

                          {/* {item.pertanyaanLanjutan && (
                            <>
                              <p>Dokumen Pendukung:</p>
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: decodeHtml(item.pertanyaanLanjutan),
                                }}
                              ></div>
                            </>
                          )} */}
                        </td>
                        <td
                          style={{
                            border: "1px solid #ddd",
                            padding: "8px",
                          }}
                        >
                          {mode === "editSurvei" && (
                            <>
                              <div style={{ marginBottom: "10px" }}>
                                {renderContent(
                                  arrDataList.find(
                                    (arr) =>
                                      arr.idPertanyaan ===
                                      item.idDetailJawabanSurvei
                                  )
                                )}
                              </div>
                            </>
                          )}

                          {mode === "detailSurvei" && (
                            <>
                              <div style={{ marginBottom: "10px" }}>
                                {renderContent(
                                  arrDataList.find(
                                    (arr) =>
                                      arr.idPertanyaan ===
                                      item.idDetailJawabanSurvei
                                  )
                                )}
                              </div>
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

export default TabPreviewSurvei;
