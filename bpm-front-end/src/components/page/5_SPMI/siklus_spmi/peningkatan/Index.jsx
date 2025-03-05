import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useIsMobile } from "../../../../util/useIsMobile";
import { API_LINK } from "../../../../util/Constants";
import { useFetch } from "../../../../util/useFetch";
import { decodeHtml } from "../../../../util/DecodeHtml";
import ImagesCarousel from "../../../../part/ImagesCarousel";
import DropDown from "../../../../part/Dropdown";
import Breadcrumbs from "../../../../part/Breadcrumbs";
import Button from "../../../../part/Button";
import SearchField from "../../../../part/SearchField";
import Filter from "../../../../part/Filter";
import Loading from "../../../../part/Loading";
import Table from "../../../../part/Table";
import Paging from "../../../../part/Paging";
import Modal from "../../../../part/Modal";
import Icon from "../../../../part/Icon";
import DetailData from "../../../../part/DetailData";
import PdfPreviewDownload from "../../../../part/PdfPreviewDownload";
import Cookies from "js-cookie";

const arrSort = [
  { Value: "[judulSta] ASC", Text: "Judul Standar [↑]" },
  { Value: "[judulSta] DESC", Text: "Judul Standar [↓]" },
  { Value: "[jenisSta] ASC", Text: "Jenis Standar [↑]" },
  { Value: "[jenisSta] DESC", Text: "Jenis Standar [↓]" },
  { Value: "[parentSta] ASC", Text: "Parent Standar [↑]" },
  { Value: "[parentSta] DESC", Text: "Parent Standar [↓]" },
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
    param1: "",
    param2: "Aktif",
    param3: "[jenisSta] ASC",
    param4: pageSize,
    param5: pageCurrent,
    param6: new Date().getFullYear(),
  });

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
    const fetchMenu = async () => {
      setLoading(true);
      const result = await useFetch(
        `${API_LINK}/MasterKategoriDokumen/GetDataKategoriDokumenHeaderByIdMenu`,
        { idKdo: idMenu },
        "POST"
      ).finally(() => setLoading(false));

      if (result === "ERROR" || !result || Object.keys(result).length === 0) {
        setMenuData([]);
      } else {
        const menuArr = Object.values(result);

        if (!menuArr[0]) {
          setMenuData([]);
          return;
        }

        setMenuData(menuArr[0]);
        setMenuData((prevFilter) => ({
          ...prevFilter,
          images: [
            menuArr[0].foto1Kdo,
            menuArr[0].foto2Kdo,
            menuArr[0].foto3Kdo,
          ],
        }));
      }
    };

    fetchMenu();
  }, [location.state?.idMenu]);

  useEffect(() => {
    const fetchKategori = async () => {
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

    fetchKategori();
  }, [currentFilter]);

  useEffect(() => {
    setCurrentFilter((prevFilter) => ({
      ...prevFilter,
      param5: pageCurrent,
    }));
  }, [pageCurrent]);

  const handleEdit = (item) => {
    onChangePage("edit", {
      idData: item.Key,
      idMenu: idMenu,
      breadcrumbs: breadcrumbs,
    });
  };

  const handleOpenModal = (type, data = null) => {
    setModalType(type);
    setDetail(data);
    ModalRef.current?.open();
  };

  const handleDetail = (item) => {
    const selected = filteredData.find((obj) => obj.idSta == item.Key);
    handleOpenModal("detail", selected);
  };

  useEffect(() => {
    let tempBradcrumps = [{ label: "SPMI" }, { label: "Siklus SPMI" }];

    if (!tempBradcrumps.some((item) => item.label === menuData.namaKdo)) {
      tempBradcrumps.push({
        label: menuData.namaKdo,
      });
    }

    setBreadcrumbs(tempBradcrumps);
  }, [menuData]);

  const truncateText = (text, maxLength) => {
    if (!text) return "";
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  if (error) return <p className="text-center">{error}</p>;
  return (
    <>
      <div className="d-flex flex-column min-vh-100">
        <main className="flex-grow-1 p-3" style={{ marginTop: "60px" }}>
          <div className="d-flex flex-column">
            <div className={isMobile ? "p-3" : "px-5 mx-5"}>
              <ImagesCarousel images={menuData.images} />
              <div className={isMobile ? "mt-3" : "mt-5"}>
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

              <div className="mt-4 mb-3">
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

              {/* <hr /> */}

              <div className="mb-5 bg-white">
                <div className="text-center">
                  <h3
                    style={{
                      color: "#2654A1",
                      margin: "0",
                      fontWeight: "700",
                    }}
                  >
                    {activeSide?.namaKdo || activeTab?.namaKdo}
                  </h3>
                </div>

                <div className="table-container bg-white mt-0 rounded">
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
                            defaultValue="[parentSta] ASC"
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
                  </div>
                  {loading ? (
                    <Loading />
                  ) : (
                    <div>
                      <Table
                        arrHeader={["No", "Nama Standar", "Bentuk Peningkatan"]}
                        data={filteredData.map((item, index) => ({
                          Key: item.idSta,
                          No: (pageCurrent - 1) * pageSize + index + 1,
                          "Nama Standar": item.judulSta,
                          "Bentuk Peningkatan": truncateText(
                            decodeHtml(decodeHtml(item.peningkatanSta)).replace(
                              /<\/?[^>]+(>|$)/g,
                              ""
                            ),
                            100
                          ),
                          status: item.status,
                        }))}
                        actions={(row) => {
                          if (role === "ROL01") {
                            return ["Detail", "Edit"];
                          }
                          return ["Detail"];
                        }}
                        onEdit={handleEdit}
                        onDetail={handleDetail}
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
        </main>

        {modalType === "detail" && (
          <Modal
            ref={ModalRef}
            title="Detail Peningkatan"
            size="medium"
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
                  <DetailData
                    label="Nama Standar"
                    isi={detail.judulSta ? detail.judulSta : "-"}
                  />
                </div>
                <div className="col-lg-12 col-md-12">
                  <DetailData
                    label="Bentuk Peningkatan"
                    isi={
                      detail.peningkatanSta
                        ? decodeHtml(decodeHtml(detail.peningkatanSta)).replace(
                            /<\/?[^>]+(>|$)/g,
                            ""
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
    </>
  );
}
