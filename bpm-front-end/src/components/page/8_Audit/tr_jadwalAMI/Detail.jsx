import React, { useState, useRef, useEffect } from "react";
import PageTitleNav from "../../../part/PageTitleNav";
import HeaderForm from "../../../part/HeaderText";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useIsMobile } from "../../../util/useIsMobile";
import { API_LINK } from "../../../util/Constants";
import { useFetch } from "../../../util/useFetch";
import DetailData from "../../../part/DetailData";
import Loading from "../../../part/Loading";
import moment from "moment";
import "moment-timezone";

export default function Detail({ onChangePage }) {
  const isMobile = useIsMobile();
  const title = "Detail Jadwal AMI";
  const [pageSize] = useState(10);
  const [pageCurrent, setPageCurrent] = useState(1);
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const idData = location.state?.idData;

  const [formData, setFormData] = useState({});

  useEffect(() => {
    const fetchPertanyaan = async () => {
      const body = {
        idData: idData,
      };
      setLoading(true);

      try {
        const result = await useFetch(
          `${API_LINK}/TransaksiJadwalAMI/getDataJadwalAMIById`,
          body,
          "POST"
        );

        if (result === "ERROR" || result === null || result.length === 0) {
        } else {
          const fetchedData = result[0];

          setFormData({
            id: idData,
            auditee: fetchedData.BagianAuditee,
            kadep: fetchedData.namaKepalaDepartemen,
            pic1: fetchedData.namaPic1,
            pic2: fetchedData.namaPic2,
            leadAuditor: fetchedData.namaLeadAuditor,
            auditor: fetchedData.namaAuditor,

            tglAktual: fetchedData.tanggalKonfirmasiAktual
              ? new Date(
                  fetchedData.tanggalKonfirmasiAktual
                ).toLocaleDateString("id-ID", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })
              : "-",
            waktuAwalAktual: fetchedData.waktuKonfirmasiAwalAktual
              ? moment
                  .tz(
                    fetchedData.waktuKonfirmasiAwalAktual,
                    "HH:mm:ss",
                    "Asia/Jakarta"
                  )
                  .format("HH:mm [WIB]")
              : "",
            waktuAkhirAktual: fetchedData.waktuKonfirmasiAkhirAktual
              ? moment
                  .tz(
                    fetchedData.waktuKonfirmasiAkhirAktual,
                    "HH:mm:ss",
                    "Asia/Jakarta"
                  )
                  .format("HH:mm [WIB]")
              : "",
            keterangan: fetchedData.keterangan,
            tgl: new Date(fetchedData.tanggalKonfirmasi).toLocaleDateString(
              "id-ID",
              {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              }
            ),
            waktuAwal: moment
              .tz(fetchedData.waktuKonfirmasiAwal, "HH:mm:ss", "Asia/Jakarta")
              .format("HH:mm [WIB]"),
            waktuAkhir: moment
              .tz(fetchedData.waktuKonfirmasiAkhir, "HH:mm:ss", "Asia/Jakarta")
              .format("HH:mm [WIB]"),
            instrumen: fetchedData.namaInstrumen,
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
              <HeaderForm label="Formulir Jadwal Audit Mutu Internal" />

              <div className="row">
                <div className="col-lg-6 col-md-6">
                  <DetailData label="Bagian Auditee" isi={formData.auditee} />
                  <DetailData label="PIC 1" isi={formData.pic1} />
                  <DetailData label="Lead Auditor" isi={formData.leadAuditor} />
                  <DetailData label="Instrumen" isi={formData.instrumen} />
                </div>
                <div className="col-lg-6 col-md-6">
                  <DetailData label="Kepala Bagian" isi={formData.kadep} />
                  <DetailData label="PIC 2" isi={formData.pic2 || "-"} />
                  <DetailData label="Auditor" isi={formData.auditor} />
                </div>
              </div>

              <hr className="solid" style={{ borderTop: "3px solid #bbb" }} />

              <div className="row">
                <div className="col-lg-6 col-md-6">
                  <DetailData label="Tanggal (Rencana)" isi={formData.tgl} />
                  <DetailData
                    label="Tanggal (Aktual)"
                    isi={formData.tglAktual}
                  />
                </div>
                <div className="col-lg-6 col-md-6">
                  <DetailData
                    label="Waktu (Rencana)"
                    isi={formData.waktuAwal + " - " + formData.waktuAkhir}
                  />
                  <DetailData
                    label="Waktu (Aktual)"
                    isi={
                      formData.waktuAwalAktual +
                      " - " +
                      formData.waktuAkhirAktual
                    }
                  />
                </div>
                <DetailData
                  label="Keterangan"
                  isi={formData.keterangan || "-"}
                />
              </div>

              <hr className="solid" style={{ borderTop: "3px solid #bbb" }} />

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
