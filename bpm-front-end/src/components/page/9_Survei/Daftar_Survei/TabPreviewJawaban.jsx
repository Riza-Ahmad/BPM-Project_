import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const TabPreviewSurvei = ({ pertanyaan = [] }) => {
  const [selectedQuestion, setSelectedQuestion] = useState("");

  useEffect(() => {
    console.log("Pertanyaan :", pertanyaan);
    if (Array.isArray(pertanyaan) && pertanyaan.length > 0) {
      setSelectedQuestion("");
    }
  }, [pertanyaan]);

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
            onChange={(e) => setSelectedQuestion(e.target.value)}
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
      </div>
    </div>
  );
};

export default TabPreviewSurvei;
