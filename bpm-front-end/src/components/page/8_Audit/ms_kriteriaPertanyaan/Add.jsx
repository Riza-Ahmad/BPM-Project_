import React, { useState, useRef } from "react";
import PageTitleNav from "../../../part/PageTitleNav";
import InputField from "../../../part/InputField";
import HeaderForm from "../../../part/HeaderText";
import Button from "../../../part/Button";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import SweetAlert from "../../../util/SweetAlert";
import { useIsMobile } from "../../../util/useIsMobile";
import { API_LINK } from "../../../util/Constants";
import { useFetch } from "../../../util/useFetch";

export default function Add({ onChangePage }) {
  const isMobile = useIsMobile();
  const title = "Tambah Data";
  const location = useLocation();
  const idMenu = location.state?.idMenu;

  const [formData, setFormData] = useState({
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

  const handleSubmit = async () => {
    const isNamaKriValid = namaKriRef.current?.validate();

    if (!isNamaKriValid) {
      namaKriRef.current?.focus();
      return;
    }

    try {
      const kriData = {
        namaKri: namaKriRef.current.value,
      };

      const result = await useFetch(
        `${API_LINK}/MasterKriteria/CheckKriteriaExist`,
        kriData,
        "POST"
      );

      if (result.length > 0) {
        SweetAlert(
          "Gagal!",
          "Data kriteria sudah ada",
          "error",
          "OK"
        );
        return;
      }

      const createResponse = await useFetch(
        `${API_LINK}/MasterKriteria/CreateDataKriteria`,
        kriData,
        "POST"
      );

      if (createResponse === "ERROR") {
        throw new Error("Gagal menambah data");
      } else {
        SweetAlert(
          "Berhasil!",
          "Data berhasil ditambahkan.",
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

  return (
    <div className="d-flex flex-column min-vh-100">
      <main className="flex-grow-1 p-3" style={{ marginTop: "80px" }}>
        <div className="d-flex flex-column">
          {/* Breadcrumbs and Page Title */}
          <div className="p-3">
            <PageTitleNav
              title={title}
              breadcrumbs={location.state.breadcrumbs}
              onClick={() =>
                onChangePage("index", {
                  idMenu: idMenu,
                })
              }
            />
          </div>
          <div className={isMobile ? "m-0" : "m-3"}>
            {/* Main Content Section */}
            <div
              className={
                isMobile
                  ? "shadow p-4 m-2 mt-0 bg-white rounded"
                  : "shadow p-5 m-5 mt-0 bg-white rounded"
              }
            >
              <HeaderForm label="Formulir Kriteria" />
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
