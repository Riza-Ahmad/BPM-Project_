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
import { useIsMobile } from "../../../util/useIsMobile";

const arrSort = [
  { Value: "[namaKri] ASC", Text: "Nama Kriteria [↑]" },
  { Value: "[namaKri] DESC", Text: "Nama Kriteria [↓]" },
];

const arrStatus = [
  { Value: "Aktif", Text: "Aktif" },
  { Value: "Tidak Aktif", Text: "Tidak Aktif" },
];

const breadcrumbs = [{ label: "Evaluasi" }, { label: "Kriteria" }];

export default function Index({ onChangePage }) {
  const isMobile = useIsMobile();
  const activeUser = Cookies.get("activeUser");
  let role = "";
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
    param1: "Aktif",
    param2: "",
    param3: "namaKri ASC",
    param4: pageSize,
    param5: pageCurrent,
  });

  const [modalType, setModalType] = useState("");
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

  const fetchKriteria = async () => {
    setLoading(true);
    try {
      const result = await useFetch(
        `${API_LINK}/MasterKriteria/GetDataKriteria`,
        currentFilter,
        "POST"
      );

      if (result === "ERROR" || result === null || result.length === 0) {
        setFilteredData([]);
        setTotalData(0);
      } else {
        const arrResult = Object.values(result);
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
    fetchKriteria();
  }, [currentFilter]);

  const handleOpenModal = (type, data = null) => {
    setModalType(type);
    setDetail(data);
    ModalRef.current?.open();
  };

  const handleDetail = (item) => {
    const selected = filteredData.find((obj) => obj.idKri == item.Key);
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
    SweetAlert(
      "Konfirmasi",
      `Apakah Anda yakin ingin ${
        item.status === "Aktif" ? "menonaktifkan" : "mengaktifkan"
      } data ini?`,
      "question",
      "Ya",
      null,
      "",
      true
    ).then((result) => {
      if (result) {
        const updatedData = filteredData
          .filter((data) => data.idKri === item.Key)
          .map((data) => ({
            idKri: data.idKri,
            status: data.status === "Aktif" ? "Tidak Aktif" : "Aktif",
          }));

        useFetch(
          `${API_LINK}/MasterKriteria/EditStatusKriteria`,
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
              fetchKriteria();
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
        <div className="d-flex flex-column">
          <div className={isMobile ? "m-0 p-2" : "m-3 ms-5 mb-0"}>
            <h1 style={{ color: "#2654A1", margin: "0", fontWeight: "700" }}>
              Kriteria Pertanyaan
            </h1>
            <Breadcrumbs breadcrumbs={breadcrumbs} />
          </div>

          <div
            className={isMobile ? "p-2 m-2 mt-2 mb-0 " : "p-1 m-5 mt-2 mb-0"}
            style={{ marginLeft: "50px" }}
          >
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
                        param2: e,
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
                    defaultValue="[namaKri] ASC"
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
                          param1: e.target.value,
                        };
                      })
                    }
                  />
                </Filter>
              </div>
            </div>
          </div>

          <div
            className={
              isMobile
                ? "table-container bg-white p-1 m-1 mt-0 rounded"
                : "table-container bg-white p-2 pt-0 pb-0  m-5 mt-0 rounded"
            }
          >
            {loading ? (
              <Loading />
            ) : (
              <div>
                {role === "ROL01" ? (
                  <Table
                    arrHeader={["No", "Nama Kriteria"]}
                    data={filteredData.map((item, index) => ({
                      Key: item.idKri,
                      No: (pageCurrent - 1) * pageSize + index + 1,
                      "Nama Kriteria": item.namaKri,
                      status: item.status,
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
          size="full"
          Button2={
            <Button
              classType="secondary"
              label="Tutup"
              onClick={() => ModalRef.current.close()}
            />
          }
        >
          <div className="p-5 mt-0 bg-white rounded shadow">
            <DetailData label="Nama Kriteria" isi={detail.namaKri} />
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
