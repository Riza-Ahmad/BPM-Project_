import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_LINK } from "../../../util/Constants";
import { useIsMobile } from "../../../util/useIsMobile";
import PageTitleNav from "../../../part/PageTitleNav";
import Button from "../../../part/Button";
import Swal from "sweetalert2";
import DetailData from "../../../part/DetailData";
import HeaderForm from "../../../part/HeaderText";
import Loading from "../../../part/Loading";
import { useFetch } from "../../../util/useFetch";

// Format tanggal untuk Indonesia
const formatTanggal = (tanggal) => {
  if (!tanggal) return "-";
  return new Date(tanggal).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export default function Detail() {
  const navigate = useNavigate();
  const { detailId } = useParams();
  const isMobile = useIsMobile();
  const [detailData, setDetailData] = useState({
    pertanyaan: "",
    tipe: "",
    status: "",
    createdBy: "",
    createdDate: "",
    modifiedBy: "",
    modifiedDate: "",
    ksrId: "",
    skpId: "",
    kriteriaNama: "",
    skalaTipe: "",
  });
  const [ksrOptions, setKsrOptions] = useState([]);
  const [skpOptions, setSkpOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch Kriteria data
  useEffect(() => {
    const fetchKriteria = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await useFetch(
          `${API_LINK}/MasterPertanyaan/GetAllKriteriaSurveiAktif`,
          {},
          "POST"
        );
        setKsrOptions(data);
      } catch (err) {
        setError("Gagal mengambil data Kriteria: " + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchKriteria();
  }, []);

  // Fetch Skala Penilaian data
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

  // Fetch Detail Pertanyaan
  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${API_LINK}/MasterPertanyaan/GetDataPertanyaanById`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ p1: detailId }),
          }
        );

        if (!response.ok) {
          throw new Error("Gagal mengambil data detail");
        }

        const result = await response.json();
        if (result && result[0]) {
          const fetchedKriteriaNama =
            ksrOptions.find((item) => item.ksr_id === result[0].ksrId)
              ?.ksr_nama || "-";

          const fetchedSkalaTipe =
            skpOptions.find((item) => item.skp_id === result[0].skpId)
              ?.skp_skala || "-";

          setDetailData({
            ...result[0],
            kriteriaNama: fetchedKriteriaNama,
            skalaTipe: fetchedSkalaTipe,
          });
        } else {
          throw new Error("Data tidak ditemukan");
        }
      } catch (error) {
        console.error("Error fetching detail:", error);
        Swal.fire({
          icon: "error",
          title: "Terjadi Kesalahan",
          text: "Gagal mengambil data detail",
        });
        navigate("/survei/pertanyaan");
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [detailId, ksrOptions, skpOptions, navigate]);

  // Komponen untuk menampilkan kolom kiri detail
  const KolomKiriDetail = () => (
    <div className="col-lg-6 col-md-6">
      <DetailData label="Pertanyaan" isi={detailData.pertanyaan || "-"} />
      <DetailData label="Tipe" isi={detailData.tipe || "-"} />
      <DetailData
        label="Status"
        isi={detailData.status === 0 ? "Tidak Aktif" : "Aktif"}
      />
      <DetailData label="Dibuat Oleh" isi={detailData.createdBy || "-"} />
      <DetailData
        label="Tanggal Dibuat"
        isi={formatTanggal(detailData.createdDate)}
      />
      <DetailData label="Kriteria" isi={detailData.kriteriaNama || "-"} />
    </div>
  );

  // Komponen untuk menampilkan kolom kanan detail
  const KolomKananDetail = () => (
    <div className="col-lg-6 col-md-6">
      <DetailData
        label="Dimodifikasi Oleh"
        isi={detailData.modifiedBy || "-"}
      />
      <DetailData
        label="Tanggal Dimodifikasi"
        isi={formatTanggal(detailData.modifiedDate)}
      />
      <DetailData label="Skala Tipe" isi={detailData.skalaTipe || "-"} />
    </div>
  );

  // Tampilkan loading jika data sedang dimuat
  if (loading) return <Loading />;

  return (
    <div className="d-flex flex-column min-vh-100">
      <main className="flex-grow-1 p-3" style={{ marginTop: "80px" }}>
        <div className="d-flex flex-column">
          {/* Navigasi dan Judul */}
          <PageTitleNav
            title="Detail Pertanyaan Survei"
            breadcrumbs={[
              { label: "Pertanyaan Survei", href: "/survei/pertanyaan" },
              { label: "Detail Pertanyaan Survei" },
            ]}
            onClick={() => navigate("/survei/pertanyaan")}
          />

          {/* Kartu Detail */}
          <div className="shadow p-5 mt-4 bg-white rounded">
            <HeaderForm label="Detail Pertanyaan Survei" />

            {/* Konten Detail */}
            <div className="row">
              <KolomKiriDetail />
              <KolomKananDetail />
            </div>

            {/* Tombol Aksi */}
            <div className="d-flex justify-content-between align-items-center">
              <div className="flex-grow-1 m-2">
                <Button
                  width="100%"
                  label="Kembali"
                  classType="danger"
                  onClick={() => navigate("/survei/pertanyaan")}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
