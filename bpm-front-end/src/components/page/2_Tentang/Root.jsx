import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import Index from "./Index";
import Read from "./Read";
import Edit from "./Edit";
import Detail from "./Detail";
import ScrollToTop from "../../part/ScrollToTop";

export default function Tentang() {
  const navigate = useNavigate();

  const handlePageChange = (page, withState = {}) => {
    switch (page) {
      case "index":
        navigate("/tentang");
        break;
      case "read":
        navigate("/tentang/kelola");
        break;
      case "edit":
        navigate("/tentang/kelola/edit", withState);
        break;
      case "detail":
        navigate("/tentang/kelola/detail", withState);
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
          path="/tentang"
          element={<Index onChangePage={handlePageChange} />}
        />
        <Route
          path="/tentang/kelola"
          element={<Read onChangePage={handlePageChange} />}
        />
        <Route
          path="/tentang/kelola/edit"
          element={<Edit onChangePage={handlePageChange} />}
        />
        <Route
          path="/tentang/kelola/detail"
          element={<Detail onChangePage={handlePageChange} />}
        />
      </Routes>
    </>
  );
}
