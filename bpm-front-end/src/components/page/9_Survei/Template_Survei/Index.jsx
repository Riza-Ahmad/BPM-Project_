import React, { useState, useRef } from "react";
import Table from "../../../part/Table";
import Paging from "../../../part/Paging";
import PageTitleNav from "../../../part/PageTitleNav";
import Button from "../../../part/Button";
import SearchField from "../../../part/SearchField";
import Filter from "../../../part/Filter";
import Modal from "../../../part/Modal";
import TextField from "../../../part/TextField";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "../../../util/useIsMobile";

export default function Template_Survei() {
  const [pageSize] = useState(10);
  const [pageCurrent, setPageCurrent] = useState(1);
  const [templates, setTemplates] = useState([
    {
      id: 1,
      nama: "Kuesioner Mahasiswa Manajemen Informatika",
      tanggalFinal: "",
      status: "Draft",
    },
    {
      id: 2,
      nama: "Kuesioner Tenaga Pendidik Manajemen Informatika",
      tanggalFinal: "09 Sep 2024",
      status: "Final",
    },
    // Tambahkan lebih banyak data sesuai kebutuhan
  ]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [formData, setFormData] = useState({
    nama: "",
    tanggalFinal: "",
    status: "",
  });
  const addModalRef = useRef();
  const editModalRef = useRef();
  const detailModalRef = useRef();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const handleAddTemplate = () => {
    const newTemplate = {
      id: templates.length + 1,
      nama: formData.nama,
      tanggalFinal: formData.tanggalFinal,
      status: formData.status || "Draft",
    };
    setTemplates([...templates, newTemplate]);
    setFormData({ nama: "", tanggalFinal: "", status: "" });
    addModalRef.current.close();
  };

  const handleUpdateTemplate = () => {
    if (!selectedTemplate) return;
    const updatedTemplate = { ...selectedTemplate, ...formData };
    setTemplates(
      templates.map((tpl) =>
        tpl.id === selectedTemplate.id ? updatedTemplate : tpl
      )
    );
    setSelectedTemplate(null);
    setFormData({ nama: "", tanggalFinal: "", status: "" });
    editModalRef.current.close();
  };

  const handleDetailTemplate = (template) => {
    setSelectedTemplate(template);
    detailModalRef.current.open();
  };

  const handlePageNavigation = (page) => setPageCurrent(page);

  const indexOfLastData = pageCurrent * pageSize;
  const indexOfFirstData = indexOfLastData - pageSize;
  const currentData = templates.slice(indexOfFirstData, indexOfLastData);

  const title = "Template Survei";
  const breadcrumbs = [{ label: "Survei/Template Survei" }];

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
              label="Tambah Baru"
              onClick={() => navigate("/survei/template/add")}
            />
            <div className="row mt-5">
              <div className="col-lg-11 col-md-6">
                <SearchField />
              </div>
              <div className="col-lg-1 col-md-5">
                <Filter />
              </div>
            </div>
          </div>
          <div
            className="table-container bg-white p-3 mt-0 rounded"
            style={{ margin: isMobile ? "1rem" : "3rem" }}
          >
            <Table
              arrHeader={["No", "Nama Template", "Tanggal Final", "Status"]}
              headerToDataMap={{
                No: "No",
                "Nama Template": "nama",
                "Tanggal Final": "tanggalFinal",
                Status: "status",
              }}
              data={currentData.map((item, index) => ({
                key: item.id,
                No: indexOfFirstData + index + 1,
                nama: item.nama,
                tanggalFinal: item.tanggalFinal || "-",
                status: item.status,
              }))}
              actions={["Detail", "Edit", "Finalisasi", "Hapus"]}
              onDetail={(id) =>
                handleDetailTemplate(templates.find((tpl) => tpl.id === id))
              }
              onEdit={(id) => {
                const selected = templates.find((tpl) => tpl.id === id);
                setSelectedTemplate(selected);
                setFormData(selected);
                editModalRef.current.open();
              }}
            />
            <Paging
              pageSize={pageSize}
              pageCurrent={pageCurrent}
              totalData={templates.length}
              navigation={handlePageNavigation}
            />
          </div>
        </div>
      </main>

      {/* ADD MODAL */}
      <Modal
        ref={addModalRef}
        title="Tambah Template Survei"
        size="medium"
        Button1={
          <Button
            classType="primary"
            label="Simpan"
            onClick={handleAddTemplate}
          />
        }
      >
        <TextField
          label="Nama Template"
          isRequired={true}
          onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
          value={formData.nama}
        />
      </Modal>

      {/* EDIT MODAL */}
      <Modal
        ref={editModalRef}
        title="Edit Template Survei"
        size="medium"
        Button1={
          <Button
            classType="primary"
            label="Update"
            onClick={handleUpdateTemplate}
          />
        }
      >
        <TextField
          label="Nama Template"
          isRequired={true}
          onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
          value={formData.nama}
        />
      </Modal>

      {/* DETAIL MODAL */}
      <Modal
        ref={detailModalRef}
        title="Detail Template Survei"
        size="medium"
        Button1={
          <Button
            classType="secondary"
            label="Tutup"
            onClick={() => detailModalRef.current.close()}
          />
        }
      >
        <p>
          <b>Nama Template:</b>{" "}
          {selectedTemplate ? selectedTemplate.nama : "Tidak tersedia"}
        </p>
        <p>
          <b>Tanggal Final:</b>{" "}
          {selectedTemplate
            ? selectedTemplate.tanggalFinal || "-"
            : "Tidak tersedia"}
        </p>
        <p>
          <b>Status:</b>{" "}
          {selectedTemplate ? selectedTemplate.status : "Tidak tersedia"}
        </p>
      </Modal>
    </div>
  );
}
