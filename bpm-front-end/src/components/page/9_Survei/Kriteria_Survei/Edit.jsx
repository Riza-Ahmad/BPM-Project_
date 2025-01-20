import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { API_LINK } from "../../../util/Constants";
import { useIsMobile } from "../../../util/useIsMobile";
import PageTitleNav from "../../../part/PageTitleNav";
import InputField from "../../../part/InputField";
import Button from "../../../part/Button";
import Swal from "sweetalert2";

export default function Edit({ onChangePage }) {
  const { id } = useParams();
  const isMobile = useIsMobile();
  const [loading, setLoading] = useState(true);
  const [editFormData, setEditFormData] = useState({
    ksr_id: "",
    ksr_nama: "",
    ksr_status: "1",
    ksr_created_by: "",
    ksr_created_date: "",
    ksr_modif_by: "Admin",
    ksr_modif_date: new Date().toISOString(),
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${API_LINK}/MasterKriteriaSurvei/GetDataKriteriaSurveiById`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ksr_id: id }),
          }
        );

        if (!response.ok) throw new Error("Gagal mengambil data untuk di-edit");

        const result = await response.json();
        const [selectedData] = result;

        setEditFormData((prevState) => ({
          ...prevState,
          ksr_id: selectedData.ksr_id,
          ksr_nama: selectedData.ksr_nama,
          ksr_created_by: selectedData.ksr_created_by,
          ksr_created_date: selectedData.ksr_created_date,
        }));
      } catch (error) {
        console.error("Error fetching data for edit:", error);
        Swal.fire(
          "Error",
          "Terjadi kesalahan saat memuat data untuk di-edit.",
          "error"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleSaveEdit = async () => {
    try {
      const response = await fetch(
        `${API_LINK}/MasterKriteriaSurvei/EditKriteriaSurvei`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editFormData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Gagal menyimpan perubahan");
      }

      Swal.fire("Success", "Data berhasil diperbarui!", "success");
      onChangePage("index");
    } catch (error) {
      console.error("Error saving edit:", error);
      Swal.fire("Error", error.message, "error");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <main className="flex-grow-1 p-3" style={{ marginTop: "80px" }}>
        <div className="d-flex flex-column">
          <div className={isMobile ? "m-0 p-0" : "m-3 mb-0"}>
            <PageTitleNav
              title="Edit Kriteria Survei"
              breadcrumbs={[
                { label: "Kriteria Survei", href: "/survei/kriteria" },
                { label: "Edit", href: `/survei/kriteria/edit/${id}` },
              ]}
            />
          </div>
          <div className={isMobile ? "p-2 m-2" : "p-3 m-5"}>
            <div className="bg-white p-4 rounded">
              <InputField
                label="Nama Kriteria"
                value={editFormData.ksr_nama}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, ksr_nama: e.target.value })
                }
                isRequired=
                {true}
              />
              <div className="mt-4 d-flex justify-content-between">
                <div className="me-2" style={{ flex: 1 }}>
                  <Button
                    classType="primary"
                    label="Simpan"
                    onClick={handleSaveEdit}
                    width="100%"
                  />
                </div>
                <div className="ms-2" style={{ flex: 1 }}>
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
