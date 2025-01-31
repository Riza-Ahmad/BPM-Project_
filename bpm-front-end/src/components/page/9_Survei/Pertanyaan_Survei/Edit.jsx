import React, { useState, useEffect } from "react";
import PageTitleNav from "../../../part/PageTitleNav";
import InputField from "../../../part/InputField";
import HeaderForm from "../../../part/HeaderText";
import Button from "../../../part/Button";
import Dropdown from "../../../part/Dropdown";
import { API_LINK } from "../../../util/Constants";
import SweetAlert from "../../../util/SweetAlert";
import { useLocation, useNavigate } from "react-router-dom";

export default function Edit({ onChangePage }) {
  const title = "Edit Pertanyaan";
  const breadcrumbs = [
    { label: "Pertanyaan Survei", href: "/survei/pertanyaan" },
    { label: "Edit Pertanyaan" },
  ];

  const location = useLocation();
  const navigate = useNavigate();

  const [pertanyaanId, setPertanyaanId] = useState("");
  const [pertanyaan, setPertanyaan] = useState("");
  const [kriteriaSurvei, setKriteriaSurvei] = useState([]);
  const [selectedKriteriaSurvei, setSelectedKriteriaSurvei] = useState("");
  const [skalaPenilaian, setSkalaPenilaian] = useState([]);
  const [selectedSkalaPenilaian, setSelectedSkalaPenilaian] = useState("");
  const [status, setStatus] = useState(1);
  const [createdBy, setCreatedBy] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${API_LINK}/MasterPertanyaan/GetPertanyaanById`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ id: location.state.idPertanyaan }),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        const data = result[0];

        setPertanyaanId(data.pty_id);
        setPertanyaan(data.pty_pertanyaan);
        setStatus(data.pty_status);
        setCreatedBy(data.pty_created_by);
        setSelectedKriteriaSurvei(data.ksr_id);
        setSelectedSkalaPenilaian(data.skp_id);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const fetchDropdownData = async () => {
      try {
        const [kriteriaResponse, skalaResponse] = await Promise.all([
          fetch(`${API_LINK}/MasterKriteriaSurvei/GetDataKriteriaSurvei`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({}),
          }),
          fetch(`${API_LINK}/SkalaPenilaian/GetSkalaPenilaian`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({}),
          }),
        ]);

        if (!kriteriaResponse.ok || !skalaResponse.ok) {
          throw new Error("Failed to fetch dropdown data");
        }

        const kriteriaData = await kriteriaResponse.json();
        const skalaData = await skalaResponse.json();

        setKriteriaSurvei(
          kriteriaData.map((item) => ({
            Value: item.ksr_id,
            Text: item.ksr_nama,
          }))
        );
        setSkalaPenilaian(
          skalaData.map((item) => ({ Value: item.skp_id, Text: item.skp_tipe }))
        );
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
      }
    };

    fetchData();
    fetchDropdownData();
  }, [location.state.idPertanyaan]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      pertanyaanId,
      pertanyaan,
      status,
      createdBy,
      selectedKriteriaSurvei,
      selectedSkalaPenilaian,
    };

    const confirm = await SweetAlert(
      "Konfirmasi",
      "Apakah Anda yakin ingin menyimpan perubahan?",
      "warning",
      "Ya",
      null,
      "",
      true
    );

    if (!confirm) return;

    try {
      const response = await fetch(
        `${API_LINK}/MasterPertanyaan/editPertanyaan`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      await SweetAlert("Berhasil", "Data berhasil diperbarui!", "success");
      onChangePage("index");
    } catch (error) {
      console.error("Error updating data:", error);
      await SweetAlert("Error", `Terjadi kesalahan: ${error.message}`, "error");
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <main className="flex-grow-1 p-3" style={{ marginTop: "80px" }}>
        <div className="m-3">
          <PageTitleNav
            title={title}
            breadcrumbs={breadcrumbs}
            onClick={() => onChangePage("index")}
          />
        </div>

        <div className="shadow p-5 m-5 mt-0 bg-white rounded">
          <HeaderForm label="Edit Pertanyaan" />
          <form onSubmit={handleSubmit}>
            <InputField
              label="Pertanyaan"
              value={pertanyaan}
              onChange={(e) => setPertanyaan(e.target.value)}
              isRequired={true}
            />
            <Dropdown
              arrData={kriteriaSurvei}
              label="Kriteria Survei"
              value={selectedKriteriaSurvei}
              onChange={(e) => setSelectedKriteriaSurvei(e.target.value)}
            />
            <Dropdown
              arrData={skalaPenilaian}
              label="Skala Penilaian"
              value={selectedSkalaPenilaian}
              onChange={(e) => setSelectedSkalaPenilaian(e.target.value)}
            />
            {/* Button Submit and Cancel */}
            <div className="row mt-3">
              <div className="col-md-6 text-center">
                <Button
                  classType="primary"
                  type="submit"
                  label="Simpan"
                  width="100%"
                />
              </div>
              <div className="col-md-6 text-center">
                <Button
                  classType="danger"
                  type="button"
                  label="Batal"
                  width="100%"
                />
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
