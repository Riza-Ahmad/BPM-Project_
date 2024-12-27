import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import Swal from "sweetalert2"; // Tambahkan import Swal
import Index from "./Index";
import Add from "./Add";
import Detail from "./Detail";
import Edit from "./Edit";
import ScrollToTop from "../../../part/ScrollToTop";

export default function Skala_Survei() {
  const navigate = useNavigate();

  const handlePageChange = (page, withState = {}) => {
    const { id } = withState; // Ambil id dari parameter withState
    switch (page) {
      case "index":
        navigate("/survei/skala");
        break;
      case "add":
        navigate("/survei/skala/add");
        break;
      case "edit":
        if (id) {
          navigate(`/survei/skala/edit/${id}`, { state: { editData: id } }); // Gunakan id di URL
        } else {
          Swal.fire(
            "Error",
            "ID tidak valid atau tidak ditemukan untuk edit.",
            "error"
          );
        }
        break;
      case "detail":
        if (id) {
          navigate(`/survei/skala/detail/${id}`, { state: { detailData: id } }); // Gunakan id di URL
        } else {
          Swal.fire(
            "Error",
            "ID tidak valid atau tidak ditemukan untuk detail.",
            "error"
          );
        }
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
