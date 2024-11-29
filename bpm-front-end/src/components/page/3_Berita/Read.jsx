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

export default function Read({ onChangePage }) {
  const [pageSize] = useState(10);
  const isMobile = useIsMobile();
  const [pageCurrent, setPageCurrent] = useState(1);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]); // Data setelah difilter
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState(""); // Keyword pencarian
  const [selectedYear, setSelectedYear] = useState(""); // Filter tahun

  useEffect(() => {
    const fetchBerita = async () => {
      try {
        const response = await fetch(
          `${API_LINK}/api/MasterBerita/GetDataBerita`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) throw new Error("Gagal mengambil data");

        const result = await response.json();

        const groupedBerita = result.reduce((acc, item) => {
          if (!acc[item.ber_id]) {
            acc[item.ber_id] = {
              id: item.ber_id,
              title: item.ber_judul,
              date: format(new Date(item.ber_tgl), "yyyy-MM-dd", {
                locale: id,
              }),
              description: item.ber_isi,
              author: item.ber_created_by,
              images: [],
              year: new Date(item.ber_tgl).getFullYear(), // Tambahkan properti tahun
            };
          }
          if (item.dbr_foto) {
            acc[item.ber_id].images.push(item.dbr_foto);
          }

          return acc;
        }, {});

        const beritaArray = Object.values(groupedBerita);
        setData(beritaArray);
        setFilteredData(beritaArray); // Awalnya tanpa filter
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Gagal mengambil data");
      } finally {
        setLoading(false);
      }
    };

    fetchBerita();
  }, []);

  // Filter data berdasarkan kata kunci dan tahun
  useEffect(() => {
    let tempData = data;

    if (searchKeyword) {
      tempData = tempData.filter((item) =>
        item.title.toLowerCase().includes(searchKeyword.toLowerCase())
      );
    }

    if (selectedYear) {
      tempData = tempData.filter(
        (item) => item.year === parseInt(selectedYear)
      );
    }

    setFilteredData(tempData);
  }, [searchKeyword, selectedYear, data]);

  const indexOfLastData = pageCurrent * pageSize;
  const indexOfFirstData = indexOfLastData - pageSize;
  const currentData = filteredData.slice(indexOfFirstData, indexOfLastData);

  const handlePageNavigation = (page) => {
    setPageCurrent(page);
  };

  const resetFilter = () => {
    setSearchKeyword("");
    setSelectedYear("");
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
        const response = await fetch(
          `${API_LINK}/api/MasterBerita/DeleteBerita`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ ber_id: id }),
          }
        );

        if (!response.ok) throw new Error("Gagal menghapus berita");

        const result = await response.text();
        SweetAlert("Berhasil", result, "success");

        setData((prevData) => prevData.filter((item) => item.id !== id));
      } catch (err) {
        console.error(err);
        SweetAlert("Gagal", "Terjadi kesalahan saat menghapus berita", "error");
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

            <Table
              arrHeader={["No", "Judul Berita", "Tanggal", "Foto"]}
              headerToDataMap={{
                No: "No",
                "Judul Berita": "JudulBerita",
                Tanggal: "Tanggal",
                Foto: "Foto",
              }}
              data={currentData.map((item, index) => ({
                Key: item.id,
                No: indexOfFirstData + index + 1,
                JudulBerita: item.title,
                Tanggal: new Date(item.date).toLocaleDateString("id-ID", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                }),
                Foto: (
                  <div>
                    {item.images.length > 0 && (
                      <img
                        src={BERITAFOTO_LINK + item.images[0]}
                        alt={`Foto Berita 1`}
                        width="100"
                        height="100"
                      />
                    )}
                  </div>
                ),
              }))}
              actions={["Detail", "Edit", "Delete"]}
              onEdit={(item) => {
                onChangePage("edit", { state: { idData: item } });
              }}
              onDetail={(item) => {
                onChangePage("detail", { state: { idData: item } });
              }}
              onDelete={(item) => handleDelete(item)}
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
