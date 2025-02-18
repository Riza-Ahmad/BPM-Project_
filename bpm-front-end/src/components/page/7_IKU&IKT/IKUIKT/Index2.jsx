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

const arrData = [
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

export default function Index2({ onChangePage, isIkuIkt }) {
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
    param1: activeSide?.idSta || idMenu,
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

        setTabMenu([]);
        setActiveTab(null);
        setSideMenu(listMenu);
        setActiveSide(listMenu[0]);
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
    let tempBradcrumps = [{ label: "SPME" }, { label: "IKU & IKT" }];

    if (!tempBradcrumps.some((item) => item.label === menuData.judulSta)) {
      tempBradcrumps.push({
        label: menuData.judulSta,
      });
    }

    setBreadcrumbs(tempBradcrumps);
  }, [menuData]);

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
      <div className="col-lg-4 " key={menu.idSta}>
        <div className="mt-3 shadow rounded-4 ">
          <div
            className="rounded-4 bg-primary bg-gradient text-white p-4 d-flex flex-column justify-content-between"
            style={{ minHeight: "20vh" }}
          >
            <div className="h3 text-start">{menu.judulSta || "-"}</div>
            <div className="fw-100 text-light">Standar {menu.jenisSta || "-"}</div>
            <div className="d-flex justify-content-between align-items-end">
              <div>
                <button className="btn btn-light rounded-4 me-2">
                  <span className="fw-300">Lihat Indikator Kinerja</span>
                </button>
                {menu.children?.length > 0 && (
                  <button
                    className="btn btn-outline-light rounded-4"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={`#collapse${menu.idSta}`}
                    aria-expanded="false"
                  >
                    <span className="fw-300">Lihat Sub</span>
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
              <div className="mt-5">
                <div className="mb-5 ">
                  <div className="row my-2">{renderSide(sideMenu)}</div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
