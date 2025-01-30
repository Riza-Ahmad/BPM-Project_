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

const arrData = [
  { Value: "Controlled Copy", Text: "Controlled Copy" },
  { Value: "Uncontrolled Copy", Text: "Uncontrolled Copy" },
];

export default function Edit({ onChangePage }) {
  const title = "Edit Data";
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

  const [currentStep, setCurrentStep] = useState(1);
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

  const [fileSK, setFileSK] = useState(null);
  const [fileSertif, setFileSertif] = useState(null);

  const kodeAkrRef = useRef();
  const namaAkrRef = useRef();
  const jenjangAkrRef = useRef();
  const wilayahAkrRef = useRef();
  const peringkatAkrRef = useRef();
  const nomorSKAkrRef = useRef();
  const berlakuAkrRef = useRef();
  const kadaluarsaAkrRef = useRef();
  const judulDokSKAkrRef = useRef();
  const jenisDokSKAkrRef = useRef();
  const judulDokSertifAkrRef = useRef();
  const jenisDokSertifAkrRef = useRef();
  const fileSertifAkrRef = useRef();
  const fileSKAkrRef = useRef();

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    // e.preventDefault();

    const isKodeAkrValid = kodeAkrRef.current?.validate();
    const isNamaAkrValid = namaAkrRef.current?.validate();
    const isJenjangAkrValid = jenjangAkrRef.current?.validate();
    const isWilayahAkrValid = wilayahAkrRef.current?.validate();
    const isPeringkatAkrValid = peringkatAkrRef.current?.validate();
    const isNomorSKAkrValid = nomorSKAkrRef.current?.validate();
    const isBerlakuAkrValid = berlakuAkrRef.current?.validate();
    const isKadaluarsaAkrValid = kadaluarsaAkrRef.current?.validate();
    const isJudulDokSKAkrValid = judulDokSKAkrRef.current?.validate();
    const isJenisDokSKAkrValid = jenisDokSKAkrRef.current?.validate();
    const isJudulDokSertifAkrValid = judulDokSertifAkrRef.current?.validate();
    const isJenisDokSertifAkrValid = jenisDokSertifAkrRef.current?.validate();
    const isFileSKAkrValid = fileSKAkrRef.current?.validate();
    const isFileSertifAkrValid = fileSertifAkrRef.current?.validate();

    if (!isKodeAkrValid) {
      kodeAkrRef.current?.focus();
      return;
    }
    if (!isNamaAkrValid) {
      namaAkrRef.current?.focus();
      return;
    }
    if (!isJenjangAkrValid) {
      jenjangAkrRef.current?.focus();
      return;
    }
    if (!isWilayahAkrValid) {
      wilayahAkrRef.current?.focus();
      return;
    }
    if (!isPeringkatAkrValid) {
      peringkatAkrRef.current?.focus();
      return;
    }
    if (!isNomorSKAkrValid) {
      nomorSKAkrRef.current?.focus();
      return;
    }
    if (!isBerlakuAkrValid) {
      berlakuAkrRef.current?.focus();
      return;
    }
    if (!isKadaluarsaAkrValid) {
      kadaluarsaAkrRef.current?.focus();
      return;
    }

    try {
      let SKfile = null;
      let Sertiffile = null;
      const folderName = "Dokumen";

      const AkreData = {
        idAkr: idData,
        kodeAkr: formData.kodeAkr,
        namaAkr: formData.namaAkr,
        jenjangAkr: formData.jenjangAkr,
        wilayahAkrRef: formData.wilayahAkr,
        nomorSKAkr: formData.nomorSKAkr ? formData.nomorSKAkr : "",
        tahunAkr: formData.berlakuAkr
          ? new Date(formData.berlakuAkr).getFullYear()
          : "",
        peringkatAkr: formData.peringkatAkr ? formData.peringkatAkr : "",
        kadaluarsaAkr: formData.kadaluarsaAkr ? formData.kadaluarsaAkr : "",
        SKAkr: SKfile ? SKfile : "",
        SertifAkr: Sertiffile ? Sertiffile : "",
      };

      console.log(AkreData);

      const createResponse = await useFetch(
        `${API_LINK}/MasterAkreditasi/EditDataAkreditasi`,
        AkreData,
        "POST"
      );

      if (createResponse === "ERROR") {
        throw new Error("Gagal memperbarui data");
      } else {
        SweetAlert(
          "Berhasil!",
          "Data berhasil ditambahkan.",
          "success",
          "OK"
        ).then(() =>
          onChangePage("index", {
            idMenu: idMenu,
          })
        );
      }
    } catch (error) {
      console.error("Error:", error.message);
      SweetAlert("Gagal!", error.message, "error", "OK");
    }
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
                <HeaderForm label="Formulir Akreditasi" />
                <div className="row mb-3">
                  <div className="col-lg-6 col-md-6 ">
                    <InputField
                      ref={kodeAkrRef}
                      label="Kode Prodi"
                      value={formData.kodeAkr}
                      onChange={handleChange}
                      isRequired={true}
                      name="kodeAkr"
                      type="text"
                      maxChar="10"
                    />
                  </div>
                  <div className="col-lg-6 col-md-6">
                    <InputField
                      ref={namaAkrRef}
                      label="Nama Prodi"
                      value={formData.namaAkr}
                      onChange={handleChange}
                      isRequired={true}
                      name="namaAkr"
                      type="text"
                      maxChar="100"
                    />
                  </div>
                  <div className="col-lg-6 col-md-6">
                    <InputField
                      ref={jenjangAkrRef}
                      label="Jenjang"
                      value={formData.jenjangAkr}
                      onChange={handleChange}
                      isRequired={true}
                      name="jenjangAkr"
                      type="text"
                      maxChar="10"
                    />
                  </div>
                </div>
              </div>
              <div>
                <div className="row mb-3">
                  <div className="col-lg-6 col-md-6">
                    <InputField
                      ref={peringkatAkrRef}
                      label="Peringkat"
                      value={formData.peringkatAkr}
                      onChange={handleChange}
                      isRequired={false}
                      name="peringkatAkr"
                      type="text"
                      maxChar="20"
                    />
                  </div>
                  <div className="col-lg-6 col-md-6">
                    <InputField
                      ref={nomorSKAkrRef}
                      label="Nomor SK"
                      value={formData.nomorSKAkr}
                      onChange={handleChange}
                      isRequired={false}
                      name="nomorSKAkr"
                      type="text"
                      maxChar="20"
                    />
                  </div>
                  <div className="col-lg-6 col-md-6">
                    <InputField
                      ref={berlakuAkrRef}
                      label="Tahun SK"
                      value={formData.berlakuAkr ? formData.berlakuAkr : null}
                      onChange={handleChange}
                      isRequired={false}
                      name="berlakuAkr"
                      type="number"
                    />
                  </div>
                  <div className="col-lg-6 col-md-6">
                    <InputField
                      ref={kadaluarsaAkrRef}
                      label="Tanggal Kadaluwarsa SK"
                      value={formData.kadaluarsaAkr ? formData.kadaluarsaAkr.toString().split('T')[0] : null}
                      onChange={handleChange}
                      isRequired={false}
                      name="kadaluarsaAkr"
                      type="date"
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="d-flex justify-content-between align-items-center">
                  <div className="flex-grow-1 m-2">
                    <Button
                      classType="primary"
                      type="submit"
                      label="Submit"
                      width="100%"
                      onClick={handleSubmit}
                    />
                  </div>
                  <div className="flex-grow-1 m-2">
                    <Button
                      classType="danger"
                      type="button"
                      label="Batal"
                      width="100%"
                      onClick={() =>
                        onChangePage("index", {
                          idMenu: idMenu,
                        })
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
