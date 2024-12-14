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
  const [loading, setLoading] = useState(false);

  const [Skala, setSkala] = useState([]);

  const detailModalRef = useRef();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const handlePageNavigation = (page) => setPageCurrent(page);
  const filteredSkala = Skala.filter((item) => {
    const matchesQuery =
      item.skp_tipe &&
      item.skp_tipe.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesQuery;
  });

  const currentData = filteredSkala.slice(
    (pageCurrent - 1) * pageSize,
    pageCurrent * pageSize
  );

  const openModal = (ref) => ref?.current?.open();
  const closeModal = (ref) => ref?.current?.close();

  const handleSelectSkala = (skala) => {
    navigate(`/survei/skala/edit/${skala.skp_id}`); // Navigasi ke halaman Edit dengan ID skala
  };

  const handleDetailSkala = (skala) => {
    setSelectedSkala(skala);
    openModal(detailModalRef);
  };

  const title = "Skala Penilaian";
  const breadcrumbs = [{ label: "Skala Penilaian" }];

  useEffect(() => {
    const fetchSkala = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${API_LINK}/SkalaPenilaian/GetSkalaPenilaian`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({}), // Jika diperlukan parameter, tambahkan di sini
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
            </div>
          </div>
          <div
            className="table-container bg-white p-3 mt-0 rounded"
            style={{ margin: isMobile ? "1rem" : "3rem" }}
          >
            <Table
              arrHeader={["No", "Tipe Skala", "Skala", "Deskripsi"]}
              headerToDataMap={{
                No: "No",
                "Tipe Skala": "skp_tipe",
                Skala: "skp_skala",
                Deskripsi: "skp_deskripsi",
              }}
              data={Skala.map((item, index) => ({
                key: item.skp_id,
                No: (pageCurrent - 1) * pageSize + index + 1,
                skp_tipe: item.skp_tipe,
                skp_skala: item.skp_skala,
                skp_deskripsi: item.skp_deskripsi,
              }))}
              actions={["Detail", "Edit"]}
              onDetail={(id) =>
                handleDetailSkala(Skala.find((item) => item.skp_id === id))
              }
              onEdit={(id) =>
                handleSelectSkala(Skala.find((item) => item.skp_id === id))
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
          <Button
            label="Tutup"
            onClick={() => detailModalRef.current.close()}
          />
        }
      >
        <p>
          <strong>Tipe Skala:</strong> {selectedSkala?.skp_tipe}
        </p>
        <p>
          <strong>Skala:</strong> {selectedSkala?.skp_skala}
        </p>
        <p>
          <strong>Deskripsi:</strong> {selectedSkala?.skp_deskripsi}
        </p>
      </Modal>
    </div>
  );
}
