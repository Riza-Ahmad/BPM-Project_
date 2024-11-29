import { useState, useRef } from "react";
import Button from "../../../../part/Button";
import HeaderText from "../../../../part/HeaderText";
import Gedung from "../../../../../assets/element/gedung-astra-biru.png";
import Mahasiswa from "../../../../../assets/element/mahasiswa.png";
import SearchField from "../../../../part/SearchField";
import CardBerita from "../../../../part/CardBerita";
import Paging from "../../../../part/Paging";
import PageTitleNav from "../../../../part/PageTitleNav";
import gedung from "../../../../../assets/element/gedung-astra.png";
import Table from "../../../../part/Table";
import Modal from "../../../../part/Modal";
import TextField from "../../../../part/TextField";
import DropDown from "../../../../part/Dropdown";
import pdf from "../../MI_PRG4_M4_P2_XXX.pdf";
import { useLocation, useNavigate } from "react-router-dom";

export default function Index({ onChangePage }) {
  const navigate = useNavigate();
  const detailModalRef = useRef();
  const [detail, setDetail] = useState("");

  const arrData = [
    { Value: "Controlled Copy", Text: "Controlled Copy" },
    { Value: "Uncontrolled Copy", Text: "Uncontrolled Copy" },
  ];

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

  // Menambahkan data menjadi 10 item dengan URL gambar
  const data = [
    {
      Key: 1,
      Dokumen: "SK NO39/09230/SK/2024",
      Src: "bpm-front-end/src/components/page/5_SPMI/MI_PRG4_M4_P2_XXX.pdf",
    },
    {
      Key: 2,
      Dokumen: "SK NO39/09230/SK/2024",
      Src: "bpm-front-end/src/components/page/5_SPMI/MI_PRG4_M4_P2_XXX.pdf",
    },
    {
      Key: 3,
      Dokumen: "SK NO39/09230/SK/2024",
      Src: "bpm-front-end/src/components/page/5_SPMI/MI_PRG4_M4_P2_XXX.pdf",
    },
    {
      Key: 4,
      Dokumen: "SK NO39/09230/SK/2024",
      Src: "bpm-front-end/src/components/page/5_SPMI/MI_PRG4_M4_P2_XXX.pdf",
    },
    {
      Key: 5,
      Dokumen: "SK NO39/09230/SK/2024",
      Src: "bpm-front-end/src/components/page/5_SPMI/MI_PRG4_M4_P2_XXX.pdf",
    },
  ];

  // console.log(menuData);
  const title = "Penetapan";
  const breadcrumbs = [{ label: "Siklus SPMI" }, { label: "Penetapan" }];

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
              <div
                id="carouselExampleAutoplaying"
                className="carousel slide"
                data-bs-ride="carousel"
              >
                <button
                  className="carousel-control-prev"
                  type="button"
                  data-bs-target="#carouselExampleAutoplaying"
                  data-bs-slide="prev"
                >
                  <div className="carousel-control-left">
                    <span
                      className="carousel-control-prev-icon mt-2"
                      aria-hidden="true"
                    ></span>
                    <span className="visually-hidden">Previous</span>
                  </div>
                </button>
                <div className="carousel-inner">
                  <div className="carousel-item active">
                    <img
                      src={Mahasiswa}
                      className="d-block w-100 carousel-img"
                      alt="..."
                    />
                  </div>
                  <div className="carousel-item ">
                    <img
                      src={gedung}
                      className="d-block w-100 carousel-img"
                      alt="..."
                    />
                  </div>
                  <div className="carousel-item">
                    <img
                      src={Gedung}
                      className="d-block w-100 carousel-img"
                      alt="..."
                    />
                  </div>
                </div>

                <button
                  className="carousel-control-next"
                  type="button"
                  data-bs-target="#carouselExampleAutoplaying"
                  data-bs-slide="next"
                >
                  <div className="carousel-control-right">
                    <span
                      className="carousel-control-next-icon mt-2"
                      aria-hidden="true"
                    ></span>
                    <span className="visually-hidden">Next</span>
                  </div>
                </button>
              </div>

              <div className="mt-5">
                <div className="d-flex justify-content-between align-items-center">
                  <h1
                    style={{ color: "#2654A1", margin: "0", fontWeight: "700" }}
                  >
                    {title}
                  </h1>
                  <Button
                    iconName="edit"
                    classType="primary"
                    label="Edit Konten"
                    // onClick={() => navigate(menuData.root+'/editkonten', {root: menuData.root})}
                    onClick={() => onChangePage("editKonten")}
                  />
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

              <div className="mt-3">
                {textContent != "" ? (
                  <p>{textContent}</p>
                ) : (
                  <p>Lorem Ipsum dolor sit amet...</p>
                )}
              </div>

              <div
                className="mt-5"
                style={{ display: "flex", alignItems: "center" }}
              >
                <h1
                  style={{ color: "#2654A1", margin: "0", fontWeight: "700" }}
                >
                  Dokumen Rujukan
                </h1>
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
                  arrHeader={["No", "Dokumen"]}
                  headerToDataMap={{
                    No: "No",
                    Dokumen: "Dokumen",
                  }}
                  data={currentData.map((item, index) => ({
                    key: item.Key || index,
                    No: indexOfFirstData + index + 1,
                    Dokumen: item.Dokumen,
                  }))}
                  actions={["Detail", "Edit", "Print"]}
                  onEdit={handleEdit}
                  onDetail={() => handleShowDetail()}
                  onPrint={()=> console.log('printed')}
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

        <Modal ref={detailModalRef} title="Detail Dokumen" size="full">
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
