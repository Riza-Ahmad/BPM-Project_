import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import Index from "./Index";
import Add from "./Add";

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
        navigate("/survei/skala/edit");
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
          path="/survei/skala"
          element={<Index onChangePage={handlePageChange} />}
        />
      </Routes>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/survei/skala/add" element={<Add />} />
      </Routes>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/survei/skala/edit" element={<Edit />} />
      </Routes>
    </>
  );
}
