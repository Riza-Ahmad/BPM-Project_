import React, { useState, useEffect, useRef } from "react";
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
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [selectedYear, setSelectedYear] = useState(""); // State for selected year
  const [selectedStatus, setSelectedStatus] = useState(""); // State for selected status
  const navigate = useNavigate();

  // State untuk modal
  const [selectedData, setSelectedData] = useState(null);
  const [modalType, setModalType] = useState(""); // "add", "edit", "detail"
  const modalRef = useRef();

  useEffect(() => {
    const fetchTemplateSurvei = async () => {
      try {
        const response = await fetch(
          `${API_LINK}/MasterTemplateSurvei/GetDataTemplateSurvei`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ page: 1, pageSize: 100 }),
          }
        );

        if (!response.ok)
          throw new Error("Gagal mengambil data template survei");

        const result = await response.json();

        const formattedTemplates = result.map((item) => ({
          id: item.template_id,
          name: item.template_name,
          finalDate: item.template_final_date || "-",
          status: item.template_status || "Draft",
        }));

        setData(formattedTemplates);
        setFilteredData(formattedTemplates); // Set initial filtered data
      } catch (err) {
        console.error("Fetch error:", err);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Gagal mengambil data template survei!",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTemplateSurvei();
  }, []);

  // Handle search and filter
  const handleSearchChange = (query) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (year, status) => {
    setSelectedYear(year);
    setSelectedStatus(status);
  };

  // Filter data based on search, year, and status
  useEffect(() => {
    let filtered = [...data];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply year filter
    if (selectedYear) {
      filtered = filtered.filter((item) =>
        item.finalDate.includes(selectedYear)
      );
    }

    // Apply status filter
    if (selectedStatus) {
      filtered = filtered.filter((item) => item.status === selectedStatus);
    }

    setFilteredData(filtered);
  }, [searchQuery, selectedYear, selectedStatus, data]);

  const indexOfLastData = pageCurrent * pageSize;
  const indexOfFirstData = indexOfLastData - pageSize;
  const currentData = filteredData.slice(indexOfFirstData, indexOfLastData);

  const handlePageNavigation = (page) => {
    setPageCurrent(page);
  };

  const handleOpenModal = (type, data = null) => {
    setModalType(type);
    setSelectedData(data);
    modalRef.current.open();
  };

  if (loading) return <Loading />;

  return (
    <div className="d-flex flex-column min-vh-100">
      <main className="flex-grow-1 p-3" style={{ marginTop: "80px" }}>
        <div className="d-flex flex-column">
          {/* Section for Page Title and Navigation */}
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

          {/* Section for Add Button */}
          <div
            className={isMobile ? "p-2 m-2 mt-2 mb-0" : "p-3 m-5 mt-2 mb-0"}
            style={{ marginLeft: "50px" }}
          >
            <Button
              iconName="add"
              classType="primary"
              label="Tambah Kriteria"
              onClick={() => navigate("/survei/template/add")}
            />
          </div>

          {/* Section for Search and Filter */}
          <div className="row mt-5">
            <div className="col-lg-10 col-md-6">
              <SearchField onSearchChange={handleSearchChange} />
            </div>
            <div className="col-lg-1 col-md-6">
              <Filter
                onChange={handleFilterChange}
                selectedYear={selectedYear}
                selectedStatus={selectedStatus}
              />
            </div>
          </div>

          {/* Section for Table */}
          <div
            className={
              isMobile
                ? "table-container bg-white p-2 m-2 rounded"
                : "table-container bg-white p-3 m-5 rounded"
            }
          >
            <Table
              arrHeader={["No", "Nama Template", "Tanggal Final", "Status"]}
              headerToDataMap={{
                No: "No",
                "Nama Template": "name",
                "Tanggal Final": "finalDate",
                Status: "status",
              }}
              data={currentData.map((item, index) => ({
                key: item.id,
                No: indexOfFirstData + index + 1,
                name: item.name,
                finalDate: item.finalDate,
                status: item.status,
              }))}
              actions={["Detail", "Edit", "Hapus"]}
              onEdit={(id) => {
                navigate(`/survei/template/edit/${id}`);
              }}
              onDetail={(id) => {
                const selected = data.find((item) => item.id === id);
                handleOpenModal("detail", selected);
              }}
              onDelete={(id) => {
                Swal.fire({
                  title: "Apakah anda yakin?",
                  text: "Data ini akan dihapus secara permanen!",
                  icon: "warning",
                  showCancelButton: true,
                  confirmButtonColor: "#3085d6",
                  cancelButtonColor: "#d33",
                  confirmButtonText: "Ya, hapus!",
                }).then((result) => {
                  if (result.isConfirmed) {
                    const newData = data.filter((item) => item.id !== id);
                    setData(newData);
                    Swal.fire(
                      "Terhapus!",
                      "Data template survei berhasil dihapus.",
                      "success"
                    );
                  }
                });
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
