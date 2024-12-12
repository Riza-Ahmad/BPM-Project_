import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import Index from "./Index";
import Add from "./Add";
import ScrollToTop from "../../../part/ScrollToTop";

export default function Template_Survei() {
  const navigate = useNavigate();

  const handlePageChange = (page, withState = {}) => {
    switch (page) {
      case "index":
        navigate("/survei/template");
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
          path="/template"
          element={<Index onChangePage={handlePageChange} />}
        />
        <Route
          path="/template/add"
          element={<Add onChangePage={handlePageChange} />}
        />
        <Route
          path="/template/edit"
          element={<Add onChangePage={handlePageChange} />}
        />
      </Routes>
    </>
  );
}
