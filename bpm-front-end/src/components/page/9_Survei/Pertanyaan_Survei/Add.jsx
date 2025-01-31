import React, { useState, useRef, useEffect } from "react";
import PageTitleNav from "../../../part/PageTitleNav";
import InputField from "../../../part/InputField";
import HeaderForm from "../../../part/HeaderText";
import Button from "../../../part/Button";
import Dropdown from "../../../part/Dropdown";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import SweetAlert from "../../../util/SweetAlert";
import { API_LINK } from "../../../util/Constants";
import { useFetch } from "../../../util/useFetch";
import Loading from "../../../part/Loading";

export default function Add({ onChangePage }) {
  const navigate = useNavigate();
  const title = "Tambah Pertanyaan";
  const breadcrumbs = [
    { label: "Pertanyaan Survei", href: "/survei/pertanyaan" },
    { label: "Tambah Pertanyaan", href: "/survei/pertanyaan/add" },
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

  const fetchKriteria = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await useFetch(
        `${API_LINK}/MasterKriteriaSurvei/GetDataKriteriaSurvei`,
        {
          p1: "Aktif",
          p2: "",
          p3: "namaKri ASC",
          p4: 10,
          p5: 1,
        },
        "POST"
      );

      // Debugging: Cek struktur response
      console.log("API Response:", result);

      if (result === "ERROR" || !result?.length) {
        setKsrOptions([]);
        return;
      }

      // Konversi value ke number dan validasi
      setKsrOptions(
        result.map((item) => ({
          value: item.idKri,
          Text: item.namaKri,
        }))
      );

      // Debugging: Cek hasil konversi
      console.log("Ksr Options:", ksrOptions);
    } catch (err) {
      setError(`Gagal mengambil kriteria: ${err.message}`);
      setKsrOptions([]);
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
        // Filter hanya yang memiliki skp_status 'Aktif'
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
    // Validasi form ref
    const isPertanyaanValid = pertanyaanRef.current?.validate();
    const isKriteriaValid = kriteriaSurveiRef.current?.validate();
    const isSkalaValid = skalaPenilaianRef.current?.validate();

    // Focus ke field yang invalid
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

    try {
      // Konversi responden ke array jika belum
      const respondenArray = Array.isArray(formData.responden)
        ? formData.responden
        : [formData.responden];

      // Siapkan payload sesuai struktur backend
      const payload = {
        data: {
          pertanyaan: formData.pertanyaan,
          ksrId: parseInt(formData.ksrId, 10),
          skpId: parseInt(formData.skpId, 10),
          responden: Array.isArray(formData.responden)
            ? formData.responden
            : [formData.responden],
        },
      };

      // Log payload to ensure it's correct
      console.log("Payload:", payload);

      // Kirim ke API
      const result = await useFetch(
        `${API_LINK}/MasterPertanyaan/CreatePertanyaan`,
        payload
      );

      // Log the result to inspect it
      console.log("API Result:", result);

      // Pastikan result bukan null atau undefined
      if (!result || result === "ERROR") {
        throw new Error("Gagal menyimpan pertanyaan");
      }

      // Handle response
      if (result.status === "success") {
        SweetAlert(
          "Berhasil!",
          `Pertanyaan berhasil dibuat dengan ID: ${result.pty_id}`,
          "success",
          "OK"
        ).then(() => navigate("/pertanyaan"));
      } else {
        throw new Error(result.error_message || "Terjadi kesalahan server");
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
      if (result) onChangePage("index");
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
              onClick={() => onChangePage("index")}
            />
          </div>
          <div className="shadow p-5 m-5 mt-0 bg-white rounded">
            <HeaderForm label="Formulir Pertanyaan" />
            <InputField
              ref={pertanyaanRef}
              id="pertanyaan"
              label="Pertanyaan"
              value={formData.pertanyaan}
              onChange={handleChange}
              name="pertanyaan"
              isRequired
              maxLength={255}
              type="text"
            />
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
            <Dropdown
              ref={respondenRef}
              arrData={[
                {
                  value: "Dosen dan Instruktur",
                  Text: "Dosen dan Instruktur",
                },
                { value: "Tenaga Pendidik", Text: "Tenaga Pendidik" },
                { value: "Mitra Kerjasama", Text: "Mitra Kerjasama" },
              ]}
              label="Responden"
              isRequired
              onChange={handleChange}
              value={formData.responden}
              name="responden"
              type="pilih"
              placeholder="Pilih Responden"
            />
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
