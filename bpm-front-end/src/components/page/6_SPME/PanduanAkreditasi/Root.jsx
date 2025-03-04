import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import ScrollToTop from "../../../part/ScrollToTop";
import ProtectedRoute from "../../../util/ProtectedRoute";
import { ROOT_LINK } from "../../../util/Constants";
import Index from "./Index";
import Add from "./Add";
import Edit from "./Edit";
import EditFile from "../../5_SPMI/dokumen_spmi/EditFile";
import RiwayatEdit from "../../5_SPMI/dokumen_spmi/RiwayatEdit";
import RiwayatUnduh from "../../5_SPMI/dokumen_spmi/RiwayatUnduh";

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
        {/* Public Route */}
        <Route
          path="/"
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
