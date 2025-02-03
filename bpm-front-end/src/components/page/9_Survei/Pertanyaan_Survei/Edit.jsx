import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageTitleNav from "../../../part/PageTitleNav";
import InputField from "../../../part/InputField";
import HeaderForm from "../../../part/HeaderText";
import Button from "../../../part/Button";
import Dropdown from "../../../part/Dropdown";
import CheckBox from "../../../part/CheckBox";
import SweetAlert from "../../../util/SweetAlert";
import { API_LINK } from "../../../util/Constants";
import { useFetch } from "../../../util/useFetch";
import { useIsMobile } from "../../../util/useIsMobile";
import Loading from "../../../part/Loading";

export default function Edit({ onChangePage }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const title = "Edit Pertanyaan";
  const breadcrumbs = [
    { label: "Pertanyaan Survei", href: "/survei/pertanyaan" },
    { label: "Edit Pertanyaan", href: `/survei/pertanyaan/edit/${id}` },
  ];

  const [formData, setFormData] = useState({
    ptyId: id,
    pertanyaan: "",
    ksrId: "",
    skpId: "",
    responden: [], // Menyimpan data responden
  });

  const [ksrOptions, setKsrOptions] = useState([]);
  const [skpOptions, setSkpOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Mengambil data pertanyaan dan responden dari API
  useEffect(() => {
    const fetchDokumenById = async () => {
      setLoading(true);
      try {
        const body = { id: id };

        const result = await useFetch(
          `${API_LINK}/MasterPertanyaan/GetDataPertanyaanById`,
          body,
          "POST"
        );

        console.log("API Response:", result); // Debug respons API

        if (!result || result === "ERROR" || result.length === 0) {
          Swal.fire("Error", "Data tidak ditemukan", "error");
          return;
        }

        const { pty_pertanyaan, ksr_id, skp_id, dtl_responden } = result[0];

        console.log("dtl_responden (raw):", dtl_responden); // Debug sebelum parsing

        let parsedResponden = [];

        // Pastikan dtl_responden tidak null atau kosong
        if (dtl_responden) {
          try {
            const jsonArray = JSON.parse(dtl_responden);
            parsedResponden = jsonArray.map((item) =>
              parseInt(item.dtl_responden, 10)
            );
          } catch (error) {
            console.error("Error parsing JSON dtl_responden:", error);
          }
        }

        console.log("dtl_responden (parsed):", parsedResponden); // Debug setelah parsing

        setFormData({
          ptyId: id,
          pertanyaan: pty_pertanyaan,
          ksrId: ksr_id,
          skpId: skp_id,
          responden: parsedResponden,
        });
      } catch (err) {
        Swal.fire("Error", "Gagal mengambil data: " + err.message, "error");
      } finally {
        setLoading(false);
      }
    };

    fetchDokumenById();
  }, [id]);

  // Fetch the data for Kriteria Survei
  useEffect(() => {
    const fetchKriteria = async () => {
      setLoading(true);
      try {
        const data = await useFetch(
          `${API_LINK}/MasterPertanyaan/GetAllKriteriaSurveiAktif`,
          {},
          "POST"
        );
        setKsrOptions(data);
      } catch (err) {
        setError("Gagal mengambil data Kriteria Survei: " + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchKriteria();
  }, []);

  // Fetch the data for Skala Penilaian
  useEffect(() => {
    const fetchSkalaPenilaian = async () => {
      setLoading(true);
      try {
        const skpResponse = await useFetch(
          `${API_LINK}/SkalaPenilaian/GetSkalaPenilaian`,
          {},
          "POST"
        );
        if (skpResponse && Array.isArray(skpResponse)) {
          setSkpOptions(
            skpResponse
              .filter((item) => item.skp_status === "Aktif")
              .map((item) => ({
                value: item.skp_id,
                Text: `${item.skp_skala} (${item.skp_deskripsi})`,
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

    if (type === "checkbox") {
      const parsedValue = parseInt(value, 10); // Ensure the value is an integer

      setFormData((prevFormData) => {
        const updatedResponden = checked
          ? [...prevFormData.responden, parsedValue] // Add to the array if checked
          : prevFormData.responden.filter((item) => item !== parsedValue); // Remove from the array if unchecked

        return {
          ...prevFormData,
          responden: updatedResponden,
        };
      });
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        pertanyaan: formData.pertanyaan,
        ksrId: parseInt(formData.ksrId, 10),
        skpId: parseInt(formData.skpId, 10),
        responden: formData.responden.map((r) => parseInt(r, 10)),
      };

      const result = await useFetch(
        `${API_LINK}/MasterPertanyaan/EditPertanyaan`,
        payload,
        "POST"
      );

      if (result === "ERROR") {
        throw new Error("Terjadi kesalahan server");
      } else {
        SweetAlert(
          "Berhasil!",
          "Pertanyaan berhasil diperbarui",
          "success",
          "OK"
        );
        navigate("/survei/pertanyaan");
      }
    } catch (error) {
      SweetAlert(
        "Gagal!",
        error.message || "Terjadi kesalahan saat menyimpan",
        "error",
        "OK"
      );
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
            <HeaderForm label="Formulir Pertanyaan" />
            <div className="mb-4">
              <Dropdown
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
                label="Pertanyaan"
                value={formData.pertanyaan}
                name="pertanyaan"
                onChange={handleChange}
                isRequired={true}
                type="text"
                placeholder="Masukkan pertanyaan survei"
              />
            </div>
            <div className="mb-4">
              <Dropdown
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
                  { Value: 0, Text: "Dosen dan Instruktur" },
                  { Value: 1, Text: "Tenaga Pendidik" },
                  { Value: 2, Text: "Mitra Kerjasama" },
                ]}
                label="Responden"
                selectedValues={formData.responden || []}
                onChange={handleChange}
                name="responden"
              />
            </div>
            <Button
              onClick={handleSubmit}
              label="Simpan"
              className="btn-primary"
            />
            <Button
              onClick={handleCancel}
              label="Batal"
              className="btn-danger ms-3"
            />
          </div>
        </div>
      </main>
    </div>
  );
}
