import React, { useState, useRef, useEffect } from "react";
import PageTitleNav from "../../../part/PageTitleNav";
import InputField from "../../../part/InputField";
import HeaderForm from "../../../part/HeaderText";
import Button from "../../../part/Button";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import SweetAlert from "../../../util/SweetAlert";
import { useIsMobile } from "../../../util/useIsMobile";
import { API_LINK } from "../../../util/Constants";
import { useFetch } from "../../../util/useFetch";
import DropDown from "../../../part/Dropdown";
import TextArea from "../../../part/TextArea";
import CheckBox from "../../../part/CheckBox";
import Loading from "../../../part/Loading";

const butuhDokumen = [{ Value: "Ya", Text: "Ya, Butuh dokumen pendukung" }];
const jenisIKT = [{ Value: "Ya", Text: "Ya, ini Jenis IKT" }];

export default function Add({ onChangePage }) {
  const isMobile = useIsMobile();
  const title = "Tambah Bank Pertanyaan";
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    kriteria: "",
    pertanyaan: "",
    pertanyaanLanjutan: "",
    butuhDokumen: [],
    jenisIKT: [],
    bagianAuditee: [],
  });

  const [kriteria, setKriteria] = useState([]);
  const [auditee, setAuditee] = useState([]);

  useEffect(() => {
    const fetchKriteria = async () => {
      setLoading(true);
      try {
        const data = await useFetch(
          `${API_LINK}/MasterBankPertanyaanAudit/GetAllKriteriaAktif`,
          {},
          "POST"
        );

        setKriteria(data);
      } catch (err) {
        setError("Gagal mengambil data: " + err);
      } finally {
        setLoading(false);
      }
    };

    fetchKriteria();
  }, []);

  useEffect(() => {
    const fetchAuditee = async () => {
      setLoading(true);
      try {
        const data = await useFetch(
          `${API_LINK}/MasterBankPertanyaanAudit/GetAllAuditeeAktif`,
          {},
          "POST"
        );

          setAuditee(data);
      } catch (err) {
        setError("Gagal mengambil data: " + err);
      } finally {
        setLoading(false);
      }
    };

    fetchAuditee();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => {
      const updatedData = {
        ...prevData,
        [name]: value,
      };

      // Reset pertanyaanLanjutan jika butuhDokumen kosong
      if (name === "butuhDokumen" && value.length === 0) {
        updatedData.pertanyaanLanjutan = ""; // Reset ke nilai default
      }

      return updatedData;
    });
  };

  const kriteriaRef = useRef();
  const pertanyaanRef = useRef();
  const bagianAuditeeRef = useRef();

  const handleSubmit = async () => {
    const isKriteriaValid = kriteriaRef.current?.validate();
    const isPertanyaanValid = pertanyaanRef.current?.validate();
    const isAuditeeValid = bagianAuditeeRef.current?.validate();

    if (!isKriteriaValid) {
      kriteriaRef.current?.focus();
      return;
    }

    if (!isPertanyaanValid) {
      pertanyaanRef.current?.focus();
      return;
    }

    if (!isAuditeeValid) {
      bagianAuditeeRef.current?.focus();
      return;
    }

    const butuhDokumenValue = formData.butuhDokumen[0] || "Tidak";
    const jenisIKTValue = formData.jenisIKT[0] || "Tidak";

    const dataToSend = {
      ...formData,
      butuhDokumen: butuhDokumenValue,
      jenisIKT: jenisIKTValue,
    };

    try {
      const createResponse = await useFetch(
        `${API_LINK}/MasterBankPertanyaanAudit/CreateBankPertanyaanAudit`,
        dataToSend,
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
        ).then(() => onChangePage("index"));
      }
    } catch (error) {
      console.error("Error:", error.message);
      SweetAlert("Gagal!", error.message, "error", "OK");
    }
  };

  if (loading) return <Loading />;
  if (error) return <p>{error}</p>;
  return (
    <div className="d-flex flex-column min-vh-100">
      <main className="flex-grow-1 p-3" style={{ marginTop: "80px" }}>
        <div className="d-flex flex-column">
          {/* Breadcrumbs and Page Title */}
          <div className="p-3">
            <PageTitleNav
              title={title}
              breadcrumbs={location.state.breadcrumbs}
              onClick={() => onChangePage("index")}
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
              <HeaderForm label="Formulir Bank Pertanyaan" />

              <DropDown
                ref={kriteriaRef}
                arrData={kriteria}
                label="Kriteria Pertanyaan"
                type="pilih"
                value={formData.kriteria}
                name="kriteria"
                onChange={handleChange}
                isRequired={true}
              />

              <TextArea
                ref={pertanyaanRef}
                label="Pertanyaan"
                value={formData.pertanyaan || ""}
                name="pertanyaan"
                onChange={handleChange}
                isRequired={true}
              />

              <CheckBox
                ref={bagianAuditeeRef}
                arrData={auditee}
                label="Bagian Auditee"
                name="bagianAuditee"
                isRequired={true}
                values={formData.bagianAuditee || []} // Set default selected values here
                onChange={handleChange}
                errorMessage="Please select at least one option."
                col="col-2"
              />

              <CheckBox
                arrData={butuhDokumen}
                label="Dokumen Pendukung"
                name="butuhDokumen"
                values={formData.butuhDokumen || []} // Set default selected values here
                onChange={handleChange}
                col="col-12"
              />

              {formData.butuhDokumen && formData.butuhDokumen.length > 0 && (
                <TextArea
                  value={formData.pertanyaanLanjutan || ""}
                  name="pertanyaanLanjutan"
                  onChange={handleChange}
                  isRequired={true}
                />
              )}

              <CheckBox
                arrData={jenisIKT}
                label="Apakah berjenis IKT?"
                name="jenisIKT"
                values={formData.jenisIKT || []} // Set default selected values here
                onChange={handleChange}
                col="col-12"
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
          </div>
        </div>
      </main>
    </div>
  );
}
