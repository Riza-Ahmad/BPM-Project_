// RouteList.jsx
import { lazy } from "react";
import { ROOT_LINK } from "./Constants";

// Lazy load components
const Login = lazy(() => import("../page/login/Index"));
const Logout = lazy(() => import("../page/logout/Index"));
const Profil = lazy(() => import("../page/login/Profil"));
const Notifikasi = lazy(() => import("../page/login/Notifikasi"));

const Beranda = lazy(() => import("../page/1_Beranda/Root"));
const Tentang = lazy(() => import("../page/2_Tentang/Root"));
const Berita = lazy(() => import("../page/3_Berita/Root"));
const JadwalKegiatan = lazy(() =>
  import("../page/4_Kegiatan/ms_jadwalKegiatan/Root")
);
const DokumentasiKegiatan = lazy(() =>
  import("../page/4_Kegiatan/ms_dokumentasiKegiatan/Root")
);
const Pelaksanaan = lazy(() =>
  import("../page/5_SPMI/siklus_spmi/pelaksanaan/Root")
);
const Penetapan = lazy(() =>
  import("../page/5_SPMI/siklus_spmi/penetapan/Root")
);
const Peningkatan = lazy(() =>
  import("../page/5_SPMI/siklus_spmi/peningkatan/Root")
);
const Pengendalian = lazy(() =>
  import("../page/5_SPMI/siklus_spmi/pengendalian/Root")
);
const Evaluasi = lazy(() => import("../page/5_SPMI/siklus_spmi/evaluasi/Root"));

const SPMI_Dinamis = lazy(() => import("../page/5_SPMI/SPMI_Dinamis/Root"));

const Dokumen = lazy(() => import("../page/5_SPMI/dokumen_spmi/Root"));
const DokumenE = lazy(() => import("../page/6_SPME/Dokumen/Root"));
const AkreditasiProdi = lazy(() =>
  import("../page/6_SPME/AkreditasiProdi/Root")
);
const AkreditasiInstitusi = lazy(() =>
  import("../page/6_SPME/AkreditasiInstitusi/Root")
);
const Ringkasan = lazy(() => import("../page/6_SPME/RIngkasanAkreditasi/Root"));
const PanduanAkreditasi = lazy(() =>
  import("../page/6_SPME/PanduanAkreditasi/Root")
);
const Standar = lazy(() => import("../page/7_IKU&IKT/Standar/Root"));
const IKUIKT = lazy(() => import("../page/7_IKU&IKT/IKUIKT/Root"));
const Capaian = lazy(() => import("../page/7_IKU&IKT/Capaian/Root"));
const IndikatorKinerja = lazy(() =>
  import("../page/7_IKU&IKT/IndikatorKinerja/Root")
);

//AUDIT
const Kriteria = lazy(() =>
  import("../page/8_Audit/ms_kriteriaPertanyaan/Root")
);
const Auditee = lazy(() => import("../page/8_Audit/ms_bagianAuditee/Root"));

const BankPertanyaan = lazy(() =>
  import("../page/8_Audit/ms_bankPertanyaan/Root")
);

const InstrumenAudit = lazy(() =>
  import("../page/8_Audit/ms_instrumenAudit/Root")
);

const JadwalAMI = lazy(() => import("../page/8_Audit/tr_jadwalAMI/Root"));

const PelaksanaanAMI = lazy(() =>
  import("../page/8_Audit/tr_pelaksanaanAMI/Root")
);
const KategoriDokumen = lazy(() =>
  import("../page/MasterKategoriDokumen/Root")
);
const Peraturan = lazy(() =>
  import("../page/10_Peraturan/ms_kebijakanPeraturan/Root")
);

const InstrumenAps = lazy(() =>
  import("../page/10_Peraturan/ms_instrumenAps/Root")
);

//SURVEI
const KriteriaSurvei = lazy(() =>
  import("../page/9_Survei/Kriteria_Survei/Root")
);
const SkalaSurvei = lazy(() => import("../page/9_Survei/Skala_Penilaian/Root"));
const Pertanyaan_Survei = lazy(() =>
  import("../page/9_Survei/Pertanyaan_Survei/Root")
);
const Template_Survei = lazy(() =>
  import("../page/9_Survei/Template_Survei/Root")
);
const Survei = lazy(() => import("../page/9_Survei/Survei/Root"));
const Daftar_Survei = lazy(() => import("../page/9_Survei/Daftar_Survei/Root"));
const Dashboard_Survei = lazy(() =>
  import("../page/9_Survei/Dashboard_Survei/Root")
);
const NotFound = lazy(() => import("../page/not-found/Index"));

