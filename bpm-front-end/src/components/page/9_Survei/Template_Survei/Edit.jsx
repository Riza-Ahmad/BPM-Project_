import React, { useState, useRef, useEffect } from "react";
import PageTitleNav from "../../../part/PageTitleNav";
import InputField from "../../../part/InputField";
import HeaderForm from "../../../part/HeaderText";
import Button from "../../../part/Button";
import Dropdown from "../../../part/Dropdown";
import { useLocation } from "react-router-dom";
import SweetAlert from "../../../util/SweetAlert";
import { useIsMobile } from "../../../util/useIsMobile";
import { API_LINK } from "../../../util/Constants";
import { useFetch } from "../../../util/useFetch";
import Loading from "../../../part/Loading";

export default function Edit({ onChangePage }) {
  const isMobile = useIsMobile();
  const title = "Edit Template Survei";
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const idMenu = location.state?.idMenu;
  const idData = location.state?.idData;
  const breadcrumbs = location.state?.breadcrumbs;

  const [formData, setFormData] = useState({
    namaTemplate: "",
    skp_id: "",
    ksr_id: "",
  });

  const namaTemplateRef = useRef();
  const skpIdRef = useRef();
  const ksrIdRef = useRef();

  const [skpOptions, setSkpOptions] = useState([]);
  const [ksrOptions, setKsrOptions] = useState([]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const ksrResponse = await useFetch(
          `${API_LINK}/MasterKriteriaSurvei/GetDataKriteriaSurvei`
        );
        const skpResponse = await useFetch(
          `${API_LINK}/SkalaPenilaian/GetSkalaPenilaian`
        );

        if (ksrResponse && Array.isArray(ksrResponse)) {
          setKsrOptions(
            ksrResponse.map((item) => ({
              Value: item.ksr_id,
              Text: item.ksr_nama,
            }))
          );
        }

        if (skpResponse && Array.isArray(skpResponse)) {
          setSkpOptions(
            skpResponse.map((item) => ({
              Value: item.skp_id,
              Text: item.skp_skala + " (" + item.skp_deskripsi + ")",
            }))
          );
        }
      } catch (error) {
        console.error("Error fetching dropdown options:", error);
      }
    };

    const fetchData = async () => {
      setLoading(true);

      await fetchOptions();

      // Fetch existing template data
      const body = { idData: idData };
      const result = await useFetch(
        `${API_LINK}/TemplateSurvei/GetDataTemplateSurveiById`,
        body,
        "POST"
      );

      if (result === "ERROR" || result === null || result.length === 0) {
        setFormData(null);
      } else {
        const arrResult = Object.values(result);
        setFormData({
          namaTemplate: arrResult[0].namaTemplate,
          skp_id: arrResult[0].skp_id,
          ksr_id: arrResult[0].ksr_id,
        });
      }

      setLoading(false);
    };

    fetchData();
  }, [idData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    const isNamaTemplateValid = namaTemplateRef.current?.validate();
    const isSkpIdValid = skpIdRef.current?.validate();
    const isKsrIdValid = ksrIdRef.current?.validate();

    if (!isNamaTemplateValid) {
      namaTemplateRef.current?.focus();
      return;
    }
    if (!isSkpIdValid) {
      skpIdRef.current?.focus();
      return;
    }
    if (!isKsrIdValid) {
      ksrIdRef.current?.focus();
      return;
    }

    try {
      const templateData = {
        idTemplate: idData,
        namaTemplate: namaTemplateRef.current.value,
        skp_id: skpIdRef.current.value,
        ksr_id: ksrIdRef.current.value,
      };
      const response = await useFetch(
        `${API_LINK}/TemplateSurvei/EditTemplate`,
        templateData,
        "POST"
      );

      if (response === "ERROR") {
        throw new Error("Gagal memperbarui data");
      } else {
        SweetAlert(
          "Berhasil!",
          "Template survei berhasil diperbarui.",
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
            <div
              className={
                isMobile
                  ? "shadow p-4 m-2 mt-0 bg-white rounded"
                  : "shadow p-5 m-5 mt-0 bg-white rounded"
              }
            >
              <HeaderForm label="Formulir Template Survei" />
              <InputField
                ref={namaTemplateRef}
                label="Nama Template"
                value={formData.namaTemplate}
                onChange={handleChange}
                isRequired={true}
                name="namaTemplate"
                type="text"
                maxChar="100"
              />
              <Dropdown
                ref={skpIdRef}
                label="SKP ID"
                value={formData.skp_id}
                arrData={skpOptions}
                onChange={handleChange}
                isRequired={true}
                name="skp_id"
                type="pilih"
              />
              <Dropdown
                ref={ksrIdRef}
                label="KSR ID"
                value={formData.ksr_id}
                arrData={ksrOptions}
                onChange={handleChange}
                isRequired={true}
                name="ksr_id"
                type="pilih"
              />
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
