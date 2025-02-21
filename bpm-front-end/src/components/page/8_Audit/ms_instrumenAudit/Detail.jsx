import React, { useState, useRef, useEffect } from "react";
import PageTitleNav from "../../../part/PageTitleNav";
import InputField from "../../../part/InputField";
import HeaderForm from "../../../part/HeaderText";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useIsMobile } from "../../../util/useIsMobile";
import { API_LINK } from "../../../util/Constants";
import { useFetch } from "../../../util/useFetch";
import CheckBox from "../../../part/CheckBox";
import Loading from "../../../part/Loading";
import Table from "../../../part/Table";
import { decodeHtml } from "../../../util/DecodeHtml";
import HeaderText from "../../../part/HeaderText";
import DetailData from "../../../part/DetailData";

const arrSort = [
  { Value: "namaKriteria ASC", Text: "Nama Kriteria [↑]" },
  { Value: "namaKriteria DESC", Text: "Nama Kriteria [↓]" },
  { Value: "tanggalBuat ASC", Text: "Waktu Dibuat [↑]" },
  { Value: "tanggalBuat DESC", Text: "Waktu Dibuat [↓]" },
];

export default function Detail({ onChangePage }) {
  const isMobile = useIsMobile();
  const title = "Detail Instrumen Audit";
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const idData = location.state?.idData;

  const [pageSize] = useState(5);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [pageCurrent, setPageCurrent] = useState(1);
  const [totalData, setTotalData] = useState(0);
  const [selectedSort, setSelectedSort] = useState("namaKriteria ASC");
  const [filteredData, setFilteredData] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("Aktif");
  const [selectedKriteria, setSelectedKriteria] = useState("");

  const [tambahPertanyaan, setTambahPertanyaan] = useState([]);
  const [idEdit, setIdEdit] = useState([]);
  const [idPertanyaan, setIdPertanyaan] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [aksiIs, setAksiIs] = useState(false);

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [showModal]);

  const [kriteria, setKriteria] = useState();

  useEffect(() => {
    const fetchKriteria = async () => {
      setLoading(true);
      try {
        const data = await useFetch(
          `${API_LINK}/MasterBankPertanyaanAudit/GetAllKriteriaAktif`,
          {}
        );

        const formattedData = [
          { Value: "", Text: "Semua" },
          ...data.map((item) => ({
            Value: item.Value,
            Text: item.Text,
          })),
        ];
        setKriteria(formattedData);
      } catch (err) {
        setError("Gagal mengambil data: " + err);
      } finally {
        setLoading(false);
      }
    };

    fetchKriteria();
  }, []);

  const fetchBank = async () => {
    setLoading(true);
    try {
      const result = await useFetch(
        `${API_LINK}/MasterBankPertanyaanAudit/GetDataBankPertanyaanAudit`,
        {
          param1: searchKeyword,
          param2: selectedSort,
          param3: pageSize,
          param4: pageCurrent,
          param5: selectedStatus,
          param6: selectedKriteria,
        }
      );

      if (result === "ERROR" || result === null || result.length === 0) {
        setFilteredData([]);
        setTotalData(0);
      } else {
        const arrResult = Object.values(result);
        setFilteredData(arrResult);
        setTotalData(arrResult[0].totalData);
      }
    } catch (err) {
      setError("Gagal mengambil data: " + err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBank();
  }, [
    searchKeyword,
    selectedSort,
    pageCurrent,
    selectedStatus,
    selectedKriteria,
  ]);

  const [formData, setFormData] = useState({
    nama: "",
    bagianAuditee: [],
    pertanyaan: [],
  });

  const [isInstrumenFetched, setIsInstrumenFetched] = useState(false);

  useEffect(() => {
    const fetchInstrumen = async () => {
      const body = {
        idData: idData,
      };
      setLoading(true);

      try {
        const result = await useFetch(
          `${API_LINK}/MasterInstrumenAudit/GetDataInstrumenAuditById`,
          body,
          "POST"
        );

        if (result === "ERROR" || result === null || result.length === 0) {
          setFormData({
            idInstrumen: idData,
            nama: "",
            bagianAuditee: [],
            pertanyaan: [],
          });
        } else {
          const fetchedData = result[0];
          setFormData({
            idInstrumen: idData,
            nama: fetchedData.nama,
            bagianAuditee: fetchedData.bagianAuditee
              .split(",")
              .map((id) => parseInt(id)),
            pertanyaan: fetchedData.pertanyaan
              .split(",")
              .map((id) => parseInt(id)),
            dibuatOleh: fetchedData.dibuatOleh,
            dibuatTgl: new Date(fetchedData.dibuatTgl).toLocaleDateString(
              "id-ID",
              {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              }
            ),
            dimodifOleh: fetchedData.dimodifOleh
              ? fetchedData.dimodifOleh
              : "-",
            dimodifTgl: fetchedData.dimodifTgl
              ? new Date(fetchedData.dimodifTgl).toLocaleDateString("id-ID", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })
              : "-",
          });
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
        setIsInstrumenFetched(true);
      }
    };

    fetchInstrumen();
  }, [idData]);

  const [pertanyaan, setPertanyaan] = useState([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await useFetch(
        `${API_LINK}/MasterInstrumenAudit/GetPertanyaanByIds`,
        { param: formData.pertanyaan }
      );

      if (result === "ERROR" || result === null || result.length === 0) {
        setPertanyaan([]);
      } else {
        const arrResult = Object.values(result);
        setPertanyaan(arrResult);
      }
    } catch (err) {
      setError("Gagal mengambil data: " + err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isInstrumenFetched && formData.pertanyaan.length > 0) {
      fetchData();
    }
  }, [isInstrumenFetched, formData.pertanyaan]);

  const [auditee, setAuditee] = useState([]);

  useEffect(() => {
    const fetchAuditee = async () => {
      setLoading(true);
      try {
        const data = await useFetch(
          `${API_LINK}/MasterBankPertanyaanAudit/GetAllAuditeeAktif`,
          {},
          "POST"
        );

        setAuditee(data);
      } catch (err) {
        setError("Gagal mengambil data: " + err);
      } finally {
        setLoading(false);
      }
    };

    fetchAuditee();
  }, []);

  if (error) return <p>{error}</p>;
  if (loading) return <Loading />;

  return (
    <div className="d-flex flex-column min-vh-100">
      <main className="flex-grow-1 p-3" style={{ marginTop: "80px" }}>
        <div className="d-flex flex-column">
          {/* Breadcrumbs and Page Title */}
          <div className="p-3">
            <PageTitleNav
              title={title}
              breadcrumbs={location.state.breadcrumbs}
              onClick={() => onChangePage("index")}
            />
          </div>
          <div className={isMobile ? "m-0" : "m-3"}>
            {/* Main Content Section */}
            <div
              className={
                isMobile
                  ? "shadow p-4 m-2 mt-0 bg-white rounded"
                  : "shadow p-5 m-5 mt-0 bg-white rounded"
              }
            >
              <HeaderForm label="Formulir Instrumen Audit" />

              <div className="border bg-white rounded mt-5 p-3">
                <DetailData label="Nama Instrumen" isi={formData.nama} />

                <CheckBox
                  arrData={auditee}
                  label="Bagian Auditee"
                  name="bagianAuditee"
                  isRequired={true}
                  values={formData.bagianAuditee || []}
                  onChange={undefined}
                  errorMessage="Please select at least one option."
                  col="col-2"
                />

                <div className="row">
                  <div className="col-lg-6 col-md-6">
                    <DetailData label="Dibuat Oleh" isi={formData.dibuatOleh} />
                    <DetailData
                      label="Dibuat Tanggal"
                      isi={formData.dibuatTgl}
                    />
                  </div>
                  <div className="col-lg-6 col-md-6">
                    <DetailData
                      label="Dimodifikasi Oleh"
                      isi={formData.dimodifOleh}
                    />
                    <DetailData
                      label="Dimodifikasi Tanggal"
                      isi={formData.dimodifTgl}
                    />
                  </div>
                </div>
              </div>

              <div className="border bg-white rounded mt-5">
                <div
                  className="ps-3"
                  style={{
                    backgroundColor: "#F3EFEF",
                    padding: "0.1rem",
                    borderColor: "gray",
                  }}
                >
                  <HeaderText
                    label="Daftar Pertanyaan"
                    warna="#2654A1"
                    ukuran="1.5rem"
                    alignText="left"
                    fontWeight="600"
                    marginBottom="20px"
                  />
                </div>
                <div className="p-3">
                  <Table
                    arrHeader={[
                      "No",
                      "Kriteria",
                      "Pertanyaan",
                      "Dokumen Pendukung",
                    ]}
                    data={pertanyaan.map((item, index) => ({
                      Key: item.id,
                      idPer: item.idBank,
                      No: index + 1,
                      Kriteria: item.namaKriteria,
                      Pertanyaan: (
                        <div
                          dangerouslySetInnerHTML={{
                            __html: decodeHtml(item.pertanyaan || ""),
                          }}
                        />
                      ),
                      "Dokumen Pendukung": item.isButuhDokumen,
                      status: item.status,
                    }))}
                    aksiIs={false}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {showModal && (
          <div
            className="modal-backdrop fade show"
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              zIndex: 1040,
            }}
          />
        )}
      </main>
    </div>
  );
}
