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
import TextArea from "../../../part/TextArea";
import DocUpload from "../../../part/DocUpload";
import { useIsMobile } from "../../../util/useIsMobile";
import SweetAlert from "../../../util/SweetAlert";
import { decodeHtml } from "../../../util/DecodeHtml";

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
  const idData = location.state?.idData;
  const modew = location.state?.modew;
  const dataName = location.state?.dataName;
  
  const [formData, setFormData] = useState({
    staIdNasIka: idData,
    staIdPelIka: "",
    namaIka: "",
    jenisaIka: modew === "utama" ? "IKU" : "IKT",
    urutanIka: "",
    picIka: "",
    parentIka: "",
    targetIka: "",
  });

  const [isChecked, setIsChecked] = useState(false);
  const [arrStandar, setArrStandar] = useState([]);
  const [arrIK, setArrIK] = useState([]);
  const [loading, setLoading] = useState(true);
  const namaIkaRef = useRef();
  const picIkaRef = useRef();
  const urutanIkaRef = useRef();
  const parentIkaRef = useRef();
  const staIdNasIkaRef = useRef();
  const targetIkaRef = useRef();

  useEffect(() => {
    const fetchTahunDokumen = async () => {
      setLoading(true);
      const result = await useFetch(
        `${API_LINK}/MasterStandar/GetListStandarByParent`,
        { idData: idData },
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
  }, [location.state?.idData]);

  useEffect(() => {
    const fetchTahunDokumen = async () => {
      setLoading(true);
      const result = await useFetch(
        `${API_LINK}/MasterIndikatorKinerja/GetListIndikatorKinerjaByStandar`,
        { idData: location.state?.idData },
        "POST"
      ).finally(() => setLoading(false));

      if (result === "ERROR") {
        setArrIK([]);
      } else {
        const StandarArr = Object.values(result);
        setArrIK(
          StandarArr.map((item) => ({
            Text: decodeHtml(item.Text).replace(/<\/?[^>]+(>|$)/g, "") || "-",
            Value: item.Value,
          }))
        );
      }
    };

    fetchTahunDokumen();
  }, [location.state?.idData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    // e.preventDefault();
    const isNamaIkaValid = namaIkaRef.current?.validate();
    const isPicIkaValid = picIkaRef.current?.validate();
    const isUrutanIkaValid = urutanIkaRef.current?.validate();
    const isTargetIkaValid = targetIkaRef.current?.validate();

    if (!isNamaIkaValid) {
      namaIkaRef.current?.focus();
      return;
    }
    if (!isPicIkaValid) {
      picIkaRef.current?.focus();
      return;
    }
    if (!isUrutanIkaValid) {
      urutanIkaRef.current?.focus();
      return;
    }
    // console.log('mai ini');
    if (!isTargetIkaValid) {
      targetIkaRef.current?.focus();
      return;
    }

    console.log(formData);
    try {
      const createResponse = await useFetch(
        `${API_LINK}/MasterIndikatorKinerja/CreateDataIndikatorKinerja`,
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
              <HeaderForm
                label={
                  modew === "utama"
                    ? "Formulir Indikator Utama"
                    : "Formulir Indikator Tambahan"
                }
              />
              <div className="row mb-3">
                <div className="col-lg-12 col-md-12">
                  <InputField
                    label="Standar"
                    value={dataName}
                    isDisabled={true}
                  />
                </div>
                <div className="col-lg-12 col-md-12">
                  <TextArea
                    ref={namaIkaRef}
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
                    ref={picIkaRef}
                    label="PIC"
                    value={formData.picIka}
                    onChange={handleChange}
                    isRequired={true}
                    name="picIka"
                    type="text"
                    maxChar="50"
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
                {modew !== "utama" ? (
                  <>
                    <div className="col-lg-6 col-md-6">
                      <DropDown
                        arrData={arrStandar}
                        type="pilih"
                        label="Standar PT"
                        forInput="staIdPelIka"
                        isRequired={false}
                        onChange={handleChange}
                        value={formData.staIdPelIka}
                        ref={staIdNasIkaRef}
                      />
                    </div>
                    <div className="col-lg-6 col-md-6">
                      <DropDown
                        arrData={arrIK}
                        type="pilih"
                        label="IKU"
                        forInput="parentIka"
                        isRequired={false}
                        onChange={handleChange}
                        value={formData.parentIka}
                        ref={parentIkaRef}
                      />
                    </div>
                  </>
                ) : (
                  ""
                )}
                <div className="col-lg-6 col-md-6">
                  <InputField
                    ref={urutanIkaRef}
                    label="Urutan"
                    value={formData.urutanIka}
                    onChange={handleChange}
                    isRequired={true}
                    name="urutanIka"
                    type="number"
                  />
                </div>

                <div className="d-flex justify-content-between align-items-center mt-3">
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
