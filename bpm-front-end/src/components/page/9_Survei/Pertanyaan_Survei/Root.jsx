import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import ScrollToTop from "../../../part/ScrollToTop";
import Index from "./Index";
import Add from "./Add";
import Edit from "./Edit";
import Detail from "./Detail";
import Swal from "sweetalert2";

export default function Pertanyaan_Survei() {
  const navigate = useNavigate();
  const location = useLocation();
  const handlePageChange = (page, withState = {}) => {
    switch (page) {
      case "index":
        navigate("/survei/pertanyaan", withState);
        break;
      case "add":
        navigate(`${currentPath}/add`, {
          state: { mode: "add", ...withState },
        });
        break;
      case "edit":
        const { id } = withState;
        if (id) {
          navigate(`${currentPath}/edit/${id}`, {
            state: { mode: "edit", id },
          });
        } else {
          Swal.fire(
            "Error",
            "ID tidak valid atau tidak ditemukan untuk edit.",
            "error"
          );
        }
        break;
      case "detail":
        const { detailId } = withState;
        if (detailId) {
          navigate(`${currentPath}/detail/${detailId}`, {
            state: { mode: "detail", detailId },
          });
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
        <Route
          path="/"
          element={
            mode === "add" ? (
              <Add onChangePage={handlePageChange} />
            ) : mode === "edit" ? (
              <Edit onChangePage={handlePageChange} />
            ) : mode === "detail" ? (
              <Detail onChangePage={handlePageChange} />
            ) : (
              <Index onChangePage={handlePageChange} />
            )
          }
        />
        <Route path="add" element={<Add onChangePage={handlePageChange} />} />
        <Route
          path="edit/:id"
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
