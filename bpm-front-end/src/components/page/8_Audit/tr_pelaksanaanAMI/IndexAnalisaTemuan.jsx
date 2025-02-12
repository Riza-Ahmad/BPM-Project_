import React, { useState, useRef, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { API_LINK, DOKUMEN_LINK } from "../../../util/Constants";
import { useFetch } from "../../../util/useFetch";
import Table from "../../../part/Table";
import Paging from "../../../part/Paging";
import Cookies from "js-cookie";
import { useIsMobile } from "../../../util/useIsMobile";
import { decodeHtml } from "../../../util/DecodeHtml";
import Loading from "../../../part/Loading";
import HeaderText from "../../../part/HeaderText";
import PageTitleNav from "../../../part/PageTitleNav";
import DetailData from "../../../part/DetailData";
import SweetAlert from "../../../util/SweetAlert";
import Button from "../../../part/Button";

const breadcrumbs = [{ label: "Evaluasi" }, { label: "Audit Mutu Internal" }];

export default function Index({ onChangePage }) {
  const location = useLocation();
  let activeUser = "";
  let role = "";
  const cookie = Cookies.get("activeUser");
  if (cookie) activeUser = JSON.parse(cookie).username;
  if (cookie) role = JSON.parse(cookie).RoleID.slice(0, 5);

  const isMobile = useIsMobile();

  const [pageSize] = useState(10);
  const [pageCurrent, setPageCurrent] = useState(1);
  const [totalData, setTotalData] = useState(0);
  const [filteredData, setFilteredData] = useState([]);

  const idData = location.state?.idData;
  const idJadwal = location.state?.idJadwal;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handlePageNavigation = (page) => {
    setPageCurrent(page);
  };

  const [temuanBelum, setTemuanBelum] = useState(0);
  const [temuanClose, setTemuanClose] = useState(0);

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await useFetch(
        `${API_LINK}/TransaksiAnalisaTemuan/GetAllTemuanById`,
        {
          id: idData,
          size: pageSize,
          page: pageCurrent,
        }
      );

      if (result === "ERROR" || result === null || result.length === 0) {
        setFilteredData([]);
        setTotalData(0);
      } else {
        const arrResult = Object.values(result);
        setFilteredData(arrResult);
        setTotalData(arrResult[0].totalData);

        const closedCount = arrResult.filter(
          (data) => data.statusTemuan === "Closed"
        ).length;

        const belumCount = arrResult.filter(
          (data) => data.statusTemuan !== "Closed"
        ).length;

        setTemuanClose(closedCount);
        setTemuanBelum(belumCount);
      }
    } catch (err) {
      setError("Gagal mengambil data: " + err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [pageCurrent, idData]);

  const handleFinal = async (idSead, status) => {
    let apiCheck = "";
    let apiFinal = "";
    let pesan = "";

    if (status === "Menunggu Monitoring") {
      apiCheck = "TransaksiMonitoring/CheckMonitoring";
      apiFinal = "TransaksiMonitoring/FinalMonitoring";
      pesan = "Monitoring Temuan";
    } else {
      return;
    }
    const response = await useFetch(`${API_LINK}/${apiCheck}`, {
      id: idSead,
    });

    if (response[0].hasil === true) {
      const confirm = await SweetAlert(
        "Apakah Anda yakin ingin Finalkan " + pesan + " ini?",
        "Data tidak akan bisa diubah jika " +
          pesan +
          " Audit Mutu Internal sudah difinalkan",
        "warning",
        "Ya, Finalkan",
        null,
        "",
        true
      );

      if (confirm) {
        try {
          const response = await useFetch(
            `${API_LINK}/${apiFinal}`,
            { id: idSead },
            "POST"
          );

          if (response === "ERROR")
            throw new Error("Gagal kirim Self Assessment");

          SweetAlert("Berhasil", pesan + " Berhasil difinalkan", "success");

          fetchData();
        } catch (err) {
          console.error(err);
          SweetAlert("Gagal", "Terjadi kesalahan saat kirim jadwal", "error");
        }
      }
    } else {
      SweetAlert(
        "Data belum lengkap",
        "Data " +
          pesan +
          " belum diisi, harap lakukan pengecekan dan lengkapi terlebih dahulu",
        "warning"
      );
    }
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(
        `${API_LINK}/ExportExcel/GenerateExcelFromTemplate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "*/*",
          },
          body: JSON.stringify({ id: idData }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to download file: ${response.statusText}`);
      }

      // Konversi response ke Blob
      const blob = await response.blob();

      const contentDisposition = response.headers.get("content-disposition");

      const fileName = contentDisposition
        ? contentDisposition
            .split("filename=")[1]
            ?.split(";")[0]
            ?.replace(/"/g, "")
        : "download.xlsx"; // Default jika nama file tidak ditemukan

      // Buat URL dari Blob dan trigger download
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = decodeURIComponent(fileName); // Gunakan nama file dari server
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  if (error) return <p>{error}</p>;
  if (loading) return <Loading />;

  return (
    <div className="d-flex flex-column min-vh-100">
      <main className="flex-grow-1 p-3" style={{ marginTop: "80px" }}>
        <div className="d-flex flex-column">
          <div className={isMobile ? "m-0 p-2" : "m-3 ms-5 mb-0"}>
            <PageTitleNav
              title="Analisa Temuan"
              breadcrumbs={location.state.breadcrumbs}
              onClick={() => onChangePage("index")}
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
              {filteredData && filteredData.length > 0 ? (
                <>
                  {" "}
                  <HeaderText
                    label={
                      filteredData[0].namaBagAuditee +
                      " (" +
                      filteredData[0].kodeBagAuditee +
                      ")"
                    }
                  />
                  <div className="border bg-white rounded mt-5 mb-5 p-3">
                    <DetailData
                      label="Bagian Auditee"
                      isi={filteredData[0].namaBagAuditee || ""}
                    />

                    <div className="row">
                      <div className="col-4">
                        <DetailData
                          label="Lead Auditor"
                          isi={filteredData[0].namaLeadAuditor || ""}
                        />
                      </div>
                      <div className="col-4">
                        <DetailData
                          label="Auditor"
                          isi={filteredData[0].namaAuditor || ""}
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-4">
                        <DetailData
                          label="Tanggal Konfirmasi"
                          isi={
                            filteredData[0]?.tgl
                              ? new Date(
                                  filteredData[0].tgl
                                ).toLocaleDateString("id-ID", {
                                  weekday: "long",
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric",
                                })
                              : ""
                          }
                        />
                        <DetailData
                          label="Tanggal Realisasi"
                          isi={
                            filteredData[0]?.tglAktual
                              ? new Date(
                                  filteredData[0].tglAktual
                                ).toLocaleDateString("id-ID", {
                                  weekday: "long",
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric",
                                })
                              : "-"
                          }
                        />
                        <DetailData
                          label="Jumlah Terselesaikan"
                          isi={temuanClose}
                        />
                      </div>
                      <div className="col-4">
                        <DetailData
                          label="Waktu Awal"
                          isi={filteredData[0]?.waktuAwal + " WIB"}
                        />
                        <DetailData
                          label="Jumlah Temuan"
                          isi={filteredData[0]?.jumlahTemuan}
                        />
                        <DetailData
                          label="Jumlah Belum Terselesaikan"
                          isi={temuanBelum}
                        />
                      </div>
                      <div className="col-4">
                        <DetailData
                          label="Waktu Akhir"
                          isi={filteredData[0]?.waktuAkhir + " WIB"}
                        />
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                ""
              )}

              {loading ? (
                <Loading />
              ) : (
                <div>
                  <div className="row">
                    <div className="p-3">
                      <Button
                        iconName="download"
                        classType="success"
                        type="submit"
                        label="Ekspor Temuan"
                        width="15rem"
                        onClick={handleDownload}
                      />
                    </div>
                  </div>
                  <Table
                    arrHeader={[
                      "No",
                      "Kriteria",
                      "Temuan",
                      "Tanggal Closed (Plan)",
                      "Status Penyelesaian",
                    ]}
                    data={filteredData.map((item, index) => ({
                      Key: item.idTemuan,
                      No: (pageCurrent - 1) * pageSize + index + 1,
                      Kriteria: item.namaKriteria,
                      Temuan: (
                        <div
                          dangerouslySetInnerHTML={{
                            __html: decodeHtml(item.namaTemuan || ""),
                          }}
                        />
                      ),

                      "Tanggal Closed (Plan)": item.tglRencanaTemuan
                        ? new Date(item.tglRencanaTemuan).toLocaleDateString(
                            "id-ID",
                            {
                              weekday: "long",
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            }
                          )
                        : "-",

                      "Status Penyelesaian": item.statusTemuan,
                      Status: item.statusTemuan,
                      kadep: item.kadep,
                      pic1: item.pic1,
                      pic2: item.pic2,
                      idAuditor: item.idAuditor,
                      idLeadAuditor: item.idLeadAuditor,
                    }))}
                    actions={(item) => {
                      switch (item.Status) {
                        case "Belum Terselesaikan":
                          if (
                            item.kadep === activeUser ||
                            item.pic1 === activeUser ||
                            item.pic2 === activeUser
                          ) {
                            return ["Edit"];
                          } else {
                            return ["Detail"]; // Default return if the condition is not met
                          }
                        case "Analisa Temuan (Draft)":
                          if (
                            item.kadep === activeUser ||
                            item.pic1 === activeUser ||
                            item.pic2 === activeUser
                          ) {
                            return ["Edit"];
                          } else {
                            return ["Detail"]; // Default return if the condition is not met
                          }
                        case "Menunggu Monitoring":
                          if (
                            item.idAuditor === activeUser ||
                            item.idLeadAuditor === activeUser
                          ) {
                            return ["Edit", "Send"];
                          } else {
                            return ["Detail"]; // Default return if the condition is not met
                          }

                        case "Menunggu Verifikasi":
                          if (role === "ROL01") {
                            return ["Edit"];
                          } else {
                            return ["Detail"];
                          }

                        default:
                          return ["Detail"];
                      }
                    }}
                    onEdit={(item) => {
                      if (
                        item.Status === "Belum Terselesaikan" ||
                        item.Status === "Analisa Temuan (Draft)"
                      ) {
                        onChangePage("editAnalisaTemuan", {
                          idData: item.Key,
                          instrumen: item.instrumen,
                          breadcrumbs: breadcrumbs,
                          idAnalisa: idData,
                        });
                      } else if (item.Status === "Menunggu Monitoring") {
                        onChangePage("editMonitoring", {
                          idData: item.Key,
                          instrumen: item.instrumen,
                          breadcrumbs: breadcrumbs,
                          idAnalisa: idData,
                        });
                      } else if (item.Status === "Menunggu Verifikasi") {
                        onChangePage("editVerifikasi", {
                          idData: item.Key,
                          instrumen: item.instrumen,
                          breadcrumbs: breadcrumbs,
                          idAnalisa: idData,
                        });
                      }
                    }}
                    onDetail={(item) => {
                      if (item.Status === "Menunggu Monitoring") {
                        onChangePage("detailAnalisaTemuan", {
                          idData: item.Key,
                          instrumen: item.instrumen,
                          breadcrumbs: breadcrumbs,
                          idAnalisa: idData,
                        });
                      } else if (item.Status === "Menunggu Verifikasi") {
                        onChangePage("detailMonitoring", {
                          idData: item.Key,
                          instrumen: item.instrumen,
                          breadcrumbs: breadcrumbs,
                          idAnalisa: idData,
                        });
                      } else if (item.Status === "Closed") {
                        onChangePage("detailVerifikasi", {
                          idData: item.Key,
                          instrumen: item.instrumen,
                          breadcrumbs: breadcrumbs,
                          idAnalisa: idData,
                        });
                      }
                    }}
                    onSend={(item) => handleFinal(item.Key, item.Status)}
                  />

                  <Paging
                    pageSize={pageSize}
                    pageCurrent={pageCurrent}
                    totalData={totalData}
                    navigation={handlePageNavigation}
                  />
                </div>
              )}
            </div>
          </div>
          {/* Main Content Section */}
        </div>
      </main>
    </div>
  );
}
