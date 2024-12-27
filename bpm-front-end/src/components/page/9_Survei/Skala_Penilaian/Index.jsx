import React, { useState, useRef, useEffect } from "react";
import Table from "../../../part/Table";
import Paging from "../../../part/Paging";
import PageTitleNav from "../../../part/PageTitleNav";
import Button from "../../../part/Button";
import { API_LINK } from "../../../util/Constants";
import Filter from "../../../part/Filter";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "../../../util/useIsMobile";
import Swal from "sweetalert2";

export default function Index() {
  const [pageSize] = useState(10);
  const [pageCurrent, setPageCurrent] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [Skala, setSkala] = useState([]);
  const [filterType, setFilterType] = useState("");
  const [filterSkalaMin, setFilterSkalaMin] = useState("");
  const [filterSkalaMax, setFilterSkalaMax] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const handlePageNavigation = (page) => setPageCurrent(page);

  const filteredSkala = Skala.filter((item) => {
    const searchRegex = new RegExp(searchQuery, "i");
    const matchesQuery =
      searchRegex.test(item.skp_tipe) ||
      searchRegex.test(item.skp_skala) ||
      searchRegex.test(item.skp_deskripsi) ||
      searchRegex.test(item.skp_status);

    const matchesFilterType = filterType ? item.skp_tipe === filterType : true;
    const matchesFilterSkala =
      (filterSkalaMin ? item.skp_skala >= filterSkalaMin : true) &&
      (filterSkalaMax ? item.skp_skala <= filterSkalaMax : true);
    const matchesFilterStatus =
      filterStatus !== "" ? item.skp_status.toString() === filterStatus : true;

    return matchesQuery && matchesFilterType && matchesFilterSkala && matchesFilterStatus;
  });

  const currentData = filteredSkala.slice(
    (pageCurrent - 1) * pageSize,
    pageCurrent * pageSize
  );

  const title = "Skala Penilaian";
  const breadcrumbs = [{ label: "Skala Penilaian" }];

  const fetchSkala = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_LINK}/SkalaPenilaian/GetSkalaPenilaian`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
        }
      );

      if (!response.ok) throw new Error("Gagal mengambil data skala.");

      const result = await response.json();
      setSkala(result);
    } catch (err) {
      console.error("Fetch error:", err);
      alert("Gagal mengambil data skala.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkala();
  }, []);

  const handleDelete = async (id) => {
    const parameters = {
      p1: id,
      p2: "Admin",
    };

    const confirm = await Swal.fire({
      title: "Konfirmasi",
      text: "Apakah Anda yakin ingin menghapus Skala Penilaian ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal",
    });

    if (confirm.isConfirmed) {
      try {
        const response = await fetch(
          `${API_LINK}/SkalaPenilaian/DeleteSkalaPenilaian`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(parameters),
          }
        );

        if (!response.ok) throw new Error("Gagal menghapus Skala Penilaian.");

        Swal.fire("Berhasil", "Skala Penilaian berhasil dihapus.", "success");
        fetchSkala();
      } catch (err) {
        console.error("Error:", err);
        Swal.fire(
          "Gagal",
          "Terjadi kesalahan saat menghapus Skala Penilaian.",
          "error"
        );
      }
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <main className="flex-grow-1" style={{ marginTop: "80px" }}>
        <div className="d-flex flex-column">
          <div className="mb-0" style={{ margin: isMobile ? "1rem" : "3rem" }}>
            <PageTitleNav
              title={title}
              breadcrumbs={breadcrumbs}
              onClick={() => navigate("/beranda")}
            />
          </div>

          <div
            className="p-3 mt-2 mb-0"
            style={{ margin: isMobile ? "1rem" : "3rem" }}
          >
            <Button
              iconName="add"
              classType="primary"
              label="Tambah Skala Penilaian"
              onClick={() => navigate("/survei/skala/add")}
            />

            <div className="row mt-5">
              <div className="col-lg-8 col-md-6">
                <input
                  type="text"
                  placeholder="Cari data..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="form-control"
                />
              </div>
              <div className="col-lg-4 col-md-6">
                <Filter>
                  {[...new Set(Skala.map((item) => item.skp_tipe))].map((option) => (
                    <div key={option} className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="filterSkalaType"
                        id={`filter-type-${option}`}
                        value={option}
                        checked={filterType === option}
                        onChange={(e) => setFilterType(e.target.value)}
                      />
                      <label className="form-check-label" htmlFor={`filter-type-${option}`}>
                        {option}
                      </label>
                    </div>
                  ))}

                  <div className="mt-3">
                    <label htmlFor="filter-skala-range" className="form-label">
                      Filter by Skala Range:
                    </label>
                    <input
                      type="number"
                      placeholder="Min"
                      className="form-control"
                      value={filterSkalaMin}
                      onChange={(e) => setFilterSkalaMin(e.target.value)}
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      className="form-control mt-2"
                      value={filterSkalaMax}
                      onChange={(e) => setFilterSkalaMax(e.target.value)}
                    />
                  </div>

                  <div className="mt-3">
                    <label htmlFor="filter-status" className="form-label">
                      Filter by Status:
                    </label>
                    <select
                      id="filter-status"
                      className="form-select"
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                    >
                      <option value="">All</option>
                      <option value="1">Aktif</option>
                      <option value="0">Tidak Aktif</option>
                    </select>
                  </div>

                  <div className="mt-3">
                    <button
                      className="btn btn-secondary"
                      onClick={() => {
                        setFilterType("");
                        setFilterSkalaMin("");
                        setFilterSkalaMax("");
                        setFilterStatus("");
                      }}
                    >
                      Reset Filters
                    </button>
                  </div>
                </Filter>
              </div>
            </div>
          </div>
          <div
            className="table-container bg-white p-3 mt-0 rounded"
            style={{ margin: isMobile ? "1rem" : "3rem" }}
          >
            <Table
              arrHeader={["No", "Tipe Skala", "Skala", "Deskripsi", "Status"]}
              data={currentData.map((item, index) => ({
                key: item.skp_id,
                No: (pageCurrent - 1) * pageSize + index + 1,
                "Tipe Skala": item.skp_tipe,
                Skala: item.skp_skala,
                Deskripsi: item.skp_deskripsi,
                Status: item.skp_status === 1 ? "Aktif" : "Tidak Aktif", // Ubah status
              }))}
              actions={["Detail", "Toggle", "Edit"]}
              onDetail={(item) => {
                console.log(item);
                navigate(`/survei/skala/detail/${item.key}`, {
                  state: { detailData: item.key },
                });
              }}
              onToggle={(item) => {
                handleDelete(item.key);
              }}
              onEdit={(item) => {
                console.log(item);
                navigate(`/survei/skala/edit/${item.key}`, {
                  state: { editData: item.key },
                });
              }}
            />
            <Paging
              pageSize={pageSize}
              pageCurrent={pageCurrent}
              totalData={filteredSkala.length}
              navigation={handlePageNavigation}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
