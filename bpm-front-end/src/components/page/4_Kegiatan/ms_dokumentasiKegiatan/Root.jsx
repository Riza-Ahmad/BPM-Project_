import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import Index from "./Index";
import Read from "./Read";
import AddExisting from "./AddExisting";

import ScrollToTop from "../../../part/ScrollToTop";

export default function JadwalKegiatan() {
  const navigate = useNavigate();

  const handlePageChange = (page, withState = {}) => {
    switch (page) {
      case "index":
        navigate("/kegiatan/dokumentasi");
        break;
      case "read":
        navigate("/kegiatan/dokumentasi/kelola");
        break;
      case "addExist":
        navigate("/kegiatan/dokumentasi/kelola/tambah");
        break;
      case "add":
        navigate("/kegiatan/jadwal/kelola/tambahBaru");
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
        <Route path="/" element={<Index onChangePage={handlePageChange} />} />
        <Route
          path="/kelola"
          element={<Read onChangePage={handlePageChange} />}
        />
        <Route
          path="/kelola/tambah"
          element={<AddExisting onChangePage={handlePageChange} />}
        />
      </Routes>
    </>
  );
}
