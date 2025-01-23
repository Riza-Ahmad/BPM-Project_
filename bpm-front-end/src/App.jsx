import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { Suspense } from "react";
import ProtectedRoute from "./components/util/ProtectedRoute";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/backbone/Header";
import Footer from "./components/backbone/Footer";
import Beranda from "./components/page/1_Beranda/Root";
import Tentang from "./components/page/2_Tentang/Root";
import Berita from "./components/page/3_Berita/Root";
import JadwalKegiatan from "./components/page/4_Kegiatan/ms_jadwalKegiatan/Root";
import DokumentasiKegiatan from "./components/page/4_Kegiatan/ms_dokumentasiKegiatan/Root";
import Pelaksanaan from "./components/page/5_SPMI/siklus_spmi/pelaksanaan/Root";
import Penetapan from "./components/page/5_SPMI/siklus_spmi/penetapan/Root";
import Peningkatan from "./components/page/5_SPMI/siklus_spmi/peningkatan/Root";
import Pengendalian from "./components/page/5_SPMI/siklus_spmi/pengendalian/Root";
import Evaluasi from "./components/page/5_SPMI/siklus_spmi/evaluasi/Root";
import Peraturan from "./components/page/10_Peraturan/ms_kebijakanPeraturan/Root";
import PeraturanEksternal from "./components/page/10_Peraturan/ms_peraturanEksternal/Root";
import InstrumenAps from "./components/page/10_Peraturan/ms_instrumenAps/Root";
import KriteriaSurvei from "./components/page/9_Survei/Kriteria_Survei/Root";
import SkalaSurvei from "./components/page/9_Survei/Skala_Penilaian/Root";
import Template_Survei from "./components/page/9_Survei/Template_Survei/Index";
import Survei from "./components/page/9_Survei/Survei/Root";
import Pertanyaan_Survei from "./components/page/9_Survei/Pertanyaan_Survei/Root";
import Daftar_Survei from "./components/page/9_Survei/Daftar_Survei/Root"
import Dashboard_Survei from "./components/page/9_Survei/Dashboard_Survei/Root";
import ScrollToTop from "./components/part/ScrollToTop";
import routeList from "./components/util/RouteList";
import "./App.css";

function Layout() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  return (
    <div className="d-flex flex-column min-vh-100">
      {!isLoginPage && <Header />}
      <main className="flex-grow-1">
        <Suspense fallback={<div>Loading...</div>}>
    <Router
      future={{
        v7_startTransition: true, // Mengaktifkan startTransition
        v7_relativeSplatPath: true, // Mengaktifkan perubahan dalam resolusi rute relatif
      }}
    >
      <ScrollToTop />
      <div className="d-flex flex-column min-vh-100">
        <Header />
        <main className="flex-grow-1">
          <Routes>
            {routeList.map((route, index) => {
              if (route.protected) {
                return (
                  <Route
                    key={index}
                    path={route.path}
                    element={<ProtectedRoute>{route.element}</ProtectedRoute>}
                  />
                );
              }
              return (
                <Route key={index} path={route.path} element={route.element} />
              );
            })}
            <Route path="/" element={<Beranda />} />
            <Route path="/tentang/*" element={<Tentang />} />
            <Route path="/berita/*" element={<Berita />} />
            <Route path="/kegiatan/jadwal/*" element={<JadwalKegiatan />} />
            <Route
              path="/kegiatan/dokumentasi/*"
              element={<DokumentasiKegiatan />}
            />
            <Route
              path="/spmi/siklus/pelaksanaan/*"
              element={<Pelaksanaan />}
            />
            <Route path="/spmi/siklus/penetapan/*" element={<Penetapan />} />
            <Route
              path="/spmi/siklus/peningkatan/*"
              element={<Peningkatan />}
            />
            <Route
              path="/spmi/siklus/pengendalian/*"
              element={<Pengendalian />}
            />
            <Route path="/spmi/siklus/evaluasi/*" element={<Evaluasi />} />
            <Route path="/peraturan/kebijakan/*" element={<Peraturan />} />
            <Route
              path="/peraturan/eksternal/*"
              element={<PeraturanEksternal />}
            />
            <Route path="/peraturan/aps/*" element={<InstrumenAps />} />
            <Route path="/survei/kriteria/*" element={<KriteriaSurvei />} />
            <Route path="/survei/skala/*" element={<SkalaSurvei />} />
            <Route path="/survei/pertanyaan/*" element={<Pertanyaan_Survei />} />
            <Route path="/survei/template/*" element={<Template_Survei />} />
            <Route path="/survei/survei/*" element={<Survei />} />
            <Route path="/survei/daftar/*" element={<Daftar_Survei />} />
            <Route path="/survei/dashboard/*" element={<Dashboard_Survei />} />


            {/* Halaman 404 */}
            <Route path="*" element={<div>Halaman tidak ditemukan</div>} />
          </Routes>
        </Suspense>
      </main>

      {!isLoginPage && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Layout />
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;