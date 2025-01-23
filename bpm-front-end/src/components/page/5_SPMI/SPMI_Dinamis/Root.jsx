import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import ScrollToTop from "../../../part/ScrollToTop";
import ProtectedRoute from "../../../util/ProtectedRoute";
import Index from "./Index";
import IndexPelaksanaan from "./IndexPelaksanaan";
import Add from "../dokumen_spmi/Add";
import Edit from "../dokumen_spmi/Edit";
import EditFile from "../dokumen_spmi/EditFile";
import RiwayatEdit from "../dokumen_spmi/RiwayatEdit";
import RiwayatUnduh from "../dokumen_spmi/RiwayatUnduh";

export default function SPMI_Dinamis() {
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
      case "editFile":
        navigate(`${currentPath}`, {
          state: { mode: "editFile", ...withState },
        });
        break;
      case "updHistory":
        navigate(`${currentPath}`, {
          state: { mode: "updHistory", ...withState },
        });
        break;
      case "downHistory":
        navigate(`${currentPath}`, {
          state: { mode: "downHistory", ...withState },
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
                <IndexPelaksanaan onChangePage={handlePageChange} />
              )}
            </ProtectedRoute>
          }
        />
        <Route
          path="/pelaksanaan"
          element={
            <ProtectedRoute>
              <IndexPelaksanaan onChangePage={handlePageChange}  />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}
