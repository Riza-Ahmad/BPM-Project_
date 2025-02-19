import React, { useState, useEffect } from "react";
import Table from "../../part/Table";
import Paging from "../../part/Paging";
import PageTitleNav from "../../part/PageTitleNav";
import Loading from "../../part/Loading";
import { API_LINK } from "../../util/Constants";
import { useIsMobile } from "../../util/useIsMobile";
import { useFetch } from "../../util/useFetch";
import SweetAlert from "../../util/SweetAlert";

export default function Read({ onChangePage }) {
  const [pageSize] = useState(10);
  const [pageCurrent, setPageCurrent] = useState(1);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isMobile = useIsMobile();

  const fetchData = async () => {
    try {
      const result = await useFetch(
        `${API_LINK}/MasterTentang/GetDataTentangAll`,
        JSON.stringify({}),
        "POST"
      );
      setData(result);
      setLoading(false);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Gagal mengambil data");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const indexOfLastData = pageCurrent * pageSize;
  const indexOfFirstData = indexOfLastData - pageSize;
  const currentData = data.slice(indexOfFirstData, indexOfLastData);

  const handlePageNavigation = (page) => {
    setPageCurrent(page);
  };

  const handleToggle = (id) => {
    const item = data.find((data) => data.idTentang === id);

    if (!item) {
      SweetAlert("Peringatan", "ID file tidak tersedia.", "warning");
      return;
    }

    SweetAlert(
      "Konfirmasi",
      `Apakah Anda yakin ingin ${
        item.statusTentang === "Aktif" ? "menonaktifkan" : "mengaktifkan"
      } data ini?`,
      "question",
      "Ya",
      null,
      "",
      true
    ).then((result) => {
      if (result) {
        const updatedData = data
          .filter((data) => data.idTentang === id)
          .map((data) => ({
            idDok: data.idTentang,
          }));

        useFetch(
          `${API_LINK}/MasterTentang/updateStatusTentang`,
          updatedData[0]
        )
          .then((response) => {
            if (response === "ERROR") {
              throw new Error("Gagal memperbarui data");
            }
            SweetAlert(
              "Berhasil!",
              "Data berhasil diperbarui",
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

  if (loading) return <Loading />;
  if (error) return <div>{error}</div>;

  return (
    <div className="d-flex flex-column min-vh-100">
      <main className="flex-grow-1 p-3" style={{ marginTop: "80px" }}>
        <div className="d-flex flex-column">
          <div className={isMobile ? "m-0 p-0" : "m-3 mb-0"}>
            <PageTitleNav
              title="Kelola Tentang"
              breadcrumbs={[
                { label: "Tentang", href: "/tentang" },
                { label: "Kelola Tentang" },
              ]}
              onClick={() => onChangePage("index")}
            />
          </div>

          <div
            className={
              isMobile
                ? "table-container bg-white p-2 m-2 mt-0 rounded"
                : "table-container bg-white p-3 m-5 mt-0 rounded"
            }
          >
            <Table
              arrHeader={["No", "Kategori"]}
              data={currentData.map((item, index) => ({
                Key: item.idTentang,
                No: indexOfFirstData + index + 1,
                Kategori: item.kategoriTentang,
                status: item.statusTentang,
              }))}
              actions={(item) => {
                return item.Key < 9
                  ? ["Detail", "Edit"]
                  : ["Detail", "Edit", "Toggle"];
              }}
              onEdit={(item) => onChangePage("edit", { idData: item.Key })}
              onDetail={(item) => onChangePage("detail", { idData: item.Key })}
              onToggle={(item) => handleToggle(item.Key)}
            />

            <Paging
              pageSize={pageSize}
              pageCurrent={pageCurrent}
              totalData={data.length}
              navigation={handlePageNavigation}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
