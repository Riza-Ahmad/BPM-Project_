import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import Index from "./Index";
import Add from "./Add";

import ScrollToTop from "../../../part/ScrollToTop";

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
      </Routes>
    </>
  );
}
