import React, { useState, useRef, useEffect } from "react";
import PageTitleNav from "../../../part/PageTitleNav";
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
import { decodeHtml } from "../../../util/DecodeHtml";
import Loading from "../../../part/Loading";
import DetailData from "../../../part/DetailData";

const butuhDokumen = [{ Value: "Ya", Text: "Ya, Butuh dokumen pendukung" }];
const jenisIKT = [{ Value: "Ya", Text: "Ya, ini Jenis IKT" }];

export default function Detail({ onChangePage }) {
  const isMobile = useIsMobile();
  const title = "Detail Bank Pertanyaan";
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const idData = location.state?.idData;

  const [formData, setFormData] = useState({
    idBankPertanyaan: idData,
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
    const fetchPertanyaan = async () => {
      const body = {
        idData: idData,
      };
      setLoading(true);

      try {
        const result = await useFetch(
          `${API_LINK}/MasterBankPertanyaanAudit/GetDataBankPertanyaanAuditById`,
          body,
          "POST"
        );

        if (result === "ERROR" || result === null || result.length === 0) {
          setFormData({
            idBankPertanyaan: idData,
            kriteria: "",
            pertanyaan: "",
            pertanyaanLanjutan: "",
            butuhDokumen: [],
            jenisIKT: [],
            bagianAuditee: [],
          });
        } else {
          const fetchedData = result[0];

          setFormData({
            idBankPertanyaan: idData,
            kriteria: fetchedData.kriteriaNama,
            pertanyaan: decodeHtml(fetchedData.pertanyaan || ""),
            pertanyaanLanjutan: decodeHtml(
              fetchedData.pertanyaanLanjutan || ""
            ),
            butuhDokumen:
              fetchedData.butuhDokumen === "Ya"
                ? [fetchedData.butuhDokumen]
                : [],
            jenisIKT: [fetchedData.jenisIKT],
            bagianAuditee: fetchedData.bagianAuditee
              .split(",")
              .map((id) => parseInt(id)),
            dibuatOleh: fetchedData.dibuatOleh,
            dibuatTgl: new Date(fetchedData.dibuatTgl).toLocaleDateString(
              "id-ID",
              {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              }
            ),
            dimodifOleh: fetchedData.dimodifOleh
              ? fetchedData.dimodifOleh
              : "-",
            dimodifTgl: fetchedData.dimodifTgl
              ? new Date(fetchedData.dimodifTgl).toLocaleDateString("id-ID", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })
              : "-",
          });
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPertanyaan();
  }, [idData]);

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

              <DetailData label="Kriteria Pertanyaan" isi={formData.kriteria} />
              <DetailData label="Pertanyaan" isi={formData.pertanyaan} />

              {formData.butuhDokumen && formData.butuhDokumen.length > 0 && (
                <DetailData
                  label="Pertanyaan Lanjutan"
                  isi={formData.pertanyaanLanjutan}
                />
              )}
              <CheckBox
                arrData={auditee}
                label="Bagian Auditee"
                name="bagianAuditee"
                isRequired={true}
                values={formData.bagianAuditee || []}
                errorMessage="Please select at least one option."
                onChange={undefined}
                col="col-2"
              />

              <CheckBox
                arrData={butuhDokumen}
                label="Dokumen Pendukung"
                name="butuhDokumen"
                values={formData.butuhDokumen || []}
                onChange={undefined}
                col="col-12"
              />

              <CheckBox
                arrData={jenisIKT}
                label="Apakah berjenis IKT?"
                name="jenisIKT"
                values={formData.jenisIKT || []}
                onChange={undefined}
                col="col-12"
              />

              <div className="row">
                <div className="col-lg-6 col-md-6">
                  <DetailData label="Dibuat Oleh" isi={formData.dibuatOleh} />
                  <DetailData label="Dibuat Tanggal" isi={formData.dibuatTgl} />
                </div>
                <div className="col-lg-6 col-md-6">
                  <DetailData
                    label="Dimodifikasi Oleh"
                    isi={formData.dimodifOleh}
                  />
                  <DetailData
                    label="Dimodifikasi Tanggal"
                    isi={formData.dimodifTgl}
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
