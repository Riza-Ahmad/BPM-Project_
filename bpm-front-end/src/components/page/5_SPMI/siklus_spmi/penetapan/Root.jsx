import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";
import Index from "./Index";
import ScrollToTop from "../../../../part/ScrollToTop";
import ProtectedRoute from "../../../../util/ProtectedRoute";
import EditKonten from "./EditKonten";
import Add from "./Add";
import Edit from "./Edit";
import Read from "../../../MasterKategoriDokumen/Index";
import Addkat from "../../../MasterKategoriDokumen/Add";
import addKatChild from "../../../MasterKategoriDokumen/AddChild";
import IndexAlternate from "./IndexAlternate";

export default function Penetapan() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  // Handler for page navigation
  const handlePageChange = (page, withState = {}) => {
    switch (page) {
      case "index":
        navigate(`${currentPath}`, { state: { mode: "index", ...withState } });
        break;
      case "read":
        navigate(`${currentPath}`, { state: { mode: "read", ...withState } });
        break;
      case "addKat":
        navigate(`${currentPath}`, { state: { mode: "addKat", ...withState } });
        break;
      case "addKatChild":
        navigate(`${currentPath}`, { state: { mode: "addKatChild", ...withState } });
        break;
      case "edit":
        navigate(`${currentPath}`, { state: { mode: "edit", ...withState } });
        break;
      case "kelola":
        navigate(`${currentPath}`, {
          state: { mode: "kelola", ...withState },
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
          path="/"
          element={
            <ProtectedRoute>
              {mode === "kelola" ? (
                <Read onChangePage={handlePageChange} />
              ) : mode === "addKat" ? (
                <Addkat onChangePage={handlePageChange} />
              ) : mode === "addKatChild" ? (
                <addKatChild onChangePage={handlePageChange} />
              ) : mode === "read" ? (
                <Read onChangePage={handlePageChange} />
              ) : (
                <IndexAlternate onChangePage={handlePageChange} />
              )}
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}
