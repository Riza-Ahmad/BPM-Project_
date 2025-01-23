import Button from "./Button";
import HeaderText from "./HeaderText";
import { useIsMobile } from "../util/useIsMobile";
import { PRODIGAMBAR_LINK } from "../util/Constants";
import Hiasan from "../../assets/element/hiasan.png";
import Hiasan2 from "../../assets/element/hiasan2.png";
const SliderProgramStudi = ({ akreditasiData }) => {
  const isMobile = useIsMobile();
  return (
    <>
      <div
        className="flex-grow-1"
        style={{
          backgroundColor: "#193756",
          backgroundImage: `url(${Hiasan2}), url(${Hiasan})`, // Two images
          backgroundPosition: "left center, right center", // Position left and right
          backgroundRepeat: "no-repeat, no-repeat", // Prevent repeating
          backgroundSize: isMobile
            ? "10rem 10rem, 15rem 20rem"
            : "40rem 40rem, 32rem 40rem", // Different sizes for each image
          padding: isMobile ? "1rem" : "4rem",
        }}
      >
        <HeaderText
          label="Akreditasi Program Studi"
          warna="white"
          ukuran="2rem"
          alignText="center"
          fontWeight="700"
          marginBottom={isMobile ? "2rem" : "0rem"}
        />
        <div
          style={{
            overflowX: "auto",
            display: "flex",
            scrollSnapType: "x mandatory",
            WebkitOverflowScrolling: "touch",
            gap: "1.6rem",
            padding: isMobile ? "0rem 0rem 2rem 0rem" : "3rem",
            borderRadius: "8px",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {akreditasiData.map((item) => {
            return (
              <div
                className="card"
                key={item.id}
                style={{
                  padding: isMobile ? "1rem" : "2rem",
                  minWidth: isMobile ? "19rem" : "23.5rem",
                  minHeight: "30rem", // Menjaga tinggi minimum card agar konsisten
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "space-between", // Menjaga jarak antar elemen
                }}
              >
                <img
                  src={PRODIGAMBAR_LINK + item.foto}
                  style={{
                    width: isMobile ? "60%" : "52%", // Gambar akan mengisi lebar card
                    height: "10.5rem", // Menetapkan tinggi gambar agar sama
                    objectFit: "cover", // Memastikan gambar tidak terdistorsi dan mengisi area dengan baik
                  }}
                  alt={item.programStudi}
                />
                <HeaderText
                  label={item.jenjang}
                  warna="white"
                  ukuran="1.5rem"
                  alignText="center"
                  fontWeight="600"
                  marginBottom="0rem"
                />
                <HeaderText
                  label={item.programStudi}
                  warna="white"
                  ukuran="1.5rem"
                  alignText="center"
                  fontWeight="600"
                  marginBottom="1rem"
                />
                <HeaderText
                  label={item.akre}
                  warna="white"
                  ukuran="2rem"
                  alignText="center"
                  fontWeight="700"
                  marginBottom="2rem"
                />

                <Button
                  iconName="download"
                  classType="success"
                  label="Sertifikat"
                />
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default SliderProgramStudi;
