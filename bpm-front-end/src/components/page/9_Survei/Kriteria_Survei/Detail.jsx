import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { API_LINK } from "../../../util/Constants";
import { useIsMobile } from "../../../util/useIsMobile";
import PageTitleNav from "../../../part/PageTitleNav";
import Button from "../../../part/Button";
import Swal from "sweetalert2";

export default function Detail({ onChangePage }) {
  const { id } = useParams();
  const isMobile = useIsMobile();
  const [detailData, setDetailData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const response = await fetch(
          `${API_LINK}/MasterKriteriaSurvei/GetDataKriteriaSurveiById`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ksr_id: id }),
          }
        );

        if (!response.ok) {
          throw new Error("Gagal mengambil data detail");
        }

        const result = await response.json();
        setDetailData(result[0]);
      } catch (error) {
        console.error("Error fetching detail:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Gagal mengambil data detail",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!detailData) {
    return <div>Data tidak ditemukan</div>;
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <main className="flex-grow-1 p-3" style={{ marginTop: "80px" }}>
        <div className="d-flex flex-column">
          <div className={isMobile ? "m-0 p-0" : "m-3 mb-0"}>
            <PageTitleNav
              title="Detail Kriteria Survei"
              breadcrumbs={[
                { label: "Kriteria Survei", href: "/survei/kriteria" },
                { label: "Detail", href: `/survei/kriteria/detail/${id}` },
              ]}
            />
          </div>
          <div className={isMobile ? "p-2 m-2" : "p-3 m-5"}>
            <div className="bg-white p-4 rounded">
              <div className="row">
                <div className="col-12 mb-4">
                  <h5>Nama Kriteria</h5>
                  <p>{detailData.ksr_nama}</p>
                </div>
                <div className="col-md-6">
                  <h5>Dibuat Oleh</h5>
                  <p>{detailData.ksr_created_by}</p>
                  <h5>Tanggal Dibuat</h5>
                  <p>{detailData.ksr_created_date}</p>
                </div>
                <div className="col-md-6">
                  <h5>Dimodifikasi Oleh</h5>
                  <p>{detailData.ksr_modif_by || "-"}</p>
                  <h5>Tanggal Dimodifikasi</h5>
                  <p>{detailData.ksr_modif_date || "-"}</p>
                </div>
              </div>
              <div className="mt-4">
                <Button
                  classType="danger"
                  label="Kembali"
                  onClick={() => onChangePage("index")}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
