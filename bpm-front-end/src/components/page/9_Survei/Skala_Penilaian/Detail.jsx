import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageTitleNav from "../../../part/PageTitleNav";
import DetailData from "../../../part/DetailData";
import HeaderForm from "../../../part/HeaderText";
import Loading from "../../../part/Loading";
import Swal from "sweetalert2";
import { API_LINK } from "../../../util/Constants";
import { useIsMobile } from "../../../util/useIsMobile";
import Button from "../../../part/Button";

export default function DetailSkalaPenilaian() {
  const title = "";
  const { detailId } = useParams();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState({
    skp_tipe: "",
    skp_status: "",
    skp_created_by: "",
    skp_created_date: "",
    skp_modif_by: "",
    skp_modif_date: "",
    skp_deskripsi: "",
  });


  useEffect(() => {
    const fetchDetailSkalaPenilaian = async () => {
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
          throw new Error("Failed to fetch skala penilaian data.");
        }

        const result = await response.json();
        if (result && result.length > 0) {
          setDetail(result[0]);
        } else {
          throw new Error("Data not found.");
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: error.message || "Failed to fetch skala penilaian detail!",
        });
        navigate("/survei/skala");
      } finally {
        setLoading(false);
      }
    };

    fetchDetailSkalaPenilaian();
  }, [detailId, navigate]);

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
          {/* Navigation and Title */}
          <div
            className={`d-flex align-items-center ${
              isMobile ? "flex-column" : "mb-4"
            }`}
          >
            <h5 className="m-0 text-center">{title}</h5>
          </div>

          {/* Detail Card */}
          <div className="shadow p-5 mt-4 bg-white rounded">
            <HeaderForm label={title} />
            <div className="row">
              {/* Left Column */}
              <div className="col-lg-6 col-md-6">
                <DetailData label="Tipe" isi={detail.skp_tipe || "-"} />
                <DetailData
                  label="Status"
                  isi={detail.skp_status === 0 ? "Tidak" : "Ya"}
                />
                <DetailData
                  label="Dibuat Oleh"
                  isi={detail.skp_created_by || "Tidak tersedia"}
                />
                <DetailData
                  label="Dibuat Tanggal"
                  isi={
                    detail.skp_created_date
                      ? new Date(detail.skp_created_date).toLocaleDateString(
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

              {/* Right Column */}
              <div className="col-lg-6 col-md-6">
                <DetailData
                  label="Deskripsi Nilai (Terendah - Tertinggi)"
                  isi={detail.skp_deskripsi || "-"}
                />
                <DetailData
                  label="Dimodifikasi Oleh"
                  isi={detail.skp_modif_by || "Tidak tersedia"}
                />
                <DetailData
                  label="Dimodifikasi Tanggal"
                  isi={
                    detail.skp_modif_date
                      ? new Date(detail.skp_modif_date).toLocaleDateString(
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
            </div>

            <div className="d-flex justify-content-between align-items-center">

              <div className="flex-grow-1 m-2">
                <Button
                  width="100%"
                  label="Batal"
                  classType="danger"
                  onClick={() => navigate('/survei/skala')} 
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
