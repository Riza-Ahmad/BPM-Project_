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
import AddExisting from "./AddExisting";
import ScrollToTop from "../../../part/ScrollToTop";
import ProtectedRoute from "../../../util/ProtectedRoute"; // Import the ProtectedRoute component

export default function JadwalKegiatan() {
  const navigate = useNavigate();
  const location = useLocation();

  const handlePageChange = (page, withState = {}) => {
    switch (page) {
      case "index":
        navigate("/kegiatan/dokumentasi", withState);
        break;
      case "read":
        navigate("/kegiatan/dokumentasi/kelola", { state: { mode: "read" } });
        break;
      case "addExist":
        navigate("/kegiatan/dokumentasi/kelola", {
          state: { mode: "addExist" },
        });
        break;
      case "add":
        navigate("/kegiatan/dokumentasi/kelola", {
          state: { mode: "add" },
        });
        break;
      case "edit":
        navigate("/kegiatan/dokumentasi/kelola", {
          state: { mode: "edit", ...withState },
        });
        break;
      case "detail":
        navigate("/kegiatan/dokumentasi/kelola", {
          state: { mode: "detail", ...withState },
        });
        break;

      default:
        console.warn(`Halaman "${page}" tidak dikenali.`);
        break;
    }
  };

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
              {mode === "addExist" ? (
                <AddExisting onChangePage={handlePageChange} />
              ) : mode === "add" ? (
                <Add onChangePage={handlePageChange} />
              ) : mode === "edit" ? (
                <Edit onChangePage={handlePageChange} />
              ) : mode === "detail" ? (
                <Detail onChangePage={handlePageChange} />
              ) : (
                <Read onChangePage={handlePageChange} />
              )}
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}
