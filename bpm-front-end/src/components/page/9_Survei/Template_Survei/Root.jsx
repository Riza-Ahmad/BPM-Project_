import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import ScrollToTop from "../../../part/ScrollToTop";
import ProtectedRoute from "../../../util/ProtectedRoute";
import Index from "./Index";
import Add from "./Add";
import Edit from "./Edit";
import Detail from "./Detail";
import Preview from "./Preview";
import Swal from "sweetalert2";

export default function Template_Survei() {
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
        navigate(`${currentPath}`, {
          state: { mode: "add", ...withState },
        });
        break;
      case "edit":
        navigate(`${currentPath}`, {
          state: { mode: "edit", ...withState },
        });
        break;
      case "detail":
        navigate(`${currentPath}`, {
          state: { mode: "detail", ...withState },
        });
        break;
      case "preview":
        navigate(`${currentPath}`, {
          state: { mode: "preview", ...withState },
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
            <ProtectedRoute isRole={true}>
              {mode === "add" ? (
                <Add onChangePage={handlePageChange} />
              ) : mode === "edit" ? (
                <Edit onChangePage={handlePageChange} />
              ) : mode === "detail" ? (
                <Detail onChangePage={handlePageChange} />
              ) : mode === "preview" ? (
                <Preview onChangePage={handlePageChange} />
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
