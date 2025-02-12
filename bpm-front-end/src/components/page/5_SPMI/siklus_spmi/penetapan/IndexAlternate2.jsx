import { useState, useRef, useEffect } from "react";
import Button from "../../../../part/Button";
import HeaderText from "../../../../part/HeaderText";
import Gedung from "../../../../../assets/element/gedung-astra-biru.png";
import Mahasiswa from "../../../../../assets/element/mahasiswa.png";
import SearchField from "../../../../part/SearchField";
import Paging from "../../../../part/Paging";
import gedung from "../../../../../assets/element/gedung-astra.png";
import Table from "../../../../part/Table";
import Modal from "../../../../part/Modal";
import Filter from "../../../../part/Filter";
import pdf from "../../MI_PRG4_M4_P2_XXX.pdf";
import { useIsMobile } from "../../../../util/useIsMobile";
import { useLocation, useNavigate } from "react-router-dom";
import DetailData from "../../../../part/DetailData";
import SweetAlert from "../../../../util/SweetAlert";
import { SyncLoader } from "react-spinners";
import ImagesCarousel from "../../../../part/ImagesCarousel";
import Loading from "../../../../part/Loading";
import { useFetch } from "../../../../util/useFetch";
import { API_LINK } from "../../../../util/Constants";
import Icon from "../../../../part/Icon";
import { decodeHtml } from "../../../../util/DecodeHtml";
import Cookies from "js-cookie";
import TabContainer from "./Tab";
import DropDown from "../../../../part/Dropdown";

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

