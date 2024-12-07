import React, { useState, useRef, useEffect } from "react";
import Table from "../../../part/Table";
import Paging from "../../../part/Paging";
import PageTitleNav from "../../../part/PageTitleNav";
import Button from "../../../part/Button";
import { API_LINK } from "../../../util/Constants";
import TextField from "../../../part/TextField";
import Modal from "../../../part/Modal";
import Filter from "../../../part/Filter";
import SearchField from "../../../part/SearchField";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "../../../util/useIsMobile";

export default function Index() {
  const [pageSize] = useState(10);
  const [pageCurrent, setPageCurrent] = useState(1);
  const [selectedSkala, setSelectedSkala] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [filterScale, setFilterScale] = useState(""); // "" untuk semua skala

  const [Skala, setSkala] = useState([
    { id: 1, Nama: "Radio Button", Skala: 2, Deskripsi: "Cukup, Baik" },
    { id: 2, Nama: "Text Area", Skala: 1, Deskripsi: "1" },
    {
      id: 3,
      Nama: "Radio Button",
      Skala: 3,
      Deskripsi: "Cukup, Baik, Sangat Baik",
    },
    { id: 4, Nama: "Check Box", Skala: 1, Deskripsi: "MI" },
    {
      id: 5,
      Nama: "Radio Button",
      Skala: 4,
      Deskripsi: "Kurang Baik, Cukup, Baik, Sangat Baik",
    },
  ]);

  const [formData, setFormData] = useState({
    name: "",
    type: "",
    scale: 1,
    descriptions: [],
  });

  const addModalRef = useRef();
  const updateModalRef = useRef();
  const detailModalRef = useRef();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const handlePageNavigation = (page) => setPageCurrent(page);
  const filteredSkala = Skala.filter((item) => {
    const matchesQuery = item.Nama.toLowerCase().includes(
      searchQuery.toLowerCase()
    );
    const matchesScale = filterScale
      ? item.Skala === Number(filterScale)
      : true;
    return matchesQuery && matchesScale;
  });

  const currentData = filteredSkala.slice(
    (pageCurrent - 1) * pageSize,
    pageCurrent * pageSize
  );

  const openModal = (ref) => ref?.current?.open();
  const closeModal = (ref) => ref?.current?.close();

  const resetFormData = () => {
    setFormData({ name: "", type: "", scale: 1, descriptions: [] });
  };

  const handleUpdateSkala = () => {
    if (!selectedSkala || !formData.type.trim() || !formData.name.trim()) {
      alert("Mohon isi semua data sebelum menyimpan.");
      return;
    }

    setSkala((prev) =>
      prev.map((item) =>
        item.id === selectedSkala.id
          ? {
              ...item,
              Nama: formData.type,
              Skala: formData.scale || 1,
              Deskripsi: (formData.descriptions || []).join(", "),
            }
          : item
      )
    );

    resetFormData();
    closeModal(updateModalRef);
    setSelectedSkala(null);
  };

  // Fungsi pencarian tombol search
  const handleSearch = () => {
    const filtered = Skala.filter((item) =>
      item.Nama.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (filtered.length === 0) {
      alert("Tidak ditemukan hasil untuk kata kunci tersebut.");
      return;
    }
  };

  const handleSelectSkala = (skala) => {
    navigate(`/survei/skala/edit/`); // Navigasi ke halaman Edit dengan ID skala
  };

  const handleDetailSkala = (skala) => {
    setSelectedSkala(skala);
    openModal(detailModalRef);
  };

  const title = "Skala Penilaian";
  const breadcrumbs = [{ label: "Skala Penilaian" }];

  useEffect(() => {
    const fetchSkala = async () => {
      try {
        const response = await fetch(
          `${API_LINK}/SkalaPenilaian/GetDataSkalaPenilaianById`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ page: 1, pageSize: 100 }),
          }
        );

        if (!response.ok) throw new Error("Gagal mengambil data skala.");

        const result = await response.json();

        // Proses data skala jika diperlukan
        const formattedSkala = result.map((item) => ({
          id: item.skala_id,
          name: item.skala_nama,
          type: item.skala_tipe,
        }));

        setSkalaData(formattedSkala);
      } catch (err) {
        console.error("Fetch error:", err);
        alert("Gagal mengambil data skala.");
      } finally {
        setLoading(false);
      }
    };

    fetchSkala();
  }, []);

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
              <div className="col-lg-10 col-md-6">
                <SearchField
                  placeholder="Cari Tipe Skala..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="col-lg-2 col-md-6">
                <Filter />
              </div>
            </div>
          </div>
          <div
            className="table-container bg-white p-3 mt-0 rounded"
            style={{ margin: isMobile ? "1rem" : "3rem" }}
          >
            <Table
              arrHeader={[
                "No",
                "Tipe Skala",
                "Skala",
                "Deskripsi Nilai (Terendah - Tertinggi)",
              ]}
              headerToDataMap={{
                No: "No",
                "Tipe Skala": "Nama",
                Skala: "Skala",
                "Deskripsi Nilai (Terendah - Tertinggi)": "Deskripsi",
              }}
              data={currentData.map((item, index) => ({
                key: item.id,
                No: (pageCurrent - 1) * pageSize + index + 1,
                Nama: item.Nama,
                Skala: item.Skala,
                Deskripsi: item.Deskripsi,
              }))}
              actions={["Detail", "Edit"]}
              onDetail={(id) =>
                handleDetailSkala(Skala.find((item) => item.id === id))
              }
              onEdit={(id) =>
                handleSelectSkala(Skala.find((item) => item.id === id))
              }
            />

            <div className="row mt-5"></div>
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
          <Button
            label="Tutup"
            onClick={() => detailModalRef.current.close()}
          />
        }
      >
        <p>
          <strong>Tipe Skala:</strong> {selectedSkala?.Nama}
        </p>
        <p>
          <strong>Skala:</strong> {selectedSkala?.Skala}
        </p>
        <p>
          <strong>Deskripsi:</strong> {selectedSkala?.Deskripsi}
        </p>
      </Modal>
    </div>
  );
}
