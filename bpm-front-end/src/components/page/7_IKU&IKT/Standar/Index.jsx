import React, { useState, useRef, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { API_LINK, DOKUMEN_LINK } from "../../../util/Constants";
import { useFetch } from "../../../util/useFetch";
import { SyncLoader } from "react-spinners";
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
import PdfPreviewDownload from "../../../part/PdfPreviewDownload";
import Cookies from "js-cookie";
import { decodeHtml } from "../../../util/DecodeHtml";
import { useIsMobile } from "../../../util/useIsMobile";

const arrSort = [
  { Value: "[judulSta] ASC", Text: "Judul Standar [↑]" },
  { Value: "[judulSta] DESC", Text: "Judul Standar [↓]" },
  { Value: "[jenisSta] ASC", Text: "Jenis Standar [↑]" },
  { Value: "[jenisSta] DESC", Text: "Jenis Standar [↓]" },
  { Value: "[parentSta] ASC", Text: "Parent Standar [↑]" },
  { Value: "[parentSta] DESC", Text: "Parent Standar [↓]" },
];

const arrStatus = [
  { Value: "Aktif", Text: "Aktif" },
  { Value: "Tidak Aktif", Text: "Tidak Aktif" },
];

const endVar = "Sta";

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
  const isMobile = useIsMobile();

  const [pageSize] = useState(10);
  const [pageCurrent, setPageCurrent] = useState(1);
  const [totalData, setTotalData] = useState(0);
  const [filteredData, setFilteredData] = useState([]);
  const idMenu = location.state?.idMenu;

  const [currentFilter, setCurrentFilter] = useState({
    param1: "",
    param2: "Aktif",
    param3: "[jenisSta] ASC",
    param4: pageSize,
    param5: pageCurrent,
    param6: new Date().getFullYear(),
  });

  const [modalType, setModalType] = useState(""); // "add", "edit", "detail", "preview"
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [breadcrumbs, setBreadcrumbs] = useState([]);
  const [arrTahun, setArrTahun] = useState([]);

  const { jenis } = useParams();
  const ModalRef = useRef();

  const title = "Master Standar";

  useEffect(() => {
    const fetchTahunDokumen = async () => {
      setLoading(true);
      const result = await useFetch(
        `${API_LINK}/MasterStandar/GetListTahunStandar`,
        {},
        "POST"
      ).finally(() => setLoading(false));

      if (result === "ERROR") {
        setArrTahun([]);
      } else {
        const tahunArr = Object.values(result);
        setArrTahun(tahunArr);
      }
    };

    fetchTahunDokumen();
  }, []);

  useEffect(() => {
    setCurrentFilter((prevFilter) => ({
      ...prevFilter,
      param5: pageCurrent,
    }));
  }, [pageCurrent]);

  const fetchDokumen = async () => {
    setLoading(true);
    try {
      const result = await useFetch(
        `${API_LINK}/MasterStandar/GetDataStandar`,
        currentFilter,
        "POST"
      );

      if (result === "ERROR" || result === null || result.length === 0) {
        setFilteredData([]);
        setTotalData(0);
      } else {
        const dokumenArray = Object.values(result);
        setFilteredData(dokumenArray);
        setTotalData(dokumenArray[0].TotalCount);
      }
    } catch (err) {
      setError("Gagal mengambil data: " + err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDokumen();
  }, [currentFilter]);

  useEffect(() => {
    let tempBradcrumps = [{ label: "SPMI" }, { label: "Dokumen SPMI" }];

    if (
      !tempBradcrumps.some(
        (item) =>
          item.label ===
          title.charAt(0).toUpperCase() + title.slice(1).toLowerCase()
      )
    ) {
      tempBradcrumps.push({
        label: title.charAt(0).toUpperCase() + title.slice(1).toLowerCase(),
      });
    }

    setBreadcrumbs(tempBradcrumps);
  }, [title]);

  const handleDetail = (item) => {
    onChangePage("detail", {
      idData: item.Key,
      idMenu: idMenu,
      breadcrumbs: breadcrumbs,
    });
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
      `Apakah Anda yakin ingin menghapus data ini?`,
      "question",
      "Ya",
      null,
      "",
      true // Tampilkan tombol batal
    ).then((result) => {
      if (result) {
        // Jika pengguna mengonfirmasi, hanya simpan idDok dan status yang diperbarui
        const updatedData = filteredData
          .filter((data) => data.idSta === item.Key)
          .map((data) => ({
            idDok: data.idSta,
            status: data.status === "Aktif" ? "Tidak Aktif" : "Aktif",
          }));

        useFetch(`${API_LINK}/MasterStandar/EditStatusStandar`, updatedData[0])
          .then((response) => {
            if (response === "ERROR") {
              throw new Error("Gagal memperbarui data");
            }
            SweetAlert(
              "Berhasil!",
              updatedData[0].status === "Aktif"
                ? "Data Standar berhasil diaktifkan"
                : "Data Standar berhasil dinonaktifkan",
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

  if (error)
    return (
      <div>
        <p>{error}</p>
      </div>
    );

  return (
    <div className="d-flex flex-column min-vh-100">
      <main className="flex-grow-1 p-3" style={{ marginTop: "60px" }}>
        <div className="d-flex flex-column">
          <div className={isMobile ? "mt-3 p-2" : "p-3 m-5 mt-0 mb-0"}>
            <h1 style={{ color: "#2654A1", margin: "0", fontWeight: "700" }}>
              {title}
            </h1>
            <Breadcrumbs breadcrumbs={breadcrumbs} />
          </div>

          {role === "ROL01" ? (
            <div className={isMobile ? "p-3" : "p-3 ms-5 "}>
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
            </div>
          ) : (
            ""
          )}

          <div
            className={
              isMobile
                ? "table-container bg-white p-1 m-1 mt-0 rounded"
                : "table-container bg-white p-3 m-5 mt-0 rounded"
            }
          >
            <div className="row">
              <div className="col-12 d-flex flex-wrap align-items-center">
                <div className="me-auto flex-grow-1 me-3">
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
                <div className="mb-3">
                  <Filter>
                    <DropDown
                      arrData={arrSort}
                      label="Urut Berdasarkan"
                      type="pilih"
                      defaultValue="[judulSta] ASC"
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
                      arrData={arrTahun}
                      label="Tahun Standar"
                      type="pilih"
                      forInput="yearFilter"
                      defaultValue={new Date().getFullYear()}
                      onChange={(e) =>
                        setCurrentFilter((prevFilter) => {
                          return {
                            ...prevFilter,
                            param6: e.target.value,
                          };
                        })
                      }
                    />
                  </Filter>
                </div>
              </div>
            </div>{" "}
            {loading ? (
              <Loading />
            ) : (
              <div>
                <Table
                  arrHeader={["No", "Nama Standar"]}
                  data={filteredData.map((item, index) => ({
                    Key: item.idSta,
                    No: (pageCurrent - 1) * pageSize + index + 1,
                    "Nama Standar": decodeHtml(item.judulSta),
                    status: item.status,
                  }))}
                  actions={(row) => {
                    // Jika status "Tidak Aktif", hanya tampilkan Toggle
                    if (row.status === "Tidak Aktif") {
                      return ["Toggle"];
                    }
                    // Jika status selain "Tidak Aktif", tampilkan semua actions
                    return ["Detail", "Edit", "Delete"];
                  }}
                  aksiIs={role === "ROL01" ? true : false}
                  onEdit={handleEdit}
                  onDetail={handleDetail}
                  onDelete={handleToggle}
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
    </div>
  );
}
