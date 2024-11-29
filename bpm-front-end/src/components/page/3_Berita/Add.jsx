import React, { useRef, useState } from "react";
import PageTitleNav from "../../part/PageTitleNav";
import TextField from "../../part/TextField";
import TextArea from "../../part/TextArea";
import DatePicker from "../../part/DatePicker";
import UploadFoto from "../../part/UploadFotoMulti";
import HeaderForm from "../../part/HeaderText";
import Button from "../../part/Button";
import { API_LINK } from "../../util/Constants";
import SweetAlert from "../../util/SweetAlert";
import { useIsMobile } from "../../util/useIsMobile";

export default function Add({ onChangePage }) {
  const title = "Tambah Berita";
  const breadcrumbs = [
    { label: "Berita", href: "/berita" },
    { label: "Kelola Berita", href: "/berita/kelola" },
    { label: "Tambah Berita" },
  ];
  const isMobile = useIsMobile();

  const [images, setImages] = useState([]);
  const [isiBerita, setIsiBerita] = useState("");

  // Refs untuk input
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
      const formData = new FormData();
      images.forEach((file) => formData.append("files", file));

      const uploadResponse = await fetch(
        `${API_LINK}/MasterBerita/UploadFiles`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!uploadResponse.ok) {
        throw new Error("Gagal mengunggah gambar");
      }

      const uploadedFileNames = await uploadResponse.json();

      const beritaData = {
        ber_judul: judulRef.current.value,
        ber_tgl: tanggalRef.current.value,
        ber_isi: isiBerita,
        ber_status: 1,
        ber_created_by: penulisRef.current.value,
        fotoList: uploadedFileNames,
      };

      const createResponse = await fetch(
        `${API_LINK}/MasterBerita/CreateBerita`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(beritaData),
        }
      );

      if (!createResponse.ok) {
        throw new Error("Gagal menambahkan berita");
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

  const handleIsiChange = (e) => {
    setIsiBerita(e.target.value);
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <main className="flex-grow-1 p-3" style={{ marginTop: "80px" }}>
        <div className="d-flex flex-column">
          <div className={isMobile ? "m-0" : "m-3"}>
            <PageTitleNav
              title={title}
              breadcrumbs={breadcrumbs}
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
            <HeaderForm label="Formulir Berita" />
            <div className="row">
              <div className="col-lg-6 col-md-6">
                <TextField
                  ref={judulRef}
                  label="Judul Berita"
                  isRequired={true}
                />
                <TextField ref={penulisRef} label="Penulis" isRequired={true} />
              </div>
              <div className="col-lg-6 col-md-6">
                <DatePicker
                  ref={tanggalRef}
                  label="Tanggal Berita"
                  isRequired={true}
                />
              </div>
            </div>
            <TextArea
              ref={isiRef}
              label="Isi Berita"
              value={isiBerita}
              onChange={handleIsiChange}
              isRequired={true}
            />
            <div className="row">
              <UploadFoto
                ref={fotoRef}
                label="Masukkan Foto"
                onChange={handleUploadChange}
                multiple
                isRequired={true}
              />
            </div>
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
      </main>
    </div>
  );
}
