import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import PageTitleNav from "../../../part/PageTitleNav";
import HeaderForm from "../../../part/HeaderText";
import Button from "../../../part/Button";
import Dropdown from "../../../part/Dropdown";
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
    ksrId: "",
    skpId: "",
    responden: [],
  });

  const namaTemplateRef = useRef();

  const fetchKriteria = async () => {
    setLoading(true);
    setError(null);

    try {
      const pageSize = 10; // Customize this according to your needs
      const pageNumber = 1; // Customize this according to your needs

      const result = await useFetch(
        `${API_LINK}/MasterKriteriaSurvei/GetDataKriteriaSurvei`,
        {
          p1: "Aktif",
          p2: "",
          p3: "namaKri ASC",
          p4: pageSize,
          p5: pageNumber,
        },
        "POST"
      );

      if (result === "ERROR" || !result || result.length === 0) {
        setKsrOptions([]);
      } else {
        setKsrOptions(
          result.map((item) => ({
            value: item.idKri,
            Text: item.namaKri,
          }))
        );
      }
    } catch (err) {
      setError("Gagal mengambil data: " + err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSkalaPenilaian = async () => {
    setLoading(true);
    setError(null);

    try {
      const skpResponse = await useFetch(
        `${API_LINK}/SkalaPenilaian/GetSkalaPenilaian`,
        {},
        "POST"
      );

      if (skpResponse && Array.isArray(skpResponse)) {
        setSkpOptions(
          skpResponse.map((item) => ({
            value: item.skp_id,
            Text: item.skp_skala + " (" + item.skp_deskripsi + ")",
          }))
        );
      }
    } catch (error) {
      setError("Gagal mengambil data Skala Penilaian: " + error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKriteria();
    fetchSkalaPenilaian();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    console.log("Checkbox Change:", name, value, checked);
    console.log("Responden Saat Ini:", formData.responden);

    if (type === "checkbox") {
      setFormData((prevFormData) => {
        const updatedResponden = prevFormData.responden || [];
        const newResponden = checked
          ? [...updatedResponden, value] // Tambahkan jika di-check
          : updatedResponden.filter((item) => item !== value); // Hapus jika di-uncheck

        return { ...prevFormData, responden: newResponden };
      });
    } else {
      setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
    }
  };

  const respondenRef = useRef();

  const handleSubmit = async () => {
    // Validasi nama template
    const isNamaTemplateValid = namaTemplateRef.current?.validate();
    // Validasi CheckBox (pastikan minimal satu responden dipilih)
    // const isRespondenValid = formData.respondenTemplate.length > 0;

    if (!isNamaTemplateValid) {
      SweetAlert("Error", "Harap lengkapi nama template.", "error", "OK");
      namaTemplateRef.current?.focus();
      return;
    }

    // Validasi responden, pastikan ada setidaknya satu pilihan
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

    // Jika semuanya valid, lanjutkan ke pengiriman data
    try {
      // Payload untuk dikirim ke API
      const payload = {
        p1: formData.namaTemplate,
        p2: formData.responden || [], // Jika responden kosong, kirimkan array kosong
      };

      // Mengirimkan request untuk membuat template survei
      const response = await useFetch(
        `${API_LINK}/TemplateSurvei/CreateTemplateSurvei`,
        payload,
        "POST"
      );

      if (response === "ERROR") {
        throw new Error("Gagal menambah template survei.");
      }

      // Jika berhasil, tampilkan pesan sukses
      SweetAlert(
        "Berhasil!",
        "Template survei berhasil ditambahkan.",
        "success",
        "OK"
      ).then(() => {
        navigate("/survei/template");
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
              <div className="mb-3">
                <CheckBox
                  ref={respondenRef}
                  arrData={[
                    {
                      Value: 0,
                      Text: "Dosen dan Instruktur",
                    },
                    { Value: 1, Text: "Tenaga Pendidik" },
                    { Value: 2, Text: "Mitra Kerjasama" },
                  ]}
                  label="Responden"
                  name="responden"
                  isRequired={true}
                  errorMessage="Harap pilih setidaknya satu responden."
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
