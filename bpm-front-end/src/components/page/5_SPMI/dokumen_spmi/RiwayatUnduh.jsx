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
import { format } from "date-fns";
import { formatDate } from "../../../util/Formatting";

export default function RiwayatUnduh({ onChangePage }) {
  const location = useLocation();
  const isMobile = useIsMobile();

  const [pageSize] = useState(10);
  const [pageCurrent, setPageCurrent] = useState(1);
  const [totalData, setTotalData] = useState(0);
  const [filteredData, setFilteredData] = useState([]);
  const idMenu = location.state?.idMenu;
  const idData = location.state?.idData;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDokumen = async () => {
      setLoading(true);
      try {
        const result = await useFetch(
          `${API_LINK}/MasterDokumen/GetDataRiwayatUnduhanDokumenById`,
          {
            param1: idData,
            param2: pageSize,
            param3: pageCurrent,
          },
          "POST"
        );

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
  }, [idData, pageCurrent]);

  if (error)
    return (
      <div>
        <p>{error}</p>
      </div>
    );

  return (
    <div className="d-flex flex-column min-vh-100">
      <main className="flex-grow-1 p-3" style={{ marginTop: "80px" }}>
        <div className="d-flex flex-column">
          <div className="m-3 mb-0">
            <PageTitleNav
              title="Riwayat Unduhan"
              breadcrumbs={location.state?.breadcrumbs}
              onClick={() =>
                onChangePage("index", {
                  idMenu: idMenu,
                })
              }
            />
          </div>
          <div
            className={
              isMobile
                ? "table-container bg-white p-1 m-1 mt-0 rounded"
                : "table-container bg-white p-3 m-5 mt-0 rounded"
            }
          >
            <div className="table-container bg-white rounded">
              {loading ? (
                <Loading />
              ) : (
                <div>
                  <Table
                    arrHeader={[
                      "No",
                      "Tanggal Unduh",
                      "Judul Dokumen",
                      "Nama Berkas (File)",
                      "Jenis Penyalinan",
                      "Nama Pengunduh",
                      "Jabatan",
                      "Status",
                    ]}
                    data={filteredData.map((item, index) => ({
                      Key: item.idUdo,
                      No: (pageCurrent - 1) * pageSize + index + 1,
                      "Tanggal Unduh": item.tglUdo
                        ? formatDate(item.tglUdo)
                        : "-",
                      "Judul Dokumen": item.judulDok,
                      "Nama Berkas (File)": item.fileDok,
                      "Jenis Penyalinan": item.jenisDok,
                      "Nama Pengunduh": item.namaKry,
                      Jabatan: item.jabatan,
                      Status: item.status,
                    }))}
                    aksiIs={false}
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
    </div>
  );
}
