import { useState, useRef } from "react";
import Button from "../../../../part/Button";
import Gedung from "../../../../../assets/element/gedung-astra-biru.png";
import Mahasiswa from "../../../../../assets/element/mahasiswa.png";
import SearchField from "../../../../part/SearchField";
import Paging from "../../../../part/Paging";
import gedung from "../../../../../assets/element/gedung-astra.png";
import Table from "../../../../part/Table";
import Modal from "../../../../part/Modal";
import ImagesCarousel from "../../../../part/ImagesCarousel";
import pdf from "../../MI_PRG4_M4_P2_XXX.pdf";
import { useLocation, useNavigate } from "react-router-dom";

const data = [
  {
    Key: 1,
    Aspek: "Pengelolaan SPMI Institusi",
    Bukti: "Dokumen revisi SOP Pengelolaan SPMI",
  },
  {
    Key: 2,
    Aspek: "Standar Pendidikan",
    Bukti: "Penambahan Standar Kompetensi Lulusan",
  },
  {
    Key: 3,
    Aspek: "Standar Identitas Diri",
    Bukti: "Revisi Buku Panduan Identitas Institusi",
  },
  {
    Key: 4,
    Aspek: "Standar Pengabdian kepada Masyarakat",
    Bukti: "Revisi prosedur pelaksanaan kegiatan pengabdian",
  }
];

const images = [];

