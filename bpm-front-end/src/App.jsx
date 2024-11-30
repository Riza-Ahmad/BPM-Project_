import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/backbone/Header";
import Footer from "./components/backbone/Footer";
import Tentang from "./components/page/2_Tentang/Root";
import Berita from "./components/page/3_Berita/Root";
import JadwalKegiatan from "./components/page/4_Kegiatan/ms_jadwalKegiatan/Root";
import Pelaksanaan from "./components/page/5_SPMI/siklus_spmi/pelaksanaan/Root";
import Penetapan from "./components/page/5_SPMI/siklus_spmi/penetapan/Root";
import Peningkatan from "./components/page/5_SPMI/siklus_spmi/peningkatan/Root";
import Pengendalian from "./components/page/5_SPMI/siklus_spmi/pengendalian/Root";
import Evaluasi from "./components/page/5_SPMI/siklus_spmi/evaluasi/Root";
import "./App.css";
import Peraturan from "./components/page/10_Peraturan/ms_kebijakanPeraturan/Root";
import PeraturanEksternal from "./components/page/10_Peraturan/ms_peraturanEksternal/Root";
import InstrumenAps from "./components/page/10_Peraturan/ms_instrumenAps/Root";
import KriteriaSurvei from "./components/page/9_Survei/Kriteria_Survei/Root";
import SkalaSurvei from "./components/page/9_Survei/Skala_Penilaian/Root";
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
    <Router>
      {" "}
      {/* Wrap the entire app in Router */}
      <div className="d-flex flex-column min-vh-100">
        {/* Header Component */}
        <Header />

        <main className="flex-grow-1">
          <Tentang />
          <Berita />
          <JadwalKegiatan />
          <Pelaksanaan />
          <Penetapan />
          <Peningkatan />
          <Pengendalian />
          <Evaluasi />
          <Peraturan />
          <PeraturanEksternal />
          <InstrumenAps />
          <KriteriaSurvei />
          <SkalaSurvei></SkalaSurvei>
          {/* <main className="flex-grow-1" >
          <Tentang/>
          <Berita/>
          <RencanaKegiatan/>
           */}
        </main>

        {/* Footer Component */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
