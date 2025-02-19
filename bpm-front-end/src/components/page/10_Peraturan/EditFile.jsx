import React, { useState, useEffect, useRef } from "react";
import PageTitleNav from "../../part/PageTitleNav";
import HeaderForm from "../../part/HeaderText";
import { useLocation } from "react-router-dom";
import { API_LINK, PERATURAN_FILE_LINK } from "../../util/Constants";
import Button from "../../part/Button";
import SweetAlert from "../../util/SweetAlert";
import { useIsMobile } from "../../util/useIsMobile";
import { useFetch } from "../../util/useFetch";
import { uploadFile } from "../../util/UploadFile";
import Loading from "../../part/Loading";
import DetailData from "../../part/DetailData";
import FileUpload from "../../part/FileUpload";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toISOString().split("T")[0]; // Mengambil hanya bagian tanggal
};

export default function Edit({ onChangePage }) {
  const isMobile = useIsMobile();
  const [error, setError] = useState(null);

  const location = useLocation();
  const currentPath = location.pathname;
  const rootPath = currentPath.split("/")[2];
  const idMenu = location.state?.idMenu;
  const idData = location.state?.idData;
  const [loading, setLoading] = useState(true); // New loading state
  const [title, setTitle] = useState("");
  const [titleHeader, setTitleHeader] = useState("");
  const [breadcrumbs, setBreadcrumbs] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [formData, setFormData] = useState({
    idMenu: idMenu,
    idDok: "",
    judulDokumen: "",
    nomorInduk: "",
    tahunDokumen: "",
    tahunKadaluarsa: "",
    jenisDokumen: "",
    fileDokumen: "",
  });

  // Refs for validation
  const fileDokumenRef = useRef();

  const handleFileChange = (file) => {
    setSelectedFile(file);
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await useFetch(
          `${API_LINK}/MasterPeraturan/GetDataPeraturanById`,
          {
            idData: idData,
          },
          "POST"
        );
        if (data.length > 0) {
          // Mengubah format tanggal untuk tahunDokumen dan tahunKadaluarsa
          setFormData({
            idDok: data[0].idDok || "",
            judulDokumen: data[0].judulDokumen || "",
            nomorInduk: data[0].nomorInduk || "",
            tahunDokumen: formatDate(data[0].tahunDokumen) || "", // Memformat tanggal
            tahunKadaluarsa: formatDate(data[0].tahunKadaluarsa) || "", // Memformat tanggal
            jenisDokumen: data[0].jenisDokumen || "",
            fileDokumen: data[0].fileDok || "",
            idRef: data[0].referensiDokumen || "",
          });
        }
      } catch (error) {
        setError("Gagal mengambil data kegiatan");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [location.state]);

  useEffect(() => {
    let newTitle = "";
    let newTitleHeader = "";
    let newBreadcrumbs = [];

    if (rootPath === "dokumen") {
      newTitle = "Edit Peraturan";
      newTitleHeader = "Formulir dokumen Peraturan";
      newBreadcrumbs = [
        {
          label: "Peraturan",
          href: "/peraturan/dokumen",
        },
        {
          label: "dokumen Peraturan",
          href: "/peraturan/dokumen",
        },
        {
          label: "Edit dokumen Peraturan",
          href: "",
        },
      ];
    } else if (rootPath === "aps") {
      newTitle = "Edit Instrumen APS";
      newTitleHeader = "Formulir Instrumen APS";
      newBreadcrumbs = [
        { label: "Peraturan", href: "/peraturan/aps" },
        {
          label: "instrumen APS",
          href: "/peraturan/aps",
        },
        { label: "Edit Instrumen APS", href: "" },
      ];
    }

    setTitle(newTitle);
    setTitleHeader(newTitleHeader);
    setBreadcrumbs(newBreadcrumbs);

    setLoading(false);
  }, [idMenu]);

  const handleSubmit = async () => {
    try {
      const isFileValid = fileDokumenRef.current?.validate();
      if (!isFileValid) {
        fileDokumenRef.current?.focus();
        return;
      }

      setLoading(true);

      let uploadedFilePeraturan = null;
      if (selectedFile) {
        const folderName = "Peraturan";
        const filePrefix = `${idMenu}_${formData.judulDokumen}`;
        uploadedFilePeraturan = await uploadFile(
          selectedFile,
          folderName,
          filePrefix
        );
      }

      const response = await useFetch(
        `${API_LINK}/MasterPeraturan/EditPeraturanFile`,
        {
          idDok: idData,
          fileDokumen: uploadedFilePeraturan
            ? uploadedFilePeraturan[0]
            : formData.fileDokumen,
          idRefer: formData.idRef,
        },
        "POST"
      );

      if (response === "ERROR") {
        throw new Error("Gagal memperbarui data");
      }

      SweetAlert(
        "Berhasil!",
        "File dokumen berhasil diperbarui.",
        "success",
        "OK"
      ).then(() => onChangePage("index", { idMenu: idMenu }));
    } catch (error) {
      SweetAlert("Gagal!", error.message, "error", "OK");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="d-flex flex-column min-vh-100">
      <main className="flex-grow-1 p-3" style={{ marginTop: "80px" }}>
        <div className="d-flex flex-column">
          <div className={isMobile ? "m-0" : "m-3"}>
            <PageTitleNav
              title={title}
              breadcrumbs={breadcrumbs}
              onClick={() => onChangePage("index", { idMenu: idMenu })}
            />
          </div>

          <div
            className={
              isMobile
                ? "shadow p-4 m-2 mt-0 bg-white rounded"
                : "shadow p-5 m-5 mt-0 bg-white rounded"
            }
          >
            <HeaderForm label={titleHeader} />
            <div className="row">
              <DetailData
                label="Judul Dokumen"
                isi={formData.judulDokumen || ""}
              />
            </div>
            <div className="row">
              <div className="col-lg-6 col-md-6">
                <DetailData
                  label="Nomor Induk Dokumen"
                  isi={formData.nomorInduk || ""}
                />
              </div>
              <div className="col-lg-6 col-md-6">
                <DetailData
                  label="Tanggal Dokumen"
                  isi={formData.tahunDokumen || ""}
                />
              </div>
              <div className="col-lg-6 col-md-6">
                <DetailData
                  label="Jenis Dokumen"
                  isi={formData.jenisDokumen || ""}
                />
              </div>
              <div className="col-lg-6 col-md-6">
                <DetailData
                  label="Tanggal Kadaluarsa"
                  isi={formData.tahunKadaluarsa || ""}
                />
              </div>
            </div>
            <div className="row">
              <FileUpload
                ref={fileDokumenRef}
                label="Dokumen"
                forInput="fileDokumen"
                formatFile=".pdf"
                onChange={(file) => handleFileChange(file)}
                hasExisting={PERATURAN_FILE_LINK + formData.fileDokumen}
                isRequired={true}
              />
            </div>
            <div className="d-flex justify-content-between align-items-center mt-4">
              <div className="flex-grow-1 m-2">
                <Button
                  classType="primary"
                  type="submit"
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
                  onClick={() => {
                    onChangePage("index", { idMenu: idMenu });
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
