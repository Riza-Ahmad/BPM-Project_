import React, { useState, useRef } from "react";
import { useEffect } from "react";
import PageTitleNav from "../../../part/PageTitleNav";
import InputField from "../../../part/InputField";
import HeaderForm from "../../../part/HeaderText";
import Button from "../../../part/Button";
import DropDown from "../../../part/Dropdown";
import SweetAlert from "../../../util/SweetAlert";
import { useIsMobile } from "../../../util/useIsMobile";
import { API_LINK } from "../../../util/Constants";
import { useFetch } from "../../../util/useFetch";
import TextArea from "../../../part/TextArea";
import UploadFoto from "../../../part/UploadFoto";
import { decodeHtml } from "../../../util/DecodeHtml";
import Loading from "../../../part/Loading";

export default function Add({ onChangePage, breadcrumbs }) {
  const isMobile = useIsMobile();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    namaKdo: "",
    deskripsiKdo: "",
    idMen: "",
    urutanKdo: "",
  });
  const [listMenu, setListMenu] = useState([]);

  const [images, setImages] = useState([]);
  const namaKdoRef = useRef();
  const deskripsiKdoRef = useRef();
  const idMenRef = useRef();
  const urutanKdoRef = useRef();
  const foto1KdoRef = useRef();
  const foto2KdoRef = useRef();
  const foto3KdoRef = useRef();

  useEffect(() => {
    const fetchMenu = async () => {
      setLoading(true);
      const result = await useFetch(
        `${API_LINK}/Utilities/GetListMenuAktif`,
        {},
        "POST"
      );

      if (result === "ERROR" || result === null || result.length === 0) {
        setListMenu([]);
      } else {
        const menuArray = Object.values(result);
        setListMenu(menuArray);
      }
      setLoading(false);
    };

    fetchMenu();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    const isNamaKdoValid = namaKdoRef.current?.validate();
    const isDeskripsiKdoValid = deskripsiKdoRef.current?.validate();
    const isFoto1KdoRefValid = foto1KdoRef.current?.validate();
    const isFoto2KdoRefValid = foto2KdoRef.current?.validate();
    const isFoto3KdoRefValid = foto3KdoRef.current?.validate();
    const isIdMenRefValid = idMenRef.current?.validate();
    const isUrutanKdoRefValid = urutanKdoRef.current?.validate();

    if (!isNamaKdoValid) {
      namaKdoRef.current?.focus();
      return;
    }
    if (!isDeskripsiKdoValid) {
      deskripsiKdoRef.current?.focus();
      return;
    }
    if (urutanKdoRef.current.value < 1) {
      urutanKdoRef.current?.focus();
      return;
    }
    if (!isUrutanKdoRefValid) {
      urutanKdoRef.current?.focus();
      return;
    }
    if (!isFoto1KdoRefValid) {
      foto1KdoRef.current?.focus();
      return;
    }
    if (!isFoto2KdoRefValid) {
      foto2KdoRef.current?.focus();
      return;
    }
    if (!isFoto3KdoRefValid) {
      foto3KdoRef.current?.focus();
      return;
    }
    if (!isIdMenRefValid) {
      idMenRef.current?.focus();
      return;
    }

    try {
      let uploadedDokNames = [];
      if (images.length > 0) {
        const folderName = "Dokumen";
        const filePrefix = "FOTO";

        const photos = new FormData();
        images.forEach((file) => photos.append("files", file));

        const uploadResponse = await fetch(
          `${API_LINK}/Upload/UploadFiles?folderName=${encodeURIComponent(
            folderName
          )}&filePrefix=${encodeURIComponent(filePrefix)}`,
          {
            method: "POST",
            body: photos,
          }
        );

        if (!uploadResponse.ok) {
          throw new Error("Gagal mengunggah dokumen");
        }

        uploadedDokNames = await uploadResponse.json();
      }

      const dokData = {
        idMen: parseInt(idMenRef.current.value),
        namaKdo: namaKdoRef.current.value,
        deskripsiKdo: decodeHtml(formData.deskripsiKdo),
        foto1: uploadedDokNames[0] ? uploadedDokNames[0] : "",
        foto2: uploadedDokNames[1] ? uploadedDokNames[1] : "",
        foto3: uploadedDokNames[2] ? uploadedDokNames[2] : "",
        urutanKdo: urutanKdoRef.current.value,
        createdBy: "User404",
      };

      const createResponse = await useFetch(
        `${API_LINK}/MasterKategoriDokumen/CreateDataKategoriDokumenHeader`,
        dokData,
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
        ).then(() => onChangePage("read"));
      }
    } catch (error) {
      SweetAlert("Gagal!", error.message, "error", "OK");
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <main className="flex-grow-1 p-3" style={{ marginTop: "80px" }}>
        <div className="container d-flex flex-column">
          <div className="p-3">
            <PageTitleNav
              title="Tambah Data"
              breadcrumbs={breadcrumbs}
              onClick={() => onChangePage("read")}
            />
          </div>
          <div className={isMobile ? "m-0" : "m-3"}>
            {loading ? (
              <Loading />
            ) : (
              <div
                className={
                  isMobile
                    ? "shadow p-4 m-2 mt-0 bg-white rounded"
                    : "shadow p-5 m-5 mt-0 bg-white rounded"
                }
              >
                <HeaderForm label="Formulir Kategori Dokumen Header" />
                <InputField
                  ref={namaKdoRef}
                  label="Nama Kategori"
                  value={formData.namaKdo}
                  onChange={handleChange}
                  isRequired={true}
                  name="namaKdo"
                  type="text"
                  maxChar="100"
                />
                <TextArea
                  ref={deskripsiKdoRef}
                  label="Deskripsi"
                  value={formData.deskripsiKdo}
                  onChange={(e) =>
                    setFormData({ ...formData, deskripsiKdo: e.target.value })
                  }
                  isRequired={true}
                />
                <div className="row">
                  <div className="col-lg-6 col-md-6">
                    <DropDown
                      arrData={listMenu}
                      type="pilih"
                      label="Menu"
                      forInput="idMen"
                      isRequired={true}
                      onChange={handleChange}
                      value={formData.idMen}
                      ref={idMenRef}
                    />
                  </div>
                  <div className="col-lg-6 col-md-6">
                    <InputField
                      ref={urutanKdoRef}
                      label="Urutan Kategori"
                      value={formData.urutanKdo}
                      onChange={handleChange}
                      isRequired={true}
                      name="urutanKdo"
                      type="number"
                      min="0"
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-4 col-md-4">
                    <UploadFoto
                      ref={foto1KdoRef}
                      id="upload-foto1"
                      label="Masukkan Foto 1"
                      onChange={(file) => (images[0] = file)}
                      isRequired={false}
                    />
                  </div>
                  <div className="col-lg-4 col-md-4">
                    <UploadFoto
                      ref={foto2KdoRef}
                      id="upload-foto2"
                      label="Masukkan Foto 2"
                      onChange={(file) => (images[1] = file)}
                      isRequired={false}
                    />
                  </div>
                  <div className="col-lg-4 col-md-4">
                    <UploadFoto
                      ref={foto3KdoRef}
                      id="upload-foto3"
                      label="Masukkan Foto 3"
                      onChange={(file) => (images[2] = file)}
                      isRequired={false}
                    />
                  </div>
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
                      onClick={() => onChangePage("read")}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
