import React, { useState, useRef, useEffect } from "react";
import PageTitleNav from "../../../part/PageTitleNav";
import DetailData from "../../../part/DetailData";
import HeaderForm from "../../../part/HeaderText";
import Button from "../../../part/Button";
import Loading from "../../../part/Loading";
import DropDown from "../../../part/Dropdown";
import UploadFoto from "../../../part/UploadFoto";
import RadioButton from "../../../part/RadioButton";
import moment from "moment";
import "moment/locale/id";
moment.locale("id");
import { API_LINK } from "../../../util/Constants";
import { useIsMobile } from "../../../util/useIsMobile";
import InputField from "../../../part/InputField";
import FileUpload from "../../../part/FileUpload";
import { uploadFile } from "../../../util/UploadFile";
import SweetAlert from "../../../util/SweetAlert";
import { useFetch } from "../../../util/useFetch";
import { useLocation } from "react-router-dom";
import { decodeHtml } from "../../../util/DecodeHtml";

export default function AddExisting({ onChangePage }) {
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFoto, setSelectedFoto] = useState(null);

  const [formData, setFormData] = useState({
    id: "",
    statusFileNotulen: 0,
  });

  const [tempForm, settempForm] = useState({
    description: "-",
    place: "-",
    startDate: "-",
    endDate: "-",
    startTime: "-",
    endTime: "-",
    jenisKegiatan: "-",
  });

  const [existingKegiatan, setExistingKegiatan] = useState([]);
  const location = useLocation();

  useEffect(() => {
    const idData = location.state?.idData;

    if (idData && existingKegiatan.length > 0) {
      handleDropdownChange({ target: { value: idData } });
    }
  }, [location.state?.idData, existingKegiatan]); // Tambahkan existingKegiatan sebagai dependency

  const namaRef = useRef();
  const folderLinkRef = useRef();
  const fotoSampulRef = useRef();
  const fileNotulenRef = useRef();
  const statusFileNotulenRef = useRef();

  useEffect(() => {
    const fetchExistingKegiatan = async () => {
      try {
        const data = await useFetch(
          `${API_LINK}/MasterKegiatan/GetDataKegiatanByCategory`,
          { kategori: 2 },
          "POST"
        );
        const formattedData = data.map((item) => ({
          Value: item.idKegiatan,
          Text: decodeHtml(item.namaKegiatan),
          deskripsiJenisKegiatan: decodeHtml(item.deskripsiKegiatan),
          tglMulaiKegiatan: item.tglMulaiKegiatan,
          tglSelesaiKegiatan: item.tglSelesaiKegiatan,
          jamMulaiKegiatan: item.jamMulaiKegiatan,
          jamselesaiKegiatan: item.jamSelesaiKegiatan,
          tempatKegiatan: item.tempatKegiatan,
          namaJenisKegiatan: item.namaJenisKegiatan,
          idJenisKegiatan: item.idJenisKegiatan,
        }));
        setExistingKegiatan(formattedData);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchExistingKegiatan();
  }, []);

  const handleDropdownChange = (e) => {
    const selectedId = e.target.value;
    const selectedData = existingKegiatan.find(
      (item) => item.Value === Number(selectedId)
    );

    if (selectedData) {
      setFormData({
        id: selectedData.Value,
        jenisKegiatan: selectedData.idJenisKegiatan,
        name: selectedData.Text,
        description: selectedData.deskripsiJenisKegiatan,
        startDate: moment(selectedData.tglMulaiKegiatan).format("YYYY-MM-DD"), // Format tanggal
        startTime: moment(selectedData.jamMulaiKegiatan, "HH:mm:ss").format(
          "HH:mm"
        ), // Format waktu
        endDate: moment(selectedData.tglSelesaiKegiatan).format("YYYY-MM-DD"), // Format tanggal
        endTime: moment(selectedData.jamselesaiKegiatan, "HH:mm:ss").format(
          "HH:mm"
        ), // Format waktu
        place: selectedData.tempatKegiatan,
        statusFileNotulen: 0,
      });

      settempForm({
        description: selectedData.deskripsiJenisKegiatan,
        jenisKegiatan: selectedData.namaJenisKegiatan,
        place: selectedData.tempatKegiatan,
        startDate: moment(selectedData.tglMulaiKegiatan).format(
          "dddd, DD MMMM YYYY"
        ),
        endDate: moment(selectedData.tglSelesaiKegiatan).format(
          "dddd, DD MMMM YYYY"
        ),
        startTime: moment(selectedData.jamMulaiKegiatan, "HH:mm:ss").format(
          "HH:mm [WIB]"
        ),
        endTime: moment(selectedData.jamselesaiKegiatan, "HH:mm:ss").format(
          "HH:mm [WIB]"
        ),
      });
    }
  };

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

    if (!folderLinkRef.current?.validate()) {
      folderLinkRef.current?.focus();
      return;
    }

    if (!fotoSampulRef.current?.validate()) {
      fotoSampulRef.current?.focus();

      return;
    }

    if (!fileNotulenRef.current?.validate()) {
      fileNotulenRef.current?.focus();
      return;
    }

    let uploadedFileNotulen = formData.fileNotulen;
    let uploadedFotoSampul = formData.fotoSampul;

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

      setLoading(true);
      useFetch(
        `${API_LINK}/MasterKegiatan/EditDokumentasiKegiatan`,
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
  if (error) return <p className="text-danger">{error}</p>;

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
              {/* Dropdown */}
              <DropDown
                ref={namaRef}
                arrData={existingKegiatan}
                type="pilih"
                label="Jadwal Kegiatan"
                value={formData.id}
                onChange={handleDropdownChange}
                isRequired={true}
              />
              {/* Details */}
              <div className="col-lg-6 col-md-6">
                <DetailData
                  label="Jenis Kegiatan"
                  isi={tempForm.jenisKegiatan}
                />
                <DetailData label="Tanggal Mulai" isi={tempForm.startDate} />
                <DetailData label="Waktu Mulai" isi={tempForm.startTime} />
              </div>
              <div className="col-lg-6 col-md-6">
                <DetailData label="Tempat" isi={tempForm.place} />
                <DetailData label="Tanggal Selesai" isi={tempForm.endDate} />
                <DetailData label="Waktu Selesai" isi={tempForm.endTime} />
              </div>
            </div>
            <DetailData label="Deskripsi Singkat" isi={tempForm.description} />
            <div className="row">
              <div className="col-lg-6 col-md-6">
                <InputField
                  ref={folderLinkRef}
                  label="Link Folder Dokumentasi"
                  value={formData.linkFolder || ""}
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
                  value={Number(formData.statusFileNotulen) || 0}
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
                  ref={fotoSampulRef}
                  id="upload-foto"
                  label="Foto Sampul"
                  onChange={(file) => handleFotoChange(file)}
                  isRequired="true"
                />
              </div>
            </div>
            <div className="d-flex justify-content-between align-items-center mt-4">
              <div className="flex-grow-1 m-2">
                <Button
                  classType="primary"
                  type="button"
                  label="Simpan"
                  width="100%"
                  onClick={() => {
                    handleSubmit();
                  }}
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
