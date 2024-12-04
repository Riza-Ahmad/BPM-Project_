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

export default function Penetapan() {
  const navigate = useNavigate();

  const handlePageChange = (page, withState = {}) => {
    switch (page) {
      case "penetapan":
        navigate("/spmi/siklus/penetapan");
        break;
      case "editKonten":
        navigate("/spmi/siklus/penetapan/editkonten", withState);
        break;
      case "add":
        navigate("/spmi/siklus/penetapan/add");
        break;
      case "edit":
        navigate("/spmi/siklus/penetapan/edit");
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
