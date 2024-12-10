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

export default function Read({ onChangePage }) {
  const isMobile = useIsMobile();
  const title = "Kelola Dokumentasi Kegiatan";
  const breadcrumbs = [
    { label: "Dokumentasi Kegiatan", href: "/kegiatan/jadwal" },
    { label: "Kelola Dokumentasi Kegiatan" },
  ];

  const [events, setEvents] = useState([]);
  const [status, setStatus] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [pageCurrent, setPageCurrent] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");

  const pageSize = 10;

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(
          `${API_LINK}/MasterKegiatan/GetDataKegiatanByCategory`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ keg_kategori: 3 }),
          }
        );

        if (!response.ok) throw new Error("Gagal mengambil data kegiatan");

        const data = await response.json();

        const formattedEvents = data.map((item) => {
          const startDate = moment(item.keg_tgl_mulai).format("YYYY-MM-DD");
          const endDate = moment(item.keg_tgl_selesai).format("YYYY-MM-DD");

          return {
            id: item.keg_id,
            title: item.keg_nama,
            description: item.keg_deskripsi,
            category: item.keg_kategori,
            start: moment(`${startDate}T${item.keg_jam_mulai}`).toDate(),
            end: moment(`${endDate}T${item.keg_jam_selesai}`).toDate(),
            location: item.keg_tempat,
            year: new Date(item.keg_tgl_mulai).getFullYear(),
          };
        });

        setEvents(formattedEvents);
        setFilteredData(formattedEvents);
      } catch (error) {
        setError("Gagal mengambil data kegiatan");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    let tempData = events;

    if (searchKeyword) {
      tempData = tempData.filter((item) =>
        item.title.toLowerCase().includes(searchKeyword.toLowerCase())
      );
    }

    if (selectedYear) {
      tempData = tempData.filter(
        (item) => new Date(item.start).getFullYear() === parseInt(selectedYear)
      );
    }

    if (selectedStatus) {
      tempData = tempData.filter((item) => item.category === selectedStatus);
    }

    setFilteredData(tempData);
  }, [searchKeyword, selectedYear, selectedStatus, events]);

  const indexOfLastData = pageCurrent * pageSize;
  const indexOfFirstData = indexOfLastData - pageSize;
  const currentData = filteredData.slice(indexOfFirstData, indexOfLastData);

  const eventStatus = () => {
    if (item.category === "Terlaksana") {
      return ["Detail"];
    } else {
      return ["Detail", "Edit", "Delete"];
    }
  };

  const handlePageNavigation = (page) => {
    setPageCurrent(page);
  };

  const resetFilter = () => {
    setSearchKeyword("");
    setSelectedYear("");
    setSelectedStatus("");
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
        const response = await fetch(
          `${API_LINK}/MasterKegiatan/DeleteKegiatan`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ keg_id: id, keg_modif_by: "author" }),
          }
        );

        if (!response.ok) throw new Error("Gagal menghapus kegiatan");

        const result = await response.text();
        SweetAlert("Berhasil", result, "success");

        setEvents((prevData) => prevData.filter((item) => item.id !== id));
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

  if (loading) return <Loading />;
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
              classType="primary dropdown-toggle px-4 border-start"
              data-bs-toggle="dropdown"
              data-bs-auto-close="outside"
              label="Tambah Data"
            />
            <div className="dropdown-menu" style={{ width: "350px" }}>
              {["Dari Jadwal Kegiatan", "Tambah Baru"].map((label, index) => (
                <Button
                  key={index}
                  type="button"
                  label={label}
                  width="100%"
                  boxShadow="0px 4px 6px rgba(0, 0, 0, 0)"
                  onClick={() => onChangePage(index === 0 ? "addExist" : "add")}
                  style={{
                    color: "#2654A1",
                    textAlign: "left",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = "#2654A1";
                    e.target.style.color = "white";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "white";
                    e.target.style.color = "#2654A1";
                  }}
                />
              ))}
            </div>
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
                      <label htmlFor="yearPicker" className="mb-1">
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
                      <label htmlFor="statusPicker" className="mb-1">
                        Berdasarkan Status
                      </label>
                      <select
                        className="form-control"
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                      >
                        <option value="">Semua</option>
                        <option value="1">Rencana</option>
                        <option value="2">Terlewat</option>
                        <option value="3">Terlaksana</option>
                      </select>
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

            <Table
              arrHeader={[
                "No",
                "Nama Kegiatan",
                "Tanggal Mulai",
                "Tempat",
                "Status",
              ]}
              headerToDataMap={{
                No: "No",
                "Nama Kegiatan": "NamaKegiatan",
                "Tanggal Mulai": "TanggalMulai",
                Tempat: "Tempat",
                Status: "Status",
              }}
              data={currentData.map((item, index) => ({
                Key: item.id,
                No: indexOfFirstData + index + 1,
                NamaKegiatan: item.title,
                TanggalMulai: new Date(item.start).toLocaleDateString("id-ID", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                }),
                Tempat: item.location,
                Status:
                  item.category === "1"
                    ? "Rencana"
                    : item.category === "2"
                    ? "Terlewat"
                    : "Terlaksana",
              }))}
              actions={["Detail", "Edit", "Delete"]}
              onEdit={(item) =>
                onChangePage("edit", { state: { idData: item.Key } })
              }
              onDetail={(item) =>
                onChangePage("detail", { state: { idData: item.Key } })
              }
              onDelete={(item) => handleDelete(item.Key)}
            />

            <Paging
              pageSize={pageSize}
              pageCurrent={pageCurrent}
              totalData={filteredData.length}
              navigation={handlePageNavigation}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
