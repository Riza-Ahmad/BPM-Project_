import React, { useState, useRef } from "react";
import { useEffect } from "react";
import PageTitleNav from "../../part/PageTitleNav";
import InputField from "../../part/InputField";
import HeaderForm from "../../part/HeaderText";
import Button from "../../part/Button";
import DropDown from "../../part/Dropdown";
import SweetAlert from "../../util/SweetAlert";
import { useIsMobile } from "../../util/useIsMobile";
import { API_LINK } from "../../util/Constants";
import { useFetch } from "../../util/useFetch";
import Loading from "../../part/Loading";

export default function EditChild({ onChangePage, breadcrumbs, idData }) {
  const isMobile = useIsMobile();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    idKdo: null,
    namaKdo: null,
    parentKdo: null,
    urutanKdo: null,
    modifByKdo: null,
  });
  const [listKdo, setListKdo] = useState([]);

  useEffect(() => {
    const fetchMenu = async () => {
      setLoading(true);
      const result = await useFetch(
        `${API_LINK}/MasterKategoriDokumen/GetListKategoriDokumenAktif`,
        {},
        "POST"
      );

      if (result === "ERROR" || result === null || result.length === 0) {
        setListKdo([]);
      } else {
        const menuArray = Object.values(result);
        setListKdo(menuArray);
      }

      setLoading(false);
    };

    fetchMenu();
  }, []);

  useEffect(() => {
    const fetchKategori = async () => {
      setLoading(true);
      const result = await useFetch(
        `${API_LINK}/MasterKategoriDokumen/GetDataKategoriDokumenById`,
        { idKdo: idData },
        "POST"
      );

      if (result === "ERROR" || result === null || result.length === 0) {
        setFormData({});
      } else {
        setFormData(result[0]);
      }
      setLoading(false);
    };
    fetchKategori();
  }, [idData]);

  const namaKdoRef = useRef(formData.namaKdo);
  const parentKdoRef = useRef(formData.parentKdo);
  const urutanKdoRef = useRef(formData.urutanKdo);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    const isNamaKdoValid = namaKdoRef.current?.validate();
    const isParentKdoValid = parentKdoRef.current?.validate();
    const isUrutanKdoRefValid = urutanKdoRef.current?.validate();

    if (!isNamaKdoValid) {
      namaKdoRef.current?.focus();
      return;
    }
    if (!isParentKdoValid) {
      parentKdoRef.current?.focus();
      return;
    }

    if (urutanKdoRef.current.value < 0) {
      urutanKdoRef.current?.focus();
      return;
    }

    if (!isUrutanKdoRefValid) {
      urutanKdoRef.current?.focus();
      return;
    }

    try {
      const createResponse = await useFetch(
        `${API_LINK}/MasterKategoriDokumen/CreateDataKategoriDokumenChild`,
        formData,
        "POST"
      );

      if (createResponse === "ERROR") {
        throw new Error("Gagal memperbarui data");
      } else {
        SweetAlert("Berhasil!", "Data berhasil diubah.", "success", "OK").then(
          () => onChangePage("index")
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
        <div className="container d-flex flex-column">
          {/* Breadcrumbs and Page Title */}
          <div className="p-3">
            <PageTitleNav
              title="Tambah Data"
              breadcrumbs={breadcrumbs}
              onClick={() => onChangePage("index")}
            />
          </div>
          <div className={isMobile ? "m-0" : "m-3"}>
            {/* Main Content Section */}
            {loading ? (
              <Loading />
            ) : (
              <div
                className={
                  isMobile
                    ? "shadow p-4 m-2 mt-0 bg-white rounded"
                    : "shadow p-5 m-5 mt-0 bg-white rounded"
                }
              >
                <HeaderForm label="Formulir Kategori Dokumen Child" />
                <div className="row">
                  <div className="col-lg-6 col-md-6">
                    <InputField
                      ref={namaKdoRef}
                      label="Nama Kategori"
                      value={formData.namaKdo}
                      onChange={handleChange}
                      isRequired={true}
                      name="namaKdo"
                      type="text"
                      maxChar="100"
                    />
                  </div>
                  <div className="col-lg-6 col-md-6">
                    <InputField
                      ref={urutanKdoRef}
                      label="Urutan Kategori"
                      value={formData.urutanKdo}
                      onChange={handleChange}
                      isRequired={true}
                      name="urutanKdo"
                      type="number"
                      min="0"
                    />
                  </div>
                </div>
                <DropDown
                  arrData={listKdo}
                  type="pilih"
                  label="Parent Kategori"
                  forInput="parentKdo"
                  isRequired={true}
                  onChange={handleChange}
                  value={formData.parentKdo}
                  ref={parentKdoRef}
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
                      onClick={() => onChangePage("index")}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
