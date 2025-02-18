import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useIsMobile } from "../../../util/useIsMobile";
import { API_LINK } from "../../../util/Constants";
import { useFetch } from "../../../util/useFetch";
import { decodeHtml } from "../../../util/DecodeHtml";
import { SyncLoader } from "react-spinners";
import { DOKUMEN_LINK } from "../../../util/Constants";
import SweetAlert from "../../../util/SweetAlert";
import ImagesCarousel from "../../../part/ImagesCarousel";
import DropDown from "../../../part/Dropdown";
import Breadcrumbs from "../../../part/Breadcrumbs";
import Button from "../../../part/Button";
import SearchField from "../../../part/SearchField";
import Filter from "../../../part/Filter";
import Loading from "../../../part/Loading";
import Table from "../../../part/Table";
import Paging from "../../../part/Paging";
import Modal from "../../../part/Modal";
import Icon from "../../../part/Icon";
import DetailData from "../../../part/DetailData";
import PdfPreviewDownload from "../../../part/PdfPreviewDownload";
import Cookies from "js-cookie";

const arrSort = [
  { Value: "[namaIka] ASC", Text: "Nama Indikator [↑]" },
  { Value: "[namaIka] DESC", Text: "Nama Indikator [↓]" },
];

const arrStatus = [
  { Value: "Aktif", Text: "Aktif" },
  { Value: "Tidak Aktif", Text: "Tidak Aktif" },
];

const inisialisasiMenuData = {
  idSta: "",
  idMen: "",
  judulSta: "",
  deskripsiKdo: "",
  images: [],
  urutanKdo: "",
  parentKdo: null,
  statusKdo: "",
  createdByKdo: "",
  createdDateKdo: "",
  modifByKdo: "",
  modifDateKdo: "",
};

const inisialisasiSideMenuData = [
  {
    idSta: "",
    idMen: "",
    judulSta: "No Data Available",
    urutanKdo: "",
    parentKdo: null,
    statusKdo: "",
  },
];

const arrTahun = [
  { Value: "2024", Text: "2024" },
  { Value: "2025", Text: "2025" },
];

