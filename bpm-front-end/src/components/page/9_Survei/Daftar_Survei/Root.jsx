import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import ScrollToTop from "../../../part/ScrollToTop";
import ProtectedRoute from "../../../util/ProtectedRoute";
import { ROOT_LINK } from "../../../util/Constants";
import Index from "./Index";
// import Add from "./Add";
import Detail from "./DetailSurvei";
import Edit from "./EditSurvei";
import Preview from "./Preview";

export default function Daftar_Survei() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  // Handler for page navigation
  const handlePageChange = (page, withState = {}) => {
    switch (page) {
      case "index":
        navigate(`${currentPath}`, { state: { mode: "index", ...withState } });
        break;
      case "edit":
        navigate(`${currentPath}`, { state: { mode: "edit", ...withState } });
        break;
      case "preview":
        navigate(`${currentPath}`, {
          state: { mode: "preview", ...withState },
        });
        break;
      case "detail":
        navigate(`${currentPath}`, {
          state: { mode: "detail", ...withState },
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
        {/* Public Route */}
        <Route
          path="/"
          element={
            mode === "edit" ? (
              <Edit onChangePage={handlePageChange} />
            ) : mode === "preview" ? (
              <Preview onChangePage={handlePageChange} />
            ) : mode === "detail" ? (
              <Detail onChangePage={handlePageChange} />
            ) : (
              <Index onChangePage={handlePageChange} />
            )
          }
        />
      </Routes>
    </>
  );
}
