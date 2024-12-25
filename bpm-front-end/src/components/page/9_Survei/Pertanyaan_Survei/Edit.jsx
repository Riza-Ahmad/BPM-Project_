import React, { useState, useEffect } from "react";
import PageTitleNav from "../../../part/PageTitleNav";
import TextField from "../../../part/TextField";
import HeaderForm from "../../../part/HeaderText";
import Button from "../../../part/Button";
import Dropdown from "../../../part/Dropdown";

export default function Edit({ onChangePage, questionData }) {
  const [formData, setFormData] = useState({
    pertanyaanUmum: "",
    pertanyaan: "",
    kriteriaSurvei: "",
    responden: "",
  });

  const [isPertanyaanUmumYes, setPertanyaanUmumYes] = useState(false);

  const handlePertanyaanUmumChange = (value) => {
    setFormData((prev) => ({ ...prev, pertanyaanUmum: value }));
    setPertanyaanUmumYes(value === "Ya");
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // useEffect(() => {
  //     if (location.State?.editData) {
  //         const editID = location.state.editData;
  //         const selectedData = data.find((item) => item.key == editID);
  //         if (selectedData) {
  //             setFormData({
  //                 pertanyaanUmum: selectedData.pertanyaanUmum,
  //                 pertanyaan: selectedData.pertanyaan,
  //                 kriteriaSurvei: selectedData.kriteriaSurvei,
  //                 responden: selectedData.responden,
  //             });
  //         }
  //      }
  //  }, [location.state, data]);

  const handleSubmit = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <main className="flex-grow-1 p-3" style={{ marginTop: "80px" }}>
        <div className="d-flex flex-column">
          <div className="m-3 mb-0">
            <PageTitleNav
              title="Edit Pertanyaan "
              breadcrumbs={[
                { label: "Daftar Pertanyaan", href: "/survei/pertanyaan" },
                {
                  label: "Edit Pertanyaan",
                  href: "/survei/pertanyaan/edit",
                },
              ]}
              onClick={() => onChangePage("index")}
            />
          </div>

          <div className="shadow p-5 m-5 mt-0 bg-white rounded">
            <HeaderForm label="Formulir Edit Pertanyaan" />
            {/* 
                        <div className="row">
                        <Dropdown
                            label="Pertanyaan Umum"
                            isRequired={true}
                            arrData={[
                            { Text: "Tidak", Value: "Tidak" },
                            { Text: "Ya", Value: "Ya" },
                            ]}
                            value={formData.pertanyaanUmum}
                            onChange={(e) => handlePertanyaanUmumChange(e.target.value)}
                        />
                        </div> */}

            <div className="row">
              <label style={{ fontWeight: "bold" }}>
                Pertanyaan Umum <span style={{ color: "red" }}>*</span>
              </label>
              <div className="custom-radio-dropdown">
                <div className="radio-item">
                  <input
                    type="radio"
                    id="tidak"
                    name="pertanyaanUmum"
                    value="Tidak"
                    required
                    onChange={(e) => handlePertanyaanUmumChange(e.target.value)}
                  />
                  <label htmlFor="tidak">Tidak</label>
                </div>
                <div className="radio-item">
                  <input
                    type="radio"
                    id="ya"
                    name="pertanyaanUmum"
                    value="Ya"
                    required
                    onChange={(e) => handlePertanyaanUmumChange(e.target.value)}
                  />
                  <label htmlFor="ya">Ya</label>
                </div>
              </div>
            </div>
            <br />

            <div className="row">
              <div className="col-lg-12 col-md-6">
                <TextField
                  label="Pertanyaan"
                  isRequired={true}
                  value={formData.pertanyaan}
                  onChange={(e) =>
                    handleInputChange("pertanyaan", e.target.value)
                  }
                />
              </div>

              <div className="col-lg-12 col-md-6">
                <Dropdown
                  label="Kriteria Survei"
                  isRequired={true}
                  arrData={[
                    { Text: "Kepuasan Dosen", Value: "Kepuasan Dosen" },
                    {
                      Text: "Kepuasan Tenaga Pendidik",
                      Value: "Kepuasan Tenaga Pendidik",
                    },
                  ]}
                  value={formData.kriteriaSurvei}
                  disabled={isPertanyaanUmumYes}
                  onChange={(e) =>
                    handleInputChange("kriteriaSurvei", e.target.value)
                  }
                />
              </div>

              <div className="col-lg-12 col-md-6">
                <Dropdown
                  label="Skala Penilaian"
                  isRequired={true}
                  arrData={[
                    {
                      Text: " Radio Button (Cukup, Kurang, Baik, Sangat Baik)",
                      Value: "001",
                    },
                    { Text: " Text Area", Value: "002" },
                  ]}
                  value={formData.kriteriaSurvei}
                  disabled={isPertanyaanUmumYes}
                  onChange={(e) =>
                    handleInputChange("kriteriaSurvei", e.target.value)
                  }
                />
              </div>

              <div className="col-lg-12 col-md-6">
                <Dropdown
                  label="Responden"
                  isRequired={true}
                  arrData={[
                    { Text: "Mahasiswa", Value: "Mahasiswa" },
                    { Text: "Dosen", Value: "Dosen" },
                  ]}
                  value={formData.responden}
                  disabled={isPertanyaanUmumYes}
                  onChange={(e) =>
                    handleInputChange("responden", e.target.value)
                  }
                />
              </div>
            </div>

            <div className="d-flex justify-content-between align-items-center mt-4">
              <div className="flex-grow-1 m-2">
                <Button
                  classType="primary"
                  type="button"
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
                  onClick={() => onChangePage("index")}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
