import HeaderText from "../../part/HeaderText";
import Text from "../../part/Text";
import Orang from "../../../assets/element/orang.png";
import Hiasan from "../../../assets/element/hiasan.png";
import Hiasan3 from "../../../assets/element/hiasan3.png";
import OrangKerja from "../../../assets/element/orang-kerja.png";
import { useIsMobile } from "../../util/useIsMobile";
import { useFetch } from "../../util/useFetch";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { useEffect, useState } from "react";
import SliderBerita from "../../part/SliderBerita2";
import { API_LINK } from "../../util/Constants";
import Loading from "../../part/Loading";
import SliderKegiatan from "../../part/SliderKegiatan";
import SliderProgramStudi from "../../part/SliderProgramStudi";
import Button from "../../part/Button";
import { useNavigate } from "react-router-dom";

export default function Index() {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [beritaData, setBeritaData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [akreditasiData, setDataAkreditasi] = useState([]);

  const [rencanaKegiatan, setRencanaKegiatan] = useState([]);

  useEffect(() => {
    const fetchKategoriKegiatan = async () => {
      try {
        const data = await useFetch(
          `${API_LINK}/MasterKegiatan/UpdateKategoriKegiatan`,
          {},
          "POST"
        );

        if (data === "ERROR") {
          throw new Error("Gagal memperbarui data");
        }
      } catch (error) {
        setError(error.message);
      }
    };

    fetchKategoriKegiatan();
  }, []);

  useEffect(() => {
    const fetchJenisKegiatan = async () => {
      try {
        const data = await useFetch(
          `${API_LINK}/MasterKegiatan/GetDataKegiatanByCategory`,
          { kategori: "Rencana" },
          "POST"
        );
        const formattedData = [
          data.map((item) => ({
            id: item.idKegiatan,
            nama: item.namaKegiatan,
            deskripsi: item.deskripsiKegiatan,
          })),
        ];

        setRencanaKegiatan(formattedData);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchJenisKegiatan();
  }, []);

  useEffect(() => {
    const fetchAkreProdi = async () => {
      try {
        const data = await useFetch(
          `${API_LINK}/Utilities/GetListAkreditasiProdi`,
          {},
          "POST"
        );

        setDataAkreditasi(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchAkreProdi();
  }, []);

  useEffect(() => {
    const fetchBerita = async () => {
      try {
        const result = await useFetch(
          `${API_LINK}/MasterBerita/GetDataBerita`,
          {
            param1: "",
            param2: "",
            param3: "5",
            param4: "1",
            param5: "tglBerita DESC",
          },
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

        const sortedBerita = Object.values(groupedBerita)
          .sort((a, b) => b.date - a.date)
          .slice(0, 5);

        setBeritaData(sortedBerita);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Gagal mengambil data");
      } finally {
        setLoading(false);
      }
    };

    fetchBerita();
  }, []);

  if (loading) return <Loading />;
  if (error) return <p>{error}</p>;
  return (
    <>
      <div
        className="latarGradasi"
        style={{
          position: "relative",
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          alignItems: isMobile ? "center" : "stretch",
          justifyContent: "center",
          minHeight: "80vh",
          zIndex: "0",
          marginTop: "3rem",
        }}
      >
        <img
          src={Hiasan3}
          style={{
            position: "absolute",
            left: "0rem",
            bottom: "4rem",
            zIndex: "-1",
            maxWidth: isMobile ? "35rem" : "30rem",
            minWidth: isMobile ? "50%" : "83%",
          }}
        />
        <div
          style={{
            flex: 1,
            padding: "3rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center", // memastikan teks berada di tengah vertikal
            textAlign: "left", // teks tetap rata kiri
            alignItems: "flex-start", // menjaga rata kiri
            order: isMobile ? 1 : 0,
          }}
        >
          <HeaderText
            label="Sejahtera<br />Bersama Bangsa"
            alignText="left"
            warna="white"
            fontWeight="700"
            ukuran={isMobile ? "2.5rem" : "3.5rem"}
            marginTop="-3rem"
          />
          <Text
            isi="Mendukung revitalisasi pendidikan vokasi di Indonesia dalam penyiapan tenaga kerja kompeten berdaya saing global dan menghasilkan teknologi terapan yang dibutuhkan industri, relevan dan sejalan dengan Astra Untuk Hari Ini dan Masa Depan Indonesia."
            ukuran={isMobile ? "1rem" : "1.2rem"}
          />
        </div>
        <div
          style={{
            flex: 1,
            position: isMobile ? "static" : "relative",
            display: "flex",
            justifyContent: isMobile ? "center" : "flex-start",
            order: isMobile ? 2 : 0,
          }}
        >
          <img
            src={Hiasan}
            style={{
              position: "absolute",
              right: "-2rem",
              top: isMobile ? "18rem" : "2rem",
              maxWidth: isMobile ? "35rem" : "30rem",
              minWidth: isMobile ? "20%" : "70%",
            }}
          />
          <img
            src={Orang}
            alt="Orang"
            style={{
              position: "absolute",
              bottom: "-3rem",
              transform: isMobile ? "none" : "translateX(-10%)",
              width: "100%",
              maxWidth: isMobile ? "35rem" : "50rem",
              minWidth: isMobile ? "50%" : "110%",
              maxHeight: "100%",
              zIndex: 2,
            }}
          />
        </div>
      </div>
      <div
        className={isMobile ? "flex-grow-1 p-1 mt-3" : "flex-grow-1 p-5 mt-3"}
      >
        <div className="row">
          <div className="col-lg-6 col-md-6 mt-5 ps-5">
            <HeaderText
              label="Rencana<br />Kegiatan BPM"
              alignText="left"
              warna="#2654A1"
              fontWeight="650"
              ukuran={isMobile ? "2rem" : "2.5rem"}
            />
            <img
              src={OrangKerja}
              alt="Logo"
              style={{
                width: "100%",
                height: "auto",
                marginTop: "-4rem",
              }}
            />
          </div>
          <div className="col-lg-6 col-md-6 mt-5 ps-0">
            <SliderKegiatan dataKegiatan={rencanaKegiatan} />
          </div>
        </div>
      </div>

      {akreditasiData && (
        <>
          <SliderProgramStudi akreditasiData={akreditasiData} />
        </>
      )}

      <HeaderText
        label="Berita BPM Terkini"
        warna="#2654A1"
        alignText="center"
        fontWeight="650"
        lebar="310px"
        marginBottom="1rem"
        marginTop="4rem"
      />
      <SliderBerita beritaItems={beritaData} />
      <div
        className={`${
          isMobile ? "flex-grow-1 p-0 mt-0 mb-5" : "flex-grow-1 mt-3 mb-5"
        } d-flex flex-column align-items-center`}
      >
        <Button
          classType="btn btn-primary ms-3"
          title="Lihat Berita lainnya"
          label="Lihat Berita lainnya"
          onClick={() => navigate("/berita")}
        />
      </div>
    </>
  );
}
