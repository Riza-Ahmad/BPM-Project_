import React from "react";
import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import PageTitleNav from "../../../part/PageTitleNav";
import TextField from "../../../part/TextField";
import HeaderForm from "../../../part/HeaderText";
import InputField from "../../../part/InputField";
import FileUpload from "../../../part/FileUpload";
import Button from "../../../part/Button";
import DropDown from "../../../part/Dropdown";
import { useFetch } from "../../../util/useFetch";
import { uploadFile } from "../../../util/UploadFile";
import { API_LINK } from "../../../util/Constants";
import DocUpload from "../../../part/DocUpload";
import { useIsMobile } from "../../../util/useIsMobile";
import SweetAlert from "../../../util/SweetAlert";
import TextArea from "../../../part/TextArea";

const arrData = [
  { Value: "Nasional", Text: "Nasional" },
  { Value: "Pelampauan", Text: "Pelampauan" },
];

export default function Add({ onChangePage }) {
  const title = "Tambah Data";
  const breadcrumbs = [
    { label: "SPME" },
    { label: "Status Akreditasi" },
    { label: "IKU & IKT" },
  ];
  const isMobile = useIsMobile();

  const location = useLocation();
  const idMenu = location.state?.idMenu;
  const modew = location.state?.modew;

  const [formData, setFormData] = useState({
    nasionalSta: "",
    pelampauanSta: "",
    namaIka: "",
    urutanIka: "",
    picIka: "",
    parentIka: "",
    targetIka: "",
  });

  const [isChecked, setIsChecked] = useState(false);
  const [arrStandar, setArrStandar] = useState(false);
  const [loading, setLoading] = useState(true);
  const namaStaRef = useRef();
  const targetIkaRef = useRef();
  const urutanStaRef = useRef();
  const picIkaRef = useRef();
  const parentStaRef = useRef();

  useEffect(() => {
    const fetchTahunDokumen = async () => {
      setLoading(true);
      const result = await useFetch(
        `${API_LINK}/MasterStandar/GetListStandarAktif`,
        {},
        "POST"
      ).finally(() => setLoading(false));

      if (result === "ERROR") {
        setArrStandar([]);
      } else {
        const StandarArr = Object.values(result);
        setArrStandar(StandarArr);
      }
    };

    fetchTahunDokumen();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e) => {
    setIsChecked(e.target.checked);
  };

  useEffect(() => {
    if (formData.jenisSta === "Pelampauan") setIsChecked(true);
    else setIsChecked(false);
  }, [formData.jenisSta]);

  const handleSubmit = async () => {
    // e.preventDefault();
    const isNamaAkrValid = namaStaRef.current?.validate();
    const isTahunStaValid = targetIkaRef.current?.validate();
    const isUrutanStaValid = urutanStaRef.current?.validate();
    const isJenisStaValid = picIkaRef.current?.validate();

    if (!isNamaAkrValid) {
      namaStaRef.current?.focus();
      return;
    }
    if (!isTahunStaValid) {
      targetIkaRef.current?.focus();
      return;
    }
    if (!isUrutanStaValid) {
      urutanStaRef.current?.focus();
      return;
    }
    if (!isJenisStaValid) {
      jenisDokSKAkrRef.current?.focus();
      return;
    }

    console.log(formData);
    try {
      const createResponse = await useFetch(
        `${API_LINK}/MasterStandar/CreateDataStandar`,
        formData,
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
        ).then(() =>
          onChangePage("index", {
            idMenu: idMenu,
          })
        );
      }
    } catch (error) {
      console.error("Error:", error.message);
      SweetAlert("Gagal!", error.message, "error", "OK");
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <main className="flex-grow-1 p-3" style={{ marginTop: "80px" }}>
        <div className="d-flex flex-column">
          <div className="container mb-3">
            <div className="p-3">
              <PageTitleNav
                title={title}
                breadcrumbs={breadcrumbs}
                onClick={() => onChangePage("index")}
              />
            </div>
            <div
              className={
                isMobile
                  ? "shadow p-4 m-2 mt-0 bg-white rounded"
                  : "shadow p-5 m-5 mt-0 bg-white rounded"
              }
            >
              <HeaderForm label="Formulir Indikator Kinerja" />
              <div className="row mb-3">
                <div className="col-lg-12 col-md-12">
                  <TextArea
                    ref={namaStaRef}
                    label="Nama Indikator"
                    value={formData.namaIka}
                    onChange={(e) =>
                      setFormData({ ...formData, namaIka: e.target.value })
                    }
                    isRequired={true}
                  />
                </div>
                <div className="col-lg-6 col-md-6">
                  <InputField
                    ref={targetIkaRef}
                    label="Target"
                    value={formData.targetIka}
                    onChange={handleChange}
                    isRequired={true}
                    name="targetIka"
                    type="text"
                    maxChar="100"
                  />
                </div>
                <div className="col-lg-6 col-md-6">
                  <InputField
                    ref={urutanStaRef}
                    label="Urutan"
                    value={formData.urutanSta}
                    onChange={handleChange}
                    isRequired={true}
                    name="urutanSta"
                    type="number"
                  />
                </div>
                {modew === "nasional" ? (
                  <div className="col-lg-6 col-md-6">
                    <InputField
                      ref={picIkaRef}
                      label="PIC"
                      value={formData.picIka}
                      onChange={handleChange}
                      isRequired={true}
                      name="picIka"
                      type="text"
                      maxChar="100"
                    />
                  </div>
                ) : (
                  <>
                    <div className="col-lg-6 col-md-6">
                      <DropDown
                        arrData={arrData}
                        type="pilih"
                        label="Standar Nasional"
                        forInput="nasionalSta"
                        isRequired={true}
                        onChange={handleChange}
                        value={formData.nasionalSta}
                        // ref={jenisStaRef}
                      />
                    </div>
                    <div className="col-lg-6 col-md-6">
                      <DropDown
                        arrData={arrData}
                        type="pilih"
                        label="Standar Perguruan Tinggi"
                        forInput="pelampauanSta"
                        isRequired={false}
                        onChange={handleChange}
                        value={formData.pelampauanSta}
                        // ref={jenisStaRef}
                      />
                    </div>
                    <div className="col-lg-6 col-md-6">
                      <DropDown
                        arrData={arrData}
                        type="pilih"
                        label="Indikator Kinerja Utama"
                        forInput="parentIka"
                        isRequired={false}
                        onChange={handleChange}
                        value={formData.parentIka}
                        // ref={jenisStaRef}
                      />
                    </div>
                  </>
                )}

                <div className="d-flex justify-content-between align-items-center">
                  <div className="flex-grow-1 me-2">
                    <Button
                      classType="primary"
                      type="submit"
                      label="Submit"
                      width="100%"
                      onClick={handleSubmit}
                    />
                  </div>
                  <div className="flex-grow-1 ms-2">
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
        </div>
      </main>
    </div>
  );
}
