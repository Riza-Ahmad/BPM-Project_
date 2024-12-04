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

export default function Peningkatan() {
  const navigate = useNavigate();

  const handlePageChange = (page, withState = {}) => {
    switch (page) {
      case "peningkatan":
        navigate("/spmi/siklus/peningkatan");
        break;
      case "editKonten":
        navigate("/spmi/siklus/peningkatan/editkonten", withState);
        break;
      case "add":
        navigate("/spmi/siklus/peningkatan/add");
        break;
      case "edit":
        navigate("/spmi/siklus/peningkatan/edit");
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