export default function IndexAlternate2({ onChangePage }) {
  const activeUser = Cookies.get("activeUser");
  let role = ""; // Jika undefined, gunakan nilai default
  let roleNama = "";
  let namaPengguna = "";
  if (activeUser) {
    role = JSON.parse(activeUser).RoleID.slice(0, 5);
    roleNama = JSON.parse(activeUser).Role;
    namaPengguna = JSON.parse(activeUser).Nama;
  }

  const navigate = useNavigate();
  const ModalRef = useRef();
  const [detail, setDetail] = useState(null);
  const [modalType, setModalType] = useState(""); // "add", "edit", "detail"
  const [searchKeyword, setSearchKeyword] = useState(""); // Keyword pencarian
  const isMobile = useIsMobile();

  const [loading, setLoading] = useState(true);
  const [menuData, setMenuData] = useState(inisialisasiMenuData);
  const [tabMenu, setTabMenu] = useState(inisialisasiSideMenuData);
  const [sideMenu, setSideMenu] = useState(inisialisasiSideMenuData);
  const [listStandar, setListStandar] = useState(inisialisasiSideMenuData);
  const [activeTab, setActiveTab] = useState(null);
  const [activeSide, setActiveSide] = useState(null);
  const [error, setError] = useState("");

  const [pageSize] = useState(10);
  const [pageCurrent, setPageCurrent] = useState(1);
  const [totalData, setTotalData] = useState(0);
  const [filteredData, setFilteredData] = useState([]);

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

  const images = [];

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

  const arrData = [
    { Value: "Controlled Copy", Text: "Controlled Copy" },
    { Value: "Uncontrolled Copy", Text: "Uncontrolled Copy" },
  ];

  const handlePageNavigation = (page) => {
    setPageCurrent(page);
  };

  const handleDocNav = (page) => {
    setPageCurrent(page);
  };

  const handleOpenModal = (type, data = null) => {
    setModalType(type);
    setDetail(data);
    ModalRef.current.open();
  };

  const textContent =
    "Lorem ipsum odor amet, consectetuer adipiscing elit. Curabitur dolor ultricies condimentum primis et, feugiat fusce donec? Ut enim hac sem convallis lectus ante litora volutpat quisque. Placerat mi torquent finibus tortor consequat euismod lobortis. Convallis lectus commodo viverra felis nisi tristique diam commodo. Cras ipsum in ullamcorper suscipit ad eleifend. Interdum dui lorem finibus proin dolor augue. Mollis facilisi neque platea vulputate, blandit dictum molestie. Nec cras donec quam consectetur etiam. Sapien ullamcorper nulla ligula interdum senectus ac inceptos tellus diam. Etiam lobortis conubia lobortis tellus orci aptent volutpat accumsan. Montes ultricies egestas montes quam inceptos quam. Eu ex sapien posuere eget fusce, scelerisque nunc quisque. Massa mus tristique massa tempor hac ut mauris placerat ligula. Nisl a gravida sit viverra dictum magnis. Euismod magnis ipsum ante varius lacus tellus. Lobortis potenti sociosqu efficitur amet orci non id dignissim. Laoreet potenti risus ad posuere elit. Convallis vehicula blandit orci eleifend tellus vehicula. Erat nibh nascetur primis tempor amet. Id volutpat consectetur lobortis enim natoque arcu sollicitudin aliquet. Ad consectetur pretium ullamcorper mauris dui malesuada. Malesuada primis leo amet nullam potenti viverra placerat eros suscipit. Integer consequat eu nostra ac pulvinar integer efficitur posuere. Taciti libero facilisis egestas nullam fringilla mus nam rhoncus. Aliquet viverra id nibh libero maximus placerat. Posuere cras inceptos penatibus sem sodales nostra gravida. In et quis elementum ut erat iaculis, augue mauris? Porttitor nulla nullam adipiscing faucibus; lacus dis pellentesque risus. Orci litora venenatis nisl nulla viverra ultricies eget pharetra. Finibus himenaeos augue ullamcorper magna nisi tellus.";

  const title = "Penetapan";
  const breadcrumbs = [{ label: "Siklus SPMI" }, { label: "Penetapan" }];

  const handleEdit = (item) => {
    onChangePage("edit", { state: { editData: item } });
  };

  useEffect(() => {
    const fetchStandar = async () => {
      setLoading(true);
      try {
        const result = await useFetch(
          `${API_LINK}/MasterStandar/GetDataStandarByTahun`,
          { tahun: new Date().getFullYear() },
          "POST"
        );

        if (!result || result === "ERROR" || result.length === 0) {
          setListStandar([]);
          setCurrentFilter((prevFilter) => ({
            ...prevFilter,
            param1: "",
          }));
          return;
        }

        const arrResult = Object.values(result);
        const listStandar = CreateMenu(arrResult);
        console.log(listStandar);
        const sideMenuTransformed = listStandar[0]?.children;

        setListStandar(listStandar);
        setTabMenu([]);
        setActiveTab(0);
        setSideMenu(listStandar);
        setActiveSide(sideMenuTransformed[0]);
        setCurrentFilter((prevFilter) => ({
          ...prevFilter,
          param1: sideMenuTransformed[0].idSta,
        }));
      } catch (err) {
        console.error("Error fetching kategori:", err);
        setError("Gagal mengambil data: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStandar();
  }, [location.state?.idMenu]);

  const fetchIndikatorKinerja = async () => {
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
    fetchIndikatorKinerja();
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

  const renderStandar = (sideMenu) => {
    if (listStandar.length === 0)
      return <p className="text-danger text-center">No data available</p>;
    return listStandar.map((menu) => (
      <div className="col-lg-4 " key={menu.idSta}>
        <div className="mt-3 shadow rounded-4 ">
          <div
            className="rounded-4 bg-primary bg-gradient text-white p-4 d-flex flex-column justify-content-between"
            style={{ minHeight: "20vh" }}
          >
            <div className="h3 text-start">{menu.judulSta || "-"}</div>
            <div className="fw-100 text-light">
              Standar {menu.jenisSta || "-"}
            </div>
            <div className="d-flex justify-content-between align-items-end">
              <div>
                {menu.children?.length > 0 && (
                  <button
                    className="btn btn-light rounded-4"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={`#collapse${menu.idSta}`}
                    aria-expanded="false"
                  >
                    <span className="fw-300">Lihat Sub Standar</span>
                  </button>
                )}
              </div>
              <div className="row align-items-end">
                <i
                  className="fi fi-rr-features text-white"
                  style={{ fontSize: "4rem" }}
                ></i>
              </div>
            </div>
          </div>
          {menu.children?.length > 0 && (
            <div className="collapse" id={`collapse${menu.idSta}`}>
              <div className="rounded-4 p-4">
                {menu.children.map((sub) => (
                  <p key={sub.idSta}>{sub.judulSta}</p>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    ));
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
            className="text-start"
            onClick={() => {
              if (menu.children?.length > 0) {
                // Toggle submenu visibility for items with children
                setActiveSide(menu);
                setCurrentFilter((prevFilter) => ({
                  ...prevFilter,
                  param1: menu.idSta,
                }));
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

  const handleDetail = (item) => {
    onChangePage("detail", {
      idData: item.Key,
      idMenu: idMenu,
      breadcrumbs: breadcrumbs,
    });
  };

  if (loading) return <Loading />;

  if (error) return <p className="text-center">{error}</p>;

  return (
    <>
      <div className="d-flex flex-column min-vh-100">
        <main className="flex-grow-1 p-3" style={{ marginTop: "60px" }}>
          <div className="d-flex flex-column">
            <div className="px-5 mx-5">
              <ImagesCarousel images={images} />

              <div className="mt-5">
                <div className="d-flex justify-content-between align-items-center">
                  <h1
                    style={{ color: "#2654A1", margin: "0", fontWeight: "700" }}
                  >
                    {title ? title : "Page Title"}
                  </h1>
                  {role === "ROL01" ? (
                    <Button
                      classType="btn btn-primary"
                      title="Kelola Cover"
                      label="Kelola Cover"
                      onClick={() => onChangePage("kelola")}
                    />
                  ) : (
                    ""
                  )}
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
                              onClick={() => navigate(breadcrumb.href)} // Use navigate for programmatic routing
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

              <div className="mt-3 mb-5">
                <p style={{ textAlign: "justify" }}>
                  {textContent != ""
                    ? textContent
                    : "Lorem Ipsum dolor sit amet..."}
                </p>
              </div>

              <div className="mt-5 mb-5 bg-white rounded">
                <div className="d-flex justify-content-between align-items-center">
                  <h3
                    style={{ color: "#2654A1", margin: "0", fontWeight: "700" }}
                  >
                    Daftar Standar
                  </h3>
                  {role === "ROL01" ? (
                    <Button
                      classType="btn btn-primary"
                      title="Kelola Standar"
                      label="Kelola Standar"
                      onClick={() => onChangePage("read")}
                    />
                  ) : (
                    ""
                  )}
                </div>
                <hr />
                <div className="mb-5 ">
                  <div className="row">{renderStandar(listStandar)}</div>
                </div>
              </div>
            </div>

            <div className="mt-3 px-5 mx-5">
              <h3 style={{ color: "#2654A1", margin: "0", fontWeight: "700" }}>
                Daftar Indikator Kinerja
              </h3>
              <hr />
              <div className="mt-1">
                <div
                  className="nav nav-underline ms-2"
                  style={{ overflowX: "auto" }}
                >
                  {[
                    "Indikator Kinerja Utama",
                    "Indikator Kinerja Tambahan",
                  ].map((label, index) => (
                    <div className="nav-item mx-0" key={index}>
                      <button
                        onClick={() => {
                          console.log(index);
                          setCurrentFilter((prev) => {
                            return {
                              ...prev,
                              param6: index === 0 ? "IKU" : "IKT",
                            };
                          });
                          setActiveTab(index);
                        }}
                        className={`nav-link ${
                          activeTab === index ? " active " : ""
                        } text-dark px-3`}
                      >
                        {label}
                      </button>
                    </div>
                  ))}
                </div>
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
                        {activeSide?.judulSta || activeTab?.judulSta}
                      </h3>
                    </div>

                    <div className="table-container bg-white mt-0 rounded">
                      <div className={isMobile ? "mb-3" : "row"}>
                        <div className="d-flex flex-wrap align-items-center gap-1">
                          {/* {role === "ROL01" ? (
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
                                          activeSide?.idSta || activeTab?.idSta,
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
                                      e.target.style.backgroundColor = "white";
                                      e.target.style.color = "#2654A1";
                                    }}
                                  />
                                ))}
                              </div>
                            </div>
                          ) : (
                            ""
                          )} */}

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

                          {/* <div className="">
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
                                      param7: e.target.value,
                                    };
                                  })
                                }
                              />
                              <DropDown
                                // arrData={arrTahun}
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
                          </div> */}
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
        </main>
      </div>
    </>
  );
}
