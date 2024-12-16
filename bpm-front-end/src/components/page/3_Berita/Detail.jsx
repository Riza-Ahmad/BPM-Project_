import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import PageTitleNav from "../../part/PageTitleNav";
import HeaderForm from "../../part/HeaderText";
import DetailData from "../../part/DetailData";
import { API_LINK, BERITAFOTO_LINK } from "../../util/Constants";
import Loading from "../../part/Loading";
import { useIsMobile } from "../../util/useIsMobile";
import { useFetch } from "../../util/useFetch";

export default function Detail({ onChangePage }) {
  const isMobile = useIsMobile();
  const location = useLocation();

  const [formData, setFormData] = useState({
    title: "",
    date: "",
    description: "",
    author: "",
    images: [],
    dibuatOleh: "",
    dibuatTgl: "",
    dimodifOleh: "",
    dimodifTgl: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const title = "Edit Berita";
  const breadcrumbs = [
    { label: "Berita", href: "/berita" },
    { label: "Kelola Berita", href: "/berita/kelola" },
    { label: "Edit Berita" },
  ];

  useEffect(() => {
    if (!location.state?.idData) return;

    const editId = location.state.idData;
    setLoading(true);

    const fetchData = async () => {
      try {
        const data = await useFetch(
          API_LINK + `/MasterBerita/GetDataBeritaById`,
          { id: editId }
        );
        if (data?.berita?.length > 0) {
          const berita = JSON.parse(data.berita)[0];
          const foto = JSON.parse(data.foto);
          const images = foto.map((fotoItem) => fotoItem.foto_path);

          setFormData({
            title: berita.judulBerita,
            date: format(new Date(berita.tglBerita), "EEEE, dd MMMM yyyy", {
              locale: id,
            }),
            description: berita.isiBerita,
            author: berita.penulisBerita,
            images: images,
            dibuatOleh: berita.dibuatOleh,
            dibuatTgl: new Date(berita.dibuatTgl).toLocaleDateString("id-ID", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            }),
            dimodifOleh: berita.dimodifOleh ? berita.dimodifOleh : "-",
            dimodifTgl: berita.dimodifTgl
              ? new Date(berita.dimodifTgl).toLocaleDateString("id-ID", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })
              : "-",
          });
        } else {
          console.warn("Data not found or empty.");
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

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <main className="flex-grow-1 p-3" style={{ marginTop: "80px" }}>
        <div className="d-flex flex-column">
          {/* Breadcrumbs */}
          <div className={isMobile ? "m-0" : "m-3"}>
            <PageTitleNav
              title={title}
              breadcrumbs={breadcrumbs}
              onClick={() => onChangePage("read")}
            />
          </div>
          {/* Main Content */}
          <div
            className={
              isMobile
                ? "shadow p-4 m-2 mt-0 bg-white rounded"
                : "shadow p-5 p-5 m-5 mt-0 bg-white rounded"
            }
          >
            <HeaderForm label="Formulir Berita" />
            {error && <p className="text-danger">{error}</p>}
            <div className="row">
              <div className="col-lg-6 col-md-6">
                <DetailData label="Judul Berita" isi={formData.title} />
                <DetailData label="Penulis" isi={formData.author} />
              </div>
              <div className="col-lg-6 col-md-6">
                <DetailData label="Tanggal Berita" isi={formData.date} />
              </div>
            </div>
            <DetailData label="Isi Berita" isi={formData.description} />
            <div className="row">
              <label htmlFor={id} className="form-label fw-bold">
                Foto
              </label>
              {formData.images.length > 0 ? (
                formData.images.map((image, index) => (
                  <div key={index} className="col-4 mb-3">
                    <img
                      src={`${BERITAFOTO_LINK}${image}`}
                      alt={`Foto Berita ${index + 1}`}
                      className="img-fluid"
                      style={{ height: "100%" }}
                    />
                  </div>
                ))
              ) : (
                <p className="text-muted">Tidak ada foto yang tersedia.</p>
              )}
            </div>
            <div className="row">
              <div className="col-lg-6 col-md-6">
                <DetailData label="Dibuat Oleh" isi={formData.dibuatOleh} />
                <DetailData label="Dibuat Tanggal" isi={formData.dibuatTgl} />
              </div>
              <div className="col-lg-6 col-md-6">
                <DetailData
                  label="Dimodifikasi Oleh"
                  isi={formData.dimodifOleh}
                />
                <DetailData
                  label="Dimodifikasi Tanggal"
                  isi={formData.dimodifTgl}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
