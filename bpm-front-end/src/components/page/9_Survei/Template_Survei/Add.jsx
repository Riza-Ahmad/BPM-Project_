import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import PageTitleNav from "../../../part/PageTitleNav";
import HeaderForm from "../../../part/HeaderText";
import Button from "../../../part/Button";
import Dropdown from "../../../part/Dropdown";
import InputField from "../../../part/InputField";
import SweetAlert from "../../../util/SweetAlert";
import { useIsMobile } from "../../../util/useIsMobile";
import { API_LINK } from "../../../util/Constants";
import { useFetch } from "../../../util/useFetch";

export default function AddTemplateSurvei() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const [formData, setFormData] = useState({
    namaTemplate: "",
    ksrId: "",
    skpId: "",
  });

  const [ksrOptions, setKsrOptions] = useState([]);
  const [skpOptions, setSkpOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    const isNamaTemplateValid = namaTemplateRef.current?.validate();

    if (!isNamaTemplateValid) {
      SweetAlert(
        "Error",
        "Harap lengkapi semua field yang diperlukan.",
        "error",
        "OK"
      );
      if (!isNamaTemplateValid) namaTemplateRef.current?.focus();
      return;
    }

    try {
      const payload = {
        p1: formData.namaTemplate,
      };

      // Mengirimkan request untuk membuat template survei
      const response = await useFetch(
        `${API_LINK}/TemplateSurvei/CreateTemplateSurvei`,
        payload,
        "POST"
      );

      // Pastikan response berisi templateId yang baru dibuat
      if (response === "ERROR") {
        throw new Error("Gagal menambah template survei.");
      }

      const { templateId } = response;

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
              }
            >
              <HeaderForm label="Formulir Template Survei" />
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
              {/* <Dropdown
                ref={ksrDropdownRef}
                label="Kriteria Survei"
                arrData={ksrOptions}
                value={formData.ksrId}
                onChange={handleChange}
                forInput="ksrId"
                isRequired={true}
                type="pilih"
              />
              <Dropdown
                ref={skpDropdownRef}
                label="Skala Penilaian"
                arrData={skpOptions}
                value={formData.skpId}
                onChange={handleChange}
                forInput="skpId"
                isRequired={true}
                type="pilih"
              /> */}
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