export default function Index({ onChangePage }) {
  const navigate = useNavigate();
  const detailModalRef = useRef();
  const [detail, setDetail] = useState("");

  const handlePageNavigation = (page) => {
    setPageCurrent(page);
  };

  const handleShowDetail = (key) => {
    detailModalRef.current.open();
    setDetail(data[key]);
  };

  const textContent =
    "Lorem ipsum odor amet, consectetuer adipiscing elit. Curabitur dolor ultricies condimentum primis et, feugiat fusce donec? Ut enim hac sem convallis lectus ante litora volutpat quisque. Placerat mi torquent finibus tortor consequat euismod lobortis. Convallis lectus commodo viverra felis nisi tristique diam commodo. Cras ipsum in ullamcorper suscipit ad eleifend. Interdum dui lorem finibus proin dolor augue. Mollis facilisi neque platea vulputate, blandit dictum molestie. Nec cras donec quam consectetur etiam. Sapien ullamcorper nulla ligula interdum senectus ac inceptos tellus diam. Etiam lobortis conubia lobortis tellus orci aptent volutpat accumsan. Montes ultricies egestas montes quam inceptos quam. Eu ex sapien posuere eget fusce, scelerisque nunc quisque. Massa mus tristique massa tempor hac ut mauris placerat ligula. Nisl a gravida sit viverra dictum magnis. Euismod magnis ipsum ante varius lacus tellus. Lobortis potenti sociosqu efficitur amet orci non id dignissim. Laoreet potenti risus ad posuere elit. Convallis vehicula blandit orci eleifend tellus vehicula. Erat nibh nascetur primis tempor amet. Id volutpat consectetur lobortis enim natoque arcu sollicitudin aliquet. Ad consectetur pretium ullamcorper mauris dui malesuada. Malesuada primis leo amet nullam potenti viverra placerat eros suscipit. Integer consequat eu nostra ac pulvinar integer efficitur posuere. Taciti libero facilisis egestas nullam fringilla mus nam rhoncus. Aliquet viverra id nibh libero maximus placerat. Posuere cras inceptos penatibus sem sodales nostra gravida. In et quis elementum ut erat iaculis, augue mauris? Porttitor nulla nullam adipiscing faucibus; lacus dis pellentesque risus. Orci litora venenatis nisl nulla viverra ultricies eget pharetra. Finibus himenaeos augue ullamcorper magna nisi tellus.";

  const [pageSize] = useState(10);
  const [pageCurrent, setPageCurrent] = useState(1);



  // console.log(menuData);
  const title = "Peningkatan";
  const breadcrumbs = [{ label: "Siklus SPMI" }, { label: "Peningkatan" }];

  const handleEdit = (item) => {
    onChangePage("edit", { state: { editData: item } });
  };

  const indexOfLastData = pageCurrent * pageSize;
  const indexOfFirstData = indexOfLastData - pageSize;
  const currentData = data.slice(indexOfFirstData, indexOfLastData);

  return (
    <>
      <div className="d-flex flex-column min-vh-100">
        <main className="flex-grow-1 p-3" style={{ marginTop: "80px" }}>
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

              <div className="table-container bg-white mt-4 rounded">
                <div className="row mt-3 ">
                  <div className="col-lg-2 col-md-6 ">
                    <Button
                      iconName="add"
                      classType="primary"
                      label="Tambah Dokumen"
                      onClick={() => onChangePage("add")}
                    />
                  </div>
                  <div className="col-lg-8 col-md-6 ">
                    <SearchField></SearchField>
                  </div>
                  <div className="col-lg-2 col-md-6">
                    <Button
                      iconName="settings-sliders"
                      classType="primary"
                      label="Filter"
                      // onClick={() => detailModalRef.current.open()}
                    />
                  </div>
                </div>
                <Table
                  arrHeader={["No", "Aspek Peningkatan", "Bukti Peningkatan"]}
                  headerToDataMap={{
                    No: "No",
                    "Aspek Peningkatan": "Aspek Peningkatan",
                    "Bukti Peningkatan": "Bukti Peningkatan",
                  }}
                  data={currentData.map((item, index) => ({
                    key: item.Key || index,
                    No: indexOfFirstData + index + 1,
                    "Aspek Peningkatan": item.Aspek,
                    "Bukti Peningkatan": item.Bukti,
                  }))}
                  actions={["Detail", "Edit", "Print", "Delete", "PrintHistory", "UpdateHistory"]}
                  onEdit={handleEdit}
                  onDetail={() => handleShowDetail()}
                  onPrint={() => console.log("printed")}
                />

                <Paging
                  pageSize={pageSize}
                  pageCurrent={pageCurrent}
                  totalData={data.length}
                  navigation={handlePageNavigation}
                />
              </div>
            </div>
          </div>
        </main>

        <Modal ref={detailModalRef} title="Detail Dokumen" size="medium">
          <div className="p-3 mt-0 bg-white rounded shadow">
            <div className="mb-3">
              <label className="form-label fw-bold mb-0">Judul Dokumen</label>
              <br />
              <p>Dokumen Materi Pemrograman</p>
            </div>
            <div className="row">
              <div className="col-lg-6 col-md-6 ">
                <div className="mb-3">
                  <label className="form-label fw-bold mb-0">
                    Nomor Induk Dokumen
                  </label>
                  <br />
                  <p>XX/XXXX/XXX</p>
                </div>
              </div>
              <div className="col-lg-6 col-md-6">
                <div className="mb-3">
                  <label className="form-label fw-bold mb-0">
                    Tahun Dokumen
                  </label>
                  <br />
                  <p>2022/2023</p>
                </div>
              </div>
              <div className="col-lg-6 col-md-6">
                <div className="mb-3">
                  <label className="form-label fw-bold mb-0">
                    Jenis Dokumen
                  </label>
                  <br />
                  <p>Controlled Copy</p>
                </div>
              </div>
              <div className="col-lg-6 col-md-6">
                <div className="mb-3">
                  <label className="form-label fw-bold mb-0">
                    Tahun Kadaluarsa
                  </label>
                  <br />
                  <p>2022/2023</p>
                </div>
              </div>
            </div>
          </div>
          <form
            className="p-3 mt-3 bg-white rounded shadow"
            style={{ overflow: "auto" }}
          >
            <iframe
              src={pdf}
              frameborder="2"
              height={"500px"}
              width={"100%"}
            ></iframe>
          </form>
        </Modal>
      </div>
    </>
  );
}
