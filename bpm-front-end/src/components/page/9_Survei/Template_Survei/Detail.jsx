import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PageTitleNav from "../../../part/PageTitleNav";
import DetailData from "../../../part/DetailData";
import HeaderForm from "../../../part/HeaderText";
import Loading from "../../../part/Loading";
import { API_LINK } from "../../../util/Constants";
import { useIsMobile } from "../../../util/useIsMobile";
import { useFetch } from "../../../util/useFetch";

export default function Detail({ onChangePage }) {
  const title = "Detail Template Survei";
  const breadcrumbs = [
    { label: "Template Survei", href: "/survei/template" },
    { label: "Detail Template Survei" },
  ];
  const isMobile = useIsMobile();
  const location = useLocation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    templateName: "",
    createdBy: "",
    createdDate: "",
    modifiedBy: "",
    modifiedDate: "",
    status: "",
  });

  // Fetch data function
  const fetchData = async (templateId) => {
    try {
      const response = await fetch(
        `${API_LINK}/TemplateSurvei/GetDataTemplateSurveiById`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: templateId }),
        }
      );

      const data = await response.json();
      console.log("API Response Data:", data);

      if (data && data.length > 0) {
        const template = data[0];
        setFormData({
          templateName: template.tsu_nama || "Tidak tersedia",
          createdBy: template.tsu_created_by || "Tidak tersedia",
          createdDate: template.tsu_created_date
            ? new Date(template.tsu_created_date).toLocaleDateString("id-ID", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })
            : "-",
          modifiedBy: template.tsu_modif_by || "-",
          modifiedDate: template.tsu_modif_date
            ? new Date(template.tsu_modif_date).toLocaleDateString("id-ID", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })
            : "-",
          status:
            template.tsu_status === 1
              ? "Final"
              : template.tsu_status === 0
              ? "Draft"
              : template.tsu_status === 2
              ? "Tidak Aktif"
              : "Tidak Tersedia",
        });
      } else {
        setError("Template data tidak ditemukan.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Gagal mengambil data template.");
    } finally {
      setLoading(false);
    }
  };

  // Use effect to fetch data on mount
  useEffect(() => {
    if (!location.state?.idTemplate) {
      setError(
        "Template ID tidak ditemukan. Silakan kembali ke halaman sebelumnya."
      );
      return;
    }

    const templateId = location.state.idTemplate;
    setLoading(true);
    fetchData(templateId);
  }, [location.state?.idTemplate]);

  if (loading) return <Loading />;
  if (error)
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div>
          <p>{error}</p>
          <button
            className="btn btn-primary"
            onClick={() => navigate("/survei/template")}
          >
            Kembali ke Template Survei
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
            <HeaderForm label="Detail Template Survei" />
            <div className="row">
              <div className="col-lg-6 col-md-6">
                <DetailData
                  label="Nama Template"
                  isi={formData.templateName}
                  id="templateName"
                />
                <DetailData label="Status" isi={formData.status} id="status" />
              </div>
              <div className="col-lg-6 col-md-6">
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
