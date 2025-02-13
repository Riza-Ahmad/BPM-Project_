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
    idKri: "",
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
            idKri: result[0].idKri,
            namaKri: result[0].namaKri,
            status: result[0].status,
            createdBy: result[0].createdBy,
            createdDate: formatTanggal(result[0].createdDate),
            modifiedBy: result[0].modifiedBy,
            modifiedDate: formatTanggal(result[0].modifiedDate),
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

  if (loading) return <Loading />;

  return (
    <div className="d-flex flex-column min-vh-100">
      <main className="flex-grow-1 p-3" style={{ marginTop: "80px" }}>
        <div className="d-flex flex-column">
          <PageTitleNav
            title="Detail Kriteria Survei"
            breadcrumbs={[
              { label: "Kriteria Survei", href: "/survei/kriteria" },
              { label: "Detail Kriteria Survei" },
            ]}
            onClick={() => navigate("/survei/kriteria")}
          />

          <div className="shadow p-5 mt-4 bg-white rounded">
            <HeaderForm label="Detail Kriteria Survei" />

            <div className="row">
              <div className="col-md-6">
                <DetailData label="Nama Kriteria" isi={detailData.namaKri} />
                <DetailData label="Status" isi={detailData.status} />
                <DetailData label="Dibuat Oleh" isi={detailData.createdBy} />
                <DetailData
                  label="Tanggal Dibuat"
                  isi={detailData.createdDate}
                />
              </div>
              <div className="col-md-6">
                <DetailData
                  label="Dimodifikasi Oleh"
                  isi={detailData.modifiedBy}
                />
                <DetailData
                  label="Tanggal Dimodifikasi"
                  isi={detailData.modifiedDate}
                />
                <DetailData label="ID Kriteria" isi={detailData.idKri} />
              </div>
            </div>

            <div className="d-flex justify-content-between align-items-center">
              <div className="flex-grow-1 m-2">
                <Button
                  width="100%"
                  label="Kembali"
                  classType="danger"
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
