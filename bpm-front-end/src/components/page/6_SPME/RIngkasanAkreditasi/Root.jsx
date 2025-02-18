import ScrollToTop from "../../../part/ScrollToTop";
import { useNavigate, useLocation } from "react-router-dom";
import { Route } from "react-router-dom";
import { Routes } from "react-router-dom";
import ProtectedRoute from "../../../util/ProtectedRoute";
import Akreditasi from "./Index";
import EditKonten from "./EditKonten";

export default function RingkasanAkre() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  // Handler for page navigation
  const handlePageChange = (page, withState = {}) => {
    switch (page) {
      case "index":
        navigate(`${currentPath}`, { state: { mode: "index", ...withState } });
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
              {mode === "editKonten" ? (
                <EditKonten onChangePage={handlePageChange} />
              ) : (
                <Akreditasi onChangePage={handlePageChange} />
              )}
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}
