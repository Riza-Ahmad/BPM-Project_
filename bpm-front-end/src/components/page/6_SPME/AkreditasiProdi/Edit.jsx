import React from "react";
import PageTitleNav from "../../../part/PageTitleNav";
import TextField from "../../../part/TextField";
import HeaderForm from "../../../part/HeaderText";
import Button from "../../../part/Button";
import DropDown from "../../../part/Dropdown";
import DocUpload from "../../../part/DocUpload";

export default function Edit({ onChangePage }) {
  const title = "Edit Dokumen";
  const breadcrumbs = [
    { label: "SPME" },
    { label: "Status Akreditasi" },
    { label: "Program Studi" },
    { label: "Edit" },
  ];
  const arrData = [
    { Value: "Controlled Copy", Text: "Controlled Copy" },
    { Value: "Uncontrolled Copy", Text: "Uncontrolled Copy" },
  ];
  const arrAkre = [
    { Value: "Unggul", Text: "Unggul" },
    { Value: "Baik Sekali", Text: "Baik Sekali" },
    { Value: "Baik", Text: "Baik" },
    { Value: "A", Text: "A" },
    { Value: "B", Text: "B" },
    { Value: "C", Text: "C" },
    { Value: "Belum Terakreditasi", Text: "Belum Terakreditasi" },
  ];

  const arrProdi = [
    {value: "Manajemen Informatika (MI)", Text: "Manajemen Informatika (MI)"},
    {value: "Mekratonika (MK)", Text: "Mekratonika (MK)"},
    {value: "Teknik Pembuatan Peralatan Perkakas Produksi (P4)", Text: "Teknik Pembuatan Peralatan Perkakas Produksi (P4)"},
    {value: "Teknik Produksi dan Proses Manufaktur (TPPM)", Text: "Teknik Produksi dan Proses Manufaktur (TPPM)"},
    {value: "Mesin Otomotif (MO)", Text: "Mesin Otomotif (MO)"},
    {value: "Teknologi Konstruksi Bangunan Gedung (TKBG)", Text: "Teknologi Konstruksi Bangunan Gedung (TKBG)"},
    {value: "Teknologi Rekayasa Logistik (TRL)", Text: "Teknologi Rekayasa Logistik (TRL)"},
    {value: "Teknologi Rekayasa Perangkat Lunak (TRPL)", Text: "Teknologi Rekayasa Perangkat Lunak (TRPL)"},
  ];

  const handleChange = (e) => {
    console.log("Selected Value:", e.target.value);
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <main className="flex-grow-1 mb-5" style={{ marginTop: "80px" }}>
        <div className="d-flex flex-column">
          <div className="container mb-3">
            {/* Breadcrumbs and Page Title */}
            <div className="mt-4">
              <PageTitleNav
                title={title}
                breadcrumbs={breadcrumbs}
                onClick={() => onChangePage("index")}
              />
            </div>

            {/* Main Content Section */}
            <div className="shadow p-5 mt-0 bg-white rounded">
              <HeaderForm label={"Formulir "+title} />
              <div className="row">
                <TextField label="Judul Dokumen " isRequired={true} />
              </div>
              <div className="row">
                <div className="col-lg-6 col-md-6 ">
                  <TextField label="Nomor Induk Dokumen" isRequired="true" />
                </div>
                <div className="col-lg-6 col-md-6">
                  <TextField
                    label="Tanggal Berlaku"
                    isRequired="true"
                    type="date"
                  />
                </div>
                <div className="col-lg-6 col-md-6">
                  <DropDown
                    arrData={arrData}
                    type="pilih"
                    label="Jenis Dokumen"
                    forInput="dropdownExample"
                    isRequired={true}
                    onChange={handleChange}
                    errorMessage="" // Add an error message if needed
                  />
                </div>
                <div className="col-lg-6 col-md-6">
                  <TextField
                    label="Tanggal Kadaluarsa"
                    isRequired="true"
                    type="date"
                  />
                </div>
                <div className="col-lg-6 col-md-6">
                  <DropDown
                    arrData={arrProdi}
                    type="pilih"
                    label="Pilih Program Studi"
                    forInput="dropdownExample"
                    isRequired={true}
                    onChange={handleChange}
                    errorMessage="" // Add an error message if needed
                  />
                </div>
                <div className="col-lg-6 col-md-6">
                  <DropDown
                    arrData={arrAkre}
                    type="pilih"
                    label="Tingkat Akreditasi"
                    forInput="dropdownExample"
                    isRequired={true}
                    onChange={handleChange}
                    errorMessage="" // Add an error message if needed
                  />
                </div>
              </div>

              <div className="row">
                <DocUpload
                  label="Dokumen"
                  forInput="document"
                  isRequired={true}
                />
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
        </div>
      </main>
    </div>
  );
}
