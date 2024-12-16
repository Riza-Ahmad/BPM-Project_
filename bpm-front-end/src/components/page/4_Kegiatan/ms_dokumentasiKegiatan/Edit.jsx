import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import PageTitleNav from "../../../part/PageTitleNav";
import InputField from "../../../part/InputField";
import TextArea from "../../../part/TextArea";
import DropDown from "../../../part/Dropdown";
import HeaderForm from "../../../part/HeaderText";
import Button from "../../../part/Button";
import Loading from "../../../part/Loading";
import { API_LINK, KEGIATANFILE_LINK } from "../../../util/Constants";
import SweetAlert from "../../../util/SweetAlert";
import { useIsMobile } from "../../../util/useIsMobile";
import moment from "moment";
import "moment-timezone";
import { useFetch } from "../../../util/useFetch";
import { decodeHtml } from "../../../util/DecodeHtml";
import FileUpload from "../../../part/FileUpload";
import RadioButton from "../../../part/RadioButton";
import UploadFoto from "../../../part/UploadFoto";
import { uploadFile } from "../../../util/UploadFile";

export default function Edit({ onChangePage }) {
  const title = "Edit Dokumentasi Kegiatan";
  const breadcrumbs = [
    { label: "Dokumentasi Kegiatan", href: "/kegiatan/dokumentasi" },
    {
      label: "Kelola Dokumentasi Kegiatan",
      href: "/kegiatan/dokumentasi/kelola",
    },
    { label: "Edit Dokumentasi Kegiatan" },
  ];
  const isMobile = useIsMobile();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFoto, setSelectedFoto] = useState(null);
  const [formData, setFormData] = useState({
    id: location.state?.idData,
    name: "",
    description: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    place: "",
    jenisKegiatan: "",
    linkFolder: "",
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

  useEffect(() => {
    if (!location.state?.idData) return;

    const editId = location.state.idData;
    setLoading(true);

    const fetchData = async () => {
      try {
        const data = await useFetch(
          API_LINK + `/MasterKegiatan/GetDataKegiatanById`,
          { id: editId }
        );

        if (data) {
          setFormData({
            id: location.state.idData,
            jenisKegiatan: data[0].idJenisKegiatan,
            name: data[0].namaKegiatan,
            description: decodeHtml(data[0].deskripsiKegiatan),
            startDate: moment(data[0].tglMulaiKegiatan).format("YYYY-MM-DD"),
            startTime: moment(data[0].jamMulaiKegiatan, "HH:mm:ss").format(
              "HH:mm"
            ),
            endDate: moment(data[0].tglSelesaiKegiatan).format("YYYY-MM-DD"),
            endTime: moment(data[0].jamSelesaiKegiatan, "HH:mm:ss").format(
              "HH:mm"
            ),

            place: data[0].tempatKegiatan,
            statusFileNotulen: data[0].statusFileNotulenKegiatan,
            linkFolder: data[0].linkFolderKegiatan,
            fileNotulen: data[0].fileNotulenKegiatan,
            fotoSampul: data[0].fotoSampulKegiatan,
          });
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

  const handleFileChange = (file) => {
    setSelectedFile(file);
  };

  const handleFotoChange = (file) => {
    setSelectedFoto(file);
  };

  const handleSubmit = async () => {
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

    if (!jenisKegiatanRef.current?.value) {
      jenisKegiatanRef.current?.focus();
      return;
    }

    if (!folderLinkRef.current?.validate()) {
      folderLinkRef.current?.focus();
      return;
    }

    // Combine date and time values into Date objects
    const startDate = new Date(
      `${tglMulaiRef.current.value} ${jamMulaiRef.current.value}`
    );
    const endDate = new Date(
      `${tglSelesaiRef.current.value} ${jamSelesaiRef.current.value}`
    );

    // Validate that start date is less than end date
    if (startDate >= endDate) {
      SweetAlert(
        "Gagal!",
        "Tanggal dan waktu mulai harus lebih awal dari tanggal dan waktu selesai.",
        "error",
        "OK"
      );
      return;
    }

    let updatedFileNotulen = formData.fileNotulen;
    let updatedFotoSampul = formData.fotoSampul;

    if (selectedFile) {
      const folderName = "Kegiatan";
      const filePrefix = "NOTULEN";
      const uploadedFile = await uploadFile(
        selectedFile,
        folderName,
        filePrefix
      );
      updatedFileNotulen = uploadedFile[0]; // Hasil upload digunakan langsung
    }

    if (selectedFoto) {
      const folderName = "Kegiatan";
      const filePrefix = "FOTO";
      const uploadedFoto = await uploadFile(
        selectedFoto,
        folderName,
        filePrefix
      );
      updatedFotoSampul = uploadedFoto[0]; // Hasil upload digunakan langsung
    }

    const updatedFormData = {
      ...formData,
      fileNotulen: updatedFileNotulen,
      fotoSampul: updatedFotoSampul,
    };

    console.log(updatedFormData);

    setLoading(true);
    try {
      const response = await useFetch(
        `${API_LINK}/MasterKegiatan/EditDokumentasiKegiatan`,
        updatedFormData,
        "POST"
      );

      if (response === "ERROR") {
        throw new Error("Gagal memperbarui data");
      }

      SweetAlert(
        "Berhasil!",
        "Jadwal kegiatan berhasil dibuat.",
        "success",
        "OK"
      ).then(() => onChangePage("read"));
    } catch (error) {
      SweetAlert("Gagal!", error.message, "error", "OK");
    } finally {
      setLoading(false);
    }
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
                value={formData.name}
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
              initialValue={formData.description}
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
                  hasExisting={KEGIATANFILE_LINK + formData.fileNotulen}
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
                  hasExisting={KEGIATANFILE_LINK + formData.fotoSampul}
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
