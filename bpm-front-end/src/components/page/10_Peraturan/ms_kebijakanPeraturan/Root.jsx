import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import Index from "./Index";
import ScrollToTop from "../../../part/ScrollToTop";
import Add from "./Add";
import Edit from "./Edit";

export default function Peraturan() {
  const navigate = useNavigate();

  const handlePageChange = (page, withState = {}) => {
    switch (page) {
      case "index":
        navigate("/peraturan/kebijakan");
        break;
      case "add":
        navigate("/peraturan/kebijakan/tambah");
        break;
      case "edit":
        navigate("/peraturan/kebijakan/edit");
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
        <Route
          path="/peraturan/kebijakan"
          element={<Index onChangePage={handlePageChange} />}
        />
        <Route
          path="/peraturan/kebijakan/tambah"
          element={<Add onChangePage={handlePageChange} />}
        />
        <Route
          path="/peraturan/kebijakan/edit"
          element={<Edit onChangePage={handlePageChange} />}
        />
      </Routes>
    </>
  );
}
