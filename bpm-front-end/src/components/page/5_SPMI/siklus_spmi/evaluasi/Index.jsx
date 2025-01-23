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
import SweetAlert from "../../../../util/SweetAlert";
import DetailData from "../../../../part/DetailData";
import ImagesCarousel from "../../../../part/ImagesCarousel";
import { SyncLoader } from "react-spinners";

// FROM DATABASE
// const data = [];
// const images = [];
// const textContent =
//   "";
// const title = "";
// const breadcrumbs = [];

const data = [
  {
    dok_id: 1,
    men_id: 5,
    dok_judul: "Document Title 1",
    dok_tgl_unduh: "2024-04-30 00:00:00",
    dok_tgl_akhir: "2020-03-28",
    dok_file: "file_1.pdf",
    dok_control: "Control-47",
    dok_status: "Archived",
    dok_status_delete: "Not Deleted",
    dok_created_by: "User1",
    dok_created_date: "2020-09-07 00:00:00",
    dok_modif_by: "User17",
    dok_modif_date: "2023-01-15 00:00:00",
    dok_nodok: "ND-9508",
    dok_ref: 1,
    dok_ref_name: "Pemantauan",
    dok_rev: 0,
    dok_tahun: 2023,
  },
  {
    dok_id: 2,
    men_id: 8,
    dok_judul: "Document Title 2",
    dok_tgl_unduh: "2024-06-12 00:00:00",
    dok_tgl_akhir: "2020-01-11",
    dok_file: "file_2.pdf",
    dok_control: "Control-57",
    dok_status: "Archived",
    dok_status_delete: "Not Deleted",
    dok_created_by: "User2",
    dok_created_date: "2024-06-26 00:00:00",
    dok_modif_by: "User5",
    dok_modif_date: "2022-09-08 00:00:00",
    dok_nodok: "ND-2559",
    dok_ref: 4,
    dok_ref_name: "Evaluasi Lain",
    dok_rev: 0,
    dok_tahun: 2023,
  },
  {
    dok_id: 3,
    men_id: 3,
    dok_judul: "Document Title 3",
    dok_tgl_unduh: "2024-07-06 00:00:00",
    dok_tgl_akhir: "2022-11-03",
    dok_file: "file_3.pdf",
    dok_control: "Control-81",
    dok_status: "Active",
    dok_status_delete: "Deleted",
    dok_created_by: "User3",
    dok_created_date: "2022-11-20 00:00:00",
    dok_modif_by: "User14",
    dok_modif_date: "2020-05-04 00:00:00",
    dok_nodok: "ND-3505",
    dok_ref: 3,
    dok_ref_name: "Audit Mutu Internal",
    dok_rev: 4,
    dok_tahun: 2024,
  },
  {
    dok_id: 4,
    men_id: 3,
    dok_judul: "Document Title 4",
    dok_tgl_unduh: "2023-07-28 00:00:00",
    dok_tgl_akhir: "2022-10-20",
    dok_file: "file_4.pdf",
    dok_control: "Control-64",
    dok_status: "Archived",
    dok_status_delete: "Not Deleted",
    dok_created_by: "User4",
    dok_created_date: "2024-06-19 00:00:00",
    dok_modif_by: "User10",
    dok_modif_date: "2020-06-11 00:00:00",
    dok_nodok: "ND-7816",
    dok_ref: 4,
    dok_ref_name: "Evaluasi Lain",
    dok_rev: 1,
    dok_tahun: 2022,
  },
  {
    dok_id: 5,
    men_id: 7,
    dok_judul: "Document Title 5",
    dok_tgl_unduh: "2020-12-04 00:00:00",
    dok_tgl_akhir: "2022-08-10",
    dok_file: "file_5.pdf",
    dok_control: "Control-40",
    dok_status: "Active",
    dok_status_delete: "Not Deleted",
    dok_created_by: "User5",
    dok_created_date: "2020-08-19 00:00:00",
    dok_modif_by: "User12",
    dok_modif_date: "2022-09-28 00:00:00",
    dok_nodok: "ND-1909",
    dok_ref: 2,
    dok_ref_name: "Evaluasi Diri",
    dok_rev: 5,
    dok_tahun: 2022,
  },
  {
    dok_id: 6,
    men_id: 3,
    dok_judul: "Document Title 6",
    dok_tgl_unduh: "2022-10-15 00:00:00",
    dok_tgl_akhir: "2020-06-26",
    dok_file: "file_6.pdf",
    dok_control: "Control-9",
    dok_status: "Active",
    dok_status_delete: "Not Deleted",
    dok_created_by: "User6",
    dok_created_date: "2020-09-26 00:00:00",
    dok_modif_by: "User20",
    dok_modif_date: "2024-03-04 00:00:00",
    dok_nodok: "ND-7545",
    dok_ref: 3,
    dok_ref_name: "Audit Mutu Internal",
    dok_rev: 1,
    dok_tahun: 2024,
  },
  {
    dok_id: 7,
    men_id: 7,
    dok_judul: "Document Title 7",
    dok_tgl_unduh: "2023-12-23 00:00:00",
    dok_tgl_akhir: "2020-10-21",
    dok_file: "file_7.pdf",
    dok_control: "Control-59",
    dok_status: "Inactive",
    dok_status_delete: "Not Deleted",
    dok_created_by: "User7",
    dok_created_date: "2021-04-07 00:00:00",
    dok_modif_by: "User20",
    dok_modif_date: "2023-01-14 00:00:00",
    dok_nodok: "ND-2803",
    dok_ref: 2,
    dok_ref_name: "Evaluasi Diri",
    dok_rev: 0,
    dok_tahun: 2021,
  },
  {
    dok_id: 8,
    men_id: 9,
    dok_judul: "Document Title 8",
    dok_tgl_unduh: "2023-10-21 00:00:00",
    dok_tgl_akhir: "2020-10-16",
    dok_file: "file_8.pdf",
    dok_control: "Control-25",
    dok_status: "Inactive",
    dok_status_delete: "Not Deleted",
    dok_created_by: "User8",
    dok_created_date: "2022-01-14 00:00:00",
    dok_modif_by: "User17",
    dok_modif_date: "2021-01-07 00:00:00",
    dok_nodok: "ND-9183",
    dok_ref: 2,
    dok_ref_name: "Evaluasi Diri",
    dok_rev: 2,
    dok_tahun: 2021,
  },
  {
    dok_id: 9,
    men_id: 3,
    dok_judul: "Document Title 9",
    dok_tgl_unduh: "2023-06-16 00:00:00",
    dok_tgl_akhir: "2024-01-17",
    dok_file: "file_9.pdf",
    dok_control: "Control-12",
    dok_status: "Archived",
    dok_status_delete: "Deleted",
    dok_created_by: "User9",
    dok_created_date: "2023-10-20 00:00:00",
    dok_modif_by: "User10",
    dok_modif_date: "2024-08-05 00:00:00",
    dok_nodok: "ND-9283",
    dok_ref: 4,
    dok_ref_name: "Evaluasi Lain",
    dok_rev: 2,
    dok_tahun: 2020,
  },
  {
    dok_id: 10,
    men_id: 8,
    dok_judul: "Document Title 10",
    dok_tgl_unduh: "2023-05-06 00:00:00",
    dok_tgl_akhir: "2024-01-26",
    dok_file: "file_10.pdf",
    dok_control: "Control-73",
    dok_status: "Archived",
    dok_status_delete: "Deleted",
    dok_created_by: "User10",
    dok_created_date: "2022-11-30 00:00:00",
    dok_modif_by: "User7",
    dok_modif_date: "2020-10-16 00:00:00",
    dok_nodok: "ND-9497",
    dok_ref: 3,
    dok_ref_name: "Audit Mutu Internal",
    dok_rev: 4,
    dok_tahun: 2021,
  },
  {
    dok_id: 11,
    men_id: 8,
    dok_judul: "Document Title 11",
    dok_tgl_unduh: "2020-06-26 00:00:00",
    dok_tgl_akhir: "2021-09-04",
    dok_file: "file_11.pdf",
    dok_control: "Control-76",
    dok_status: "Active",
    dok_status_delete: "Deleted",
    dok_created_by: "User11",
    dok_created_date: "2023-03-20 00:00:00",
    dok_modif_by: "User11",
    dok_modif_date: "2021-07-31 00:00:00",
    dok_nodok: "ND-9098",
    dok_ref: 3,
    dok_ref_name: "Audit Mutu Internal",
    dok_rev: 4,
    dok_tahun: 2023,
  },
  {
    dok_id: 12,
    men_id: 2,
    dok_judul: "Document Title 12",
    dok_tgl_unduh: "2024-03-21 00:00:00",
    dok_tgl_akhir: "2024-09-01",
    dok_file: "file_12.pdf",
    dok_control: "Control-93",
    dok_status: "Archived",
    dok_status_delete: "Deleted",
    dok_created_by: "User12",
    dok_created_date: "2021-08-31 00:00:00",
    dok_modif_by: "User11",
    dok_modif_date: "2023-01-23 00:00:00",
    dok_nodok: "ND-8610",
    dok_ref: 1,
    dok_ref_name: "Pemantauan",
    dok_rev: 0,
    dok_tahun: 2024,
  },
  {
    dok_id: 13,
    men_id: 5,
    dok_judul: "Document Title 13",
    dok_tgl_unduh: "2023-11-25 00:00:00",
    dok_tgl_akhir: "2020-09-05",
    dok_file: "file_13.pdf",
    dok_control: "Control-2",
    dok_status: "Active",
    dok_status_delete: "Deleted",
    dok_created_by: "User13",
    dok_created_date: "2024-09-10 00:00:00",
    dok_modif_by: "User3",
    dok_modif_date: "2022-05-10 00:00:00",
    dok_nodok: "ND-6897",
    dok_ref: 1,
    dok_ref_name: "Pemantauan",
    dok_rev: 0,
    dok_tahun: 2020,
  },
  {
    dok_id: 14,
    men_id: 9,
    dok_judul: "Document Title 14",
    dok_tgl_unduh: "2021-08-10 00:00:00",
    dok_tgl_akhir: "2024-12-01",
    dok_file: "file_14.pdf",
    dok_control: "Control-6",
    dok_status: "Active",
    dok_status_delete: "Deleted",
    dok_created_by: "User14",
    dok_created_date: "2021-09-06 00:00:00",
    dok_modif_by: "User14",
    dok_modif_date: "2021-03-16 00:00:00",
    dok_nodok: "ND-8112",
    dok_ref: 4,
    dok_ref_name: "Evaluasi Lain",
    dok_rev: 1,
    dok_tahun: 2020,
  },
  {
    dok_id: 15,
    men_id: 1,
    dok_judul: "Document Title 15",
    dok_tgl_unduh: "2022-07-09 00:00:00",
    dok_tgl_akhir: "2020-05-27",
    dok_file: "file_15.pdf",
    dok_control: "Control-82",
    dok_status: "Active",
    dok_status_delete: "Deleted",
    dok_created_by: "User15",
    dok_created_date: "2024-07-17 00:00:00",
    dok_modif_by: "User10",
    dok_modif_date: "2021-03-05 00:00:00",
    dok_nodok: "ND-8379",
    dok_ref: 1,
    dok_ref_name: "Pemantauan",
    dok_rev: 3,
    dok_tahun: 2020,
  },
  {
    dok_id: 16,
    men_id: 10,
    dok_judul: "Document Title 16",
    dok_tgl_unduh: "2023-03-18 00:00:00",
    dok_tgl_akhir: "2022-06-01",
    dok_file: "file_16.pdf",
    dok_control: "Control-69",
    dok_status: "Archived",
    dok_status_delete: "Deleted",
    dok_created_by: "User16",
    dok_created_date: "2024-12-08 00:00:00",
    dok_modif_by: "User15",
    dok_modif_date: "2022-03-03 00:00:00",
    dok_nodok: "ND-7708",
    dok_ref: 3,
    dok_ref_name: "Audit Mutu Internal",
    dok_rev: 2,
    dok_tahun: 2024,
  },
  {
    dok_id: 17,
    men_id: 1,
    dok_judul: "Document Title 17",
    dok_tgl_unduh: "2023-03-18 00:00:00",
    dok_tgl_akhir: "2021-07-29",
    dok_file: "file_17.pdf",
    dok_control: "Control-40",
    dok_status: "Archived",
    dok_status_delete: "Not Deleted",
    dok_created_by: "User17",
    dok_created_date: "2020-01-18 00:00:00",
    dok_modif_by: "User6",
    dok_modif_date: "2022-02-14 00:00:00",
    dok_nodok: "ND-6145",
    dok_ref: 4,
    dok_ref_name: "Evaluasi Lain",
    dok_rev: 2,
    dok_tahun: 2020,
  },
  {
    dok_id: 18,
    men_id: 10,
    dok_judul: "Document Title 18",
    dok_tgl_unduh: "2023-08-20 00:00:00",
    dok_tgl_akhir: "2021-08-24",
    dok_file: "file_18.pdf",
    dok_control: "Control-42",
    dok_status: "Active",
    dok_status_delete: "Not Deleted",
    dok_created_by: "User18",
    dok_created_date: "2023-10-25 00:00:00",
    dok_modif_by: "User2",
    dok_modif_date: "2023-11-03 00:00:00",
    dok_nodok: "ND-8516",
    dok_ref: 4,
    dok_ref_name: "Evaluasi Lain",
    dok_rev: 2,
    dok_tahun: 2024,
  },
  {
    dok_id: 19,
    men_id: 1,
    dok_judul: "Document Title 19",
    dok_tgl_unduh: "2022-05-29 00:00:00",
    dok_tgl_akhir: "2024-06-22",
    dok_file: "file_19.pdf",
    dok_control: "Control-48",
    dok_status: "Inactive",
    dok_status_delete: "Not Deleted",
    dok_created_by: "User19",
    dok_created_date: "2020-12-01 00:00:00",
    dok_modif_by: "User3",
    dok_modif_date: "2021-07-26 00:00:00",
    dok_nodok: "ND-7810",
    dok_ref: 2,
    dok_ref_name: "Evaluasi Diri",
    dok_rev: 3,
    dok_tahun: 2021,
  },
  {
    dok_id: 20,
    men_id: 9,
    dok_judul: "Document Title 20",
    dok_tgl_unduh: "2022-05-13 00:00:00",
    dok_tgl_akhir: "2023-06-18",
    dok_file: "file_20.pdf",
    dok_control: "Control-36",
    dok_status: "Active",
    dok_status_delete: "Not Deleted",
    dok_created_by: "User20",
    dok_created_date: "2024-01-22 00:00:00",
    dok_modif_by: "User19",
    dok_modif_date: "2021-04-07 00:00:00",
    dok_nodok: "ND-3730",
    dok_ref: 1,
    dok_ref_name: "Pemantauan",
    dok_rev: 3,
    dok_tahun: 2022,
  },
];
const images = [];
const textContent =
  "Lorem ipsum odor amet, consectetuer adipiscing elit. Curabitur dolor ultricies condimentum primis et, feugiat fusce donec? Ut enim hac sem convallis lectus ante litora volutpat quisque. Placerat mi torquent finibus tortor consequat euismod lobortis. Convallis lectus commodo viverra felis nisi tristique diam commodo. Cras ipsum in ullamcorper suscipit ad eleifend. Interdum dui lorem finibus proin dolor augue. Mollis facilisi neque platea vulputate, blandit dictum molestie. Nec cras donec quam consectetur etiam. Sapien ullamcorper nulla ligula interdum senectus ac inceptos tellus diam. Etiam lobortis conubia lobortis tellus orci aptent volutpat accumsan. Montes ultricies egestas montes quam inceptos quam. Eu ex sapien posuere eget fusce, scelerisque nunc quisque. Massa mus tristique massa tempor hac ut mauris placerat ligula. Nisl a gravida sit viverra dictum magnis. Euismod magnis ipsum ante varius lacus tellus. Lobortis potenti sociosqu efficitur amet orci non id dignissim. Laoreet potenti risus ad posuere elit. Convallis vehicula blandit orci eleifend tellus vehicula. Erat nibh nascetur primis tempor amet. Id volutpat consectetur lobortis enim natoque arcu sollicitudin aliquet. Ad consectetur pretium ullamcorper mauris dui malesuada. Malesuada primis leo amet nullam potenti viverra placerat eros suscipit. Integer consequat eu nostra ac pulvinar integer efficitur posuere. Taciti libero facilisis egestas nullam fringilla mus nam rhoncus. Aliquet viverra id nibh libero maximus placerat. Posuere cras inceptos penatibus sem sodales nostra gravida. In et quis elementum ut erat iaculis, augue mauris? Porttitor nulla nullam adipiscing faucibus; lacus dis pellentesque risus. Orci litora venenatis nisl nulla viverra ultricies eget pharetra. Finibus himenaeos augue ullamcorper magna nisi tellus.";
