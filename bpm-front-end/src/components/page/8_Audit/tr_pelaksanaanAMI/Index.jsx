import React, { useState, useRef, useEffect } from "react";
import { API_LINK, DOKUMEN_LINK } from "../../../util/Constants";
import { useFetch } from "../../../util/useFetch";
import Table from "../../../part/Table";
import Paging from "../../../part/Paging";
import SearchField from "../../../part/SearchField";
import Filter from "../../../part/Filter";
import Breadcrumbs from "../../../part/Breadcrumbs";
import DropDown from "../../../part/Dropdown";
import SweetAlert from "../../../util/SweetAlert";
import Cookies from "js-cookie";
import { useIsMobile } from "../../../util/useIsMobile";
import { decodeHtml } from "../../../util/DecodeHtml";
import Loading from "../../../part/Loading";

const arrSort = [
  { Value: "tgljadwal ASC", Text: "Tanggal Pelaksanaan [↑]" },
  { Value: "tgljadwal DESC", Text: "Tanggal Pelaksanaan [↓]" },
];

const arrStatus = [
  { Value: "Aktif", Text: "Aktif" },
  { Value: "Tidak Aktif", Text: "Tidak Aktif" },
];

const breadcrumbs = [{ label: "Evaluasi" }, { label: "Audit Mutu Internal" }];

