import Swal from "sweetalert2";
import React, { useEffect, useState } from "react";
import PageTitleNav from "../../../part/PageTitleNav";
import TextField from "../../../part/TextField";
import HeaderForm from "../../../part/HeaderText";
import Button from "../../../part/Button";
import Dropdown from "../../../part/Dropdown";
import { API_LINK } from "../../../util/Constants";

export default function Add({ onChangePage }) {
  const title = "Tambah Pertanyaan";
  const breadcrumbs = [
    { label: "Daftar Pertanyaan", href: "/survei/pertanyaan" },
    { label: "Tambah Pertanyaan", href: "/survei/pertanyaan/add" },
  ];

  const [pertanyaan, setPertanyaan] = useState("");
  const [kriteriaSurvei, setKriteriaSurvei] = useState([]);
  const [skalaPenilaian, setSkalaPenilaian] = useState([]);
  const [isStatus, setIsStatus] = useState(1);
  const [createdBy, setCreatedBy] = useState("");
  const [selectedKriteriaSurvei, setSelectedKriteriaSurvei] = useState("");
  const [selectedSkalaPenilaian, setSelectedSkalaPenilaian] = useState("");

  useEffect(() => {
    const fetchDataSkala = async () => {
      try {
        const response = await fetch(
          `${API_LINK}/SkalaPenilaian/GetSkalaPenilaian`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({}),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        const formattedData = result.map((item) => ({
          Value: item.skp_id,
          Text: item.skp_tipe,
        }));
        setSkalaPenilaian(formattedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const fetchDataKriteria = async () => {
      try {
        const response = await fetch(
          `${API_LINK}/MasterKriteriaSurvei/GetDataKriteriaSurvei`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({}),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        const formattedData = result.map((item) => ({
          Value: item.ksr_id,
          Text: item.ksr_nama,
        }));

        setKriteriaSurvei(formattedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchDataSkala();
    fetchDataKriteria();
  }, [API_LINK]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      selectedKriteriaSurvei,
      pertanyaan,
      selectedSkalaPenilaian,
      isStatus,
      createdBy,
    };

    try {
      const response = await fetch(
        `${API_LINK}/MasterPertanyaan/CreatePertanyaan`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      console.log("Hasil dari server:", result);

      Swal.fire({
        title: "Berhasil!",
        text: "Pertanyaan berhasil dibuat.",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => onChangePage("index"));
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        title: "Error",
        text: `Terjadi kesalahan: ${error.message}`,
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const handleCancel = () => {
    Swal.fire({
      title: "Yakin?",
      text: "Perubahan belum disimpan, apakah Anda yakin ingin membatalkan?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, batalkan",
      cancelButtonText: "Tidak",
    }).then((result) => {
      if (result.isConfirmed) {
        onChangePage("index");
      }
    });
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <main className="flex-grow-1 p-3" style={{ marginTop: "80px" }}>
        <div className="d-flex flex-column">
          <div className="m-3">
            <PageTitleNav
              title={title}
              breadcrumbs={breadcrumbs}
              onClick={() => onChangePage("index")}
            />
          </div>

          <div className="shadow p-5 m-5 mt-0 bg-white rounded">
            <HeaderForm label="Formulir Pertanyaan" />

            <form onSubmit={handleSubmit}>
              {/* Input Pertanyaan */}
              <div className="row">
                <div className="col-lg-12 col-md-6">
                  <TextField
                    label="Pertanyaan"
                    value={pertanyaan}
                    onChange={(e) => setPertanyaan(e.target.value)}
                    isRequired={true}
                  />
                </div>

                <div className="col-lg-12 col-md-6">
                  <Dropdown
                    arrData={kriteriaSurvei}
                    label="Kriteria Survei"
                    isRequired={true}
                    onChange={(e) => setSelectedKriteriaSurvei(e.target.value)}
                    value={selectedKriteriaSurvei}
                    type="pilih"
                    forInput="kriteriaSurvei"
                  />
                </div>

                <div className="col-lg-12 col-md-6">
                  <Dropdown
                    arrData={skalaPenilaian}
                    label="Skala Penilaian"
                    isRequired={true}
                    onChange={(e) => setSelectedSkalaPenilaian(e.target.value)}
                    value={selectedSkalaPenilaian}
                    type="pilih"
                    forInput="skalaPenilaian"
                  />
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
                    onClick={handleCancel}
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
