import React, { useEffect, useState, useRef } from "react";
import Table from "../../part/Table";
import Paging from "../../part/Paging";
import PageTitleNav from "../../part/PageTitleNav";
import Button from "../../part/Button";
import { useLocation, useNavigate } from "react-router-dom";
import { API_LINK, ROOT_LINK } from "../../util/Constants";
import { useFetch } from "../../util/useFetch";
import Loading from "../../part/Loading";
import Filter from "../../part/Filter";
import SearchField from "../../part/SearchField";
import DropDown from "../../part/Dropdown";
import SweetAlert from "../../util/SweetAlert";
import { useIsMobile } from "../../util/useIsMobile";
import Cookies from "js-cookie";
import PdfPreviewDownload from "../../part/PdfPreviewDownload";

// Dynamically set title and breadcrumbs based on idMenu
let title = "Hallo";
let breadcrumbs = [];

const dataFilterSort = [
  { Value: "ASC", Text: "Judul Proposal [↑]" },
  { Value: "DESC", Text: "Judul Proposal [↓]" },
];

const statusFilterSort = [
  { Value: "Aktif", Text: "Aktif" },
  { Value: "Tidak Aktif", Text: "Tidak Aktif" },
];
const pageSize = 10;

export default function Read({ onChangePage }) {
  const activeUser = Cookies.get("activeUser");
  let role = ""; // Jika undefined, gunakan nilai default
  let roleNama = "";
  let namaPengguna = "";
  const isMobile = useIsMobile();
  const [error, setError] = useState(null);
  const location = useLocation();
  const currentPath = location.pathname;
  const rootPath = currentPath.split("/")[2];
  const navigate = useNavigate();
  const idMenu = location.state?.idMenu;
  const [pageCurrent, setPageCurrent] = useState(1);
  const [loading, setLoading] = useState(true);

  const [filteredData, setFilteredData] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [selectedStatus, setSelectedStatus] = useState("Aktif");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedJudul, setSelectedJudul] = useState("");

  const indexOfLastData = pageCurrent * pageSize;
  const indexOfFirstData = indexOfLastData - pageSize;

  if (activeUser) {
    role = JSON.parse(activeUser).RoleID.slice(0, 5);
    roleNama = JSON.parse(activeUser).Role;
    namaPengguna = JSON.parse(activeUser).Nama;
  }

  const handlePageNavigation = (page) => {
    setPageCurrent(page);
  };

  const fetchEvents = async () => {
    try {
      const data = await useFetch(
        `${API_LINK}/MasterPeraturan/GetDataPeraturan`,
        {
          idMenu: idMenu,
          search: searchKeyword,
          year: selectedYear,
          status: selectedStatus,
          judul: selectedJudul,
          size: pageSize,
          page: pageCurrent,
        },
        "POST"
      );

      if (data.length > 0 && data[0].TotalCount !== undefined) {
        setTotalData(data[0].TotalCount); // Set hanya sekali
      }
      const formattedEvents = data.map((item) => {
        return {
          id: item.idDok,
          judulDok: item.judulDok,
          controlDok: item.controlDok,
          fileDok: item.fileDok,
          referensiDok: item.refDok,
          status: item.statusDok,
        };
      });

      setFilteredData(formattedEvents);
    } catch (error) {
      setError("Gagal mengambil data kegiatan");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [
    idMenu,
    searchKeyword,
    selectedJudul,
    selectedYear,
    selectedStatus,
    pageSize,
    pageCurrent,
  ]);

  useEffect(() => {
    if (rootPath === "dokumen") {
      title = "Dokumen Peraturan";
      breadcrumbs = [
        { label: "Peraturan", href: "/peraturan/dokumen" },
        { label: "Dokumen Peraturan" },
      ];
    } else if (rootPath === "aps") {
      title = "Instrumen APS";
      breadcrumbs = [
        { label: "Instrumen APS", href: "/peraturan/aps" },
        { label: "Dokumen Instrumen APS" },
      ];
    }

    // Set loading to false once idMenu is determined
    setLoading(false);
  }, [idMenu]);

  const resetFilter = () => {
    setSearchKeyword("");
    setSelectedYear("");
    setSelectedStatus("Aktif");
    setSelectedJudul("");
  };

  const handleToggle = (id) => {
    // Cari item dengan ID yang sesuai
    const item = filteredData.find((data) => data.id === id);

    if (!item) {
      // Jika ID tidak ditemukan, tampilkan SweetAlert peringatan
      SweetAlert("Peringatan", "ID file tidak tersedia.", "warning");
      return;
    }

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
          .filter((data) => data.id === id)
          .map((data) => ({
            idDok: data.id,
            status: data.status === "Aktif" ? "Tidak Aktif" : "Aktif",
          }));

        useFetch(
          `${API_LINK}/MasterPeraturan/EditPeraturanToggle`,
          updatedData[0]
        )
          .then((response) => {
            if (response === "ERROR") {
              throw new Error("Gagal memperbarui data");
            }
            SweetAlert(
              "Berhasil!",
              "Dokumentasi kegiatan berhasil diEdit.",
              "success",
              "OK"
            ).then(() => {
              // Panggil fetchEvents untuk memperbarui data tanpa reload halaman
              fetchEvents();
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

  const handleDownloadClick = async (id) => {
    if (!id) {
      SweetAlert("Peringatan", "ID file tidak tersedia.", "warning");
      return;
    }

    try {
      const foundItem = filteredData.find((item) => item.id === id);
      const namaInformasi =
        foundItem && foundItem["fileDok"] ? foundItem["fileDok"] : `file_${id}`;

      const judulDok = foundItem.judulDok;
      const controlDok = foundItem.controlDok;
      const referensi = foundItem.referensiDok;
      const tanggal = new Date().toLocaleString();

      const response = await fetch(`${API_LINK}/MasterPeraturan/DownloadFile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
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
          `${API_LINK}/MasterPeraturan/CreateUnduhanPeraturan`,
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

  if (loading) return <Loading />;

  return (
    <div className="d-flex flex-column min-vh-100">
      <main className="flex-grow-1 p-3" style={{ marginTop: "80px" }}>
        <div className="d-flex flex-column">
          <div className={isMobile ? "m-0" : "m-3"}>
            <PageTitleNav
              title={title}
              breadcrumbs={breadcrumbs}
              onClick={() => onChangePage("index", { idMenu: idMenu })}
            />
          </div>
          {role === "ROL01" ? (
            <div className={isMobile ? "p-2 m-2  mb-0" : "p-3 m-5 mt-0 mb-0"}>
              <Button
                iconName="add"
                classType="primary"
                label="Tambah Data"
                onClick={() => onChangePage("add", { idMenu: idMenu })}
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
            <div className="row mb-3">
              <div className="col-12 d-flex flex-wrap align-items-center">
                <div className="me-auto flex-grow-1 mt-3 me-3">
                  <SearchField
                    onChange={(value) => setSearchKeyword(value)}
                    value={searchKeyword}
                  />
                </div>

                <div className="m-0">
                  <Filter>
                    <div className="mb-3">
                      <DropDown
                        arrData={dataFilterSort}
                        label="Urut Bedasarkan"
                        value={selectedJudul}
                        onChange={(e) => setSelectedJudul(e.target.value)}
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="yearPicker" className="mb-1 fw-bold">
                        Berdasarkan Tahun
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="Masukkan Tahun"
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                        min="2000"
                        max={new Date().getFullYear()}
                      />
                    </div>
                    {role === "ROL01" ? (
                      <div className="mb-3">
                        <DropDown
                          arrData={statusFilterSort}
                          label="Status"
                          value={selectedStatus}
                          onChange={(e) => setSelectedStatus(e.target.value)}
                        />
                      </div>
                    ) : (
                      ""
                    )}
                    <Button
                      classType="btn btn-secondary"
                      title="Reset Filter"
                      label="Reset"
                      onClick={resetFilter}
                    />
                  </Filter>
                </div>
              </div>
            </div>

            {role === "ROL01" ? (
              <Table
                arrHeader={["No", "Judul Dokumen"]}
                data={filteredData.map((item, index) => ({
                  Key: item.id,
                  No: indexOfFirstData + index + 1,
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
                    "Edit",
                    "Upload",
                    "Print",
                    "UpdateHistory",
                    "PrintHistory",
                    "Toggle",
                  ];
                }}
                onEdit={(item) =>
                  onChangePage("edit", { idData: item.Key, idMenu: idMenu })
                }
                onDetail={(item) =>
                  onChangePage("detail", { idData: item.Key, idMenu: idMenu })
                }
                onUpload={(item) => {
                  onChangePage("editfile", {
                    idData: item.Key,
                    idMenu: idMenu,
                  });
                }}
                onPrint={(item) => {
                  handleDownloadClick(item.Key);
                }}
                onUpdateHistory={(item) => {
                  onChangePage("readrevisi", {
                    idData: item.Key,
                    idMenu: idMenu,
                  });
                }}
                onPrintHistory={(item) => {
                  onChangePage("readunduhan", {
                    idData: item.Key,
                    idMenu: idMenu,
                  });
                }}
                onToggle={(item) => handleToggle(item.Key)}
              />
            ) : (
              <div className="row p-2 gap-3 mb-2">
                {filteredData.map((item) => (
                  <PdfPreviewDownload
                    key={item.id} // Pastikan setiap item memiliki `key` unik
                    judul={item.judulDok}
                    handleClick={() => handleDownloadClick(item.id)}
                  />
                ))}
              </div>
            )}

            <Paging
              pageSize={pageSize}
              pageCurrent={pageCurrent}
              totalData={totalData}
              navigation={handlePageNavigation}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
