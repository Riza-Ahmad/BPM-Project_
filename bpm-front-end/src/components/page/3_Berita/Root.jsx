import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import Index from "./Index";
import Read from "./Read";
import Add from "./Add";
import Edit from "./Edit";
import Detail from "./Detail";
import LihatBerita from "./LihatBerita";
import ScrollToTop from "../../part/ScrollToTop";

export default function Berita() {
  const navigate = useNavigate();

  const handlePageChange = (page, withState = {}) => {
    switch (page) {
      case "index":
        navigate("/berita");
        break;
      case "read":
        navigate("/berita/kelola");
        break;
      case "add":
        navigate("/berita/kelola/tambah");
        break;
      case "edit":
        navigate("/berita/kelola/edit", withState);
        break;
      case "detail":
        navigate("/berita/kelola/detail", withState);
        break;
      case "news":
        navigate("/lihatBerita", withState);
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
          path="/berita"
          element={<Index onChangePage={handlePageChange} />}
        />
        <Route
          path="/berita/kelola"
          element={<Read onChangePage={handlePageChange} />}
        />
        <Route
          path="/berita/kelola/tambah"
          element={<Add onChangePage={handlePageChange} />}
        />
        <Route
          path="/berita/kelola/edit"
          element={<Edit onChangePage={handlePageChange} />}
        />
        <Route
          path="/berita/kelola/detail"
          element={<Detail onChangePage={handlePageChange} />}
        />
        <Route
          path="/lihatBerita"
          element={<LihatBerita onChangePage={handlePageChange} />}
        />
      </Routes>
    </>
  );
}
