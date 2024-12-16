import React, { useState, useRef, useEffect } from "react";
import PageTitleNav from "../../../part/PageTitleNav";
import InputField from "../../../part/InputField";
import TextArea from "../../../part/TextArea";
import HeaderForm from "../../../part/HeaderText";
import Button from "../../../part/Button";
import Loading from "../../../part/Loading";
import DropDown from "../../../part/Dropdown";
import FileUpload from "../../../part/FileUpload";
import RadioButton from "../../../part/RadioButton";
import UploadFoto from "../../../part/UploadFoto";
import { uploadFile } from "../../../util/UploadFile";
import { API_LINK } from "../../../util/Constants";
import SweetAlert from "../../../util/SweetAlert";
import { useIsMobile } from "../../../util/useIsMobile";
import { useFetch } from "../../../util/useFetch";

export default function Add({ onChangePage }) {
  const title = "Tambah Dokumentasi Kegiatan";
  const breadcrumbs = [
    { label: "Dokumentasi Kegiatan", href: "/kegiatan/dokumentasi" },
    {
      label: "Kelola Dokumentasi Kegiatan",
      href: "/kegiatan/dokumentasi/kelola",
    },
    { label: "Tambah Dokumentasi Kegiatan" },
  ];
  const isMobile = useIsMobile();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFoto, setSelectedFoto] = useState(null);

  const [formData, setFormData] = useState({
    jenisKegiatan: "",
    name: "",
    description: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    place: "",
    linkFolder: "",
    statusFileNotulen: 0,
  });

  const [jenisKegiatan, setJenisKegiatan] = useState([]);

  useEffect(() => {
    const fetchJenisKegiatan = async () => {
      try {
        const data = await useFetch(
          `${API_LINK}/MasterKegiatan/GetDataJenisKegiatan`,
          JSON.stringify({}),
          "POST"
        );
        const formattedData = data.map((item) => ({
          Value: item.idJenisKegiatan,
          Text: item.namaJenisKegiatan,
        }));
        setJenisKegiatan(formattedData);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchJenisKegiatan();
  }, []);

  const handleFileChange = (file) => {
    setSelectedFile(file);
  };

  const handleFotoChange = (file) => {
    setSelectedFoto(file);
  };

  // Refs for validation
  const namaRef = useRef();
  const deskripsiRef = useRef();
  const tempatRef = useRef();
  const tglMulaiRef = useRef();
  const jamMulaiRef = useRef();
  const tglSelesaiRef = useRef();
  const jamSelesaiRef = useRef();
  const jenisKegiatanRef = useRef();
  const folderLinkRef = useRef();
  const fotoSampulRef = useRef();
  const fileNotulenRef = useRef();
  const statusFileNotulenRef = useRef();

  const handleSubmit = async () => {
    if (!formData.name) {
      SweetAlert("Error", "Nama kegiatan is required", "error", "OK");
      return;
    }

    if (!namaRef.current?.validate()) {
      namaRef.current?.focus();
      return;
    }
    if (!deskripsiRef.current?.validate()) {
      deskripsiRef.current?.focus();
      return;
    }
    if (!tempatRef.current?.validate()) {
      tempatRef.current?.focus();
      return;
    }
    if (!tglMulaiRef.current?.validate()) {
      tglMulaiRef.current?.focus();
      return;
    }
    if (!jamMulaiRef.current?.validate()) {
      jamMulaiRef.current?.focus();
      return;
    }
    if (!tglSelesaiRef.current?.validate()) {
      tglSelesaiRef.current?.focus();
      return;
    }
    if (!jamSelesaiRef.current?.validate()) {
      jamSelesaiRef.current?.focus();
      return;
    }

    if (!jenisKegiatanRef.current?.validate()) {
      jenisKegiatanRef.current?.focus();
      return;
    }

    if (!folderLinkRef.current?.validate()) {
      folderLinkRef.current?.focus();
      return;
    }

    if (fileNotulenRef.current?.value === "") {
      fileNotulenRef.current?.focus();
      return;
    }

    console.log(formData);

    const startDate = new Date(
      `${tglMulaiRef.current.value} ${jamMulaiRef.current.value}`
    );
    const endDate = new Date(
      `${tglSelesaiRef.current.value} ${jamSelesaiRef.current.value}`
    );

    if (startDate >= endDate) {
      SweetAlert(
        "Gagal!",
        "Tanggal dan waktu mulai harus lebih awal dari tanggal dan waktu selesai.",
        "error",
        "OK"
      );
      return;
    }
    let uploadedFileNotulen = null;
    let uploadedFotoSampul = null;

    if (selectedFile) {
      const folderName = "Kegiatan";
      const filePrefix = "NOTULEN";
      uploadedFileNotulen = await uploadFile(
        selectedFile,
        folderName,
        filePrefix
      );
    }

    if (selectedFoto) {
      const folderName = "Kegiatan";
      const filePrefix = "FOTO";
      uploadedFotoSampul = await uploadFile(
        selectedFoto,
        folderName,
        filePrefix
      );
    }

    setFormData((prevData) => {
      const newFormData = {
        ...prevData,
        fileNotulen: uploadedFileNotulen[0],
        fotoSampul: uploadedFotoSampul[0],
      };

      console.log(newFormData);

      setLoading(true);
      useFetch(
        `${API_LINK}/MasterKegiatan/CreateDokumentasiKegiatan`,
        newFormData,
        "POST"
      )
        .then((response) => {
          if (response === "ERROR") {
            throw new Error("Gagal memperbarui data");
          }
          SweetAlert(
            "Berhasil!",
            "Dokumentasi kegiatan berhasil dibuat.",
            "success",
            "OK"
          ).then(() => onChangePage("read"));
        })
        .catch((error) => {
          SweetAlert("Gagal!", error.message, "error", "OK");
        })
        .finally(() => {
          setLoading(false);
        });

      return newFormData;
    });
  };

  if (loading) return <Loading />;
  if (error) return <p>{error}</p>;

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
            <HeaderForm label="Formulir Dokumentasi Kegiatan" />
            <div className="row">
              <InputField
                ref={namaRef}
                label="Nama Kegiatan"
                value={formData.name || ""}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                isRequired={true}
                maxChar="100"
              />
              <div className="col-lg-6 col-md-6">
                <DropDown
                  ref={jenisKegiatanRef}
                  arrData={jenisKegiatan}
                  label="Jenis Kegiatan"
                  type="pilih"
                  forInput="jenisKegiatan"
                  value={formData.jenisKegiatan}
                  onChange={(e) =>
                    setFormData({ ...formData, jenisKegiatan: e.target.value })
                  }
                  isRequired={true}
                />
              </div>
              <div className="col-lg-6 col-md-6">
                <InputField
                  ref={tempatRef}
                  label="Tempat"
                  value={formData.place}
                  onChange={(e) =>
                    setFormData({ ...formData, place: e.target.value })
                  }
                  isRequired={true}
                  maxChar="50"
                />
              </div>
            </div>
            <div className="row">
              <div className="col-lg-6 col-md-6">
                <InputField
                  ref={tglMulaiRef}
                  label="Tanggal Mulai"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                  isRequired={true}
                  type="date"
                />
                <InputField
                  ref={jamMulaiRef}
                  label="Waktu Mulai"
                  value={formData.startTime}
                  onChange={(e) =>
                    setFormData({ ...formData, startTime: e.target.value })
                  }
                  isRequired={true}
                  type="time"
                />
              </div>
              <div className="col-lg-6 col-md-6">
                <InputField
                  ref={tglSelesaiRef}
                  label="Tanggal Selesai"
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData({ ...formData, endDate: e.target.value })
                  }
                  isRequired={true}
                  type="date"
                />
                <InputField
                  ref={jamSelesaiRef}
                  label="Waktu Selesai"
                  value={formData.endTime}
                  onChange={(e) =>
                    setFormData({ ...formData, endTime: e.target.value })
                  }
                  isRequired={true}
                  type="time"
                />
              </div>
            </div>
            <TextArea
              ref={deskripsiRef}
              label="Deskripsi Singkat"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              isRequired={true}
            />

            <div className="row">
              <div className="col-lg-6 col-md-6">
                <InputField
                  ref={folderLinkRef}
                  label="Link Folder Dokumentasi"
                  value={formData.linkFolder || ""} // Fallback ke string kosong
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      linkFolder: e.target.value,
                    }))
                  }
                  isRequired={true}
                />
                <FileUpload
                  ref={fileNotulenRef}
                  label="File Notulensi"
                  forInput="upload-file"
                  formatFile=".pdf"
                  onChange={(file) => handleFileChange(file)}
                  isRequired="true"
                />
                <RadioButton
                  ref={statusFileNotulenRef}
                  label="Sifat File Notulensi"
                  name="options"
                  arrData={[
                    { Value: 0, Text: "Privat" },
                    { Value: 1, Text: "Publik" },
                  ]}
                  value={Number(formData.statusFileNotulen) || 0} // Fallback ke string kosong
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      statusFileNotulen: e.target.value,
                    }))
                  }
                  isRequired={true}
                />
              </div>
              <div className="col-lg-6 col-md-6">
                <UploadFoto
                  id="upload-foto"
                  label="Foto Sampul"
                  onChange={(file) => handleFotoChange(file)}
                  isRequired="true"
                />
              </div>
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
