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

export default function Detail({ onChangePage }) {
  const isMobile = useIsMobile();
  const location = useLocation();

  const [formData, setFormData] = useState({
    title: "",
    date: "",
    description: "",
    author: "",
    images: [],
    Createby: "",
    CreateDate: "",
    Modifby: "",
    ModifDate: "",
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
        const response = await fetch(`${API_LINK}/api/MasterBerita/GetDataBeritaById`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ber_id: editId }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data?.berita?.length > 0) {
          const berita = data.berita[0];
          const images = data.foto?.map((foto) => foto.foto_path) || [];

          setFormData({
            title: berita.ber_judul,
            date: format(new Date(berita.ber_tgl), "EEEE, dd MMMM yyyy", { locale: id }),
            description: berita.ber_isi,
            author: berita.ber_created_by,
            images: images,
            Createby: berita.ber_created_by,
            CreateDate: format(new Date(berita.ber_created_date), "EEEE, dd MMMM yyyy", { locale: id }),
            Modifby: berita.ber_modif_by?berita.ber_modif_by:"-",
            ModifDate: berita.ber_modif_date 
                        ? format(new Date(berita.ber_modif_date), "EEEE, dd MMMM yyyy", { locale: id }) 
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
          <div className={isMobile ? "shadow p-4 m-2 mt-0 bg-white rounded" : "shadow p-5 p-5 m-5 mt-0 bg-white rounded"}>
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
                <label htmlFor={id} className="form-label fw-bold">Foto Struktur</label> 
              {formData.images.length > 0 ? (
                formData.images.map((image, index) => (
                  <div key={index} className="col-4 mb-3">
                    <img
                      src={`${BERITAFOTO_LINK}${image}`}
                      alt={`Foto Berita ${index + 1}`}
                      className="img-fluid"
                      style={{height:"100%"}}
                    />
                  </div>
                ))
              ) : (
                <p className="text-muted">Tidak ada foto yang tersedia.</p>
              )}
            </div>
            <div className="row">
                <div className="col-lg-6 col-md-6">
                    <DetailData label="Dibuat Oleh" isi={formData.Createby}/>
                    <DetailData label="Dibuat Tanggal" isi={formData.CreateDate}/>
                </div>
                <div className="col-lg-6 col-md-6">
                    <DetailData label="Dimodifikasi Oleh" isi={formData.Modifby}/>
                    <DetailData label="Dimodifikasi Tanggal" isi={formData.ModifDate}/>
                </div>
            </div>   
          </div>
        </div>
      </main>
    </div>
  );
}
