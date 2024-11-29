import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import PageTitleNav from "../../part/PageTitleNav";
import TextField from "../../part/TextField";
import TextArea from "../../part/TextArea";
import DatePicker from "../../part/DatePicker";
import UploadFoto from "../../part/UploadFotoMulti";
import HeaderForm from "../../part/HeaderText";
import Button from "../../part/Button";
import SweetAlert from "../../util/SweetAlert";
import { API_LINK } from "../../util/Constants";
import { format } from "date-fns";
import { useIsMobile } from "../../util/useIsMobile";

export default function Edit({ onChangePage }) {
  const isMobile = useIsMobile();
  const location = useLocation();
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    description: "",
    author: "",
    images: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tempImages, setTempImages] = useState([]);

  const judulRef = useRef();
  const penulisRef = useRef();
  const tanggalRef = useRef();
  const isiRef = useRef();
  const fotoRef = useRef();

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
        const response = await fetch(
          `${API_LINK}/MasterBerita/GetDataBeritaById`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ ber_id: editId }),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data?.berita?.length > 0) {
          const berita = data.berita[0];
          const images = data.foto?.map((foto) => foto.foto_path) || [];

          setFormData({
            title: berita.ber_judul,
            date: format(new Date(berita.ber_tgl), "yyyy-MM-dd"),
            description: berita.ber_isi,
            author: berita.ber_created_by,
            images: images,
          });
          setTempImages(images);
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

  const handleUploadChange = (updatedFiles) => {
    setTempImages(updatedFiles);
  };

  const handleSubmit = async () => {
    const isJudulValid = judulRef.current?.validate();
    const isPenulisValid = penulisRef.current?.validate();
    const isTanggalValid = tanggalRef.current?.validate();
    const isIsiValid = isiRef.current?.validate();
    const isFotoValid = fotoRef.current?.validate();
    console.log(
      isJudulValid,
      isPenulisValid,
      isTanggalValid,
      isIsiValid,
      isFotoValid
    );

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

    setLoading(true);
    setError(null);

    try {
      if (!formData.title || !formData.date || !formData.description) {
        throw new Error("Semua kolom wajib diisi.");
      }

      const existingPaths = tempImages.filter((img) => typeof img === "string");
      const newFiles = tempImages.filter((img) => img instanceof File);

      let uploadedPaths = [];
      if (newFiles.length > 0) {
        const formDataUpload = new FormData();
        newFiles.forEach((file) => formDataUpload.append("files", file));

        const uploadResponse = await fetch(
          `${API_LINK}/MasterBerita/UploadFiles`,
          {
            method: "POST",
            body: formDataUpload,
          }
        );

        if (!uploadResponse.ok) {
          throw new Error(
            `Gagal mengunggah file: ${uploadResponse.statusText}`
          );
        }

        uploadedPaths = await uploadResponse.json(); // Asumsikan ini array path
      }

      const finalImagePaths = [...existingPaths, ...uploadedPaths];

      const response = await fetch(`${API_LINK}/MasterBerita/EditBerita`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ber_id: location.state?.idData,
          title: formData.title,
          date: formData.date,
          description: formData.description,
          modif_by: formData.author,
          images: finalImagePaths,
        }),
      });

      if (!response.ok) {
        throw new Error(`Gagal mengubah berita: ${response.statusText}`);
      }

      SweetAlert(
        "Berhasil!",
        "Data berhasil ditambahkan.",
        "success",
        "OK"
      ).then(() => onChangePage("read"));
    } catch (error) {
      console.error("Error saat menyimpan:", error);
      SweetAlert("Gagal!", error.message, "error", "OK");
    } finally {
      setLoading(false);
    }
  };

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
          <div
            className={
              isMobile
                ? "shadow p-4 m-2 mt-0 bg-white rounded"
                : "shadow p-5 m-5 mt-0 bg-white rounded"
            }
          >
            <HeaderForm label="Formulir Berita" />
            {loading && <p>Loading...</p>}
            {error && <p className="text-danger">{error}</p>}
            <div className="row">
              <div className="col-lg-6 col-md-6">
                <TextField
                  ref={judulRef}
                  label="Judul Berita"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  isRequired={true}
                />
                <TextField
                  ref={penulisRef}
                  label="Penulis"
                  value={formData.author}
                  onChange={(e) =>
                    setFormData({ ...formData, author: e.target.value })
                  }
                  isRequired={true}
                />
              </div>
              <div className="col-lg-6 col-md-6">
                <DatePicker
                  ref={tanggalRef}
                  label="Tanggal Berita"
                  value={formData.date}
                  onChange={(date) => setFormData({ ...formData, date: date })}
                />
              </div>
            </div>
            <TextArea
              ref={isiRef}
              label="Isi Berita"
              initialValue={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
            <div className="row">
              <UploadFoto
                ref={fotoRef}
                label="Foto"
                initialImages={tempImages}
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
