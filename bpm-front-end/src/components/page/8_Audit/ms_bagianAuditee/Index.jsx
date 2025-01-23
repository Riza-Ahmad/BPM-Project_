import React, { useState, useRef, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { API_LINK, DOKUMEN_LINK } from "../../../util/Constants";
import { useFetch } from "../../../util/useFetch";
import Table from "../../../part/Table";
import Paging from "../../../part/Paging";
import SearchField from "../../../part/SearchField";
import Button from "../../../part/Button";
import Filter from "../../../part/Filter";
import Modal from "../../../part/Modal";
import DetailData from "../../../part/DetailData";
import Breadcrumbs from "../../../part/Breadcrumbs";
import DropDown from "../../../part/Dropdown";
import Loading from "../../../part/Loading";
import SweetAlert from "../../../util/SweetAlert";
import Cookies from "js-cookie";

const arrSort = [
  { Value: "[kodeBad] ASC", Text: "Kode Bagian Auditee [↑]" },
  { Value: "[kodeBad] DESC", Text: "Kode Bagian Auditee [↓]" },
  { Value: "[namaBad] ASC", Text: "Nama Bagian Auditee [↑]" },
  { Value: "[namaBad] DESC", Text: "Nama Bagian Auditee [↓]" },
];

const arrStatus = [
  { Value: "Aktif", Text: "Aktif" },
  { Value: "Tidak Aktif", Text: "Tidak Aktif" },
];

const breadcrumbs = [{ label: "Evaluasi" }, { label: "Bagian Auditee" }];

export default function Index({ onChangePage }) {
  const activeUser = Cookies.get("activeUser");
  let role = ""; // Jika undefined, gunakan nilai default
  let roleNama = "";
  let namaPengguna = "";
  if (activeUser) {
    role = JSON.parse(activeUser).RoleID.slice(0, 5);
    roleNama = JSON.parse(activeUser).Role;
    namaPengguna = JSON.parse(activeUser).Nama;
  }
  const location = useLocation();

  const [pageSize] = useState(10);
  const [pageCurrent, setPageCurrent] = useState(1);
  const [totalData, setTotalData] = useState(0);
  const [filteredData, setFilteredData] = useState([]);
  const idMenu = location.state?.idMenu;

  const [currentFilter, setCurrentFilter] = useState({
    param1: "",
    param2: "Aktif",
    param3: "namaBad ASC",
    param4: pageSize,
    param5: pageCurrent,
  });

  const [modalType, setModalType] = useState(""); // "add", "edit", "detail", "preview"
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const ModalRef = useRef();

  useEffect(() => {
    setCurrentFilter((prevFilter) => ({
      ...prevFilter,
      param5: pageCurrent,
    }));
  }, [pageCurrent]);

  const fetchAuditee = async () => {
    setLoading(true);
    try {
      const result = await useFetch(
        `${API_LINK}/MasterBagianAuditee/GetDataBagianAuditee`,
        currentFilter,
        "POST"
      );

      if (result === "ERROR" || result === null || result.length === 0) {
        setFilteredData([]);
        setTotalData(0);
      } else {
        const arrResult = Object.values(result);
        // console.log(arrResult);
        setFilteredData(arrResult);
        setTotalData(arrResult[0].TotalCount);
      }
    } catch (err) {
      setError("Gagal mengambil data: " + err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditee();
  }, [currentFilter]);

  const handleOpenModal = (type, data = null) => {
    setModalType(type);
    setDetail(data);
    ModalRef.current?.open();
  };

  const handleDetail = (item) => {
    const selected = filteredData.find((obj) => obj.idBad == item.Key);
    handleOpenModal("detail", selected);
  };

  const handleEdit = (item) => {
    onChangePage("edit", {
      idData: item.Key,
      idMenu: idMenu,
      breadcrumbs: breadcrumbs,
    });
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
        // Jika pengguna mengonfirmasi, hanya simpan idBad dan status yang diperbarui
        const updatedData = filteredData
          .filter((data) => data.idBad === item.Key)
          .map((data) => ({
            idBad: data.idBad,
            status: data.status === "Aktif" ? "Tidak Aktif" : "Aktif",
          }));

        useFetch(
          `${API_LINK}/MasterBagianAuditee/EditStatusBagianAuditee`,
          updatedData[0]
        )
          .then((response) => {
            if (response === "ERROR") {
              throw new Error("Gagal memperbarui data");
            }
            SweetAlert(
              "Berhasil!",
              updatedData[0].status === "Aktif"
                ? "Data data berhasil diaktifkan"
                : "Data data berhasil dinonaktifkan",
              "success",
              "OK"
            ).then(() => {
              fetchAuditee();
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

  if (error)
    return (
      <div>
        <p>{error}</p>
      </div>
    );

  return (
    <div className="d-flex flex-column min-vh-100">
      <main className="flex-grow-1 p-3" style={{ marginTop: "80px" }}>
        <div className="container">
          <h1 style={{ color: "#2654A1", margin: "0", fontWeight: "700" }}>
            Bagian Auditee
          </h1>
          <Breadcrumbs breadcrumbs={breadcrumbs} />

          <div className="mt-4">
            {role === "ROL01" ? (
              <Button
                iconName="add"
                classType="primary"
                label="Tambah Data"
                onClick={() =>
                  onChangePage("add", {
                    idMenu: idMenu,
                    breadcrumbs: breadcrumbs,
                  })
                }
              />
            ) : (
              ""
            )}
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
                    label="Urut Berdasarkan"
                    type="pilih"
                    defaultValue="[namaBad] ASC"
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
                {role === "ROL01" ? (
                  <Table
                    arrHeader={[
                      "No",
                      "Kode Bagian Auditee",
                      "Nama Bagian Auditee",
                    ]}
                    data={filteredData.map((item, index) => ({
                      Key: item.idBad,
                      No: (pageCurrent - 1) * pageSize + index + 1,
                      "Kode Bagian Auditee": item.kodeBad,
                      "Nama Bagian Auditee": item.namaBad,
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
                    onEdit={handleEdit}
                    onDetail={handleDetail}
                    onToggle={handleToggle}
                  />
                ) : (
                  ""
                )}
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
          title="Detail Kriteria"
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
            <DetailData label="Kepala Departemen" isi={detail.kadepBad} />
            <div className="row">
              <div className="col-lg-6">
                <DetailData label="PIC 1" isi={detail.pic1Bad} />
              </div>
              <div className="col-lg-6">
                <DetailData label="PIC 2" isi={detail.pic2Bad} />
              </div>
            </div>
            <div className="row">
              <div className="col-lg-6">
                <DetailData label="Kode Bagian Auditee" isi={detail.kodeBad} />
              </div>
              <div className="col-lg-6">
                <DetailData label="Nama Bagian Auditee" isi={detail.namaBad} />
              </div>
            </div>
            <div className="row">
              <div className="col-lg-6">
                <DetailData label="Dibuat Oleh" isi={detail.createdBy} />
              </div>
              <div className="col-lg-6">
                <DetailData
                  label="Dibuat Tanggal"
                  isi={new Date(detail.createdDate).toLocaleDateString(
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
              <div className="col-lg-6">
                <DetailData
                  label="Dimodifikasi Oleh"
                  isi={detail.modifiedBy || "-"}
                />
              </div>
              <div className="col-lg-6">
                <DetailData
                  label="Dimodifikasi Tanggal"
                  isi={
                    detail.modifiedDate
                      ? new Date(detail.modifiedDate).toLocaleDateString(
                          "id-ID",
                          {
                            weekday: "long",
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          }
                        )
                      : "-"
                  }
                />
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
