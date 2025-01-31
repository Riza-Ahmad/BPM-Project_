import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

// Komponen UI
import PageTitleNav from "../../../part/PageTitleNav";
import DetailData from "../../../part/DetailData";
import HeaderForm from "../../../part/HeaderText";
import Loading from "../../../part/Loading";
import Button from "../../../part/Button";

// Utilitas
import Swal from "sweetalert2";
import { API_LINK } from "../../../util/Constants";
import { useIsMobile } from "../../../util/useIsMobile";

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

export default function DetailSkalaPenilaian() {
  // Hooks
  const { detailId } = useParams();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // State
  const [loading, setLoading] = useState(true);
  const [detailData, setDetailData] = useState({
    skp_tipe: "",
    skp_status: "",
    skp_created_by: "",
    skp_created_date: "",
    skp_modif_by: "",
    skp_modif_date: "",
    skp_deskripsi: "",
  });

  // Fungsi untuk mengambil data detail dari API
  const ambilDetailSkala = async () => {
    try {
      const response = await fetch(
        `${API_LINK}/SkalaPenilaian/GetDataSkalaPenilaianById`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ p1: detailId }),
        }
      );

      if (!response.ok) {
        throw new Error("Gagal mengambil data skala penilaian.");
      }

      const hasil = await response.json();
      if (hasil && hasil.length > 0) {
        setDetailData(hasil[0]);
      } else {
        throw new Error("Data tidak ditemukan.");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Terjadi Kesalahan",
        text: error.message || "Gagal mengambil detail skala penilaian!",
      });
      navigate("/survei/skala");
    } finally {
      setLoading(false);
    }
  };

  // Effect untuk memuat data saat komponen dimuat
  useEffect(() => {
    ambilDetailSkala();
  }, [detailId, navigate]);

  // Komponen untuk menampilkan kolom kiri detail
  const KolomKiriDetail = () => (
    <div className="col-lg-6 col-md-6">
      <DetailData label="Tipe" isi={detailData.skp_tipe || "-"} />
      <DetailData
        label="Status"
        isi={detailData.skp_status === 0 ? "Tidak" : "Ya"}
      />
      <DetailData
        label="Dibuat Oleh"
        isi={detailData.skp_created_by || "Tidak tersedia"}
      />
      <DetailData
        label="Dibuat Tanggal"
        isi={formatTanggal(detailData.skp_created_date)}
      />
    </div>
  );

  // Komponen untuk menampilkan kolom kanan detail
  const KolomKananDetail = () => (
    <div className="col-lg-6 col-md-6">
      <DetailData
        label="Deskripsi Nilai (Terendah - Tertinggi)"
        isi={detailData.skp_deskripsi || "-"}
      />
      <DetailData
        label="Dimodifikasi Oleh"
        isi={detailData.skp_modif_by || "Tidak tersedia"}
      />
      <DetailData
        label="Dimodifikasi Tanggal"
        isi={formatTanggal(detailData.skp_modif_date)}
      />
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
            title="Detail Skala Penilaian"
            breadcrumbs={[
              { label: "Skala", href: "/survei/skala" },
              { label: "Detail Skala Penilaian" },
            ]}
            onClick={() => navigate("/survei/skala")}
          />

          {/* Kartu Detail */}
          <div className="shadow p-5 mt-4 bg-white rounded">
            <HeaderForm label="Detail Skala Penilaian" />

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
                  onClick={() => navigate("/survei/skala")}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
