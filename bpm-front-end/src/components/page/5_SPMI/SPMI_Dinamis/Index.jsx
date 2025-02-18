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
  idKdo: "",
  idMen: "",
  namaKdo: "",
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
    idKdo: "",
    idMen: "",
    namaKdo: "No Data Available",
    urutanKdo: "",
    parentKdo: null,
    statusKdo: "",
  },
];

export default function Index({ onChangePage }) {
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
    param1: activeSide?.idKdo || idMenu,
    param2: "Aktif",
    param3: "",
    param4: "",
    param5: pageSize,
    param6: pageCurrent,
    param7: "[judulDok] ASC",
  });

  useEffect(() => {
    setCurrentFilter((prevFilter) => ({
      ...prevFilter,
      param6: pageCurrent,
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
          `${API_LINK}/MasterKategoriDokumen/GetDataAllChildKategoriDokumenByIdMenu`,
          { idMenu: idMenu, childLimit: 4 },
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

        // Set Menu Data
        setMenuData({
          idKdo: firstResult.idKdo,
          idMen: firstResult.idMen,
          namaKdo: firstResult.namaKdo,
          deskripsiKdo: decodeHtml(firstResult.deskripsiKdo),
          images: [
            firstResult.foto1Kdo || "",
            firstResult.foto2Kdo || "",
            firstResult.foto3Kdo || "",
          ],
          urutanKdo: firstResult.urutanKdo,
          parentKdo: "",
          statusKdo: firstResult.statusKdo,
          createdByKdo: firstResult.createdByKdo,
          createdDateKdo: firstResult.createdDateKdo,
          modifByKdo: firstResult.modifByKdo,
          modifDateKdo: firstResult.modifDateKdo,
        });
        const listMenu = CreateMenu(arrResult);
        const depth = calculateDepth(listMenu);
        const sideMenuTransformed = listMenu[0]?.children;

        switch (depth) {
          case 2:
            setTabMenu([]);
            setActiveTab(null);
            setSideMenu(sideMenuTransformed);
            setActiveSide(sideMenuTransformed[0]);
            setCurrentFilter((prevFilter) => ({
              ...prevFilter,
              param1: sideMenuTransformed[0].idKdo,
            }));
            break;
          default:
            setTabMenu(sideMenuTransformed);
            const firstTab = sideMenuTransformed[0];
            setActiveTab(firstTab);
            const side = firstTab.children || [];
            setSideMenu(side);

            if (side.length > 0) {
              const firstSide = side[0];
              setActiveSide(firstSide);
              setCurrentFilter((prevFilter) => ({
                ...prevFilter,
                param1: firstSide.idKdo,
              }));
            }
            break;
        }
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

    if (!tempBradcrumps.some((item) => item.label === menuData.namaKdo)) {
      tempBradcrumps.push({
        label: menuData.namaKdo,
      });
    }

    setBreadcrumbs(tempBradcrumps);
  }, [menuData]);

  const fetchDokumen = async () => {
    setLoading(true);
    try {
      const result = await useFetch(
        `${API_LINK}/MasterDokumen/GetDataDokumenByKategori`,
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
        menuMap[item.idKdo] = { ...item, children: [] };
      });

      data.forEach((item) => {
        if (item.parentKdo) {
          menuMap[item.parentKdo]?.children.push(menuMap[item.idKdo]);
        } else {
          menuHierarchy.push(menuMap[item.idKdo]);
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
    const selected = filteredData.find((obj) => obj.idDok == item.Key);
    handleOpenModal("detail", selected);
  };

  const handleEdit = (item) => {
    onChangePage("edit", {
      idData: item.Key,
      idMenu: idMenu,
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

    return list.map(({ idKdo, namaKdo }, index) => (
      <div className="nav-item mx-0" key={idKdo}>
        <button
          onClick={() => handleTabClick(idKdo, list[index])}
          className={`nav-link ${
            activeTab?.idKdo === idKdo ? " active" : ""
          } text-dark px-3`}
        >
          {namaKdo || "Unnamed Tab"}
        </button>
      </div>
    ));
  };

  const handleTabClick = (idKdo, item) => {
    setSideMenu(item?.children || []); // Set children of the clicked item as the new side menu
    setActiveTab(item); // Update the active tab
    setActiveSide(item?.children[0] || null);
    setCurrentFilter((prevFilter) => ({
      ...prevFilter,
      param1: idKdo, // Update the filter with the clicked tab's ID
    }));
  };

  const renderSide = (sideMenu) => {
    if (sideMenu.length === 0)
      return <p className="text-danger text-center">No data available</p>;
    return sideMenu.map((menu) => (
      <div key={menu.idKdo}>
        <div
          className={`w-100 px-3 py-1 mt-1 d-flex ${
            activeSide?.idKdo === menu.idKdo
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
                  param1: menu.idKdo,
                }));
                // setSideMenu((prevSideMenu) =>
                //   prevSideMenu.map((item) =>
                //     item.idKdo === menu.idKdo
                //       ? { ...item, isExpanded: !item.isExpanded }
                //       : item
                //   )
                // );
              } else {
                // Set the clicked menu as active for items without children
                setActiveSide(menu);
                setCurrentFilter((prevFilter) => ({
                  ...prevFilter,
                  param1: menu.idKdo,
                }));
              }
            }}
          >
            {decodeHtml(menu.namaKdo) || "Unnamed Menu"}
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
                      item.idKdo === menu.idKdo
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
                key={sub.idKdo}
                className={`w-100 pe-4 py-1 d-flex fw-medium ${
                  activeSide?.idKdo === sub.idKdo
                    ? "bg-primary text-white"
                    : "bg-light text-dark"
                }`}
                style={{ paddingLeft: "16px", cursor: "pointer" }}
                onClick={() => {
                  // Set submenu as active
                  setActiveSide(sub);
                  setCurrentFilter((prevFilter) => ({
                    ...prevFilter,
                    param1: sub.idKdo,
                  }));
                }}
              >
                <Icon name="minus-small" cssClass="me-2 mt-1" />
                <span>{decodeHtml(sub.namaKdo) || "Unnamed Submenu"}</span>
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
            <div className="px-5 mx-5">
              <ImagesCarousel images={menuData.images} />
              <div className="mt-5 mb-3">
                <div className="d-flex justify-content-between align-items-center">
                  <h1
                    style={{ color: "#2654A1", margin: "0", fontWeight: "700" }}
                  >
                    {menuData?.namaKdo
                      ? decodeHtml(menuData.namaKdo)
                      : "Page Title"}
                  </h1>
                  {role === "ROL01" ? (
                    <Button
                      classType="btn btn-primary"
                      title="Edit Cover"
                      label="Edit Cover"
                      onClick={() =>
                        onChangePage("editKonten", {
                          breadcrumbs: breadcrumbs,
                          idData: menuData.idKdo,
                          idMenu: idMenu,
                        })
                      }
                    />
                  ) : (
                    ""
                  )}
                </div>

                <Breadcrumbs breadcrumbs={breadcrumbs} />
              </div>

              <div className="mt-4 mb-5">
                {menuData.deskripsiKdo != "" ? (
                  <p
                    style={{ textAlign: "justify" }}
                    dangerouslySetInnerHTML={{
                      __html: decodeHtml(menuData.deskripsiKdo),
                    }}
                  ></p>
                ) : (
                  "Lorem Ipsum dolor sit amet..."
                )}
              </div>

              <hr />

              <div className="mt-5">
                <div
                  className="nav nav-underline ms-2"
                  style={{ overflowX: "auto" }}
                >
                  {renderTab(tabMenu)}
                </div>
                <div className="p-3 mb-5 bg-white rounded shadow">
                  <div className="row">
                    <div className="col-lg-2">{renderSide(sideMenu)}</div>
                    <div className="col">
                      <div className="text-center">
                        <h3
                          style={{
                            color: "#2654A1",
                            margin: "0",
                            fontWeight: "700",
                          }}
                        >
                          {decodeHtml(activeSide?.namaKdo) ||
                            decodeHtml(activeTab?.namaKdo) ||
                            "Title"}
                        </h3>
                      </div>

                      <div className="table-container bg-white mt-0 rounded">
                        <div className={isMobile ? "mb-3" : "row"}>
                          <div className="d-flex flex-wrap align-items-center gap-1">
                            {role === "ROL01" ? (
                              <Button
                                iconName="add"
                                classType="primary"
                                label="Tambah Data"
                                onClick={() => {
                                  onChangePage("add", {
                                    idData:
                                      activeSide?.idKdo || activeTab?.idKdo,
                                    idMenu: idMenu,
                                    breadcrumbs: breadcrumbs,
                                  });
                                }}
                              />
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
                                arrHeader={["No", "Judul Dokumen"]}
                                data={filteredData.map((item, index) => ({
                                  Key: item.idDok,
                                  No: (pageCurrent - 1) * pageSize + index + 1,
                                  "Judul Dokumen": item.judulDok,
                                  status: item.status,
                                }))}
                                actions={(row) => {
                                  // Jika status "Tidak Aktif", hanya tampilkan Toggle
                                  if (row.status === "Tidak Aktif") {
                                    return ["Toggle"];
                                  }
                                  // Jika status selain "Tidak Aktif", tampilkan semua actions
                                  return [
                                    "Detail",
                                    "Preview",
                                    "Edit",
                                    "Upload",
                                    "Print",
                                    "UpdateHistory",
                                    "PrintHistory",
                                    "Toggle",
                                  ];
                                }}
                                onPreview={handlePreview}
                                onEdit={handleEdit}
                                onDetail={handleDetail}
                                onPrint={handleDownload}
                                onUpload={handleUpload}
                                onUpdateHistory={handleUpdateHistory}
                                onPrintHistory={handleDownloadHistory}
                                onToggle={handleToggle}
                              />
                            ) : (
                              <div className="row p-3 gap-3 mb-2">
                                {filteredData.length > 0 ? (
                                  filteredData.map((item) => (
                                    <PdfPreviewDownload
                                      key={item.idDok} // Pastikan setiap item memiliki `key` unik
                                      judul={item.judulDok}
                                      handleClick={() =>
                                        handleDownload({ Key: item.idDok })
                                      }
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
            <div className="p-5 mt-0 bg-white">
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
            <div className="mt-0 bg-white">
              <div style={{ width: "80vh", height: "70vh" }}>
                {loading == true ? (
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
