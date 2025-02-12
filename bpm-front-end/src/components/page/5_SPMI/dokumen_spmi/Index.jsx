import React, { useState, useRef, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { API_LINK, DOKUMEN_LINK } from "../../../util/Constants";
import { useFetch } from "../../../util/useFetch";
import { SyncLoader } from "react-spinners";
import Table from "../../../part/Table";
import Paging from "../../../part/Paging";
import SearchField from "../../../part/SearchField";
import Button from "../../../part/Button";
import Filter from "../../../part/Filter";
import Modal from "../../../part/Modal";
import DetailData from "../../../part/DetailData";
import Breadcrumbs from "../../../part/Breadcrumbs";
import DropDown from "../../../part/Dropdown";
import Loading from "../../../part/Loading";
import SweetAlert from "../../../util/SweetAlert";
import PdfPreviewDownload from "../../../part/PdfPreviewDownload";
import pdf from "../MI_PRG4_M4_P2_XXX.pdf";
import { useIsMobile } from "../../../util/useIsMobile";
import Cookies from "js-cookie";
import { Document, Page } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";

// import { Document, Page } from '@react-pdf-viewer/core';

const arrSort = [
  { Value: "[judulDok] ASC", Text: "Judul Dokumen [↑]" },
  { Value: "[judulDok] DESC", Text: "Judul Dokumen [↓]" },
];

const arrStatus = [
  { Value: "Aktif", Text: "Aktif" },
  { Value: "Tidak Aktif", Text: "Tidak Aktif" },
];

export default function Index({ onChangePage }) {
  const activeUser = Cookies.get("activeUser");
  let role = ""; // Jika undefined, gunakan nilai default
  let roleNama = "";
  let namaPengguna = "";
  if (activeUser) {
    role = JSON.parse(activeUser).RoleID.slice(0, 5);
    roleNama = JSON.parse(activeUser).Role;
    namaPengguna = JSON.parse(activeUser).Nama;
  }
  const location = useLocation();
  const isMobile = useIsMobile();

  const [pageSize] = useState(10);
  const [pageCurrent, setPageCurrent] = useState(1);
  const [totalData, setTotalData] = useState(0);
  const [filteredData, setFilteredData] = useState([]);
  const idMenu = location.state?.idMenu;

  const [currentFilter, setCurrentFilter] = useState({
    param1: idMenu,
    param2: "Aktif",
    param3: "",
    param4: "",
    param5: pageSize,
    param6: pageCurrent,
    param7: "[judulDok] ASC",
  });

  const [modalType, setModalType] = useState(""); // "add", "edit", "detail", "preview"
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [breadcrumbs, setBreadcrumbs] = useState([]);
  const [arrTahun, setArrTahun] = useState([]);

  const [numPages, setNumPages] = useState(null);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const { jenis } = useParams();
  const ModalRef = useRef();

  const title = jenis.toUpperCase();

  useEffect(() => {
    const fetchTahunDokumen = async () => {
      setLoading(true);
      const result = await useFetch(
        `${API_LINK}/MasterDokumen/GetListTahunDokumen`,
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
    if (location.state?.idMenu) {
      setCurrentFilter((prevFilter) => ({
        ...prevFilter,
        param1: location.state.idMenu,
      }));
    }
  }, [location.state?.idMenu]);

  useEffect(() => {
    setCurrentFilter((prevFilter) => ({
      ...prevFilter,
      param6: pageCurrent,
    }));
  }, [pageCurrent]);

  const fetchDokumen = async () => {
    setLoading(true);
    try {
      const result = await useFetch(
        `${API_LINK}/MasterDokumen/GetDataDokumenByMenu`,
        currentFilter,
        "POST"
      );
      console.log(currentFilter);

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
    console.log(selected);
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

  const handleDownloadHistory = (item) => {
    onChangePage("downHistory", {
      idData: item.Key,
      idMenu: idMenu,
      breadcrumbs: breadcrumbs,
    });
  };

  const handleUpload = (item) => {
    onChangePage("editFile", {
      idData: item.Key,
      idMenu: idMenu,
      breadcrumbs: breadcrumbs,
    });
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

  const handleDownload = async (item) => {
    const id = item.Key;
    if (!id) {
      SweetAlert("Peringatan", "ID file tidak tersedia.", "warning");
      return;
    }

    try {
      const foundItem = filteredData.find((obj) => obj.idDok === id);
      const namaInformasi =
        foundItem && foundItem["fileDok"] ? foundItem["fileDok"] : `file_${id}`;

      const judulDok = foundItem.judulDok;
      const controlDok = foundItem.controlDok;
      const referensi = foundItem.refDok;
      const tanggal = new Date().toLocaleString();

      const response = await fetch(`${API_LINK}/MasterDokumen/DownloadFile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fileName: namaInformasi,
          metadata: {
            JudulDokumen: judulDok,
            JenisDokumen: controlDok,
            DiunduhOleh: namaPengguna,
            Jabatan: roleNama,
            TanggalUnduh: tanggal,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Gagal mengunduh file.");
      } else {
        const data = await useFetch(
          `${API_LINK}/MasterDokumen/CreateUnduhDokumen`,
          {
            idDok: id,
            referensi: referensi,
            role: role,
            roleNama: roleNama,
          },
          "POST"
        );
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = namaInformasi;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      SweetAlert("Error", error.message, "error");
    }
  };

  if (error)
    return (
      <div>
        <p>{error}</p>
      </div>
    );

  return (
    <div className="d-flex flex-column min-vh-100">
      <main className="flex-grow-1 p-3" style={{ marginTop: "60px" }}>
        <div className="d-flex flex-column">
          <div className="p-3 m-5 mt-0 mb-0">
            <h1 style={{ color: "#2654A1", margin: "0", fontWeight: "700" }}>
              {"DOKUMEN " + title}
            </h1>
            <Breadcrumbs breadcrumbs={breadcrumbs} />
          </div>
          {role === "ROL01" ? (
            <div className="p-3" style={{ marginLeft: "50px" }}>
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
            </div>
          ) : (
            ""
          )}

          <div
            className={
              isMobile
                ? "table-container bg-white p-1 m-1 mt-0 rounded"
                : "table-container bg-white p-3 m-5 mt-0 rounded"
            }
          >
            <div className="row">
              <div className="col-12 d-flex flex-wrap align-items-center">
                <div className="me-auto flex-grow-1 me-3">
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
                <div className="mb-3">
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
                      arrData={arrTahun}
                      label="Tahun Dokumen"
                      type="semua"
                      forInput="yearFilter"
                      onChange={(e) =>
                        setCurrentFilter((prevFilter) => {
                          return {
                            ...prevFilter,
                            param4: e.target.value,
                          };
                        })
                      }
                    />
                    {role === "ROL01" ? (
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
                    ) : (
                      ""
                    )}
                  </Filter>
                </div>
              </div>
            </div>
            {loading ? (
              <Loading />
            ) : (
              <div>
                {role === "ROL01" ? (
                  <Table
                    arrHeader={["No", "Judul Dokumen"]}
                    data={filteredData.map((item, index) => ({
                      Key: item.idDok,
                      No: (pageCurrent - 1) * pageSize + index + 1,
                      "Judul Dokumen": item.judulDok,
                      status: item.status,
                    }))}
                    actions={(row) => {
                      // Jika status "Tidak Aktif", hanya tampilkan Toggle
                      if (row.status === "Tidak Aktif") {
                        return ["Toggle"];
                      }
                      // Jika status selain "Tidak Aktif", tampilkan semua actions
                      return [
                        "Detail",
                        "Preview",
                        "Edit",
                        "Upload",
                        "Print",
                        "UpdateHistory",
                        "PrintHistory",
                        "Toggle",
                      ];
                    }}
                    onPreview={handlePreview}
                    onEdit={handleEdit}
                    onDetail={handleDetail}
                    onPrint={handleDownload}
                    onUpload={handleUpload}
                    onUpdateHistory={handleUpdateHistory}
                    onPrintHistory={handleDownloadHistory}
                    onToggle={handleToggle}
                  />
                ) : (
                  <div className="row p-3 gap-3 mb-2">
                    {filteredData.length > 0 ? (
                      filteredData.map((item) => (
                        <PdfPreviewDownload
                          key={item.id} // Pastikan setiap item memiliki `key` unik
                          judul={item.judulDok}
                          handleClick={() => handleDownload(item)}
                        />
                      ))
                    ) : (
                      <p className="text-center">No data available</p>
                    )}
                  </div>
                )}
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
                <DetailData label="Judul Dokumen" isi={detail.judulDok || ""} />
              </div>
              <div className="col-lg-6 col-md-6">
                <DetailData label="Nomor Dokumen" isi={detail.noDok || ""} />
                <DetailData
                  label="Jenis Dokumen"
                  isi={detail.controlDok || ""}
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
                <DetailData label="Dibuat Oleh" isi={detail.createdBy || "-"} />
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
                  isi={detail.modifiedBy || "-"}
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
          <div className="p-3 mt-0 bg-white">
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
                  type="application/pdf"
                  width="100%"
                  height="100%"
                  style={{
                    border: "none",
                  }}
                />

                // <Document
                //   file={DOKUMEN_LINK + detail.fileDok}
                //   onLoadSuccess={onDocumentLoadSuccess}
                //   // className="pdf-document"
                // >
                //   {/* Render all pages */}
                //   {Array.from(new Array(numPages), (el, index) => (
                //     <Page
                //       key={`page_${index + 1}`}
                //       pageNumber={index + 1}
                //       renderAnnotationLayer={false} // Disable annotations
                //       renderTextLayer={false} // Disable text selection
                //     />
                //   ))}
                // </Document>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
