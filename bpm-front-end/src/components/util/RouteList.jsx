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
const PeraturanEksternal = lazy(() =>
  import("../page/10_Peraturan/ms_peraturanEksternal/Root")
);
const InstrumenAps = lazy(() =>
  import("../page/10_Peraturan/ms_instrumenAps/Root")
);
const KriteriaSurvei = lazy(() =>
  import("../page/9_Survei/Kriteria_Survei/Root")
);
const SkalaSurvei = lazy(() => import("../page/9_Survei/Skala_Penilaian/Root"));
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
  // {
  //   path: "/spmi/siklus/penetapan/*",
  //   element: <Penetapan />,
  //   protected: true,
  // },
  // {
  //   path: "/spmi/siklus/pelaksanaan/*",
  //   element: <Pelaksanaan />,
  //   protected: true,
  // },
  {
    path: "/spmi/siklus/*",
    element: <SPMI_Dinamis />,
    protected: true,
  },
  // {
  //   path: "/spmi/siklus/peningkatan/*",
  //   element: <Peningkatan />,
  //   protected: true,
  // },
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
    path: "/evaluasi/ami/pelaksanaan/*",
    element: <PelaksanaanAMI />,
  },
  {
    path: "/spmi/kategori-dokumen/*",
    element: <KategoriDokumen />,
    protected: true,
  },
  {
    path: "/peraturan/kebijakan/*",
    element: <Peraturan />,
    protected: true,
  },
  {
    path: "/peraturan/eksternal/*",
    element: <PeraturanEksternal />,
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
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

export default routeList;