export default function Index({ onChangePage }) {
  let activeUser = "";
  let role = "";
  const cookie = Cookies.get("activeUser");
  if (cookie) activeUser = JSON.parse(cookie).username;
  if (cookie) role = JSON.parse(cookie).RoleID.slice(0, 5);

  const isMobile = useIsMobile();

  const [pageSize] = useState(10);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [pageCurrent, setPageCurrent] = useState(1);
  const [totalData, setTotalData] = useState(0);
  const [selectedSort, setSelectedSort] = useState("tgljadwal DESC");
  const [filteredData, setFilteredData] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handlePageNavigation = (page) => {
    setPageCurrent(page);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await useFetch(
        `${API_LINK}/TransaksiSelfAssessment/GetDataSelfAssesment`,
        {
          param1: searchKeyword,
          param2: selectedSort,
          param3: pageSize,
          param4: pageCurrent,
          param5: selectedStatus,
          param6: activeUser,
        }
      );

      if (result === "ERROR" || result === null || result.length === 0) {
        setFilteredData([]);
        setTotalData(0);
      } else {
        const arrResult = Object.values(result);
        setFilteredData(arrResult);
        setTotalData(arrResult[0].totalData);
      }
    } catch (err) {
      setError("Gagal mengambil data: " + err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [searchKeyword, selectedSort, pageCurrent, selectedStatus]);

  const handleFinal = async (idSA, idJadwal, status) => {
    let apiCheck = "";
    let apiFinal = "";
    let pesan = "";

    if (status === "Self Assessment (Draft)") {
      apiCheck = "TransaksiSelfAssessment/CheckSelfAssesment";
      apiFinal = "TransaksiSelfAssessment/FinalSelfAssesment";
      pesan = "Self Assessment";
    } else if (status === "Temuan (Draft)") {
      apiCheck = "TransaksiTemuan/CheckTemuan";
      apiFinal = "TransaksiTemuan/FinalTemuan";
      pesan = "Temuan";
    } else if (status === "Menunggu Analisa Temuan") {
      apiCheck = "TransaksiAnalisaTemuan/CheckAnalisaTemuan";
      apiFinal = "TransaksiAnalisaTemuan/FinalAnalisaTemuan";
      pesan = "Analisa Temuan";
    } else if (status === "Monitoring") {
      apiCheck = "TransaksiMonitoring/CheckAllMonitoring";
      apiFinal = "TransaksiMonitoring/FinalAllMonitoring";
      pesan = "Monitoring";
    } else {
      return;
    }
    const response = await useFetch(`${API_LINK}/${apiCheck}`, {
      id: idSA,
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
            { id: idJadwal },
            "POST"
          );

          if (response === "ERROR")
            throw new Error("Gagal kirim Self Assessment");

          SweetAlert("Berhasil", pesan + "Berhasil difinalkan", "success");

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
          " belum lengkap, harap lakukan pengecekan dan lengkapi terlebih dahulu",
        "warning"
      );
    }
  };

  if (error) return <p>{error}</p>;

  return (
    <div className="d-flex flex-column min-vh-100">
      <main className="flex-grow-1 p-3" style={{ marginTop: "80px" }}>
        <div className="d-flex flex-column">
          <div className={isMobile ? "m-0 p-2" : "m-3 ms-5 mb-0"}>
            <h1 style={{ color: "#2654A1", margin: "0", fontWeight: "700" }}>
              Audit Mutu Internal
            </h1>
            <Breadcrumbs breadcrumbs={breadcrumbs} />
          </div>

          <div
            className={
              isMobile
                ? "table-container bg-white p-1 m-1 mt-0 rounded"
                : "table-container bg-white p-2 pt-0 pb-0  m-5 mt-0 rounded"
            }
          >
            <div className="row mb-3">
              <div className="col-12 d-flex flex-wrap align-items-center">
                <div className="me-auto flex-grow-1 mt-3 me-3">
                  <SearchField onChange={(value) => setSearchKeyword(value)} />
                </div>
                <div className="m-0">
                  <Filter>
                    <DropDown
                      arrData={arrSort}
                      label="Urut Berdasarkan"
                      value={selectedSort}
                      forInput="urutFilter"
                      onChange={(e) => setSelectedSort(e.target.value)}
                    />
                    <DropDown
                      arrData={arrStatus}
                      label="Status"
                      value={selectedStatus}
                      forInput="statusFilter"
                      onChange={(e) => setSelectedStatus(e.target.value)}
                    />
                  </Filter>
                </div>
              </div>
            </div>
            {loading ? (
              <Loading />
            ) : (
              <div>
                <Table
                  arrHeader={[
                    "No",
                    "Kode Bagian Auditee",
                    "Auditee",
                    "Lead Auditor",
                    "Auditor",
                    "Tanggal Audit (Rencana)",
                    "Tanggal Audit (Aktual)",
                    "Ada Temuan",
                    "Status",
                    "Jumlah Temuan",
                    "Temuan Closed",
                  ]}
                  data={filteredData.map((item, index) => ({
                    Key: item.idSA,
                    idJadwal: item.idja,
                    No: (pageCurrent - 1) * pageSize + index + 1,
                    "Kode Bagian Auditee": item.kodebad,
                    Auditee: item.namaKadep,
                    "Lead Auditor": item.namaLeadAuditor,
                    Auditor: item.namaAuditor,
                    "Tanggal Audit (Rencana)": new Date(
                      item.tgljadwal
                    ).toLocaleDateString("id-ID", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    }),
                    "Tanggal Audit (Aktual)": item.tgljadwalAktual
                      ? new Date(item.tgljadwalAktual).toLocaleDateString(
                          "id-ID",
                          {
                            weekday: "long",
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          }
                        )
                      : "-",
                    "Ada Temuan":
                      item.isTemuan === 0 || item.isTemuan === null
                        ? "Belum Audit"
                        : "Ada Temuan",

                    Status: (() => {
                      switch (item.status) {
                        case "Self Assessment (Draft)":
                          if (
                            item.idLeadAuditor === activeUser ||
                            item.idAuditor === activeUser
                          ) {
                            return "Self Assessment (Belum)";
                          } else {
                            return item.status;
                          }

                        default:
                          return item.status;
                      }
                    })(),
                    kadep: item.kadep,
                    pic1: item.pic1,
                    pic2: item.pic2,
                    idAuditor: item.idAuditor,
                    idLeadAuditor: item.idLeadAuditor,
                    instrumen: item.namaInstrumen,
                  }))}
                  actions={(item) => {
                    switch (item.Status) {
                      case "Self Assessment (Belum)":
                        if (
                          item.kadep === activeUser ||
                          item.pic1 === activeUser ||
                          item.pic2 === activeUser
                        ) {
                          return ["Self Assessment", "Edit"];
                        } else {
                          return ["Self Assessment"]; // Default return if the condition is not met
                        }
                      case "Self Assessment (Draft)":
                        if (
                          item.kadep === activeUser ||
                          item.pic1 === activeUser ||
                          item.pic2 === activeUser
                        ) {
                          return ["Self Assessment", "Edit", "Send"];
                        } else {
                          return ["Self Assessment"]; // Default return if the condition is not met
                        }

                      case "Self Assessment (Selesai)":
                        if (
                          item.idAuditor === activeUser ||
                          item.idLeadAuditor === activeUser
                        ) {
                          return ["Self Assessment", "Temuan", "Edit"];
                        } else {
                          return ["Self Assessment"]; // Default return if the condition is not met
                        }

                      case "Temuan (Draft)":
                        if (
                          item.idAuditor === activeUser ||
                          item.idLeadAuditor === activeUser
                        ) {
                          return ["Self Assessment", "Temuan", "Edit", "Send"];
                        } else {
                          return ["Self Assessment"];
                        }

                      case "Menunggu Analisa Temuan":
                        if (
                          item.kadep === activeUser ||
                          item.pic1 === activeUser ||
                          item.pic2 === activeUser
                        ) {
                          return [
                            "Self Assessment",
                            "Temuan",
                            "AnalisaTemuan",
                            "Send",
                          ];
                        } else {
                          return ["Self Assessment", "Temuan"];
                        }
                      case "Monitoring":
                        if (
                          item.idAuditor === activeUser ||
                          item.idLeadAuditor === activeUser
                        ) {
                          return [
                            "Self Assessment",
                            "Temuan",
                            "AnalisaTemuan",
                            "Send",
                          ];
                        } else {
                          return ["Self Assessment", "Temuan", "AnalisaTemuan"];
                        }
                      case "Menunggu Verifikasi Akhir":
                        if (role === "ROL01") {
                          return [
                            "Self Assessment",
                            "Temuan",
                            "AnalisaTemuan",
                            "Send",
                          ];
                        } else {
                          return ["Self Assessment", "Temuan", "AnalisaTemuan"];
                        }

                      default:
                        return ["Self Assessment"];
                    }
                  }}
                  onEdit={(item) => {
                    if (
                      item.Status === "Self Assessment (Belum)" ||
                      item.Status === "Self Assessment (Draft)"
                    ) {
                      onChangePage("editSA", {
                        idData: item.Key,
                        instrumen: item.instrumen,
                        breadcrumbs: breadcrumbs,
                      });
                    } else if (
                      item.Status === "Self Assessment (Selesai)" ||
                      item.Status === "Temuan (Draft)"
                    ) {
                      onChangePage("editTemuan", {
                        idData: item.Key,
                        instrumen: item.instrumen,
                        breadcrumbs: breadcrumbs,
                      });
                    }
                  }}
                  onSelfAssessment={(item) =>
                    onChangePage("detailSA", {
                      idData: item.Key,
                      instrumen: item.instrumen,
                      breadcrumbs: breadcrumbs,
                      isDraftandAuditor:
                        (item.idAuditor === activeUser ||
                          item.idLeadAuditor === activeUser) &&
                        item.Status === "Self Assessment (Belum)"
                          ? true
                          : false,
                    })
                  }
                  onRiwayatTemuan={(item) =>
                    onChangePage("detailTemuan", {
                      idData: item.Key,
                      instrumen: item.instrumen,
                      breadcrumbs: breadcrumbs,
                    })
                  }
                  onAnalisaTemuan={(item) =>
                    onChangePage("analisaTemuan", {
                      idData: item.Key,
                      instrumen: item.instrumen,
                      breadcrumbs: breadcrumbs,
                    })
                  }
                  onSend={(item) =>
                    handleFinal(item.Key, item.idJadwal, item.Status)
                  }
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
      </main>
    </div>
  );
}
