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
import { useFetch } from "../../../util/useFetch";

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
  const [sortDate, setSortDate] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filteredData, setFilteredData] = useState(data);
  const indexOfLastData = pageCurrent * pageSize;
  const indexOfFirstData = indexOfLastData - pageSize;
  const currentData = filteredData.slice(indexOfFirstData, indexOfLastData);
  const handlePageNavigation = (page) => setPageCurrent(page);
  const handleSearchChange = (query) => setSearchQuery(query);
  const navigate = useNavigate();

  const fetchTemplateSurvei = async () => {
    setLoading(true);
    try {
      const result = await useFetch(
        `${API_LINK}/TemplateSurvei/GetTemplateSurvei`,
        {},
        "POST"
      );

      if (result === "ERROR") {
        throw new Error("Gagal mengambil data template survei!");
      }

      if (!result || !Array.isArray(result)) {
        throw new Error("Data template survei tidak valid.");
      }

      const filteredTemplates = result.filter(
        (item) => item.tsu_status === "Draft" || item.tsu_status === "Final"
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
      console.error("Error fetching templates:", error);
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

  const handleFilterChange = (dateOrder, status) => {
    setSortDate(dateOrder);
    setFilterStatus(status);
  };

  useEffect(() => {
    let filtered = [...data];

    if (searchQuery) {
      filtered = filtered.filter((item) =>
        Object.values(item)
          .join(" ")
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      );
    }

    if (filterStatus) {
      filtered = filtered.filter((item) => {
        if (filterStatus === "0") return item.status === 0;
        if (filterStatus === "1") return item.status === 1;
        if (filterStatus === "2") return item.status === 2;
        return true;
      });
    }

    if (sortDate) {
      filtered.sort((a, b) => {
        if (a.finalDate === "-" || b.finalDate === "-") return 0;
        return sortDate === "asc"
          ? new Date(a.finalDate) - new Date(b.finalDate)
          : new Date(b.finalDate) - new Date(a.finalDate);
      });
    }

    setFilteredData(filtered);
  }, [searchQuery, filterStatus, sortDate, data]);

  const resetFilters = () => {
    setSortDate("");
    setFilterStatus("");
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Anda akan menghapus template survei ini secara permanen.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, Hapus Template",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(
          `${API_LINK}/TemplateSurvei/HardDeleteTemplateSurvei`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              p1: id,
            }),
          }
        );

        if (!response.ok) {
          const errorMessage = await response.text();
          console.error("Delete failed:", errorMessage);
          throw new Error("Gagal menghapus Template Survei.");
        }

        Swal.fire(
          "Berhasil",
          "Template Survei berhasil dihapus secara permanen.",
          "success"
        );

        await fetchTemplateSurvei();
      } catch (err) {
        console.error("Error during deletion:", err);
        Swal.fire(
          "Gagal",
          "Terjadi kesalahan saat menghapus Template Survei.",
          "error"
        );
      }
    } else {
      Swal.fire("Dibatalkan", "Template Survei tidak terhapus.", "info");
    }
  };

  const handleFinal = async (id) => {
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
            body: JSON.stringify({ p1: id }),
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
        await fetchTemplateSurvei();
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

      await fetchTemplateSurvei();
    } catch (err) {
      Swal.fire("Gagal", "Terjadi kesalahan saat mengganti status.", "error");
    }
  };

  if (loading) return <Loading />;

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
              onClick={() => onChangePage("add", {})}
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
                Status: item.status,
              }))}
              actions={(item) =>
                item.Status === "Draft"
                  ? ["Detail", "Edit", "Delete", "Preview", "Final"]
                  : item.Status === "Final"
                  ? ["Detail", "Preview"]
                  : item.Status === "Tidak Aktif"
                  ? ["Detail", "Preview"]
                  : []
              }
              onEdit={(item) => {
                onChangePage("edit", { idData: item.Key });
              }}
              onDelete={(item) => handleDelete(item.Key)}
              onFinal={(item) => handleFinal(item.Key)}
              onToggle={(item) => handleToggle(item.Key)}
              onDetail={(item) => onChangePage("detail", { idData: item.Key })}
              onPreview={(item) =>
                onChangePage("preview", { idData: item.Key })
              }
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