export default function Index({ onChangePage, isIkuIkt }) {
  const location = useLocation();
  const idMenu = location.state?.idMenu;
  const activeUser = Cookies.get("activeUser");
  let role = "";
  let roleNama = "";
  let namaPengguna = "";
  if (activeUser) {
    role = JSON.parse(activeUser).RoleID.slice(0, 5);
    roleNama = JSON.parse(activeUser).Role;
    namaPengguna = JSON.parse(activeUser).Nama;
  }

  const isMobile = useIsMobile();
  const [loading, setLoading] = useState(true);
  const [menuData, setMenuData] = useState(inisialisasiMenuData);
  const [tabMenu, setTabMenu] = useState(inisialisasiSideMenuData);
  const [sideMenu, setSideMenu] = useState(inisialisasiSideMenuData);
  const [activeTab, setActiveTab] = useState(null);
  const [activeSide, setActiveSide] = useState(null);
  const [standarYear, setStandarYear] = useState(new Date().getFullYear());

  const [pageSize] = useState(10);
  const [pageCurrent, setPageCurrent] = useState(1);
  const [totalData, setTotalData] = useState(0);
  const [filteredData, setFilteredData] = useState([]);

  const [breadcrumbs, setBreadcrumbs] = useState([]);
  // const [arrTahun, setArrTahun] = useState([]);
  const [error, setError] = useState("");

  const ModalRef = useRef();
  const [modalType, setModalType] = useState("");
  const [detail, setDetail] = useState(null);

  const [currentFilter, setCurrentFilter] = useState({
    param1: activeSide?.idSta || "",
    param2: "",
    param3: "[urutanIka] ASC",
    param4: pageSize,
    param5: pageCurrent,
    param6: "IKU",
  });

  useEffect(() => {
    setCurrentFilter((prevFilter) => ({
      ...prevFilter,
      param5: pageCurrent,
    }));
  }, [pageCurrent]);

  useEffect(() => {
    const fetchKategori = async () => {
      setLoading(true);
      try {
        const result = await useFetch(
          `${API_LINK}/MasterStandar/GetDataStandarByTahun`,
          { tahun: standarYear },
          "POST"
        );

        if (!result || result === "ERROR" || result.length === 0) {
          setMenuData(inisialisasiMenuData);
          setTabMenu([]);
          setSideMenu([]);
          setActiveTab(null);
          setActiveSide(null);
          setCurrentFilter((prevFilter) => ({
            ...prevFilter,
            param1: "",
          }));
          return;
        }

        const arrResult = Object.values(result);
        const firstResult = arrResult[0];

        const listMenu = CreateMenu(arrResult);
        // Ensure that listMenu[0] exists before accessing .children
        const sideMenuTransformed =
          listMenu.length > 0 ? listMenu[0]?.children || [] : [];

        setSideMenu(listMenu);
        setTabMenu([]);
        setActiveTab(0);
        setSideMenu(listMenu);

        // Ensure sideMenuTransformed[0] exists before setting active side
        if (sideMenuTransformed.length > 0) {
          setActiveSide(sideMenuTransformed[0]);

          // Ensure idSta exists before updating the filter
          if (sideMenuTransformed[0]?.idSta) {
            setCurrentFilter((prevFilter) => ({
              ...prevFilter,
              param1: sideMenuTransformed[0].idSta,
            }));
          }
        } else {
          // Handle case where there is no valid side menu data
          setActiveSide(null);
        }
      } catch (err) {
        console.error("Error fetching kategori:", err);
        setError("Gagal mengambil data: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchKategori();
  }, [standarYear]);

  useEffect(() => {
    let tempBradcrumps = [{ label: "SPMI" }, { label: "Siklus SPMI" }];

    if (!tempBradcrumps.some((item) => item.label === menuData.judulSta)) {
      tempBradcrumps.push({
        label: menuData.judulSta,
      });
    }

    setBreadcrumbs(tempBradcrumps);
  }, [menuData]);

  const fetchDokumen = async () => {
    setLoading(true);
    try {
      const result = await useFetch(
        `${API_LINK}/MasterIndikatorKinerja/GetDataIndikatorKinerja`,
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

  const CreateMenu = (data) => {
    try {
      const menuMap = {};
      const menuHierarchy = [];

      data.forEach((item) => {
        menuMap[item.idSta] = { ...item, children: [] };
      });

      data.forEach((item) => {
        if (item.parentIdSta) {
          menuMap[item.parentIdSta]?.children.push(menuMap[item.idSta]);
        } else {
          menuHierarchy.push(menuMap[item.idSta]);
        }
      });

      return menuHierarchy;
    } catch (err) {
      // console.error(err);
      return [];
    }
  };

  const calculateDepth = (data) => {
    const getDepth = (items) => {
      if (!items || items.length === 0) return 0; // No children, depth is 0
      return (
        1 + Math.max(...items.map((item) => getDepth(item.children || [])))
      );
    };

    return getDepth(data);
  };

  const handleOpenModal = (type, data = null) => {
    setModalType(type);
    setDetail(data);
    ModalRef.current?.open();
  };

  const handlePreview = (item) => {
    const selected = filteredData.find((obj) => obj.idDok == item.Key);
    handleOpenModal("preview", selected);
  };

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
      idSta: activeSide?.idSta || activeTab?.idSta,
      dataName: activeSide?.judulSta || activeTab?.judulSta,
      modew: item.jenis === "IKU" ? "utama" : "tambahan",
      breadcrumbs: breadcrumbs,
    });
  };

  const handleUpdateHistory = (item) => {
    onChangePage("updHistory", {
      idData: item.Key,
      idMenu: idMenu,
      breadcrumbs: breadcrumbs,
    });
  };

  const handleDownloadHistory = (item) => {
    onChangePage("downHistory", {
      idData: item.Key,
      idMenu: idMenu,
      breadcrumbs: breadcrumbs,
    });
  };

  const handleUpload = (item) => {
    onChangePage("editFile", {
      idData: item.Key,
      idMenu: idMenu,
      breadcrumbs: breadcrumbs,
    });
  };

  const renderSide = (sideMenu) => {
    if (sideMenu.length === 0)
      return <p className="text-danger text-center">No data available</p>;
    return sideMenu.map((menu) => (
      <div key={menu.idSta}>
        <div
          className={`text-start btn w-100 px-3 fw-medium py-1 mt-1 d-flex ${
            activeSide?.idSta === menu.idSta
              ? "bg-primary text-white"
              : "bg-light text-dark"
          } ${menu.children?.length > 0 ? "justify-content-between" : ""}`}
          style={{ cursor: "pointer" }}
        >
          <span
            onClick={() => {
              if (menu.children?.length > 0) {
                setActiveSide(menu);
                setCurrentFilter((prevFilter) => ({
                  ...prevFilter,
                  param1: menu.idSta,
                }));
              } else {
                setActiveSide(menu);
                setCurrentFilter((prevFilter) => ({
                  ...prevFilter,
                  param1: menu.idSta,
                }));
              }
            }}
          >
            {decodeHtml(menu.judulSta) || "Unnamed Menu"}
          </span>
          {menu.children?.length > 0 && (
            <Icon
              type="Bold"
              name={menu.isExpanded ? "angle-up" : "angle-down"}
              cssClass="me-2"
              style={{ marginTop: "2px" }}
              onClick={() => {
                if (menu.children?.length > 0) {
                  setSideMenu((prevSideMenu) =>
                    prevSideMenu.map((item) =>
                      item.idSta === menu.idSta
                        ? { ...item, isExpanded: !item.isExpanded }
                        : item
                    )
                  );
                }
              }}
            />
          )}
        </div>

        {/* Submenu Section */}
        {menu.children?.length > 0 && menu.isExpanded && (
          <div className="dropdown">
            {menu.children.map((sub) => (
              <div
                key={sub.idSta}
                className={`w-100 pe-4 py-1 d-flex ${
                  activeSide?.idSta === sub.idSta
                    ? "bg-primary text-white"
                    : "bg-light text-dark"
                }`}
                style={{ paddingLeft: "16px", cursor: "pointer" }}
                onClick={() => {
                  // Set submenu as active
                  setActiveSide(sub);
                  setCurrentFilter((prevFilter) => ({
                    ...prevFilter,
                    param1: sub.idSta,
                  }));
                }}
              >
                <Icon name="minus-small" cssClass="me-2 mt-1" />
                <span>{decodeHtml(sub.judulSta) || "Unnamed Submenu"}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    ));
  };

  if (error) return <p className="text-center">{error}</p>;

  return (
    <>
      <div className="d-flex flex-column min-vh-100">
        <main className="flex-grow-1 p-3" style={{ marginTop: "60px" }}>
          <div className="d-flex flex-column">
            <div className="m-4 px-4">
              <h1 style={{ color: "#2654A1", margin: "0", fontWeight: "700" }}>
                Indikator Kinerja
              </h1>
              <Breadcrumbs
                breadcrumbs={[
                  { label: "SPME" },
                  { label: "Indikator Kinerja" },
                ]}
              />
              <div className="mt-5">
                <div className="row m-0 g-1" style={{ overflowX: "auto" }}>
                  {[
                    "Indikator Kinerja Utama",
                    "Indikator Kinerja Tambahan",
                  ].map((label, index) => (
                    <div
                      key={index}
                      className="col-auto mb-0 d-flex justify-content-center"
                    >
                      <button
                        className={`btn ${
                          activeTab === index ? "shadow" : "btn-outline-white"
                        } rounded-top-2 rounded-bottom-0`}
                        style={{
                          backgroundColor: activeTab === index ? "#2654A1" : "",
                          color: activeTab === index ? "white" : "#AAA7A7",
                          fontSize: "16px",
                          padding: "10px 15px",
                          fontWeight: "650",
                          width: "auto",
                          whiteSpace: "nowrap",
                        }}
                        onClick={() => {
                          setCurrentFilter((prev) => {
                            return {
                              ...prev,
                              param6: index === 0 ? "IKU" : "IKT",
                            };
                          });
                          setActiveTab(index);
                        }}
                      >
                        {label || "Unnamed Tab"}
                      </button>
                    </div>
                  ))}
                </div>
                <div className="shadow p-3 mb-5  bg-white rounded">
                  <div className="row">
                    <div
                      className="col-lg-3"
                      style={{ overflowY: "auto", height: "65vh" }}
                    >
                      {renderSide(sideMenu)}
                    </div>
                    <div className="col-lg">
                      <div className="text-center">
                        <h3
                          style={{
                            color: "#2654A1",
                            margin: "0",
                            fontWeight: "700",
                          }}
                        >
                          {decodeHtml(activeSide?.judulSta || "Lorem Ipsum")}
                        </h3>
                      </div>

                      <div className="table-container bg-white mt-0 rounded">
                        <div className={isMobile ? "mb-3" : "row"}>
                          <div className="d-flex flex-wrap align-items-center gap-1">
                            {role === "ROL01" ? (
                              <div>
                                <Button
                                  iconName="add"
                                  classType="primary dropdown-toggle px-3 border-start"
                                  data-bs-toggle="dropdown"
                                  data-bs-auto-close="outside"
                                  label="Tambah Data"
                                />
                                <div className="dropdown-menu">
                                  {["IKU", "IKT"].map((label, index) => (
                                    <Button
                                      key={index}
                                      type="button"
                                      label={label}
                                      width="100%"
                                      boxShadow="0px 4px 6px rgba(0, 0, 0, 0)"
                                      onClick={() =>
                                        onChangePage("add", {
                                          idData:
                                            activeSide?.idSta ||
                                            activeTab?.idSta,
                                          idMenu: idMenu,
                                          dataName:
                                            activeSide?.judulSta ||
                                            activeTab?.judulSta,
                                          modew:
                                            index === 0 ? "utama" : "tambahan",
                                          breadcrumbs: breadcrumbs,
                                        })
                                      }
                                      style={{
                                        color: "#2654A1",
                                        textAlign: "left",
                                        cursor: "pointer",
                                      }}
                                      onMouseEnter={(e) => {
                                        e.target.style.backgroundColor =
                                          "#2654A1";
                                        e.target.style.color = "white";
                                      }}
                                      onMouseLeave={(e) => {
                                        e.target.style.backgroundColor =
                                          "white";
                                        e.target.style.color = "#2654A1";
                                      }}
                                    />
                                  ))}
                                </div>
                              </div>
                            ) : (
                              ""
                            )}

                            <div className="me-auto flex-grow-1 mt-3 me-3">
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

                            <div className="">
                              <Filter>
                                <DropDown
                                  arrData={arrSort}
                                  label="Urut Berdasarkan"
                                  type="pilih"
                                  defaultValue="[namaIka] ASC"
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
                                  label="Tahun"
                                  type="pilih"
                                  forInput="yearFilter"
                                  defaultValue={new Date().getFullYear()}
                                  onChange={(e) =>
                                    setStandarYear(e.target.value)
                                  }
                                />
                              </Filter>
                            </div>
                          </div>
                        </div>
                        {loading ? (
                          <Loading />
                        ) : (
                          <div>
                            <Table
                              arrHeader={["No", "Nama Indikator"]}
                              data={filteredData.map((item, index) => ({
                                Key: item.idIka,
                                No: (pageCurrent - 1) * pageSize + index + 1,
                                "Nama Indikator":
                                  decodeHtml(item.namaIka).replace(
                                    /<\/?[^>]+(>|$)/g,
                                    ""
                                  ) || "-",
                                //   PIC: item.picIka,
                                jenis: item.jenisIka,
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
                              onEdit={handleEdit}
                              onDetail={handleDetail}
                              //   onToggle={handleToggle}
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
                  </div>
                </div>
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
            <div className="p-5 mt-0 bg-white rounded shadow">
              <div className="row">
                <div className="col-lg-12 col-md-12">
                  <DetailData
                    label="Judul Dokumen"
                    isi={detail.judulDok ? detail.judulDok : "-"}
                  />
                </div>
                <div className="col-lg-6 col-md-6">
                  <DetailData
                    label="Nomor Dokumen"
                    isi={detail.noDok ? detail.noDok : "-"}
                  />
                  <DetailData
                    label="Jenis Dokumen"
                    isi={detail.controlDok ? detail.controlDok : "-"}
                  />
                </div>
                <div className="col-lg-6 col-md-6">
                  <DetailData
                    label="Tanggal Berlaku"
                    isi={
                      detail.tglDok
                        ? new Date(detail.tglDok).toLocaleDateString("id-ID", {
                            weekday: "long",
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })
                        : "-"
                    }
                  />
                  <DetailData
                    label="Tanggal Kadaluwarsa"
                    isi={
                      detail.expDok
                        ? new Date(detail.expDok).toLocaleDateString("id-ID", {
                            weekday: "long",
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })
                        : "-"
                    }
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-lg-6 col-md-6">
                  <DetailData
                    label="Dibuat Oleh"
                    isi={detail.createdBy ? detail.createdBy : "-"}
                  />
                  <DetailData
                    label="Dibuat Tanggal"
                    isi={
                      detail.createdDate
                        ? new Date(detail.createdDate).toLocaleDateString(
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
                <div className="col-lg-6 col-md-6">
                  <DetailData
                    label="Dimodifikasi Oleh"
                    isi={detail.modifiedBy ? detail.modifiedBy : "-"}
                  />
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
        {modalType === "preview" && (
          <Modal
            ref={ModalRef}
            title={detail.judulDok}
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
              <div style={{ width: "80vh", height: "70vh" }}>
                <canvas resource={DOKUMEN_LINK + detail.fileDok}></canvas>
                {loading ? (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: "white",
                      minHeight: "50vh",
                      margin: 0,
                    }}
                  >
                    <SyncLoader color="#0d6efd" loading={true} />
                  </div>
                ) : (
                  <embed
                    src={DOKUMEN_LINK + detail.fileDok}
                    type="application/pdf"
                    width="100%"
                    height="100%"
                    style={{
                      border: "none",
                    }}
                    onLoad={() => setLoading(true)}
                    onLoadedData={() => setLoading(false)}
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
