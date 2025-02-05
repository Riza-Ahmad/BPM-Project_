import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
// import Index from "./Index";
import ScrollToTop from "../../../../part/ScrollToTop";
import { useLocation } from "react-router-dom";
import ProtectedRoute from "../../../../util/ProtectedRoute";
// import EditKonten from "./EditKonten";
// import Add from "./Add";
// import Edit from "./Edit";
import IndexAlternate from "./IndexAlternate";
import Add from "../../../7_IKU&IKT/IndikatorKinerja/Add";
import Edit from "../../../7_IKU&IKT/IndikatorKinerja/Edit";
import Detail from "../../../7_IKU&IKT/IndikatorKinerja/Detail";

export default function Pelaksanaan() {
  // const navigate = useNavigate();

  // const handlePageChange = (page, withState = {}) => {
  //   switch (page) {
  //     case "pelaksanaan":
  //       navigate("/spmi/siklus/pelaksanaan");
  //       break;
  //     case "editKonten":
  //       navigate("/spmi/siklus/pelaksanaan/editkonten", withState);
  //       break;
  //     case "add":
  //       navigate("/spmi/siklus/pelaksanaan/add");
  //       break;
  //     case "edit":
  //       navigate("/spmi/siklus/pelaksanaan/edit");
  //       break;
  //     default:
  //       console.warn(`Halaman "${page}" tidak dikenali.`);
  //       break;
  //   }
  // };

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
      case "detail":
        navigate(`${currentPath}`, { state: { mode: "detail", ...withState } });
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
      {/* <Routes>
        <Route path="/" element={<IndexAlternate onChangePage={handlePageChange} />} />
        <Route
          path="/editkonten"
          element={<EditKonten onChangePage={handlePageChange} />}
        />
        <Route path="/add" element={<Add onChangePage={handlePageChange} />} />
        <Route
          path="/edit"
          element={<Edit onChangePage={handlePageChange} />}
        />
      </Routes> */}

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
              ) : mode === "detail" ? (
                <Detail onChangePage={handlePageChange} />
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
