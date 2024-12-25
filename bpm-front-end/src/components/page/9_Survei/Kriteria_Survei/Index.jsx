import React, { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import Table from "../../../part/Table";
import Paging from "../../../part/Paging";
import PageTitleNav from "../../../part/PageTitleNav";
import Button from "../../../part/Button";
import InputField from "../../../part/InputField";
import Loading from "../../../part/Loading";
import SearchField from "../../../part/SearchField";
import Filter from "../../../part/Filter";
import Modal from "../../../part/Modal";

import { API_LINK } from "../../../util/Constants";
import { useIsMobile } from "../../../util/useIsMobile";

export default function KriteriaSurvei({ onChangePage }) {
  const [pageSize] = useState(10);
  const isMobile = useIsMobile();
  const [pageCurrent, setPageCurrent] = useState(1);
  const [data, setData] = useState([]);
  const [selectedKriteria, setSelectedKriteria] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false); // Untuk indikator loading
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [allData, setAllData] = useState([]); // Data asli dari API
  const addModalRef = useRef();
  const editModalRef = useRef();
  const detailModalRef = useRef();

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const [formData, setFormData] = useState({
    ksr_id: "",
    ksr_nama: "",
    ksr_status: "",
    ksr_created_by: "",
    ksr_created_date: "",
    ksr_modif_by: "",
    ksr_modif_date: "",
  });

  const handleInputChange = (e) => {
    const { ksr_nama, value } = e.target;
    setFormData({ ...formData, [ksr_nama]: value });
  };

  const [editFormData, setEditFormData] = useState({
    ksr_id: "",
    ksr_nama: "",
    ksr_status: "",
    ksr_created_by: "",
    ksr_created_date: "",
    ksr_modif_by: "",
    ksr_modif_date: "",
  });

  const nama_layananRef = useRef();

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
          nama: item.ksr_nama,
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

  const handleAddKriteria = async () => {
    const newKriteria = {
      ksr_nama: formData.ksr_nama?.trim() || "",
      ksr_created_by: formData.ksr_created_by || "Admin", // Berikan default jika kosong
      ksr_created_date: formData.ksr_created_date || new Date().toISOString(), // Format ISO 8601
    };

    try {
      // Kirim data ke backend
      const response = await fetch(
        `${API_LINK}/MasterKriteriaSurvei/CreateKriteriaSurvei`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json", // Pastikan tipe konten JSON
          },
          body: JSON.stringify(newKriteria), // Konversi data ke JSON string
        }
      );

      // Debug: Tampilkan status response
      console.log("Response status:", response.status);

      // Periksa apakah response sukses
      if (response.ok) {
        const result = await response.json();

        // Debug: Tampilkan hasil dari backend
        console.log("Hasil dari backend:", result);

        // Tambahkan data baru ke state
        setData((prevData) => [...prevData, result]);

        // Reset form setelah submit
        setFormData({
          ksr_nama: "",
          ksr_created_by: "",
          ksr_created_date: "",
        });

        // Tutup modal
        addModalRef.current.close();

        // Berikan notifikasi sukses
        alert("Kriteria berhasil ditambahkan!");
      } else {
        // Backend merespon dengan status error
        const error = await response.json();
        alert(`Gagal menambahkan kriteria: ${error.message}`);
      }
    } catch (error) {
      // Tangkap error koneksi atau lainnya
      alert(`Terjadi kesalahan: ${error.message}`);
    }
  };

  const handleSaveEdit = async () => {
    try {
      const response = await fetch(
        `${API_LINK}/MasterKriteriaSurvei/EditKriteriaSurvei`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editFormData),
        }
      );

      if (!response.ok) {
        throw new Error("Gagal menyimpan perubahan.");
      }

      alert("Data berhasil diperbarui.");
      editModalRef.current.close(); // Tutup modal edit
      fetchData(); // Refresh data tabel
    } catch (error) {
      console.error("Error saving edited data:", error);
      alert("Terjadi kesalahan saat menyimpan perubahan.");
    }
  };

  // const handleEdit = async (id) => {
  //   try {
  //     const response = await fetch(`${API_LINK}/MasterKriteriaSurvei/GetDataKriteriaSurvei?id=${id}`);
  //     if (!response.ok) {
  //       throw new Error("Gagal mengambil data untuk di-edit.");
  //     }
  //     const data = await response.json();
  //     setEditFormData(data); // Simpan data ke state
  //     editModalRef.current.open(); // Buka modal edit
  //   } catch (error) {
  //     console.error("Error fetching data for edit:", error);
  //     alert("Terjadi kesalahan saat memuat data untuk di-edit.");
  //   }
  // };

  // const handleEdit = async (id) => {
  //   try {
  //     console.log("Fetching data for edit with ID:", id); // Debugging log
  //     const response = await fetch(`${API_LINK}/MasterKriteriaSurvei/GetDataKriteriaSurveiById?id=${id}`);
  //     if (!response.ok) {
  //       throw new Error("Gagal mengambil data untuk di-edit.");
  //     }

  //     const data = await response.json();
  //     console.log("Data fetched for edit:", data); // Debugging log

  //     setEditFormData(data); // Simpan data ke state form edit
  //     editModalRef.current.open(); // Buka modal edit
  //   } catch (error) {
  //     console.error("Error fetching data for edit:", error);
  //     alert("Terjadi kesalahan saat memuat data untuk di-edit.");
  //   }
  // };

  const handleEdit = async (id) => {
    try {
      console.log("Fetching data for edit with ID:", id);
      const response = await fetch(
        `${API_LINK}/MasterKriteriaSurvei/GetDataKriteriaSurveiById`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ksr_id: id.id }), // Kirim ID dalam body
        }
      );

      if (!response.ok) {
        throw new Error("Gagal mengambil data untuk di-edit." + response);
      }

      const data = await response.json();
      const group = data.reduce((acc, item) => {
        if (!acc[item.ksr_id]) {
          acc[item.ksr_id] = {
            ksr_id: item.ksr_id,
            ksr_nama: item.ksr_nama,
            ksr_status: item.ksr_status,
            ksr_created_by: item.ksr_created_by,
            ksr_created_date: item.ksr_created_date,
            ksr_modif_by: item.ksr_modif_by,
            ksr_modif_date: item.ksr_modif_date,
          };
        }
        return acc;
      }, {});

      // Ambil salah satu objek, misalnya menggunakan ID tertentu
      const editObject = group[id.No] || {};
      setEditFormData(editObject); // Simpan data ke state form edit sebagai objek
      editModalRef.current.open(); // Buka modal edit
    } catch (error) {
      console.error("Error fetching data for edit:", error);
      alert("Terjadi kesalahan saat memuat data untuk di-edit.");
    }
  };

  const handleDetail = async (id) => {
    setLoadingDetail(true); // Mulai loading
    try {
      console.log("Fetching data for edit with ID:", id);
      const response = await fetch(
        `${API_LINK}/MasterKriteriaSurvei/GetDataKriteriaSurveiById`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ksr_id: id.idData }), // Kirim ID dalam body
        }
      );

      if (!response.ok) {
        throw new Error("Gagal mengambil data detail.");
      }
      const data = await response.json();
      const group = data.reduce((acc, item) => {
        if (!acc[item.ksr_id]) {
          acc[item.ksr_id] = {
            ksr_id: item.ksr_id,
            ksr_nama: item.ksr_nama,
            ksr_status: item.ksr_status,
            ksr_created_by: item.ksr_created_by,
            ksr_created_date: item.ksr_created_date,
            ksr_modif_by: item.ksr_modif_by,
            ksr_modif_date: item.ksr_modif_date,
          };
        }
        return acc;
      }, {});

      // Ambil salah satu objek, misalnya menggunakan ID tertentu
      const editObject = group[id.idData] || {};

      setSelectedKriteria(editObject);
      detailModalRef.current.open(); // Buka modal detail
    } catch (error) {
      console.error("Error fetching detail data:", error);
      alert("Terjadi kesalahan saat mengambil data detail.");
    } finally {
      setLoadingDetail(false); // Selesai loading
    }
  };

  const indexOfLastData = pageCurrent * pageSize;
  const indexOfFirstData = indexOfLastData - pageSize;
  const currentData = data.slice(indexOfFirstData, indexOfLastData);

  const handlePageNavigation = (page) => {
    setPageCurrent(page);
  };
  return (
    <div className="d-flex flex-column min-vh-100">
      <main className="flex-grow-1 p-3" style={{ marginTop: "80px" }}>
        <div className="d-flex flex-column">
          <div className={isMobile ? "m-0 p-0" : "m-3 mb-0"}>
            <PageTitleNav
              title="Kriteria Survei"
              breadcrumbs={[{ label: "Kriteria Survei", href: "/tentang" }]}
              onClick={() => onChangePage("tentang")}
            />
          </div>{" "}
          <div
            className={isMobile ? "p-2 m-2 mt-2 mb-0" : "p-3 m-5 mt-2 mb-0"}
            style={{ marginLeft: "50px" }}
          >
            <Button
              iconName="add"
              classType="primary"
              label="Tambah Data"
              onClick={() => addModalRef.current.open()}
            />
            <div className="row mt-4 col-12">
              <div className="col-md-11">
                <SearchField />
              </div>
              <div className="col-md-1">
                <Filter />
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
              arrHeader={["No", "Nama Kriteria"]}
              data={currentData.map((item, index) => ({
                key: item.Key || index,
                idData: item.id,
                No: indexOfFirstData + index + 1,
                "Nama Kriteria": item.nama,
              }))}
              actions={["Detail", "Edit"]}
              onDetail={(id) => handleDetail(id)}
              // onEdit={(id) => handleEdit(id)}
              onEdit={(id) => {
                handleEdit(id);
              }}
            />

            <Paging
              pageSize={pageSize}
              pageCurrent={pageCurrent}
              totalData={data.length}
              navigation={handlePageNavigation}
            />
          </div>
          {/* Modal Tambah Kriteria Survei */}
          <Modal
            ref={addModalRef}
            title="Tambah Kriteria Survei"
            size="medium"
            Button1={
              <Button
                className="btn btn-primary"
                label="Simpan"
                onClick={handleAddKriteria}
              />
            }
            Button2={
              <Button
                className="btn btn-danger"
                label="Batal"
                onClick={() => addModalRef.current.close()}
              />
            }
          >
            <form>
              <InputField
                label="Nama Kriteria"
                isRequired="true"
                //onChange={handleInputChange}
                value={formData.ksr_nama} // Nilai dikendalikan oleh state formData
                onChange={(e) =>
                  setFormData({ ...formData, ksr_nama: e.target.value })
                }
                placeholder="Masukkan Nama Kriteria"
              />
            </form>
          </Modal>
          <Modal
            ref={detailModalRef}
            title="Detail Kriteria Survei"
            size="medium"
            Button1={
              <Button
                classType="danger"
                label="Batal"
                onClick={() => detailModalRef.current.close()}
              />
            }
          >
            {loadingDetail ? (
              <p>Sedang memuat data...</p>
            ) : selectedKriteria ? (
              <div>
                <p>
                  <strong>Nama Kriteria:</strong> <br />{" "}
                  {selectedKriteria.ksr_nama}
                </p>
                <div className="row col-12 mt-5">
                  <div className="col-md-6">
                    <p>
                      <strong>Dibuat Oleh:</strong> <br />
                      {selectedKriteria.ksr_created_by}
                    </p>
                    <p>
                      <strong>Tanggal Dibuat:</strong> <br />{" "}
                      {selectedKriteria.ksr_created_date}
                    </p>
                  </div>
                  <div className="col-md-6">
                    <p>
                      <strong>Dimodifikasi Oleh:</strong> <br />{" "}
                      {selectedKriteria.ksr_modif_by}
                    </p>
                    <p>
                      <strong>Tanggal Dimodifikasi:</strong> <br />{" "}
                      {selectedKriteria.ksr_modif_date}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <p>Data tidak ditemukan.</p>
            )}
          </Modal>
          {/* <Modal
            ref={editModalRef}
            title="Edit Kriteria Survei"
            size="medium"
            Button1={<Button label="Simpan" onClick={handleSaveEdit} />}
            Button2={<Button label="Batal" onClick={() => editModalRef.current.close()} />}
          >
            <form>
            
              <label>Nama Kriteria</label>
              <input
                type="text"
                name="ksr_nama"
                value={editFormData.ksr_nama}
                onChange={handleEditInputChange}
              />
              <InputField
              label="Nama Kriteria"
              isRequired="true"
              //onChange={handleInputChange}
              value={editFormData.ksr_nama} // Nilai dikendalikan oleh state formData
              onChange={(e) => setFormData({ ...formData, ksr_nama: e.target.value })} 
              placeholder="Masukkan Nama Kriteria"
              />
              
            </form>
          </Modal> */}
          <Modal
            ref={editModalRef}
            title="Edit Kriteria Survei"
            size="medium"
            Button1={
              <Button
                className="btn btn-primary"
                label="Simpan"
                onClick={handleSaveEdit} // Fungsi untuk menyimpan perubahan
              />
            }
            Button2={
              <Button
                className="btn btn-danger"
                label="Batal"
                onClick={() => editModalRef.current.close()} // Tutup modal
              />
            }
          >
            <form>
              <InputField
                ref={nama_layananRef}
                label="Nama Kriteria"
                isRequired="true"
                value={editFormData.ksr_nama || console.log(editFormData)} // Menggunakan state editFormData
                onChange={(e) =>
                  setEditFormData((prev) => ({
                    ...prev,
                    ksr_nama: e.target.value,
                  }))
                }
                placeholder="Masukkan Nama Kriteria"
              />
            </form>
          </Modal>
        </div>
      </main>
    </div>
  );
}
