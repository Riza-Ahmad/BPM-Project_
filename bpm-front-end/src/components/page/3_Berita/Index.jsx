import { useState, useEffect } from "react";
import Button from "../../part/Button";
import HeaderText from "../../part/HeaderText";
import Gedung from "../../../assets/element/gedung-astra-biru.png";
import Mahasiswa from "../../../assets/element/mahasiswa.png";
import SearchField from "../../part/SearchField";
import CardBerita from "../../part/CardBerita";
import Paging from "../../part/Paging";
import Loading from "../../part/Loading";
import Filter from "../../part/Filter";
import { API_LINK, BERITAFOTO_LINK } from "../../util/Constants";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { useIsMobile } from "../../util/useIsMobile";
import { useNavigate } from "react-router-dom";
import { useFetch } from "../../util/useFetch";

export default function Index({ onChangePage }) {
  const [beritaData, setBeritaData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedYear, setSelectedYear] = useState(""); // Tambahkan state untuk filter tahun
  const [pageCurrent, setPageCurrent] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const pageSize = 6;

  useEffect(() => {
    const fetchBerita = async () => {
      try {
        const result = await useFetch(
          `${API_LINK}/MasterBerita/GetDataBerita`,
          JSON.stringify({}),
          "POST"
        );

        const groupedBerita = result.reduce((acc, item) => {
          if (!acc[item.idBerita]) {
            acc[item.idBerita] = {
              id: item.idBerita,
              title: item.judulBerita,
              date: new Date(item.tglBerita),
              formattedDate: format(
                new Date(item.tglBerita),
                "EEEE, dd MMMM yyyy",
                {
                  locale: id,
                }
              ),
              year: new Date(item.tglBerita).getFullYear(),
              description: item.isiBerita,
              author: item.penulisBerita,
              images: [],
            };
          }
          if (item.fotoBerita) {
            acc[item.idBerita].images.push(item.fotoBerita);
          }
          return acc;
        }, {});

        const sortedBerita = Object.values(groupedBerita).sort(
          (a, b) => b.date - a.date
        );

        setBeritaData(sortedBerita);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Gagal mengambil data");
      } finally {
        setLoading(false);
      }
    };

    fetchBerita();
  }, [searchKeyword, selectedYear]);

  useEffect(() => {
    let data = beritaData;

    if (selectedYear) {
      data = data.filter((item) => item.year === parseInt(selectedYear));
    }

    if (searchKeyword) {
      const lowerKeyword = searchKeyword.toLowerCase();
      data = data.filter(
        (item) =>
          item.title.toLowerCase().includes(lowerKeyword) ||
          item.description.toLowerCase().includes(lowerKeyword)
      );
    }

    setFilteredData(data);
  }, [searchKeyword, selectedYear, beritaData]);

  const highlightText = (text, keyword) => {
    if (!keyword) return text;
    const regex = new RegExp(`(${keyword})`, "gi");
    return text.replace(
      regex,
      `<span style="background-color: yellow;">$1</span>`
    );
  };

  const truncateAndHighlight = (text, keyword, maxLength) => {
    const truncated =
      text.length <= maxLength ? text : text.slice(0, maxLength) + "...";
    return highlightText(truncated, keyword);
  };

  const getSnippet = (text, keyword, maxLength) => {
    if (!keyword) return text.slice(0, maxLength) + "...";

    const index = text.toLowerCase().indexOf(keyword.toLowerCase());
    if (index === -1) return text.slice(0, maxLength) + "...";

    const start = Math.max(0, index - Math.floor(maxLength / 2));
    const snippet = text.slice(start, start + maxLength);
    return snippet + "...";
  };

  const totalData = filteredData.length;
  const startIndex = (pageCurrent - 1) * pageSize;
  const currentData = filteredData.slice(startIndex, startIndex + pageSize);

  if (loading) return <Loading />;
  if (error) return <p>{error}</p>;

  return (
    <>
      <div
        className="bg-image position-relative"
        style={{
          backgroundImage: `url(${Gedung})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "100vh",
        }}
      >
        <div
          className={
            isMobile
              ? "position-absolute top-0 end-0 p-5 m-0 mt-5"
              : "position-absolute top-0 end-0 p-5 m-5"
          }
          style={{ zIndex: 1 }}
        >
          <Button
            classType="btn btn-primary"
            title="Kelola Berita"
            label="Kelola Berita"
            onClick={() => onChangePage("read")}
          />
        </div>

        <div className="row">
          <div className="col-lg-4 col-md-6">
            <div
              className="position-absolute"
              style={{
                top: "10%",
                padding: isMobile ? "2rem" : "3rem",
                margin: isMobile ? "1rem" : "3rem",
              }}
            >
              <HeaderText
                label={
                  "Berita Badan<br />Penjamin Mutu (BPM)<br />Politeknik Astra"
                }
                warna="white"
                alignText="left"
                fontWeight="700"
                lebar="310px"
                ukuran={isMobile ? "175%" : "200%"}
              />
            </div>
          </div>
          <div className="col-lg-8 col-md-6">
            <img
              src={Mahasiswa}
              alt="Orang"
              style={{
                position: "absolute",
                right: "0",
                bottom: isMobile ? "120px" : "0",
                width: "75%",
                height: "auto",
                minWidth: "700px",
                paddingRight: "20px",
                maxWidth: "75%",
              }}
            />
          </div>
        </div>
      </div>

      <div
        className="bg-white rounded-5"
        style={{
          position: "relative",
          top: "-10rem",
          zIndex: "1",
          height: "100%",
          padding: isMobile ? "1rem" : "3rem",
          marginBottom: "-5rem",
        }}
      >
        <div
          className="d-flex flex-wrap mt-4"
          style={{
            gap: "20px",
            flexWrap: "wrap",
          }}
        >
          {/* Konten utama (3 bagian dari total ruang) */}
          <div
            style={{
              flex: 4,
              minWidth: isMobile ? "100%" : "75%",
              flexGrow: 1,
            }}
          >
            {/* Search dan Filter (sebelahan) */}
            <div className="row mb-3 p-1">
              <div className="col-12 d-flex flex-wrap align-items-center">
                <div className="me-auto flex-grow-1 mt-3">
                  <SearchField
                    onChange={(value) => setSearchKeyword(value)}
                    placeHolder="Cari Berita..."
                  />
                </div>

                <div className="ms-3 m-0">
                  <Filter>
                    <div className="mb-3">
                      <label htmlFor="yearPicker" className="mb-1">
                        Berdasarkan Tahun
                      </label>
                      <input
                        id="yearPicker"
                        type="number"
                        className="form-control"
                        placeholder="Masukkan Tahun"
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                        min="2000"
                        max={new Date().getFullYear()}
                      />
                    </div>
                    <Button
                      classType="btn btn-secondary"
                      title="Reset Filter"
                      label="Reset"
                      onClick={() => setSelectedYear("")}
                    />
                  </Filter>
                </div>
              </div>
            </div>

            {/* Kartu Berita */}
            <div className="container">
              <div className="row">
                {currentData.map((newsItem, index) => (
                  <div
                    key={index}
                    className={
                      isMobile
                        ? "col-lg-4 col-md-6 col-12 mb-4 p-0"
                        : "col-lg-4 col-md-6 col-12 mb-4 ps-0 p-3"
                    }
                  >
                    <CardBerita
                      title={truncateAndHighlight(
                        newsItem.title,
                        searchKeyword,
                        93
                      )}
                      author={newsItem.author}
                      date={newsItem.formattedDate}
                      description={highlightText(
                        getSnippet(
                          newsItem.description,
                          searchKeyword,
                          isMobile ? 50 : 100
                        ),
                        searchKeyword
                      )}
                      image={BERITAFOTO_LINK + newsItem.images[0]}
                      onClick={() => onChangePage("news", { state: newsItem })}
                    />
                  </div>
                ))}
              </div>
            </div>

            <Paging
              pageSize={pageSize}
              pageCurrent={pageCurrent}
              totalData={totalData}
              navigation={(page) => setPageCurrent(page)}
            />
          </div>

          {/* Sidebar (1 bagian dari total ruang) */}
          <div style={{ flex: 1, minWidth: "250px", flexGrow: 1 }}>
            <div
              style={{
                backgroundColor: "#f8f9fa",
                padding: "20px",
                borderRadius: "8px",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              }}
            >
              <HeaderText
                label="5 Berita Terkini"
                ukuran="1.5rem"
                alignText="left"
                warna="#2654A1"
              />
              {beritaData.slice(0, 5).map((newsItem, index) => (
                <div
                  key={index}
                  style={{
                    marginBottom: "20px",
                  }}
                >
                  <div className="row">
                    {/* Kolom Gambar */}
                    <div className="col-md-4 mb-3">
                      <img
                        src={BERITAFOTO_LINK + newsItem.images[0]}
                        className="img-fluid"
                        alt={newsItem.title}
                      />
                    </div>
                    {/* Kolom Teks */}
                    <div className="col-md-8">
                      {/* Header yang Bisa Diklik dengan Hover */}
                      <div
                        onClick={() =>
                          navigate("/berita/lihatBerita", { state: newsItem })
                        }
                        style={{
                          cursor: "pointer",
                          textDecoration: "none",
                          color: "black",
                          transition: "color 0.3s", // Untuk transisi halus
                        }}
                        onMouseEnter={(e) => (e.target.style.color = "#007bff")} // Warna biru saat hover
                        onMouseLeave={(e) => (e.target.style.color = "black")} // Kembalikan ke warna hitam saat keluar hover
                      >
                        <HeaderText
                          label={newsItem.title}
                          ukuran="16px"
                          warna="black"
                          fontWeight="500"
                          alignText="left"
                          marginBottom="10px"
                          marginTop="0"
                        />
                      </div>
                      <p
                        style={{
                          color: "#007bff",
                          fontSize: "14px",
                          marginBottom: "10px",
                        }}
                      >
                        {newsItem.formattedDate}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
