import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import Index from "./Index";

import ScrollToTop from "../../../part/ScrollToTop";

export default function JadwalKegiatan() {
  const navigate = useNavigate();

  const handlePageChange = (page, withState = {}) => {
    switch (page) {
      case "index":
        navigate("/kegiatan/dokumentasi");
        break;
      case "read":
        navigate("/kegiatan/jadwal/kelola");
        break;
      case "add":
        navigate("/kegiatan/jadwal/kelola/tambah");
        break;
      case "edit":
        navigate("/kegiatan/jadwal/kelola/edit", withState);
        break;
      case "detail":
        navigate("/kegiatan/jadwal/kelola/detail", withState);
        break;
      case "news":
        navigate("/lihatBerita", withState);
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
          path="/kegiatan/dokumentasi"
          element={<Index onChangePage={handlePageChange} />}
        />
      </Routes>
    </>
  );
}
