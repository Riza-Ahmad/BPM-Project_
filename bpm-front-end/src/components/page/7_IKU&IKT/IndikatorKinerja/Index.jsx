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
  { Value: "[judulDok] ASC", Text: "Judul Dokumen [↑]" },
  { Value: "[judulDok] DESC", Text: "Judul Dokumen [↓]" },
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

export default function Index({ onChangePage, isIkuIkt }) {
  const location = useLocation();
  const idMenu = location.state?.idMenu;
  // console.log(location.state.idMenu);
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

  const [pageSize] = useState(10);
  const [pageCurrent, setPageCurrent] = useState(1);
  const [totalData, setTotalData] = useState(0);
  const [filteredData, setFilteredData] = useState([]);

  const [breadcrumbs, setBreadcrumbs] = useState([]);
  const [arrTahun, setArrTahun] = useState([]);
  const [error, setError] = useState("");

  const ModalRef = useRef();
  const [modalType, setModalType] = useState("");
  const [detail, setDetail] = useState(null);

  const [currentFilter, setCurrentFilter] = useState({
    param1: activeSide?.idSta || "",
    param2: "",
    param3: "[namaIka] ASC",
    param4: pageSize,
    param5: pageCurrent,
    param6: '',
  });

  useEffect(() => {
    setCurrentFilter((prevFilter) => ({
      ...prevFilter,
      param5: pageCurrent,
    }));
  }, [pageCurrent]);

  useEffect(() => {
    const fetchTahunDokumen = async () => {
      setLoading(true);
      const result = await useFetch(
        `${API_LINK}/MasterDokumen/GetListTahunDokumen`,
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
    const fetchKategori = async () => {
      setLoading(true);
      try {
        const result = await useFetch(
          `${API_LINK}/MasterStandar/GetDataStandarByTahun`,
          { tahun: new Date().getFullYear() },
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
        console.log(listMenu);
        const depth = calculateDepth(listMenu);
        console.log(depth);
        const sideMenuTransformed = listMenu[0]?.children;

        // switch (depth) {
        //   case 2:
        setTabMenu([]);
        setActiveTab(null);
        setSideMenu(listMenu);
        setActiveSide(sideMenuTransformed[0]);
        setCurrentFilter((prevFilter) => ({
          ...prevFilter,
          param1: sideMenuTransformed[0].idSta,
        }));
        //     break;
        //   default:
        //     setTabMenu(sideMenuTransformed);
        //     const firstTab = sideMenuTransformed[0];
        //     setActiveTab(firstTab);
        //     const side = firstTab.children || [];
        //     setSideMenu(side);

        //     if (side.length > 0) {
        //       const firstSide = side[0];
        //       setActiveSide(firstSide);
        //       setCurrentFilter((prevFilter) => ({
        //         ...prevFilter,
        //         param1: firstSide.idSta,
        //       }));
        //     }
        //     break;
        // }
      } catch (err) {
        console.error("Error fetching kategori:", err);
        setError("Gagal mengambil data: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchKategori();
  }, [location.state?.idMenu]);

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
      console.log(currentFilter);
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
      modew: item.jenis === 'IKU' ? 'utama' : 'tambahan',
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

  const handleToggle = (item) => {
    // Tampilkan konfirmasi menggunakan SweetAlert sebelum toggle status
    SweetAlert(
      "Konfirmasi",
      `Apakah Anda yakin ingin ${
        item.status === "Aktif" ? "menonaktifkan" : "mengaktifkan"
      } dokumen ini?`,
      "question",
      "Ya",
      null,
      "",
      true // Tampilkan tombol batal
    ).then((result) => {
      if (result) {
        // Jika pengguna mengonfirmasi, hanya simpan idDok dan status yang diperbarui
        const updatedData = filteredData
          .filter((data) => data.idDok === item.Key)
          .map((data) => ({
            idDok: data.idDok,
            status: data.status === "Aktif" ? "Tidak Aktif" : "Aktif",
          }));

        useFetch(`${API_LINK}/MasterDokumen/EditStatusDokumen`, updatedData[0])
          .then((response) => {
            if (response === "ERROR") {
              throw new Error("Gagal memperbarui data");
            }
            SweetAlert(
              "Berhasil!",
              updatedData[0].status === "Aktif"
                ? "Data dokumen berhasil diaktifkan"
                : "Data dokumen berhasil dinonaktifkan",
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

  const handleDownload = async (item) => {
    const id = item.Key;
    if (!id) {
      SweetAlert("Peringatan", "ID file tidak tersedia.", "warning");
      return;
    }

    try {
      const foundItem = filteredData.find((obj) => obj.idDok === id);
      const namaInformasi =
        foundItem && foundItem["fileDok"] ? foundItem["fileDok"] : `file_${id}`;

      const judulDok = foundItem.judulDok;
      const controlDok = foundItem.controlDok;
      const referensi = foundItem.refDok;
      const tanggal = new Date().toLocaleString();

      const response = await fetch(`${API_LINK}/MasterDokumen/DownloadFile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fileName: namaInformasi,
          metadata: {
            JudulDokumen: judulDok,
            JenisDokumen: controlDok,
            DiunduhOleh: namaPengguna,
            Jabatan: roleNama,
            TanggalUnduh: tanggal,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Gagal mengunduh file.");
      } else {
        const data = await useFetch(
          `${API_LINK}/MasterDokumen/CreateUnduhDokumen`,
          {
            idDok: id,
            referensi: referensi,
            role: role,
            roleNama: roleNama,
          },
          "POST"
        );
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = namaInformasi;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      SweetAlert("Error", error.message, "error");
    }
  };

  const renderTab = (list) => {
    if (!list || list.length === 0) {
      return null;
    }

    return list.map(({ idSta, judulSta }, index) => (
      <div className="nav-item mx-0" key={idSta}>
        <button
          onClick={() => handleTabClick(idSta, list[index])}
          className={`nav-link ${
            activeTab?.idSta === idSta ? " active" : ""
          } text-dark px-3`}
        >
          {judulSta || "Unnamed Tab"}
        </button>
      </div>
    ));
  };

  const handleTabClick = (idSta, item) => {
    setSideMenu(item?.children || []); // Set children of the clicked item as the new side menu
    setActiveTab(item); // Update the active tab
    setActiveSide(item?.children[0] || null);
    console.log(item?.children[0]);
    setCurrentFilter((prevFilter) => ({
      ...prevFilter,
      param1: idSta, // Update the filter with the clicked tab's ID
    }));
  };

  const renderSide = (sideMenu) => {
    if (sideMenu.length === 0)
      return <p className="text-danger text-center">No data available</p>;
    return sideMenu.map((menu) => (
      <div key={menu.idSta}>
        <div
          className={`btn w-100 px-3 fw-medium py-1 mt-1 d-flex ${
            activeSide?.idSta === menu.idSta
              ? "bg-primary text-white"
              : "bg-light text-dark"
          } ${menu.children?.length > 0 ? "justify-content-between" : ""}`}
          style={{ cursor: "pointer" }}
        >
          <span
            onClick={() => {
              if (menu.children?.length > 0) {
                // Toggle submenu visibility for items with children
                setActiveSide(menu);
                setCurrentFilter((prevFilter) => ({
                  ...prevFilter,
                  param1: menu.idSta,
                }));
                // setSideMenu((prevSideMenu) =>
                //   prevSideMenu.map((item) =>
                //     item.idSta === menu.idSta
                //       ? { ...item, isExpanded: !item.isExpanded }
                //       : item
                //   )
                // );
              } else {
                // Set the clicked menu as active for items without children
                setActiveSide(menu);
                setCurrentFilter((prevFilter) => ({
                  ...prevFilter,
                  param1: menu.idSta,
                }));
              }
            }}
          >
            {menu.judulSta || "Unnamed Menu"}
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
                <span>{sub.judulSta || "Unnamed Submenu"}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    ));
  };

  if (loading) return <Loading />;

  if (error) return <p className="text-center">{error}</p>;
  return (
    <>
      <div className="d-flex flex-column min-vh-100">
        <main className="flex-grow-1 p-3" style={{ marginTop: "60px" }}>
          <div className="d-flex flex-column">
            <div className="m-4 px-4">
              <h1 style={{ color: "#2654A1", margin: "0", fontWeight: "700" }}>
                IKU & IKT
              </h1>
              <Breadcrumbs breadcrumbs={breadcrumbs} />

              <div className="mt-4 mb-5">
                {menuData.deskripsiKdo != "" ? (
                  <p
                    style={{ textAlign: "justify" }}
                    dangerouslySetInnerHTML={{ __html: menuData.deskripsiKdo }}
                  ></p>
                ) : (
                  "Lorem Ipsum dolor sit amet..."
                )}
              </div>

              <hr />

              <div className="mt-5">
                <div className="nav nav-underline ms-2">
                  <div
                    className="d-flex"
                    style={{ overflow: "auto", maxWidth: "cover" }}
                  >
                    {renderTab(tabMenu)}
                  </div>
                </div>
                <div className="p-3 mb-5 bg-white rounded shadow">
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
                          {activeSide?.judulSta || activeTab?.judulSta}
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
                                      param3: e,
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
                                  defaultValue="[judulDok] ASC"
                                  forInput="sortFilter"
                                  onChange={(e) =>
                                    setCurrentFilter((prevFilter) => {
                                      return {
                                        ...prevFilter,
                                        param7: e.target.value,
                                      };
                                    })
                                  }
                                />
                                <DropDown
                                  arrData={arrTahun}
                                  label="Tahun Dokumen"
                                  type="semua"
                                  forInput="yearFilter"
                                  onChange={(e) =>
                                    setCurrentFilter((prevFilter) => {
                                      return {
                                        ...prevFilter,
                                        param4: e.target.value,
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
                        {loading ? (
                          <Loading />
                        ) : (
                          <div>
                            {role === "ROL01" ? (
                              <Table
                                arrHeader={["No", "Nama Indikator", "PIC"]}
                                data={filteredData.map((item, index) => ({
                                  Key: item.idIka,
                                  No: (pageCurrent - 1) * pageSize + index + 1,
                                  "Nama Indikator":
                                    decodeHtml(item.namaIka).replace(
                                      /<\/?[^>]+(>|$)/g,
                                      ""
                                    ) || "-",
                                  PIC: item.picIka,
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
                                onEdit={handleEdit}
                                onDetail={handleDetail}
                                onToggle={handleToggle}
                              />
                            ) : (
                              <div className="row p-3 gap-3 mb-2">
                                {filteredData.length > 0 ? (
                                  filteredData.map((item) => (
                                    <PdfPreviewDownload
                                      key={item.id} // Pastikan setiap item memiliki `key` unik
                                      judul={item.judulDok}
                                      handleClick={() => handleDownload(item)}
                                    />
                                  ))
                                ) : (
                                  <p className="text-center">
                                    No data available
                                  </p>
                                )}
                              </div>
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
