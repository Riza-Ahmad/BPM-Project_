import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Index from "./Index";
import Add from "./Add";
import Edit from "./Edit";
import Detail from "./Detail";
import ScrollToTop from "../../../part/ScrollToTop";

export default function KriteriaSurveiRoutes() {
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
        navigate(`${currentPath}/edit/${withState.id}`, {
          state: { mode: "edit", ...withState },
        });
        break;
      case "detail":
        navigate(`${currentPath}/detail/${withState.id}`, {
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
        <Route
          path="/"
          element={
            mode === "add" ? (
              <Add onChangePage={handlePageChange} />
            ) : mode === "edit" ? (
              <Edit onChangePage={handlePageChange} />
            ) : mode === "detail" ? (
              <Detail onChangePage={handlePageChange} />
            ) : (
              <Index onChangePage={handlePageChange} />
            )
          }
        />
        <Route path="/add" element={<Add onChangePage={handlePageChange} />} />
        <Route
          path="/edit/:id"
          element={<Edit onChangePage={handlePageChange} />}
        />
        <Route
          path="/detail/:id"
          element={<Detail onChangePage={handlePageChange} />}
        />
      </Routes>
    </>
  );
}
