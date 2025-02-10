import React, { useState, useEffect } from "react";
import PageTitleNav from "../../../part/PageTitleNav";
import InputField from "../../../part/InputField";
import TextArea from "../../../part/TextArea";
import HeaderForm from "../../../part/HeaderText";
import Button from "../../../part/Button";
import Dropdown from "../../../part/Dropdown";
import CheckBox from "../../../part/CheckBox";
import { API_LINK } from "../../../util/Constants";
import SweetAlert from "../../../util/SweetAlert";
import { useIsMobile } from "../../../util/useIsMobile";
import { useFetch } from "../../../util/useFetch"; // Pastikan hook ini tersedia
import { useNavigate } from "react-router-dom";

export default function Add({ onChangePage }) {
  const title = "Tambah Survei";
  const breadcrumbs = [
    { label: "Survei", href: "/survei" },
    { label: "Tambah Survei" },
  ];
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  // State untuk template survei
  const [templateOptions, setTemplateOptions] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(""); // p1: tsu_id
  const [loadingTemplate, setLoadingTemplate] = useState(true);

  // State untuk checkbox (responden)
  const [selectedValues, setSelectedValues] = useState([]);

  // State untuk field "Dibuat Oleh" (p3: trs_created_by)
  const [dibuatOleh, setDibuatOleh] = useState("");

  // State untuk memicu pemanggilan API (submit data)
  const [submitData, setSubmitData] = useState(null);

  // Ambil data template survei
  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        setLoadingTemplate(true);
        const response = await fetch(
          `${API_LINK}/TemplateSurvei/GetTemplateSurvei`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({}),
          }
        );
        if (!response.ok) {
          throw new Error("Gagal mengambil data template survei.");
        }
        const data = await response.json();
        const formattedTemplate = data.map((item) => ({
          value: item.tsu_id,
          Text: item.tsu_nama,
        }));
        setTemplateOptions(formattedTemplate);
      } catch (error) {
        SweetAlert("Error", error.message, "error");
      } finally {
        setLoadingTemplate(false);
      }
    };
    fetchTemplate();
  }, []);

  // === Pilih salah satu opsi handler checkbox berikut ===

  // Opsi 1: Jika CheckBox mengirim 2 parameter: value dan isChecked
  const handleCheckBoxChange = (value, isChecked) => {
    setSelectedValues((prevValues) => {
      if (isChecked) {
        return [...prevValues, value];
      } else {
        return prevValues.filter((item) => item !== value);
      }
    });
  };

  /* 
  // Opsi 2: Jika CheckBox mengirim event object (gunakan jika diperlukan)
  const handleCheckBoxChange = (e) => {
    const { value, checked } = e.target;
    setSelectedValues((prevValues) => {
      if (checked) {
        return [...prevValues, value];
      } else {
        return prevValues.filter((item) => item !== value);
      }
    });
  };
  */

  // Logika handleSubmit untuk transaksi survei
  const handleSubmit = async () => {
    // Validasi bahwa Template Survei telah dipilih
    if (!selectedTemplate) {
      SweetAlert("Error", "Harap pilih Template Survei.", "error");
      return;
    }
    // Validasi bahwa setidaknya satu checkbox responden telah dipilih
    if (selectedValues.length === 0) {
      SweetAlert("Error", "Harap pilih minimal satu responden.", "error");
      return;
    }
    // Validasi bahwa field "Dibuat Oleh" telah diisi
    if (!dibuatOleh.trim()) {
      SweetAlert("Error", "Harap isi field 'Dibuat Oleh'.", "error");
      return;
    }

    // p2: gabungan nilai dari checkbox responden
    const respondenString = selectedValues.join(", ");

    // Persiapkan payload untuk stored procedure:
    // p1: selectedTemplate (tsu_id), p2: respondenString (trs_responden_username),
    // p3: dibuatOleh (trs_created_by)
    setSubmitData({
      p1: selectedTemplate,
      p2: respondenString,
      p3: dibuatOleh,
      // p4 - p50 tidak digunakan
    });
  };

  // useEffect untuk memanggil API CreateTransaksiSurvei saat submitData terisi
  useEffect(() => {
    const submitSurvey = async () => {
      if (submitData) {
        try {
          const createResponse = await useFetch(
            `${API_LINK}/TransaksiSurvei/CreateTransaksiSurvei`,
            submitData,
            "POST"
          );
          if (createResponse === "ERROR") {
            throw new Error("Gagal menambah data transaksi survei.");
          }
          SweetAlert(
            "Berhasil!",
            "Data survei berhasil ditambahkan.",
            "success",
            "OK"
          );
          onChangePage("index");
        } catch (error) {
          console.error("Error:", error.message);
          SweetAlert("Gagal!", error.message, "error", "OK");
        } finally {
          setSubmitData(null);
        }
      }
    };
    submitSurvey();
  }, [submitData, onChangePage]);

  return (
    <div className="d-flex flex-column min-vh-100">
      <main className="flex-grow-1 p-3" style={{ marginTop: "80px" }}>
        <div className="d-flex flex-column">
          <PageTitleNav
            title={title}
            breadcrumbs={breadcrumbs}
            onClick={() => onChangePage("index")}
          />
          <div className={isMobile ? "m-0" : "m-3"}>
            <div
              className={
                isMobile
                  ? "shadow p-4 m-2 mt-0 bg-white rounded"
                  : "shadow p-5 m-5 mt-0 bg-white rounded"
              }
            >
              <HeaderForm label="Formulir Survei" />
              <div className="row">
                <div className="col-lg-6 col-md-6">
                  <Dropdown
                    arrData={[
                      { value: "", Text: "-- Pilih Template Survei --" },
                      ...templateOptions,
                    ]}
                    label="Template Survei"
                    value={selectedTemplate}
                    onChange={(e) => setSelectedTemplate(e.target.value)}
                    isRequired={true}
                  />
                </div>
                <div className="col-lg-6 col-md-6">
                  {/* Input Tanggal Awal */}
                  <InputField
                    label="Tanggal Awal"
                    isRequired={true}
                    placeHolder="Masukkan Tanggal Awal Survei"
                    type="date"
                  />
                  {/* Input Tanggal Akhir */}
                  <InputField
                    label="Tanggal Akhir"
                    isRequired={true}
                    placeHolder="Masukkan Tanggal Akhir Survei"
                    type="date"
                  />
                </div>
              </div>
              <CheckBox
                arrData={[
                  { Value: "Dosen", Text: "Dosen" },
                  { Value: "Tenaga Pendidik", Text: "Tenaga Pendidik" },
                  { Value: "Mitra Kerjasama", Text: "Mitra Kerjasama" },
                ]}
                label="Pilih Responden"
                name="exampleCheckBox"
                isRequired={true}
                values={selectedValues}
                onChange={handleCheckBoxChange}
                errorMessage="Pilih setidaknya satu opsi sebelum melanjutkan."
              />
              <TextArea label="Kata Pembuka" />
              <TextArea label="Kata Penutup" />
              <div className="d-flex justify-content-between align-items-center">
                <div className="flex-grow-1 m-2">
                  <Button
                    classType="primary"
                    type="button"
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
