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

export default function KriteriaSurvei({onChangePage}) {
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
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
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
  
  const [editFormData, setEditFormData] = useState({
    ksr_id: "",
    ksr_nama: "",
    ksr_status: "",
    ksr_created_by: "",
    ksr_created_date: "",
    ksr_modif_by: "",
    ksr_modif_date: "",
  });
  


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
      ksr_id: formData.ksr_id,
      ksr_nama: formData.ksr_nama,
      ksr_status: formData.ksr_status,
      ksr_created_by: formData.ksr_created_by,
      ksr_created_date: formData.ksr_created_date,
      ksr_modif_by: formData.ksr_modif_by,
      ksr_modif_date: formData.ksr_modif_date,
    };
  
    try {
      // Kirim data ke backend menggunakan API
      const response = await fetch(
        `${API_LINK}/MasterKriteriaSurvei/CreateKriteriaSurvei`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newKriteria),
      });
  
      if (response.ok) {
        const result = await response.json();
  
        // Tambahkan data ke state jika berhasil
        setData((prevData) => [...prevData, result]);
  
        // Reset form setelah submit
        setFormData({
          ksr_id: "",
          ksr_nama: "",
          ksr_status: "",
          ksr_created_by: "",
          ksr_created_date: "",
          ksr_modif_by: "",
          ksr_modif_date: "",
        });
  
        // Tutup modal
        addModalRef.current.close();
  
        // Berikan notifikasi sukses
        alert("Kriteria berhasil ditambahkan!");
      } else {
        // Tampilkan pesan error jika response gagal
        const error = await response.json();
        alert(`Gagal menambahkan kriteria: ${error.message}`);
      }
    } catch (error) {
      // Tampilkan error jika ada masalah koneksi
      alert(`Terjadi kesalahan: ${error.message}`);
    }
  };
  
  const handleSaveEdit = async () => {
    try {
      const response = await fetch(`${API_LINK}/MasterKriteriaSurvei/EditKriteriaSurvei`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editFormData),
      });
  
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

  const handleEdit = async (id) => {
    try {
      const response = await fetch(`${API_LINK}/MasterKriteriaSurvei/GetDataKriteriaSurvei?id=${id}`);
      if (!response.ok) {
        throw new Error("Gagal mengambil data untuk di-edit.");
      }
      const data = await response.json();
      setEditFormData(data); // Simpan data ke state
      editModalRef.current.open(); // Buka modal edit
    } catch (error) {
      console.error("Error fetching data for edit:", error);
      alert("Terjadi kesalahan saat memuat data untuk di-edit.");
    }
  };
  

  const handleDetail = async (id) => {
    setLoadingDetail(true); // Mulai loading
    try {
      const response = await fetch(`${API_LINK}/MasterKriteriaSurvei/GetDataKriteriaSurveiById?id=${id}`);
      if (!response.ok) {
        throw new Error("Gagal mengambil data detail.");
      }
      const data = await response.json();
      setSelectedKriteria(data);
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
              breadcrumbs={[
                { label: "Kriteria Survei", href:"/tentang"}
              ]}
              onClick={() => onChangePage("tentang")}/>

          </div>
          <div className={isMobile ? "p-2 m-2 mt-2 mb-0" : "p-3 m-5 mt-2 mb-0"}
            style={{ marginLeft: "50px"}}>
              <Button 
              iconName="add"
              classType="primary"
              label="Tambah Data"
              onClick={() => addModalRef.current.open()}
              />
              <div className="row mt-4 col-12">
                <div className="col-md-11">
                <SearchField/>
                </div>
                <div className="col-md-1">
                <Filter/>
                </div>
              </div>
          </div>
          
          <div className={
              isMobile
                ? "table-container bg-white p-2 m-2 mt-0 rounded"
                : "table-container bg-white p-3 m-5 mt-0 rounded"
            }>
              <Table
              arrHeader={["No", "Nama Kriteria"]}
              headerToDataMap={{
                No: "No",
                "Nama Kriteria": "nama",
              }}
              data={currentData.map((item, index) => ({
                key: item.Key || index,
                No: indexOfFirstData + index + 1,
                nama: item.nama,
              }))}
              actions={["Detail", "Edit"]}
              onDetail={(id) => handleDetail(id)}
              onEdit={handleEdit}
              
            />

            <Paging
              pageSize={pageSize}
              pageCurrent={pageCurrent}
              totalData={data.length}
              navigation={handlePageNavigation}/>
          </div>

          {/* Modal Tambah Kriteria Survei */}
          <Modal
            ref={addModalRef}
            title="Tambah Kriteria Survei"
            size="medium"
            Button1={<Button className="btn btn-primary" label="Simpan" onClick={handleAddKriteria} />}
            Button2={<Button  className="btn btn-danger" label="Batal" onClick={() => addModalRef.current.close()} />}>
            <form>
              <InputField
              label="Nama Kriteria"
              isRequired="true"
              onChange={handleInputChange}
              placeholder="Masukkan Nama Kriteria"
              value={formData.ksr_nama}
              >

              </InputField>
             
            </form>
          </Modal>
          

          <Modal
            ref={detailModalRef}
            title="Detail Kriteria Survei"
            size="medium"
            Button1={<Button label="Tutup" onClick={() => detailModalRef.current.close()} />}
          >
            {loadingDetail ? (
              <p>Sedang memuat data...</p>
            ) : selectedKriteria ? (
              <div>
                <p><strong>ID:</strong> {selectedKriteria.ksr_id}</p>
                <p><strong>Nama Kriteria:</strong> {selectedKriteria.ksr_nama}</p>
                <p><strong>Status:</strong> {selectedKriteria.ksr_status}</p>
                <p><strong>Dibuat Oleh:</strong> {selectedKriteria.ksr_created_by}</p>
                <p><strong>Tanggal Dibuat:</strong> {selectedKriteria.ksr_created_date}</p>
                <p><strong>Dimodifikasi Oleh:</strong> {selectedKriteria.ksr_modif_by}</p>
                <p><strong>Tanggal Dimodifikasi:</strong> {selectedKriteria.ksr_modif_date}</p>

              </div>
            ) : (
              <p>Data tidak ditemukan.</p>
            )}
          </Modal>
          
          <Modal
            ref={editModalRef}
            title="Edit Kriteria Survei"
            size="medium"
            Button1={<Button label="Simpan" onClick={handleSaveEdit} />}
            Button2={<Button label="Batal" onClick={() => editModalRef.current.close()} />}
          >
            <form>
              <label>ID</label>
              <input
                type="text"
                name="ksr_id"
                value={editFormData.ksr_id}
                disabled
              />
              <label>Nama Kriteria</label>
              <input
                type="text"
                name="ksr_nama"
                value={editFormData.ksr_nama}
                onChange={handleEditInputChange}
              />
              <label>Status</label>
              <input
                type="text"
                name="ksr_status"
                value={editFormData.ksr_status}
                onChange={handleEditInputChange}
              />
              <label>Dibuat Oleh</label>
              <input
                type="text"
                name="ksr_created_by"
                value={editFormData.ksr_created_by}
                disabled
              />
              <label>Tanggal Dibuat</label>
              <input
                type="datetime-local"
                name="ksr_created_date"
                value={editFormData.ksr_created_date}
                disabled
              />
              <label>Dimodifikasi Oleh</label>
              <input
                type="text"
                name="ksr_modif_by"
                value={editFormData.ksr_modif_by}
                onChange={handleEditInputChange}
              />
              <label>Tanggal Dimodifikasi</label>
              <input
                type="datetime-local"
                name="ksr_modif_date"
                value={editFormData.ksr_modif_date}
                onChange={handleEditInputChange}
              />
            </form>
          </Modal>

        </div>
      </main>
    </div>
  );
}
