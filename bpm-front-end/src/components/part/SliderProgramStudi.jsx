import Button from "./Button";
import HeaderText from "./HeaderText";
import { useIsMobile } from "../util/useIsMobile";
import Hiasan from "../../assets/element/hiasan.png";
import Hiasan2 from "../../assets/element/hiasan2.png";
import { DOKUMEN_LINK } from "../util/Constants";
const SliderProgramStudi = ({ akreditasiData }) => {
  const isMobile = useIsMobile();
  const handleDownloadClick = (sertifikat) => {
    const url = `${DOKUMEN_LINK}${sertifikat}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      <div
        className="flex-grow-1"
        style={{
          backgroundColor: "#193756",
          backgroundImage: `url(${Hiasan2}), url(${Hiasan})`,
          backgroundPosition: "left center, right center",
          backgroundRepeat: "no-repeat, no-repeat",
          backgroundSize: isMobile
            ? "10rem 10rem, 15rem 20rem"
            : "40rem 40rem, 32rem 40rem",
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
                  width: isMobile ? "19rem" : "23.5rem",
                  height: "30rem",

                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <img
                  src={`/programStudi/${item.foto}`}
                  style={{
                    width: isMobile ? "60%" : "52%",
                    height: "10.5rem",
                    objectFit: "cover",
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
                  onClick={() => handleDownloadClick(item.sertifikat)}
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
