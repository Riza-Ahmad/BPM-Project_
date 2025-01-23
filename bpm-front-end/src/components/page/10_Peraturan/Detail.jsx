import React, { useState, useEffect, useRef } from "react";
import PageTitleNav from "../../part/PageTitleNav";
import HeaderForm from "../../part/HeaderText";
import { useLocation, useNavigate } from "react-router-dom";
import { API_LINK } from "../../util/Constants";
import { useIsMobile } from "../../util/useIsMobile";
import { useFetch } from "../../util/useFetch";
import Loading from "../../part/Loading";
import DetailData from "../../part/DetailData";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toISOString().split("T")[0]; // Mengambil hanya bagian tanggal
};

export default function Detail({ onChangePage }) {
  const isMobile = useIsMobile();
  const [error, setError] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();
  const idMenu = location.state?.idMenu;
  const idData = location.state?.idData;
  const [loading, setLoading] = useState(true); // New loading state
  const [title, setTitle] = useState("");
  const [titleHeader, setTitleHeader] = useState("");
  const [breadcrumbs, setBreadcrumbs] = useState([]);
  const [formData, setFormData] = useState({
    idDok: "",
    judulDokumen: "",
    nomorInduk: "",
    tahunDokumen: "",
    tahunKadaluarsa: "",
    jenisDokumen: "",
  });

  useEffect(() => {
    if (!idMenu) {
      navigate("*");
    }
  }, [location.state?.idMenu]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await useFetch(
          `${API_LINK}/MasterPeraturan/GetDataPeraturanById`,
          {
            idData: idData,
          },
          "POST"
        );
        if (data.length > 0) {
          // Mengubah format tanggal untuk tahunDokumen dan tahunKadaluarsa
          setFormData({
            idDok: data[0].idDok || "",
            judulDokumen: data[0].judulDokumen || "",
            nomorInduk: data[0].nomorInduk || "",
            tahunDokumen: formatDate(data[0].tahunDokumen) || "", // Memformat tanggal
            tahunKadaluarsa: formatDate(data[0].tahunKadaluarsa) || "", // Memformat tanggal
            jenisDokumen: data[0].jenisDokumen || "",
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
        }
      } catch (error) {
        setError("Gagal mengambil data kegiatan");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [location.state]);

  useEffect(() => {
    let newTitle = "";
    let newTitleHeader = "";
    let newBreadcrumbs = [];

    if (idMenu === 39) {
      newTitle = "Detail Peraturan";
      newTitleHeader = "Formulir Kebijakan Peraturan";
      newBreadcrumbs = [
        {
          label: "Peraturan",
          href: "/peraturan/kebijakan",
        },
        {
          label: "Kebijakan Peraturan",
          href: "/peraturan/kebijakan",
        },
        {
          label: "Detail Kebijakan Peraturan",
          href: "",
        },
      ];
    } else if (idMenu === 40) {
      newTitle = "Detail Peraturan Eksternal";
      newTitleHeader = "Formulir Peraturan Eksternal";
      newBreadcrumbs = [
        {
          label: "Peraturan",
          href: "/peraturan/eksternal",
        },
        {
          label: "Peraturan Eksternal",
          href: "/peraturan/eksternal",
        },
        { label: "Detail Peraturan Eksternal", href: "" },
      ];
    } else if (idMenu === 41) {
      newTitle = "Detail Instrumen APS";
      newTitleHeader = "Formulir Instrumen APS";
      newBreadcrumbs = [
        { label: "Peraturan", href: "/peraturan/aps" },
        {
          label: "instrumen APS",
          href: "/peraturan/aps",
        },
        { label: "Detail Instrumen APS", href: "" },
      ];
    }

    setTitle(newTitle);
    setTitleHeader(newTitleHeader);
    setBreadcrumbs(newBreadcrumbs);

    setLoading(false);
  }, [idMenu]);

  if (loading) return <Loading />;

  return (
    <div className="d-flex flex-column min-vh-100">
      <main className="flex-grow-1 p-3" style={{ marginTop: "80px" }}>
        <div className="d-flex flex-column">
          <div className={isMobile ? "m-0" : "m-3"}>
            <PageTitleNav
              title={title}
              breadcrumbs={breadcrumbs}
              onClick={() => onChangePage("index", { idMenu: idMenu })}
            />
          </div>

          <div
            className={
              isMobile
                ? "shadow p-4 m-2 mt-0 bg-white rounded"
                : "shadow p-5 p-5 m-5 mt-0 bg-white rounded"
            }
          >
            <HeaderForm label={titleHeader} />
            <div className="row">
              <DetailData
                label="Judul Dokumen"
                isi={formData.judulDokumen || ""}
              />
            </div>
            <div className="row">
              <div className="col-lg-6 col-md-6">
                <DetailData
                  label="Nomor Induk Dokumen"
                  isi={formData.nomorInduk || ""}
                />
              </div>
              <div className="col-lg-6 col-md-6">
                <DetailData
                  label="Tahun Dokumen"
                  isi={formData.tahunDokumen || ""}
                />
              </div>
              <div className="col-lg-6 col-md-6">
                <DetailData
                  label="Jenis Dokumen"
                  isi={formData.jenisDokumen || ""}
                />
              </div>
              <div className="col-lg-6 col-md-6">
                <DetailData
                  label="Tahun Kadaluarsa"
                  isi={formData.tahunKadaluarsa || ""}
                />
              </div>
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
