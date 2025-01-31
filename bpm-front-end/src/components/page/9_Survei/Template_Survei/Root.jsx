import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import ScrollToTop from "../../../part/ScrollToTop";
import ProtectedRoute from "../../../util/ProtectedRoute";
import Index from "./Index";
import Add from "./Add";
import Edit from "./Edit";
import Detail from "./Detail";
import Preview from "./Preview";

export default function Template_Survei() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  // Handler for page navigation
  const handlePageChange = (page, withState = {}, idData, idTemplate) => {
    switch (page) {
      case "index":
        navigate(`${currentPath}`, { state: { mode: "index", ...withState } });
        break;
      case "add":
        navigate(`${currentPath}/add`, {
          state: { mode: "add", ...withState },
        });
        break;
      case "edit":
        navigate(`${currentPath}/edit`, {
          state: { mode: "edit", ...withState },
        });
        break;
      case "detail":
        navigate(`${currentPath}`, { state: { mode: "detail", ...withState } });
        break;
      case "preview":
        navigate(`${currentPath}/preview/${idTemplate}`, {
          state: { mode: "preview", idTemplate },
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
        <Route path="/" element={<Index onChangePage={handlePageChange} />} />
        <Route path="add" element={<Add onChangePage={handlePageChange} />} />
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
        <Route path="/add" element={<Add onChangePage={handlePageChange} />} />
        <Route
          path="/edit/:idData"
          element={<Edit onChangePage={handlePageChange} />}
        />
        <Route
          path="/detail/:idData"
          element={<Detail onChangePage={handlePageChange} />}
        />
        <Route
          path="/preview/:idTemplate"
          element={<Preview onChangePage={handlePageChange} />}
        />
      </Routes>
    </>
  );
}
