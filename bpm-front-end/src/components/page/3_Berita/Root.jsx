import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";
import Index from "./Index";
import Read from "./Read";
import Add from "./Add";
import Edit from "./Edit";
import Detail from "./Detail";
import LihatBerita from "./LihatBerita";
import ScrollToTop from "../../part/ScrollToTop";
import ProtectedRoute from "../../util/ProtectedRoute"; // Import the ProtectedRoute component

export default function Berita() {
  const navigate = useNavigate();
  const location = useLocation();

  const handlePageChange = (page, withState = {}) => {
    switch (page) {
      case "index":
        navigate("/berita");
        break;
      case "read":
        navigate("/berita/kelola", { state: { mode: "read" } });
        break;
      case "add":
        navigate("/berita/kelola", { state: { mode: "add" } });
        break;
      case "edit":
        navigate("/berita/kelola", { state: { mode: "edit", ...withState } });
        break;
      case "detail":
        navigate("/berita/kelola", { state: { mode: "detail", ...withState } });
        break;
      case "news":
        navigate("/berita/lihatBerita", withState);
        break;
      default:
        console.warn(`Halaman "${page}" tidak dikenali.`);
        break;
    }
  };

  // Mengambil mode dari location.state
  const { mode } = location.state || { mode: "read" };

  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<Index onChangePage={handlePageChange} />} />

        {/* Protected Routes */}
        <Route
          path="/kelola"
          element={
            <ProtectedRoute isRole={true}>
              {
                // Berdasarkan mode, render komponen yang berbeda
                mode === "add" ? (
                  <Add onChangePage={handlePageChange} />
                ) : mode === "edit" ? (
                  <Edit onChangePage={handlePageChange} />
                ) : mode === "detail" ? (
                  <Detail onChangePage={handlePageChange} />
                ) : (
                  <Read onChangePage={handlePageChange} />
                )
              }
            </ProtectedRoute>
          }
        />

        <Route
          path="/lihatBerita"
          element={<LihatBerita onChangePage={handlePageChange} />}
        />
      </Routes>
    </>
  );
}
