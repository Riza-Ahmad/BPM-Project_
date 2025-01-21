import React, { useState, useRef, useEffect } from "react";
import { API_LINK } from "../../util/Constants";
import { useFetch } from "../../util/useFetch";
import { useIsMobile } from "../../util/useIsMobile";
import SweetAlert from "../../util/SweetAlert";
import Table from "../../part/Table";
import Paging from "../../part/Paging";
import SearchField from "../../part/SearchField";
import Button from "../../part/Button";
import Filter from "../../part/Filter";
import Modal from "../../part/Modal";
import DetailData from "../../part/DetailData";
import Breadcrumbs from "../../part/Breadcrumbs";
import DropDown from "../../part/Dropdown";
import Loading from "../../part/Loading";

const arrSort = [
  { Value: "[namaKdo] ASC", Text: "Nama Kategori [↑]" },
  { Value: "[namaKdo] DESC", Text: "Nama Kategori [↓]" },
];

const arrStatus = [
  { Value: "Aktif", Text: "Aktif" },
  { Value: "Tidak Aktif", Text: "Tidak Aktif" },
];

export default function Index({ onChangePage }) {
  const [pageSize] = useState(10);
  const [pageCurrent, setPageCurrent] = useState(1);
  const [totalData, setTotalData] = useState(0);
  const [filteredData, setFilteredData] = useState([]);

  const [modalType, setModalType] = useState(""); // "add", "edit", "detail", "preview"
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [breadcrumbs, setBreadcrumbs] = useState([
    { label: "Master" },
    { label: "Kategori Dokumen" },
  ]);
  const ModalRef = useRef();
  const idData = useRef();
  const isMobile = useIsMobile();

  const title = "Kategori Dokumen";

  const [currentFilter, setCurrentFilter] = useState({
    param1: "",
    param2: "Aktif",
    param3: "[namaKdo] ASC",
    param4: pageSize,
    param5: pageCurrent,
  });

  useEffect(() => {
    setCurrentFilter((prevFilter) => ({
      ...prevFilter,
      param5: pageCurrent,
    }));
  }, [pageCurrent]);

  const fetchDokumen = async () => {
    setLoading(true);
    console.log("Fetching with filter:", currentFilter);
    const result = await useFetch(
      `${API_LINK}/MasterKategoriDokumen/GetDataKategoriDokumen`,
      currentFilter,
      "POST"
    ).finally(() => setLoading(false));

    if (result === "ERROR" || result === null || result.length === 0) {
      setFilteredData([]);
      setTotalData(0);
    } else {
      const kategoriArray = Object.values(result);
      setFilteredData(kategoriArray);
      setTotalData(kategoriArray[0].TotalCount);
    }
  };

  useEffect(() => {
    fetchDokumen();
  }, [currentFilter]); // Only depend on `currentFilter`

  const handleOpenModal = (type, data = null) => {
    setModalType(type);
    setDetail(data);
    ModalRef.current?.open();
  };

  const handleDetail = (item) => {
    const selected = filteredData.find((obj) => obj.idKdo == item.Key);
    handleOpenModal("detail", selected);
  };

  const handleEdit = (item) => {
    onChangePage(
      item.Type === "Header" ? "edit" : "editChild",
      breadcrumbs,
      item.Key
    );
  };

  const handleToggle = (item) => {
    // Tampilkan konfirmasi menggunakan SweetAlert sebelum toggle status
    SweetAlert(
      "Konfirmasi",
      `Apakah Anda yakin ingin ${
        item.status === "Aktif" ? "menonaktifkan" : "mengaktifkan"
      } data ini?`,
      "question",
      "Ya",
      null,
      "",
      true // Tampilkan tombol batal
    ).then((result) => {
      if (result) {
        // Jika pengguna mengonfirmasi, hanya simpan idDok dan status yang diperbarui
        const updatedData = filteredData
          .filter((data) => data.idKdo === item.Key)
          .map((data) => ({
            idKdo: data.idKdo,
            status: data.statusKdo === "Aktif" ? "Tidak Aktif" : "Aktif",
          }));

        console.log(updatedData);
        useFetch(
          `${API_LINK}/MasterKategoriDokumen/EditStatusKategoriDokumen`,
          updatedData[0]
        )
          .then((response) => {
            if (response === "ERROR") {
              throw new Error("Gagal memperbarui data");
            }
            SweetAlert(
              "Berhasil!",
              updatedData[0].status === "Aktif"
                ? "Data berhasil diaktifkan"
                : "Data berhasil dinonaktifkan",
              "success",
              "OK"
            ).then(() => {
              // Panggil fetchEvents untuk memperbarui data tanpa reload halaman
              fetchDokumen();
            });
          })
          .catch((error) => {
            SweetAlert("Gagal!", error.message, "error", "OK");
          })
          .finally(() => {
            setLoading(false);
          });
      }
    });
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <main className="flex-grow-1 p-3" style={{ marginTop: "80px" }}>
        <div className="container">
          <h1 style={{ color: "#2654A1", margin: "0", fontWeight: "700" }}>
            {title}
          </h1>
          <Breadcrumbs breadcrumbs={breadcrumbs} />

          <div className="mt-4">
            <Button
              iconName="add"
              classType="primary dropdown-toggle px-3 border-start"
              data-bs-toggle="dropdown"
              data-bs-auto-close="outside"
              label="Tambah Data"
            />
            <div className="dropdown-menu">
              {["Kategori Header", "Kategori Child"].map((label, index) => (
                <Button
                  key={index}
                  type="button"
                  label={label}
                  width="100%"
                  boxShadow="0px 4px 6px rgba(0, 0, 0, 0)"
                  onClick={() =>
                    onChangePage(index === 0 ? "add" : "addChild", breadcrumbs)
                  }
                  style={{
                    color: "#2654A1",
                    textAlign: "left",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = "#2654A1";
                    e.target.style.color = "white";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "white";
                    e.target.style.color = "#2654A1";
                  }}
                />
              ))}
            </div>
            <div className="row mt-3">
              <div className="col-lg-10">
                <SearchField
                  onChange={(e) =>
                    setCurrentFilter((prevFilter) => {
                      return {
                        ...prevFilter,
                        param1: e,
                      };
                    })
                  }
                />
              </div>
              <div className="col-lg-2">
                <Filter>
                  <DropDown
                    arrData={arrSort}
                    type="pilih"
                    label="Urut Berdasarkan"
                    defaultValue="[namaKdo] ASC"
                    forInput="sortFilter"
                    onChange={(e) =>
                      setCurrentFilter((prevFilter) => {
                        return {
                          ...prevFilter,
                          param3: e.target.value,
                        };
                      })
                    }
                  />
                  <DropDown
                    arrData={arrStatus}
                    label="Status"
                    type="pilih"
                    defaultValue="Aktif"
                    forInput="statusFilter"
                    onChange={(e) =>
                      setCurrentFilter((prevFilter) => {
                        return {
                          ...prevFilter,
                          param2: e.target.value,
                        };
                      })
                    }
                  />
                </Filter>
              </div>
            </div>
          </div>

          <div className="table-container bg-white rounded">
            {loading ? (
              <Loading />
            ) : (
              <div>
                <Table
                  arrHeader={["No", "Nama", "Path", "Type"]}
                  data={filteredData.map((item, index) => ({
                    Key: item.idKdo,
                    No: (pageCurrent - 1) * pageSize + index + 1,
                    Nama: item.namaKdo,
                    Path: item.pathKdo,
                    Type: item.idMen == null ? "Child" : "Header",
                    status: item.statusKdo,
                  }))}
                  actions={(row) => {
                    if (row.status === "Tidak Aktif") {
                      return ["Toggle"];
                    }
                    return ["Detail", "Edit", "Toggle"];
                  }}
                  onEdit={handleEdit}
                  onDetail={handleDetail}
                  onToggle={handleToggle}
                />
                <Paging
                  pageSize={pageSize}
                  pageCurrent={pageCurrent}
                  totalData={totalData}
                  navigation={setPageCurrent}
                />
              </div>
            )}
          </div>
        </div>
      </main>

      {modalType === "detail" && (
        <Modal
          ref={ModalRef}
          title="Detail Dokumen"
          size="medium"
          Button2={
            <Button
              classType="secondary"
              label="Tutup"
              onClick={() => ModalRef.current.close()}
            />
          }
        >
          <div className="p-5 mt-0 bg-white rounded shadow">
            {/* <HeaderText label="Detail Dokumen" /> */}
            <div className="row">
              <div className="col-lg-12 col-md-12">
                <DetailData
                  label="Nama Kategori Dokumen"
                  isi={detail.namaKdo}
                />
                <DetailData
                  label="Deskripsi Kategori Dokumen"
                  isi={detail.deskripsiKdo}
                />
              </div>
              <div className="col-lg-6 col-md-6">
                <DetailData
                  label="Parent Kategori Dokumen"
                  isi={detail.parentKdo}
                />
                <DetailData
                  label="Urutan Kategori Dokumen"
                  isi={detail.urutanKdo}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-lg-6 col-md-6">
                <DetailData label="Dibuat Oleh" isi={detail.createdByKdo} />
                <DetailData
                  label="Dibuat Tanggal"
                  isi={new Date(detail.createdDateKdo).toLocaleDateString(
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
                  isi={detail.modifiedByKdo}
                />
                <DetailData
                  label="Dimodifikasi Tanggal"
                  isi={new Date(detail.modifiedDateKdo).toLocaleDateString(
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
    </div>
  );
}
