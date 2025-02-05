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
  const [loading, setLoading] = useState(true);
  const [detailData, setDetailData] = useState({
    pty_pertanyaan: "",
    pty_status: "",
    pty_created_by: "",
    pty_created_date: "",
    pty_modif_by: "",
    pty_modif_date: "",
    ksr_id: "",
    skp_id: "",
    ksr_nama: "",
    skp_tipe: "",
    skp_skala: "",
    skp_deskripsi: "",
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const result = await useFetch(
          `${API_LINK}/MasterPertanyaan/GetDataPertanyaanById`,
          { p1: detailId },
          "POST"
        );

        console.log("Hasil Fetch:", result); // Debugging

        if (result && result[0]) {
          setDetailData({
            pty_pertanyaan: result[0].pty_pertanyaan || "-",
            pty_status:
              result[0].pty_status === "Aktif" ? "Aktif" : "Tidak Aktif",
            pty_created_by: result[0].pty_created_by || "-",
            pty_created_date: formatTanggal(result[0].pty_created_date),
            pty_modif_by: result[0].pty_modif_by || "-",
            pty_modif_date: formatTanggal(result[0].pty_modif_date),
            ksr_id: result[0].ksr_id || "-",
            skp_id: result[0].skp_id || "-",
            ksr_nama: result[0].ksr_nama || "-",
            skp_tipe: result[0].skp_tipe || "-",
            skp_skala: result[0].skp_skala || "-",
            skp_deskripsi: result[0].skp_deskripsi || "-",
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

    if (detailId) {
      fetchDetail();
    }
  }, [detailId, navigate]);

  const KolomKiriDetail = () => (
    <div className="col-lg-6 col-md-6">
      <DetailData label="Pertanyaan" isi={detailData.pty_pertanyaan} />
      <DetailData label="Kriteria" isi={detailData.ksr_nama} />
      <DetailData label="Status" isi={detailData.pty_status} />
      <DetailData label="Dibuat Oleh" isi={detailData.pty_created_by} />
      <DetailData label="Tanggal Dibuat" isi={detailData.pty_created_date} />
    </div>
  );

  const KolomKananDetail = () => (
    <div className="col-lg-6 col-md-6">
      <DetailData label="Skala Tipe" isi={detailData.skp_tipe} />
      <DetailData label="Skala Skala" isi={detailData.skp_skala} />
      <DetailData label="Deskripsi Skala" isi={detailData.skp_deskripsi} />
      <DetailData label="Dimodifikasi Oleh" isi={detailData.pty_modif_by} />
      <DetailData
        label="Tanggal Dimodifikasi"
        isi={detailData.pty_modif_date}
      />
    </div>
  );

  if (loading) return <Loading />;

  return (
    <div className="d-flex flex-column min-vh-100">
      <main className="flex-grow-1 p-3" style={{ marginTop: "80px" }}>
        <div className="d-flex flex-column">
          <PageTitleNav
            title="Detail Pertanyaan Survei"
            breadcrumbs={[
              { label: "Bank Pertanyaan Survei", href: "/survei/pertanyaan" },
              { label: "Detail Pertanyaan Survei" },
            ]}
            onClick={() => navigate("/survei/pertanyaan")}
          />
          <div className="shadow p-5 mt-4 bg-white rounded">
            <HeaderForm label="Detail Pertanyaan Survei" />
            <div className="row">
              <KolomKiriDetail />
              <KolomKananDetail />
            </div>
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
