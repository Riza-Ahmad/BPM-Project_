import React, { useState, useEffect } from "react";
import Table from "../../part/Table";
import Paging from "../../part/Paging";
import PageTitleNav from "../../part/PageTitleNav";
import Loading from "../../part/Loading";
import { API_LINK } from "../../util/Constants";
import { useIsMobile } from "../../util/useIsMobile";

export default function Read({ onChangePage }) {
  const [pageSize] = useState(10);
  const [pageCurrent, setPageCurrent] = useState(1);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          API_LINK + "/api/MasterTentang/GetDataTentang",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              page: pageCurrent,
              pageSize: pageSize,
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const result = await response.json();
        setData(result);
        setLoading(false);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Gagal mengambil data");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const indexOfLastData = pageCurrent * pageSize;
  const indexOfFirstData = indexOfLastData - pageSize;
  const currentData = data.slice(indexOfFirstData, indexOfLastData);

  const handlePageNavigation = (page) => {
    setPageCurrent(page);
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
              headerToDataMap={{
                No: "No",
                Kategori: "ten_category",
              }}
              data={currentData.map((item, index) => ({
                Key: item.ten_id,
                No: indexOfFirstData + index + 1,
                ten_category: item.ten_category,
              }))}
              actions={["Detail", "Edit"]}
              onEdit={(item) =>
                onChangePage("edit", { state: { idData: item } })
              }
              onDetail={(item) =>
                onChangePage("detail", { state: { idData: item } })
              }
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
