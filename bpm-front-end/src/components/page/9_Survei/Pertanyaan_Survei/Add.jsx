import React, { useState, useRef, useEffect } from "react";
import PageTitleNav from "../../../part/PageTitleNav";
import TextField from "../../../part/TextField";
import HeaderForm from "../../../part/HeaderText";
import Button from "../../../part/Button";
import Dropdown from "../../../part/Dropdown";
import CheckBox from "../../../part/CheckBox";
import { useNavigate } from "react-router-dom";
import SweetAlert from "../../../util/SweetAlert";
import { API_LINK } from "../../../util/Constants";
import { useFetch } from "../../../util/useFetch";
import Loading from "../../../part/Loading";

export default function Add({ onChangePage }) {
  const navigate = useNavigate();
  const title = "Tambah Bank Pertanyaan Survei";
  const breadcrumbs = [
    { label: "Bank Pertanyaan Survei", href: "/survei/pertanyaan" },
    { label: "Tambah Bank Pertanyaan Survei", href: "/survei/pertanyaan/add" },
  ];

  const [formData, setFormData] = useState({
    pertanyaan: "",
    ksrId: "",
    skpId: "",
    responden: [],
  });

  const [ksrOptions, setKsrOptions] = useState([]);
  const [skpOptions, setSkpOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const pertanyaanRef = useRef();
  const kriteriaSurveiRef = useRef();
  const skalaPenilaianRef = useRef();
  const respondenRef = useRef();

  useEffect(() => {
    const fetchKriteria = async () => {
      setLoading(true);
      try {
        const data = await useFetch(
          `${API_LINK}/MasterKriteriaSurvei/GetAllKriteriaSurveiAktif`,
          {},
          "POST"
        );
        setKsrOptions(data);
      } catch (err) {
        setError("Gagal mengambil data: " + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchKriteria();
  }, []);

  useEffect(() => {
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
          const filteredSkp = skpResponse.filter(
            (item) => item.skp_status === "Aktif"
          );
          setSkpOptions(
            filteredSkp.map((item) => ({
              value: item.skp_id,
              Text: item.skp_skala + " (" + item.skp_deskripsi + ")",
            }))
          );
        }
      } catch (error) {
        setError("Gagal mengambil data Skala Penilaian: " + error.message);
      } finally {
        setLoading(false);
      }
    };
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

  const handleSubmit = async () => {
    // Validasi tiap field menggunakan ref
    const isPertanyaanValid = pertanyaanRef.current?.validate();
    const isKriteriaValid = kriteriaSurveiRef.current?.validate();
    const isSkalaValid = skalaPenilaianRef.current?.validate();

    // Validasi responden
    const isRespondenValid = formData.responden.length > 0;

    // Cek validasi untuk setiap input
    if (!isPertanyaanValid) {
      pertanyaanRef.current?.focus();
      return;
    }
    if (!isKriteriaValid) {
      kriteriaSurveiRef.current?.focus();
      return;
    }
    if (!isSkalaValid) {
      skalaPenilaianRef.current?.focus();
      return;
    }

    if (!isRespondenValid) {
      SweetAlert(
        "Gagal!",
        "Harap pilih setidaknya satu responden.",
        "error",
        "OK"
      );
      respondenRef.current?.focus();
      return;
    }

    // Jika semua validasi lulus, lanjutkan dengan pengiriman data
    try {
      const payload = {
        pertanyaan: formData.pertanyaan,
        ksrId: parseInt(formData.ksrId, 10),
        skpId: parseInt(formData.skpId, 10),
        responden: formData.responden || [],
      };

      console.log("Payload:", payload);

      const result = await useFetch(
        `${API_LINK}/MasterPertanyaan/CreatePertanyaan`,
        payload,
        "POST"
      );

      console.log("API Result:", result);

      if (result === "ERROR") {
        throw new Error("Terjadi kesalahan server");
      } else {
        SweetAlert("Berhasil!", "Pertanyaan berhasil dibuat", "success", "OK");
        navigate("/survei/pertanyaan");
      }
    } catch (error) {
      console.error("Submit Error:", error);
      SweetAlert(
        "Gagal!",
        error.message || "Terjadi kesalahan saat menyimpan",
        "error",
        "OK"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    SweetAlert(
      "Yakin?",
      "Perubahan belum disimpan, yakin batal?",
      "warning",
      "Ya, batalkan",
      "Tidak"
    ).then((result) => {
      if (result) navigate("/survei/pertanyaan");
    });
  };

  if (loading) return <Loading />;
  if (error) return <p className="text-danger text-center mt-4">{error}</p>;

  return (
    <div className="d-flex flex-column min-vh-100">
      <main className="flex-grow-1 p-3" style={{ marginTop: "80px" }}>
        <div className="d-flex flex-column">
          <div className="m-3">
            <PageTitleNav
              title={title}
              breadcrumbs={breadcrumbs}
              onClick={() => navigate("/survei/pertanyaan")}
            />
          </div>
          <div className="shadow p-5 m-5 mt-0 bg-white rounded">
            <HeaderForm label="Formulir Bank Pertanyaan" />
            <div className="mb-4">
              <Dropdown
                ref={kriteriaSurveiRef}
                label="Kriteria Survei"
                arrData={ksrOptions}
                value={formData.ksrId}
                onChange={handleChange}
                name="ksrId"
                isRequired={true}
                type="pilih"
              />
            </div>
            <div className="mb-4">
              <InputField
                ref={pertanyaanRef}
                label="Pertanyaan"
                value={formData.pertanyaan || ""}
                name="pertanyaan"
                onChange={handleChange}
                isRequired={true}
                type="text"
                placeholder="Masukkan pertanyaan survei"
              />
            </div>
            <div className="mb-4">
              <Dropdown
                ref={skalaPenilaianRef}
                label="Skala Penilaian"
                arrData={skpOptions}
                value={formData.skpId}
                onChange={handleChange}
                name="skpId"
                isRequired={true}
                type="pilih"
              />
            </div>
            <div className="mb-5">
              <CheckBox
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
            <div className="d-flex justify-content-between align-items-center mt-4 gap-3">
              <Button
                classType="primary"
                type="button"
                label="Simpan"
                width="100%"
                disabled={loading}
                onClick={handleSubmit}
              />
              <Button
                classType="danger"
                type="button"
                label="Batal"
                width="100%"
                onClick={handleCancel}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
