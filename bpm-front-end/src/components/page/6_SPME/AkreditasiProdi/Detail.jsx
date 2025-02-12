import React from "react";
import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import PageTitleNav from "../../../part/PageTitleNav";
import HeaderForm from "../../../part/HeaderText";
import InputField from "../../../part/InputField";
import FileUpload from "../../../part/FileUpload";
import Button from "../../../part/Button";
import DropDown from "../../../part/Dropdown";
import { useFetch } from "../../../util/useFetch";
import { uploadFile } from "../../../util/UploadFile";
import { API_LINK } from "../../../util/Constants";
import DocUpload from "../../../part/DocUpload";
import { useIsMobile } from "../../../util/useIsMobile";
import SweetAlert from "../../../util/SweetAlert";
import Loading from "../../../part/Loading";
import { DOKUMEN_LINK } from "../../../util/Constants";
import DetailData from "../../../part/DetailData";

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
  console.log(idMenu);
  console.log(idData);

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

  const handleDownload = async (item) => {
    const id = item.Key;
    if (!id) {
      SweetAlert("Peringatan", "ID file tidak tersedia.", "warning");
      return;
    }

    // try {
    //   const foundItem = filteredData.find((obj) => obj.idDok === id);
    //   const namaInformasi =
    //     foundItem && foundItem["fileDok"] ? foundItem["fileDok"] : `file_${id}`;

    //   const judulDok = foundItem.judulDok;
    //   const controlDok = foundItem.controlDok;
    //   const referensi = foundItem.refDok;
    //   const tanggal = new Date().toLocaleString();

    //   const response = await fetch(`${API_LINK}/MasterDokumen/DownloadFile`, {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({
    //       fileName: namaInformasi,
    //       metadata: {
    //         JudulDokumen: judulDok,
    //         JenisDokumen: controlDok,
    //         DiunduhOleh: namaPengguna,
    //         Jabatan: roleNama,
    //         TanggalUnduh: tanggal,
    //       },
    //     }),
    //   });

    //   if (!response.ok) {
    //     throw new Error("Gagal mengunduh file.");
    //   } else {
    //     const data = await useFetch(
    //       `${API_LINK}/MasterDokumen/CreateUnduhDokumen`,
    //       {
    //         idDok: id,
    //         referensi: referensi,
    //         role: role,
    //         roleNama: roleNama,
    //       },
    //       "POST"
    //     );
    //   }

    //   const blob = await response.blob();
    //   const url = window.URL.createObjectURL(blob);

    //   const link = document.createElement("a");
    //   link.href = url;
    //   link.download = namaInformasi;
    //   document.body.appendChild(link);
    //   link.click();
    //   document.body.removeChild(link);
    //   window.URL.revokeObjectURL(url);
    // } catch (error) {
    //   SweetAlert("Error", error.message, "error");
    // }
  };

  if (loading) return <Loading />;

  return (
    <div className="d-flex flex-column min-vh-100">
      <main className="flex-grow-1 p-3" style={{ marginTop: "80px" }}>
        <div className="d-flex flex-column">
          <div className="container mb-3">
            {/* Breadcrumbs and Page Title */}
            <div className="p-3">
              <PageTitleNav
                title={title}
                breadcrumbs={breadcrumbs}
                onClick={() => onChangePage("index")}
              />
            </div>

            {/* Main Content Section */}
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
              {/* )} */}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
