import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import PageTitleNav from "../../../part/PageTitleNav";
import HeaderForm from "../../../part/HeaderText";
import Button from "../../../part/Button";
import CheckBox from "../../../part/CheckBox";
import InputField from "../../../part/InputField";
import SweetAlert from "../../../util/SweetAlert";
import { useIsMobile } from "../../../util/useIsMobile";

export default function AddTemplateSurvei() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [formData, setFormData] = useState({
    namaTemplate: "",
    respondenTemplate: [], 
  });

  const namaTemplateRef = useRef();

  // Data statis untuk CheckBox
  const respondenOptions = [
    { Value: "Dosen dan Instruktur", Text: "Dosen dan Instruktur" },
    { Value: "Tenaga Pendidik", Text: "Tenaga Pendidik" },
    { Value: "Mitra Kerjasama", Text: "Mitra Kerjasama" },
  ];

  // Fungsi untuk menangani perubahan pada InputField dan CheckBox
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      // Handle perubahan pada CheckBox
      setFormData((prev) => {
        const newValues = checked
          ? [...prev.respondenTemplate, value] // Tambah nilai jika dicentang
          : prev.respondenTemplate.filter((val) => val !== value); // Hapus nilai jika tidak dicentang

        return { ...prev, respondenTemplate: newValues };
      });
    } else {
      // Handle perubahan pada InputField
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle submit form
  const handleSubmit = async () => {
    // Validasi InputField
    const isNamaTemplateValid = namaTemplateRef.current?.validate();
    // Validasi CheckBox (pastikan minimal satu responden dipilih)
    const isRespondenValid = formData.respondenTemplate.length > 0;

    if (!isNamaTemplateValid) {
      SweetAlert("Error", "Nama template harus diisi.", "error", "OK");
      namaTemplateRef.current?.focus(); // Fokus ke InputField jika tidak valid
      return;
    }

    if (!isRespondenValid) {
      SweetAlert("Error", "Pilih minimal satu responden.", "error", "OK");
      return;
    }

    try {
      // Payload untuk dikirim ke API
      const payload = {
        namaTemplate: formData.namaTemplate,
        respondenTemplate: formData.respondenTemplate, // Kirim data responden
      };

      // Contoh: Mengirimkan request untuk membuat template survei
      console.log("Payload yang dikirim:", payload);

      SweetAlert(
        "Berhasil!",
        "Template survei berhasil ditambahkan.",
        "success",
        "OK"
      ).then(() => {
        navigate("/survei/template"); // Pindah ke halaman daftar template survei
      });
    } catch (error) {
      console.error("Error submitting template survei:", error);
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
                  ? "shadow p-4 m-2 mt-0 bg-white rounded"
                  : "shadow p-5 m-5 mt-0 bg-white rounded"
              }>
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
              {/* CheckBox untuk Responden */}
              <CheckBox
                arrData={respondenOptions} // Data statis untuk CheckBox
                label="Responden"
                name="responden"
                isRequired={true}
                values={formData.respondenTemplate} // Nilai yang dipilih
                onChange={handleChange} // Handle perubahan
                col="col-4"
              />
              {/* Tombol Simpan dan Batal */}
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