// Define route list
const routeList = [
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/profile",
    element: <Profil />,
    protected: true,
  },
  {
    path: "/notifikasi",
    element: <Notifikasi />,
    protected: true,
  },
  {
    path: "/logout",
    element: <Logout />,
    protected: true,
  },
  {
    path: "/",
    element: <Beranda />,
  },
  {
    path: "/tentang/*",
    element: <Tentang />,
  },
  {
    path: "/berita/*",
    element: <Berita />,
  },
  {
    path: "/kegiatan/jadwal/*",
    element: <JadwalKegiatan />,
  },
  {
    path: "/kegiatan/dokumentasi/*",
    element: <DokumentasiKegiatan />,
  },
  {
    path: "/spmi/siklus/penetapan/*",
    element: <Penetapan />,
    protected: true,
  },
  {
    path: "/spmi/siklus/pelaksanaan/*",
    element: <Pelaksanaan />,
    protected: true,
  },
  {
    path: "/spmi/siklus/*",
    element: <SPMI_Dinamis />,
    protected: true,
  },
  {
    path: "/spmi/siklus/peningkatan/*",
    element: <Peningkatan />,
    protected: true,
  },
  // {
  //   path: "/spmi/siklus/pengendalian/*",
  //   element: <Pengendalian />,
  //   protected: true,
  // },
  // {
  //   path: "/spmi/siklus/evaluasi/*",
  //   element: <Evaluasi />,
  //   protected: true,
  // },
  {
    path: "/spmi/dokumen/*",
    element: <Dokumen />,
    protected: true,
  },
  {
    path: "/evaluasi/ami/kriteria/*",
    element: <Kriteria />,
    protected: true,
  },
  {
    path: "/evaluasi/ami/auditee/*",
    element: <Auditee />,
    protected: true,
  },
  {
    path: "/evaluasi/ami/pertanyaan/*",
    element: <BankPertanyaan />,
    protected: true,
  },
  {
    path: "/evaluasi/ami/instrumen/*",
    element: <InstrumenAudit />,
    protected: true,
  },
  {
    path: "/evaluasi/ami/jadwal/*",
    element: <JadwalAMI />,
    protected: true,
  },
  {
    path: "/evaluasi/ami/daftar/*",
    element: <PelaksanaanAMI />,
  },
  {
    path: "/spmi/kategori-dokumen/*",
    element: <KategoriDokumen />,
    protected: true,
  },
  {
    path: "/spme/status/ringkasan/*",
    element: <Ringkasan />,
    protected: true,
  },
  {
    path: "/spme/status/program-studi/*",
    element: <AkreditasiProdi />,
    protected: true,
  },
  {
    path: "/spme/status/institusi/*",
    element: <AkreditasiInstitusi />,
    protected: true,
  },
  {
    path: "/spme/panduan/*",
    element: <PanduanAkreditasi />,
    protected: true,
  },
  {
    path: "/spme/dokumen/*",
    element: <DokumenE />,
    protected: true,
  },
  {
    path: "/iku/dashboard/*",
    element: <Capaian />,
    protected: true,
  },
  {
    path: "/iku/ikuikt/*",
    element: <IndikatorKinerja />,
    protected: true,
  },
  {
    path: "/peraturan/dokumen/*",
    element: <Peraturan />,
    protected: true,
  },
  {
    path: "/peraturan/aps/*",
    element: <InstrumenAps />,
    protected: true,
  },

  {
    path: "/survei/kriteria/*",
    element: <KriteriaSurvei />,
    protected: true,
  },
  {
    path: "/survei/skala/*",
    element: <SkalaSurvei />,
    protected: true,
  },
  {
    path: "/survei/pertanyaan/*",
    element: <Pertanyaan_Survei />,
    protected: true,
  },
  {
    path: "/survei/template/*",
    element: <Template_Survei />,
    protected: true,
  },
  {
    path: "/survei/*",
    element: <Survei />,
    protected: true,
  },
  {
    path: "/survei/daftar/*",
    element: <Daftar_Survei />,
    protected: true,
  },
  {
    path: "/survei/dashboard/*",
    element: <Dashboard_Survei />,
    protected: true,
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

export default routeList;
