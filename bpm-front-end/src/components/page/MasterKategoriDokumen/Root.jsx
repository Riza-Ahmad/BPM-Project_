import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import ScrollToTop from "../../part/ScrollToTop";
import Home from "./Home";

export default function MasterKategoriDokumen() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  // Handler for page navigation
  const handlePageChange = (page, withState = {}) => {
    switch (page) {
      case "index":
        navigate(`${currentPath}`, { state: withState });
        break;

      case "add":
        navigate(`${currentPath}/add`, { state: withState });
        break;

      case "edit":
        navigate("/spmi/siklus/penetapan/edit", { state: withState });
        break;

      case "editKonten":
        navigate("/spmi/siklus/penetapan/editkonten", { state: withState });
        break;

      default:
        console.warn(`Halaman "${page}" tidak dikenali.`);
        break;
    }
  };

  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* <Route
          path=":jenis"
          element={
            <Index
              breadcrumbs={[
                { label: "SPMI" },
                { label: "Dokumen SPMI" },
              ]}
            />
          }
        />
        <Route
          path=":jenis/add"
          element={<Add />}
        /> */}

        <Route path="/" element={<Home />} />
      </Routes>
    </>
  );
}
