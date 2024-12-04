import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import Index from "./Index";
import Add from "./Add";
import Edit from "./Edit";
import ScrollToTop from "../../../part/ScrollToTop";

export default function PeraturanEksternal() {
  const navigate = useNavigate();

  const handlePageChange = (page, withState = {}) => {
    switch (page) {
      case "index":
        navigate("/peraturan/eksternal");
        break;
      case "add":
        navigate("/peraturan/eksternal/tambah");
        break;
      case "edit":
        navigate("/peraturan/eksternal/edit");
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
