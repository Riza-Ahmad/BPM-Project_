import React, { useState, useRef, useEffect } from "react";
import PageTitleNav from "../../part/PageTitleNav";
import InputField from "../../part/InputField";
import TextArea from "../../part/TextArea";
import UploadFoto from "../../part/UploadFotoMulti";
import HeaderForm from "../../part/HeaderText";
import Button from "../../part/Button";
import { API_LINK } from "../../util/Constants";
import SweetAlert from "../../util/SweetAlert";
import { useIsMobile } from "../../util/useIsMobile";
import { useFetch } from "../../util/useFetch";
import { useLocation } from "react-router-dom";

export default function Add({ onChangePage }) {
  const title = "Tambah Berita";
  const breadcrumbs = [
    { label: "Berita", href: "/berita" },
    { label: "Kelola Berita", href: "/berita/kelola" },
    { label: "Tambah Berita" },
  ];
  const isMobile = useIsMobile();
  const location = useLocation();

  const [formData, setFormData] = useState({
    judul: location.state?.judul ? location.state.judul : "",
    penulis: "",
    tanggal: "",
    isi: location.state?.deskripsi ? location.state.deskripsi : "",
    fotoList: [],
  });

  const [images, setImages] = useState([]);
  const judulRef = useRef();
  const penulisRef = useRef();
  const tanggalRef = useRef();
  const isiRef = useRef();
  const fotoRef = useRef();

  const handleUploadChange = (updatedFiles) => {
    setImages(updatedFiles);
  };

  const handleSubmit = async () => {
    const isJudulValid = judulRef.current?.validate();
    const isPenulisValid = penulisRef.current?.validate();
    const isTanggalValid = tanggalRef.current?.validate();
    const isIsiValid = isiRef.current?.validate();
    const isFotoValid = fotoRef.current?.validate();

    if (!isJudulValid) {
      judulRef.current?.focus();
      return;
    }
    if (!isPenulisValid) {
      penulisRef.current?.focus();
      return;
    }
    if (!isTanggalValid) {
      tanggalRef.current?.focus();
      return;
    }
    if (!isIsiValid) {
      isiRef.current?.focus();
      return;
    }
    if (!isFotoValid) {
      fotoRef.current?.focus();
      return;
    }

    try {
      // Upload foto
      const formDataUpload = new FormData();
      images.forEach((file) => formDataUpload.append("files", file));

      const folderName = "Berita";
      const filePrefix = "FOTO";

      const uploadResponse = await fetch(
        `${API_LINK}/Upload/UploadFiles?folderName=${encodeURIComponent(
          folderName
        )}&filePrefix=${encodeURIComponent(filePrefix)}`,
        {
          method: "POST",
          body: formDataUpload,
        }
      );

      if (!uploadResponse.ok) {
        throw new Error("Gagal mengunggah gambar");
      }

      const uploadedFileNames = await uploadResponse.json();
      const beritaData = {
        judul: formData.judul,
        tgl: formData.tanggal,
        isi: formData.isi,
        penulis: formData.penulis,
        fotoList: uploadedFileNames,
      };

      const createResponse = await useFetch(
        `${API_LINK}/MasterBerita/CreateBerita`,
        beritaData,
        "POST"
      );

      if (createResponse === "ERROR") {
        throw new Error("Gagal memperbarui data");
      }

      SweetAlert(
        "Berhasil!",
        "Data berhasil ditambahkan.",
        "success",
        "OK"
      ).then(() => onChangePage("read"));
    } catch (error) {
      console.error("Error:", error.message);
      SweetAlert("Gagal!", error.message, "error", "OK");
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <main className="flex-grow-1 p-3" style={{ marginTop: "80px" }}>
        <div className="d-flex flex-column">
          <PageTitleNav
            title={title}
            breadcrumbs={breadcrumbs}
            onClick={() => onChangePage("read")}
          />
          <div className={isMobile ? "m-0" : "m-3"}>
            <div
              className={
                isMobile
                  ? "shadow p-4 m-2 mt-0 bg-white rounded"
                  : "shadow p-5 m-5 mt-0 bg-white rounded"
              }
            >
              <HeaderForm label="Formulir Berita" />
              <div className="row">
                <div className="col-lg-6 col-md-6">
                  <InputField
                    ref={judulRef}
                    label="Judul Berita"
                    value={formData.judul}
                    onChange={(e) =>
                      setFormData({ ...formData, judul: e.target.value })
                    }
                    isRequired={true}
                    name="judul"
                    maxChar="100"
                  />
                  <InputField
                    ref={penulisRef}
                    label="Penulis"
                    value={formData.penulis}
                    onChange={(e) =>
                      setFormData({ ...formData, penulis: e.target.value })
                    }
                    isRequired={true}
                    name="penulis"
                    maxChar="50"
                  />
                </div>
                <div className="col-lg-6 col-md-6">
                  <InputField
                    ref={tanggalRef}
                    label="Tanggal Berita"
                    value={formData.tanggal}
                    onChange={(e) =>
                      setFormData({ ...formData, tanggal: e.target.value })
                    }
                    isRequired={true}
                    name="tanggal"
                    type="date"
                  />
                </div>
              </div>
              <TextArea
                ref={isiRef}
                label="Isi Berita"
                value={formData.isi}
                onChange={(e) =>
                  setFormData({ ...formData, isi: e.target.value })
                }
                isRequired={true}
              />
              <UploadFoto
                ref={fotoRef}
                label="Masukkan Foto"
                onChange={handleUploadChange}
                multiple
                isRequired={true}
              />
              <div className="d-flex justify-content-between align-items-center">
                <div className="flex-grow-1 m-2">
                  <Button
                    classType="primary"
                    type="button"
                    label="Simpan"
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
                    onClick={() => onChangePage("read")}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
