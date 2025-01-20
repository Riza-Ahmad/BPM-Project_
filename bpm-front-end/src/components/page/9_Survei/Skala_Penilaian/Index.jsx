import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Table from "../../../part/Table";
import Paging from "../../../part/Paging";
import PageTitleNav from "../../../part/PageTitleNav";
import Button from "../../../part/Button";
import Loading from "../../../part/Loading";
import SearchField from "../../../part/SearchField";
import Filter from "../../../part/Filter";
import { useIsMobile } from "../../../util/useIsMobile";
import { API_LINK } from "../../../util/Constants";
import Swal from "sweetalert2";

const endpoints = {
  get: `${API_LINK}/SkalaPenilaian/GetSkalaPenilaian`,
  delete: `${API_LINK}/SkalaPenilaian/DeleteSkalaPenilaian`,
};

const config = {
  pageSize: 10,
  initialPage: 1,
  title: "Skala Penilaian",
};

const tableHeaders = ["No", "Tipe Skala", "Skala", "Deskripsi", "Status"];

export default function Index() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const [pageCurrent, setPageCurrent] = useState(config.initialPage);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [skalaData, setSkalaData] = useState([]);
  const [filterType, setFilterType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const applyFilters = (item) => {
    const searchRegex = new RegExp(searchQuery, "i");
    const matchesSearch =
      searchRegex.test(item.skp_tipe) ||
      searchRegex.test(item.skp_skala) ||
      searchRegex.test(item.skp_deskripsi) ||
      searchRegex.test(item.skp_status);

    const matchesType = filterType ? item.skp_tipe === filterType : true;
    const matchesStatus = filterStatus !== "" 
      ? item.skp_status.toString() === filterStatus 
      : item.skp_status === 1;

    return matchesSearch && matchesType && matchesStatus;
  };

  const getPageData = () => {
    const filteredData = skalaData.filter(applyFilters);
    const startIndex = (pageCurrent - 1) * config.pageSize;
    const endIndex = startIndex + config.pageSize;
    return {
      currentPageData: filteredData.slice(startIndex, endIndex),
      totalFilteredItems: filteredData.length
    };
  };

  const fetchSkala = async () => {
    setLoading(true);
    try {
      const response = await fetch(endpoints.get, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: null }),
      });

      if (!response.ok) throw new Error("Failed to fetch data");

      const result = await response.json();
      setSkalaData(result);
    } catch (error) {
      console.error("Fetch error:", error);
      Swal.fire("Error", "Failed to fetch data", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Confirm Deletion",
      text: "Are you sure you want to delete this item?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      const response = await fetch(endpoints.delete, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ p1: id, p2: "Admin" }),
      });

      if (!response.ok) throw new Error("Delete operation failed");

      Swal.fire("Success", "Item deleted successfully", "success");
      fetchSkala();
    } catch (error) {
      console.error("Delete error:", error);
      Swal.fire("Error", "Failed to delete item", "error");
    }
  };

  const handleNavigation = {
    toAdd: () => navigate("/survei/skala/add"),
    toDetail: (key) => navigate(`/survei/skala/detail/${key}`, { state: { detailData: key } }),
    toEdit: (key) => navigate(`/survei/skala/edit/${key}`, { state: { editData: key } }),
    toBeranda: () => navigate("/beranda"),
  };

  const handleResetFilter = () => {
    setFilterStatus("");
    setFilterType("");
    fetchSkala();
  };

  useEffect(() => {
    fetchSkala();
  }, []);

  if (loading) return <Loading />;

  const { currentPageData, totalFilteredItems } = getPageData();
  const activeData = filterStatus === "" ? skalaData.filter(item => item.skp_status === 1) : skalaData;
  const uniqueTypes = [...new Set(activeData.map(item => item.skp_tipe))];
  const marginStyle = { margin: isMobile ? "1rem" : "3rem" };

  return (
    <div className="d-flex flex-column min-vh-100">
      <main className="flex-grow-1" style={{ marginTop: "80px" }}>
        <div className="d-flex flex-column">
          <div className="mb-0" style={marginStyle}>
            <PageTitleNav
              title={config.title}
              breadcrumbs={[{ label: config.title }]}
              onClick={handleNavigation.toBeranda}
            />
          </div>

          <div className="p-3 mt-2 mb-0" style={marginStyle}>
            <Button
              iconName="add"
              classType="primary"
              label="Tambah Skala Penilaian"
              onClick={handleNavigation.toAdd}
            />

            <div className="row mt-5">
              <div className="col-lg-8 col-md-6">
                <SearchField
                  placeHolder="Cari data..."
                  value={searchQuery}
                  onChange={setSearchQuery}
                />
              </div>
              <div className="col-lg-4 col-md-6">
                <Filter>
                  <div>
                    <label htmlFor="filter-type" className="form-label">
                      Filter Tipe Skala:
                    </label>
                    <select
                      id="filter-type"
                      className="form-select"
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                    >
                      <option value="">Semua Tipe</option>
                      {uniqueTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div className="mt-3">
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

                  <button
                    className="btn btn-secondary mt-2"
                    onClick={handleResetFilter}
                  >
                    Reset Filter
                  </button>
                </Filter>
              </div>
            </div>
          </div>

          <div className="table-container bg-white p-3 mt-0 rounded" style={marginStyle}>
            <Table
              arrHeader={tableHeaders}
              data={currentPageData.map((item, index) => ({
                key: item.skp_id,
                No: (pageCurrent - 1) * config.pageSize + index + 1,
                "Tipe Skala": item.skp_tipe,
                Skala: item.skp_skala,
                Deskripsi: item.skp_deskripsi,
                Status: item.skp_status === 1 ? "Aktif" : "Tidak Aktif",
              }))}
              actions={(item) => {
                const actions = ["Detail", "Toggle"];
                if (item.Status === "Aktif") actions.push("Edit");
                return actions;
              }}
              onDetail={(item) => handleNavigation.toDetail(item.key)}
              onToggle={(item) => handleDelete(item.key)}
              onEdit={(item) => handleNavigation.toEdit(item.key)}
            />
            <Paging
              pageSize={config.pageSize}
              pageCurrent={pageCurrent}
              totalData={totalFilteredItems}
              navigation={setPageCurrent}
            />
          </div>
        </div>
      </main>
    </div>
  );
}