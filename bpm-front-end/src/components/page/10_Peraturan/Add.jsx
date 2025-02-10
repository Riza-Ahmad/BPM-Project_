import React, { useState, useEffect, useRef } from "react";
import PageTitleNav from "../../part/PageTitleNav";
import InputField from "../../part/InputField";
import HeaderForm from "../../part/HeaderText";
import Button from "../../part/Button";
import Dropdown from "../../part/Dropdown";
import Loading from "../../part/Loading";
import { useLocation } from "react-router-dom";
import { uploadFile } from "../../util/UploadFile";
import { API_LINK } from "../../util/Constants";
import FileUpload from "../../part/FileUpload";
import SweetAlert from "../../util/SweetAlert";
import { useIsMobile } from "../../util/useIsMobile";
import { useFetch } from "../../util/useFetch";

// Dynamically set title and breadcrumbs based on idMenu
let title = "";
let titleHeader = "Formulir";
let breadcrumbs = [];

export default function Add({ onChangePage }) {
  const isMobile = useIsMobile();
  const location = useLocation();
  const currentPath = location.pathname;
  const rootPath = currentPath.split("/")[2];
  const idMenu = location.state?.idMenu;
  const [loading, setLoading] = useState(true); // New loading state
  const [selectedFile, setSelectedFile] = useState(null);
  const [formData, setFormData] = useState({
    idMenu: idMenu,
    judulDokumen: "",
    nomorInduk: "",
    tahunDokumen: "",
    tahunKadaluarsa: "",
    fileDokumen: "",
    jenisDokumen: "",
  });

  console.log(rootPath);
  const handleFileChange = (file) => {
    setSelectedFile(file);
  };

  // Refs for validation
  const judulDokumenRef = useRef();
  const nomorIndukRef = useRef();
  const tahunDokumenRef = useRef();
  const jenisDokumenRef = useRef();
  const tahunKadaluarsaRef = useRef();
  const fileDokumenRef = useRef();

  useEffect(() => {
    if (rootPath === "dokumen") {
      title = "Dokumen Peraturan";
      titleHeader = "Formulir Dokumen Peraturan";
      breadcrumbs = [
        { label: "Peraturan", href: "/peraturan/dokumen" },
        {
          label: "Dokumen Peraturan",
          href: "/peraturan/dokumen",
        },
        { label: "Tambah Dokumen Peraturan" },
      ];
    } else if (rootPath === "aps") {
      title = "Instrumen APS";
      titleHeader = "Formulir Instrumen APS";
      breadcrumbs = [
        { label: "Peraturan", href: "/peraturan/aps" },
        {
          label: "Instrumen APS",
          href: "/peraturan/aps",
        },
        { label: "Tambah Instrumen APS" },
      ];
    }

    setLoading(false);
  }, [rootPath]);

  const handleSubmit = async () => {
    if (!judulDokumenRef.current?.validate()) {
      judulDokumenRef.current?.focus();
      return;
    }
    if (!nomorIndukRef.current?.validate()) {
      nomorIndukRef.current?.focus();
      return;
    }
    if (!tahunDokumenRef.current?.validate()) {
      tahunDokumenRef.current?.focus();
      return;
    }
    if (!jenisDokumenRef.current?.validate()) {
      jenisDokumenRef.current?.focus();
      return;
    }
    if (!tahunKadaluarsaRef.current?.validate()) {
      tahunKadaluarsaRef.current?.focus();
      return;
    }
    if (!fileDokumenRef.current?.validate()) {
      fileDokumenRef.current?.focus();
      return;
    }

    let uploadedFilePeraturan = null;

    if (selectedFile) {
      const folderName = "Peraturan";

      const filePrefix = idMenu + "_" + formData.judulDokumen;
      uploadedFilePeraturan = await uploadFile(
        selectedFile,
        folderName,
        filePrefix
      );
    }
    try {
      setLoading(true);
      const finalFormData = {
        ...formData,
        fileDokumen: uploadedFilePeraturan[0],
      };

      const data = await useFetch(
        `${API_LINK}/MasterPeraturan/CreatePeraturan`,
        finalFormData
      );

      if (data === "ERROR") {
        throw new Error(
          "Terjadi kesalahan: Gagal menyimpan data pengajuan proposal."
        );
      }
      SweetAlert("Sukses", "Pengajuan proposal berhasil disimpan", "success");
      onChangePage("index", { idMenu: idMenu });
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
          {/* Breadcrumbs and Page Title */}
          <div className={isMobile ? "m-0 p-0" : "m-3 mb-0"}>
            <PageTitleNav
              title={title}
              breadcrumbs={breadcrumbs}
              onClick={() => onChangePage("index", { idMenu: idMenu })}
            />
          </div>

          {/* Main Content Section */}
          <div className={isMobile ? "m-0" : "m-3"}>
            <div
              className={
                isMobile
                  ? "shadow p-4 m-2 mt-0 bg-white rounded"
                  : "shadow p-5 m-5 mt-0 bg-white rounded"
              }
            >
              <HeaderForm label={titleHeader} />
              <div className="row">
                <InputField
                  ref={judulDokumenRef}
                  label="Judul Dokumen"
                  value={formData.judulDokumen || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, judulDokumen: e.target.value })
                  }
                  isRequired={true}
                />
              </div>
              <div className="row">
                <div className="col-lg-6 col-md-6">
                  <InputField
                    ref={nomorIndukRef}
                    label="Nomor Induk Dokumen"
                    value={formData.nomorInduk || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, nomorInduk: e.target.value })
                    }
                    isRequired={true}
                  />
                </div>
                <div className="col-lg-6 col-md-6">
                  <InputField
                    ref={tahunDokumenRef}
                    type="date"
                    label="Tahun Dokumen"
                    value={formData.tahunDokumen}
                    onChange={(e) =>
                      setFormData({ ...formData, tahunDokumen: e.target.value })
                    }
                    isRequired={true}
                  />
                </div>
                <div className="col-lg-6 col-md-6">
                  <Dropdown
                    ref={jenisDokumenRef}
                    type="pilih"
                    forInput="jenisDokumen"
                    value={formData.jenisDokumen}
                    label="Jenis Dokumen"
                    isRequired={true}
                    arrData={[
                      { Text: "Controlled Copy", Value: "Controlled Copy" },
                      { Text: "Uncontrolled Copy", Value: "Uncontrolled Copy" },
                    ]}
                    onChange={(e) =>
                      setFormData({ ...formData, jenisDokumen: e.target.value })
                    }
                  />
                </div>
                <div className="col-lg-6 col-md-6">
                  <InputField
                    ref={tahunKadaluarsaRef}
                    type="date"
                    label="Tahun Kadaluarsa"
                    value={formData.tahunKadaluarsa}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        tahunKadaluarsa: e.target.value,
                      })
                    }
                    isRequired={true}
                  />
                </div>
              </div>
              <div className="row">
                <FileUpload
                  ref={fileDokumenRef}
                  label="Dokumen"
                  forInput="fileDokumen"
                  onChange={(file) => handleFileChange(file)}
                  isRequired={true}
                />
              </div>
              <div className="d-flex justify-content-between align-items-center mt-4">
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
                    onClick={() => onChangePage("index", { idMenu: idMenu })}
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
