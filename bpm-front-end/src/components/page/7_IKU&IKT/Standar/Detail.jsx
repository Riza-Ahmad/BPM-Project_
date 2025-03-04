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
    namaSta: "",
    jenisSta: "",
    tahunSta: "",
    urutanSta: "",
    parentSta: "",
  });

  useEffect(() => {
    const fetchStandar = async () => {
      setLoading(true);
      const result = await useFetch(
        `${API_LINK}/MasterStandar/GetDataStandarById`,
        { idData: idData },
        "POST"
      ).finally(() => setLoading(false));

      if (result === "ERROR") {
        formData({});
      } else {
        const StandarArr = Object.values(result);
        setFormData({
            namaSta: decodeHtml(StandarArr[0].judulSta),
            jenisSta: StandarArr[0].jenisSta,
            tahunSta: StandarArr[0].tahunSta,
            urutanSta: StandarArr[0].urutanSta,
            parentSta: StandarArr[0].parentIdSta,
            path: StandarArr[0].path,
        });
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
              <HeaderForm label="Data Standar" />
              <div className="row mb-3">
                <div className="col-lg-6 col-md-6">
                  <DetailData label="Nama Standar" isi={formData.namaSta} />
                </div>
                <div className="col-lg-6 col-md-6">
                  <DetailData label="Jenis Standar" isi={formData.jenisSta} />
                </div>
                <div className="col-lg-6 col-md-6">
                  <DetailData label="Tahun" isi={formData.tahunSta} />
                </div>
                <div className="col-lg-6 col-md-6">
                  <DetailData label="Urutan" isi={formData.urutanSta} />
                </div>
                <div className="col-lg-6 col-md-6">
                  <DetailData label="Path" isi={formData.path || "-"} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
