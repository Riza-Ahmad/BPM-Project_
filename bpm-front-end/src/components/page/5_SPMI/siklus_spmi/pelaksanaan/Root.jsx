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

export default function Pelaksanaan() {
  const navigate = useNavigate();

  const handlePageChange = (page, withState = {}) => {
    switch (page) {
      case "pelaksanaan":
        navigate("/spmi/siklus/pelaksanaan");
        break;
      case "editKonten":
        navigate("/spmi/siklus/pelaksanaan/editkonten", withState);
        break;
      case "add":
        navigate("/spmi/siklus/pelaksanaan/add");
        break;
      case "edit":
        navigate("/spmi/siklus/pelaksanaan/edit");
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
        <Route path="/" element={<Index onChangePage={handlePageChange} />} />
        <Route
          path="/editkonten"
          element={<EditKonten onChangePage={handlePageChange} />}
        />
        <Route path="/add" element={<Add onChangePage={handlePageChange} />} />
        <Route
          path="/edit"
          element={<Edit onChangePage={handlePageChange} />}
        />
      </Routes>
    </>
  );
}
