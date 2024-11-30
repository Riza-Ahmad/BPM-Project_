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

export default function Index({ onChangePage }) {
  const [beritaData, setBeritaData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedYear, setSelectedYear] = useState(""); // Tambahkan state untuk filter tahun
  const [pageCurrent, setPageCurrent] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isMobile = useIsMobile();
  const pageSize = 2;

  // Fetch berita data
  useEffect(() => {
    const fetchBerita = async () => {
      try {
        const response = await fetch(`${API_LINK}/MasterBerita/GetDataBerita`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) throw new Error("Gagal mengambil data");

        const result = await response.json();

        const groupedBerita = result.reduce((acc, item) => {
          if (!acc[item.ber_id]) {
            acc[item.ber_id] = {
              id: item.ber_id,
              title: item.ber_judul,
              date: format(new Date(item.ber_tgl), "EEEE, dd MMMM yyyy", {
                locale: id,
              }),
              year: new Date(item.ber_tgl).getFullYear(), // Simpan tahun
              description: item.ber_isi,
              author: item.ber_penulis,
              images: [],
            };
          }
          if (item.dbr_foto) {
            acc[item.ber_id].images.push(item.dbr_foto);
          }
          return acc;
        }, {});

        setBeritaData(Object.values(groupedBerita));
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Gagal mengambil data");
      } finally {
        setLoading(false);
      }
    };

    fetchBerita();
  }, []);

  // Handle search and year filtering
  useEffect(() => {
    let data = beritaData;

    // Filter berdasarkan tahun
    if (selectedYear) {
      data = data.filter((item) => item.year === parseInt(selectedYear));
    }

    // Filter berdasarkan kata kunci
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

  // Highlight search keyword in text
  const highlightText = (text, keyword) => {
    if (!keyword) return text;
    const regex = new RegExp(`(${keyword})`, "gi");
    return text.replace(
      regex,
      `<span style="background-color: yellow;">$1</span>`
    );
  };

  // Truncate and highlight text
  const truncateAndHighlight = (text, keyword, maxLength) => {
    const truncated =
      text.length <= maxLength ? text : text.slice(0, maxLength) + "...";
    return highlightText(truncated, keyword);
  };

  // Get snippet of text with search keyword
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
        className="shadow bg-white rounded-5"
        style={{
          position: "relative",
          top: "-18rem",
          zIndex: "1",
          height: "100%",
          padding: isMobile ? "2rem" : "3rem",
          margin: isMobile ? "1rem" : "7rem",
          marginBottom: "-15rem",
        }}
      >
        <div className="row mb-3">
          <div className="col-lg-10 col-md-6">
            <SearchField
              onChange={(value) => setSearchKeyword(value)}
              placeHolder="Cari Berita..."
            />
          </div>
          <div className="col-lg-2 col-md-6">
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
        <div className="row mt-4">
          {currentData.map((newsItem, index) => (
            <CardBerita
              key={index}
              title={truncateAndHighlight(newsItem.title, searchKeyword, 93)}
              author={newsItem.author}
              date={newsItem.date}
              description={highlightText(
                getSnippet(
                  newsItem.description,
                  searchKeyword,
                  isMobile ? 100 : 280
                ),
                searchKeyword
              )}
              image={BERITAFOTO_LINK + newsItem.images[0]}
              onClick={() => onChangePage("news", { state: newsItem })}
            />
          ))}
        </div>
        <Paging
          pageSize={pageSize}
          pageCurrent={pageCurrent}
          totalData={totalData}
          navigation={(page) => setPageCurrent(page)}
        />
      </div>
    </>
  );
}
