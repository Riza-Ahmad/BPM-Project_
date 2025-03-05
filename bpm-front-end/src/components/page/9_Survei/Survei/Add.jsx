import React, { useState, useEffect, useRef } from "react";
import PageTitleNav from "../../../part/PageTitleNav";
import InputField from "../../../part/InputField";
import TextArea from "../../../part/TextArea";
import HeaderForm from "../../../part/HeaderText";
import Button from "../../../part/Button";
import Dropdown from "../../../part/Dropdown";
import CheckBox from "../../../part/CheckBox";
import Loading from "../../../part/Loading";
import { API_LINK } from "../../../util/Constants";
import SweetAlert from "../../../util/SweetAlert";
import { useIsMobile } from "../../../util/useIsMobile";
import { useFetch } from "../../../util/useFetch";
import { useNavigate } from "react-router-dom";

export default function Add({ onChangePage }) {
  const title = "Tambah Survei";
  const breadcrumbs = [
    { label: "Survei", href: "/survei" },
    { label: "Tambah Survei" },
  ];
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [templateOptions, setTemplateOptions] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [loadingTemplate, setLoadingTemplate] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedValues, setSelectedValues] = useState([]);
  const [dibuatOleh, setDibuatOleh] = useState("");
  const [submitData, setSubmitData] = useState(null);
  const [formData, setFormData] = useState({
    templateSurvei: "",
    tanggalAwal: "",
    tanggalAkhir: "",
    responden: [],
    kataPembuka: "",
    kataPenutup: "",
  });
  const templateSurveiRef = useRef();
  const tanggalAwalRef = useRef();
  const tanggalAkhirRef = useRef();
  const respondenRef = useRef();
  const kataPembukaRef = useRef();
  const kataPenutupRef = useRef();

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        setLoadingTemplate(true);
        const response = await fetch(
          `${API_LINK}/TransaksiSurvei/GetDataTemplateFinal`,
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
          Value: item.tsu_id,
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

  const handleCheckBoxChange = (e) => {
    const { name, value, type, checked } = e.target;

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

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => {
      const updatedData = {
        ...prevData,
        [name]: value,
      };

      return updatedData;
    });
  };

  const handleSubmit = async () => {
    if (!templateSurveiRef.current?.validate()) {
      templateSurveiRef.current?.focus();
      return;
    }
    if (!tanggalAwalRef.current?.validate()) {
      tanggalAwalRef.current?.focus();
      return;
    }
    if (!respondenRef.current?.validate()) {
      respondenRef.current?.focus();
      return;
    }
    if (!kataPembukaRef.current?.validate()) {
      kataPembukaRef.current?.focus();
      return;
    }
    if (!kataPenutupRef.current?.validate()) {
      kataPenutupRef.current?.focus();
      return;
    }

    const startDate = new Date(`${tanggalAwalRef.current.value}`);

    setLoading(true);
    try {
      const createResponse = await useFetch(
        `${API_LINK}/TransaksiSurvei/CreateTransaksiSurvei`,
        formData,
        "POST"
      );
      if (createResponse === "ERROR") {
        throw new Error("Gagal menambah data transaksi survei.");
      }

      SweetAlert("Berhasil!", "Survei berhasil dibuat.", "success", "OK").then(
        () => onChangePage("index")
      );
    } catch (error) {
      SweetAlert("Gagal!", error.message, "error", "OK");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

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

  if (loading) return <Loading />;
  if (error) return <p>{error}</p>;
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
                    ref={templateSurveiRef}
                    arrData={[
                      { value: "", Text: "-- Pilih Template Survei --" },
                      ...templateOptions,
                    ]}
                    label="Template Survei"
                    name="templateSurvei"
                    value={formData.templateSurvei}
                    onChange={handleChange}
                    isRequired={true}
                  />
                </div>
                <div className="col-lg-6 col-md-6">
                  <InputField
                    ref={tanggalAwalRef}
                    label="Tanggal Awal"
                    value={formData.tanggalAwal}
                    onChange={(e) =>
                      setFormData({ ...formData, tanggalAwal: e.target.value })
                    }
                    isRequired={true}
                    type="date"
                  />
                </div>
              </div>
              <CheckBox
                ref={respondenRef}
                arrData={[
                  { Value: "ROL09", Text: "Dosen" },
                  { Value: "ROL03", Text: "Tenaga Kependidikan" },
                  { Value: "ROLXX", Text: "Mitra Kerja sama" },
                ]}
                label="Pilih Responden"
                name="responden"
                isRequired={true}
                values={formData.responden || []}
                onChange={handleCheckBoxChange}
                errorMessage="Pilih setidaknya satu opsi sebelum melanjutkan."
              />
              <TextArea
                label="Kata Pembuka"
                ref={kataPembukaRef}
                value={formData.kataPembuka}
                onChange={(e) =>
                  setFormData({ ...formData, kataPembuka: e.target.value })
                }
                isRequired={true}
              />
              <TextArea
                label="Kata Penutup"
                ref={kataPenutupRef}
                value={formData.kataPenutup}
                onChange={(e) =>
                  setFormData({ ...formData, kataPenutup: e.target.value })
                }
                isRequired={true}
              />
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
