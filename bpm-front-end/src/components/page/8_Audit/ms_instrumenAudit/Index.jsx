import React, { useState, useRef, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { API_LINK, DOKUMEN_LINK } from "../../../util/Constants";
import { useFetch } from "../../../util/useFetch";
import Table from "../../../part/Table";
import Paging from "../../../part/Paging";
import SearchField from "../../../part/SearchField";
import Button from "../../../part/Button";
import Filter from "../../../part/Filter";
import Breadcrumbs from "../../../part/Breadcrumbs";
import DropDown from "../../../part/Dropdown";
import SweetAlert from "../../../util/SweetAlert";
import Cookies from "js-cookie";
import { useIsMobile } from "../../../util/useIsMobile";
import { decodeHtml } from "../../../util/DecodeHtml";
import Loading from "../../../part/Loading";

const arrSort = [
  { Value: "namaInstrumen ASC", Text: "Nama Kriteria [↑]" },
  { Value: "namaInstrumen DESC", Text: "Nama Kriteria [↓]" },
];

const arrStatus = [
  { Value: "Aktif", Text: "Aktif" },
  { Value: "Tidak Aktif", Text: "Tidak Aktif" },
];

const breadcrumbs = [{ label: "Evaluasi" }, { label: "Instrumen Audit" }];

export default function Index({ onChangePage }) {
  const isMobile = useIsMobile();

  const [pageSize] = useState(10);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [pageCurrent, setPageCurrent] = useState(1);
  const [totalData, setTotalData] = useState(0);
  const [selectedSort, setSelectedSort] = useState("namaInstrumen ASC");
  const [filteredData, setFilteredData] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("Aktif");
  const [selectedKriteria, setSelectedKriteria] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handlePageNavigation = (page) => {
    setPageCurrent(page);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await useFetch(
        `${API_LINK}/MasterInstrumenAudit/GetDataInstrumenAudit`,
        {
          param1: searchKeyword,
          param2: selectedSort,
          param3: pageSize,
          param4: pageCurrent,
          param5: selectedStatus,
          param6: selectedKriteria,
        }
      );

      if (result === "ERROR" || result === null || result.length === 0) {
        setFilteredData([]);
        setTotalData(0);
      } else {
        const arrResult = Object.values(result);
        setFilteredData(arrResult);
        setTotalData(arrResult[0].totalData);
      }
    } catch (err) {
      setError("Gagal mengambil data: " + err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [
    searchKeyword,
    selectedSort,
    pageCurrent,
    selectedStatus,
    selectedKriteria,
  ]);

  const handleToggle = (item) => {
    SweetAlert(
      "Konfirmasi",
      `Apakah Anda yakin ingin ${
        item.status === "Aktif" ? "menonaktifkan" : "mengaktifkan"
      } data ini?`,
      "question",
      "Ya",
      null,
      "",
      true
    ).then((result) => {
      if (result) {
        const updatedData = filteredData
          .filter((data) => data.id === item.Key)
          .map((data) => ({
            idData: data.id,
            status: data.status === "Aktif" ? "Tidak Aktif" : "Aktif",
          }));
        useFetch(
          `${API_LINK}/MasterInstrumenAudit/setStatusInstrumenAudit`,
          updatedData[0]
        )
          .then((response) => {
            if (response === "ERROR") {
              throw new Error("Gagal memperbarui data");
            }
            SweetAlert(
              "Berhasil!",
              updatedData[0].status === "Aktif"
                ? "Data data berhasil diaktifkan"
                : "Data data berhasil dinonaktifkan",
              "success",
              "OK"
            ).then(() => {
              fetchData();
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

  if (error) return <p>{error}</p>;

  return (
    <div className="d-flex flex-column min-vh-100">
      <main className="flex-grow-1 p-3" style={{ marginTop: "80px" }}>
        <div className="d-flex flex-column">
          <div className={isMobile ? "m-0 p-2" : "m-3 ms-5 mb-0"}>
            <h1 style={{ color: "#2654A1", margin: "0", fontWeight: "700" }}>
              Instrumen Audit
            </h1>
            <Breadcrumbs breadcrumbs={breadcrumbs} />
          </div>

          <div
            className={isMobile ? "p-2 m-2 mt-2 mb-0" : "p-1 m-5 mt-2 mb-0"}
            style={{ marginLeft: "50px" }}
          >
            <Button
              iconName="add"
              classType="primary"
              label="Tambah Data"
              onClick={() =>
                onChangePage("add", {
                  breadcrumbs: breadcrumbs,
                })
              }
            />
          </div>

          <div
            className={
              isMobile
                ? "table-container bg-white p-1 m-1 mt-0 rounded"
                : "table-container bg-white p-2 pt-0 pb-0  m-5 mt-0 rounded"
            }
          >
            <div className="row mb-3">
              <div className="col-12 d-flex flex-wrap align-items-center">
                <div className="me-auto flex-grow-1 mt-3 me-3">
                  <SearchField onChange={(value) => setSearchKeyword(value)} />
                </div>
                <div className="m-0">
                  <Filter>
                    <DropDown
                      arrData={arrSort}
                      label="Urut Berdasarkan"
                      value={selectedSort}
                      forInput="urutFilter"
                      onChange={(e) => setSelectedSort(e.target.value)}
                    />
                    <DropDown
                      arrData={arrStatus}
                      label="Status"
                      value={selectedStatus}
                      forInput="statusFilter"
                      onChange={(e) => setSelectedStatus(e.target.value)}
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
                  arrHeader={["No", "Nama"]}
                  data={filteredData.map((item, index) => ({
                    Key: item.id,
                    No: (pageCurrent - 1) * pageSize + index + 1,
                    Nama: item.nama,
                    status: item.status,
                  }))}
                  actions={(row) => {
                    if (row.status === "Tidak Aktif") {
                      return ["Toggle"];
                    }

                    return ["Detail", "Edit", "Toggle"];
                  }}
                  onToggle={(item) => handleToggle(item)}
                  onEdit={(item) =>
                    onChangePage("edit", {
                      idData: item.Key,
                      breadcrumbs: breadcrumbs,
                    })
                  }
                  onDetail={(item) =>
                    onChangePage("detail", {
                      idData: item.Key,
                      breadcrumbs: breadcrumbs,
                    })
                  }
                />

                <Paging
                  pageSize={pageSize}
                  pageCurrent={pageCurrent}
                  totalData={totalData}
                  navigation={handlePageNavigation}
                />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
