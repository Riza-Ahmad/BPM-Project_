import React, { useState, useRef, useEffect } from "react";
import PageTitleNav from "../../../part/PageTitleNav";
import HeaderForm from "../../../part/HeaderText";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useIsMobile } from "../../../util/useIsMobile";
import { API_LINK, AUDIT_FILE_LINK } from "../../../util/Constants";
import { useFetch } from "../../../util/useFetch";
import Loading from "../../../part/Loading";
import DetailData from "../../../part/DetailData";
import FileUploadMulti from "../../../part/FileUploadMulti";
import Icon from "../../../part/Icon";
import Table from "../../../part/Table";

export default function DetailMonitoring({ onChangePage }) {
  const isMobile = useIsMobile();
  const title = "Detail Monitoring";
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const idData = location.state?.idData;
  const idAnalisa = location.state?.idAnalisa;
  const [result, setResult] = useState("");

  useEffect(() => {
    const fetchPertanyaan = async () => {
      const body = {
        idData: idData,
      };
      setLoading(true);

      try {
        setResult(
          await useFetch(
            `${API_LINK}/TransaksiAnalisaTemuan/GetAnalisaTemuanById`,
            body,
            "POST"
          )
        );
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPertanyaan();
  }, [idData]);

  const [filteredData, setFilteredData] = useState([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await useFetch(
        `${API_LINK}/TransaksiMonitoring/GetAllDataMonitoring`,
        {
          id: idData,
        }
      );

      console.log(result);
      if (result === "ERROR" || result === null || result.length === 0) {
        setFilteredData([]);
      } else {
        const arrResult = Object.values(result);
        setFilteredData(arrResult);
      }
    } catch (err) {
      setError("Gagal mengambil data: " + err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [idData]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => {
      const updatedData = {
        ...prevData,
        [name]: value,
      };

      return updatedData;
    });
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
              onClick={() =>
                onChangePage("analisaTemuan", {
                  idData: idAnalisa,
                  breadcrumbs: location.state.breadcrumbs,
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
              <HeaderForm label="Formulir Monitoring" />

              {result.length > 0 && (
                <>
                  <div className="border bg-white rounded mt-5 mb-5">
                    <div
                      className="ps-3 rounded"
                      style={{ backgroundColor: "#2654A1", fontSize: "1.5rem" }}
                    >
                      <strong className="text-white">Temuan </strong>
                    </div>

                    <div className="p-3">
                      <DetailData
                        label="Pertanyaan"
                        isi={result[0].pertanyaan}
                      />
                      <DetailData
                        label="Pertanyaan Lanjutan"
                        isi={result[0].pertanyaanLanjutan || "-"}
                      />

                      <DetailData
                        label="Jawaban"
                        isi={result[0].jawaban || "-"}
                      />
                      <DetailData
                        label="Jawaban"
                        isi={result[0].jawabanLanjutan || "-"}
                      />
                      {result[0]?.berkasDokumen ? (
                        <FileUploadMulti
                          label="Berkas Pendukung Jawaban"
                          forInput="upload-file"
                          formatFile=".pdf, .docx, .xlsx, .zip"
                          initialFiles={
                            [
                              result[0].berkasDokumen
                                .split(",")
                                .map((file) => file.replace(/"/g, "").trim()),
                            ] || []
                          }
                          isRequired={true}
                          mode="tidak"
                        />
                      ) : (
                        []
                      )}

                      <DetailData
                        label="Temuan"
                        isi={result[0].temuan || "-"}
                      />
                      <DetailData label="Saran" isi={result[0].saran || "-"} />
                    </div>
                  </div>

                  <div className="border bg-white rounded mt-5 mb-5">
                    <div
                      className="ps-3 rounded"
                      style={{ backgroundColor: "#2654A1", fontSize: "1.5rem" }}
                    >
                      <strong className="text-white">Analisa Temuan</strong>
                    </div>

                    <div className="p-3">
                      {" "}
                      <DetailData
                        label="Problem"
                        isi={result[0].problem || "-"}
                      />
                      <DetailData label="Why" isi={result[0].why1 || "-"} />
                      <Icon
                        type="full"
                        name="down"
                        ukuran="2rem"
                        cssClass="text-secondary d-flex justify-content-center align-items-center"
                        title="Riwayat Pembaruan"
                      />
                      <DetailData label="Why" isi={result[0].why2 || "-"} />
                      <Icon
                        type="full"
                        name="down"
                        ukuran="2rem"
                        cssClass="text-secondary d-flex justify-content-center align-items-center"
                        title="Riwayat Pembaruan"
                      />
                      <DetailData label="Why" isi={result[0].why3 || "-"} />
                      <Icon
                        type="full"
                        name="down"
                        ukuran="2rem"
                        cssClass="text-secondary d-flex justify-content-center align-items-center"
                        title="Riwayat Pembaruan"
                      />
                      <DetailData label="Why" isi={result[0].why4 || "-"} />
                      <Icon
                        type="full"
                        name="down"
                        ukuran="2rem"
                        cssClass="text-secondary d-flex justify-content-center align-items-center"
                        title="Riwayat Pembaruan"
                      />
                      <DetailData label="Why" isi={result[0].why5 || "-"} />
                      <DetailData
                        label="Akar Penyebab Masalah"
                        isi={result[0].akarmasalah || "-"}
                      />
                      <DetailData
                        label="Tindakan Perbaikan"
                        isi={result[0].perbaikan || "-"}
                      />
                      <DetailData
                        label="Tindakan Pencegahan"
                        isi={result[0].pencegahan || "-"}
                      />
                      <div className="row">
                        <div className="col-6">
                          <DetailData
                            label="Tanggal Realisasi"
                            isi={
                              result[0]?.TglRencanaTemuan
                                ? new Date(
                                    result[0].TglRencanaTemuan
                                  ).toLocaleDateString("id-ID", {
                                    weekday: "long",
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                  })
                                : "-"
                            }
                          />
                        </div>
                        <div className="col-6">
                          <div className="mb-3">
                            <label className="form-label fw-bold">
                              Berkas Pendukung
                            </label>{" "}
                            <br></br>
                            <a
                              href={
                                `${AUDIT_FILE_LINK}${result[0].berkasPendukung}` ||
                                ""
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Lihat Pratinjau
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              <div className="border bg-white rounded mt-5 mb-5">
                <div
                  className="ps-3 rounded"
                  style={{ backgroundColor: "#2654A1", fontSize: "1.5rem" }}
                >
                  <strong className="text-white">Monitoring Temuan</strong>
                </div>

                <div className="p-3">
                  <Table
                    arrHeader={["No", "Status", "Tanggal"]}
                    data={filteredData.map((item, index) => ({
                      Key: item.idMonitoring,
                      No: index + 1,
                      Status: item.statusMonitoring,
                      Tanggal: item.tglMonitoring
                        ? new Date(item.tglMonitoring).toLocaleDateString(
                            "id-ID",
                            {
                              weekday: "long",
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            }
                          )
                        : "-",
                    }))}
                    aksiIs={false}
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
