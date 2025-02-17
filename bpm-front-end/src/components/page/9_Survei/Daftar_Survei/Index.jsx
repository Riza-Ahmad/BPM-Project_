import React, { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import Table from "../../../part/Table";
import Paging from "../../../part/Paging";
import PageTitleNav from "../../../part/PageTitleNav";
import Button from "../../../part/Button";
import InputField from "../../../part/InputField";
import Loading from "../../../part/Loading";
import SearchField from "../../../part/SearchField";
import Filter from "../../../part/Filter";
import Modal from "../../../part/Modal";
import DropDown from "../../../part/Dropdown";
import Breadcrumbs from "../../../part/Breadcrumbs";
import { useFetch } from "../../../util/useFetch";
import { API_LINK } from "../../../util/Constants";
import { useIsMobile } from "../../../util/useIsMobile";
import Cookies from "js-cookie";

const dataFilterSort = [
  { Value: "tanggalAwalSurvei ASC", Text: "Tanggal Awal [↑]" },
  { Value: "tanggalAwalSurvei DESC", Text: "Tanggal Awal [↓]" },
];

const breadcrumbs = [{ label: "Daftar Survei" }];

export default function Daftar_Survei({ onChangePage }) {
  const activeUser = Cookies.get("activeUser");
  let role = "";
  let username = "";
  let roleNama = "";
  let namaPengguna = "";
  if (activeUser) {
    username = JSON.parse(activeUser).username;
    role = JSON.parse(activeUser).RoleID.slice(0, 5);
    roleNama = JSON.parse(activeUser).Role;
    namaPengguna = JSON.parse(activeUser).Nama;
  }

  const isMobile = useIsMobile();
  const [pageSize] = useState(10);
  const [pageCurrent, setPageCurrent] = useState(1);
  const [totalData, setTotalData] = useState(0);
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [allData, setAllData] = useState([]); // Data asli dari API

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [currentFilter, setCurrentFilter] = useState({
    param1: "",
    param2: "Final",
    param3: "tanggalAwalSurvei ASC",
    param4: pageSize,
    param5: pageCurrent,
    param6: role,
    param7: username,
  });
  const [searchTerm, setSearchTerm] = useState(currentFilter.param1);

  useEffect(() => {
    const delaySearch = setTimeout(() => {
      setCurrentFilter((prevFilter) => ({
        ...prevFilter,
        param1: searchTerm,
      }));
    }, 500); // Delay 500ms sebelum update currentFilter

    return () => clearTimeout(delaySearch); // Hapus timeout jika user mengetik lagi
  }, [searchTerm]);

  useEffect(() => {
    setCurrentFilter((prevFilter) => ({
      ...prevFilter,
      param5: pageCurrent,
    }));
  }, [pageCurrent]);

  const fetchSurvei = async () => {
    setLoading(true);
    try {
      const result = await useFetch(
        `${API_LINK}/TransaksiSurvei/GetDataDaftarSurveixx`,
        currentFilter,
        "POST"
      );
      if (result === "ERROR" || result === null || result.length === 0) {
        setFilteredData([]);
        setTotalData(0);
      } else {
        const arrResult = Object.values(result);
        console.log("Status nih:", arrResult);
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
    fetchSurvei();
  }, [currentFilter]);

  const handlePreview = (item) => {
    // const selected = filteredData.find((obj) => obj.idBad == item.Key);
    // handleOpenModal("detail", selected);
  };

  const handleEdit = (item) => {
    // const selected = filteredData.find((obj) => obj.idBad == item.Key);
    // handleOpenModal("detail", selected);
  };

  if (loading) return <Loading />;
  if (error)
    return (
      <div>
        <p>{error}</p>
      </div>
    );

  return (
    <div className="d-flex flex-column min-vh-100">
      <main className="flex-grow-1 p-3" style={{ marginTop: "80px" }}>
        <div className="container ms-5">
          <div className={isMobile ? "m-0 p-0" : "m-0 mb-0"}>
            <h1 style={{ color: "#2654A1", margin: "0", fontWeight: "700" }}>
              Daftar Survei
            </h1>
            <Breadcrumbs breadcrumbs={breadcrumbs} />
          </div>
        </div>
        <div className="d-flex flex-column">
          <div
            className={isMobile ? "p-2 m-2 mt-2 mb-0" : "p-3 m-5 mt-2 mb-0"}
            style={{ marginLeft: "50px" }}
          >
            <div className="row mt-5 col-12">
              <div className="col-lg-11 col-md-6">
                <SearchField
                  onChange={(e) => setSearchTerm(e)}
                  value={searchTerm}
                />
              </div>
              <div className="col-lg-1 col-md-6">
                <Filter>
                  <div className="mb-3">
                    <DropDown
                      arrData={dataFilterSort}
                      label="Urut Berdasarkan"
                      type="pilih"
                      defaultValue="[namaBad] ASC"
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
                  </div>
                </Filter>
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
            {role === "ROL01" || role === "ROL02" ? (
              <Table
                arrHeader={["No", "Nama Survei", "Tanggal Awal", "Status"]}
                data={filteredData.map((item, index) => ({
                  Key: item.idSurvei,
                  No: (pageCurrent - 1) * pageSize + index + 1,
                  "Nama Survei": item.namaSurvei,
                  "Tanggal Awal": item.tanggalAwalSurvei,
                  Status: item.statusSurvei,
                }))}
                actions={["Preview"]}
                onPreview={(item) =>
                  onChangePage("preview", { idData: item.Key })
                }
              />
            ) : (
              <Table
                arrHeader={["No", "Nama Survei"]}
                data={filteredData.map((item, index) => ({
                  Key: item.idSurvei,
                  No: (pageCurrent - 1) * pageSize + index + 1,
                  "Nama Survei": item.namaSurvei,
                  Status: item.statusTerjawab,
                }))}
                actions={(item) =>
                  item.Status === "Belum Terjawab" ? ["Edit"] : ["Detail"]
                }
                onEdit={(item) => onChangePage("edit", { idData: item.Key })}
                onDetail={(item) =>
                  onChangePage("detail", { idData: item.Key })
                }
              />
            )}

            <Paging
              pageSize={pageSize}
              pageCurrent={pageCurrent}
              totalData={totalData}
              navigation={setPageCurrent}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
