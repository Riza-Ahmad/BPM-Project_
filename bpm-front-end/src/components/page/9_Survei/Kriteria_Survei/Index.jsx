import React, { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import Table from "../../../part/Table";
import Paging from "../../../part/Paging";
import PageTitleNav from "../../../part/PageTitleNav";
import Button from "../../../part/Button";
import Loading from "../../../part/Loading";
import SearchField from "../../../part/SearchField";
import Filter from "../../../part/Filter";
import Modal from "../../../part/Modal"; 
import TextField from "../../../part/TextField";
import { API_LINK } from "../../../util/Constants";
import { useIsMobile } from "../../../util/useIsMobile";

export default function KriteriaSurvei({ onChangePage }) {
  const [pageSize] = useState(10);
  const isMobile = useIsMobile();
  const [pageCurrent, setPageCurrent] = useState(1);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // State untuk modal
  const [selectedData, setSelectedData] = useState(null);
  const [modalType, setModalType] = useState(""); // "add", "edit", "detail"
  const modalRef = useRef();

  useEffect(() => {
    const fetchKriteria = async () => {
      try {
        const response = await fetch(
          `${API_LINK}/MasterKriteriaSurvei/GetDataKriteriaSurvei`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ page: 1, pageSize: 100 }),
          }
        );

        if (!response.ok) throw new Error("Gagal mengambil data kriteria");

        const result = await response.json();

        const groupedKriteria = result.map((item) => ({
          id: item.ksr_id,
          name: item.ksr_nama,
        }));

        setData(groupedKriteria);
      } catch (err) {
        console.error("Fetch error:", err);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Gagal mengambil data kriteria!",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchKriteria();
  }, []);

  const indexOfLastData = pageCurrent * pageSize;
  const indexOfFirstData = indexOfLastData - pageSize;
  const currentData = data.slice(indexOfFirstData, indexOfLastData);

  const handlePageNavigation = (page) => {
    setPageCurrent(page);
  };

  const handleOpenModal = (type, data = null) => {
    setModalType(type);
    setSelectedData(data);
    modalRef.current.open();
  };

  const handleSave = async () => {
    const formData = new FormData(modalRef.current); // Mengambil data dari form modal.
    const payload = Object.fromEntries(formData.entries()); // Ubah FormData ke objek.
    const apiUrl =
      modalType === "add"
        ? `${API_LINK}/MasterKriteriaSurvei/CreateKriteriaSurvei`
        : `${API_LINK}/MasterKriteriaSurvei/EditKriteriaSurvei`;

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          modalType === "edit"
            ? { ...payload, id: selectedData.id } // Tambahkan ID jika edit
            : payload
        ),
      });

      if (!response.ok) {
        throw new Error(
          modalType === "add" ? "Gagal menambah data!" : "Gagal mengedit data!"
        );
      }

      const result = await response.json();

      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text:
          modalType === "add"
            ? "Data berhasil ditambahkan!"
            : "Data berhasil diperbarui!",
      });

      // Update data setelah operasi berhasil
      setData((prevData) =>
        modalType === "add"
          ? [...prevData, result] // Tambah data baru
          : prevData.map((item) =>
              item.id === selectedData.id ? result : item // Update data yang diubah
            )
      );

      modalRef.current.close(); // Tutup modal.
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Terjadi kesalahan!",
      });
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="d-flex flex-column min-vh-100">
      <main className="flex-grow-1 p-3" style={{ marginTop: "80px" }}>
        <PageTitleNav
          title="Kriteria Survei"
          breadcrumbs={[{ label: "Kriteria Survei" }]}
          onClick={() => onChangePage("index")}
        />

        <div className={isMobile ? "p-2 m-2 mt-2 mb-2" : "p-3 m-5 mt-2 mb-4"}>
          <div style={{ marginBottom: "16px" }}>
            <Button
              iconName="add"
              classType="primary"
              label="Tambah Kriteria"
              onClick={() => handleOpenModal("add")}
            />
          </div>
            <div className="row mt-5">
              <div className="col-lg-11 col-md-6 ">
                <SearchField></SearchField>
              </div>
              <div className="col-lg-1 col-md-6 ">
                <Filter></Filter>
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
            arrHeader={["No", "Nama Kriteria"]}
            headerToDataMap={{
              No: "No",
              "Nama Kriteria": "name",
            }}
            data={currentData.map((item, index) => ({
              Key: item.id,
              No: indexOfFirstData + index + 1,
              name: item.name,
            }))}
            actions={["Edit", "Detail"]}
            onEdit={(id) => {
              const selected = data.find((item) => item.id === id);
              handleOpenModal("edit", selected);
            }}
            onDetail={(id) => {
              const selected = data.find((item) => item.id === id);
              handleOpenModal("detail", selected);
            }}
          />
          <Paging
            pageSize={pageSize}
            pageCurrent={pageCurrent}
            totalData={data.length}
            navigation={handlePageNavigation}
          />
        </div>
      </main>

      {/* Modal Tambah Kriteria */}
      {modalType === "add" && (
        <Modal
          ref={modalRef}
          title="Tambah Kriteria"
          size="medium"
          Button1={
            <Button classType="primary" label="Tambah" onClick={handleSave} />
          }
          Button2={
            <Button
              classType="secondary"
              label="Tutup"
              onClick={() => modalRef.current.close()}
            />
          }
        >
          <div>
          <TextField isRequired={true}></TextField>
          </div>
        </Modal>
      )}

      {/* Modal Edit Kriteria */}
      {modalType === "edit" && (
        <Modal
          ref={modalRef}
          title="Edit Kriteria"
          size="medium"
          Button1={
            <Button classType="primary" label="Simpan" onClick={handleSave} />
          }
          Button2={
            <Button
              classType="secondary"
              label="Tutup"
              onClick={() => modalRef.current.close()}
            />
          }
        >
          <div>
            <label>Nama Kriteria</label>
            <input
              type="text"
              className="form-control"
              value={selectedData?.name || ""}
              onChange={(e) =>
                setSelectedData({ ...selectedData, name: e.target.value })
              }
            />
          </div>
        </Modal>
      )}

      {/* Modal Detail Kriteria */}
      {modalType === "detail" && (
        <Modal
          ref={modalRef}
          title="Detail Kriteria"
          size="medium"
          Button2={
            <Button
              classType="secondary"
              label="Tutup"
              onClick={() => modalRef.current.close()}
            />
          }
        >
          <div>
            <p>
              <strong>Nama Kriteria:</strong> {selectedData?.name}
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
}
