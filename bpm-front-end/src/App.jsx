import "./App.css";
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
import DokumenSPMI from "./components/page/5_SPMI/dokumen_spmi/Root";
import Peraturan from "./components/page/10_Peraturan/ms_kebijakanPeraturan/Root";
import PeraturanEksternal from "./components/page/10_Peraturan/ms_peraturanEksternal/Root";
import InstrumenAps from "./components/page/10_Peraturan/ms_instrumenAps/Root";
import KriteriaSurvei from "./components/page/9_Survei/Kriteria_Survei/Root";
import SkalaSurvei from "./components/page/9_Survei/Skala_Penilaian/Root";
import AkreProdi from "./components/page/6_SPME/AkreditasiProdi/Root";
import AkreInstitusi from "./components/page/6_SPME/AkreditasiInstitusi/Root";
import RingkasanAkre from "./components/page/6_SPME/RIngkasanAkreditasi/Root";
import ScrollToTop from "./components/part/ScrollToTop";
import "./App.css";

function App() {
  return (
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
            <Route path="/spme/status/program-studi/*" element={<AkreProdi />} />
            <Route path="/spme/status/institusi/*" element={<AkreInstitusi />} />
            <Route path="/spme/status/tabel/*" element={<RingkasanAkre />} />
            <Route path="/peraturan/kebijakan/*" element={<Peraturan />} />
            <Route
              path="/peraturan/eksternal/*"
              element={<PeraturanEksternal />}
            />
            <Route path="/peraturan/aps/*" element={<InstrumenAps />} />
            <Route path="/survei/kriteria/*" element={<KriteriaSurvei />} />
            <Route path="/survei/skala/*" element={<SkalaSurvei />} />
            <Route path="/spmi/dokumen/*" element={<DokumenSPMI />} />

            {/* Halaman 404 */}
            <Route path="*" element={<div>Halaman tidak ditemukan</div>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
