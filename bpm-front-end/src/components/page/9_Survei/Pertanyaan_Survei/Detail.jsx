import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { API_LINK } from "../../../util/Constants";
import { useIsMobile } from "../../../util/useIsMobile";
import PageTitleNav from "../../../part/PageTitleNav";
import Button from "../../../part/Button";
import Swal from "sweetalert2";
import DetailData from "../../../part/DetailData";
import HeaderForm from "../../../part/HeaderText";
import Loading from "../../../part/Loading";

const formatTanggal = (tanggal) =>
  tanggal
    ? new Date(tanggal).toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "-";

export default function Detail() {
  const navigate = useNavigate();
  const location = useLocation();
  const idData = location.state?.idData;
  const { detailId } = useParams();
  const isMobile = useIsMobile();
  const [detailData, setDetailData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const response = await fetch(
          `${API_LINK}/MasterPertanyaan/GetDataPertanyaanByIdDetail`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ p1: idData }),
          }
        );

        if (!response.ok) {
          throw new Error("Gagal mengambil data detail");
        }

        const result = await response.json();
        console.log("Result: ", result);
        if (result.length > 0) {
          const data = result[0]; // Ambil data pertama dari array
          setDetailData({
            idBank: data.idBank || "-",
            pertanyaan: data.pertanyaan || "-",
            status: data.status || "-",
            ksr_id: data.ksr_id || "-",
            namaKri: data.namaKri || "-",
            skp_id: data.skp_id || "-",
            tipeSka: data.tipeSka || "-",
            skala: data.skala || "-",
            deskSka: data.deskSka || "-",
            createdBy: data.createdBy || "-",
            createdDate: formatTanggal(data.createdDate),
            modifiedBy: data.modifiedBy || "-",
            modifiedDate: formatTanggal(data.modifiedDate),
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
  }, [idData, navigate]);

  if (loading) return <Loading />;
  if (!detailData) return <p>Data tidak ditemukan atau tidak aktif</p>;

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
                  label="ID Bank Pertanyaan"
                  isi={detailData.idBank}
                />
                <DetailData label="Pertanyaan" isi={detailData.pertanyaan} />
                <DetailData label="Status" isi={detailData.status} />
                <DetailData label="Kriteria ID" isi={detailData.ksr_id} />
                <DetailData label="Kriteria" isi={detailData.namaKri} />
                <DetailData label="Dibuat Oleh" isi={detailData.createdBy} />
                <DetailData
                  label="Tanggal Dibuat"
                  isi={detailData.createdDate}
                />
              </div>
              <div className="col-lg-6 col-md-6">
                <DetailData label="Skala ID" isi={detailData.skp_id} />
                <DetailData label="Tipe Skala" isi={detailData.tipeSka} />
                <DetailData label="Skala" isi={detailData.skala} />
                <DetailData label="Deskripsi Skala" isi={detailData.deskSka} />
                <DetailData label="Diubah Oleh" isi={detailData.modifiedBy} />
                <DetailData
                  label="Tanggal Diubah"
                  isi={detailData.modifiedDate}
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
