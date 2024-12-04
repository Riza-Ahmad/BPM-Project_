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
        navigate("/peraturan/aps");
        break;
      case "add":
        navigate("/peraturan/aps/tambah");
        break;
      case "edit":
        navigate("/peraturan/aps/edit");
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
        <Route path="/" element={<Index onChangePage={handlePageChange} />} />
        <Route
          path="/tambah"
          element={<Add onChangePage={handlePageChange} />}
        />
        <Route
          path="/edit"
          element={<Edit onChangePage={handlePageChange} />}
        />
      </Routes>
    </>
  );
}
