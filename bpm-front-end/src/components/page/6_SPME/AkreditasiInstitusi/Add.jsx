import PageTitleNav from "../../../part/PageTitleNav";
import HeaderForm from "../../../part/HeaderText";
import Button from "../../../part/Button";
import InputField from "../../../part/InputField";
import React, { useRef, useState } from "react";
import { API_LINK } from "../../../util/Constants";
import SweetAlert from "../../../util/SweetAlert";
import { useFetch } from "../../../util/useFetch";

export default function Add({ onChangePage }) {
  const title = "Akreditasi Institusi";
  const breadcrumbs = [
    { label: "SPME" },
    { label: "Status Akreditasi" },
    { label: "Institusi" },
    { label: "Tambah" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const [formData, setFormData] = useState({
    kodeAkr: "",
    namaAkr: "",
    jenjangAkr: "",
    wilayahAkr: "",
    peringkatAkr: "",
    nomorSkAkr: "",
    berlakuAkr: "",
    kadaluarsaAkr: "",
    judulDokSKAkr: "",
    jenisDokSKAkr: "",
    judulDokSertifAkr: "",
    jenisDokSertifAkr: "",
  });

  const namaAkrRef = useRef();
  const nomorSkAkrRef = useRef();
  const peringkatAkrRef = useRef();
  const berlakuAkrRef = useRef();
  const kadaluarsaAkrRef = useRef();

  const handleSubmit = async () => {
    const isNamaAkrValid = namaAkrRef.current?.validate();
    const isPeringkatAkrValid = peringkatAkrRef.current?.validate();
    const isNomorSKAkrValid = nomorSkAkrRef.current?.validate();
    const isBerlakuAkrValid = berlakuAkrRef.current?.validate();
    const isKadaluarsaAkrValid = kadaluarsaAkrRef.current?.validate();

    if (!isNamaAkrValid) {
      namaAkrRef.current?.focus();
      return;
    }
    if (!isPeringkatAkrValid) {
      peringkatAkrRef.current?.focus();
      return;
    }
    if (!isNomorSKAkrValid) {
      nomorSkAkrRef.current?.focus();
      return;
    }
    if (!isBerlakuAkrValid) {
      berlakuAkrRef.current?.focus();
      return;
    }
    if (!isKadaluarsaAkrValid) {
      kadaluarsaAkrRef.current?.focus();
      return;
    }

    try {
      const AkreData = {
        kodeAkr: formData.kodeAkr,
        namaAkr: formData.namaAkr,
        jenjangAkr: formData.jenjangAkr,
        wilayahAkrRef: "",
        nomorSKAkr: formData.nomorSkAkr ? formData.nomorSkAkr : "",
        tahunAkr: formData.berlakuAkr,
        peringkatAkr: formData.peringkatAkr ? formData.peringkatAkr : "",
        kadaluarsaAkr: formData.kadaluarsaAkr ? formData.kadaluarsaAkr : "",
        SKAkr: "",
        SertifAkr: "",
      };

      const isExist = await useFetch(
        `${API_LINK}/MasterAkreditasi/CheckDataAkreditasiExist`,
        {
          param1: formData.kodeAkr || "",
          param2: formData.namaAkr || "",
          param3: formData.jenjangAkr || "",
        },
        "POST"
      );

      if (isExist.length > 0) {
        SweetAlert("Gagal!", "Data sudah ada.", "error", "OK");
        return;
      }

      const createResponse = await useFetch(
        `${API_LINK}/MasterAkreditasi/CreateDataAkreditasi`,
        AkreData,
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
        ).then(() => onChangePage("index"));
      }
    } catch (error) {
      SweetAlert("Gagal!", error.message, "error", "OK");
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <main className="flex-grow-1 mb-5" style={{ marginTop: "80px" }}>
        <div className="d-flex flex-column">
          <div className="container mb-3">
            <div className="mt-4">
              <PageTitleNav
                title={title}
                breadcrumbs={breadcrumbs}
                onClick={() => onChangePage("index")}
              />
            </div>
            <div className="shadow p-5 mt-0 bg-white rounded">
              <HeaderForm label={"Formulir " + title} />
              <div className="row">
                <div className="col-lg-6 col-md-6 ">
                  <InputField
                    ref={namaAkrRef}
                    label="Nama"
                    value={formData.namaAkr}
                    onChange={handleChange}
                    isRequired="true"
                    name="namaAkr"
                    type="text"
                    maxChar="100"
                  />
                </div>

                <div className="col-lg-6 col-md-6">
                  <InputField
                    label="Peringkat"
                    isRequired={true}
                    onChange={handleChange}
                    errorMessage=""
                    value={formData.peringkatAkr}
                    ref={peringkatAkrRef}
                    name="peringkatAkr"
                    type="text"
                    maxChar="20"
                  />
                </div>

                <div className="col-lg-12 col-md-12">
                  <InputField
                    label="Nomor SK"
                    isRequired={true}
                    onChange={handleChange}
                    errorMessage=""
                    value={formData.nomorSkAkr}
                    ref={nomorSkAkrRef}
                    name="nomorSkAkr"
                    type="text"
                    maxChar="50"
                  />
                </div>
                <div className="col-lg-6 col-md-6">
                  <InputField
                    label="Tahun SK"
                    isRequired={true}
                    onChange={handleChange}
                    value={formData.berlakuAkr}
                    ref={berlakuAkrRef}
                    name="berlakuAkr"
                    type="number"
                  />
                </div>
                <div className="col-lg-6 col-md-6">
                  <InputField
                    label="Tanggal Kadaluwarsa"
                    isRequired={true}
                    onChange={handleChange}
                    value={formData.kadaluarsaAkr}
                    ref={kadaluarsaAkrRef}
                    name="kadaluarsaAkr"
                    type="date"
                  />
                </div>
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
                    onClick={() => onChangePage("index")}
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
