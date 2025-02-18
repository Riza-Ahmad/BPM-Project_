import CapaianIkuIktIndex from "./Index";
import { Route } from "react-router-dom";
import { Routes } from "react-router-dom";
import ScrollToTop from "../../../part/ScrollToTop";
export default function CapaianIkuIkt() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<CapaianIkuIktIndex />} />
      </Routes>
    </>
  );
}
