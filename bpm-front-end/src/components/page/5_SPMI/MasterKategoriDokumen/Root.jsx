import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import ScrollToTop from "../../../part/ScrollToTop";
import ProtectedRoute from "../../../util/ProtectedRoute";
import Index from "./Index";
import Add from "./Add";
import AddChild from "./AddChild";
import Edit from "./Edit";
import EditChild from "./EditChild";

export default function MasterKategoriDokumen() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const handlePageChange = (page, withState = {}) => {
    switch (page) {
      case "read":
        navigate(`${currentPath}`, { state: { mode: "read", ...withState } });
        break;
      case "addKat":
        navigate(`${currentPath}`, { state: { mode: "addKat", ...withState } });
        break;
      case "addKatChild":
        navigate(`${currentPath}`, {
          state: { mode: "addKatChild", ...withState },
        });
        break;
      case "edit":
        navigate(`${currentPath}`, {
          state: { mode: "edit", ...withState },
        });
        break;
      case "editChild":
        navigate(`${currentPath}`, {
          state: { mode: "editChild", ...withState },
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
              {mode === "addKat" ? (
                <Add onChangePage={handlePageChange} />
              ) : mode === "addKatChild" ? (
                <AddChild onChangePage={handlePageChange} />
              ) : mode === "edit" ? (
                <Edit onChangePage={handlePageChange} />
              ) : mode === "editChild" ? (
                <EditChild onChangePage={handlePageChange} />
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
