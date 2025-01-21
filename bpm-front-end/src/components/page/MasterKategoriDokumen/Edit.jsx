import React, { useState, useRef } from "react";
import { useEffect } from "react";
import PageTitleNav from "../../part/PageTitleNav";
import InputField from "../../part/InputField";
import HeaderForm from "../../part/HeaderText";
import Button from "../../part/Button";
import DropDown from "../../part/Dropdown";
import SweetAlert from "../../util/SweetAlert";
import { useIsMobile } from "../../util/useIsMobile";
import { API_LINK, DOKUMEN_LINK } from "../../util/Constants";
import { useFetch } from "../../util/useFetch";
import TextArea from "../../part/TextArea";
import UploadFoto from "../../part/UploadFoto";
import { decodeHtml } from "../../util/DecodeHtml";
import Loading from "../../part/Loading";

export default function Edit({ onChangePage, breadcrumbs, idData }) {
  const isMobile = useIsMobile();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    idMen: null,
    namaKdo: null,
    deskripsiKdo: null,
    foto1Kdo: null,
    foto2Kdo: null,
    foto3Kdo: null,
    urutanKdo: null,
    statusKdo: null,
    createdByKdo: null,
  });
  const [listMenu, setListMenu] = useState([]);

  useEffect(() => {
    const fetchMenu = async () => {
      setLoading(true);
      const result = await useFetch(
        `${API_LINK}/Utilities/GetListMenuAktif`,
        {},
        "POST"
      );

      if (result === "ERROR" || result === null) {
        setListMenu([]);
      } else {
        const menuArray = Object.values(result);
        setListMenu(menuArray);
      }

      setLoading(false);
    };

    fetchMenu();
  }, []);

  useEffect(() => {
    const fetchKategori = async () => {
      setLoading(true);
      const result = await useFetch(
        `${API_LINK}/MasterKategoriDokumen/GetDataKategoriDokumenById`,
        { idKdo: idData },
        "POST"
      );

      if (result === "ERROR" || result === null || result.length === 0) {
        setFormData({});
      } else {
        setFormData(result[0]);
        setFormData((prevData) => ({
          ...prevData,
          deskripsiKdo: decodeHtml(result[0].deskripsiKdo),
        }));
      }
      setLoading(false);
    };
    fetchKategori();
  }, [idData]);

  const [images, setImages] = useState(["", "", ""]);
  const namaKdoRef = useRef(formData.namaKdo);
  const deskripsiKdoRef = useRef(formData.deskripsiKdo);
  const idMenRef = useRef(formData.idMen);
  const urutanKdoRef = useRef(formData.urutanKdo);
  const foto1KdoRef = useRef(formData.foto1Kdo);
  const foto2KdoRef = useRef(formData.foto2Kdo);
  const foto3KdoRef = useRef(formData.foto3Kdo);

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
      const folderName = "Dokumen";
      const filePrefix = "FOTO";

      // Filter new files from images
      const newFiles = images.filter((img) => img instanceof File);

      // Determine update status for each image
      const updated = images.map((item) => (item !== "" ? "updated" : "still"));

      let uploadedPaths = [];
      if (newFiles.length > 0) {
        // Prepare FormData for upload
        const photos = new FormData();
        newFiles.forEach((file) => photos.append("files", file));

        // Upload new files
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
          throw new Error(
            `Gagal mengunggah file: ${uploadResponse.statusText}`
          );
        }

        uploadedPaths = await uploadResponse.json();
      }

      // Map final image paths using previous and uploaded paths
      const prevPaths = [
        formData.foto1Kdo,
        formData.foto2Kdo,
        formData.foto3Kdo,
      ];
      const finalImagePaths = updated.map((status, index) =>
        status === "updated" ? uploadedPaths.shift() : prevPaths[index]
      );

      // Construct the payload for the update request
      const dokData = {
        idKdo: formData.idKdo,
        idMen: parseInt(idMenRef.current.value, 10),
        namaKdo: namaKdoRef.current.value,
        deskripsiKdo: decodeHtml(formData.deskripsiKdo),
        foto1: finalImagePaths[0],
        foto2: finalImagePaths[1],
        foto3: finalImagePaths[2],
        urutanKdo: parseInt(urutanKdoRef.current.value, 10),
        modifBy: "User404",
      };

      // Submit updated data
      const createResponse = await useFetch(
        `${API_LINK}/MasterKategoriDokumen/EditDataKategoriDokumenHeader`,
        dokData,
        "POST"
      );

      if (createResponse === "ERROR") {
        throw new Error("Gagal memperbarui data");
      }

      // Success notification
      await SweetAlert("Berhasil!", "Data berhasil diubah.", "success", "OK");
      onChangePage("index");
    } catch (error) {
      console.error("Error:", error.message);
      SweetAlert("Gagal!", error.message, "error", "OK");
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <main className="flex-grow-1 p-3" style={{ marginTop: "80px" }}>
        <div className="container d-flex flex-column">
          {/* Breadcrumbs and Page Title */}
          <div className="p-3">
            <PageTitleNav
              title="Edit Data"
              breadcrumbs={breadcrumbs}
              onClick={() => onChangePage("index")}
            />
          </div>
          <div className={isMobile ? "m-0" : "m-3"}>
            {/* Main Content Section */}
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
                      hasExisting={DOKUMEN_LINK + formData.foto1Kdo}
                      isRequired={false}
                    />
                  </div>
                  <div className="col-lg-4 col-md-4">
                    <UploadFoto
                      ref={foto2KdoRef}
                      id="upload-foto2"
                      label="Masukkan Foto 2"
                      onChange={(file) => (images[1] = file)}
                      hasExisting={DOKUMEN_LINK + formData.foto2Kdo}
                      isRequired={false}
                    />
                  </div>
                  <div className="col-lg-4 col-md-4">
                    <UploadFoto
                      ref={foto3KdoRef}
                      id="upload-foto3"
                      label="Masukkan Foto 3"
                      onChange={(file) => (images[2] = file)}
                      hasExisting={DOKUMEN_LINK + formData.foto3Kdo}
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
                      onClick={() => onChangePage("index")}
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
