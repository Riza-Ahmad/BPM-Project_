import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageTitleNav from "../../../part/PageTitleNav";
import DetailData from "../../../part/DetailData";
import HeaderForm from "../../../part/HeaderText";
import Loading from "../../../part/Loading";
import Button from "../../../part/Button";
import Swal from "sweetalert2";
import { API_LINK } from "../../../util/Constants";
import { useIsMobile } from "../../../util/useIsMobile";
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

export default function DetailSkalaPenilaian() {
  const { detailId } = useParams();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [loading, setLoading] = useState(true);
  const [detailData, setDetailData] = useState({
    skp_skala: "",
    skp_deskripsi: "",
    skp_tipe: "",
    skp_status: "",
    skp_created_by: "",
    skp_created_date: "",
    skp_modif_by: "",
    skp_modif_date: "",
  });

  const ambilDetailSkala = async () => {
    try {
      const hasil = await useFetch(
        `${API_LINK}/SkalaPenilaian/GetDataSkalaPenilaianById`,
        { p1: detailId },
        "POST"
      );

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

  useEffect(() => {
    ambilDetailSkala();
  }, [detailId, navigate]);

  const KolomKiriDetail = () => (
    <div className="col-lg-6 col-md-6">
      <DetailData label="Skala" isi={detailData.skp_skala || "-"} />
      <DetailData label="Tipe Input" isi={detailData.skp_tipe || "-"} />
      <DetailData
        label="Status"
        isi={detailData.skp_status === "Aktif" ? "Aktif" : "Tidak Aktif"}
      />
      <DetailData label="Dibuat Oleh" isi={detailData.skp_created_by || "-"} />
      <DetailData
        label="Dibuat Tanggal"
        isi={formatTanggal(detailData.skp_created_date)}
      />
    </div>
  );

  const KolomKananDetail = () => (
    <div className="col-lg-6 col-md-6">
      <DetailData
        label="Deskripsi Nilai"
        isi={detailData.skp_deskripsi || "-"}
      />
      <DetailData
        label="Dimodifikasi Oleh"
        isi={detailData.skp_modif_by || "-"}
      />
      <DetailData
        label="Dimodifikasi Tanggal"
        isi={formatTanggal(detailData.skp_modif_date)}
      />
    </div>
  );

  if (loading) return <Loading />;

  return (
    <div className="d-flex flex-column min-vh-100">
      <main className="flex-grow-1 p-3" style={{ marginTop: "80px" }}>
        <div className="d-flex flex-column">
          <PageTitleNav
            title="Detail Skala Penilaian"
            breadcrumbs={[
              { label: "Skala", href: "/survei/skala" },
              { label: "Detail Skala Penilaian" },
            ]}
            onClick={() => navigate("/survei/skala")}
          />

          <div className="shadow p-5 mt-4 bg-white rounded">
            <HeaderForm label="Detail Skala Penilaian" />

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
