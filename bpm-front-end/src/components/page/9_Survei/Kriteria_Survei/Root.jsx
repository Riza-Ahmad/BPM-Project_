// KriteriaSurveiRoutes.jsx
import { Routes, Route, useNavigate } from "react-router-dom";
import Index from "./Index";
import Add from "./Add";
import Edit from "./Edit";
import Detail from "./Detail";
import ScrollToTop from "../../../part/ScrollToTop";
import Tentang from "../../../page/2_Tentang/Index";

export default function KriteriaSurveiRoutes() {
  const navigate = useNavigate();

  const handlePageChange = (page, withState = {}) => {
    switch (page) {
      case "index":
        navigate("/survei/kriteria");
        break;
      case "add":
        navigate("/survei/kriteria/add");
        break;
      case "edit":
        navigate(`/survei/kriteria/edit/${withState.id}`);
        break;
      case "detail":
        navigate(`/survei/kriteria/detail/${withState.id}`);
        break;
      case "tentang":
        navigate("/tentang");
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
        <Route path="/tentang" element={<Tentang onChangePage={handlePageChange} />} />
        <Route path="/" element={<Index onChangePage={handlePageChange} />} />
        <Route path="/add" element={<Add onChangePage={handlePageChange} />} />
        <Route path="/edit/:id" element={<Edit onChangePage={handlePageChange} />} />
        <Route path="/detail/:id" element={<Detail onChangePage={handlePageChange} />} />
      </Routes>
    </>
  );
}