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

export default function Survei({onChangePage}) {
  const [pageSize] = useState(10);
  const isMobile = useIsMobile();
  const [pageCurrent, setPageCurrent] = useState(1);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [allData, setAllData] = useState([]); // Data asli dari API
  
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
              title="Survei"
              breadcrumbs={[
                { label: "Survei", href:"/tentang"}
              ]}
              onClick={() => onChangePage("tentang")}/>

          </div>
          <div className={isMobile ? "p-2 m-2 mt-2 mb-0" : "p-3 m-5 mt-2 mb-0"}
            style={{ marginLeft: "50px"}}>
              <Button 
              iconName="add"
              classType="primary"
              label="Tambah Data"
              onClick={() => onChangePage("add")}
              />
              <div className="row mt-4 col-12">
                <div className="col-md-11">
                <SearchField/>
                </div>
                <div className="col-md-1">
                <Filter/>
                </div>
              </div>
          </div>
          
          <div className={
              isMobile
                ? "table-container bg-white p-2 m-2 mt-0 rounded"
                : "table-container bg-white p-3 m-5 mt-0 rounded"
            }>
              <Table
              arrHeader={["No", "Nama Survei", "Tanggal Awal", "Tanggal Akhir", "Status"]}
              headerToDataMap={{
                No: "No",
                "Nama Survei": "nama",
              }}
              data={currentData.map((item, index) => ({
                key: item.Key || index,
                No: indexOfFirstData + index + 1,
                nama: item.nama,
              }))}
              actions={["Detail"]}
              // onDetail={handleDetail}
              // onEdit={handleEdit}
              
            />

            <Paging
              pageSize={pageSize}
              pageCurrent={pageCurrent}
              totalData={data.length}
              navigation={handlePageNavigation}/>
          </div>
        </div>
      </main>
    </div>
  );
}
