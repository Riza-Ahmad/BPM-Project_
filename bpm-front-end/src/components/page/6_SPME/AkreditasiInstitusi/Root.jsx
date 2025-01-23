import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import Index from "./Index";
import ScrollToTop from "../../../part/ScrollToTop";
import Add from "./Add";

export default function AkreInstitusi() {
  const navigate = useNavigate();

  const handlePageChange = (page, withState = {}) => {
    switch (page) {
      case "index":
        navigate("/spme/status/institusi");
        break;
      case "editKonten":
        navigate("/spme/status/institusi/editkonten", withState);
        break;
      case "add":
        navigate("/spme/status/institusi/add");
        break;
      case "edit":
        navigate("/spme/status/institusi/edit");
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
            <Index
              onChangePage={handlePageChange}
              title={"Akreditasi Insitusi"}
              breadcrumbs={[
                { label: "SPME" },
                { label: "Status Akreditasi" },
                { label: "Institusi" },
              ]}
            />
          }
        />
        <Route
          path="/add"
          element={<Add onChangePage={handlePageChange} />}
        />
      </Routes>
    </>
  );
}
