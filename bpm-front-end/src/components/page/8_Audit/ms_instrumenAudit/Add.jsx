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
import CheckBox from "../../../part/CheckBox";
import Loading from "../../../part/Loading";

export default function Add({ onChangePage }) {
  const isMobile = useIsMobile();
  const title = "Tambah Instrumen Audit";
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    nama: "",
    bagianAuditee: [],
  });

  const [auditee, setAuditee] = useState([]);

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

  const namaRef = useRef();
  const bagianAuditeeRef = useRef();

  const handleSubmit = async () => {
    const isPertanyaanValid = namaRef.current?.validate();
    const isAuditeeValid = bagianAuditeeRef.current?.validate();

    if (!isPertanyaanValid) {
      namaRef.current?.focus();
      return;
    }

    if (!isAuditeeValid) {
      bagianAuditeeRef.current?.focus();
      return;
    }

    try {
      const paData = {
        instrumen: formData.nama,
        id: "",
      };

      console.log(paData);
      const result = await useFetch(
        `${API_LINK}/MasterInstrumenAudit/CheckInstrumenAudit`,
        paData,
        "POST"
      );

      if (result.length > 0) {
        SweetAlert("Gagal!", "Data Instrumen sudah ada", "error", "OK");
        return;
      }

      const createResponse = await useFetch(
        `${API_LINK}/MasterInstrumenAudit/CreateDataInstrumenAudit`,
        formData,
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
              <HeaderForm label="Formulir Instrumen Audit" />

              <InputField
                ref={namaRef}
                label="Nama Instrumen"
                value={formData.nama || ""}
                onChange={handleChange}
                isRequired={true}
                name="nama"
                type="text"
                maxChar="100"
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
