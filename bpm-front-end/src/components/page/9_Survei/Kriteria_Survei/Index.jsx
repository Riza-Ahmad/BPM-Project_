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
  const [loading, setLoading] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(true);
  
  const [formData, setFormData] = useState({
    ksr_nama: "",
    ksr_created_by: "Admin",
    ksr_created_date: new Date().toISOString(),
  });
  const detailModalRef = useRef();
  const [editFormData, setEditFormData] = useState({
    ksr_id: "",
    ksr_nama: "",
    ksr_status: "",
    ksr_created_by: "",
    ksr_created_date: "",
    ksr_modif_by: "",
    ksr_modif_date: "",
  });

  const addModalRef = useRef();
  const editModalRef = useRef();

  useEffect(() => {
    const fetchKriteria = async () => {
      try {
        const response = await fetch(`${API_LINK}/MasterKriteriaSurvei/GetDataKriteriaSurvei`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ page: 1, pageSize: 100 }),
        });
        if (!response.ok) throw new Error("Gagal mengambil data kriteria");

        const result = await response.json();
        const groupedKriteria = result.map((item) => ({
          id: item.ksr_id,
          nama: item.ksr_nama,
        }));

        setData(groupedKriteria);
      } catch (err) {
        console.error("Fetch error:", err);
        Swal.fire({ icon: "error", title: "Oops...", text: "Gagal mengambil data kriteria!" });
      } finally {
        setLoading(false);
      }
    };
    const handleAddKriteria = async () => {
      try {
        const response = await fetch(`${API_LINK}/MasterKriteriaSurvei/CreateKriteriaSurvei`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
  
        if (response.ok) {
          const result = await response.json();
          setData((prevData) => [...prevData, result]);
          setFormData({ ksr_nama: "", ksr_created_by: "Admin", ksr_created_date: new Date().toISOString() });
          addModalRef.current.close();
          Swal.fire("Success", "Template berhasil disimpan!", "success");
        } else {
          const error = await response.json();
          alert(`Gagal menambahkan kriteria: ${error.message}`);
        }
        
      } catch (error) {
        alert(`Terjadi kesalahan: ${error.message}`);
      }
    };
    fetchKriteria();
  }, []);

  const handleAddKriteria = async () => {
    try {
      const response = await fetch(`${API_LINK}/MasterKriteriaSurvei/CreateKriteriaSurvei`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        setData((prevData) => [...prevData, result]);
        setFormData({ ksr_nama: "", ksr_created_by: "Admin", ksr_created_date: new Date().toISOString() });
        addModalRef.current.close();
        Swal.fire("Success", "Template berhasil disimpan!", "success");
      } else {
        const error = await response.json();
        alert(`Gagal menambahkan kriteria: ${error.message}`);
      }
      
    } catch (error) {
      alert(`Terjadi kesalahan: ${error.message}`);
    }
  };

  const handleEdit = async (id) => {
    try {
      const response = await fetch(`${API_LINK}/MasterKriteriaSurvei/GetDataKriteriaSurveiById`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ksr_id: id.idData }),
      });

      if (!response.ok) throw new Error("Gagal mengambil data untuk di-edit");

      const result = await response.json();
      const [selectedData] = result;
      setEditFormData({
        ksr_id: selectedData.ksr_id,
        ksr_nama: selectedData.ksr_nama,
        ksr_status: selectedData.ksr_status,
        ksr_created_by: selectedData.ksr_created_by,
        ksr_created_date: selectedData.ksr_created_date,
        ksr_modif_by: selectedData.ksr_modif_by,
        ksr_modif_date: selectedData.ksr_modif_date,
      });
      editModalRef.current.open();
    } catch (error) {
      console.error("Error fetching data for edit:", error);
      alert("Terjadi kesalahan saat memuat data untuk di-edit.");
    }
  };

  const handleSaveEdit = async () => {
    try {
      const response = await fetch(`${API_LINK}/MasterKriteriaSurvei/EditKriteriaSurvei`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editFormData),
      });

      if (!response.ok) throw new Error("Gagal menyimpan perubahan.");
      Swal.fire("Success", "Data berhasil diperbarui!", "success");
      editModalRef.current.close();
      // Refresh data
      setData((prevData) =>
        prevData.map((item) => (item.id === editFormData.ksr_id ? { ...item, nama: editFormData.ksr_nama } : item))
      );
    } catch (error) {
      alert("Terjadi kesalahan saat menyimpan perubahan.");
    }
  };

  const handleDetail = async (id) => {
    setLoadingDetail(true); // Mulai loading
    try {
      console.log("Fetching data for edit with ID:", id);
      const response = await fetch(`${API_LINK}/MasterKriteriaSurvei/GetDataKriteriaSurveiById`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ ksr_id: id.idData }), // Kirim ID dalam body
    });

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

  const handlePageNavigation = (page) => setPageCurrent(page);

  return (
    <div className="d-flex flex-column min-vh-100">
      <main className="flex-grow-1 p-3" style={{ marginTop: "80px" }}>
        <div className="d-flex flex-column">
        <div className={isMobile ? "m-0 p-0" : "m-3 mb-0"}>
        <PageTitleNav 
        title="Kriteria Survei"
        breadcrumbs=
        {[{ label: "Kriteria Survei", href: "/tentang" }]} />

          </div>
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
                <SearchField/>
                </div>
                <div className="col-md-1">
                <Filter/>
                </div>
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
                        data={currentData.map((item, index) => ({
                          key: index,
                          idData: item.id,
                          No: indexOfFirstData + index + 1,
                          "Nama Kriteria": item.nama,
                        }))}
                        actions={["Edit","Detail"]}
                        onEdit={handleEdit}
                        onDetail={(id) => handleDetail(id)}
                      />
                      <Paging pageSize={pageSize} pageCurrent={pageCurrent} totalData={data.length} navigation={handlePageNavigation} />

        </div>
       
        <Modal
          ref={addModalRef}
          title="Tambah Kriteria Survei"
          Button1={<Button className="btn btn-primary" label="Simpan" onClick={handleAddKriteria} />}
        >
          <InputField
            label="Nama Kriteria"
            value={formData.ksr_nama}
            onChange={(e) => setFormData({ ...formData, ksr_nama: e.target.value })}
          />
        </Modal>

        <Modal
          ref={editModalRef}
          title="Edit Kriteria Survei"
          Button1={<Button className="btn btn-primary" label="Simpan" onClick={handleSaveEdit} />}
        >
          <InputField
            label="Nama Kriteria"
            value={editFormData.ksr_nama}
            onChange={(e) => setEditFormData({ ...editFormData, ksr_nama: e.target.value })}
          />
        </Modal>
        <Modal
            ref={detailModalRef}
            title="Detail Kriteria Survei"
            size="medium"
            Button1={<Button classType="danger" label="Batal" onClick={() => detailModalRef.current.close()} />}
          >
            {loadingDetail ? (
              <p>Sedang memuat data...</p>
            ) : selectedKriteria ? (
              <div>
                <p><strong>Nama Kriteria:</strong> <br /> {selectedKriteria.ksr_nama}</p>
                <div className="row col-12 mt-5">
                    <div className="col-md-6">
                      <p><strong>Dibuat Oleh:</strong> <br />{selectedKriteria.ksr_created_by}</p>
                      <p><strong>Tanggal Dibuat:</strong> <br /> {selectedKriteria.ksr_created_date}</p>
                    </div>
                    <div className="col-md-6">
                      <p><strong>Dimodifikasi Oleh:</strong> <br /> {selectedKriteria.ksr_modif_by}</p>
                      <p><strong>Tanggal Dimodifikasi:</strong> <br /> {selectedKriteria.ksr_modif_date}</p>
                    </div>
                </div>
             
               
             

              </div>
            ) : (
              <p>Data tidak ditemukan.</p>
            )}
          </Modal>
      </main>
    </div>
  );
}
