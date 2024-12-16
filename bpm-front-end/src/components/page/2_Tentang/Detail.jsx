import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import PageTitleNav from "../../part/PageTitleNav";
import HeaderForm from "../../part/HeaderText";
import DetailData from "../../part/DetailData";
import { API_LINK, TENTANGFILE_LINK } from "../../util/Constants";
import Loading from "../../part/Loading";
import { useIsMobile } from "../../util/useIsMobile";
import { useFetch } from "../../util/useFetch";

export default function Detail({ onChangePage }) {
  const location = useLocation();
  const isMobile = useIsMobile();

  const [formData, setFormData] = useState({
    Kategori: "",
    Isi: "",
    dibuatOleh: "",
    dibuatTgl: "",
    dimodifOleh: "",
    dimodifTgl: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (location.state?.idData) {
        const editId = location.state.idData;

        const data = await useFetch(
          API_LINK + `/MasterTentang/GetDataTentangById`,
          {
            id: editId,
          }
        );

        if (data && data[0]) {
          setFormData({
            Kategori: data[0].kategoriTentang,
            Isi: data[0].isiTentang,
            dibuatOleh: data[0].dibuatOleh,
            dibuatTgl: new Date(data[0].dibuatTgl).toLocaleDateString("id-ID", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            }),
            dimodifOleh: data[0].dimodifOleh ? data[0].dimodifOleh : "-",
            dimodifTgl: data[0].dimodifTgl
              ? new Date(data[0].dimodifTgl).toLocaleDateString("id-ID", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })
              : "-",
          });
        } else {
          console.error("Data not found or format mismatch.");
        }
      }
    };

    fetchData().finally(() => setLoading(false));
  }, [location.state?.idData]);

  if (loading) {
    return <Loading />;
  }

  const renderContent = () => {
    const id = location.state?.idData;
    const baseURL = TENTANGFILE_LINK;

    if (id === 7) {
      return (
        <div>
          <label htmlFor={id} className="form-label fw-bold">
            Foto Struktur
          </label>
          <img
            src={`${baseURL}${formData.Isi}`}
            alt="Uploaded"
            className="img-fluid mb-3"
          />
        </div>
      );
    } else if (id === 8) {
      return (
        <div className="mb-3">
          <label htmlFor={id} className="form-label fw-bold">
            File SK
          </label>{" "}
          <br></br>
          <a
            href={`${baseURL}${formData.Isi}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Lihat Pratinjau
          </a>
        </div>
      );
    } else {
      return <DetailData label="Isi" isi={formData.Isi} />;
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <main className="flex-grow-1 p-3" style={{ marginTop: "80px" }}>
        <div className="d-flex flex-column">
          <div className={isMobile ? "m-0" : "m-3"}>
            <PageTitleNav
              title="Detail Tentang"
              breadcrumbs={[
                { label: "Tentang", href: "/tentang" },
                { label: "Kelola Tentang", href: "/tentang/kelola" },
                { label: "Detail Tentang" },
              ]}
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
            <HeaderForm label="Formulir Tentang" />
            <DetailData label="Kategori" isi={formData.Kategori} />

            {renderContent()}

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
