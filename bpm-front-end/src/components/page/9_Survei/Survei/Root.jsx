import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";
import ProtectedRoute from "../../../util/ProtectedRoute";
import Index from "./Index";
import Add from "./Add";
import Detail from "./Detail";
import Preview from "./Preview";
import ScrollToTop from "../../../part/ScrollToTop";
import Swal from "sweetalert2"; // Import Swal for alert

export default function Survei() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  // Handler for page navigation with state management
  const handlePageChange = (page, withState = {}) => {
    console.log(page);
    console.log(currentPath);
    switch (page) {
      case "index":
        navigate(`${currentPath}`, { state: { mode: "index", ...withState } });
        break;
      case "add":
        navigate(`${currentPath}`, {
          state: { mode: "add", ...withState },
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
