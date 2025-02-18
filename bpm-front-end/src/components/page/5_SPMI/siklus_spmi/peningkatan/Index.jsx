import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useIsMobile } from "../../../../util/useIsMobile";
import { API_LINK } from "../../../../util/Constants";
import { useFetch } from "../../../../util/useFetch";
import { decodeHtml } from "../../../../util/DecodeHtml";
import { SyncLoader } from "react-spinners";
import { DOKUMEN_LINK } from "../../../../util/Constants";
import SweetAlert from "../../../../util/SweetAlert";
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

  useEffect(() => {
    let tempBradcrumps = [{ label: "SPMI" }, { label: "Siklus SPMI" }];

    if (!tempBradcrumps.some((item) => item.label === menuData.namaKdo)) {
      tempBradcrumps.push({
        label: menuData.namaKdo,
      });
    }

    setBreadcrumbs(tempBradcrumps);
  }, [menuData]);

  //   if (loading) return <Loading />;

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

              <div className="p-3 mb-5 bg-white">
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
                          "Bentuk Peningkatan":
                            decodeHtml(decodeHtml(item.peningkatanSta)).replace(
                              /<\/?[^>]+(>|$)/g,
                              ""
                            ) || "-",
                          status: item.status,
                        }))}
                        actions={(row) => {
                          // Jika status "Tidak Aktif", hanya tampilkan Toggle
                          if (row.status === "Tidak Aktif") {
                            return ["Toggle"];
                          }
                          // Jika status selain "Tidak Aktif", tampilkan semua actions
                          return ["Edit"];
                        }}
                        aksiIs={role === "ROL01" ? true : false}
                        onEdit={handleEdit}
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
