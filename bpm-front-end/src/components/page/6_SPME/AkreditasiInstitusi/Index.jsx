import React, { useState, useRef, useEffect } from "react";
import Table from "../../../part/Table";
import Paging from "../../../part/Paging";
import SearchField from "../../../part/SearchField";
import HeaderText from "../../../part/HeaderText";
import Button from "../../../part/Button";
import Filter from "../../../part/Filter";
import { useFetch } from "../../../util/useFetch";
import { useLocation, useNavigate } from "react-router-dom";
import { API_LINK } from "../../../util/Constants";
import Loading from "../../../part/Loading";
import SweetAlert from "../../../util/SweetAlert";
import Modal from "../../../part/Modal";
import DetailData from "../../../part/DetailData";
import Cookies from "js-cookie";
import { formatDate } from "../../../util/Formatting";

export default function Index({ onChangePage, title, breadcrumbs }) {
  const activeUser = Cookies.get("activeUser");
  let role = ""; // Jika undefined, gunakan nilai default
  let roleNama = "";
  let namaPengguna = "";
  if (activeUser) {
    role = JSON.parse(activeUser).RoleID.slice(0, 5);
    roleNama = JSON.parse(activeUser).Role;
    namaPengguna = JSON.parse(activeUser).Nama;
  }
  const [data, setData] = useState([]);
  const [pageSize] = useState(10);
  const [pageCurrent, setPageCurrent] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedYear, setSelectedYear] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [modalType, setModalType] = useState("");
  const ModalRef = useRef();
  const [detail, setDetail] = useState(null);

  const handlePageNavigation = (page) => {
    setPageCurrent(page);
  };

  const handleOpenModal = (type, data = null) => {
    setModalType(type);
    setDetail(data);
    ModalRef.current?.open();
  };

  const handleEdit = (item) => {
    onChangePage("edit", { state: { idAkre: item.key } });
  };

  const handleDetail = (item) => {
    const selected = filteredData.find((obj) => obj.idAkre == item.Key);
    handleOpenModal("detail", selected);
  };

  const [currentFilter, setCurrentFilter] = useState({
    param1: "",
    param2: "[akr_nama] ASC",
    param3: pageSize,
    param4: pageCurrent,
    param5: "Aktif",
  });

  const fetchData = async () => {
    try {
      const result = await useFetch(
        `${API_LINK}/MasterAkreditasi/GetAkreditasiInstitusi`,
        currentFilter,
        "POST"
      );
      setData(result);
      setFilteredData(result);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Gagal mengambil data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentFilter]);

  useEffect(() => {
    let Akredata = data;

    if (selectedYear) {
      Akredata = Akredata.filter(
        (item) => item.tahunAkr === parseInt(selectedYear)
      );
    }

    if (searchKeyword) {
      const lowerKeyword = searchKeyword.toLowerCase();
      Akredata = Akredata.filter(
        (item) =>
          (item.namaAkr && item.namaAkr.toLowerCase().includes(lowerKeyword)) ||
          (item.nomorSkAkr &&
            item.nomorSkAkr.toLowerCase().includes(lowerKeyword))
      );
    }

    setFilteredData(Akredata);
  }, [searchKeyword, selectedYear, data]);

  const resetFilter = () => {
    setSearchKeyword("");
    setSelectedYear("");
  };

  const handleToggle = async (id) => {
    const confirm = await SweetAlert(
      "Konfirmasi",
      "Apakah Anda yakin ingin mengubah status data ini?",
      "warning",
      "Ya, Ubah",
      null,
      "",
      true
    );

    if (confirm) {
      try {
        const currentItem = data.find((item) => item.idAkr === id);
        if (!currentItem) throw new Error("Data tidak ditemukan");

        const newStatus =
          currentItem.status === "Aktif" ? "Tidak Aktif" : "Aktif";

        const response = await useFetch(
          `${API_LINK}/MasterAkreditasi/SetStatusAkreditasi`,
          { idAkre: id, status: newStatus },
          "POST"
        );

        if (response === "ERROR") throw new Error("Gagal mengubah status data");

        SweetAlert("Berhasil", "Data berhasil dihapus", "success");

        setData((prevData) =>
          prevData.map((item) =>
            item.idAkr === id ? { ...item, status: newStatus } : item
          )
        );
      } catch (err) {
        console.error(err);
        SweetAlert(
          "Gagal",
          "Terjadi kesalahan saat mengubah status dokumen",
          "error"
        );
      }
    }
  };

  const indexOfLastData = pageCurrent * pageSize;
  const indexOfFirstData = indexOfLastData - pageSize;

  if (error) return <p>{error}</p>;

  return (
    <>
      <div className="d-flex flex-column min-vh-100">
        <main className="flex-grow-1 p-3" style={{ marginTop: "80px" }}>
          <div className="d-flex flex-column">
            <div className="container mb-3">
              <div className="">
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

              <div className="mt-5 mb-0">
                {role === "ROL01" ? (
                  <Button
                    iconName="add"
                    classType="primary"
                    label="Tambah Akreditasi"
                    onClick={() => onChangePage("add")}
                  />
                ) : (
                  ""
                )}
                <div className="row mt-3">
                  <div className="col-lg-10 col-md-6">
                    <SearchField
                      onChange={(value) => setSearchKeyword(value)}
                    />
                  </div>
                  <div className="col-lg-2 col-md-6">
                    <Filter>
                      <div className="mb-3">
                        <label htmlFor="yearPicker" className="mb-1">
                          Berdasarkan Tahun
                        </label>
                        <input
                          id="yearPicker"
                          type="number"
                          className="form-control"
                          placeholder="Masukkan Tahun"
                          value={selectedYear}
                          onChange={(e) => setSelectedYear(e.target.value)}
                          min="2000"
                          max={new Date().getFullYear()}
                        />
                      </div>
                      <Button
                        classType="btn btn-secondary"
                        title="Reset Filter"
                        label="reset"
                        onClick={resetFilter}
                      />
                    </Filter>
                  </div>
                </div>
              </div>
              <div className="table-container bg-white rounded">
                {loading ? (
                  <Loading />
                ) : (
                  <>
                    <Table
                      arrHeader={[
                        "No",
                        "Nama",
                        "Nomor SK",
                        "Peringkat",
                        "Tahun SK",
                        "Tanggal Kadaluwarsa",
                      ]}
                      data={filteredData.map((item, index) => ({
                        key: item.idAkr || index,
                        No: indexOfFirstData + index + 1,
                        Nama: item.namaAkr,
                        "Nomor SK": item.nomorSkAkr,
                        "Tahun SK": item.tahunAkr,
                        "Tanggal Kadaluwarsa": item.expAkr
                          ? formatDate(item.expAkr, true)
                          : "-",
                        Peringkat: item.peringkatAkr,
                        status: item.status,
                      }))}
                      actions={(row) => {
                        // Jika status "Tidak Aktif", hanya tampilkan Toggle
                        if (row.status === "Tidak Aktif") {
                          return ["Toggle"];
                        }
                        // Jika status selain "Tidak Aktif", tampilkan semua actions
                        return ["Detail", "Edit", "Toggle"];
                      }}
                      aksiIs={role === "ROL01" ? true : false}
                      onDetail={handleDetail}
                      onEdit={handleEdit}
                      onToggle={(item) => handleToggle(item.key)}
                    />

                    <Paging
                      pageSize={pageSize}
                      pageCurrent={pageCurrent}
                      totalData={filteredData.length}
                      navigation={handlePageNavigation}
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        </main>
        {modalType === "detail" && (
          <Modal
            ref={ModalRef}
            title="Detail Data"
            size="full"
            Button2={
              <Button
                classType="secondary"
                label="Tutup"
                onClick={() => ModalRef.current.close()}
              />
            }
          >
            <div className="p-3 mt-0 bg-white">
              <div className="row">
                <div className="col-lg-12 col-md-12">
                  <DetailData label="Nama" isi={detail.namaAkr} />
                </div>
                <div className="col-lg-6 col-md-6">
                  <DetailData label="Nomor SK" isi={detail.nomorSkAkr} />
                </div>
                <div className="col-lg-6 col-md-6">
                  <DetailData
                    label="Tanggal Kadaluarsa"
                    isi={formatDate(detail.expAkr, true)}
                  />
                </div>
                <div className="col-lg-6 col-md-6">
                  <DetailData
                    label="Dibuat Oleh"
                    isi={detail.createdBy || "-"}
                  />
                  <DetailData
                    label="Dibuat Tanggal"
                    isi={formatDate(detail.createdDate, true)}
                  />
                </div>
                <div className="col-lg-6 col-md-6">
                  <DetailData
                    label="Dimodifikasi Oleh"
                    isi={detail.modifiedBy || "-"}
                  />
                  <DetailData
                    label="Dimodifikasi Tanggal"
                    isi={formatDate(detail.modifiedDate, true)}
                  />
                </div>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </>
  );
}
