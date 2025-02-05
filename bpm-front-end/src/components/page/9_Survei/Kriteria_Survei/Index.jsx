import React, { useState, useEffect } from "react";
import { useFetch } from "../../../util/useFetch";
import SweetAlert from "../../../util/SweetAlert";
import Table from "../../../part/Table";
import Paging from "../../../part/Paging";
import PageTitleNav from "../../../part/PageTitleNav";
import Button from "../../../part/Button";
import DropDown from "../../../part/Dropdown";
import Filter from "../../../part/Filter";
import SearchField from "../../../part/SearchField";
import Cookies from "js-cookie";
import { API_LINK } from "../../../util/Constants";
import { useIsMobile } from "../../../util/useIsMobile";
const arrSort = [
  { Value: "[namaKri] ASC", Text: "Terbaru" },
  { Value: "[namaKri] DESC", Text: "Terlama" },
];
const arrStatus = [
  { Value: "Aktif", Text: "Aktif" },
  { Value: "Tidak Aktif", Text: "Tidak Aktif" },
];

const breadcrumbs = [{ label: "Kriteria" }];

export default function KriteriaSurvei({ onChangePage }) {
  const activeUser = Cookies.get("activeUser");
  let role = ""; // Jika undefined, gunakan nilai default
  let roleNama = "";
  let namaPengguna = "";
  if (activeUser) {
    role = JSON.parse(activeUser).RoleID.slice(0, 5);
    roleNama = JSON.parse(activeUser).Role;
    namaPengguna = JSON.parse(activeUser).Nama;
  }

  const [pageSize] = useState(10);
  const isMobile = useIsMobile();
  const idMenu = location.state?.idMenu;
  const [pageCurrent, setPageCurrent] = useState(1);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredData, setFilteredData] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [error, setError] = useState(null);

  const [currentFilter, setCurrentFilter] = useState({
    param1: "Aktif",
    param2: "",
    param3: "namaKri ASC",
    param4: pageSize,
    param5: pageCurrent,
  });

  useEffect(() => {
    setCurrentFilter((prevFilter) => ({
      ...prevFilter,
      param5: pageCurrent,
    }));
  }, [pageCurrent]);

  const fetchKriteria = async () => {
    setLoading(true);
    try {
      const result = await useFetch(
        `${API_LINK}/MasterKriteriaSurvei/GetDataKriteriaSurvei`,
        currentFilter,
        "POST"
      );

      if (result === "ERROR" || result === null || result.length === 0) {
        setFilteredData([]);
        setTotalData(0);
      } else {
        const arrResult = Object.values(result);
        setFilteredData(arrResult);
        setTotalData(arrResult[0].TotalCount);
      }
    } catch (err) {
      setError("Gagal mengambil data: " + err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKriteria();
  }, [currentFilter]);

  const handlePageNavigation = (page) => setPageCurrent(page);

  if (loading) {
    return <div>Loading...</div>;
  }
  const handleEdit = (item) => {
    onChangePage("edit", {
      id: item.Key,
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
      } data ini?`,
      "question",
      "Ya",
      null,
      "",
      true // Tampilkan tombol batal
    ).then((result) => {
      if (result) {
        // Perbarui data yang akan dikirim
        const updatedData = {
          idData: item.Key,
          status: item.status === "Aktif" ? "Tidak Aktif" : "Aktif",
        };

        useFetch(
          `${API_LINK}/MasterKriteriaSurvei/StatusKriteriaSurvei`,
          updatedData,
          "POST"
        )
          .then((response) => {
            if (response === "ERROR") {
              throw new Error("Gagal memperbarui data");
            }
            SweetAlert(
              "Berhasil!",
              updatedData.status === "Aktif"
                ? "Data berhasil diaktifkan"
                : "Data berhasil dinonaktifkan",
              "success",
              "OK"
            ).then(() => {
              fetchKriteria(); // Panggil ulang data setelah pembaruan berhasil
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

  return (
    <div className="d-flex flex-column min-vh-100">
      <main className="flex-grow-1 p-3" style={{ marginTop: "80px" }}>
        <div className="d-flex flex-column">
          <div className={isMobile ? "m-0 p-0" : "m-3 mb-0"}>
            <PageTitleNav
              title="Kriteria Survei"
              breadcrumbs={[
                { label: "Kriteria Survei", href: "/survei/kriteria" },
              ]}
            />
          </div>
          <div
            className={isMobile ? "p-2 m-2 mt-2 mb-0" : "p-3 m-5 mt-2 mb-0"}
            style={{ marginLeft: "50px" }}>
            <Button
              iconName="add"
              classType="primary"
              label="Tambah Kriteria Survei"
              onClick={() => onChangePage("add")}
            />
            <div className="row mt-5">
              <div className="col-lg-11 col-md-6">
                <SearchField
                  value={currentFilter.param2 || ""}
                  placeHolder="Cari Kriteria..."
                  onInput={(e) =>
                    setCurrentFilter((prevFilter) => ({
                      ...prevFilter,
                      param2: e.target.value, // Mengambil nilai input dari e.target.value
                    }))
                  }
                />
              </div>
              <div className="col-lg-1 col-md-6">
                <Filter>
                  <DropDown
                    arrData={arrSort}
                    label="Urut Berdasarkan"
                    type="pilih"
                    defaultValue="[namaKri] ASC"
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
                    arrData={arrStatus}
                    label="Status"
                    type="pilih"
                    defaultValue="Aktif"
                    forInput="statusFilter"
                    onChange={(e) =>
                      setCurrentFilter((prevFilter) => {
                        return {
                          ...prevFilter,
                          param1: e.target.value,
                        };
                      })
                    }
                  />
                </Filter>
              </div>
            </div>
          </div>
        </div>

        <div
          className={
            isMobile
              ? "table-container bg-white p-2 m-2 mt-0 rounded"
              : "table-container bg-white p-3 m-5 mt-0 rounded"
          }
        >
          <Table
            arrHeader={["No", "Nama Kriteria"]}
            data={filteredData.map((item, index) => ({
              Key: item.idKri,
              No: (pageCurrent - 1) * pageSize + index + 1,
              "Nama Kriteria": item.namaKri,
              status: item.status,
            }))}
            actions={(item) => {
              // Jika status "Tidak Aktif", hanya tampilkan Toggle
              if (item.status === "Tidak Aktif") {
                return ["Toggle"];
              }
              // Jika status selain "Tidak Aktif", tampilkan semua actions
              return ["Detail", "Edit", "Toggle"];
            }}
            onEdit={handleEdit}
            onDetail={(item) => onChangePage("detail", { detailId: item.Key })}
            onToggle={(item) => handleToggle(item)}
          />
          <Paging
            pageSize={pageSize}
            pageCurrent={pageCurrent}
            totalData={filteredData.length}
            navigation={handlePageNavigation}
          />
        </div>
      </main>
    </div>
  );
}
