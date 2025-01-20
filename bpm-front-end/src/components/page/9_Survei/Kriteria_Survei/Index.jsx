import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import Table from "../../../part/Table";
import Paging from "../../../part/Paging";
import PageTitleNav from "../../../part/PageTitleNav";
import Button from "../../../part/Button";
import Filter from "../../../part/Filter";
import { API_LINK } from "../../../util/Constants";
import { useIsMobile } from "../../../util/useIsMobile";

export default function KriteriaSurvei({ onChangePage }) {
  const [pageSize] = useState(10);
  const isMobile = useIsMobile();
  const [pageCurrent, setPageCurrent] = useState(1);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterYear, setFilterYear] = useState("");

  useEffect(() => {
    fetchKriteria();
  }, []);

  const fetchKriteria = async () => {
    try {
      const response = await fetch(
        `${API_LINK}/MasterKriteriaSurvei/GetDataKriteriaSurvei`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ page: 1, pageSize: 100 }),
        }
      );
      if (!response.ok) throw new Error("Gagal mengambil data kriteria");

      const result = await response.json();
      setData(result); // Store complete data including all fields
    } catch (err) {
      console.error("Fetch error:", err);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Gagal mengambil data kriteria!",
      });
    } finally {
      setLoading(false);
    }
  };

  const getAvailableYears = () => {
    const years = new Set();
    data.forEach((item) => {
      if (item.ksr_created_date) {
        const year = new Date(item.ksr_created_date).getFullYear();
        years.add(year);
      }
    });
    return Array.from(years).sort((a, b) => b - a); // Sort years descending
  };

  const resetFilter = () => {
    setFilterStatus("");
    setFilterYear("");
    setSearchTerm("");
    setPageCurrent(1);
  };

  const filteredData = data.filter((item) => {
    const searchRegex = new RegExp(searchTerm, "i");
    const matchesSearch =
      searchRegex.test(item.ksr_id) ||
      searchRegex.test(item.ksr_nama) ||
      searchRegex.test(item.ksr_created_by) ||
      searchRegex.test(item.ksr_created_date) ||
      searchRegex.test(item.ksr_modif_by) ||
      searchRegex.test(item.ksr_modif_date);

    const matchesStatus =
      filterStatus === "" ? true : item.ksr_status.toString() === filterStatus;

    const itemYear = item.ksr_created_date
      ? new Date(item.ksr_created_date).getFullYear().toString()
      : "";
    const matchesYear = filterYear === "" ? true : itemYear === filterYear;

    return matchesSearch && matchesStatus && matchesYear;
  });

  const indexOfLastData = pageCurrent * pageSize;
  const indexOfFirstData = indexOfLastData - pageSize;
  const currentData = filteredData.slice(indexOfFirstData, indexOfLastData);

  const handlePageNavigation = (page) => setPageCurrent(page);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <main className="flex-grow-1 p-3" style={{ marginTop: "80px" }}>
        <div className="d-flex flex-column">
          <div className={isMobile ? "m-0 p-0" : "m-3 mb-0"}>
            <PageTitleNav
              title="Kriteria Survei"
              breadcrumbs={[
                { label: "Kriteria Survei", href: "/survei/kriteria" },
              ]}
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
            <div className="row mt-5">
              <div className="col-lg-8 col-md-6">
                <input
                  type="text"
                  placeholder="Cari data..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-control"
                />
              </div>
              <div className="col-lg-4 col-md-6">
                <Filter>
                  <div>
                    <label htmlFor="filter-status" className="form-label">
                      Filter Status:
                    </label>
                    <select
                      id="filter-status"
                      className="form-select"
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                    >
                      <option value="">Semua Status</option>
                      <option value="1">Aktif</option>
                      <option value="0">Tidak Aktif</option>
                    </select>
                  </div>

                  <div className="mt-3">
                    <label htmlFor="filter-year" className="form-label">
                      Filter Tahun:
                    </label>
                    <select
                      id="filter-year"
                      className="form-select"
                      value={filterYear}
                      onChange={(e) => setFilterYear(e.target.value)}
                    >
                      <option value="">Semua Tahun</option>
                      {getAvailableYears().map((year) => (
                        <option key={year} value={year.toString()}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    className="btn btn-secondary mt-3"
                    onClick={resetFilter}
                  >
                    Reset Filter
                  </button>
                </Filter>
              </div>
            </div>
          </div>
        </div>

        <div
          className={
            isMobile
              ? "table-container bg-white p-2 m-2 mt-0 rounded"
              : "table-container bg-white p-3 m-5 mt-0 rounded"
          }
        >
          <Table
            arrHeader={[
              "No",
              
              
              "Nama Kriteria",
            
              
             
              
            ]}
            data={currentData.map((item, index) => ({
              key: index,
              idData: item.ksr_id,
              No: indexOfFirstData + index + 1,
              
              
              "Nama Kriteria": item.ksr_nama,
            
            }))}
            actions={["Edit", "Detail"]}
            onEdit={(id) => onChangePage("edit", { id: id.idData })}
            onDetail={(id) => onChangePage("detail", { id: id.idData })}
          />
          <Paging
            pageSize={pageSize}
            pageCurrent={pageCurrent}
            totalData={filteredData.length}
            navigation={handlePageNavigation}
          />
        </div>
      </main>
    </div>
  );
}
