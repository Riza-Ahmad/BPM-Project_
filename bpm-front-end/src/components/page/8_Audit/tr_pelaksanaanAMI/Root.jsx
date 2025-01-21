import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import ScrollToTop from "../../../part/ScrollToTop";
import ProtectedRoute from "../../../util/ProtectedRoute";
import Index from "./Index";
import EditSelfAssessment from "./EditSelfAssessment";
import DetailSelfAssessment from "./DetailSelfAssessment";
import EditTemuan from "./EditTemuan";
import DetailTemuan from "./DetailTemuan";
import IndexAnalisaTemuan from "./IndexAnalisaTemuan";
import EditAnalisaTemuan from "./EditAnalisaTemuan";
import DetailAnalisaTemuan from "./DetailAnalisaTemuan";

export default function bankPertanyaan() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  // Handler for page navigation
  const handlePageChange = (page, withState = {}) => {
    switch (page) {
      case "index":
        navigate(`${currentPath}`, { state: { mode: "index", ...withState } });
        break;
      case "editSA":
        navigate(`${currentPath}`, { state: { mode: "editSA", ...withState } });
        break;
      case "detailSA":
        navigate(`${currentPath}`, {
          state: { mode: "detailSA", ...withState },
        });
        break;
      case "editTemuan":
        navigate(`${currentPath}`, {
          state: { mode: "editTemuan", ...withState },
        });
        break;
      case "detailTemuan":
        navigate(`${currentPath}`, {
          state: { mode: "detailTemuan", ...withState },
        });
        break;
      case "analisaTemuan":
        navigate(`${currentPath}`, {
          state: { mode: "analisaTemuan", ...withState },
        });
        break;
      case "editAnalisaTemuan":
        navigate(`${currentPath}`, {
          state: { mode: "editAnalisaTemuan", ...withState },
        });
        break;
      case "detailAnalisaTemuan":
        navigate(`${currentPath}`, {
          state: { mode: "detailAnalisaTemuan", ...withState },
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
              {mode === "editSA" ? (
                <EditSelfAssessment onChangePage={handlePageChange} />
              ) : mode === "detailSA" ? (
                <DetailSelfAssessment onChangePage={handlePageChange} />
              ) : mode === "editTemuan" ? (
                <EditTemuan onChangePage={handlePageChange} />
              ) : mode === "detailTemuan" ? (
                <DetailTemuan onChangePage={handlePageChange} />
              ) : mode === "analisaTemuan" ? (
                <IndexAnalisaTemuan onChangePage={handlePageChange} />
              ) : mode === "editAnalisaTemuan" ? (
                <EditAnalisaTemuan onChangePage={handlePageChange} />
              ) : mode === "detailAnalisaTemuan" ? (
                <DetailAnalisaTemuan onChangePage={handlePageChange} />
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
