import React, { useState, useRef, useEffect } from "react";
import PageTitleNav from "../../../part/PageTitleNav";
import InputField from "../../../part/InputField";
import HeaderForm from "../../../part/HeaderText";
import Button from "../../../part/Button";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import SweetAlert from "../../../util/SweetAlert";
import { useIsMobile } from "../../../util/useIsMobile";
import { API_LINK } from "../../../util/Constants";
import { useFetch } from "../../../util/useFetch";
import CheckBox from "../../../part/CheckBox";
import Loading from "../../../part/Loading";
import Table from "../../../part/Table";
import { decodeHtml } from "../../../util/DecodeHtml";
import HeaderText from "../../../part/HeaderText";
import SearchField from "../../../part/SearchField";
import Filter from "../../../part/Filter";
import Paging from "../../../part/Paging";
import DropDown from "../../../part/Dropdown";

const arrSort = [
  { Value: "namaKriteria ASC", Text: "Nama Kriteria [↑]" },
  { Value: "namaKriteria DESC", Text: "Nama Kriteria [↓]" },
  { Value: "tanggalBuat ASC", Text: "Waktu Dibuat [↑]" },
  { Value: "tanggalBuat DESC", Text: "Waktu Dibuat [↓]" },
];

export default function Edit({ onChangePage }) {
  const isMobile = useIsMobile();
  const title = "Edit Instrumen Audit";
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
          { Value: "", Text: "Semua" }, // Opsi default
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

  // Track when instrumen fetch is completed
  const [isInstrumenFetched, setIsInstrumenFetched] = useState(false);

  // GET DATA BY ID
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
          });
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
        setIsInstrumenFetched(true); // Mark as fetched
      }
    };

    fetchInstrumen();
  }, [idData]);

  // GET LIST PERTANYAAN
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

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => {
      const updatedData = {
        ...prevData,
        [name]: value,
      };

      // Reset pertanyaanLanjutan jika butuhDokumen kosong
      if (name === "butuhDokumen" && value.length === 0) {
        updatedData.pertanyaanLanjutan = ""; // Reset ke nilai default
      }

      return updatedData;
    });
  };

  const namaRef = useRef();
  const bagianAuditeeRef = useRef();

  const handleSubmit = async () => {
    const isPertanyaanValid = namaRef.current?.validate();
    const isAuditeeValid = bagianAuditeeRef.current?.validate();

    if (!isPertanyaanValid) {
      namaRef.current?.focus();
      return;
    }

    if (!isAuditeeValid) {
      bagianAuditeeRef.current?.focus();
      return;
    }

    try {
      const createResponse = await useFetch(
        `${API_LINK}/MasterInstrumenAudit/EditDataInstrumenAudit`,
        formData,
        "POST"
      );

      if (createResponse === "ERROR") {
        throw new Error("Gagal menambah data");
      } else {
        SweetAlert(
          "Berhasil!",
          "Data berhasil diperbarui.",
          "success",
          "OK"
        ).then(() => onChangePage("index"));
      }
    } catch (error) {
      console.error("Error:", error.message);
      SweetAlert("Gagal!", error.message, "error", "OK");
    }
  };

  const handleSubmitPertanyaan = async () => {
    if (tambahPertanyaan.length == 0) {
      SweetAlert("Informasi", "Pilih setidaknya satu pertanyaan", "info", "OK");
      return;
    }

    try {
      const createResponse = await useFetch(
        `${API_LINK}/MasterInstrumenAudit/CreateDataInstrumenAuditPertanyaan`,
        { id: idData, pertanyaan: tambahPertanyaan },
        "POST"
      );

      if (createResponse === "ERROR") {
        throw new Error("Gagal menambah data");
      } else {
        SweetAlert(
          "Berhasil!",
          "Data berhasil diperbarui.",
          "success",
          "OK"
        ).then(() => {
          handleCloseModal(idData);

          window.location.reload();
        });
      }
    } catch (error) {
      console.error("Error:", error.message);
      SweetAlert("Gagal!", error.message, "error", "OK");
    }
  };

  const handleChoosePertanyaan = async (pertanyaanBaru) => {
    const isDuplicate = pertanyaan.some(
      (item) => item.idBank === pertanyaanBaru
    );

    if (isDuplicate) {
      SweetAlert(
        "Perhatian!",
        "Pertanyaan yang dipilih sudah terdapat pada daftar. Silakan pilih pertanyaan yang lain.",
        "info",
        "OK"
      );
      return;
    }

    try {
      // Kirim permintaan ke backend menggunakan useFetch
      const createResponse = await useFetch(
        `${API_LINK}/MasterInstrumenAudit/EditDataInstrumenAuditPertanyaan`,
        { idEdit: idEdit, pertanyaanBaru: pertanyaanBaru }
      );

      // Tangani hasil dari useFetch
      if (createResponse === "ERROR") {
        throw new Error("Gagal menambah data");
      }

      SweetAlert(
        "Berhasil!",
        "Data berhasil diperbarui.",
        "success",
        "OK"
      ).then(() => {
        handleCloseModal(idData);
        window.location.reload();
      });
    } catch (error) {
      console.error("Error:", error.message); // Log kesalahan
      SweetAlert("Gagal!", error.message, "error", "OK"); // Tampilkan kesalahan kepada pengguna
    }
  };

  const handleDeletePertanyaan = async (id) => {
    const confirm = await SweetAlert(
      "Konfirmasi",
      "Apakah Anda yakin ingin menghapus pertanyaan ini?",
      "warning",
      "Ya, Hapus",
      null,
      "",
      true
    );

    if (confirm) {
      try {
        const response = await useFetch(
          `${API_LINK}/MasterInstrumenAudit/DeleteDataInstrumenAuditPertanyaan`,
          { idPert: id },
          "POST"
        );
        if (response === "ERROR") throw new Error("Gagal menghapus pertanyaan");
        SweetAlert("Berhasil", "Data Berhasil Dihapus", "success");
        setPertanyaan((prevData) => prevData.filter((item) => item.id !== id));
      } catch (err) {
        console.error(err);
        SweetAlert(
          "Gagal",
          "Terjadi kesalahan saat menghapus kegiatan",
          "error"
        );
      }
    }
  };

  if (error) return <p>{error}</p>;

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
                <InputField
                  ref={namaRef}
                  label="Nama Instrumen"
                  value={formData.nama || ""}
                  onChange={handleChange}
                  isRequired={true}
                  name="nama"
                  type="text"
                  maxChar="100"
                />

                <CheckBox
                  ref={bagianAuditeeRef}
                  arrData={auditee}
                  label="Bagian Auditee"
                  name="bagianAuditee"
                  isRequired={true}
                  values={formData.bagianAuditee || []} // Set default selected values here
                  onChange={handleChange}
                  errorMessage="Please select at least one option."
                  col="col-2"
                />

                <div className="d-flex justify-content-between align-items-center mt-5">
                  <div className="flex-grow-1 m-2">
                    <Button
                      classType="primary"
                      type="submit"
                      label="Simpan"
                      width="100%"
                      onClick={handleSubmit}
                    />
                  </div>
                  <div className="flex-grow-1 m-2">
                    <Button
                      classType="danger"
                      type="button"
                      label="Batal"
                      width="100%"
                      onClick={() => onChangePage("index")}
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
                  <div className="row">
                    <div className="col-3 mb-3">
                      <Button
                        iconName="search"
                        classType="primary"
                        type="submit"
                        label="Dari Bank Pertanyaan"
                        width="100%"
                        onClick={() => {
                          handleOpenModal(); // Memanggil fungsi untuk membuka modal
                          setAksiIs(false); // Mengubah nilai state `aksiIs`
                        }}
                        style={{ minWidth: "15rem" }}
                      />
                    </div>
                  </div>

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
                    actions={["Edit", "Delete"]}
                    onEdit={(item) => {
                      handleOpenModal(item.Key); // Fungsi untuk membuka modal
                      setAksiIs(true); // Jika Anda ingin memperbarui state `aksiIs`
                      setIdPertanyaan(item.idPer);
                      setIdEdit(item.Key);
                    }}
                    onDelete={(item) => handleDeletePertanyaan(item.Key)}
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

        <div
          className={`modal fade ${showModal ? "show" : ""}`}
          id="kadepModal"
          tabIndex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden={!showModal}
          style={{ display: showModal ? "block" : "none" }} // Manually controlling modal visibility
        >
          <div className="modal-xl modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="staticBackdropLabel">
                  Pilih Karyawan
                </h1>
                <button
                  type="button"
                  className="btn-close rounded-5"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={handleCloseModal}
                  style={{ color: "white", backgroundColor: "white" }}
                  id="kadepModalClose"
                ></button>
              </div>
              <div className="modal-body">
                <div className="container-fluid">
                  <div className="row">
                    <div className="col-lg-10">
                      <SearchField
                        onChange={(value) => setSearchKeyword(value)}
                      />
                    </div>
                    <div className="col-lg-2">
                      <Filter>
                        <DropDown
                          arrData={arrSort}
                          label="Urut Berdasarkan"
                          value={selectedSort}
                          forInput="urutFilter"
                          onChange={(e) => setSelectedSort(e.target.value)}
                        />

                        <DropDown
                          arrData={kriteria}
                          label="Berdasarkan Kriteria"
                          value={selectedKriteria}
                          forInput="kriteria"
                          onChange={(e) => setSelectedKriteria(e.target.value)}
                        />
                      </Filter>
                    </div>
                  </div>
                </div>
                {loading ? (
                  <Loading />
                ) : (
                  <div className="table-container bg-white rounded">
                    <Table
                      arrHeader={[
                        "No",
                        "Pertanyaan",
                        "Butuh Dokumen?",
                        "Jenis IKT?",
                        "Kriteria",
                      ]}
                      data={filteredData.map((item, index) => ({
                        Key: item.idBankPertanyaan,
                        No: (pageCurrent - 1) * pageSize + index + 1,
                        Pertanyaan: (
                          <div
                            dangerouslySetInnerHTML={{
                              __html: decodeHtml(item.pertanyaan || ""),
                            }}
                          />
                        ),
                        "Butuh Dokumen?": item.isButuhDokumen,
                        Kriteria: item.namaKriteria,
                        "Jenis IKT?": item.isJenisIKT,
                        status: item.statusPertanyaan,
                      }))}
                      actions={aksiIs ? ["Choose"] : ""}
                      enableCheckbox={!aksiIs}
                      aksiIs={aksiIs}
                      onSelect={(selectedKeys) =>
                        setTambahPertanyaan(selectedKeys)
                      }
                      onChoose={(item) => handleChoosePertanyaan(item.Key)}
                    />

                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <div className="m-2">
                        <Paging
                          pageSize={pageSize}
                          pageCurrent={pageCurrent}
                          totalData={totalData}
                          navigation={setPageCurrent}
                        />
                      </div>
                      <div className="m-2 me-5">
                        {aksiIs === false && (
                          <Button
                            classType="primary"
                            type="submit"
                            label="Simpan"
                            width="150%"
                            onClick={handleSubmitPertanyaan}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
