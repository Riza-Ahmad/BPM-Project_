import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import Index from "./Index";
import Add from "./Add";
import Detail from "./Detail";
import Edit from "./Edit";
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
      case "edit":
        const { id } = withState; // Ensure that id is passed for editing
        if (id) {
          navigate(`/survei/skala/edit/${id}`, { state: { editData: id } }); // Pass id to the edit route
        } else {
          Swal.fire(
            "Error",
            "ID tidak valid atau tidak ditemukan untuk edit.",
            "error"
          );
        }
        break;

      case "detail":
        const { detailId } = withState; // For detail page, ensure that detailId is passed
        if (detailId) {
          navigate(`/survei/skala/detail/${detailId}`, { state: { detailData: detailId } }); // Pass detailId to the detail route
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
          path="edit/:key"
          element={<Edit onChangePage={handlePageChange} />}
        />
        <Route
          path="detail/:detailId"
          element={<Detail onChangePage={handlePageChange} />}
        />
      </Routes>
    </>
  );
}
