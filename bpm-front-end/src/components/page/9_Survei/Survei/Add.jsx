import React, { useState, useRef, useEffect } from "react";
import PageTitleNav from "../../../part/PageTitleNav";
import InputField from "../../../part/InputField";
import TextArea from "../../../part/TextArea";
import HeaderForm from "../../../part/HeaderText";
import Button from "../../../part/Button";
import Dropdown from "../../../part/Dropdown";
import CheckBox from "../../../part/CheckBox";
import { API_LINK } from "../../../util/Constants";
import SweetAlert from "../../../util/SweetAlert";
import { useIsMobile } from "../../../util/useIsMobile";

export default function Add({ onChangePage }) {
  const title = "Tambah Survei";
  const breadcrumbs = [
    { label: "Survei", href: "/survei/survei" },
    { label: "Tambah Survei" },
  ];
  const isMobile = useIsMobile();
  const [templateOptions, setTemplateOptions] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [loadingTemplate, setLoadingTemplate] = useState(true);
  const checkBoxRef = useRef(null);
  const [selectedValues, setSelectedValues] = useState([]);

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        setLoadingTemplate(true);
        const response = await fetch(`${API_LINK}/TemplateSurvei/GetTemplateSurvei`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch template data!");
        }

        const data = await response.json();
        const formattedTemplate = data.map((item) => ({
          value: item.tsu_id,
          Text: item.tsu_nama,
        }));
        setTemplateOptions(formattedTemplate);
      } catch (error) {
        SweetAlert("Error", error.message, "error");
      } finally {
        setLoadingTemplate(false);
      }
    };

    fetchTemplate();
  }, []);

  return (
    <div className="d-flex flex-column min-vh-100">
      <main className="flex-grow-1 p-3" style={{ marginTop: "80px" }}>
        <div className="d-flex flex-column">
          <PageTitleNav
            title={title}
            breadcrumbs={breadcrumbs}
            onClick={() => onChangePage("index")}
          />
          <div className={isMobile ? "m-0" : "m-3"}>
            <div
              className={
                isMobile
                  ? "shadow p-4 m-2 mt-0 bg-white rounded"
                  : "shadow p-5 m-5 mt-0 bg-white rounded"
              }
            >
              <HeaderForm label="Formulir Survei" />
              <div className="row">
                <div className="col-lg-6 col-md-6">
                  <InputField
                    label="Nama Survei"
                    isRequired={true}
                    placeHolder="Masukkan nama survei"
                  />

                  <InputField
                    label="Tanggal Awal"
                    isRequired={true}
                    placeHolder="Masukkan Tanggal Awal Survei"
                    type="date"
                  />
                </div>

                <div className="col-lg-6 col-md-6">
                <Dropdown
                    arrData={[
                      { value: "", Text: "-- Pilih Template Survei --" },
                      ...templateOptions,
                    ]}
                    label="Template Survei"
                    value={selectedTemplate}
                    onChange={(e) => setSelectedTemplate(e.target.value)}
                    isRequired={true}
                  />
                  <InputField
                    label="Tanggal Akhir"
                    isRequired={true}
                    placeHolder="Masukkan Tanggal Akhir Survei"
                    type="date"
                  />

                 
                </div>
              </div>

              <CheckBox
                ref={checkBoxRef}
                arrData={[
                  { Value: "option1", Text: "Mahasiswa" },
                  { Value: "option2", Text: "Dosen" },
                  { Value: "option3", Text: "Tenaga Pendidik" },
                  { Value: "option4", Text: "Mitra Kerja Sama" },
                ]}
                label="Pilih Responden"
                name="exampleCheckBox"
                isRequired={true}
                values={selectedValues}
                onChange={setSelectedValues}
                errorMessage="Pilih setidaknya satu opsi sebelum melanjutkan."
              />

              <TextArea label="Kata Pembuka" />
              <TextArea label="Kata Penutup" />

              <div className="d-flex justify-content-between align-items-center">
                <div className="flex-grow-1 m-2">
                  <Button
                    classType="primary"
                    type="button"
                    label="Simpan"
                    width="100%"
                    onClick={() => {}}
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