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
  const [Loading, setLoading] = useState("");

  const [filterScale, setFilterScale] = useState(""); // "" untuk semua skala

  const [Skala, setSkala] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    type: "",
    scale: 1,
    descriptions: [],
  });

  const detailModalRef = useRef();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const handlePageNavigation = (page) => setPageCurrent(page);
  const filteredSkala = Skala.filter((item) => {
    const matchesQuery =
      item.Nama && item.Nama.toLowerCase().includes(searchQuery.toLowerCase());
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

  const handleSelectSkala = (id) => {
    navigate(`/survei/skala/edit/${2}`); // Mengirimkan ID skala ke URL
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
          `${API_LINK}/SkalaPenilaian/GetSkalaPenilaian`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
          }
        );

        if (!response.ok) throw new Error("Gagal mengambil data skala.");

        const result = await response.json();
        const formattedSkala = result.map((item) => ({
          id: item.skp_id || "default_id",
          name: item.skp_skala || "default_name",
          type: item.skp_tipe || "default_type",
          descriptions: item.skp_deskripsi || "default_type",
        }));
        console.log(formattedSkala);

        setSkala(formattedSkala);
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
                  placeholder="Cari Skala Penilaian..."
                  value={searchQuery}
                  onChange={(e) => {
                    const query = e.target.value.toLowerCase();
                    setSearchQuery(query);

                    // Perbarui data filter secara dinamis berdasarkan skala
                    const filteredData = Skala.filter(
                      (item) => item.type.toLowerCase().includes(query) // Filter berdasarkan skala
                    );
                    setFilterScale(filteredData); // Update hasil filter
                  }}
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
              data={Skala.map((item, index) => ({
                key: item.id,
                No: (pageCurrent - 1) * pageSize + index + 1,
                Skala: item.name,
                Nama: item.type,
                Deskripsi: item.descriptions,
              }))}
              actions={["Detail", "Edit"]}
              onDetail={(id) =>
                handleDetailSkala(Skala.find((item) => item.id === id))
              }
              onEdit={
                (id) => handleSelectSkala(id) // Kirimkan ID saja
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
