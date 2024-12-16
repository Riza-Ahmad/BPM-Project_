import React, { useState, useEffect } from "react";
import Table from "../../../part/Table";
import Paging from "../../../part/Paging";
import PageTitleNav from "../../../part/PageTitleNav";
import Button from "../../../part/Button";
import SearchField from "../../../part/SearchField";
import DropDown from "../../../part/Dropdown";
import { useFetch } from "../../../util/useFetch";
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
  const [filteredData, setFilteredData] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedJenis, setSelectedJenis] = useState("");
  const [pageCurrent, setPageCurrent] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");

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

        if (data === "ERROR") throw new Error("Gagal memuat data kegiatan");

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
      try {
        const data = await useFetch(
          `${API_LINK}/MasterKegiatan/GetDataKegiatanByCategory`,
          { kategori: 3 },
          "POST"
        );

        if (data) {
          const formattedEvents = data.map((item) => {
            const startDate = moment(item.tglMulaiKegiatan).format(
              "YYYY-MM-DD"
            );
            const endDate = moment(item.tglSelesaiKegiatan).format(
              "YYYY-MM-DD"
            );

            return {
              id: item.idKegiatan,
              title: item.namaKegiatan,
              description: item.deskripsiKegiatan,
              category: item.kategoriKegiatan,
              start: moment(`${startDate}T${item.jamMulaiKegiatan}`).toDate(),
              end: moment(`${endDate}T${item.jamSelesaiKegiatan}`).toDate(),
              location: item.tempatKegiatan,
              year: new Date(item.tglMulaiKegiatan).getFullYear(),
              idJenisKegiatan: item.idJenisKegiatan,
              jenisKegiatan: item.namaJenisKegiatan,
            };
          });

          setEvents(formattedEvents);
          setFilteredData(formattedEvents);
        }
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

    if (selectedJenis) {
      tempData = tempData.filter(
        (item) => item.idJenisKegiatan === parseInt(selectedJenis)
      );
    }

    setFilteredData(tempData);
  }, [searchKeyword, selectedJenis, selectedYear, selectedStatus, events]);

  const indexOfLastData = pageCurrent * pageSize;
  const indexOfFirstData = indexOfLastData - pageSize;
  const currentData = filteredData.slice(indexOfFirstData, indexOfLastData);

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
          { idKegiatan: id },
          "POST"
        );

        if (response === "ERROR") throw new Error("Gagal menghapus kegiatan");

        SweetAlert("Berhasil", "Data Berhasil Dihapus", "success");

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
                        label="Berdasarkan Jenis Kegiatan"
                        arrData={jenisKegiatan}
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

            <Table
              arrHeader={[
                "No",
                "Nama Kegiatan",
                "Tanggal Mulai",
                "Jenis Kegiatan",
                "Tempat",
              ]}
              data={currentData.map((item, index) => ({
                Key: item.id,
                No: indexOfFirstData + index + 1,
                "Nama Kegiatan": item.title,
                "Tanggal Mulai": new Date(item.start).toLocaleDateString(
                  "id-ID",
                  {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  }
                ),
                "Jenis Kegiatan": item.jenisKegiatan,
                Tempat: item.location,
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
