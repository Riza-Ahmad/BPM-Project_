import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import PageTitleNav from "../../../part/PageTitleNav";
import DetailData from "../../../part/DetailData";
import HeaderForm from "../../../part/HeaderText";
import Loading from "../../../part/Loading";
import { API_LINK } from "../../../util/Constants";
import { useIsMobile } from "../../../util/useIsMobile";
import moment from "moment";
import "moment-timezone";

export default function Detail({ onChangePage }) {
  const title = "Detail Jadwal Kegiatan";
  const breadcrumbs = [
    { label: "Jadwal Kegiatan", href: "/kegiatan/jadwal" },
    { label: "Kelola Jadwal Kegiatan", href: "/kegiatan/jadwal/kelola" },
    { label: "Detail Jadwal Kegiatan" },
  ];
  const isMobile = useIsMobile();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    place: "",
    Createby: "",
    CreateDate: "",
    Modifby: "",
    ModifDate: "",
    status: "",
  });

  useEffect(() => {
    if (!location.state?.idData) return;

    const editId = location.state.idData;
    setLoading(true);

    const fetchData = async () => {
      try {
        const response = await fetch(
          `${API_LINK}/MasterKegiatan/GetDataKegiatanById`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ keg_id: editId }),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data) {
          setFormData({
            name: data[0].keg_nama,
            description: data[0].keg_deskripsi,
            startDate: new Date(data[0].keg_tgl_mulai).toLocaleDateString(
              "id-ID",
              {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              }
            ),
            endDate: new Date(data[0].keg_tgl_selesai).toLocaleDateString(
              "id-ID",
              {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              }
            ),
            startTime: moment
              .tz(data[0].keg_jam_mulai, "HH:mm:ss", "Asia/Jakarta")
              .format("HH:mm [WIB]"),

            endTime: moment
              .tz(data[0].keg_jam_selesai, "HH:mm:ss", "Asia/Jakarta")
              .format("HH:mm [WIB]"),

            place: data[0].keg_tempat,
            Createby: data[0].keg_created_by,
            CreateDate: new Date(data[0].keg_created_date).toLocaleDateString(
              "id-ID",
              {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              }
            ),
            Modifby: data[0].keg_modif_by ? data[0].keg_modif_by : "-",
            ModifDate: data[0].keg_modif_date
              ? new Date(data[0].keg_modif_date).toLocaleDateString("id-ID", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })
              : "-",
            status:
              data[0].keg_kategori === "1"
                ? "Rencana"
                : data[0].keg_category === "2"
                ? "Terlewat"
                : "Terlaksana",
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to fetch data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [location.state?.idData]);

  if (loading) return <Loading />;
  if (error) return <p>{error}</p>;

  return (
    <div className="d-flex flex-column min-vh-100">
      <main className="flex-grow-1 p-3" style={{ marginTop: "80px" }}>
        <div className="d-flex flex-column">
          <div className={isMobile ? "m-0" : "m-3"}>
            <PageTitleNav
              title={title}
              breadcrumbs={breadcrumbs}
              onClick={() => onChangePage("read")}
            />
          </div>
          <div
            className={
              isMobile
                ? "shadow p-4 m-2 mt-0 bg-white rounded"
                : "shadow p-5 m-5 mt-0 bg-white rounded"
            }
          >
            <HeaderForm label="Formulir Jadwal Kegiatan" />
            <div className="row">
              <div className="col-lg-6 col-md-6">
                <DetailData label="Nama Kegiatan" isi={formData.name} />
                <DetailData label="Tanggal Mulai" isi={formData.startDate} />
                <DetailData label="Waktu Mulai" isi={formData.startTime} />
                <DetailData label="Status" isi={formData.status} />
              </div>
              <div className="col-lg-6 col-md-6">
                <DetailData label="Tempat" isi={formData.place} />
                <DetailData label="Tanggal Selesai" isi={formData.endDate} />
                <DetailData label="Waktu Selesai" isi={formData.endTime} />
              </div>
            </div>
            <DetailData label="Deskripsi Singkat" isi={formData.description} />
            <div className="row">
              <div className="col-lg-6 col-md-6">
                <DetailData label="Dibuat Oleh" isi={formData.Createby} />
                <DetailData label="Dibuat Tanggal" isi={formData.CreateDate} />
              </div>
              <div className="col-lg-6 col-md-6">
                <DetailData label="Dimodifikasi Oleh" isi={formData.Modifby} />
                <DetailData
                  label="Dimodifikasi Tanggal"
                  isi={formData.ModifDate}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
