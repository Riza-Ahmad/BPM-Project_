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
      case "add":
        navigate("/survei/template/add");
        break;
      case "edit":
        navigate("/survei/template/edit", { state: withState });
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
        <Route path="edit" element={<Add onChangePage={handlePageChange} />} />
      </Routes>
    </>
  );
}
