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

export default function Template_Survei() {
  const [pageSize] = useState(10);
  const isMobile = useIsMobile();
  const [pageCurrent, setPageCurrent] = useState(1);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
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
          }
        );

        if (!response.ok)
          throw new Error("Gagal mengambil data template survei");

        const result = await response.json();
        //const templates = JSON.parse(result);

        const formattedTemplates = result.map((item) => ({
          id: item.tsu_id || "default_id",
          name: item.tsu_nama || "default_name",
          finalDate: item.tsu_modif_date || "-",
          status: item.tsu_status || "Draft",
        }));

        setData(formattedTemplates);
        setFilteredData(formattedTemplates);
      } catch (error) {
        console.error("Fetch error:", error);
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

  // Handle search and filters
  const handleSearchChange = (query) => setSearchQuery(query);
  const handleFilterChange = (year, status) => {
    setSelectedYear(year);
    setSelectedStatus(status);
  };

  // Filter data
  useEffect(() => {
    let filtered = [...data];

    if (searchQuery) {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedYear) {
      filtered = filtered.filter((item) =>
        item.finalDate.includes(selectedYear)
      );
    }

    if (selectedStatus) {
      filtered = filtered.filter((item) => item.status === selectedStatus);
    }

    setFilteredData(filtered);
  }, [searchQuery, selectedYear, selectedStatus, data]);

  const indexOfLastData = pageCurrent * pageSize;
  const indexOfFirstData = indexOfLastData - pageSize;
  const currentData = filteredData.slice(indexOfFirstData, indexOfLastData);

  const handlePageNavigation = (page) => setPageCurrent(page);

  // Update template status
  const handleUpdateStatus = async (id) => {
    try {
      const response = await fetch(
        `${API_LINK}/TemplateSurvei/UpdateTemplateSurveiStatus`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tsu_id: id,
            tsu_status: "Final", // Set new status
          }),
        }
      );

      if (!response.ok)
        throw new Error("Gagal memperbarui status template survei");

      const updatedData = data.map((item) =>
        item.id === id ? { ...item, status: "Final" } : item
      );

      setData(updatedData);
      setFilteredData(updatedData);

      Swal.fire(
        "Berhasil!",
        "Status template survei berhasil diperbarui.",
        "success"
      );
    } catch (error) {
      console.error("Update error:", error);
      Swal.fire(
        "Gagal!",
        "Tidak dapat memperbarui status template survei.",
        "error"
      );
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

          <div className={isMobile ? "p-2 m-2 mt-2 mb-0" : "p-3 m-5 mt-2 mb-0"}>
            <Button
              iconName="add"
              classType="primary"
              label="Tambah Kriteria"
              onClick={() => navigate("/survei/template/add")}
            />

            <div className="row mt-5">
              <div className="col-lg-10 col-md-6">
                <SearchField onSearchChange={handleSearchChange} />
              </div>
              <div className="col-lg-2 col-md-6">
                <Filter
                  onChange={handleFilterChange}
                  selectedYear={selectedYear}
                  selectedStatus={selectedStatus}
                />
              </div>
            </div>
          </div>

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
              actions={["Detail", "Edit", "Hapus", "Final"]}
              onEdit={(id) => navigate(`/survei/template/edit/${id}`)}
              onDelete={(id) => {
                // Implement delete logic here
              }}
              onFinal={(id) => handleUpdateStatus(id)}
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
