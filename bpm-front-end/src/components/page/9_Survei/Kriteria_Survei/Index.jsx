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

import { API_LINK } from "../../../util/Constants";
import { useIsMobile } from "../../../util/useIsMobile";

export default function KriteriaSurvei({ onChangePage }) {
  const [pageSize] = useState(10);
  const isMobile = useIsMobile();
  const [pageCurrent, setPageCurrent] = useState(1);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [allData, setAllData] = useState([]); // Data asli dari API
  useEffect(() => {
    const fetchKriteria = async () => {
      try {
        const response = await fetch(
          `${API_LINK}/MasterKriteriaSurvei/GetDataKriteriaSurvei`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ page: 1, pageSize: 100 }),
          }
        );

        if (!response.ok) throw new Error("Gagal mengambil data kriteria");

        const result = await response.json();

        const groupedKriteria = result.map((item) => ({
          id: item.ksr_id,
          nama: item.ksr_nama,
        }));

        setData(groupedKriteria);
      } catch (err) {
        console.error("Fetch error:", err);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Gagal mengambil data kriteria!",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchKriteria();
  }, []);

  const indexOfLastData = pageCurrent * pageSize;
  const indexOfFirstData = indexOfLastData - pageSize;
  const currentData = data.slice(indexOfFirstData, indexOfLastData);

  const handlePageNavigation = (page) => {
    setPageCurrent(page);
  };
  return (
    <div className="d-flex flex-column min-vh-100">
      <main className="flex-grow-1 p-3" style={{ marginTop: "80px" }}>
        <div className="d-flex flex-column">
          <div className={isMobile ? "m-0 p-0" : "m-3 mb-0"}>
            <PageTitleNav
              title="Kriteria Survei"
              breadcrumbs={[{ label: "Kriteria Survei", href: "/tentang" }]}
              onClick={() => onChangePage("tentang")}
            />
          </div>{" "}
          <div
            className={isMobile ? "p-2 m-2 mt-2 mb-0" : "p-3 m-5 mt-2 mb-0"}
            style={{ marginLeft: "50px" }}
          >
            <Button
              iconName="add"
              classType="primary"
              label="Tambah Kriteria"
              onClick={() => handleOpenModal("add")}
            />
          </div>
          <div className="row mt-5">
            <div className="col-lg-11 col-md-6 ">
              <SearchField></SearchField>
            </div>
            <div className="col-lg-1 col-md-6 ">
              <Filter></Filter>
            </div>
          </div>
        </div>

        <div
          className={
            isMobile
              ? "table-container bg-white p-2 m-2 rounded"
              : "table-container bg-white p-3 m-5 rounded"
          }
        >
          <Table
            arrHeader={["No", "Nama Kriteria"]}
            headerToDataMap={{
              No: "No",
              "Nama Kriteria": "name",
            }}
            data={currentData.map((item, index) => ({
              Key: item.id,
              No: indexOfFirstData + index + 1,
              name: item.name,
            }))}
            actions={["Edit", "Detail"]}
            onEdit={(id) => {
              const selected = data.find((item) => item.id === id);
              handleOpenModal("edit", selected);
            }}
            onDetail={(id) => {
              const selected = data.find((item) => item.id === id);
              handleOpenModal("detail", selected);
            }}
          />
          <Paging
            pageSize={pageSize}
            pageCurrent={pageCurrent}
            totalData={data.length}
            navigation={handlePageNavigation}
          />
        </div>
      </main>
    </div>
  );
}
