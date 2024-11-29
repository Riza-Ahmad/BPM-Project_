import React, { useState } from "react";
import Table from "../../../part/Table";
import Paging from "../../../part/Paging";
import PageTitleNav from "../../../part/PageTitleNav";
import SearchField from "../../../part/SearchField";
import Button from "../../../part/Button";
import TextField from "../../../part/TextField";

export default function Read({ onChangePage }) {
  const [pageSize] = useState(10);
  const [pageCurrent, setPageCurrent] = useState(1);

  // Menambahkan data menjadi 10 item dengan URL gambar
  const data = [
    { Key: 1, JudulDokumen: "INSTRUMEN APS A" },
    { Key: 2, JudulDokumen: "INSTRUMEN APS B" },
    {
      Key: 3,
      JudulDokumen: "INSTRUMEN APS C",
    },
    {
      Key: 4,
      JudulDokumen: "INSTRUMEN APS D",
    },
    {
      Key: 5,
      JudulDokumen: "INSTRUMEN APS E",
    },
  ];

  const indexOfLastData = pageCurrent * pageSize;
  const indexOfFirstData = indexOfLastData - pageSize;
  const currentData = data.slice(indexOfFirstData, indexOfLastData);

  const handlePageNavigation = (page) => {
    setPageCurrent(page);
  };

  const title = "Instrumen APS";
  const breadcrumbs = [
    { label: "Instrumen APS", href: "/peraturan/aps" },
    { label: "Dokumen Instrumen APS" },
  ];

  const handleEdit = (item) => {
    onChangePage("edit", { state: { editData: item } });
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <main className="flex-grow-1 p-3" style={{ marginTop: "80px" }}>
        <div className="d-flex flex-column">
          <div className="m-3 mb-0">
            <PageTitleNav
              title={title}
              breadcrumbs={breadcrumbs}
              onClick={() => onChangePage("index")}
            />
          </div>
          <div className="p-3 m-5 mt-2 mb-0" style={{ marginLeft: "50px" }}>
            <Button
              iconName="add"
              classType="primary"
              label="Tambah Data"
              onClick={() => onChangePage("add")}
            />
          </div>
          <div className="table-container bg-white p-3 m-5 mt-0 rounded">
            <Table
              arrHeader={["No", "Judul Dokumen"]}
              headerToDataMap={{
                No: "No",
                "Judul Dokumen": "JudulDokumen",
              }}
              data={currentData.map((item, index) => ({
                key: item.Key || index,
                No: indexOfFirstData + index + 1,
                JudulDokumen: item.JudulDokumen,
              }))}
              actions={["Detail", "Edit", "Delete", "UpdateHistory"]}
              onEdit={handleEdit}
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
