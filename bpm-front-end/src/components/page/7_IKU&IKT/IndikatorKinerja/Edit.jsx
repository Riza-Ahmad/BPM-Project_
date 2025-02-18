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
import TextArea from "../../../part/TextArea";
import Loading from "../../../part/Loading";
import SweetAlert from "../../../util/SweetAlert";
import { decodeHtml } from "../../../util/DecodeHtml";
import InputArea from "../../../part/InputArea";

const arrData = [
  { Value: "Kesesuaian Melampaui", Text: "Kesesuaian Melampaui" },
  { Value: "Kesesuaian Memenuhi", Text: "Kesesuaian Memenuhi" },
  { Value: "Ketidaksesuaian Observasi", Text: "Ketidaksesuaian Observasi" },
  { Value: "Ketidaksesuaian Minor", Text: "Ketidaksesuaian Minor" },
  { Value: "Ketidaksesuaian Major", Text: "Ketidaksesuaian Major" },
];

export default function Edit({ onChangePage }) {
  const title = "Tambah Data";
  const breadcrumbs = [
    { label: "SPME" },
    { label: "Status Akreditasi" },
    { label: "IKU & IKT" },
  ];
  const isMobile = useIsMobile();

  const location = useLocation();
  const idSta = location.state?.idSta;
  const idData = location.state?.idData;
  const modew = location.state?.modew;

  const [formData, setFormData] = useState({
    idIka: idData,
    staPelIka: "",
    namaIka: "",
    urutanIka: "",
    picIka: "",
    parentIka: "",
    targetIka: "",
    aktualIka: "",
    capaianIka: "",
  });

  const [isChecked, setIsChecked] = useState(false);
  const [arrStandar, setArrStandar] = useState([]);
  const [arrIK, setArrIK] = useState([]);
  const [loading, setLoading] = useState(true);
  const namaIkaRef = useRef();
  const picIkaRef = useRef();
  const parentIkaRef = useRef();
  const targetIkaRef = useRef();
  const urutanIkaRef = useRef();
  const staPelIkaRef = useRef();
  const aktualIkaRef = useRef();
  const capaianIkaRef = useRef();

  useEffect(() => {
    const fetchTahunDokumen = async () => {
      setLoading(true);
      const result = await useFetch(
        `${API_LINK}/MasterStandar/GetListStandarByParent`,
        { idData: idSta },
        "POST"
      );

      if (result === "ERROR") {
        setArrStandar([]);
      } else {
        const StandarArr = Object.values(result);
        setArrStandar(StandarArr);
      }
      setLoading(false);
    };

    fetchTahunDokumen();
  }, [idSta]);

  useEffect(() => {
    const fetchTahunDokumen = async () => {
      setLoading(true);
      const result = await useFetch(
        `${API_LINK}/MasterIndikatorKinerja/GetListIndikatorKinerjaByStandar`,
        { idData: idSta },
        "POST"
      );

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
      setLoading(false);
    };

    fetchTahunDokumen();
  }, [idSta]);

  useEffect(() => {
    const fetchStandar = async () => {
      setLoading(true);
      const result = await useFetch(
        `${API_LINK}/MasterIndikatorKinerja/GetDataIndikatorKinerjaById`,
        { idData: idData },
        "POST"
      );

      if (result === "ERROR") {
        formData({});
      } else {
        const StandarArr = Object.values(result);
        const obj = StandarArr[0];
        setFormData(obj);
        // setFormData((prev) => {
        //   return {
        //     ...prev,
        //     aktualIka: "-",
        //   };
        // });
      }
      setLoading(false);
    };

    fetchStandar();
  }, [location.state]);

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

  const handleSubmit = async () => {
    const body = {
      idIka: idData,
      staPelIka: formData.staPelIka || "",
      namaIka:
        decodeHtml(formData.namaIka).replace(/<\/?[^>]+(>|$)/g, "") || "",
      urutanIka: formData.urutanIka || "",
      picIka: formData.picIka || "",
      parentIka: formData.parentIka || "",
      targetIka: formData.targetIka || "",
      aktualIka: formData.aktualIka || "",
      capaianIka: formData.capaianIka || "",
    };

    const isNamaIkaValid = namaIkaRef.current?.validate();
    const isPicIkaValid = picIkaRef.current?.validate();
    const isUrutanIkaValid = urutanIkaRef.current?.validate();
    const isTargetIkaValid = targetIkaRef.current?.validate();
    const isAktualIkaValid = aktualIkaRef.current?.validate();

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
    if (!isTargetIkaValid) {
      targetIkaRef.current?.focus();
      return;
    }
    if (!isAktualIkaValid) {
      aktualIkaRef.current?.focus();
      return;
    }

    try {
      const createResponse = await useFetch(
        `${API_LINK}/MasterIndikatorKinerja/EditDataIndikatorKinerja`,
        body,
        "POST"
      );

      if (createResponse === "ERROR") {
        throw new Error("Gagal memperbarui data");
      } else {
        SweetAlert(
          "Berhasil!",
          "Data berhasil diperbarui.",
          "success",
          "OK"
        ).then(() => onChangePage("index"));
      }
    } catch (error) {
      console.error("Error:", error.message);
      SweetAlert("Gagal!", error.message, "error", "OK");
    }
  };

  if (loading) return <Loading />;

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
              <HeaderForm label="Indikator Kinerja" />
              {!loading ? (
                <div className="row mb-3">
                  <div className="col-lg-12 col-md-12">
                    <InputArea
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
                          value={formData.staPelIka}
                          ref={staPelIkaRef}
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
                      ref={aktualIkaRef}
                      label="Aktual"
                      value={formData.aktualIka}
                      forInput="aktualIka"
                      onChange={(e) =>
                        setFormData({ ...formData, aktualIka: e.target.value })
                      }
                      isRequired={false}
                      type="text"
                      // maxChar="100"
                    />
                  </div>
                  <div className="col-lg-6 col-md-6">
                    <DropDown
                      arrData={arrData}
                      type="pilih"
                      label="Status Capaian"
                      forInput="capaianIka"
                      isRequired={false}
                      onChange={handleChange}
                      value={formData.capaianIka || ""}
                      ref={capaianIkaRef}
                    />
                  </div>
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
                        onClick={() => onChangePage("index")}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
