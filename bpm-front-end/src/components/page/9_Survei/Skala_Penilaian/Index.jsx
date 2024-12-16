import React, { useState, useRef, useEffect } from "react";
import Table from "../../../part/Table";
import Paging from "../../../part/Paging";
import PageTitleNav from "../../../part/PageTitleNav";
import Button from "../../../part/Button";
import { API_LINK } from "../../../util/Constants";
import Modal from "../../../part/Modal";
import Filter from "../../../part/Filter";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "../../../util/useIsMobile";
import Swal from "sweetalert2";

export default function Index() {
  const [pageSize] = useState(10);
  const [pageCurrent, setPageCurrent] = useState(1);
  const [selectedSkala, setSelectedSkala] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [Skala, setSkala] = useState([]);
  const [Detail, setDetail] = useState([]);
  const [filterType, setFilterType] = useState("");

  // const detailModalRef = useRef();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const handlePageNavigation = (page) => setPageCurrent(page);

  const filteredSkala = Skala.filter((item) => {
    const searchRegex = new RegExp(searchQuery, "i");
    const matchesQuery =
      searchRegex.test(item.skp_tipe) ||
      searchRegex.test(item.skp_skala) ||
      searchRegex.test(item.skp_deskripsi) ||
      searchRegex.test(item.skp_status) ||
      searchRegex.test(item.skp_created_by) ||
      searchRegex.test(item.skp_created_date) ||
      searchRegex.test(item.skp_modif_by) ||
      searchRegex.test(item.skp_modif_date);
    const matchesFilterType = filterType ? item.skp_tipe === filterType : true;
    return matchesQuery && matchesFilterType;
  });

  const currentData = filteredSkala.slice(
    (pageCurrent - 1) * pageSize,
    pageCurrent * pageSize
  );

  const openModal = (ref) => ref?.current?.open();
  const closeModal = (ref) => ref?.current?.close();

  const handleSelectSkala = (skala) => {
    navigate(`/survei/skala/edit/${skala.skp_id}`);
  };

  // const handleDetailSkala = (id) => {
  //   fetchSkalaById(id);
  //   openModal(detailModalRef);
  // };

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

  const fetchSkalaById = async (id) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_LINK}/SkalaPenilaian/GetDataSkalaPenilaianById`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ p1: id }),
        }
      );

      if (!response.ok) throw new Error("Gagal mengambil data skala.");

      const result = await response.json();
      console.log(result);
      setDetail(result[0]);
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
    // Menyiapkan parameter sesuai stored procedure
    const parameters = {
      p1: id, // ID Skala yang akan dihapus
      p2: "Admin", // User yang melakukan modifikasi
    };

    // Menampilkan konfirmasi menggunakan SweetAlert
    const confirm = await Swal.fire({
      title: "Konfirmasi",
      text: "Apakah Anda yakin ingin menghapus Skala Penilaian ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal",
    });

    // Jika user menekan tombol konfirmasi
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

        // Memperbarui data setelah penghapusan
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
                  {[...new Set(Skala.map((item) => item.skp_tipe))].map(
                    (option) => (
                      <div key={option} className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="filterSkala"
                          id={`filter-${option}`}
                          value={option}
                          checked={filterType === option}
                          onChange={(e) => setFilterType(e.target.value)}
                        />
                        <label
                          className="form-check-label"
                          htmlFor={`filter-${option}`}
                        >
                          {option}
                        </label>
                      </div>
                    )
                  )}
                  <div className="mt-3">
                    <button
                      className="btn btn-secondary"
                      onClick={() => setFilterType("")}
                    >
                      Reset Filter
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
                Status: item.skp_status === "1" ? "Tidak Aktif" : " Aktif",
              }))}
              actions={["Detail", "Toggle", "Edit"]}
              onDetail={(item) => {
                handleDetailSkala(item.key);
              }}
              onToggle={(item) => {
                handleDelete(item.key);
              }}
              onEdit={(id) =>
                handleSelectSkala(
                  filteredSkala.find((item) => item.skp_id === id)
                )
              }
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

      {/* DETAIL MODAL */}
      <Modal
        ref={detailModalRef}
        title="Detail Skala Penilaian"
        size="medium"
        Button1={
          <Button label="Tutup" onClick={() => closeModal(detailModalRef)} />
        }
      >
        <p>
          <strong>ID:</strong> {Detail.skp_id}
        </p>
        <p>
          <strong>Tipe Skala:</strong> {Detail.skp_tipe}
        </p>
        <p>
          <strong>Skala:</strong> {Detail.skp_skala}
        </p>
        <p>
          <strong>Deskripsi:</strong> {Detail.skp_deskripsi}
        </p>
        <p>
          <strong>Status:</strong> {Detail.skp_status}
        </p>
        <p>
          <strong>Created By:</strong> {Detail.skp_created_by}
        </p>
        <p>
          <strong>Created Date:</strong> {Detail.skp_created_date}
        </p>
        <p>
          <strong>Modified By:</strong> {Detail.skp_modif_by}
        </p>
        <p>
          <strong>Modified Date:</strong> {Detail.skp_modif_date}
        </p>
      </Modal>
    </div>
  );
}
