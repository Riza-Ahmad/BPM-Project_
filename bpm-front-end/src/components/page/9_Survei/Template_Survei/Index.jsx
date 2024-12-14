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
            method: "POST", // Jika GET lebih sesuai, ganti method di sini.
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({}), // Kirimkan body kosong jika backend membutuhkan struktur JSON.
          }
        );

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();

        // Pastikan response adalah array atau lakukan parsing sesuai kebutuhan.
        const templates = Array.isArray(result) ? result : JSON.parse(result);

        // Map data ke dalam format yang sesuai dengan kebutuhan frontend.
        const formattedTemplates = templates.map((item) => ({
          id: item.tsu_id || "default_id",
          name: item.tsu_nama || "default_name",
          finalDate: item.tsu_modif_date
            ? new Date(item.tsu_modif_date).toLocaleDateString()
            : "-",
          status: item.tsu_status,
        }));

        // Update state dengan data yang diformat.
        setData(formattedTemplates);
        setFilteredData(formattedTemplates);
      } catch (error) {
        console.error("Fetch error:", error);

        // Tampilkan pesan error menggunakan Swal.
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: error.message || "Gagal mengambil data template survei!",
        });
      } finally {
        setLoading(false); // Hentikan loading setelah selesai.
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

  // Handle Update Status to Final
  const handleUpdateStatus = async (id) => {
    // Mencari template dengan ID yang sesuai di data
    const templateToUpdate = data.find((item) => item.id === id);

    // Jika template tidak ditemukan atau statusnya sudah Final, tampilkan error
    if (!templateToUpdate) {
      Swal.fire("Error", "Template tidak ditemukan!", "error");
      return;
    }

    if (templateToUpdate.status === 1) {
      Swal.fire("Info", "Template ini sudah Final.", "info");
      return;
    }

    // Validasi: Periksa apakah template bisa diubah statusnya
    // Misalnya, hanya template dengan status Draft yang bisa diubah menjadi Final
    if (templateToUpdate.status !== 0) {
      Swal.fire(
        "Error",
        "Hanya template dengan status Draft yang bisa diubah menjadi Final.",
        "error"
      );
      return;
    }

    // Lanjutkan untuk mengupdate status jika semua validasi lolos
    try {
      const response = await fetch(
        `${API_LINK}/TemplateSurvei/UpdateTemplateSurveiStatus`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tsu_id: id, // ID Template Survei yang akan diubah
            tsu_status: 1, // Status 1 = Final
            tsu_modif_by: "retno.widiastuti", // Ganti dengan user login saat ini
            tsu_modif_date: new Date().toISOString(), // Waktu sekarang dalam format ISO
          }),
        }
      );

      if (!response.ok)
        throw new Error("Gagal memperbarui status template survei");

      // Setelah berhasil memperbarui status, update data di frontend
      const updatedData = data.map((item) =>
        item.id === id
          ? { ...item, status: 1 } // Status diperbarui ke 1 (Final)
          : item
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

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Template survei ini akan dihapus secara permanen.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(
            `${API_LINK}/TemplateSurvei/DeleteTemplateSurvei`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ tsu_id: id }),
            }
          );

          if (!response.ok) throw new Error("Gagal menghapus template survei");

          const updatedData = data.filter((item) => item.id !== id);
          setData(updatedData);
          setFilteredData(updatedData);

          Swal.fire(
            "Berhasil!",
            "Template survei berhasil dihapus.",
            "success"
          );
        } catch (error) {
          Swal.fire(
            "Gagal!",
            "Tidak dapat menghapus template survei.",
            "error"
          );
        }
      }
    });
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
              onClick={() => navigate("/survei/template/add")}
            />

            <div className="row mt-5">
              <div className="col-lg-11 col-md-6">
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
                status: item.status === 0 ? "Draft" : "Final", // Konversi status integer menjadi string
              }))}
              actions={(id) => {
                const item = filteredData.find(
                  (dataItem) => dataItem.id === id
                );

                // Tampilkan hanya Detail dan Edit jika status adalah Final
                if (item && item.status === 1) {
                  return ["Detail", "Edit"];
                }

                // Jika status bukan Final, tampilkan semua aksi
                return ["Detail", "Edit", "Delete", "Final"];
              }}
              onEdit={(id) => navigate(`/survei/template/edit/${id}`)}
              onDelete={(id) => handleDelete(id)}
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
