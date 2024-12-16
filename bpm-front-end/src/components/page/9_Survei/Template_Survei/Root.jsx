import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import Index from "./Index";
import Add from "./Add";
import Edit from "./Edit";
import ScrollToTop from "../../../part/ScrollToTop";
import Detail from "./Detail";

export default function Template_Survei() {
  const navigate = useNavigate();

  const handlePageChange = (page, withState = {}) => {
    switch (page) {
      case "index":
        navigate("/survei/template");
        break;
      case "add":
        navigate("/survei/template/add");
        break;
      case "edit":
        navigate(`/survei/template/edit/${withState.id}`);
        break;
      case "detail":
        navigate(`/survei/template/detail/${withState.id}`);
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
        <Route path="add" element={<Add onChangePage={handlePageChange} />} />
        <Route
          path="edit/:id"
          element={<Edit onChangePage={handlePageChange} />}
        />
        <Route
          path="detail/:id"
          element={<Detail onChangePage={handlePageChange} />}
        />
      </Routes>
    </>
  );
}
