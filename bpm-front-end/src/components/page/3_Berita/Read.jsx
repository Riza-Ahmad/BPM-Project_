import React, { useState, useEffect } from "react";
import Table from "../../part/Table";
import Paging from "../../part/Paging";
import PageTitleNav from "../../part/PageTitleNav";
import Button from "../../part/Button";
import SearchField from "../../part/SearchField";
import Filter from "../../part/Filter";
import { API_LINK, BERITAFOTO_LINK } from "../../util/Constants";
import Loading from "../../part/Loading";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { useIsMobile } from "../../util/useIsMobile";
import SweetAlert from "../../util/SweetAlert";
import { useFetch } from "../../util/useFetch";
import DropDown from "../../part/Dropdown";
import { decodeHtml } from "../../util/DecodeHtml";

const dataFilterSort = [
  { Value: "tglBerita ASC", Text: "Tanggal Terbit [↑]" },
  { Value: "tglBerita DESC", Text: "Tanggal Terbit [↓]" },
];

export default function Read({ onChangePage }) {
  const [pageSize] = useState(10);
  const isMobile = useIsMobile();
  const [pageCurrent, setPageCurrent] = useState(1);
  const [filteredData, setFilteredData] = useState([]); // Data setelah difilter
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState(""); // Keyword pencarian
  const [selectedYear, setSelectedYear] = useState(""); // Filter tahun
  const [selectedDate, setSelectedDate] = useState("tglBerita DESC");
  const [totalData, setTotalData] = useState(0);
  const [isBerita, setIsBerita] = useState(false);

  useEffect(() => {
    const fetchBerita = async () => {
      setLoading(true);
      try {
        const result = await useFetch(
          `${API_LINK}/MasterBerita/GetDataBerita`,
          {
            param1: searchKeyword,
            param2: selectedYear,
            param3: pageSize,
            param4: pageCurrent,
            param5: selectedDate,
          },
          "POST"
        );

        const groupedBerita = result.reduce((acc, item) => {
          if (!acc[item.idBerita]) {
            acc[item.idBerita] = {
              id: item.idBerita,
              title: item.judulBerita,
              date: new Date(item.tglBerita),
              formattedDate: format(
                new Date(item.tglBerita),
                "EEEE, dd MMMM yyyy",
                {
                  locale: id,
                }
              ),
              year: new Date(item.tglBerita).getFullYear(),
              description: item.isiBerita,
              author: item.penulisBerita,
              images: [],
            };
          }

          setTotalData(item.TotalCount);

          if (item.fotoBerita) {
            acc[item.idBerita].images.push(item.fotoBerita);
          }
          return acc;
        }, {});

        const sortedBerita = Object.values(groupedBerita).sort(
          (a, b) => b.date - a.date
        );

        if (isBerita === false) {
          setIsBerita(true);
        }

        setFilteredData(sortedBerita);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Gagal mengambil data");
      } finally {
        setLoading(false);
      }
    };

    fetchBerita();
  }, [searchKeyword, selectedYear, selectedDate, pageCurrent]);

  const indexOfLastData = pageCurrent * pageSize;
  const indexOfFirstData = indexOfLastData - pageSize;

  const handlePageNavigation = (page) => {
    setPageCurrent(page);
  };

  const resetFilter = () => {
    setSearchKeyword("");
    setSelectedYear("");
    setSelectedDate("DESC");
  };

  const title = "Kelola Berita";
  const breadcrumbs = [
    { label: "Berita", href: "/berita" },
    { label: "Kelola Berita" },
  ];

  const handleDelete = async (id) => {
    const confirm = await SweetAlert(
      "Konfirmasi",
      "Apakah Anda yakin ingin menghapus berita ini?",
      "warning",
      "Ya, Hapus",
      null,
      "",
      true
    );

    if (confirm) {
      try {
        const response = await useFetch(
          `${API_LINK}/MasterBerita/DeleteBerita`,
          { idBerita: id },
          "POST"
        );

        if (response === "ERROR") throw new Error("Gagal menghapus berita");

        SweetAlert("Berhasil", "Berita berhasil dihapus", "success");

        setFilteredData((prevData) =>
          prevData.filter((item) => item.id !== id)
        );
      } catch (err) {
        console.error(err);
        SweetAlert("Gagal", "Terjadi kesalahan saat menghapus berita", "error");
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
                  <SearchField onChange={(value) => setSearchKeyword(value)} />
                </div>

                <div className="m-0">
                  <Filter>
                    <div className="mb-3">
                      <DropDown
                        arrData={dataFilterSort}
                        label="Urut Bedasarkan"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                      />
                    </div>

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
                  arrHeader={["No", "Judul Berita", "Tanggal", "Foto"]}
                  data={filteredData.map((item, index) => ({
                    Key: item.id,
                    No: indexOfFirstData + index + 1,
                    "Judul Berita": (
                      <div
                        dangerouslySetInnerHTML={{
                          __html: decodeHtml(item.title || ""),
                        }}
                      />
                    ),
                    Tanggal: new Date(item.date).toLocaleDateString("id-ID", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    }),
                    Foto: (
                      <div style={{ minWidth: "200px", textAlign: "center" }}>
                        {item.images.length > 0 && (
                          <img
                            src={BERITAFOTO_LINK + item.images[0]}
                            alt={`Foto Berita 1`}
                            width="180"
                            height="100"
                          />
                        )}
                      </div>
                    ),
                  }))}
                  actions={["Detail", "Edit", "Delete"]}
                  onEdit={(item) => {
                    onChangePage("edit", { idData: item.Key });
                  }}
                  onDetail={(item) => {
                    onChangePage("detail", { idData: item.Key });
                  }}
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
