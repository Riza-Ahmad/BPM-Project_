import HeaderText from "./HeaderText";
import Text from "./Text";
import { useIsMobile } from "../util/useIsMobile";
import { useNavigate } from "react-router-dom";

const SliderKegiatan = ({ dataKegiatan }) => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const kegiatan = Array.isArray(dataKegiatan[0])
    ? dataKegiatan[0]
    : dataKegiatan;

  const sliderWrapperStyle = {
    overflowX: "auto",
    display: "flex",
    scrollSnapType: "x mandatory",
    WebkitOverflowScrolling: "touch",
    gap: "1.6rem",
    padding: "3rem",
    borderRadius: "8px",
    scrollbarWidth: "none",
    msOverflowStyle: "none",
  };

  if (!kegiatan || kegiatan.length === 0) {
    return <p>Data kegiatan tidak tersedia.</p>;
  }

  return (
    <div>
      <div style={sliderWrapperStyle}>
        {kegiatan.map((item, index) => {
          return (
            <div
              key={item.id || index}
              style={{
                padding: "2rem",
                borderRadius: "8px",
                backgroundColor: "white",
                minWidth: isMobile ? "20rem" : "27rem",
                boxShadow: "3px 4px 8px rgba(0, 0, 0, 0.2)",
                overflow: "hidden",
                cursor: "pointer",
              }}
              onClick={() =>
                navigate("/kegiatan/jadwal", {
                  state: {
                    idData: item.id, // Use item.id here instead of selectedEvent.id
                  },
                })
              }
            >
              <i
                className="fi fi-ss-briefcase"
                style={{
                  fontSize: "3rem",
                  display: "block",
                  textAlign: "center",
                  color: "gray",
                  marginBottom: "1rem",
                }}
              ></i>
              <HeaderText label={item.nama} ukuran="1.5rem" />
              <div
                style={{
                  maxHeight: isMobile ? "15rem" : "20rem",
                  overflow: "hidden",
                  color: "gray",
                }}
              >
                <Text isi={item.deskripsi} warna="gray" alignText="justify" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SliderKegiatan;
