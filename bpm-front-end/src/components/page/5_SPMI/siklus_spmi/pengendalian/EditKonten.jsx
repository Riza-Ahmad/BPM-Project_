import React, { useState } from "react";
import PageTitleNav from "../../../../part/PageTitleNav";
import TextArea from "../../../../part/TextArea";
import UploadFoto from "../../../../part/UploadFotoMulti";
import HeaderForm from "../../../../part/HeaderText";
import Button from "../../../../part/Button";

export default function EditKonten({ onChangePage }) {
  const title = "Edit Konten";
  const breadcrumbs = [
    { label: "Siklus SPMI" },
    { label: "Pengendalian", href: "/spmi/siklus/pengendalian" },
    { label: "Edit Konten" },
  ];

  return (
    <div className="d-flex flex-column min-vh-100">
      <main className="flex-grow-1 p-3" style={{ marginTop: "80px" }}>
        <div className="d-flex flex-column">
          {/* Breadcrumbs and Page Title */}
          <div className="m-3">
            <PageTitleNav
              title={title}
              breadcrumbs={breadcrumbs}
              onClick={() => onChangePage("pengendalian")} // Corrected usage
            />
          </div>

          {/* Main Content Section */}
          <div className="shadow p-5 m-5 mt-0 bg-white rounded">
            <HeaderForm label="Formulir Menu" />
            <TextArea label="Pengantar Menu" />
            <div className="row">
              <div className="col-lg-4 col-md-6 ">
                <UploadFoto label="Masukkan Foto 1" />
              </div>
              <div className="col-lg-4 col-md-6">
                <UploadFoto label="Masukkan Foto 2" />
              </div>
              <div className="col-lg-4 col-md-6">
                <UploadFoto label="Masukkan Foto 3" />
              </div>
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
