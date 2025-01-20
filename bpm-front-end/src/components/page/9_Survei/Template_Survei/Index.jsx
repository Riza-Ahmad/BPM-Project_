import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import Table from "../../../part/Table";
import Paging from "../../../part/Paging";
import PageTitleNav from "../../../part/PageTitleNav";
import Button from "../../../part/Button";
import Loading from "../../../part/Loading";
import SearchField from "../../../part/SearchField";
import Filter from "../../../part/Filter";
import { API_LINK } from "../../../util/Constants";
import { useIsMobile } from "../../../util/useIsMobile";
import { useNavigate } from "react-router-dom";

export default function Template_Survei({ onChangePage }) {
  const [pageSize] = useState(10);
  const isMobile = useIsMobile();
  const [pageCurrent, setPageCurrent] = useState(1);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortDate, setSortDate] = useState(""); // Untuk sort tanggal
  const [filterStatus, setFilterStatus] = useState(""); // Untuk filter status
  const [filteredData, setFilteredData] = useState(data); // Data yang akan ditampilkan
  const indexOfLastData = pageCurrent * pageSize;
  const indexOfFirstData = indexOfLastData - pageSize;
  const currentData = filteredData.slice(indexOfFirstData, indexOfLastData);
  const handlePageNavigation = (page) => setPageCurrent(page);
  const handleSearchChange = (query) => setSearchQuery(query);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch templates from the backend
    const fetchTemplateSurvei = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${API_LINK}/TemplateSurvei/GetTemplateSurvei`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({}),
          }
        );

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

        const result = await response.json();
        const templates = Array.isArray(result) ? result : JSON.parse(result);

        // Filter templates by status 0 and 1 only
        const filteredTemplates = templates.filter(
          (item) => item.tsu_status === 0 || item.tsu_status === 1
        );

        const formattedTemplates = filteredTemplates.map((item) => ({
          id: item.tsu_id,
          name: item.tsu_nama,
          finalDate: item.tsu_modif_date
            ? new Date(item.tsu_modif_date).toISOString()
            : "-",
          status: item.tsu_status,
        }));

        setData(formattedTemplates);
        setFilteredData(formattedTemplates);
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: error.message || "Gagal mengambil data template survei!",
        });
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchTemplateSurvei();
  }, []);

  // The handleFilterChange function can now take two separate arguments: sortDate and status
  const handleFilterChange = (dateOrder, status) => {
    setSortDate(dateOrder);
    setFilterStatus(status);
  };

  // UseEffect hook for applying filter and sort
  useEffect(() => {
    let filtered = [...data]; // Start with a copy of the original data

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter((item) =>
        Object.values(item)
          .join(" ")
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      );
    }

    // Apply status filter
    if (filterStatus) {
      filtered = filtered.filter((item) => {
        if (filterStatus === "0") return item.status === 0;
        if (filterStatus === "1") return item.status === 1;
        if (filterStatus === "2") return item.status === 2;
        return true;
      });
    }

    // Apply date sorting
    if (sortDate) {
      filtered.sort((a, b) => {
        if (a.finalDate === "-" || b.finalDate === "-") return 0;
        return sortDate === "asc"
          ? new Date(a.finalDate) - new Date(b.finalDate)
          : new Date(b.finalDate) - new Date(a.finalDate);
      });
    }

    setFilteredData(filtered); // Update filtered data
  }, [searchQuery, filterStatus, sortDate, data]); // Ensure these are the only dependencies

  // Reset filter button should reset both date and status filters
  const resetFilters = () => {
    setSortDate(""); // Reset sort date
    setFilterStatus(""); // Reset filter status
  };

  if (loading) return <Loading />;

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Anda akan menghapus template survei ini.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, Hapus Template",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(
          `${API_LINK}/TemplateSurvei/DeleteTemplateSurvei`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              p1: id,
              p2: 2,
              p3: "dianvivi.widiyawati",
            }),
          }
        );

        if (!response.ok)
          throw new Error("Gagal mengganti status Template Survei.");

        Swal.fire("Berhasil", "Template Survei berhasil dihapus.", "success");

        fetchTemplateSurvei(); // Reload the template list or data
      } catch (err) {
        Swal.fire("Gagal", "Terjadi kesalahan saat mengganti status.", "error");
      }
    } else {
      Swal.fire("Dibatalkan", "Template Survei tidak terhapus.", "info");
    }
  };

  const handleFinal = async (id) => {
    // Display confirmation dialog before proceeding
    const result = await Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Anda akan menetapkan status template ini menjadi Final.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, Tetapkan Final",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(
          `${API_LINK}/TemplateSurvei/FinalTemplate`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ p1: id, p2: "Admin" }),
          }
        );

        if (!response.ok) throw new Error("Gagal menetapkan status final.");

        Swal.fire(
          "Berhasil",
          "Template Survei telah menjadi Final.",
          "success"
        );

        setData((prevData) =>
          prevData.map((item) =>
            item.id === id ? { ...item, status: 1 } : item
          )
        );
      } catch (err) {
        Swal.fire(
          "Gagal",
          "Terjadi kesalahan saat menetapkan status Final.",
          "error"
        );
      }
    } else {
      Swal.fire("Dibatalkan", "Status template tidak diubah.", "info");
    }
  };

  const handleToggle = async (id) => {
    try {
      const response = await fetch(
        `${API_LINK}/TemplateSurvei/DeleteTemplateSurvei`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ p1: id, p2: "Admin" }),
        }
      );

      if (!response.ok)
        throw new Error("Gagal mengganti status Template Survei.");

      Swal.fire(
        "Berhasil",
        "Status Template Survei berhasil diganti.",
        "success"
      );

      fetchTemplateSurvei();
    } catch (err) {
      Swal.fire("Gagal", "Terjadi kesalahan saat mengganti status.", "error");
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <main className="flex-grow-1 p-3" style={{ marginTop: "80px" }}>
        <div className="d-flex flex-column">
          <div className={isMobile ? "m-0 p-0" : "m-3 mb-0"}>
            <PageTitleNav
              title="Template Survei"
              breadcrumbs={[
                { label: "Survei", href: "/survei" },
                { label: "Template Survei" },
              ]}
              onClick={() => navigate("/survei")}
            />
          </div>

          <div
            className={isMobile ? "p-2 m-2 mt-2 mb-0" : "p-3 m-5 mt-2 mb-0"}
            style={{ marginLeft: "50px" }}
          >
            <Button
              iconName="add"
              classType="primary"
              label="Tambah Template"
              onClick={() => navigate("/survei/template/add")}
            />

            <div className="row mt-5">
              <div className="col-lg-11 col-md-6">
                <SearchField onChange={handleSearchChange} />
              </div>
              <div className="col-lg-1 col-md-6">
                <Filter>
                  <div>
                    <label htmlFor="filter-date" className="form-label">
                      Sort Tanggal:
                    </label>
                    <select
                      id="filter-date"
                      className="form-select"
                      value={sortDate}
                      onChange={(e) =>
                        handleFilterChange(e.target.value, filterStatus)
                      }
                    >
                      <option value="" disabled>
                        -- Pilih Sorting --
                      </option>
                      <option value="asc">Ascending</option>
                      <option value="desc">Descending</option>
                    </select>
                  </div>

                  <div className="mt-3">
                    <label htmlFor="filter-status" className="form-label">
                      Filter by Status:
                    </label>
                    <select
                      id="filter-status"
                      className="form-select"
                      value={filterStatus}
                      onChange={(e) =>
                        handleFilterChange(sortDate, e.target.value)
                      }
                    >
                      <option value="" disabled>
                        -- Pilih Status --
                      </option>
                      <option value="0">Draft</option>
                      <option value="1">Final</option>
                      <option value="2">Tidak Aktif</option>
                    </select>
                  </div>

                  <button
                    className="btn btn-secondary mt-2"
                    onClick={() => handleFilterChange("", "")}
                  >
                    Reset Filter
                  </button>
                </Filter>
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
              arrHeader={["No", "Nama Template", "Tanggal Final", "Status"]}
              data={currentData.map((item, index) => ({
                Key: item.id,
                No: indexOfFirstData + index + 1,
                "Nama Template": item.name,
                "Tanggal Final":
                  item.finalDate === "-"
                    ? "-"
                    : new Date(item.finalDate).toLocaleDateString(),
                Status:
                  item.status === 0
                    ? "Draft"
                    : item.status === 1
                    ? "Final"
                    : "Tidak Aktif", // Add the 'Tidak Aktif' status
              }))}
              actions={
                (item) =>
                  item.Status === "Draft"
                    ? ["Detail", "Edit", "Delete", "Final"]
                    : item.Status === "Final"
                    ? ["Detail", "Toggle"] // Add action for 'Final' status
                    : ["Detail", "Toggle"] // Add action for 'Tidak Aktif' status
              }
              onEdit={(item) =>
                onChangePage("edit", { state: { idData: item.Key } })
              }
              onDetail={(item) =>
                onChangePage("detail", { state: { idTemplate: item.Key } })
              }
              onDelete={(item) => handleDelete(item.Key)}
              onFinal={(item) => handleFinal(item.Key)}
              onToggle={(item) => {
                handleToggle(item.Key);
              }}
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