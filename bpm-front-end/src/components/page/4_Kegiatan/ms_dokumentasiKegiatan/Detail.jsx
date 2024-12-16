import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import PageTitleNav from "../../../part/PageTitleNav";
import DetailData from "../../../part/DetailData";
import HeaderForm from "../../../part/HeaderText";
import Loading from "../../../part/Loading";
import { API_LINK, KEGIATANFILE_LINK } from "../../../util/Constants";
import { useIsMobile } from "../../../util/useIsMobile";
import moment from "moment";
import "moment-timezone";
import { useFetch } from "../../../util/useFetch";

export default function Detail({ onChangePage }) {
  const title = "Detail Dokumentasi Kegiatan";
  const breadcrumbs = [
    { label: "Dokumentasi Kegiatan", href: "/kegiatan/dokumentasi" },
    {
      label: "Kelola Dokumentasi Kegiatan",
      href: "/kegiatan/dokumentasi/kelola",
    },
    { label: "Detail Dokumentasi Kegiatan" },
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
    jenisKegiatan: "",
  });

  useEffect(() => {
    if (!location.state?.idData) return;

    const editId = location.state.idData;
    setLoading(true);

    const fetchData = async () => {
      try {
        const data = await useFetch(
          API_LINK + `/MasterKegiatan/GetDataKegiatanById`,
          { id: editId }
        );
        if (data) {
          setFormData({
            name: data[0].namaKegiatan,
            description: data[0].deksripsiKegiatan,
            startDate: new Date(data[0].tglMulaiKegiatan).toLocaleDateString(
              "id-ID",
              {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              }
            ),
            endDate: new Date(data[0].tglSelesaiKegiatan).toLocaleDateString(
              "id-ID",
              {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              }
            ),
            startTime: moment
              .tz(data[0].jamMulaiKegiatan, "HH:mm:ss", "Asia/Jakarta")
              .format("HH:mm [WIB]"),

            endTime: moment
              .tz(data[0].jamSelesaiKegiatan, "HH:mm:ss", "Asia/Jakarta")
              .format("HH:mm [WIB]"),

            place: data[0].tempatKegiatan,
            statusFileNotulen: data[0].statusFileNotulenKegiatan,
            linkFolder: data[0].linkFolderKegiatan,
            fileNotulen: data[0].fileNotulenKegiatan,
            fotoSampul: data[0].fotoSampulKegiatan,
            Createby: data[0].dibuatOleh,
            CreateDate: new Date(data[0].dibuatTgl).toLocaleDateString(
              "id-ID",
              {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              }
            ),
            Modifby: data[0].dimodifOleh ? data[0].dimodifOleh : "-",
            ModifDate: data[0].dimodifTgl
              ? new Date(data[0].dimodifTgl).toLocaleDateString("id-ID", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })
              : "-",
            status:
              data[0].kategoriKegiatan === "1"
                ? "Rencana"
                : data[0].kategoriKegiatan === "2"
                ? "Terlewat"
                : "Terlaksana",
            jenisKegiatan: data[0].namaJenisKegiatan,
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
            <HeaderForm label="Formulir Dokumentasi Kegiatan" />
            <div className="row">
              <div className="col-lg-6 col-md-6">
                <DetailData label="Nama Kegiatan" isi={formData.name} />
                <DetailData
                  label="Jenis Kegiatan"
                  isi={formData.jenisKegiatan}
                />
                <DetailData label="Tanggal Mulai" isi={formData.startDate} />
                <DetailData label="Waktu Mulai" isi={formData.startTime} />
              </div>
              <div className="col-lg-6 col-md-6">
                <DetailData label="Tempat" isi={formData.place} />
                <DetailData label="Status" isi={formData.status} />
                <DetailData label="Tanggal Selesai" isi={formData.endDate} />
                <DetailData label="Waktu Selesai" isi={formData.endTime} />
              </div>
            </div>
            <DetailData label="Deskripsi Singkat" isi={formData.description} />
            <div className="row">
              <div className="col-lg-6 col-md-6">
                <div className="mb-3">
                  <label className="form-label fw-bold">
                    Link Folder Dokumentasi
                  </label>{" "}
                  <br></br>
                  <a
                    href={`${formData.linkFolder}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Link Selengkapnya
                  </a>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold">File Notulensi</label>{" "}
                  <br></br>
                  <a
                    href={`${KEGIATANFILE_LINK}${formData.fileNotulen}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Lihat Pratinjau
                  </a>
                </div>

                <DetailData
                  label="Sifat File Notulensi"
                  isi={formData.statusFileNotulen === 0 ? "Privat" : "Publik"}
                />
              </div>
              <div className="col-lg-6 col-md-6">
                <div>
                  <label className="form-label fw-bold">Foto Sampul</label>
                  <img
                    src={`${KEGIATANFILE_LINK}${formData.fotoSampul}`}
                    alt="Uploaded"
                    className="img-fluid mb-3"
                    style={{ maxHeight: "80%" }}
                  />
                </div>
              </div>
            </div>
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
