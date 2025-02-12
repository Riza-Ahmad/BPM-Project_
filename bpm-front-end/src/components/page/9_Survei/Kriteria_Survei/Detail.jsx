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
    namaKri: "",
    status: "",
    createdBy: "",
    createdDate: "",
    modifiedBy: "",
    modifiedDate: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const response = await fetch(
          `${API_LINK}/MasterKriteriaSurvei/GetDataKriteriaSurveiById`,
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
          setDetailData({
            ...result[0],
            status: result[0].pty_status === 0 ? "Tidak Aktif" : "Aktif", // Assuming status mapping
            createdDate: formatTanggal(result[0].pty_created_date),
            modifiedDate: formatTanggal(result[0].pty_modif_date),
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
        navigate("/survei/kriteria");
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [detailId, navigate]);

  // Tampilkan loading jika data sedang dimuat
  if (loading) return <Loading />;

  return (
    <div className="d-flex flex-column min-vh-100">
      <main className="flex-grow-1 p-3" style={{ marginTop: "80px" }}>
        <div className="d-flex flex-column">
          {/* Navigasi dan Judul */}
          <PageTitleNav
            title="Detail Kriteria Survei"
            breadcrumbs={[
              { label: "Kriteria Survei", href: "/survei/kriteria" },
              { label: "Detail Kriteria Survei" },
            ]}
            onClick={() => navigate("/survei/kriteria")}
          />

          {/* Kartu Detail */}
          <div className="shadow p-5 mt-4 bg-white rounded">
            <HeaderForm label="Detail Kriteria Survei" />

            {/* Konten Detail */}
            <div className="row">
              <div className="col-md-6 col-lg-6">
                <DetailData
                  label="Nama Kriteria"
                  isi={detailData?.namaKri || "-"}
                />
                <DetailData
                  label="Dibuat Oleh"
                  isi={detailData?.createdBy || "-"}
                />
                <DetailData
                  label="Tanggal Dibuat"
                  isi={
                    detailData.createdDateDate
                      ? new Date(detailData.modifiedDate).toLocaleDateString(
                          "id-ID",
                          {
                            weekday: "long",
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          }
                        )
                      : "-"
                  }
                />
              </div>
              <div className="col-md-6 col-lg-6">
                <DetailData label="Status" isi={detailData?.status || "-"} />
                <DetailData
                  label="Dimodifikasi Oleh"
                  isi={detailData.modifiedBy || "-"}
                />
                <DetailData
                  label="Tanggal Dimodifikasi"
                  isi={detailData.modifiedDate}
                />
              </div>

              <div className="col-lg-6 col-md-6"></div>
            </div>

            {/* Tombol Aksi */}
            <div className="d-flex justify-content-between align-items-center">
              <div className="flex-grow-1 m-2">
                <Button
                  width="100%"
                  label="Kembali"
                  classType="secondary"
                  onClick={() => navigate("/survei/kriteria")}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
