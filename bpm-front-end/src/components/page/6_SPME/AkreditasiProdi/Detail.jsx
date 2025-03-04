import React from "react";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import PageTitleNav from "../../../part/PageTitleNav";
import HeaderForm from "../../../part/HeaderText";
import { useFetch } from "../../../util/useFetch";
import { API_LINK } from "../../../util/Constants";
import { useIsMobile } from "../../../util/useIsMobile";
import SweetAlert from "../../../util/SweetAlert";
import Loading from "../../../part/Loading";
import DetailData from "../../../part/DetailData";
import { formatDate } from "../../../util/Formatting";

export default function Detail({ onChangePage }) {
  const title = "Detail Data";
  const breadcrumbs = [
    { label: "SPME" },
    { label: "Status Akreditasi" },
    { label: "Program Studi" },
  ];
  const isMobile = useIsMobile();
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const idMenu = location.state?.idMenu;
  const idData = location.state?.idData;

  const [formData, setFormData] = useState({
    kodeAkr: "",
    namaAkr: "",
    jenjangAkr: "",
    wilayahAkr: "",
    peringkatAkr: "",
    nomorSKAkr: "",
    berlakuAkr: "",
    kadaluarsaAkr: "",
    judulDokSKAkr: "",
    jenisDokSKAkr: "",
    judulDokSertifAkr: "",
    jenisDokSertifAkr: "",
    img: "",
  });

  useEffect(() => {
    const fetchAkreProdi = async () => {
      setLoading(true);
      try {
        const result = await useFetch(
          `${API_LINK}/MasterAkreditasi/GetAkreditasiProdiById`,
          { idData: idData },
          "POST"
        );

        if (result === "ERROR" || result === null || result.length === 0) {
        } else {
          const arrRe = Object.values(result);
          const obj = arrRe[0];
          setFormData({
            kodeAkr: obj.kodeAkr,
            namaAkr: obj.namaAkr,
            jenjangAkr: obj.jenjangAkr,
            wilayahAkr: obj.wilayahAkr,
            peringkatAkr: obj.peringkatAkr,
            nomorSKAkr: obj.noAkr,
            berlakuAkr: obj.tahunAkr,
            kadaluarsaAkr: obj.expAkr,
            judulDokSKAkr: obj.judulSkAkr,
            fileSkAkr: obj.fileSkAkr,
            judulDokSertifAkr: obj.judulSertifAkr,
            fileSertifAkr: obj.fileSertifAkr,
            img: obj.image,
          });
        }
      } catch (err) {
        setError("Gagal mengambil data: " + err);
      } finally {
        setLoading(false);
      }
    };
    fetchAkreProdi();
  }, [location.state?.idData]);

  if (loading) return <Loading />;

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
              {/** Step 1: Personal Information */}
              {/* {currentStep === 1 && ( */}
              <div>
                <HeaderForm label="Detail Data Akreditasi" />
                <div className="row mb-3">
                  <div className="col-lg-6 col-md-6 ">
                    <DetailData
                      label="Kode Prodi"
                      isi={formData.kodeAkr ? formData.kodeAkr : "-"}
                    />
                  </div>
                  <div className="col-lg-6 col-md-6">
                    <DetailData
                      label="Nama Prodi"
                      isi={formData.namaAkr ? formData.namaAkr : "-"}
                    />
                  </div>
                  <div className="col-lg-6 col-md-6">
                    <DetailData
                      label="Jenjang"
                      isi={formData.jenjangAkr ? formData.jenjangAkr : "-"}
                    />
                  </div>
                  <div className="col-lg-6 col-md-6">
                    <div>
                      <label className="form-label fw-bold">Foto Elemen</label>
                      <br />
                      <img
                        src={
                          formData.img ? `/programStudi/${formData.img}` : ""
                        }
                        alt="Uploaded"
                        className="img-fluid mb-3"
                        style={{ maxHeight: "8rem" }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div className="row mb-3">
                  <div className="col-lg-6 col-md-6">
                    <DetailData
                      label="Peringkat"
                      isi={formData.peringkatAkr ? formData.peringkatAkr : "-"}
                    />
                  </div>
                  <div className="col-lg-6 col-md-6">
                    <DetailData
                      label="Nomor SK"
                      isi={formData.nomorSKAkr ? formData.nomorSKAkr : "-"}
                    />
                  </div>
                  <div className="col-lg-6 col-md-6">
                    <DetailData
                      label="Tanggal Mulai Berlaku SK"
                      isi={formData.berlakuAkr ? formData.berlakuAkr : "-"}
                    />
                  </div>
                  <div className="col-lg-6 col-md-6">
                    <DetailData
                      label="Tanggal Kadaluwarsa SK"
                      isi={
                        formData.kadaluarsaAkr ? formData.kadaluarsaAkr : "-"
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
