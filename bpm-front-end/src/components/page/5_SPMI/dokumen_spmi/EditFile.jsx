import React, { useState, useRef } from "react";
import { useEffect } from "react";
import PageTitleNav from "../../../part/PageTitleNav";
import InputField from "../../../part/InputField";
import HeaderForm from "../../../part/HeaderText";
import Button from "../../../part/Button";
import DocUpload from "../../../part/DocUpload";
import DropDown from "../../../part/Dropdown";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import SweetAlert from "../../../util/SweetAlert";
import FileUpload from "../../../part/FileUpload";
import { useIsMobile } from "../../../util/useIsMobile";
import { API_LINK, DOKUMEN_LINK } from "../../../util/Constants";
import { useFetch } from "../../../util/useFetch";
import Loading from "../../../part/Loading";
import moment from "moment";
import DetailData from "../../../part/DetailData";
import { uploadFile } from "../../../util/UploadFile";

export default function EditFile({ onChangePage }) {
  const isMobile = useIsMobile();
  const title = "Edit Data";
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const idMenu = location.state?.idMenu;
  const idData = location.state?.idData;
  const breadcrumbs = location.state?.breadcrumbs;

  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    idKdo: idData,
    judulDok: "",
    nomorDok: "",
    tanggalDok: "",
    kadaluarsaDok: "",
    jenisDok: "",
    fileDok: "",
  });

  const fileDokumenRef = useRef();

  useEffect(() => {
    const fetchDokumenById = async () => {
      const body = {
        idData: idData,
      };
      setLoading(true);
      const result = await useFetch(
        `${API_LINK}/MasterDokumen/GetDataDokumenById`,
        body,
        "POST"
      ).finally(() => setLoading(false));

      if (result === "ERROR" || result === null || result.length === 0) {
        setFormData(null);
      } else {
        console.log(result);
        const dokumenArray = Object.values(result);
        setFormData({
          idKdo: 4,
          judulDok: dokumenArray[0].judulDok,
          nomorDok: dokumenArray[0].noDok,
          tanggalDok: moment(dokumenArray[0].tanggalDok).format("YYYY-MM-DD"),
          kadaluarsaDok: moment(dokumenArray[0].kadaluarsaDok).format(
            "YYYY-MM-DD"
          ),
          fileDok: dokumenArray[0].fileDok,
          jenisDok: dokumenArray[0].controlDok,
          refDok: dokumenArray[0].refDok,
          createdBy: dokumenArray[0].createdBy,
        });
      }
    };

    fetchDokumenById();
  }, [idData]);

  const handleFileChange = (updatedFiles) => {
    setFile(updatedFiles);
    console.log(updatedFiles);
  };

  const handleSubmit = async () => {
    try {
      const isFileValid = fileDokumenRef.current?.validate();
      if (!isFileValid) {
        fileDokumenRef.current?.focus();
        return;
      }

      console.log(formData.refDok);

      setLoading(true);

      let uploadedFilePeraturan = null;
      if (file) {
        const folderName = "Dokumen";
        const filePrefix = `${idMenu}_${formData.judulDok}`;
        uploadedFilePeraturan = await uploadFile(file, folderName, filePrefix);
      }

      const response = await useFetch(
        `${API_LINK}/MasterDokumen/EditDokumenFile`,
        {
          idDok: idData,
          fileDokumen: uploadedFilePeraturan
            ? uploadedFilePeraturan[0]
            : formData.fileDok,
          idRefer: formData.refDok,
        },
        "POST"
      );

      if (response === "ERROR") {
        throw new Error("Gagal memperbarui data");
      }

      SweetAlert(
        "Berhasil!",
        "Dokumen berhasil diperbarui.",
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
          {/* Breadcrumbs and Page Title */}
          <div className="p-3">
            <PageTitleNav
              title={title}
              breadcrumbs={breadcrumbs}
              onClick={() =>
                onChangePage("index", {
                  idMenu: idMenu,
                })
              }
            />
          </div>
          <div className={isMobile ? "m-0" : "m-3"}>
            {/* Main Content Section */}
            <div
              className={
                isMobile
                  ? "shadow p-4 m-2 mt-0 bg-white rounded"
                  : "shadow p-5 m-5 mt-0 bg-white rounded"
              }
            >
              <HeaderForm label="Formulir Dokumen" />
              <div className="row">
                <DetailData
                  label="Judul Dokumen"
                  isi={formData.judulDok || ""}
                />
              </div>
              <div className="row">
                <div className="col-lg-6 col-md-6">
                  <DetailData
                    label="Nomor Induk Dokumen"
                    isi={formData.nomorDok || ""}
                  />
                </div>
                <div className="col-lg-6 col-md-6">
                  <DetailData
                    label="Tahun Dokumen"
                    isi={formData.tanggalDok || ""}
                  />
                </div>
                <div className="col-lg-6 col-md-6">
                  <DetailData
                    label="Jenis Dokumen"
                    isi={formData.jenisDok || ""}
                  />
                </div>
                <div className="col-lg-6 col-md-6">
                  <DetailData
                    label="Tahun Kadaluwarsa"
                    isi={formData.kadaluarsaDok || ""}
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
                  hasExisting={DOKUMEN_LINK + formData.fileDok}
                  isRequired={true}
                />
              </div>
              <div className="d-flex justify-content-between align-items-center">
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
                    onClick={() =>
                      onChangePage("index", {
                        idMenu: idMenu,
                      })
                    }
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