const title = "Evaluasi";
const breadcrumbs = [{ label: "Siklus SPMI" }, { label: "Evaluasi" }];

export default function Index({ onChangePage }) {
  const navigate = useNavigate();
  const ModalRef = useRef();
  const [detail, setDetail] = useState(null);
  const [modalType, setModalType] = useState(""); // "add", "edit", "detail"
  const [searchKeyword, setSearchKeyword] = useState(""); // Keyword pencarian
  const isMobile = useIsMobile();
  const [selectedDokRef, setSelectedDokRef] = useState(data[0] || null); // Set initial dok_ref based on the first item in data
  const [sortedData, setSortedData] = useState(data);
  const [isLoading, setIsLoading] = useState(true);

  const uniqueDokRefs = data
    .filter(
      (item, index, self) =>
        index === self.findIndex((obj) => obj.dok_ref === item.dok_ref)
    )
    .sort((a, b) => a.dok_ref - b.dok_ref);

  useEffect(() => {
    if (selectedDokRef !== null) {
      // Filter data by selected dok_ref and sort by dok_rev
      const filteredData = data.filter(
        (item) => item.dok_ref === selectedDokRef.dok_ref
      );

      let tempData = filteredData;

      if (searchKeyword) {
        tempData = tempData.filter((item) =>
          item.dok_judul.toLowerCase().includes(searchKeyword.toLowerCase())
        );
      }

      const sorted = tempData.sort(
        (a, b) => a.dok_created_date - b.dok_created_date
      );
      if (JSON.stringify(sorted) !== JSON.stringify(sortedData)) {
        setSortedData(sorted); // Update the sorted data only if it has changed
      }
    }
  }, [selectedDokRef, data, sortedData]);

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

  const [pageSize] = useState(10);
  const [pageCurrent, setPageCurrent] = useState(1);

  const handleEdit = (item) => {
    onChangePage("edit", { state: { editData: item } });
  };

  const indexOfLastData = pageCurrent * pageSize;
  const indexOfFirstData = indexOfLastData - pageSize;

  return (
    <>
      <div className="d-flex flex-column min-vh-100">
        <main className="flex-grow-1 p-3" style={{ marginTop: "60px" }}>
          <div className="d-flex flex-column">
            <div className="container mb-3">
              {/* CAROUSEL */}
              <ImagesCarousel images={images} />

              <div className="mt-5">
                <div className="d-flex justify-content-between align-items-center">
                  <h1
                    style={{ color: "#2654A1", margin: "0", fontWeight: "700" }}
                  >
                    {title ? title : "Page Title"}
                  </h1>
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

              <div className="mt-3 mb-5">
                <p style={{ textAlign: "justify" }}>
                  {textContent != ""
                    ? textContent
                    : "Lorem Ipsum dolor sit amet..."}
                </p>
              </div>

              <hr />

              <div className="container shadow p-3 mt-5 mb-5 bg-white rounded">
                <div className="row">
                  <div className="col-lg-2 px-3">
                    <div
                      className="row"
                      style={{ overflow: "auto", maxHeight: "500px" }}
                    >
                      {uniqueDokRefs.map((item) => (
                        <button
                          key={item.dok_ref}
                          onClick={() => setSelectedDokRef(item)}
                          className={`btn ${
                            selectedDokRef.dok_ref === item.dok_ref
                              ? "btn-primary"
                              : ""
                          } doc-item`}
                        >
                          {item.dok_ref_name}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="col-lg-10">
                    <div className="text-center">
                      <h3
                        style={{
                          color: "#2654A1",
                          margin: "0",
                          fontWeight: "700",
                        }}
                      >
                        {selectedDokRef.dok_ref_name}
                      </h3>
                    </div>
                    <hr />
                    <div className="table-container bg-white mt-0 rounded">
                      <div className={isMobile ? "mb-3" : "row"}>
                        <div className="col-12 d-flex flex-wrap align-items-center gap-1">
                          <div className="">
                            <Button
                              iconName="add"
                              classType="primary"
                              label="Tambah Dokumen"
                              onClick={() => onChangePage("add")}
                            />
                          </div>

                          <div className="me-auto flex-grow-1 mt-3 me-3">
                            <SearchField
                              onChange={(value) => setSearchKeyword(value)}
                            />
                          </div>

                          <div className="">
                            <Filter>
                              <div className="mb-3">
                                <label htmlFor="yearPicker" className="mb-1">
                                  Berdasarkan Tahun
                                </label>
                                <input
                                  type="number"
                                  className="form-control"
                                  placeholder="Masukkan Tahun"
                                  // value={selectedYear}
                                  // onChange={(e) =>
                                  //   setSelectedYear(e.target.value)
                                  // }
                                  min="2000"
                                  max={new Date().getFullYear()}
                                />
                              </div>

                              <Button
                                classType="btn btn-secondary"
                                title="Reset Filter"
                                label="Reset"
                                // onClick={resetFilter}
                              />
                            </Filter>
                          </div>
                        </div>
                      </div>
                      <Table
                        arrHeader={["No", "Dokumen"]}
                        headerToDataMap={{
                          No: "No",
                          Dokumen: "Dokumen",
                        }}
                        data={sortedData.map((item, index) => ({
                          key: item.dok_id || index,
                          No: indexOfFirstData + index + 1,
                          Dokumen: item.dok_judul,
                        }))}
                        actions={[
                          "Preview",
                          "Detail",
                          "Edit",
                          "Print",
                          "Delete",
                          "PrintHistory",
                          "UpdateHistory",
                        ]}
                        onPreview={(data) => {
                          console.log("prev");
                          const selected = sortedData.find(
                            (item) => item.dok_id == data.key
                          );
                          handleOpenModal("preview", selected);
                        }}
                        onEdit={handleEdit}
                        onDetail={(data) => {
                          const selected = sortedData.find(
                            (item) => item.dok_id == data.key
                          );
                          handleOpenModal("detail", selected);
                        }}
                        onPrint={() => console.log("printed")}
                        onDelete={(item) => handleDelete(item.key)}
                      />

                      <Paging
                        pageSize={pageSize}
                        pageCurrent={pageCurrent}
                        totalData={sortedData.length}
                        navigation={handlePageNavigation}
                      />
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
            size="medium"
            Button2={
              <Button
                classType="secondary"
                label="Tutup"
                onClick={() => ModalRef.current.close()}
              />
            }
          >
            <div className="p-3 mt-0 bg-white rounded shadow">
              <HeaderText label="Detail Dokumen" />
              <div className="row">
                <div className="col-lg-12 col-md-12">
                  <DetailData label="Judul Dokumen" isi={detail.dok_judul} />
                </div>
                <div className="col-lg-6 col-md-6">
                  <DetailData label="Nomor Dokumen" isi={detail.dok_nodok} />
                  <DetailData label="Jenis Dokumen" isi={detail.dok_control} />
                </div>
                <div className="col-lg-6 col-md-6">
                  <DetailData
                    label="Tanggal Berlaku"
                    isi={new Date(detail.dok_tahun).toLocaleDateString(
                      "id-ID",
                      {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      }
                    )}
                  />
                  <DetailData
                    label="Tanggal Kadaluarsa"
                    isi={new Date(detail.dok_tgl_akhir).toLocaleDateString(
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
                <div className="col-lg-6 col-md-6">
                  <DetailData label="Dibuat Oleh" isi={detail.dok_created_by} />
                  <DetailData
                    label="Dibuat Tanggal"
                    isi={new Date(detail.dok_created_date).toLocaleDateString(
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
                <div className="col-lg-6 col-md-6">
                  <DetailData
                    label="Dimodifikasi Oleh"
                    isi={detail.dok_modif_by}
                  />
                  <DetailData
                    label="Dimodifikasi Tanggal"
                    isi={new Date(detail.dok_modif_date).toLocaleDateString(
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
            </div>
          </Modal>
        )}
        {modalType === "preview" && (
          <Modal
            ref={ModalRef}
            title="Preview Dokumen"
            size="medium"
            Button2={
              <Button
                classType="secondary"
                label="Tutup"
                onClick={() => ModalRef.current.close()}
              />
            }
          >
            <div className="p-3 mt-0 bg-white rounded shadow">
              <HeaderText label="Preview Dokumen" />
              <div style={{ width: "90vh", height: "50vh" }}>
                {isLoading == true ? (
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
                    src={pdf}
                    width="100%"
                    height="100%"
                    type="application/pdf"
                    title="PDF Preview"
                    onLoad={() => setIsLoading(false)}
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
