import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import ScrollToTop from "../../../part/ScrollToTop";
import ProtectedRoute from "../../../util/ProtectedRoute";
import { ROOT_LINK } from "../../../util/Constants";
import Index from "../../5_SPMI/dokumen_spmi/Index";
import Add from "../../5_SPMI/dokumen_spmi/Add";
import Edit from "../AkreditasiProdi/Edit";

export default function PanduanAkreditasi() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  // Handler for page navigation
  const handlePageChange = (page, withState = {}) => {
    switch (page) {
      case "index":
        navigate(`${currentPath}`, { state: { mode: "index", ...withState } });
        break;
      case "add":
        navigate(`${currentPath}`, { state: { mode: "add", ...withState } });
        break;
      case "edit":
        navigate(`${currentPath}`, { state: { mode: "edit", ...withState } });
        break;
      case "detail":
        navigate(`${currentPath}`, { state: { mode: "detail", ...withState } });
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
        {/* Public Route */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              {mode === "add" ? (
                <Add onChangePage={handlePageChange} />
              ) : mode === "edit" ? (
                <Edit onChangePage={handlePageChange} />
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
