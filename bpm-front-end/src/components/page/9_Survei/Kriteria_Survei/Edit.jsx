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
  const [formData, setFormData] = useState({
    idKdo: idData,
    namaKri: "",
  });
  const namaKriRef = useRef();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  useEffect(() => {
    const fetchDokumenById = async () => {
      const body = {
        idData: idData,
      };
      setLoading(true);
      const result = await useFetch(
        `${API_LINK}/MasterKriteriaSurvei/GetDataKriteriaSurveiById`,
        body,
        "POST"
      );

      if (result === "ERROR" || result === null || result.length === 0) {
        setFormData(null);
      } else {
        console.log(result);
        const arrResult = Object.values(result);
        setFormData({
          idKdo: idData,
          namaKri: arrResult[0].namaKri,
        });
      }

      setLoading(false);
    };

    fetchDokumenById();
  }, [idData]);

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
                  value={editFormData.ksr_nama}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      ksr_nama: e.target.value,
                    })
                  }
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
                      onClick={() => onChangePage("index")}
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
