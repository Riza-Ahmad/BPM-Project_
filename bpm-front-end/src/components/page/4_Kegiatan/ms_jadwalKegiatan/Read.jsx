import React, { useState, useEffect } from "react";
import Table from "../../../part/Table";
import Paging from "../../../part/Paging";
import PageTitleNav from "../../../part/PageTitleNav";
import Button from "../../../part/Button";
import SearchField from "../../../part/SearchField";
import Filter from "../../../part/Filter";
import { API_LINK } from "../../../util/Constants";
import Loading from "../../../part/Loading";
import { useIsMobile } from "../../../util/useIsMobile";
import SweetAlert from "../../../util/SweetAlert";
import moment from "moment";
import "moment-timezone";
import { useFetch } from "../../../util/useFetch";
import { decodeHtml } from "../../../util/DecodeHtml";
import DropDown from "../../../part/Dropdown";

export default function Read({ onChangePage }) {
  const isMobile = useIsMobile();
  const title = "Kelola Jadwal Kegiatan";
  const breadcrumbs = [
    { label: "Jadwal Kegiatan", href: "/kegiatan/jadwal" },
    { label: "Kelola Jadwal Kegiatan" },
  ];

  const [filteredData, setFilteredData] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedJenis, setSelectedJenis] = useState("");
  const [pageCurrent, setPageCurrent] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [status, setStatus] = useState([
    { Value: "", Text: "Semua" },
    { Value: "Rencana", Text: "Rencana" },
    { Value: "Terlewat", Text: "Terlewat" },
    { Value: "Terlaksana", Text: "Terlaksana" },
  ]);

  const pageSize = 10;

  const [jenisKegiatan, setJenisKegiatan] = useState([]);

  useEffect(() => {
    const fetchJenisKegiatan = async () => {
      try {
        const data = await useFetch(
          `${API_LINK}/MasterKegiatan/GetDataJenisKegiatan`,
          JSON.stringify({}),
          "POST"
        );

        const formattedData = [
          { Value: "", Text: "Semua" }, // Opsi default
          ...data.map((item) => ({
            Value: item.idJenisKegiatan,
            Text: item.namaJenisKegiatan,
          })),
        ];
        setJenisKegiatan(formattedData);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchJenisKegiatan();
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const data = await useFetch(
          `${API_LINK}/MasterKegiatan/GetDataKegiatanPage`,
          {
            search: searchKeyword,
            year: selectedYear,
            status: selectedStatus,
            jenis: selectedJenis,
            size: pageSize,
            page: pageCurrent,
            kategori: "",
          },
          "POST"
        );

        if (data.length > 0 && data[0].TotalCount !== undefined) {
          setTotalData(data[0].TotalCount); // Set hanya sekali
        }

        setFilteredData(data);
      } catch (error) {
        setError("Gagal mengambil data kegiatan");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [
    searchKeyword,
    selectedJenis,
    selectedYear,
    selectedStatus,
    pageSize,
    pageCurrent,
  ]);

  const indexOfLastData = pageCurrent * pageSize;
  const indexOfFirstData = indexOfLastData - pageSize;

  const handlePageNavigation = (page) => {
    setPageCurrent(page);
  };

  const resetFilter = () => {
    setSearchKeyword("");
    setSelectedYear("");
    setSelectedStatus("");
    setSelectedJenis("");
  };

  const handleDelete = async (id) => {
    const confirm = await SweetAlert(
      "Konfirmasi",
      "Apakah Anda yakin ingin menghapus kegiatan ini?",
      "warning",
      "Ya, Hapus",
      null,
      "",
      true
    );

    if (confirm) {
      try {
        const response = await useFetch(
          `${API_LINK}/MasterKegiatan/DeleteKegiatan`,
          { idKeg: id },
          "POST"
        );

        if (response === "ERROR") throw new Error("Gagal menghapus kegiatan");

        SweetAlert("Berhasil", "Data Berhasil Dihapus", "success");

        setFilteredData((prevData) =>
          prevData.filter((item) => item.idKegiatan !== id)
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

  if (error) return <p>{error}</p>;

  return (
    <div className="d-flex flex-column min-vh-100">
      <main className={"flex-grow-1 p-3"} style={{ marginTop: "80px" }}>
        <div className="d-flex flex-column">
          <div className={isMobile ? "m-0 p-0" : "m-3 mb-0"}>
            <PageTitleNav
              title={title}
              breadcrumbs={breadcrumbs}
              onClick={() => onChangePage("index")}
            />
          </div>
          <div
            className={isMobile ? "p-2 m-2 mt-2 mb-0" : "p-3 m-5 mt-2 mb-0"}
            style={{ marginLeft: "50px" }}
          >
            <Button
              iconName="add"
              classType="primary"
              label="Tambah Data"
              onClick={() => onChangePage("add")}
            />
          </div>
          <div
            className={
              isMobile
                ? "table-container bg-white p-1 m-1 mt-0 rounded"
                : "table-container bg-white p-3 m-5 mt-0 rounded"
            }
          >
            <div className="row mb-3">
              <div className="col-12 d-flex flex-wrap align-items-center">
                <div className="me-auto flex-grow-1 mt-3 me-3">
                  <SearchField
                    onChange={(value) => setSearchKeyword(value)}
                    value={searchKeyword}
                  />
                </div>

                <div className="m-0">
                  <Filter>
                    <div className="mb-3">
                      <label htmlFor="yearPicker" className="mb-1 fw-bold">
                        Berdasarkan Tahun
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="Masukkan Tahun"
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                        min="2000"
                        max={new Date().getFullYear()}
                      />
                    </div>
                    <div className="mb-3">
                      <DropDown
                        arrData={status}
                        label="Berdasarkan Status"
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                      />
                    </div>

                    <div className="mb-3">
                      <DropDown
                        arrData={jenisKegiatan}
                        label="Berdasarkan Jenis Kegiatan"
                        value={selectedJenis}
                        onChange={(e) => setSelectedJenis(e.target.value)}
                      />
                    </div>

                    <Button
                      classType="btn btn-secondary"
                      title="Reset Filter"
                      label="Reset"
                      onClick={resetFilter}
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
                    "Nama Kegiatan",
                    "Tanggal Mulai",
                    "Tanggal Selesai",
                    "Durasi Waktu",
                    "Jenis Kegiatan",
                    "Tempat",
                    "Status",
                  ]}
                  data={filteredData.map((item, index) => ({
                    Key: item.idKegiatan,
                    key: item.selisihWaktu,
                    No: indexOfFirstData + index + 1,
                    "Nama Kegiatan": (
                      <div
                        dangerouslySetInnerHTML={{
                          __html: decodeHtml(item.namaKegiatan || ""),
                        }}
                      />
                    ),

                    "Tanggal Mulai": new Date(
                      item.tglMulaiKegiatan
                    ).toLocaleDateString("id-ID", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    }),

                    "Tanggal Selesai": new Date(
                      item.tglSelesaiKegiatan
                    ).toLocaleDateString("id-ID", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    }),

                    "Durasi Waktu": new Date(
                      item.selisihWaktu("Tanggal Mulai" - "Tanggal Selesai")
                    ).toLocaleDateString("id-ID", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    }),

                    "Jenis Kegiatan": item.namaJenisKegiatan,
                    Tempat: item.tempatKegiatan,
                    Status: item.kategoriKegiatan,
                  }))}
                  actions={(item) => {
                    return item.Status === "Terlaksana"
                      ? ["Detail"]
                      : ["Detail", "Edit", "Delete"];
                  }}
                  onEdit={(item) => onChangePage("edit", { idData: item.Key })}
                  onDetail={(item) =>
                    onChangePage("detail", { idData: item.Key })
                  }
                  onDelete={(item) => handleDelete(item.Key)}
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
