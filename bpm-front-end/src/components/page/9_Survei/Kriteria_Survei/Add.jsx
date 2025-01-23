import React, { useState } from "react";
import { API_LINK } from "../../../util/Constants";
import { useIsMobile } from "../../../util/useIsMobile";
import PageTitleNav from "../../../part/PageTitleNav";
import InputField from "../../../part/InputField";
import Button from "../../../part/Button";
import Swal from "sweetalert2";

export default function Add({ onChangePage }) {
  const isMobile = useIsMobile();
  const [formData, setFormData] = useState({
    ksr_nama: "",
    ksr_created_by: "Admin",
    ksr_created_date: new Date().toISOString(),
  });
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
        `${API_LINK}/MasterKriteriaSurvei/GetDataKriteriaSurvei`,
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

  const handleAddKriteria = async () => {
    const errors = validateForm();

    if (errors.length > 0) {
      Swal.fire({
        icon: "warning",
        title: "Gagal Menambah Kriteria Survei",
        html: errors.map((err) => `<p>${err}</p>`).join(""),
      });
      return;
    }

    const isDuplicate = await isNameDuplicate(formData.ksr_nama);
    if (isDuplicate) {
      Swal.fire({
        icon: "warning",
        title: "Gagal Menambah Kriteria Survei",
        text: "Nama Kriteria sudah digunakan. Silakan Masukan Nama Kriteria yang lain.",
      });
      return;
    }
    try {
      const response = await fetch(
        `${API_LINK}/MasterKriteriaSurvei/CreateKriteriaSurvei`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        Swal.fire("Success", "Template berhasil disimpan!", "success");
        onChangePage("index");
      } else {
        const error = await response.json();
        Swal.fire(
          "Error",
          `Gagal menambahkan kriteria: ${error.message}`,
          "error"
        );
      }
    } catch (error) {
      Swal.fire("Error", `Terjadi kesalahan: ${error.message}`, "error");
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
              }>
              <div className="row">
                <InputField
                  label="Nama Kriteria"
                  value={formData.ksr_nama}
                  onChange={(e) =>
                    setFormData({ ...formData, ksr_nama: e.target.value })
                  }
                  isRequired={true}
                  placeHolder="Masukkan Nama Kriteria"
                />
              </div>

              <div className="d-flex justify-content-between align-items-center">
                <div className="m-2" style={{ flex: 1 }}>
                  <Button
                    classType="primary"
                    label="Simpan"
                    onClick={handleAddKriteria}
                    width="100%"
                  />
                </div>
                <div className="m-2" style={{ flex: 1 }}>
                  <Button
                    classType="danger"
                    label="Batal"
                    onClick={() => onChangePage("index")}
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
