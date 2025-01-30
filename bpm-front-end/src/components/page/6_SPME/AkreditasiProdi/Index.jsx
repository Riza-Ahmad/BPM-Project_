import { useState, useRef, useEffect } from "react";
import Table from "../../../part/Table";
import Paging from "../../../part/Paging";
import SearchField from "../../../part/SearchField";
import Button from "../../../part/Button";
import Filter from "../../../part/Filter";
import Breadcrumbs from "../../../part/Breadcrumbs";
import { API_LINK } from "../../../util/Constants";
import { useFetch } from "../../../util/useFetch";
import { useNavigate } from "react-router-dom";
import SweetAlert from "../../../util/SweetAlert";
import { useLocation } from "react-router-dom";
import Loading from "../../../part/Loading";
import moment from "moment";
import Cookies from "js-cookie";

const title = "Akreditasi Program Studi";
const breadcrumbs = [
  { label: "SPME" },
  { label: "Akreditasi" },
  { label: "Program Studi" },
];

export default function Index({ onChangePage }) {
  const activeUser = Cookies.get("activeUser");
  let role = ""; // Jika undefined, gunakan nilai default
  let roleNama = "";
  let namaPengguna = "";
  if (activeUser) {
    role = JSON.parse(activeUser).RoleID.slice(0, 5);
    roleNama = JSON.parse(activeUser).Role;
    namaPengguna = JSON.parse(activeUser).Nama;
  }
  const [error, setError] = useState(null);

  const [loading, setLoading] = useState(true);

  const [pageSize] = useState(10);
  const [pageCurrent, setPageCurrent] = useState(1);
  const [totalData, setTotalData] = useState(0);
  const [filteredData, setFilteredData] = useState([]);

  const location = useLocation();
  const idMenu = location.state?.idMenu;
  const idData = location.state?.idData;

  const [currentFilter, setCurrentFilter] = useState({
    param1: "",
    param2: "[namaAkr] ASC",
    param3: pageSize,
    param4: pageCurrent,
  });

  console.log(currentFilter);

  const fetchAkreProdi = async () => {
    setLoading(true);
    try {
      const result = await useFetch(
        `${API_LINK}/MasterAkreditasi/GetAkreditasiProdi`,
        currentFilter,
        "POST"
      );

      if (result === "ERROR" || result === null || result.length === 0) {
        setFilteredData([]);
        setTotalData(0);
      } else {
        const dokumenArray = Object.values(result);
        setFilteredData(dokumenArray);
        setTotalData(dokumenArray[0].TotalCount);
        console.log(dokumenArray);
      }
    } catch (err) {
      setError("Gagal mengambil data: " + err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchAkreProdi();
  }, [currentFilter]);

  const handleEdit = (item) => {
    onChangePage("edit", {
      idData: item.Key,
      idMenu: idMenu,
      breadcrumbs: breadcrumbs,
    });
  };
  const handleDetail = (item) => {
    onChangePage("detail", {
      idData: item.Key,
      idMenu: idMenu,
      breadcrumbs: breadcrumbs,
    });
  };
  const handleDelete = (item) => {
    // Tampilkan konfirmasi menggunakan SweetAlert sebelum toggle status
    SweetAlert(
      "Konfirmasi",
      `Apakah Anda yakin ingin menghapus data ini?`,
      "question",
      "Ya",
      null,
      "",
      true // Tampilkan tombol batal
    ).then((result) => {
      if (result) {
        // Jika pengguna mengonfirmasi, hanya simpan idAkr dan status yang diperbarui
        const updatedData = filteredData
          .filter((data) => data.idAkr === item.Key)
          .map((data) => ({
            idAkr: data.idAkr,
            status: data.status === "Aktif" ? "Tidak Aktif" : "Aktif",
          }));

        useFetch(
          `${API_LINK}/MasterAkreditasi/SetStatusAkreditasi`,
          updatedData[0]
        )
          .then((response) => {
            if (response === "ERROR") {
              throw new Error("Gagal memperbarui data");
            }
            SweetAlert(
              "Berhasil!",
              "Data berhasil dihapus",
              "success",
              "OK"
            ).then(() => {
              // Panggil fetchEvents untuk memperbarui data tanpa reload halaman
              fetchAkreProdi();
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

  return (
    <div className="d-flex flex-column min-vh-100">
      <main className="flex-grow-1 p-3" style={{ marginTop: "80px" }}>
        <div className="d-flex flex-column">
          <div className="container mb-3">
            <h1 style={{ color: "#2654A1", margin: "0", fontWeight: "700" }}>
              {title}
            </h1>
            <Breadcrumbs breadcrumbs={breadcrumbs} />

            <div
              className="mt-4 mb-0"
              // style={{ marginLeft: "50px", margin: isMobile ? "1rem" : "3rem" }}
            >
              {role === "ROL01" ? (
                <Button
                  iconName="add"
                  classType="primary"
                  label="Tambah Data"
                  onClick={() =>
                    onChangePage("add", {
                      idMenu: idMenu,
                    })
                  }
                />
              ) : (
                ""
              )}

              <div className="row mt-3 ">
                <div className="col-lg-10 col-md-6 ">
                  <SearchField />
                </div>
                <div className="col-lg-2 col-md-6">
                  <Filter></Filter>
                </div>
              </div>
            </div>
            <div className="table-container bg-white rounded">
              <Table
                arrHeader={[
                  "No",
                  "Kode Prodi",
                  "Nama Prodi",
                  "Jenjang",
                  "Nomor SK",
                  "Tahun SK",
                  "Peringkat",
                  "Tanggal Kadaluwarsa",
                ]}
                data={filteredData.map((item, index) => ({
                  Key: item.idAkr,
                  No: (pageCurrent - 1) * pageSize + index + 1,
                  "Kode Prodi": item.kodeAkr,
                  "Nama Prodi": item.namaAkr,
                  Jenjang: item.jenjangAkr,
                  "Nomor SK": item.noAkr || "-",
                  "Tahun SK": item.tahunAkr || "-",
                  Peringkat: item.peringkatAkr || "-",
                  "Tanggal Kadaluwarsa": item.expAkr
                    ? moment(item.expAkr).format("YYYY-MM-DD")
                    : "-",
                }))}
                aksiIs={role === "ROL01" ? true : false}
                actions={["Detail", "Edit", "Delete"]}
                onEdit={handleEdit}
                onDetail={handleDetail}
                onDelete={handleDelete}
              />

              <Paging
                pageSize={pageSize}
                pageCurrent={pageCurrent}
                totalData={totalData}
                navigation={setPageCurrent}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
