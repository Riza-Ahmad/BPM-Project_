import React from "react";
import PageTitleNav from "../../../part/PageTitleNav";
import TextField from "../../../part/TextField";
import HeaderForm from "../../../part/HeaderText";
import Button from "../../../part/Button";
import Dropdown from "../../../part/Dropdown";

export default function Add({ onChangePage }) {
  const title = "KEBIJAKAN PERATURAN";
  const breadcrumbs = [
    { label: "Peraturan", href: "/peraturan/kebijakan" },
    {
      label: "Kebijakan Peraturan",
      href: "/peraturan/kebijakan/kelola",
    },
    { label: "Tambah Kebijakan Peraturan" },
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
              onClick={() => onChangePage("index")}
            />
          </div>

          {/* Main Content Section */}
          <div className="shadow p-5 m-5 mt-0 bg-white rounded">
            <HeaderForm label="Formulir Kebijakan Peraturan" />
            <div className="row">
              <TextField label="Judul Dokumen " isRequired={true} />
            </div>
            <div className="row">
              <div className="col-lg-6 col-md-6">
                <TextField label="Nomor Induk Dokumen" isRequired={true} />
              </div>
              <div className="col-lg-6 col-md-6">
                <TextField label="Tahun Dokumen" isRequired={true} />
              </div>
              <div className="col-lg-6 col-md-6">
                <Dropdown
                  label="Jenis Dokumen"
                  isRequired={true}
                  arrData={[
                    { Text: "Controlled Copy", Value: "controlled" },
                    { Text: "Uncontrolled Copy", Value: "uncontrolled" },
                  ]}
                />
              </div>
              <div className="col-lg-6 col-md-6">
                <TextField label="Tahun Kadaluarsa" />
              </div>
            </div>

            <div className="d-flex justify-content-between align-items-center mt-4">
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
