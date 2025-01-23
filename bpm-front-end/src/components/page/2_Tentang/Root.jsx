import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";
import Index from "./Index";
import Read from "./Read";
import Edit from "./Edit";
import Detail from "./Detail";
import ScrollToTop from "../../part/ScrollToTop";
import ProtectedRoute from "../../util/ProtectedRoute"; // Import the ProtectedRoute component

export default function Tentang() {
  const navigate = useNavigate();
  const location = useLocation();

  const handlePageChange = (page, withState = {}) => {
    switch (page) {
      case "index":
        navigate("/tentang");
        break;
      case "read":
        navigate("/tentang/kelola", { state: { mode: "read" } });
        break;
      case "edit":
        navigate("/tentang/kelola", { state: { mode: "edit", ...withState } });
        break;
      case "detail":
        navigate("/tentang/kelola", {
          state: { mode: "detail", ...withState },
        });
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
                mode === "edit" ? (
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
      </Routes>
    </>
  );
}
