import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";
import Index from "../Index";
import ScrollToTop from "../../../part/ScrollToTop";
import Add from "../Add";
import Edit from "../Edit";
import EditFile from "../EditFile";
import Detail from "../Detail";
import ReadRevisi from "../ReadRevisi";
import ReadUnduhan from "../ReadUnduhan";
import ProtectedRoute from "../../../util/ProtectedRoute"; // Import the ProtectedRoute component

export default function Peraturan() {
  const navigate = useNavigate();
  const location = useLocation();
  const handlePageChange = (page, withState = {}) => {
    switch (page) {
      case "index":
        navigate("/peraturan/kebijakan", {
          state: { mode: "index", ...withState },
        });
        break;
      case "add":
        navigate("/peraturan/kebijakan", {
          state: { mode: "add", ...withState },
        });
        break;
      case "edit":
        navigate("/peraturan/kebijakan", {
          state: { mode: "edit", ...withState },
        });
        break;
      case "editfile":
        navigate("/peraturan/kebijakan", {
          state: { mode: "editfile", ...withState },
        });
        break;
      case "readrevisi":
        navigate("/peraturan/kebijakan", {
          state: { mode: "readrevisi", ...withState },
        });
        break;
      case "readunduhan":
        navigate("/peraturan/kebijakan", {
          state: { mode: "readunduhan", ...withState },
        });
        break;
      case "detail":
        navigate("/peraturan/kebijakan", {
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
        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              {
                // Berdasarkan mode, render komponen yang berbeda
                mode === "add" ? (
                  <Add onChangePage={handlePageChange} />
                ) : mode === "edit" ? (
                  <Edit onChangePage={handlePageChange} />
                ) : mode === "editfile" ? (
                  <EditFile onChangePage={handlePageChange} />
                ) : mode === "readrevisi" ? (
                  <ReadRevisi onChangePage={handlePageChange} />
                ) : mode === "readunduhan" ? (
                  <ReadUnduhan onChangePage={handlePageChange} />
                ) : mode === "detail" ? (
                  <Detail onChangePage={handlePageChange} />
                ) : (
                  <Index onChangePage={handlePageChange} />
                )
              }
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}
