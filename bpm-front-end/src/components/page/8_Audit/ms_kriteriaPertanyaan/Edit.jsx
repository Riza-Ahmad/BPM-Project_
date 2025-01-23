import React, { useState, useRef } from "react";
import { useEffect } from "react";
import PageTitleNav from "../../../part/PageTitleNav";
import InputField from "../../../part/InputField";
import HeaderForm from "../../../part/HeaderText";
import Button from "../../../part/Button";
import { useLocation } from "react-router-dom";
import SweetAlert from "../../../util/SweetAlert";
import { useIsMobile } from "../../../util/useIsMobile";
import { API_LINK } from "../../../util/Constants";
import { useFetch } from "../../../util/useFetch";
import Loading from "../../../part/Loading";

export default function Edit({ onChangePage }) {
  const isMobile = useIsMobile();
  const title = "Edit Data";
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const idMenu = location.state?.idMenu;
  const idData = location.state?.idData;
  const breadcrumbs = location.state?.breadcrumbs;

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
        `${API_LINK}/MasterKriteria/GetDataKriteriaById`,
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

  const handleSubmit = async () => {
    const isNamaKriValid = namaKriRef.current?.validate();
    if (!isNamaKriValid) {
      namaKriRef.current?.focus();
      return;
    }

    try {
      const dokData = {
        idDok: idData,
        namaKri: namaKriRef.current.value,
      };
      const createResponse = await useFetch(
        `${API_LINK}/MasterKriteria/EditKriteria`,
        dokData,
        "POST"
      );

      if (createResponse === "ERROR") {
        throw new Error("Gagal memperbarui data");
      } else {
        SweetAlert(
          "Berhasil!",
          "Data berhasil diperbarui.",
          "success",
          "OK"
        ).then(() =>
          onChangePage("index", {
            idMenu: idMenu,
          })
        );
      }
    } catch (error) {
      console.error("Error:", error.message);
      SweetAlert("Gagal!", error.message, "error", "OK");
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="d-flex flex-column min-vh-100">
      <main className="flex-grow-1 p-3" style={{ marginTop: "80px" }}>
        <div className="d-flex flex-column">
          {/* Breadcrumbs and Page Title */}
          <div className="p-3">
            <PageTitleNav
              title={title}
              breadcrumbs={breadcrumbs}
              onClick={() =>
                onChangePage("index", {
                  idMenu: idMenu,
                })
              }
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
              {" "}
              <HeaderForm label="Formulir Dokumen" />
              <InputField
                ref={namaKriRef}
                label="Nama Kriteria"
                value={formData.namaKri}
                onChange={handleChange}
                isRequired={true}
                name="namaKri"
                type="text"
                maxChar="100"
              />
              <div className="d-flex justify-content-between align-items-center">
                <div className="flex-grow-1 m-2">
                  <Button
                    classType="primary"
                    type="submit"
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
                    onClick={() =>
                      onChangePage("index", {
                        idMenu: idMenu,
                      })
                    }
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
