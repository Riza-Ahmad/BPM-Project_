import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import Index from "./Index";
import AddSkala from "./AddSkala";
import ScrollToTop from "../../../part/ScrollToTop";

export default function Skala_Survei() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/survei/skala" element={<Index />} />
        <Route path="/survei/skala/add" element={<AddSkala />} />
        <Route path="/survei/skala/edit" element={<EditSkala />} />
      </Routes>
    </>
  );
}
