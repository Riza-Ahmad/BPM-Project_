import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import Index from "./Index";
import Add from "./Add";

import Add from "./Add";
import Detail from "./Detail";

import ScrollToTop from "../../../part/ScrollToTop";
import Edit from "./Edit";

export default function Skala_Survei() {
  const navigate = useNavigate();

  const handlePageChange = (page, withState = {}) => {
    switch (page) {
      case "index":
        navigate("/survei/skala");
        break;
      case "add":
        navigate("/survei/skala/add");
        break;
      case "edit":
        navigate("/survei/skala/edit", withState);
        break;
      case "add":
        navigate("/survei/skala/add");
        break;
      case "edit":
        navigate("/survei/skala/edit", withState);
        break;
      case "detail":
        navigate("/survei/skala/detail", withState);
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
        <Route path="edit" element={<Edit onChangePage={handlePageChange} />} />
        <Route path="add" element={<Add onChangePage={handlePageChange} />} />
        <Route path="edit" element={<Edit onChangePage={handlePageChange} />} />
        <Route
          path="detail"
          element={<Detail onChangePage={handlePageChange} />}
        />
      </Routes>
    </>
  );
}
