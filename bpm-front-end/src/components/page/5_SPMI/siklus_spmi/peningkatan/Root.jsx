import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
// import Index from "./Index";
import ScrollToTop from "../../../../part/ScrollToTop";
import { useLocation } from "react-router-dom";
import ProtectedRoute from "../../../../util/ProtectedRoute";
import Index from "./Index";
import Edit from "./Edit";
import EditKonten from "./EditKonten";

export default function Peningkatan() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const handlePageChange = (page, withState = {}) => {
    switch (page) {
      case "index":
        navigate(`${currentPath}`, { state: { mode: "index", ...withState } });
        break;
      case "edit":
        navigate(`${currentPath}`, { state: { mode: "edit", ...withState } });
        break;
      case "editKonten":
        navigate(`${currentPath}`, {
          state: { mode: "editKonten", ...withState },
        });
        break;
      default:
        console.warn(`Halaman "${page}" tidak dikenali.`);
        break;
    }
  };

  const { mode } = location.state || { mode: "index" };

  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              {mode === "edit" ? (
                <Edit onChangePage={handlePageChange} />
              ) : mode === "editKonten" ? (
                <EditKonten onChangePage={handlePageChange} />
              ) : (
                <Index onChangePage={handlePageChange} />
              )}
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}
