import React, { useState, useRef, useEffect } from "react";
import Table from "../../../part/Table";
import Paging from "../../../part/Paging";
import SearchField from "../../../part/SearchField";
import HeaderText from "../../../part/HeaderText";
import Button from "../../../part/Button";
import Filter from "../../../part/Filter";
import Modal from "../../../part/Modal";
import DetailData from "../../../part/DetailData";
import SweetAlert from "../../../util/SweetAlert";
import { SyncLoader } from "react-spinners";
import { useIsMobile } from "../../../util/useIsMobile";
import { useNavigate } from "react-router-dom";
export default function Index({ onChangePage, title, breadcrumbs }) {
  const data = [

    { Key: 1, dok_id: 1,
      men_id: 5,
      dok_judul: "Sertifikat Akreditasi",
      dok_tgl_unduh: "2024-04-30 00:00:00",
      dok_tgl_akhir: "2020-03-28",
      dok_file: "file_1.pdf",
      dok_control: "Control-47",
      dok_status: "Archived",
      dok_status_delete: "Not Deleted",
      dok_created_by: "User1",
      dok_created_date: "2020-09-07 00:00:00",
      dok_modif_by: "User17",
      dok_modif_date: "2023-01-15 00:00:00",
      dok_nodok: "ND-9508",
      dok_ref: 1,
      dok_ref_name: "Pengaturan Tentang Kebijakan SPMI",
      dok_rev: 0,
      dok_tahun: "2023-01-15 00:00:00",
      JudulDokumen: "Sertifikat Akreditasi",
      status: "Aktif"},
    
    { Key: 2, 
      dok_id: 2,
      men_id: 8,
      dok_judul: "Surat Keputusan Akreditasi",
      dok_tgl_unduh: "2024-06-12 00:00:00",
      dok_tgl_akhir: "2020-01-11",
      dok_file: "file_2.pdf",
      dok_control: "Control-57",
      dok_status: "Archived",
      dok_status_delete: "Not Deleted",
      dok_created_by: "User2",
      dok_created_date: "2024-06-26 00:00:00",
      dok_modif_by: "User5",
      dok_modif_date: "2022-09-08 00:00:00",
      dok_nodok: "ND-2559",
      dok_ref: 3,
      dok_ref_name: "Standar Lain",
      dok_rev: 0,
      dok_tahun: "2023-01-15 00:00:00",
      JudulDokumen: "Surat Keputusan Akreditasi", 
      status: "Aktif" },
  ];

  const navigate = useNavigate();
  const [pageSize] = useState(10);
  const ModalRef = useRef();
  const [modalType, setModalType] = useState("");
  const [detail, setDetail] = useState(null);
  const [selectedDokRef, setSelectedDokRef] = useState(data[0] || null);
  const [sortedData, setSortedData] = useState(data);
  const [pageCurrent, setPageCurrent] = useState(1);
  const indexOfLastData = pageCurrent * pageSize;
  const indexOfFirstData = indexOfLastData - pageSize;
  const currentData = data.slice(indexOfFirstData, indexOfLastData);
  const [isLoading, setIsLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState("");

  const uniqueDokRefs = data
  .filter(
    (item, index, self) =>
      index === self.findIndex((obj) => obj.dok_ref === item.dok_ref)
  )
  .sort((a, b) => a.dok_ref - b.dok_ref);

useEffect(() => {
  if (selectedDokRef !== null) {
    // Filter data by selected dok_ref and sort by dok_rev
    const filteredData = data.filter(
      (item) => item.dok_ref === selectedDokRef.dok_ref
    );

    let tempData = filteredData;

    if (searchKeyword) {
      tempData = tempData.filter((item) =>
        item.dok_judul.toLowerCase().includes(searchKeyword.toLowerCase())
      );
    }

    const sorted = tempData.sort(
      (a, b) => a.dok_created_date - b.dok_created_date
    );
    if (JSON.stringify(sorted) !== JSON.stringify(sortedData)) {
      setSortedData(sorted); // Update the sorted data only if it has changed
    }
  }
}, [selectedDokRef, data, sortedData]);

  
  const handlePageNavigation = (page) => {
    setPageCurrent(page);
  };

  const handleOpenModal = (type, data = null) => {
    setModalType(type);
    setDetail(data);
    ModalRef.current.open();
  };

  const handleEdit = (item) => {
    onChangePage("edit", { state: { editData: item } });
  };

  const handleDelete = async (id) => {
    const confirm = await SweetAlert(
      "Konfirmasi",
      "Apakah Anda yakin ingin menghapus dokumen ini?",
      "warning",
      "Ya, Hapus",
      null,
      "",
      true
    );

    if (confirm) {
      console.log("deleted");
    }
  };

  return (
    <>
    <div className="d-flex flex-column min-vh-100">
      <main className="flex-grow-1 p-3" style={{ marginTop: "80px" }}>
        <div className="d-flex flex-column">
          <div className="container mb-3">
            <div className="mt-3">
              <div className="d-flex justify-content-between align-items-center">
                <h1
                  style={{ color: "#2654A1", margin: "0", fontWeight: "700" }}
                >
                  {title}
                </h1>
              </div>

              <nav className="ms-1">
                <ol className="breadcrumb">
                  {breadcrumbs &&
                    breadcrumbs.map((breadcrumb, index) => (
                      <li
                        key={index}
                        className={`breadcrumb-item ${
                          breadcrumb.href ? "" : "active"
                        }`}
                        aria-current={breadcrumb.href ? undefined : "page"}
                      >
                        {breadcrumb.href ? (
                          <span
                            style={{
                              color: "#575050",
                              textDecoration: "none",
                              cursor: "pointer",
                            }}
                          >
                            {breadcrumb.label}
                          </span>
                        ) : (
                          <span>{breadcrumb.label}</span>
                        )}
                      </li>
                    ))}
                </ol>
              </nav>
            </div>

            <div
              className="mt-5 mb-0"
              // style={{ marginLeft: "50px", margin: isMobile ? "1rem" : "3rem" }}
            >
              <Button
                iconName="add"
                classType="primary"
                label="Tambah Baru"
                onClick={() => onChangePage("add")}
                // onClick={() => addModalRef.current.open()}
              />
              <div className="row mt-3 ">
                <div className="col-lg-10 col-md-6 ">
                  <SearchField />
                </div>
                <div className="col-lg-2 col-md-6">
                  <Filter>
                    <div className="mb-3">
                    <label htmlFor="yearPicker" className="mb-1">
                     Berdasarkan Tahun
                      </label>
                      <input                      
                      type="number"
                      className="form-control"
                      placeholder="Masukkan Tahun"
                      // value={selectedYear}
                      // onChange={(e) =>
                      //   setSelectedYear(e.target.value)
                      // }
                      min="2000"
                      max={new Date().getFullYear()}
                       />
                      </div>
                  
                      <Button
                      classType="btn btn-secondary"
                      title="Reset Filter"
                      label="Reset"
                      // onClick={resetFilter}
                      />
                  </Filter>
                </div>
              </div>
            </div>
            <div className="row mt-3 ">
                <div className="col-lg-2 col-md-6 ">
                  <Button
                    iconName="add"
                    classType="primary"
                    label="Tambah Dokumen"
                    onClick={() => onChangePage("add")}
                  />
                </div>
                <div className="col-lg-8 col-md-6 ">
                  <SearchField
                    onChange={(value)=> setSearchKeyword(value)} 
                  />
                </div>
                <div className="col-lg-2 col-md-6">
                  <Button
                    iconName="settings-sliders"
                    classType="primary"
                    label="Filter"
                  />
                </div>
              </div>
            <div className="table-container bg-white rounded">
              <Table
                arrHeader={["No", "Judul Dokumen", "Status"]}
                headerToDataMap={{
                  No: "No",
                  "Judul Dokumen": "JudulDokumen",
                  "Status" : "status",
                }}
                data={sortedData.map((item, index) => ({
                  key: item.Key || index,
                  No: indexOfFirstData + index + 1,
                  JudulDokumen: item.JudulDokumen,
                  status: item.status,
                }))}
                actions={["Preview","Detail","Print","Edit", "Delete",""]}
                onPreview={(data) => {
                  console.log("prev");
                  const selected = currentData.find(
                    (item) => item.dok_id == data.key
                  );
                  handleOpenModal("preview", selected);
                }}
                onDetail={(data) => {
                  const selected = sortedData.find(
                    (item) => item.dok_id == data.key
                  );
                  handleOpenModal("detail", selected);
                }}
                onEdit={handleEdit}
                onPrint={() => console.log("printed")}
                onDelete={(item) => handleDelete(item.key)}
              />

              <Paging
                pageSize={pageSize}
                pageCurrent={pageCurrent}
                totalData={sortedData.length}
                navigation={handlePageNavigation}
              />
            </div>
          </div>
        </div>
      </main>

      {modalType === "detail" && (
          <Modal
            ref={ModalRef}
            title="Detail Dokumen"
            size="full"
            Button2={
              <Button
                classType="secondary"
                label="Tutup"
                onClick={() => ModalRef.current.close()}
              />
            }
          >
            <div className="p-5 mt-0 bg-white rounded shadow"  >
              {/* <HeaderText label="Detail Dokumen" /> */}
              <div className="row">
                <div className="col-lg-12 col-md-12">
                  <DetailData label="Judul Dokumen" isi={detail.dok_judul} />
                </div>
                <div className="col-lg-6 col-md-6">
                  <DetailData label="Nomor Dokumen" isi={detail.dok_nodok} />
                  <DetailData label="Jenis Dokumen" isi={detail.dok_control} />
                </div>
                <div className="col-lg-6 col-md-6">
                  <DetailData
                    label="Tanggal Berlaku"
                    isi={new Date(detail.dok_tahun).toLocaleDateString(
                      "id-ID",
                      {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      }
                    )}
                  />
                  <DetailData
                    label="Tanggal Kadaluarsa"
                    isi={new Date(detail.dok_tgl_akhir).toLocaleDateString(
                      "id-ID",
                      {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      }
                    )}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-lg-6 col-md-6">
                  <DetailData label="Dibuat Oleh" isi={detail.dok_created_by} />
                  <DetailData
                    label="Dibuat Tanggal"
                    isi={new Date(detail.dok_created_date).toLocaleDateString(
                      "id-ID",
                      {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      }
                    )}
                  />
                </div>
                <div className="col-lg-6 col-md-6">
                  <DetailData
                    label="Dimodifikasi Oleh"
                    isi={detail.dok_modif_by}
                  />
                  <DetailData
                    label="Dimodifikasi Tanggal"
                    isi={new Date(detail.dok_modif_date).toLocaleDateString(
                      "id-ID",
                      {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      }
                    )}
                  />
                </div>
              </div>
            </div>
          </Modal>
        )}
        {modalType === "preview" && (
          <Modal
            ref={ModalRef}
            title="Preview Dokumen"
            size="full"
            Button2={
              <Button
                classType="secondary"
                label="Tutup"
                onClick={() => ModalRef.current.close()}
              />
            }
          >
            <div className="p-3 mt-0 bg-white rounded shadow">
              <HeaderText label="Preview Dokumen" />
              <div style={{ width: "90vh", height: "50vh" }}>
                {isLoading == true ? (
                  <div style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center", 
                    backgroundColor: "white", 
                    minHeight: "50vh",
                    margin: 0,
                  }}>
                    <SyncLoader color="#0d6efd" loading={true} />
                  </div>
                ) : (
                  <embed
                    src={pdf}
                    width="100%"
                    height="100%"
                    type="application/pdf"
                    title="PDF Preview"
                    onLoad={() => setIsLoading(false)}
                  />
                )}
              </div>
            </div>
          </Modal>
        )}
    </div>
    </>
    
  );
}
