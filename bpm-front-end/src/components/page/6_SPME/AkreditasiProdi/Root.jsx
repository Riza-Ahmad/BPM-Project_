import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import Index from "./Index";
import ScrollToTop from "../../../part/ScrollToTop";
import Add from "./Add";
import Edit from "./Edit";

export default function AkreProdi() {
  const navigate = useNavigate();

  const handlePageChange = (page, withState = {}) => {
    switch (page) {
      case "index":
        navigate("/spme/status/program-studi");
        break;
      case "editKonten":
        navigate("/spme/status/program-studi/editkonten", withState);
        break;
      case "add":
        navigate("/spme/status/program-studi/add");
        break;
      case "edit":
        navigate("/spme/status/program-studi/edit");
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
        <Route path="/" element={<Index onChangePage={handlePageChange} /> } />
        <Route path="/add" element={<Add onChangePage={handlePageChange} /> } />
        <Route path="/edit" element={<Edit onChangePage={handlePageChange} /> } />
      </Routes>
    </>
  );
}
