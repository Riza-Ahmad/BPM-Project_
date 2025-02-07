import React from "react";
import { useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import PageTitleNav from "../../../part/PageTitleNav";
import TextField from "../../../part/InputField";
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

const arrData = [
  { Value: "Controlled Copy", Text: "Controlled Copy" },
  { Value: "Uncontrolled Copy", Text: "Uncontrolled Copy" },
];

const arrProdi = [
  { Value: "min.png", Text: "Manajemen Informatika" },
  { Value: "mk.png", Text: "Mekatronika" },
  { Value: "mo.png", Text: "Mesin Otomotif" },
  { Value: "p4.png", Text: "Pembuatan Peralatan dan Perkakas Produksi" },
  { Value: "tkbg.png", Text: "Teknik Konstruksi Bangunan" },
  { Value: "tpm.png", Text: "Teknik Produksi dan Manufaktur" },
];

export default function Add({ onChangePage }) {
  const title = "Tambah Data";
  const breadcrumbs = [
    { label: "SPME" },
    { label: "Status Akreditasi" },
    { label: "Program Studi" },
  ];
  const isMobile = useIsMobile();

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
    img: "",
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
    console.log("masuk sini");

    try {
      const AkreData = {
        kodeAkr: formData.kodeAkr,
        namaAkr: formData.namaAkr,
        jenjangAkr: formData.jenjangAkr,
        wilayahAkrRef: "",
        nomorSKAkr: formData.nomorSKAkr ? formData.nomorSKAkr : "",
        tahunAkr: formData.berlakuAkr,
        peringkatAkr: formData.peringkatAkr ? formData.peringkatAkr : "",
        kadaluarsaAkr: formData.kadaluarsaAkr ? formData.kadaluarsaAkr : "",
        SKAkr: "",
        SertifAkr: "",
        img: formData.img,
      };

      console.log(AkreData);

      // const isExist = await useFetch(
      //   `${API_LINK}/MasterAkreditasi/CheckDataAkreditasiExist`,
      //   {
      //     param1: formData.kodeAkr,
      //     param2: formData.namaAkr,
      //     param3: formData.jenjangAkr,
      //   },
      //   "POST"
      // );

      // if (isExist.length > 0) {
      //   SweetAlert("Gagal!", "Data sudah ada.", "error", "OK");
      //   return;
      // }

      const createResponse = await useFetch(
        `${API_LINK}/MasterAkreditasi/CreateDataAkreditasi`,
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
                      maxChar="20"
                    />
                  </div>
                  <div className="col-lg-6 col-md-6">
                    <DropDown
                      name="img"
                      arrData={arrProdi}
                      type="pilih"
                      label="Image"
                      value={formData.img || ""}
                      onChange={handleChange}
                      isRequired={true}
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
                      maxChar="50"
                    />
                  </div>
                  <div className="col-lg-6 col-md-6">
                    <InputField
                      ref={berlakuAkrRef}
                      label="Tahun SK"
                      value={formData.berlakuAkr}
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
                      value={formData.kadaluarsaAkr}
                      onChange={handleChange}
                      isRequired={false}
                      name="kadaluarsaAkr"
                      type="date"
                    />
                  </div>
                  {/* <div className="col-lg-6 col-md-6">
                    <InputField
                      ref={judulDokSKAkrRef}
                      label="Judul Dokumen SK"
                      value={formData.judulDokSKAkr}
                      onChange={handleChange}
                      isRequired={false}
                      name="judulDokSKAkr"
                      type="text"
                    />
                  </div>
                  <div className="col-lg-6 col-md-6">
                    <DropDown
                      arrData={arrData}
                      type="pilih"
                      label="Jenis Dokumen SK"
                      forInput="jenisDokSKAkr"
                      isRequired={false}
                      onChange={handleChange}
                      value={formData.jenisDokSKAkr}
                      ref={jenisDokSKAkrRef}
                    />
                  </div>
                  <FileUpload
                    label="Dokumen SK"
                    forInput="fileSKAkrRef"
                    onChange={(item) => setFileSK(item)}
                    name="fileSKAkrRef"
                    ref={fileSKAkrRef}
                    isRequired={false}
                  /> */}
                </div>
              </div>
              <div className="row">
                {/* <div className="col-lg-6 col-md-6">
                  <InputField
                    ref={judulDokSertifAkrRef}
                    label="Judul Dokumen Sertifikat"
                    value={formData.judulDokSertifAkr}
                    onChange={handleChange}
                    isRequired={false}
                    name="judulDokSertifAkr"
                    type="text"
                    maxChar="100"
                  />
                </div>
                <div className="col-lg-6 col-md-6">
                  <DropDown
                    arrData={arrData}
                    type="pilih"
                    label="Jenis Dokumen Sertifikat"
                    forInput="jenisDokSertifAkr"
                    isRequired={false}
                    onChange={handleChange}
                    value={formData.jenisDokSertifAkr}
                    ref={jenisDokSertifAkrRef}
                  />
                </div>
                <FileUpload
                  label="Dokumen Sertifikat"
                  forInput="fileSertifAkr"
                  onChange={(item) => setFileSertif(item)}
                  name="fileSertifAkr"
                  ref={fileSertifAkrRef}
                  isRequired={false}
                /> */}

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
