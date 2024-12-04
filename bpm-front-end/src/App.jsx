import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/backbone/Header";
import Footer from "./components/backbone/Footer";
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
import ScrollToTop from "./components/part/ScrollToTop";
import Template_Survei from "./components/page/9_Survei/Template_Survei/Root";
import "./App.css";
// import './App.css';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Header from './components/backbone/Header';
// import Footer from './components/backbone/Footer';
// import Tentang from './components/page/2_Tentang/Root';
// import Berita from './components/page/3_Berita/Root';
// import RencanaKegiatan from './components/page/4_Kegiatan/Root'
// import KriteriaSurvei from './components/page/9_Survei/Kriteria_Survei/Root';
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
          <Tentang />
          <Berita />
          <JadwalKegiatan />
          <DokumentasiKegiatan />
          <Pelaksanaan />
          <Penetapan />
          <Peningkatan />
          <Pengendalian />
          <Evaluasi />
          <Peraturan />
          <PeraturanEksternal />
          <InstrumenAps />
          <KriteriaSurvei />
          <SkalaSurvei />
          <Template_Survei />
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
