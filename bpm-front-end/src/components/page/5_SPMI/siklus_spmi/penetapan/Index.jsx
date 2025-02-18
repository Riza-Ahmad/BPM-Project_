import { useState, useRef, useEffect } from "react";
import Button from "../../../../part/Button";
import SearchField from "../../../../part/SearchField";
import Paging from "../../../../part/Paging";
import Table from "../../../../part/Table";
import Filter from "../../../../part/Filter";
import { useIsMobile } from "../../../../util/useIsMobile";
import { useLocation, useNavigate } from "react-router-dom";
import ImagesCarousel from "../../../../part/ImagesCarousel";
import Loading from "../../../../part/Loading";
import { useFetch } from "../../../../util/useFetch";
import { API_LINK } from "../../../../util/Constants";
import Icon from "../../../../part/Icon";
import { decodeHtml } from "../../../../util/DecodeHtml";
import Cookies from "js-cookie";
import DropDown from "../../../../part/Dropdown";

const arrSort = [
  { Value: "[namaIka] ASC", Text: "Nama Indikator [↑]" },
  { Value: "[namaIka] DESC", Text: "Nama Indikator [↓]" },
];
const arrTahun = [
  { Value: "2024", Text: "2024" },
  { Value: "2025", Text: "2025" },
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

export default function Index({ onChangePage }) {
  const location = useLocation();
  const idMenu = location.state?.idMenu;
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
  const isMobile = useIsMobile();

  const [loading, setLoading] = useState(true);
  const [menuData, setMenuData] = useState(inisialisasiMenuData);
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

  const [standarFilter, setStandarFilter] = useState(new Date().getFullYear());

  useEffect(() => {
    setCurrentFilter((prevFilter) => ({
      ...prevFilter,
      param5: pageCurrent,
    }));
  }, [pageCurrent]);

  const breadcrumbs = [{ label: "Siklus SPMI" }, { label: "Penetapan" }];

  const handleEdit = (item) => {
    onChangePage("edit", { state: { editData: item } });
  };

  useEffect(() => {
    const fetchMenu = async () => {
      setLoading(true);
      const result = await useFetch(
        `${API_LINK}/MasterKategoriDokumen/GetDataKategoriDokumenHeaderByIdMenu`,
        { idKdo: idMenu },
        "POST"
      ).finally(() => setLoading(false));

      if (result === "ERROR") {
        setMenuData([]);
      } else {
        const menuArr = Object.values(result);
        setMenuData(menuArr[0]);
        setMenuData((prevFilter) => {
          return {
            ...prevFilter,
            images: [
              menuArr[0].foto1Kdo,
              menuArr[0].foto2Kdo,
              menuArr[0].foto3Kdo,
            ],
          };
        });
      }
    };

    fetchMenu();
  }, []);

  useEffect(() => {
    const fetchStandar = async () => {
      setLoading(true);
      try {
        const result = await useFetch(
          `${API_LINK}/MasterStandar/GetDataStandarByTahun`,
          { tahun: standarFilter },
          "POST"
        );

        if (!result || result === "ERROR" || result.length === 0) {
          setMenuData(inisialisasiMenuData);
          setSideMenu([]);
          setActiveTab(null);
          setActiveSide(null);
          setCurrentFilter((prevFilter) => ({
            ...prevFilter,
            param1: "",
          }));
          return;
        }

        const arrResult = Object.values(result) || [];
        const listStandar = CreateMenu(arrResult) || [];

        // Ensure that listStandar[0] exists before accessing .children
        const sideMenuTransformed =
          listStandar.length > 0 ? listStandar[0]?.children || [] : [];

        setListStandar(listStandar);
        setActiveTab(0);
        setSideMenu(listStandar);

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
        window.scrollTo(0, 0);
        // console.error("Error fetching kategori:", err);
        // setError("Gagal mengambil data: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStandar();
  }, [standarFilter]);

  const fetchIndikatorKinerja = async () => {
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
    fetchIndikatorKinerja();
  }, [currentFilter, standarFilter]);

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

  const handleDetail = (item) => {
    onChangePage("detail", {
      idData: item.Key,
      idMenu: "",
      breadcrumbs: breadcrumbs,
    });
  };

  if (error) return <p className="text-center">{error}</p>;

  return (
    <>
      <div className="d-flex flex-column min-vh-100">
        <main className="flex-grow-1 p-3" style={{ marginTop: "60px" }}>
          <div className="d-flex flex-column">
            <div className="px-5 mx-5">
              <ImagesCarousel images={menuData.images} />

              <div className="mt-5">
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
                              onClick={() => navigate(breadcrumb.href)}
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

              <div className="mt-5 mb-5 bg-white rounded">
                <div className="d-flex justify-content-between align-items-center">
                  <h3
                    style={{ color: "#2654A1", margin: "0", fontWeight: "700" }}
                  >
                    Daftar Standar
                  </h3>
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
              </div>
              <div className="shadow p-3 mb-5 bg-white rounded">
                <div className="row">
                  <div
                    className="col-lg-3"
                    style={{ overflowY: "auto", maxHeight: "65vh" }}
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

                    <div className="bg-white mt-0 rounded">
                      <div className={isMobile ? "mb-3" : "row"}>
                        <div className="d-flex flex-wrap align-items-center gap-1">
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
                                  setStandarFilter(e.target.value)
                                }
                              />
                            </Filter>
                          </div>
                        </div>
                      </div>
                      {loading ? (
                        <Loading />
                      ) : (
                        <div className="table-container ">
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
                            aksiIs={false}
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
