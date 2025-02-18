import React from "react";
import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import PageTitleNav from "../../../../part/PageTitleNav";
import TextField from "../../../../part/TextField";
import HeaderForm from "../../../../part/HeaderText";
import InputField from "../../../../part/InputField";
import FileUpload from "../../../../part/FileUpload";
import Button from "../../../../part/Button";
import DropDown from "../../../../part/Dropdown";
import { useFetch } from "../../../../util/useFetch";
import TextArea from "../../../../part/TextArea";
import { uploadFile } from "../../../../util/UploadFile";
import { API_LINK } from "../../../../util/Constants";
import DocUpload from "../../../../part/DocUpload";
import { useIsMobile } from "../../../../util/useIsMobile";
import Loading from "../../../../part/Loading";
import SweetAlert from "../../../../util/SweetAlert";
import { decodeHtml } from "../../../../util/DecodeHtml";

const arrData = [
  { Value: "Nasional", Text: "Nasional" },
  { Value: "Pelampauan", Text: "Pelampauan" },
];

export default function Edit({ onChangePage }) {
  const title = "Tambah Data";
  const breadcrumbs = [
    { label: "SPMI" },
    { label: "Siklus SPMI" },
    { label: "Peningkatan" },
  ];
  const isMobile = useIsMobile();

  const location = useLocation();
  const idMenu = location.state?.idMenu;
  const idData = location.state?.idData;

  const [formData, setFormData] = useState({
    judulSta: "",
    peningkatanSta: "",
    jenisSta: "",
    tahunSta: "",
    urutanSta: "",
    parentSta: "",
  });

  const [loading, setLoading] = useState(true);
  const namaStaRef = useRef();
  const peningkatanStaRef = useRef();
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

  useEffect(() => {
    const fetchStandar = async () => {
      setLoading(true);
      const result = await useFetch(
        `${API_LINK}/MasterStandar/GetDataStandarById`,
        { idData: idData },
        "POST"
      );

      if (result === "ERROR") {
        formData({});
      } else {
        const StandarArr = Object.values(result);
        const obj = StandarArr[0];
        setFormData({
          idSta: idData,
          judulSta: decodeHtml(obj.judulSta),
          jenisSta: obj.jenisSta,
          tahunSta: obj.tahunSta,
          urutanSta: obj.urutanSta,
          peningkatanSta: obj.peningkatanSta,
          parentSta: obj.parentIdSta || "",
          path: obj.path || "",
        });
      }
      setLoading(false);
    };

    fetchStandar();
  }, [location.state?.idData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    const isPeningkatanStaValid = peningkatanStaRef.current?.validate();

    if (!isPeningkatanStaValid) {
      peningkatanStaRef.current?.focus();
      return;
    }

    try {
      const createResponse = await useFetch(
        `${API_LINK}/MasterStandar/EditDataPeningkatanStandar`,
        {
          param1: idData,
          param2: decodeHtml(formData.peningkatanSta),
        },
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
                onClick={() =>
                  onChangePage("index", {
                    idMenu: idMenu,
                  })
                }
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
                <div className="col-lg-12 col-md-12">
                  <InputField
                    ref={namaStaRef}
                    label="Standar Dikti"
                    value={formData.judulSta}
                    onChange={handleChange}
                    isDisabled={true}
                    name="judulSta"
                    type="text"
                  />
                </div>
                <div className="col-lg-12 col-md-12">
                  <TextArea
                    ref={peningkatanStaRef}
                    label="Bentuk Peningkatan"
                    value={decodeHtml(formData.peningkatanSta)}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        peningkatanSta: e.target.value,
                      })
                    }
                    isRequired={true}
                  />
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
      </main>
    </div>
  );
}
