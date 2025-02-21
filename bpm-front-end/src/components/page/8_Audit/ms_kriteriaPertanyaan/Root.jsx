import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import ScrollToTop from "../../../part/ScrollToTop";
import ProtectedRoute from "../../../util/ProtectedRoute";
import { ROOT_LINK } from "../../../util/Constants";
import Index from "./Index";
import Add from "./Add";
import Edit from "./Edit";

export default function kriteriaPertanyaan() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

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
            <ProtectedRoute isRole={true}>
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
