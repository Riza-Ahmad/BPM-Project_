import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import PageTitleNav from "../../../part/PageTitleNav";
import HeaderForm from "../../../part/HeaderText";
import Button from "../../../part/Button";
import CheckBox from "../../../part/CheckBox";
import InputField from "../../../part/InputField";
import SweetAlert from "../../../util/SweetAlert";
import { useFetch } from "../../../util/useFetch";
import { API_LINK } from "../../../util/Constants";
import { useIsMobile } from "../../../util/useIsMobile";

export default function AddTemplateSurvei() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    namaTemplate: "",
    responden: [],
  });

  const namaTemplateRef = useRef();
  const respondenRef = useRef();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    console.log(value);
    if (type === "checkbox") {
      setFormData((prev) => {
        const updatedResponden = checked
          ? [...prev.responden, value]
          : prev.responden.filter((item) => item !== value);
        return { ...prev, responden: updatedResponden };
      });
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    if (!formData.namaTemplate.trim()) {
      SweetAlert("Error", "Harap lengkapi nama template.", "error", "OK");
      namaTemplateRef.current?.focus();
      return;
    }

    if (formData.responden.length === 0) {
      SweetAlert(
        "Error",
        "Harap pilih setidaknya satu responden.",
        "error",
        "OK"
      );
      respondenRef.current?.focus();
      return;
    }

    try {
      // Payload untuk dikirim ke API
      const payload = {
        namaTemplate: formData.namaTemplate,
        responden: formData.responden,
      };

      const response = await useFetch(
        `${API_LINK}/TemplateSurvei/CreateTemplateSurvei`,
        payload,
        "POST"
      );

      if (response === "ERROR")
        throw new Error("Gagal menambah template survei.");

      SweetAlert(
        "Berhasil!",
        "Template survei berhasil ditambahkan.",
        "success",
        "OK"
      ).then(() => {
        navigate("/survei/template");
      });
    } catch (error) {
      SweetAlert("Gagal!", error.message, "error", "OK");
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <main className="flex-grow-1 p-3" style={{ marginTop: "80px" }}>
        <div className="d-flex flex-column">
          <div className="p-3">
            <PageTitleNav
              title="Tambah Template Survei"
              breadcrumbs={[
                { label: "Template Survei", href: "/survei/template" },
                { label: "Tambah Template Survei" },
              ]}
              onClick={() => navigate("/survei/template")}
            />
          </div>
          <div className={isMobile ? "m-0" : "m-3"}>
            <div
              className={
                isMobile
                  ? "shadow p-4 m-2 bg-white rounded"
                  : "shadow p-5 m-5 bg-white rounded"
              }
            >
              <HeaderForm label="Formulir Template Survei" />
              {/* InputField untuk Nama Template */}
              <InputField
                ref={namaTemplateRef}
                label="Nama Template"
                value={formData.namaTemplate}
                onChange={handleChange}
                isRequired={true}
                name="namaTemplate"
                type="text"
                maxChar="100"
              />
              <div className="mb-3">
                <CheckBox
                  ref={respondenRef}
                  arrData={[
                    { Value: 0, Text: "Dosen dan Instruktur" },
                    { Value: 1, Text: "Tenaga Pendidik" },
                    { Value: 2, Text: "Mitra Kerjasama" },
                  ]}
                  label="Responden"
                  name="responden"
                  isRequired={true}
                  values={formData.responden || []}
                  onChange={handleChange}
                  col="col-4"
                />
              </div>
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
                    onClick={() => navigate("/survei/template")}
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
