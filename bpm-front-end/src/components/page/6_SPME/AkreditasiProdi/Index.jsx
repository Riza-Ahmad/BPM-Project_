import React, { useState } from "react";
import Table from "../../../part/Table";
import Paging from "../../../part/Paging";
import SearchField from "../../../part/SearchField";
import Button from "../../../part/Button";
import Filter from "../../../part/Filter";

export default function Index({ onChangePage, title, breadcrumbs }) {
  const data = [
    { Key: 1, JudulDokumen: "AKREDITASI A" },
    { Key: 2, JudulDokumen: "AKREDITASI B" },
    {
      Key: 3,
      JudulDokumen: "AKREDITASI C",
    },
    {
      Key: 4,
      JudulDokumen: "AKREDITASI D",
    },
    {
      Key: 5,
      JudulDokumen: "AKREDITASI E",
    },
  ];

  const [pageSize] = useState(10);
  const [pageCurrent, setPageCurrent] = useState(1);
  const indexOfLastData = pageCurrent * pageSize;
  const indexOfFirstData = indexOfLastData - pageSize;
  const currentData = data.slice(indexOfFirstData, indexOfLastData);

  const handlePageNavigation = (page) => {
    setPageCurrent(page);
  };

  const handleEdit = (item) => {
    onChangePage("edit", { state: { editData: item } });
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <main className="flex-grow-1 p-3" style={{ marginTop: "80px" }}>
        <div className="d-flex flex-column">
          <div className="container mb-3">
            <div className="mt-3">
              <div className="d-flex justify-content-between align-items-center">
                <h1
                  style={{ color: "#2654A1", margin: "0", fontWeight: "700" }}
                >
                  {title}
                </h1>
              </div>

              <nav className="ms-1">
                <ol className="breadcrumb">
                  {breadcrumbs &&
                    breadcrumbs.map((breadcrumb, index) => (
                      <li
                        key={index}
                        className={`breadcrumb-item ${
                          breadcrumb.href ? "" : "active"
                        }`}
                        aria-current={breadcrumb.href ? undefined : "page"}
                      >
                        {breadcrumb.href ? (
                          <span
                            style={{
                              color: "#575050",
                              textDecoration: "none",
                              cursor: "pointer",
                            }}
                          >
                            {breadcrumb.label}
                          </span>
                        ) : (
                          <span>{breadcrumb.label}</span>
                        )}
                      </li>
                    ))}
                </ol>
              </nav>
            </div>

            <div
              className="mt-5 mb-0"
              // style={{ marginLeft: "50px", margin: isMobile ? "1rem" : "3rem" }}
            >
              <Button
                iconName="add"
                classType="primary"
                label="Tambah Skala Penilaian"
                // onClick={() => addModalRef.current.open()}
              />
              <div className="row mt-3 ">
                <div className="col-lg-10 col-md-6 ">
                  <SearchField />
                </div>
                <div className="col-lg-2 col-md-6">
                  <Filter />
                </div>
              </div>
            </div>
            {/* <div className="row mt-3 ">
                <div className="col-lg-2 col-md-6 ">
                  <Button
                    iconName="add"
                    classType="primary"
                    label="Tambah Dokumen"
                    onClick={() => onChangePage("add")}
                  />
                </div>
                <div className="col-lg-8 col-md-6 ">
                  <SearchField></SearchField>
                </div>
                <div className="col-lg-2 col-md-6">
                  <Button
                    iconName="settings-sliders"
                    classType="primary"
                    label="Filter"
                  />
                </div>
              </div> */}
            <div className="table-container bg-white rounded">
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
        </div>
      </main>
    </div>
  );
}
