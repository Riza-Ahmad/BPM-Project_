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
    { Key: 1, JudulDokumen: "PERKEMENDIKBUD NO.5 TAHUN 2020" },
    { Key: 2, JudulDokumen: "PERKEMENDIKBUD NO.7 TAHUN 2020" },
    {
      Key: 3,
      JudulDokumen:
        "PERKEMENDIKBUDRISTEK NO.53 TAHUN 2023 TENTANG PENJAMINAN MUTU PENDIDIKAN TINGGI",
    },
    {
      Key: 4,
      JudulDokumen:
        "Pengajar memberikan contoh yang relevan terhadap materi perkuliahan dan atau praktek",
    },
    {
      Key: 5,
      JudulDokumen:
        "Pengajar memberikan contoh yang relevan terhadap materi perkuliahan dan atau praktek",
    },
  ];

  const indexOfLastData = pageCurrent * pageSize;
  const indexOfFirstData = indexOfLastData - pageSize;
  const currentData = data.slice(indexOfFirstData, indexOfLastData);

  const handlePageNavigation = (page) => {
    setPageCurrent(page);
  };

  const title = "Dokumen Peraturan";
  const breadcrumbs = [
    { label: "Peraturan", href: "/peraturan/kebijakan" },
    { label: "Dokumen Kebijakan Peraturan" },
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
