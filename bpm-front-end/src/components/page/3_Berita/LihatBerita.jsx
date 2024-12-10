import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import HeaderText from "../../part/HeaderText";
import PageTitleNav from "../../part/PageTitleNav";
import Text from "../../part/Text";
import SliderBerita from "../../part/SliderBerita";
import { API_LINK, BERITAFOTO_LINK } from "../../util/Constants";
import Loading from "../../part/Loading";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { useIsMobile } from "../../util/useIsMobile";

const LihatBerita = ({ onChangePage }) => {
  const location = useLocation();
  const isMobile = useIsMobile();

  const [beritaData, setBeritaData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBerita = async () => {
      try {
        const response = await fetch(`${API_LINK}/MasterBerita/GetDataBerita`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) throw new Error("Gagal mengambil data");

        const result = await response.json();
        console.log(result);

        const groupedBerita = result.reduce((acc, item) => {
          if (!acc[item.ber_id]) {
            acc[item.ber_id] = {
              id: item.ber_id,
              title: item.ber_judul,
              date: new Date(item.ber_tgl), // Simpan sebagai objek Date
              formattedDate: format(
                new Date(item.ber_tgl),
                "EEEE, dd MMMM yyyy",
                {
                  locale: id,
                }
              ),
              year: new Date(item.ber_tgl).getFullYear(),
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

        const sortedBerita = Object.values(groupedBerita).sort(
          (a, b) => b.date - a.date // Urutkan berdasarkan tanggal terbaru
        );

        setBeritaData(sortedBerita);
        console.log(sortedBerita);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Gagal mengambil data");
      } finally {
        setLoading(false);
      }
    };

    fetchBerita();
  }, []);

  const {
    title = "Judul Tidak Tersedia",
    author = "Penulis Tidak Diketahui",
    formattedDate = "Tanggal Tidak Tersedia",
    description = "Deskripsi Tidak Tersedia",
    images = [],
  } = location.state || {};

  const filteredBeritaData = beritaData.filter(
    (berita) => berita.title !== title
  );

  if (loading) return <Loading />;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <div className="position-relative">
        <div
          id="carouselExample"
          className="carousel slide"
          data-bs-ride="carousel"
        >
          <div className="carousel-inner" style={{ height: "600px" }}>
            {images.map((img, index) => (
              <div
                className={`carousel-item ${index === 0 ? "active" : ""}`}
                key={index}
                style={{
                  backgroundImage: `url(${BERITAFOTO_LINK}${img})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  height: "600px",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background:
                      "linear-gradient(to bottom, rgba(0, 0, 0, 0.8), transparent 40%, transparent 70%, rgba(0, 0, 0, 0.9))",
                  }}
                ></div>
              </div>
            ))}
          </div>

          {images.length > 1 && (
            <>
              <button
                className="carousel-control-prev"
                type="button"
                data-bs-target="#carouselExample"
                data-bs-slide="prev"
              >
                <span
                  className="carousel-control-prev-icon"
                  aria-hidden="true"
                ></span>
                <span className="visually-hidden">Previous</span>
              </button>
              <button
                className="carousel-control-next"
                type="button"
                data-bs-target="#carouselExample"
                data-bs-slide="next"
              >
                <span
                  className="carousel-control-next-icon"
                  aria-hidden="true"
                ></span>
                <span className="visually-hidden">Next</span>
              </button>
            </>
          )}

          <div
            className="position-absolute top-0 start-0 m-5 ms-0"
            style={{
              zIndex: 1,
              paddingTop: "3rem",
              paddingLeft: isMobile ? "0rem" : "8rem",
            }}
          >
            <PageTitleNav
              title="Baca Berita"
              onClick={() => onChangePage("index")}
              color="white"
            />
          </div>

          <div
            className="position-absolute bottom-0 start-0 m-4"
            style={{
              paddingLeft: isMobile ? "1rem" : "9rem",
              paddingRight: isMobile ? "0rem" : "8rem",
            }}
          >
            <HeaderText
              label={title}
              warna="white"
              alignText="left"
              fontWeight="700"
              lebar="310px"
              marginBottom="10px"
            />
            <p className="text-white">
              Oleh {author} Tanggal {formattedDate || "Tanggal Tidak Tersedia"}
            </p>
          </div>
        </div>
      </div>

      <div
        style={{
          paddingLeft: isMobile ? "0rem" : "7rem",
          paddingRight: isMobile ? "0rem" : "8rem",
        }}
      >
        <div
          className="bg-white rounded-3"
          style={{
            padding: isMobile ? "2rem" : "0rem",
            margin: isMobile ? "0rem" : "3rem",
          }}
        >
          <Text isi={description} warna="gray" />
        </div>

        <div>
          <HeaderText
            label="Berita Lainnya"
            warna="#2654A1"
            alignText="center"
            fontWeight="650"
            lebar="310px"
            marginBottom="30px"
          />

          <SliderBerita beritaItems={filteredBeritaData} />
        </div>
      </div>
    </div>
  );
};

export default LihatBerita;
