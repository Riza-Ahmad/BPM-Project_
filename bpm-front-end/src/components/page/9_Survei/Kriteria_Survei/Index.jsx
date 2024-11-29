import React, { useState, useRef, useEffect } from "react";
import Table from "../../../part/Table";
import Paging from "../../../part/Paging";
import PageTitleNav from "../../../part/PageTitleNav";
import Button from "../../../part/Button";
import TextField from "../../../part/TextField";
import Modal from "../../../part/Modal";
import Filter from "../../../part/Filter";
import SearchField from "../../../part/SearchField";
import FileUpload from "../../../part/FileUpload";
import DropDown from "../../../part/Dropdown";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "../../../util/useIsMobile";
import { API_LINK } from "../../../util/Constants";
  

export default function Index() {
    const [kriteriaData, setKriteriaData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({ name: "" });
    const addModalRef = useRef();
    const updateModalRef = useRef();
    const [selectedKriteria, setSelectedKriteria] = useState(null);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const isMobile = useIsMobile();
  
    // Fetch Kriteria Data
    useEffect(() => {
      const fetchKriteria = async () => {
        try {
          const response = await fetch(API_LINK+`/MasterKriteriaSurvei/GetDataKriteriaSurvei`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              page: 1, // Sesuaikan jika ada pagination
              pageSize: 100,
            }),
          });
  
          if (!response.ok) throw new Error("Gagal mengambil data kriteria");
  
          const result = await response.json();
  
          // Transform data jika diperlukan
          const groupedKriteria = result.map((item) => ({
            id: item.id,
            name: item.Nama,
          }));
  
          setKriteriaData(groupedKriteria);
        } catch (err) {
          console.error("Fetch error:", err);
          setError("Gagal mengambil data kriteria");
        } finally {
          setLoading(false);
        }
      };
  
      fetchKriteria();
    }, []);
  
    const handleAddKriteria = async () => {
      try {
        const response = await fetch(`${API_LINK}/MasterKriteriaSurvei/CreateKriteriaSurvei`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: formData.name }),
        });
  
        if (response.ok) {
          toast.success("Kriteria berhasil ditambahkan");
          setFormData({ name: "" });
          addModalRef.current.close();
          // Refresh data
          const updatedData = await response.json();
          setKriteriaData([...kriteriaData, updatedData]);
        } else {
          toast.error("Gagal menambahkan kriteria");
        }
      } catch (err) {
        console.error(err);
        toast.error("Terjadi kesalahan saat menambahkan kriteria");
      }
    };
  
    const handleUpdateKriteria = async () => {
      if (!selectedKriteria) return;
      try {
        const response = await fetch(`${API_LINK}/MasterKriteriaSurvei/EditKriteriaSurvei`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: selectedKriteria.id, name: formData.name }),
        });
  
        if (response.ok) {
          toast.success("Kriteria berhasil diperbarui");
          setFormData({ name: "" });
          setSelectedKriteria(null);
          setIsUpdateModalOpen(false);
          // Refresh data
          const updatedData = await response.json();
          setKriteriaData(
            kriteriaData.map((item) => (item.id === updatedData.id ? updatedData : item))
          );
        } else {
          toast.error("Gagal memperbarui kriteria");
        }
      } catch (err) {
        console.error(err);
        toast.error("Terjadi kesalahan saat memperbarui kriteria");
      }
    };
  
    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;
  
    return (
      <div className="d-flex flex-column min-vh-100">
        <main className="flex-grow-1" style={{ marginTop: "80px" }}>
          <PageTitleNav title="Kriteria Survei" breadcrumbs={[{ label: "Kriteria Survei" }]} />
          <div className="table-container bg-white p-3 mt-3 rounded">
            <Button
              iconName="add"
              classType="primary"
              label="Tambah Kriteria Survei"
              onClick={() => addModalRef.current.open()}
            />
            <Table
              arrHeader={["No", "Nama Kriteria"]}
              headerToDataMap={{
                No: "No",
                "Nama Kriteria": "name",
              }}
              data={kriteriaData.map((item, index) => ({
                No: index + 1,
                name: item.name,
                key: item.id,
              }))}
              actions={["Edit", "Delete"]}
              onEdit={(id) => {
                const selected = kriteriaData.find((item) => item.id === id);
                setSelectedKriteria(selected);
                setFormData({ name: selected.name });
                setIsUpdateModalOpen(true);
              }}
            />
          </div>
        </main>
  
        {/* ADD MODAL */}
        <Modal
          ref={addModalRef}
          title="Tambah Kriteria"
          size="medium"
          Button1={<Button label="Simpan" onClick={handleAddKriteria} />}
        >
          <TextField
            label="Nama Kriteria"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </Modal>
  
        {/* UPDATE MODAL */}
        {isUpdateModalOpen && (
          <Modal
            title="Update Kriteria"
            size="medium"
            Button1={<Button label="Update" onClick={handleUpdateKriteria} />}
          >
            <TextField
              label="Nama Kriteria"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </Modal>
        )}
      </div>
    );
}