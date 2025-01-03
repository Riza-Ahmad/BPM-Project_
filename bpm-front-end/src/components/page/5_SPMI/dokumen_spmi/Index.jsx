import React, { useState, useRef, useEffect, useMemo } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import Table from "../../../part/Table";
import Paging from "../../../part/Paging";
import SearchField from "../../../part/SearchField";
import Button from "../../../part/Button";
import Filter from "../../../part/Filter";
import Modal from "../../../part/Modal";
import DetailData from "../../../part/DetailData";
import { SyncLoader } from "react-spinners";
import Breadcrumbs from "../../../part/Breadcrumbs";
import { API_LINK, DOKUMEN_LINK } from "../../../util/Constants";
import { useFetch } from "../../../util/useFetch";
import DropDown from "../../../part/Dropdown";
import Loading from "../../../part/Loading";

const arrSort = [
  { Value: "[judulDok] ASC", Text: "Judul Dokumen [↑]" },
  { Value: "[judulDok] DESC", Text: "Judul Dokumen [↓]" },
];

const arrStatus = [
  { Value: "Aktif", Text: "Aktif" },
  { Value: "Tidak Aktif", Text: "Tidak Aktif" },
];

export default function Index({ onChangePage }) {
  const location = useLocation();

  const [pageSize] = useState(10);
  const [pageCurrent, setPageCurrent] = useState(1);
  const [totalData, setTotalData] = useState(0);
  const [filteredData, setFilteredData] = useState([]);
  const idMenu = location.state?.idMenu;

  const [currentFilter, setCurrentFilter] = useState({
    param1: "",
    param2: "Aktif",
    param3: "",
    param4: "",
    param5: 10,
    param6: 1,
    param7: "[judulDok] ASC",
  });

  const [modalType, setModalType] = useState(""); // "add", "edit", "detail", "preview"
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [breadcrumbs, setBreadcrumbs] = useState([]);

  const { jenis } = useParams();
  const ModalRef = useRef();

  const title = jenis.toUpperCase();

  useEffect(() => {
    if (location.state?.idMenu) {
      setCurrentFilter((prevFilter) => ({
        ...prevFilter,
        param1: location.state.idMenu,
      }));
    }
  }, [location.state?.idMenu]);

  useEffect(() => {
    const fetchDokumen = async () => {
      setLoading(true);
      try {
        const result = await useFetch(
          `${API_LINK}/MasterDokumen/GetDataDokumenByKategori`,
          currentFilter,
          "POST"
        );
        console.log(currentFilter);

        if (result === "ERROR" || result === null || result.length === 0) {
          setFilteredData([]);
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
    fetchDokumen();
  }, [currentFilter]);

  useEffect(() => {
    let tempBradcrumps = [{ label: "SPMI" }, { label: "Dokumen SPMI" }];

    if (
      !tempBradcrumps.some(
        (item) =>
          item.label ===
          title.charAt(0).toUpperCase() + title.slice(1).toLowerCase()
      )
    ) {
      tempBradcrumps.push({
        label: title.charAt(0).toUpperCase() + title.slice(1).toLowerCase(),
      });
    }

    setBreadcrumbs(tempBradcrumps);
  }, [title]);

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

  const handleDelete = (item) => {
    const selected = filteredData.find((obj) => obj.idDok == item.Key);
    console.log(selected.judulDok + " deleted");
  };

  const handleDownload = (item) => {
    const selected = filteredData.find((obj) => obj.idDok == item.Key);
    console.log(selected.judulDok + " downloaded");
  };

  if (error)
    return (
      <div>
        <p>{error}</p>
      </div>
    );

  return (
    <div className="d-flex flex-column min-vh-100">
      <main className="flex-grow-1 p-3" style={{ marginTop: "80px" }}>
        <div className="container">
          <h1 style={{ color: "#2654A1", margin: "0", fontWeight: "700" }}>
            {title}
          </h1>
          <Breadcrumbs breadcrumbs={breadcrumbs} />

          <div className="mt-4">
            <Button
              iconName="add"
              classType="primary"
              label="Tambah Data"
              onClick={() =>
                onChangePage("add", {
                  idMenu: idMenu,
                  breadcrumbs: breadcrumbs,
                })
              }
            />
            <div className="row mt-3">
              <div className="col-lg-10">
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
              <div className="col-lg-2">
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

          <div className="table-container bg-white rounded">
            {loading ? (
              <Loading />
            ) : (
              <div>
                <Table
                  arrHeader={["No", "Judul Dokumen"]}
                  data={filteredData.map((item, index) => ({
                    Key: item.idDok,
                    No: (pageCurrent - 1) * pageSize + index + 1,
                    "Judul Dokumen": item.judulDok,
                  }))}
                  actions={[
                    "Detail",
                    "Edit",
                    "Upload",
                    "Print",
                    "Preview",
                    "UpdateHistory",
                    "PrintHistory",
                    "Toggle",
                  ]}
                  onPreview={handlePreview}
                  onEdit={handleEdit}
                  onDetail={handleDetail}
                  onPrint={handleDownload}
                  onDelete={handleDelete}
                  onUpdateHistory={handleUpdateHistory}
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
                <DetailData label="Judul Dokumen" isi={detail.judulDok} />
              </div>
              <div className="col-lg-6 col-md-6">
                <DetailData label="Nomor Dokumen" isi={detail.noDok} />
                <DetailData label="Jenis Dokumen" isi={detail.controlDok} />
              </div>
              <div className="col-lg-6 col-md-6">
                <DetailData
                  label="Tanggal Berlaku"
                  isi={new Date(detail.tglDok).toLocaleDateString("id-ID", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                />
                <DetailData
                  label="Tanggal Kadaluarsa"
                  isi={new Date(detail.expDok).toLocaleDateString("id-ID", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-lg-6 col-md-6">
                <DetailData label="Dibuat Oleh" isi={detail.createdBy} />
                <DetailData
                  label="Dibuat Tanggal"
                  isi={new Date(detail.createdDate).toLocaleDateString(
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
                <DetailData label="Dimodifikasi Oleh" isi={detail.modifiedBy} />
                <DetailData
                  label="Dimodifikasi Tanggal"
                  isi={new Date(detail.modifiedDate).toLocaleDateString(
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
                  width="100%"
                  height="100%"
                  type="application/pdf"
                  title="PDF Preview"
                  onLoad={() => setLoading(false)}
                />
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
