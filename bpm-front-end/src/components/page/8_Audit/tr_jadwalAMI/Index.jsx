import React, { useState, useRef, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { API_LINK, DOKUMEN_LINK } from "../../../util/Constants";
import { useFetch } from "../../../util/useFetch";
import Table from "../../../part/Table";
import Paging from "../../../part/Paging";
import SearchField from "../../../part/SearchField";
import Button from "../../../part/Button";
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

const breadcrumbs = [{ label: "Evaluasi" }, { label: "Jadwal AMI" }];

export default function Index({ onChangePage }) {
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
        `${API_LINK}/TransaksiJadwalAMI/GetDataJadwalAMI`,
        {
          param1: searchKeyword,
          param2: selectedSort,
          param3: pageSize,
          param4: pageCurrent,
          param5: selectedStatus,
          param6: "",
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

  const handleDelete = async (id) => {
    const confirm = await SweetAlert(
      "Konfirmasi",
      "Apakah Anda yakin ingin menghapus jadwal AMI ini?",
      "warning",
      "Ya, Hapus",
      null,
      "",
      true
    );

    if (confirm) {
      try {
        const response = await useFetch(
          `${API_LINK}/TransaksiJadwalAMI/DeleteJadwalAMIDraft`,
          { idJad: id },
          "POST"
        );

        if (response === "ERROR") throw new Error("Gagal menghapus kegiatan");

        SweetAlert("Berhasil", "Data Berhasil Dihapus", "success");

        setFilteredData((prevData) =>
          prevData.filter((item) => item.idJadwal !== id)
        );
      } catch (err) {
        console.error(err);
        SweetAlert(
          "Gagal",
          "Terjadi kesalahan saat menghapus kegiatan",
          "error"
        );
      }
    }
  };

  const handleFinal = async (id) => {
    const confirm = await SweetAlert(
      "Apakah Anda yakin ingin mengirim jadwal AMI ini?",
      "Jika jadwal sudah dikirim maka tidak dapat di ubah kembali, dan akan dilanjutkan ke proses selanjutnya ",
      "warning",
      "Ya, Kirim",
      null,
      "",
      true
    );

    if (confirm) {
      try {
        const response = await useFetch(
          `${API_LINK}/TransaksiJadwalAMI/FinalJadwalAMI`,
          { idJad: id },
          "POST"
        );

        if (response === "ERROR") throw new Error("Gagal kirim kegiatan");

        SweetAlert("Berhasil", "Data Berhasil dikirim", "success");

        setFilteredData((prevData) =>
          prevData.map(
            (data) =>
              data.idJadwal === id
                ? {
                    ...data, // Salin data lama
                    status:
                      data.status === "DRAFT"
                        ? "Self Assesment (Belum)" // Ubah status jika kondisi terpenuhi
                        : data.status, // Pertahankan status jika kondisi tidak terpenuhi
                  }
                : data // Pertahankan data lain yang tidak berubah
          )
        );
      } catch (err) {
        console.error(err);
        SweetAlert("Gagal", "Terjadi kesalahan saat kirim jadwal", "error");
      }
    }
  };

  if (error) return <p>{error}</p>;

  return (
    <div className="d-flex flex-column min-vh-100">
      <main className="flex-grow-1 p-3" style={{ marginTop: "80px" }}>
        <div className="d-flex flex-column">
          <div className={isMobile ? "m-0 p-2" : "m-3 ms-5 mb-0"}>
            <h1 style={{ color: "#2654A1", margin: "0", fontWeight: "700" }}>
              Jadwal AMI
            </h1>
            <Breadcrumbs breadcrumbs={breadcrumbs} />
          </div>

          <div
            className={isMobile ? "p-2 m-2 mt-2 mb-0 " : "p-1 m-5 mt-2 mb-0"}
            style={{ marginLeft: "50px" }}
          >
            <Button
              iconName="add"
              classType="primary"
              label="Tambah Data"
              onClick={() =>
                onChangePage("add", {
                  breadcrumbs: breadcrumbs,
                })
              }
            />
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
                    "Nama Bagian Auditee",
                    "Tanggal",
                    "Status",
                  ]}
                  data={filteredData.map((item, index) => ({
                    Key: item.idJadwal,
                    No: (pageCurrent - 1) * pageSize + index + 1,
                    "Kode Bagian Auditee": item.kodeBagAuditee,
                    "Nama Bagian Auditee": item.namaBagAuditee,
                    Tanggal: new Date(item.tglJadwal).toLocaleDateString(
                      "id-ID",
                      {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      }
                    ),
                    Status: item.status,
                  }))}
                  actions={(item) => {
                    return item.Status === "DRAFT"
                      ? ["Detail", "Edit", "Delete", "Send"]
                      : ["Detail"];
                  }}
                  onEdit={(item) =>
                    onChangePage("edit", {
                      idData: item.Key,
                      breadcrumbs: breadcrumbs,
                    })
                  }
                  onDetail={(item) =>
                    onChangePage("detail", {
                      idData: item.Key,
                      breadcrumbs: breadcrumbs,
                    })
                  }
                  onDelete={(item) => handleDelete(item.Key)}
                  onSend={(item) => handleFinal(item.Key)}
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
