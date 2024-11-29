import React, { useState } from "react";
import PageTitleNav from "../../../../part/PageTitleNav";
import TextField from "../../../../part/TextField";
import TextArea from "../../../../part/TextArea";
import DatePicker from "../../../../part/DatePicker";
import UploadFoto from "../../../../part/UploadFotoMulti";
import HeaderForm from "../../../../part/HeaderText";
import Button from "../../../../part/Button";
import DetailData from "../../../../part/DetailData";
import DocUpload from "../../../../part/DocUpload";
import DropDown from "../../../../part/Dropdown";

export default function Edit({ onChangePage }) {
  const title = "Edit Dokumen";
  const breadcrumbs = [
    { label: "Siklus SPMI" },
    { label: "Pelaksanaan", href: "/spmi/siklus/pelaksanaan" },
    { label: "Edit Dokumen" },
  ];

  const arrData = [
    { Value: "Controlled Copy", Text: "Controlled Copy" },
    { Value: "Uncontrolled Copy", Text: "Uncontrolled Copy" }
  ];

  const handleChange = (e) => {
    console.log("Selected Value:", e.target.value);
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <main className="flex-grow-1 p-3" style={{ marginTop: "80px" }}>
        <div className="d-flex flex-column">
          {/* Breadcrumbs and Page Title */}
          <div className="m-3">
            <PageTitleNav
              title={title}
              breadcrumbs={breadcrumbs}
              onClick={() => onChangePage("pelaksanaan")}
            />
          </div>

          {/* Main Content Section */}
          <div className="shadow p-5 m-5 mt-0 bg-white rounded">
            <HeaderForm label="Formulir Dokumen" />
            <TextField label="Judul Dokumen" isRequired="true" />
            <div className="row">
              <div className="col-lg-6 col-md-6 ">
                <TextField label="Nomor Induk Dokumen" isRequired="true" />
              </div>
              <div className="col-lg-6 col-md-6">
                <TextField label="Tahun Dokumen" isRequired="true" type="date" />
              </div>
              <div className="col-lg-6 col-md-6">
                <DropDown
                  arrData={arrData}
                  type="pilih"
                  label="Select an Option"
                  forInput="dropdownExample"
                  isRequired={true}
                  onChange={handleChange}
                  errorMessage="" // Add an error message if needed
                />
              </div>
              <div className="col-lg-6 col-md-6">
                <TextField label="Tahun Kadaluarsa" isRequired="true" type="date" />
              </div>
            </div>

            <div className="row">
              <DocUpload
                label="Dokumen"
                forInput="document"
                isRequired={true}
              />
            </div>

            <div className="d-flex justify-content-between align-items-center">
              <div className="flex-grow-1 m-2">
                <Button
                  classType="primary"
                  type="submit"
                  label="Simpan"
                  width="100%"
                />
              </div>
              <div className="flex-grow-1 m-2">
                <Button
                  classType="danger"
                  type="button"
                  label="Batal"
                  width="100%"
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
