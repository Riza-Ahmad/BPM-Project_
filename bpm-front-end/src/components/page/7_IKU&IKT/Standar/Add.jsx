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

  const [formData, setFormData] = useState({
    namaSta: "",
    jenisSta: "",
    tahunSta: "",
    urutanSta: "",
    parentSta: "",
  });

  const [isChecked, setIsChecked] = useState(false);
  const [arrStandar, setArrStandar] = useState(false);
  const [loading, setLoading] = useState(true);
  const namaStaRef = useRef();
  const tahunStaRef = useRef();
  const urutanStaRef = useRef();
  const jenisStaRef = useRef();
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
    const isTahunStaValid = tahunStaRef.current?.validate();
    const isUrutanStaValid = urutanStaRef.current?.validate();
    const isJenisStaValid = jenisStaRef.current?.validate();

    if (!isNamaAkrValid) {
      namaStaRef.current?.focus();
      return;
    }
    if (!isTahunStaValid) {
      tahunStaRef.current?.focus();
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
              <HeaderForm label="Formulir Standar" />
              <div className="row mb-3">
                <div className="col-lg-6 col-md-6">
                  <InputField
                    ref={namaStaRef}
                    label="Nama Standar"
                    value={formData.namaSta}
                    onChange={handleChange}
                    isRequired={true}
                    name="namaSta"
                    type="text"
                    maxChar="100"
                  />
                </div>
                <div className="col-lg-6 col-md-6">
                  <DropDown
                    arrData={arrData}
                    type="pilih"
                    label="Jenis Standar"
                    forInput="jenisSta"
                    isRequired={true}
                    onChange={handleChange}
                    value={formData.jenisSta}
                    ref={jenisStaRef}
                  />
                </div>
                <div className="col-lg-6 col-md-6">
                  <InputField
                    ref={tahunStaRef}
                    label="Tahun"
                    value={formData.tahunSta}
                    onChange={handleChange}
                    isRequired={true}
                    name="tahunSta"
                    type="number"
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
                <div className="col-lg-12 col-md-12 mb-3">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="defaultCheck1"
                      checked={isChecked}
                      onChange={handleCheckboxChange}
                    />
                    <label className="form-check-label" htmlFor="defaultCheck1">
                      Standar Turunan
                    </label>
                  </div>

                  {/* Collapsible Section */}
                  <div
                    className={`collapse ${isChecked ? "show" : ""}`}
                    id="collapseContent"
                  >
                    <div className="border rounded mt-2 p-3">
                      <DropDown
                        arrData={arrStandar}
                        type="pilih"
                        label="Parent Standar"
                        forInput="parentSta"
                        isRequired={false}
                        onChange={handleChange}
                        value={formData.parentSta}
                        ref={parentStaRef}
                      />
                    </div>
                  </div>
                </div>

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
