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
import { useIsMobile } from "../../../util/useIsMobile";
import Loading from "../../../part/Loading";
import PageTitleNav from "../../../part/PageTitleNav";

export default function RiwayatEdit({ onChangePage }) {
  const location = useLocation();
  const isMobile = useIsMobile();

  const [pageSize] = useState(10);
  const [pageCurrent, setPageCurrent] = useState(1);
  const [totalData, setTotalData] = useState(0);
  const [filteredData, setFilteredData] = useState([]);
  const idMenu = location.state?.idMenu;
  const idData = location.state?.idData;

  const [modalType, setModalType] = useState(""); // "add", "edit", "detail", "preview"
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const ModalRef = useRef();

  useEffect(() => {
    const fetchDokumen = async () => {
      setLoading(true);
      try {
        const result = await useFetch(
          `${API_LINK}/MasterDokumen/GetDataRiwayatPembaharuanDokumenById`,
          {
            param1: idData,
            param2: idMenu,
          },
          "POST"
        );

        if (result === "ERROR" || result === null || result.length === 0) {
          setFilteredData([]);
        } else {
          const dokumenArray = Object.values(result);
          setFilteredData(dokumenArray);
          setTotalData(dokumenArray.length);
        }
      } catch (err) {
        setError("Gagal mengambil data: " + err);
      } finally {
        setLoading(false);
      }
    };
    fetchDokumen();
  }, [idData, idMenu]);

  const handleOpenModal = (type, data = null) => {
    setModalType(type);
    setDetail(data);
    ModalRef.current?.open();
  };

  const handlePreview = (item) => {
    const selected = filteredData.find((obj) => obj.idDok == item.Key);
    handleOpenModal("preview", selected);
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
          <div className="mb-3">
            <PageTitleNav
              title="Riwayat Pembaruan"
              breadcrumbs={location.state?.breadcrumbs}
              onClick={() =>
                onChangePage("index", {
                  idMenu: idMenu,
                })
              }
            />
          </div>
          <div className={isMobile ? "m-0" : "p-3"}>
            <div className="table-container bg-white rounded">
              {loading ? (
                <Loading />
              ) : (
                <div>
                  <Table
                    arrHeader={[
                      "No",
                      "Revisi Ke",
                      "Judul Dokumen",
                      "Nama Berkas (File)",
                      "Tanggal Unggah",
                      "Diunggah Oleh",
                    ]}
                    data={filteredData.map((item, index) => ({
                      Key: item.idDok,
                      No: (pageCurrent - 1) * pageSize + index + 1,
                      "Revisi Ke": item.revisiDok,
                      "Judul Dokumen": item.judulDok,
                      "Nama Berkas (File)": item.fileDok,
                      "Tanggal Unggah": item.createdDate,
                      "Diunggah Oleh": item.createdBy,
                    }))}
                    actions={["Print", "Preview"]}
                    onPreview={handlePreview}
                    onPrint={handleDownload}
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
      </main>

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
