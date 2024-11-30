import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import PageTitleNav from "../../part/PageTitleNav";
import HeaderForm from "../../part/HeaderText";
import DetailData from "../../part/DetailData";
import { API_LINK, TENTANGFILE_LINK } from "../../util/Constants";
import Loading from "../../part/Loading";
import { useIsMobile } from "../../util/useIsMobile";

export default function Detail({ onChangePage }) {
  const location = useLocation();
  const isMobile = useIsMobile();

  const [formData, setFormData] = useState({
    Kategori: "",
    Isi: "",
    Createby: "",
    CreateDate: "",
    Modifby: "",
    ModifDate: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (location.state?.idData) {
      const editId = location.state.idData;
      fetch(API_LINK + `/MasterTentang/GetDataTentangById`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ten_id: editId }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data && data[0]) {
            setFormData({
              Kategori: data[0].ten_category,
              Isi: data[0].ten_isi,
              Createby: data[0].ten_created_by,
              CreateDate: new Date(data[0].ten_created_date).toLocaleDateString(
                "id-ID",
                {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                }
              ),
              Modifby: data[0].ten_modif_by ? data[0].ten_modif_by : "-",
              ModifDate: data[0].ten_modif_date
                ? new Date(data[0].ten_modif_date).toLocaleDateString("id-ID", {
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
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        })
        .finally(() => setLoading(false));
    }
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
