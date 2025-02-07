import Akreditasi from "./Index";
import ScrollToTop from "../../../part/ScrollToTop";
import { Route } from "react-router-dom";
import { Routes } from "react-router-dom";
export default function RingkasanAkre() {
  return (
    <>
    <ScrollToTop />
    <Routes>
      <Route path="/" element={<Akreditasi  />} />
    </Routes>
  </>
  );
}
