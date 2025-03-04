import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import ScrollToTop from "../../../part/ScrollToTop";
import ProtectedRoute from "../../../util/ProtectedRoute";
import Index from "./Index";
import Add from "./Add";
import Edit from "./Edit";
import RiwayatEdit from "./RiwayatEdit";
import RiwayatUnduh from "./RiwayatUnduh";
import EditFile from "./EditFile";

export default function DokumenSPMI() {
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
      case "editFile":
        navigate(`${currentPath}`, { state: { mode: "editFile", ...withState } });
        break;
      case "updHistory":
        navigate(`${currentPath}`, { state: { mode: "updHistory", ...withState } });
        break;
      case "downHistory":
        navigate(`${currentPath}`, { state: { mode: "downHistory", ...withState } });
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
          path=":jenis"
          element={
            <ProtectedRoute>
              {mode === "add" ? (
                <Add onChangePage={handlePageChange} />
              ) : mode === "edit" ? (
                <Edit onChangePage={handlePageChange} />
              ) : mode === "updHistory" ? (
                <RiwayatEdit onChangePage={handlePageChange} />
              ) : mode === "downHistory" ? (
                <RiwayatUnduh onChangePage={handlePageChange} />
              ) : mode === "editFile" ? (
                <EditFile onChangePage={handlePageChange} />
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
