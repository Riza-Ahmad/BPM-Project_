import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";
import Index from "./Index";
import Add from "./Add";
import Edit from "./Edit";
import ScrollToTop from "../../../part/ScrollToTop";
import Detail from "./Detail";

export default function Pertanyaan_Survei() {
  const navigate = useNavigate();
  const location = useLocation();
  const handlePageChange = (page, withState = {}) => {
    switch (page) {
      case "index":
        navigate("/survei/pertanyaan", withState);
        break;
      case "add":
        navigate("/survei/pertanyaan/add");
        break;
      case "edit":
        navigate("/survei/pertanyaan/edit", {
          state: { ...withState },
        });
        break;
      case "detail":
        navigate("/survei/pertanyaan/detail", {
          state: { ...withState },
        });
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
        <Route path="/add" element={<Add onChangePage={handlePageChange} />} />
        <Route
          path="/edit"
          element={<Edit onChangePage={handlePageChange} />}
        />
        <Route
          path="/detail"
          element={<Detail onChangePage={handlePageChange} />}
        />
      </Routes>
    </>
  );
}
