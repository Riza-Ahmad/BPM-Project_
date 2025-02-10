import React from "react";
import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useFetch } from "../../../util/useFetch";
import { API_LINK } from "../../../util/Constants";
import { useIsMobile } from "../../../util/useIsMobile";
import PageTitleNav from "../../../part/PageTitleNav";
import HeaderForm from "../../../part/HeaderText";
import DetailData from "../../../part/DetailData";
import Loading from "../../../part/Loading";
import { decodeHtml } from "../../../util/DecodeHtml";

export default function Detail({ onChangePage }) {
  const title = "Detail Data";
  const breadcrumbs = [
    { label: "SPME" },
    { label: "Status Akreditasi" },
    { label: "IKU & IKT" },
  ];
  const isMobile = useIsMobile();

  const location = useLocation();
    const [loading, setLoading] = useState(true);
  const idMenu = location.state?.idMenu;
  const idData = location.state?.idData;

  const [formData, setFormData] = useState({
    idIka: "",
    staNasIka: "",
    staPelIka: "",
    namaIka: "",
    jenisIka: "",
    picIka: "",
    parentIka: "",
    targetIka: "",
    aktualIka: "",
    capaianIka: "",
    createdBy: "",
    createdDate: "",
    modifiedBy: "",
    modifiedDate: "",
  });

  useEffect(() => {
    const fetchStandar = async () => {
      setLoading(true);
      const result = await useFetch(
        `${API_LINK}/MasterIndikatorKinerja/GetDataIndikatorKinerjaById`,
        { idData: idData },
        "POST"
      ).finally(() => setLoading(false));

      if (result === "ERROR") {
        formData({});
      } else {
        const StandarArr = Object.values(result);
        const data = StandarArr[0];
        setFormData(data);
      }
    };

    fetchStandar();
  }, [location.state]);

  if (loading) return <Loading />
  
  return (
    <div className="d-flex flex-column min-vh-100">
      <main className="flex-grow-1 p-3" style={{ marginTop: "80px" }}>
        <div className="d-flex flex-column">
          <div className="container mb-3">
            <div className="p-3">
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
              <HeaderForm label="Data Indikator Kinerja" />
              <div className="row mb-3">
                <div className="col-lg-12 col-md-12">
                  <DetailData label="Nama Indikator" isi={decodeHtml( formData.namaIka || "-")} />
                </div>
                <div className="col-lg-6 col-md-6">
                  <DetailData label="Standar Nasional" isi={formData.staNamaNasIka || "-"} />
                </div>
                <div className="col-lg-6 col-md-6">
                  <DetailData label="Standar PT" isi={formData.staNamaPelIka || "-"} />
                </div>
                <div className="col-lg-6 col-md-6">
                  <DetailData label="Bagian IKU" isi={decodeHtml( formData.parentNamaIka || "-")} />
                </div>
                <div className="col-lg-6 col-md-6">
                  <DetailData label="Jenis Indikator" isi={formData.jenisIka === 'IKU' ? 'Indikator Kinerja Utama' : 'Indikator Kinerja Tambahan'} />
                </div>
                <div className="col-lg-6 col-md-6">
                  <DetailData label="PIC" isi={formData.picIka || "-"} />
                </div>
                <div className="col-lg-6 col-md-6">
                  <DetailData label="Target" isi={formData.targetIka || "-"} />
                </div>
                <div className="col-lg-6 col-md-6">
                  <DetailData label="Aktual" isi={formData.aktualIka || "-"} />
                </div>
                <div className="col-lg-6 col-md-6">
                  <DetailData label="Status Capaian" isi={formData.capaianIka || "-"} />
                </div>
                <div className="col-lg-6 col-md-6">
                  <DetailData label="Dibuat Oleh" isi={formData.createdBy || "-"} />
                </div>
                <div className="col-lg-6 col-md-6">
                  <DetailData label="Dibuat Tanggal" isi={formData.createdDate || "-"} />
                </div>
                <div className="col-lg-6 col-md-6">
                  <DetailData label="Dimodifikasi Oleh" isi={formData.modifiedBy || "-"} />
                </div>
                <div className="col-lg-6 col-md-6">
                  <DetailData label="Dimodifikasi Tanggal" isi={formData.modifiedDate || "-"} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
