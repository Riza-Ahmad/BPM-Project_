import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_LINK } from "../../../util/Constants";
import { useIsMobile } from "../../../util/useIsMobile";
import { useFetch } from "../../../util/useFetch";
import PageTitleNav from "../../../part/PageTitleNav";
import InputField from "../../../part/InputField";
import Button from "../../../part/Button";
import Swal from "sweetalert2";

export default function Edit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    idKdo: id,
    namaKri: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  useEffect(() => {
    const fetchDokumenById = async () => {
      setLoading(true);
      const body = { id: id };
      const result = await useFetch(
        `${API_LINK}/MasterKriteriaSurvei/GetDataKriteriaSurveiById`,
        body,
        "POST"
      );

      if (result === "ERROR" || result === null || result.length === 0) {
        Swal.fire("Error", "Data tidak ditemukan", "error");
      } else {
        const { namaKri } = result[0];
        setFormData({ idKdo: id, namaKri });
      }

      setLoading(false);
    };

    fetchDokumenById();
  }, [id]);

  // Cek apakah nama sudah ada di database
  const isNameDuplicate = async (name) => {
    try {
      const response = await fetch(
        `${API_LINK}/MasterKriteriaSurvei/GetAllDataKriteriaSurvei`,
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
      return false;
    }
  };

  const handleSaveEdit = async () => {
    setLoading(true);

    const isDuplicate = await isNameDuplicate(formData.namaKri);
    if (isDuplicate) {
      Swal.fire("Peringatan", "Nama kriteria sudah ada!", "warning");
      setLoading(false);
      return;
    }

    const result = await useFetch(
      `${API_LINK}/MasterKriteriaSurvei/EditKriteriaSurvei`,
      formData,
      "POST"
    );

    if (result === "ERROR") {
      Swal.fire("Error", "Gagal menyimpan perubahan", "error");
    } else {
      Swal.fire("Success", "Data berhasil diperbarui!", "success");
      navigate("/survei/kriteria");
    }
    setLoading(false);
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
              onClick={() => navigate("/survei/kriteria")}
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
                  label="Nama Kriteria"
                  name="namaKri"
                  value={formData.namaKri}
                  onChange={handleChange}
                  isRequired={true}
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
                      onClick={() => navigate("/survei/kriteria")}
                      width="100%"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
