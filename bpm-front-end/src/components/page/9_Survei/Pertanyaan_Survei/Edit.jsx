import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import PageTitleNav from "../../../part/PageTitleNav";
import InputField from "../../../part/InputField";
import HeaderForm from "../../../part/HeaderText";
import Button from "../../../part/Button";
import Dropdown from "../../../part/Dropdown";
import CheckBox from "../../../part/CheckBox";
import SweetAlert from "../../../util/SweetAlert";
import Swal from "sweetalert2";
import { API_LINK } from "../../../util/Constants";
import { useFetch } from "../../../util/useFetch";
import { useIsMobile } from "../../../util/useIsMobile";
import Loading from "../../../part/Loading";

export default function Edit({ onChangePage }) {
  const { id } = useParams();
  const location = useLocation();
  const idData = location.state?.idData;
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const title = "Edit Bank Pertanyaan Survei";
  const breadcrumbs = [
    { label: "Bank Pertanyaan Survei", href: "/survei/pertanyaan" },
    {
      label: "Edit Bank Pertanyaan Survei",
      href: `/survei/pertanyaan/edit/`,
    },
  ];

  const [formData, setFormData] = useState({
    ptyId: idData,
    pertanyaan: "",
    ksrId: "",
    skpId: "",
    responden: [],
  });

  const [ksrOptions, setKsrOptions] = useState([]);
  const [skpOptions, setSkpOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDokumenById = async () => {
      setLoading(true);
      try {
        const body = { id: idData };

        const result = await useFetch(
          `${API_LINK}/MasterPertanyaan/GetDataPertanyaanByIdDetail`,
          body,
          "POST"
        );

        const result1 = await useFetch(
          `${API_LINK}/MasterPertanyaan/GetDataPertanyaanRespondenById`,
          body,
          "POST"
        );

        const valuesArray = result1.map((item) => item.Value);

        if (!result || result === "ERROR" || result.length === 0) {
          Swal.fire("Error", "Data tidak ditemukan", "error");
          return;
        }

        if (!result1 || result1 === "ERROR" || result1.length === 0) {
          Swal.fire("Error", "Data tidak ditemukan", "error");
          return;
        }

        const { pertanyaan, ksr_id, skp_id } = result[0];

        let parsedResponden = [];

        // Pastikan dtl_responden tidak null atau kosong
        // if (dtl_responden) {
        //   try {
        //     const jsonArray = JSON.parse(dtl_responden);
        //     parsedResponden = jsonArray.map((item) =>
        //       parseInt(item.dtl_responden, 10)
        //     );
        //   } catch (error) {
        //     console.error("Error parsing JSON dtl_responden:", error);
        //   }
        // }

        // console.log("dtl_responden (parsed):", parsedResponden); // Debug setelah parsing

        setFormData({
          ptyId: idData,
          pertanyaan: pertanyaan,
          ksrId: ksr_id,
          skpId: skp_id,
          responden: valuesArray || [],
        });
      } catch (err) {
        Swal.fire("Error", "Gagal mengambil data: " + err.message, "error");
      } finally {
        setLoading(false);
      }
    };

    fetchDokumenById();
  }, [idData]);

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
        setError("Gagal mengambil data Kriteria Survei: " + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchKriteria();
  }, []);

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
                Value: item.skp_id,
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
      const parsedValue = value;

      setFormData((prevFormData) => {
        const updatedResponden = checked
          ? [...prevFormData.responden, parsedValue]
          : prevFormData.responden.filter((item) => item !== parsedValue);

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
        responden: formData.responden,
      };

      const result = await useFetch(
        `${API_LINK}/MasterPertanyaan/EditPertanyaan`,
        formData,
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
      null,
      "",
      true
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
            <HeaderForm label="Formulir Bank Pertanyaan" />
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
                  {
                    Value: "Dosen dan Instruktur",
                    Text: "Dosen dan Instruktur",
                  },
                  { Value: "Tenaga Pendidik", Text: "Tenaga Kependidikan" },
                  { Value: "Mitra Kerjasama", Text: "Mitra Kerja sama" },
                ]}
                label="Responden"
                name="responden"
                isRequired={true}
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
