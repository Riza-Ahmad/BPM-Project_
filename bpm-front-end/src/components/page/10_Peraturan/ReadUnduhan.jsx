import React, { useEffect, useState, useRef } from "react";
import Table from "../../part/Table";
import Paging from "../../part/Paging";
import PageTitleNav from "../../part/PageTitleNav";
import Button from "../../part/Button";
import { useLocation, useNavigate } from "react-router-dom";
import { API_LINK } from "../../util/Constants";
import { useFetch } from "../../util/useFetch";
import Loading from "../../part/Loading";
import Filter from "../../part/Filter";
import SearchField from "../../part/SearchField";
import DropDown from "../../part/Dropdown";
import moment from "moment";
import { useIsMobile } from "../../util/useIsMobile";

// Dynamically set title and breadcrumbs based on idMenu
let title = "Hallo";
let breadcrumbs = [];

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return (
    date.toISOString().split("T")[0] +
    " " +
    date.toISOString().split("T")[1].split(".")[0]
  );
};

const pageSize = 10;

export default function Read({ onChangePage }) {
  const isMobile = useIsMobile();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const currentPath = location.pathname;
  const rootPath = currentPath.split("/")[2];
  const idMenu = location.state?.idMenu;
  const idData = location.state?.idData;
  const [pageCurrent, setPageCurrent] = useState(1);
  const [loading, setLoading] = useState(true);

  const [filteredData, setFilteredData] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedJudul, setSelectedJudul] = useState("");

  const searchQuery = useRef();
  const searchFilterSort = useRef();

  const indexOfLastData = pageCurrent * pageSize;
  const indexOfFirstData = indexOfLastData - pageSize;

  const handlePageNavigation = (page) => {
    setPageCurrent(page);
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await useFetch(
          `${API_LINK}/MasterPeraturan/GetDataUnduhanPeraturan`,
          {
            idMenu: idMenu,
            search: searchKeyword,
            year: selectedYear,
            status: selectedStatus,
            judul: selectedJudul,
            size: pageSize,
            page: pageCurrent,
            idData: idData,
          },
          "POST"
        );

        if (data.length > 0 && data[0].TotalCount !== undefined) {
          setTotalData(data[0].TotalCount); // Set hanya sekali
        }
        const formattedEvents = data.map((item) => {
          return {
            id: item.idUnduhan,
            tglUnduhan:
              new Date(item.tglUnduhan).toLocaleDateString("id-ID", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              }) +
                ", " +
                new Date(item.tglUnduhan).toLocaleTimeString("id-ID", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false, // Menggunakan format 24 jam
                }) +
                " WIB" || "",
            judulDok: item.judulDok,
            fileDok: item.fileDok,
            jenisDok: item.jenisDok,
            namaKry: item.namaKry,
            jabatan: item.jabatan,
            status: item.status,
          };
        });

        setFilteredData(formattedEvents);
      } catch (error) {
        setError("Gagal mengambil data kegiatan");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [
    idMenu,
    searchKeyword,
    selectedJudul,
    selectedYear,
    selectedStatus,
    pageSize,
    pageCurrent,
  ]);

  useEffect(() => {
    if (rootPath === "dokumen") {
      title = "Riwayat Pengunduhan Dokumen Peraturan";
      breadcrumbs = [
        { label: "Peraturan", href: "/peraturan/dokumen" },
        { label: "Dokumen Peraturan" },
      ];
    } else if (rootPath === "aps") {
      title = "Riwayat Pengunduhan Dokumen Instrumen APS";
      breadcrumbs = [
        { label: "Instrumen APS", href: "/peraturan/aps" },
        { label: "Dokumen Instrumen APS" },
      ];
    }

    // Set loading to false once idMenu is determined
    setLoading(false);
  }, [idMenu]);

  const resetFilter = () => {
    setSearchKeyword("");
    setSelectedYear("");
    setSelectedStatus("");
    setSelectedJudul("");
  };

  if (loading) return <Loading />;

  return (
    <div className="d-flex flex-column min-vh-100">
      <main className="flex-grow-1 p-3" style={{ marginTop: "80px" }}>
        <div className="d-flex flex-column">
          <div className={isMobile ? "m-0" : "m-3"}>
            <PageTitleNav
              title={title}
              breadcrumbs={breadcrumbs}
              onClick={() => onChangePage("index", { idMenu: idMenu })}
            />
          </div>
          <div
            className={
              isMobile
                ? "table-container bg-white p-1 m-1 mt-0 rounded"
                : "table-container bg-white p-3 m-5 mt-0 rounded"
            }
          >
            <Table
              arrHeader={[
                "No",
                "Tanggal Unduh",
                "Judul Dokumen",
                "Nama Berkas (File)",
                "Jenis Penyalinan",
                "Nama Pengunduh",
                "Jabatan",
                "Status",
              ]}
              data={filteredData.map((item, index) => ({
                Key: item.id,
                No: indexOfFirstData + index + 1,
                "Tanggal Unduh": item.tglUnduhan,
                "Judul Dokumen": item.judulDok,
                "Nama Berkas (File)": item.fileDok,
                "Jenis Penyalinan": item.jenisDok,
                "Nama Pengunduh": item.namaKry,
                Jabatan: item.jabatan,
                Status: item.status,
              }))}
              aksiIs={false}
            />

            <Paging
              pageSize={pageSize}
              pageCurrent={pageCurrent}
              totalData={totalData}
              navigation={handlePageNavigation}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
