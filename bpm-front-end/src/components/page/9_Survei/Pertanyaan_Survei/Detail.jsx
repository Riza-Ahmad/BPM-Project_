
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
    ksr_id: "",
    skp_id: "",
    ksr_nama: "",
    skp_tipe: "",
    skp_skala: "",
    skp_deskripsi: "",
  });

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      try {
        // Kirim ID dalam format array JSON
        const requestBody = JSON.stringify([detailId]);

        const result = await useFetch(
          `${API_LINK}/MasterPertanyaan/GetDataPertanyaanById`,
          requestBody,
          "POST"
        );

        console.log("Hasil Fetch:", result); // Debugging

        if (result && result.length > 0) {
          const data = result[0];

          setDetailData({
            pty_pertanyaan: data.pertanyaan || "-",
            pty_status: data.status || "-",
            ksr_id: data.ksr_id || "-",
            skp_id: data.skp_id || "-",
            ksr_nama: data.namaKri || "-",
            skp_tipe: data.tipeSka || "-",
            skp_skala: data.skala || "-",
            skp_deskripsi: data.deskSka || "-",
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
              <div className="col-lg-6 col-md-6">
                <DetailData
                  label="Pertanyaan"
                  isi={detailData.pty_pertanyaan}
                />
                <DetailData label="Kriteria" isi={detailData.ksr_nama} />
                <DetailData label="Status" isi={detailData.pty_status} />
              </div>
              <div className="col-lg-6 col-md-6">
                <DetailData label="Skala Tipe" isi={detailData.skp_tipe} />
                <DetailData label="Skala Skala" isi={detailData.skp_skala} />
                <DetailData
                  label="Deskripsi Skala"
                  isi={detailData.skp_deskripsi}
                />
              </div>
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
