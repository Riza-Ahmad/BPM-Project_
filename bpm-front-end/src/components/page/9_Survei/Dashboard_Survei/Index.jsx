import React, { useState, useEffect } from "react";
import PageTitleNav from "../../../part/PageTitleNav";
import { API_LINK } from "../../../util/Constants";
import { useIsMobile } from "../../../util/useIsMobile";
import { useFetch } from "../../../util/useFetch";
import BarChart from "../../../part/BarChart";
import Loading from "../../../part/Loading";
import Breadcrumbs from "../../../part/Breadcrumbs";

const breadcrumbs = [{ label: "Dashboard Survei" }];
export default function Dashboard_Survei({ onChangePage }) {
  const isMobile = useIsMobile();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dataBarChartDosen, setDataBarChartDosen] = useState([]);
  const [dataBarChartTenagaPendidik, setDataBarChartTenagaPendidik] = useState(
    []
  );
  const [dataBarChartMitra, setDataBarChartMitra] = useState([]);
  const fetchTemplateDataChart = async () => {
    setLoading(true);
    const bodyTenagaPendidik = { Respoden: "ROL03" };
    const bodyDosen = { Respoden: "ROL09" };
    const bodyMitra = { Respoden: "ROL10" };
    console.log("Data BarChart : ", bodyTenagaPendidik);

    try {
      const result = await useFetch(
        `${API_LINK}/TransaksiSurvei/GetDataBarChartTransaksiSurveiByRolexx`,
        bodyTenagaPendidik,
        "POST"
      );
      console.log("Data BarChart : ", result);

      if (result === "ERROR" || result === null || result.length === 0) {
        setDataBarChartTenagaPendidik([]);
      } else {
        const fetchedData = result;
        setDataBarChartTenagaPendidik(fetchedData);
      }

      const result1 = await useFetch(
        `${API_LINK}/TransaksiSurvei/GetDataBarChartTransaksiSurveiByRolexx`,
        bodyDosen,
        "POST"
      );
      console.log("Data BarChart Dosen : ", result1);

      if (result1 === "ERROR" || result1 === null || result1.length === 0) {
        setDataBarChartDosen([]);
      } else {
        const fetchedData = result1;
        setDataBarChartDosen(fetchedData);
      }

      const result2 = await useFetch(
        `${API_LINK}/TransaksiSurvei/GetDataBarChartTransaksiSurveiByRolexx`,
        bodyMitra,
        "POST"
      );
      console.log("Data BarChart Mitra : ", result2);

      if (result2 === "ERROR" || result2 === null || result2.length === 0) {
        setDataBarChartMitra([]);
      } else {
        const fetchedData = result2;
        setDataBarChartMitra(fetchedData);
      }
    } catch (err) {
      setError("Gagal mengambil data: " + err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplateDataChart();
  }, []);

  if (loading) return <Loading />;
  if (error) return <p>{error}</p>;
  return (
    <div className="d-flex flex-column min-vh-100">
      <main className="flex-grow-1 p-3" style={{ marginTop: "80px" }}>
        <div className="d-flex flex-column">
          <div className={isMobile ? "m-0 p-0" : "m-3 mb-0"}>
            <h1 style={{ color: "#2654A1", margin: "0", fontWeight: "700" }}>
              Dashboard Survei
            </h1>
            <Breadcrumbs breadcrumbs={breadcrumbs} />
          </div>
          <div
            className={isMobile ? "p-2 m-2 mt-2 mb-0" : "p-3 m-5 mt-2 mb-0"}
            style={{ marginLeft: "50px" }}
          >
            <div className="row mt-4 col-12">
              <div className="col-md-6">
                <div className="form-control">
                  <BarChart
                    labels={"Survei Tenaga Pendidik All"}
                    sourceData={dataBarChartTenagaPendidik}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-control">
                  <BarChart
                    labels={"Survei Dosen All"}
                    sourceData={dataBarChartDosen}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-control">
                  <BarChart
                    labels={"Survei Mitra Kerjasama"}
                    sourceData={dataBarChartMitra}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
