import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import Index from "./Index";
import ScrollToTop from "../../../../part/ScrollToTop";
import EditKonten from "./EditKonten";
import Add from "./Add";
import Edit from "./Edit";

export default function Evaluasi() {
  const navigate = useNavigate();

  const handlePageChange = (page, withState = {}) => {
    switch (page) {
      case "evaluasi":
        navigate("/spmi/siklus/evaluasi");
        break;
      case "editKonten":
        navigate("/spmi/siklus/evaluasi/editkonten", withState);
        break;
      case "add":
        navigate("/spmi/siklus/evaluasi/add");
        break;
      case "edit":
        navigate("/spmi/siklus/evaluasi/edit");
        break;
      default:
        console.warn(`Halaman "${page}" tidak dikenali.`);
        break;
    }
  };

  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route
          path="/spmi/siklus/evaluasi"
          element={<Index onChangePage={handlePageChange} />}
        />
        <Route
          path="/spmi/siklus/evaluasi/editkonten"
          element={<EditKonten onChangePage={handlePageChange} />}
        />
        <Route
          path="/spmi/siklus/evaluasi/add"
          element={<Add onChangePage={handlePageChange} />}
        />
        <Route
          path="/spmi/siklus/evaluasi/edit"
          element={<Edit onChangePage={handlePageChange} />}
        />
      </Routes>
    </>
  );
}
