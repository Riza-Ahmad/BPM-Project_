import React, { useState, useEffect } from "react";
import PageTitleNav from "../../../part/PageTitleNav";
import DetailData from "../../../part/DetailData";
import HeaderForm from "../../../part/HeaderText";
import Loading from "../../../part/Loading";
import { API_LINK } from "../../../util/Constants";
import { useIsMobile } from "../../../util/useIsMobile";
import { useFetch } from "../../../util/useFetch";
import { useLocation, useNavigate } from "react-router-dom";
import TabPreviewSurvei from "./TabPreviewSurvei";

export default function Preview({ onChangePage }) {
  const title = "Preview Template Survei";
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
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

  const idData = location.state?.idData;

  // Track when template fetch is completed
  const [isTemplateFetched, setIsTemplateFetched] = useState(false);
  const [kriteria, setKriteria] = useState([]);
  const [pertanyaan, setPertanyaan] = useState({});

  // GET DATA BY ID
  useEffect(() => {
    const fetchKriteria = async () => {
      setLoading(true);
      try {
        const data = await useFetch(
          `${API_LINK}/TemplateSurvei/GetTemplateDataKriteriaSurveiByIdxx`,
          { id: idData },
          "POST"
        );
        console.log("Kriteria Survei :", data);
        setKriteria(data);
      } catch (err) {
        setError("Gagal mengambil data: " + err);
      } finally {
        setLoading(false);
      }
    };

    fetchKriteria();
  }, []);

  useEffect(() => {
    const fetchPertanyaan = async () => {
      setLoading(true);
      try {
        const data = await useFetch(
          `${API_LINK}/TemplateSurvei/GetTemplateDataSPertanyaanSurveiByIdxx`,
          { id: idData },
          "POST"
        );

        console.log("Pertanyaan Survei :", data);
        setPertanyaan(data);
      } catch (err) {
        setError("Gagal mengambil data: " + err);
      } finally {
        setLoading(false);
      }
    };

    fetchPertanyaan();
  }, []);

  useEffect(() => {
    const fetchTemplateData = async () => {
      const body = { idData: idData };
      setLoading(true);

      try {
        const result = await useFetch(
          `${API_LINK}/TemplateSurvei/GetTemplateSurveiById`,
          body,
          "POST"
        );
        console.log("Preview: ", result);
        if (result === "ERROR" || result === null || result.length === 0) {
          setFormData({
            templateName: "",
            createdBy: "",
            createdDate: "",
            modifiedBy: "",
            modifiedDate: "",
            status: "",
          });
        } else {
          const fetchedData = result[0];
          setFormData({
            templateName: fetchedData.namaTemplate,
            createdBy: fetchedData.dibuatOleh,
            createdDate: new Date(fetchedData.dibuatTgl).toLocaleDateString(
              "id-ID",
              {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              }
            ),
            modifiedBy: fetchedData.dimodifOleh || "-",
            modifiedDate: fetchedData.dimodifTgl
              ? new Date(fetchedData.dimodifTgl).toLocaleDateString("id-ID", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })
              : "-",
            status: fetchedData.statusTemplate || "-",
          });
        }
      } catch (err) {
        setError("Gagal mengambil data: " + err);
      } finally {
        setLoading(false);
        setIsTemplateFetched(true); // Mark as fetched
      }
    };

    fetchTemplateData();
  }, [idData]);

  const handleDataChange = (updatedFormData, updatedFiles) => {};

  if (loading) return <Loading />;
  if (error) return <p>{error}</p>;

  return (
    <div className="d-flex flex-column min-vh-100">
      <main className="flex-grow-1 p-3" style={{ marginTop: "80px" }}>
        <div className="d-flex flex-column">
          {/* Breadcrumbs and Page Title */}
          <div className="p-3">
            <PageTitleNav
              title={title}
              breadcrumbs={location.state.breadcrumbs}
              onClick={() => onChangePage("index")}
            />
          </div>
          <div className={isMobile ? "m-0" : "m-3"}>
            {/* Main Content Section */}
            <div
              className={
                isMobile
                  ? "shadow p-4 m-2 mt-0 bg-white rounded"
                  : "shadow p-5 m-5 mt-0 bg-white rounded"
              }
            >
              <HeaderForm label="Preview Template Survei" />

              <div className="border bg-white rounded mt-5 p-3">
                <div className="row">
                  <div className="col-lg-6 col-md-6">
                    <DetailData
                      label="Nama Template"
                      isi={formData.templateName}
                    />
                    <DetailData label="Dibuat Oleh" isi={formData.createdBy} />
                    <DetailData
                      label="Dibuat Tanggal"
                      isi={formData.createdDate}
                    />
                  </div>
                  <div className="col-lg-6 col-md-6">
                    <DetailData label="Status" isi={formData.status} />
                    <DetailData
                      label="Dimodifikasi Oleh"
                      isi={formData.modifiedBy}
                    />
                    <DetailData
                      label="Dimodifikasi Tanggal"
                      isi={formData.modifiedDate}
                    />
                  </div>
                </div>
              </div>
              <TabPreviewSurvei
                header={kriteria}
                pertanyaan={pertanyaan}
                mode="detailSurvei"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
