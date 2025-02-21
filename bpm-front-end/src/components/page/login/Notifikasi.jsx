import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import HeaderText from "../../part/HeaderText";
import Text from "../../part/Text";
import PageTitleNav from "../../part/PageTitleNav";
import { useIsMobile } from "../../util/useIsMobile";
import { useEffect, useState } from "react";
import { useFetch } from "../../util/useFetch";
import { API_LINK } from "../../util/Constants";
import Loading from "../../part/Loading";
import moment from "moment";
import Paging from "../../part/Paging";
import "moment/locale/id";

export default function Notifikasi() {
  moment.locale("id");
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const [pageCurrent, setPageCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalData, setTotalData] = useState(0);

  let activeUser = "";
  const cookie = Cookies.get("activeUser");
  if (cookie) activeUser = JSON.parse(cookie).username;

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await useFetch(
        `${API_LINK}/Utilities/GetDataNotifikasi`,
        { id: activeUser, size: pageSize, page: pageCurrent },
        "POST"
      );

      setData(result);

      setTotalData(result[0].TotalCount);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Gagal mengambil data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [pageCurrent]);

  const handleUpdateStatusBaca = async (idNotifikasi) => {
    try {
      const result = await useFetch(
        `${API_LINK}/Utilities/SetStatusBaca`,
        { id: idNotifikasi },
        "POST"
      );
      if (result !== "ERROR") {
        await fetchData(pageCurrent);
      } else {
        console.error("Gagal memperbarui status:", result?.message);
      }
    } catch (err) {
      console.error("Error saat memperbarui status:", err);
    }
  };

  if (loading) return <Loading />;
  if (error) return <p>{error}</p>;

  return (
    <div className={isMobile ? "bg-white mt-5 p-0 pt-5" : "bg-white m-5 p-5"}>
      <PageTitleNav
        title="Notifikasi"
        breadcrumbs={[
          { label: "Profil Pengguna", href: "/profile" },
          { label: "Notifikasi" },
        ]}
        onClick={() => navigate("/profile")}
      />
      <div className="p-3">
        {data.map((item, index) => (
          <div
            key={index}
            className="card-header p-3 mb-2 rounded-4 d-flex justify-content-between align-items-center"
            style={{
              backgroundColor:
                item.StatusBaca === "Belum"
                  ? "rgba(181, 202, 251, 0.3)"
                  : "rgba(108, 117, 125, 0.1)",
            }}
          >
            <div className="d-flex align-items-center me-4">
              <i
                className={
                  item.StatusBaca === "Belum"
                    ? `fi fi-rr-envelope`
                    : `fi fi-rr-envelope-open`
                }
                style={{
                  fontSize: "3.5rem",
                  margin: "0.5rem 1rem 0rem 1rem",
                  color: "#2654a1",
                  cursor: item.StatusBaca === "Belum" ? "pointer" : "none",
                }}
                title="Set Sudah Dibaca"
                onClick={() => {
                  if (item.StatusBaca === "Belum") {
                    handleUpdateStatusBaca(item.idNotifikasi);
                  }
                }}
              ></i>
              <div
                className="d-flex flex-column align-items-start me-4 gap-2"
                style={{ cursor: "pointer" }}
                onClick={() =>
                  navigate(item.LinkNotifikasi, {
                    state: {
                      idData: item.kegiatanNotifikasi,
                    },
                  })
                }
              >
                <HeaderText
                  label={item.PesanNotifikasi}
                  ukuran="1.2rem"
                  warna="#2654a1"
                  alignText="left"
                  marginTop="0rem"
                  marginBottom="0rem"
                />

                <Text
                  isi={item.BodyPesan}
                  ukuran="0.9rem"
                  warna="#575050"
                  alignText="left"
                  style={{ marginBottom: "0rem" }}
                />

                <Text
                  isi={
                    new Date(item.tanggalNotifikasi).toLocaleDateString(
                      "id-ID",
                      {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      }
                    ) +
                    " Oleh " +
                    item.AsalNotifikasi
                  }
                  ukuran="0.8rem"
                  warna="#575050"
                  alignText="left"
                  style={{ marginBottom: "0rem" }}
                />
              </div>
            </div>
          </div>
        ))}

        <div className="mt-4">
          <Paging
            pageSize={pageSize}
            pageCurrent={pageCurrent}
            totalData={totalData}
            navigation={(page) => setPageCurrent(page)}
          />
        </div>
      </div>
    </div>
  );
}
