import { useState, useRef, useEffect } from "react";
import Table from "../../../part/Table";
import Paging from "../../../part/Paging";
import SearchField from "../../../part/SearchField";
import Button from "../../../part/Button";
import Filter from "../../../part/Filter";
import Modal from "../../../part/Modal";
import DetailData from "../../../part/DetailData";
import SweetAlert from "../../../util/SweetAlert";
import HeaderText from "../../../part/HeaderText";
import { useIsMobile } from "../../../util/useIsMobile";
import { SyncLoader } from "react-spinners";
import { useLocation, useNavigate } from "react-router-dom";


export default function Index({ onChangePage }) {
  const data = [
    { Key: 1, Prodi: "Manajemen Informatika (MI)", Akreditasi: 'UNGGUL' },
    { Key: 2, Prodi: "Mekratonika (MK)", Akreditasi: 'UNGGUL' },
    { Key: 3, Prodi: "Teknik Pembuatan Peralatan Perkakas Produksi (P4)", Akreditasi: 'UNGGUL' },
    { Key: 4, Prodi: "Teknik Produksi dan Proses Manufaktur (TPPM)", Akreditasi: 'UNGGUL' },
    { Key: 5, Prodi: "Mesin Otomotif (MO)", Akreditasi: 'UNGGUL' },
    { Key: 6, Prodi: "Teknologi Konstruksi Bangunan Gedung (TKBG)", Akreditasi: 'UNGGUL'},
    { Key: 7, Prodi: "Teknologi Rekayasa Logistik (TRL)", Akreditasi: 'UNGGUL'},
    { Key: 8, Prodi: "Teknologi Rekayasa Perangkat Lunak (TRPL)", Akreditasi: 'UNGGUL' }
  ];

  const data1 = [
    { Key: 1, NomorSK: "377/DIKTI/Kep/1999", Akreditasi: 'UNGGUL' },
    { Key: 2, NomorSK: "126/KPT/I/2018", Akreditasi: 'UNGGUL' },
    { Key: 3, NomorSK: "377/DIKTI/Kep/1999", Akreditasi: 'UNGGUL' },
    { Key: 4, NomorSK: "0085/SK/LAM Teknik/VD3/IV/2023", Akreditasi: 'UNGGUL'},
    { Key: 5, NomorSK: "11328/SK/BAN-PT/Ak-PNB/Dipl-III/X/20212", Akreditasi: 'UNGGUL'},
    { Key: 6, NomorSK: "593/KPT/I/2018", Akreditasi: 'UNGGUL'},
    { Key: 7, NomorSK: "55/D/OT/2023", Akreditasi: 'UNGGUL'},
    { Key: 8, NomorSK: "309/D/OT/2023", Akreditasi: 'UNGGUL'},

  ];

  const combinedData = data.map((item) => {
    const matchingItem = data1.find((d) => d.Key === item.Key);
    return {
      ...item, 
      NomorSK: matchingItem ? matchingItem.NomorSK : null,
    };
  });
  
  console.log(combinedData);
  

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

  const [pageSize] = useState(10);
  const [pageCurrent, setPageCurrent] = useState(1);

  const title = "Akreditasi Program Studi";
  const breadcrumbs = [{ label: "SPME" }, { label: "Akreditasi" }, { label: "Program Studi" }];

  const handleEdit = (item) => {
    onChangePage("edit", { state: { editData: item } });
  };

  const indexOfLastData = pageCurrent * pageSize;
  const indexOfFirstData = indexOfLastData - pageSize;

  return (
    <div className="d-flex flex-column min-vh-100">
      <main className="flex-grow-1 p-3" style={{ marginTop: "80px" }}>
        <div className="d-flex flex-column">
          <div className="container mb-3">
            <div className="mt-3">
              <div className="d-flex justify-content-between align-items-center">
                <h1
                  style={{ color: "#2654A1", margin: "0", fontWeight: "700" }}
                >
                  {title}
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

            <div
              className="mt-5 mb-0"
              // style={{ marginLeft: "50px", margin: isMobile ? "1rem" : "3rem" }}
            >
              <Button
                iconName="add"
                classType="primary"
                label="Tambah Data"
                onClick={() => onChangePage("add")}
                // onClick={() => addModalRef.current.open()}
              />
              <div className="row mt-3 ">
                <div className="col-lg-10 col-md-6 ">
                  <SearchField />
                </div>
                <div className="col-lg-2 col-md-6">
                <Filter>
                  <div className="mb-3">
                    <label htmlFor="yearPicker" className="mb-1">
                      Berdasarkan Tahun
                    </label>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="Masukkan Tahun"
                        min="2000"
                        max={new Date().getFullYear()}
                      />
                  </div>
                    <Button
                      classType="btn btn-secondary"
                      title="Reset Filter"
                      label="Reset"
                      //  onClick={resetFilter}
                    />
                  </Filter>
                </div>
              </div>
            </div>
            <div className="table-container bg-white rounded">
              <Table
                arrHeader={["No", "Nomor SK", "Program Studi", "Akreditasi"]}
                headerToDataMap={{
                  No: "No",
                  "Program Studi": "Prodi",
                  "Nomor SK": "NomorSK",
                  "Akreditasi": "Akreditasi"
                }}
                data={combinedData.map((item, index) => ({
                  Key: item.Key || index,
                  No: indexOfFirstData + index + 1,
                  "Prodi": item.Prodi,
                  "NomorSK": item.NomorSK,
                  "Akreditasi": item.Akreditasi
                }))}
                actions={[
                  "Preview",
                  "Detail", 
                  "Edit", 
                  "Delete", 
                  "PrintHistory", 
                  "UpdateHistory"
                ]}
                onPreview={(data) => {
                  console.log("prev");
                  const selected = sortedData.find(
                    (item) => item.Key == data.Key
                  );
                  handleOpenModal("preview", selected);
                }}
                onEdit={handleEdit}
                onDetail={(data) => {
                  const selected = sortedData.find(
                    (item) => item.Key == data.Key
                  );
                  handleOpenModal("detail", selected);
                }}
                onPrint={() => console.log("printed")}
                onDelete={(item) => handleDelete(item.key)}
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
              <HeaderText label="Preview Dokumen" />
              <div style={{ width: "90vh", height: "50vh" }}>
                {isLoading == true ? (
                  <div style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center", 
                    backgroundColor: "white", 
                    minHeight: "50vh",
                    margin: 0,
                  }}>
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
  );
}
