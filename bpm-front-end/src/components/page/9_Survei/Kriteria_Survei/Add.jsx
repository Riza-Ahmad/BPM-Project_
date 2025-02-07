import React, { useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { API_LINK } from "../../../util/Constants";
import { useIsMobile } from "../../../util/useIsMobile";
import PageTitleNav from "../../../part/PageTitleNav";
import InputField from "../../../part/InputField";
import Button from "../../../part/Button";
import SweetAlert from "../../../util/SweetAlert";
import { useFetch } from "../../../util/useFetch";

export default function Add({ onChangePage }) {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const location = useLocation();
  const idMenu = location.state?.idMenu;
  const [formData, setFormData] = useState({
    ksr_nama: "",
  });

  const ksr_namaRef = useRef();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const errors = [];
    if (!formData.ksr_nama || formData.ksr_nama.trim() === "") {
      errors.push("Nama Kriteria tidak boleh kosong.");
    }
    return errors;
  };
  const isNameDuplicate = async (name) => {
    try {
      const response = await fetch(
        `${API_LINK}/MasterKriteria/GetAllDataKriteria`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ page: 1, pageSize: 100 }),
        }
      );

      if (response.ok) {
        const result = await response.json();
        return result.some(
          (item) => item.ksr_nama.toLowerCase() === name.toLowerCase()
        );
      } else {
        throw new Error("Gagal memeriksa duplikasi nama.");
      }
    } catch (error) {
      console.error("Error checking duplicate:", error);
      return false; // Jika ada error, anggap tidak duplikat (default)
    }
  };

  const handleSubmit = async () => {
    const isNamaKriValid = ksr_namaRef.current?.validate();

    if (!isNamaKriValid) {
      ksr_namaRef.current?.focus();
      return;
    }
    const isDuplicate = await isNameDuplicate(formData.ksr_nama);
    if (isDuplicate) {
      SweetAlert(
        "Gagal Menambahkan Nama Kriteria",
        "Nama Kriteria sudah digunakan. Pilih Nama Kriteria Lain",
        "warning",
        "OK"
      );
      return;
    }
    try {
      const kriData = {
        namaKri: ksr_namaRef.current.value,
      };

      const createResponse = await useFetch(
        `${API_LINK}/MasterKriteriaSurvei/CreateKriteriaSurvei`,
        kriData,
        "POST"
      );

      if (createResponse === "ERROR") {
        throw new Error("Gagal menambah data");
      } else {
        SweetAlert("Berhasil!", "Data berhasil ditambahkan.", "success", "OK");
        navigate("/survei/kriteria");
      }
    } catch (error) {
      console.error("Error:", error.message);
      SweetAlert("Gagal!", error.message, "error", "OK");
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <main className="flex-grow-1 p-3" style={{ marginTop: "80px" }}>
        <div className="d-flex flex-column">
          <div className={isMobile ? "m-0 p-0" : "m-3 mb-0"}>
            <PageTitleNav
              title="Tambah Kriteria Survei"
              breadcrumbs={[
                { label: "Kriteria Survei", href: "/survei/kriteria" },
                { label: "Tambah", href: "/survei/kriteria/add" },
              ]}
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
              <div className="row">
                <InputField
                  ref={ksr_namaRef}
                  label="Nama Kriteria"
                  value={formData.ksr_nama}
                  onChange={handleChange}
                  isRequired={true}
                  placeHolder="Masukkan Nama Kriteria"
                  maxChar="100"
                  name="ksr_nama"
                />
              </div>

              <div className="d-flex justify-content-between align-items-center">
                <div className="m-2" style={{ flex: 1 }}>
                  <Button
                    classType="primary"
                    label="Simpan"
                    onClick={handleSubmit}
                    width="100%"
                  />
                </div>
                <div className="m-2" style={{ flex: 1 }}>
                  <Button
                    classType="danger"
                    label="Batal"
                    onClick={() => navigate("/survei/kriteria")}
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
