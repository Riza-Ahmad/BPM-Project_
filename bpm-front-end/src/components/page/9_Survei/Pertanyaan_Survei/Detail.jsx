import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import PageTitleNav from "../../../part/PageTitleNav";
import DetailData from "../../../part/DetailData";
import HeaderForm from "../../../part/HeaderText";
import Loading from "../../../part/Loading";
import { API_LINK } from "../../../util/Constants";
import { useIsMobile } from "../../../util/useIsMobile";
import { FaCodeBranch, FaSkyatlas } from "react-icons/fa";

export default function Detail({ onChangePage }) {
  const title = "Detail Pertanyaan";
  const breadcrumbs = [
    { label: "Pertanyaan Survei", href: "/survei/pertanyaan" },
    { label: "Detail Pertanyaan" },
  ];
  const isMobile = useIsMobile();
  const location = useLocation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    pertanyaan: "",
    kriteria: "",
    skala: "",
    status: "",
    createdBy: "",
    createdDate: "",
    modifiedBy: "",
    modifiedDate: "",
  });

  // Fetch data function
  const fetchData = async () => {
    try {
      const response = await fetch(
        `${API_LINK}/MasterPertanyaan/GetPertanyaanById`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: location.state.idPertanyaan }),
        }
      );

      const data = await response.json();
      console.log("API Response Data:", data); // Hanya di sini yang perlu ada log

      if (data && data.length > 0) {
        const pertanyaan = data[0];
        setFormData({
          pertanyaan: pertanyaan.pty_pertanyaan || "Tidak tersedia",
          kriteria: pertanyaan.kriteria_nama || "Tidak tersedia",
          skala: pertanyaan.skala_tipe || "Tidak tersedia",
          status: pertanyaan.pty_status === 1 ? "Aktif" : "Tidak Aktif",
          createdBy: pertanyaan.pty_created_by || "Tidak tersedia",
          createdDate: pertanyaan.pty_created_date
            ? new Date(pertanyaan.pty_created_date).toLocaleDateString(
                "id-ID",
                {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                }
              )
            : "-",
          modifiedBy: pertanyaan.pty_modif_by || "-",
          modifiedDate: pertanyaan.pty_modif_date
            ? new Date(pertanyaan.pty_modif_date).toLocaleDateString("id-ID", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })
            : "-",
        });
      } else {
        setError("Pertanyaan data tidak ditemukan.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Gagal mengambil data pertanyaan.");
    } finally {
      setLoading(false); // Pastikan loading selesai setelah data diambil atau error
    }
  };

  // Use effect to fetch data on mount
  useEffect(() => {
    console.log(formData);
    fetchData();
  }, []);

  if (loading) return <Loading />; // Menunggu data
  if (error)
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div>
          <p>{error}</p>
          <button
            className="btn btn-primary"
            onClick={() => navigate("/survei/pertanyaan")}
          >
            Kembali ke Pertanyaan
          </button>
        </div>
      </div>
    );

  return (
    <div className="d-flex flex-column min-vh-100">
      <main className="flex-grow-1 p-3" style={{ marginTop: "80px" }}>
        <div className="d-flex flex-column">
          <div className={isMobile ? "m-0" : "m-3"}>
            <PageTitleNav
              title={title}
              breadcrumbs={breadcrumbs}
              onClick={() => onChangePage("index")}
            />
          </div>
          <div
            className={
              isMobile
                ? "shadow p-4 m-2 mt-0 bg-white rounded"
                : "shadow p-5 m-5 mt-0 bg-white rounded"
            }
          >
            <HeaderForm label="Detail Pertanyaan" />
            <div className="row">
              <div className="col-lg-6 col-md-6">
                <DetailData
                  label="Pertanyaan"
                  isi={formData.pertanyaan}
                  id="pertanyaan"
                />
                <DetailData
                  label="Kriteria Survei"
                  isi={formData.kriteria}
                  id="kriteria"
                />
                <DetailData
                  label="Skala Penilaian"
                  isi={formData.skala}
                  id="skala"
                />
              </div>
              <div className="col-lg-6 col-md-6">
                <DetailData label="Status" isi={formData.status} id="status" />
                <DetailData
                  label="Dibuat Oleh"
                  isi={formData.createdBy}
                  id="createdBy"
                />
                <DetailData
                  label="Dibuat Tanggal"
                  isi={formData.createdDate}
                  id="createdDate"
                />
              </div>
            </div>
            <div className="row">
              <div className="col-lg-6 col-md-6">
                <DetailData
                  label="Dimodifikasi Oleh"
                  isi={formData.modifiedBy}
                  id="modifiedBy"
                />
              </div>
              <div className="col-lg-6 col-md-6">
                <DetailData
                  label="Dimodifikasi Tanggal"
                  isi={formData.modifiedDate}
                  id="modifiedDate"
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
