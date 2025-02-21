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
import DropDown from "../../../part/Dropdown";
import TextArea from "../../../part/TextArea";
import CheckBox from "../../../part/CheckBox";
import Loading from "../../../part/Loading";
import InputFieldLov from "../../../part/InputFieldLov";
import SearchField from "../../../part/SearchField";
import Filter from "../../../part/Filter";
import Table from "../../../part/Table";
import Paging from "../../../part/Paging";
import { format } from "date-fns";

const arrSort = [
  { Value: "[namaKry] ASC", Text: "Nama Karyawan [↑]" },
  { Value: "[namaKry] DESC", Text: "Nama Karyawan [↓]" },
  { Value: "[strukturDes] ASC", Text: "Struktur [↑]" },
  { Value: "[strukturDes] DESC", Text: "Struktur [↓]" },
  { Value: "[jabatanDes] ASC", Text: "Jabatan [↑]" },
  { Value: "[jabatanDes] DESC", Text: "Jabatan [↓]" },
  { Value: "[roleDes] ASC", Text: "Role [↑]" },
  { Value: "[roleDes] DESC", Text: "Role [↓]" },
];

const arrStatus = [
  { Value: "Aktif", Text: "Aktif" },
  { Value: "Tidak Aktif", Text: "Tidak Aktif" },
];

export default function Edit({ onChangePage }) {
  const isMobile = useIsMobile();
  const title = "Edit Jadwal AMI";
  const [pageSize] = useState(10);
  const [pageCurrent, setPageCurrent] = useState(1);
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const idData = location.state?.idData;

  const [currentFilter, setCurrentFilter] = useState({
    param1: "",
    param2: "Aktif",
    param3: "namaKry ASC",
    param4: pageSize,
    param5: pageCurrent,
  });

  const [formData, setFormData] = useState({
    id: idData,
    auditee: "",
    leadAuditor: "",
    auditor: "",
    tgl: "",
    waktuAwal: "",
    waktuAkhir: "",
    instrumen: "",
  });

  useEffect(() => {
    const fetchPertanyaan = async () => {
      const body = {
        idData: idData,
      };
      setLoading(true);

      try {
        const result = await useFetch(
          `${API_LINK}/TransaksiJadwalAMI/getDataJadwalAMIById`,
          body,
          "POST"
        );

        if (result === "ERROR" || result === null || result.length === 0) {
          setFormData({
            id: idData,
            auditee: "",
            leadAuditor: "",
            auditor: "",
            tgl: "",
            waktuAwal: "",
            waktuAkhir: "",
            instrumen: "",
          });
        } else {
          const fetchedData = result[0];

          const fetchedDate = new Date(fetchedData.tanggalKonfirmasi);
          const formattedDate = format(fetchedDate, "yyyy-MM-dd");

          setFormData({
            id: idData,
            auditee: fetchedData.idBA,
            leadAuditor: fetchedData.idLeadAuditor,
            auditor: fetchedData.idAuditor,
            tgl: formattedDate,
            waktuAwal: fetchedData.waktuKonfirmasiAwal,
            waktuAkhir: fetchedData.waktuKonfirmasiAkhir,
            instrumen: fetchedData.idINA,
          });

          setDisplayLov({
            leadAuditor: fetchedData.namaLeadAuditor,
            auditor: fetchedData.namaAuditor,
          });
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPertanyaan();
  }, [idData]);

  const [auditee, setAuditee] = useState([]);

  useEffect(() => {
    const fetchAuditee = async () => {
      setLoading(true);
      try {
        const data = await useFetch(
          `${API_LINK}/TransaksiJadwalAMI/GetDataAuditeeAktif`,
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

  const [instrumen, setInstrumen] = useState([]);

  useEffect(() => {
    const fetchInstrumen = async () => {
      setLoading(true);
      try {
        const data = await useFetch(
          `${API_LINK}/TransaksiJadwalAMI/GetAllInstrumenByBA`,
          { param1: formData.auditee },
          "POST"
        );

        setInstrumen(data);
      } catch (err) {
        setError("Gagal mengambil data: " + err);
      } finally {
        setLoading(false);
      }
    };

    fetchInstrumen();
  }, [formData.auditee]);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const result = await useFetch(
          `${API_LINK}/MasterBagianAuditee/GetDataUser`,
          currentFilter,
          "POST"
        );

        if (result === "ERROR" || result === null || result.length === 0) {
          setUserData([]);
          setTotalData(0);
        } else {
          const arrResult = Object.values(result);
          setUserData(arrResult);
          setTotalData(arrResult[0].TotalCount);
        }
      } catch (err) {
        setError("Gagal mengambil data: " + err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [currentFilter]);

  const [displayLov, setDisplayLov] = useState({
    leadAuditor: "",
    auditor: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "auditee") {
      setDisplayLov({
        leadAuditor: "",
        auditor: "",
      });
    }

    setFormData((prevData) => {
      const updatedData = {
        ...prevData,
        [name]: value,
      };

      if (name === "auditee") {
        updatedData.instrumen = "";
        updatedData.leadAuditor = "";
        updatedData.auditor = "";
      }

      return updatedData;
    });
  };

  const activeModalFor = useRef();

  const handleChoose = (e) => {
    if (!auditeeRef.current?.value) {
      SweetAlert(
        "Perhatian!",
        "Pilih bagian Auditee terlebih dahulu",
        "warning",
        "OK"
      );
      return;
    }

    const selectedAuditee = auditee.find(
      (auditee) => auditee.Value === Number(auditeeRef.current?.value)
    );

    if (e.idStruktur === selectedAuditee.bagAuditee) {
      SweetAlert(
        "Perhatian!",
        "Auditor tidak boleh di departemen yang sama dengan bagian auditee",
        "warning",
        "OK"
      );
      return;
    }
    setFormData((prevData) => ({
      ...prevData,
      [activeModalFor.current]: e.Key,
    }));
    setDisplayLov((prevData) => ({
      ...prevData,
      [activeModalFor.current]: e.Nama,
    }));
    document.getElementById("kadepModalClose").click();
  };

  const auditeeRef = useRef(null);
  const leadAuditorRef = useRef(null);
  const auditorRef = useRef(null);
  const tglAMIref = useRef(null);
  const waktuAwalRef = useRef(null);
  const waktuAkhirRef = useRef(null);
  const instrumenRef = useRef(null);

  const handleSubmit = async () => {
    const isAuditee = auditeeRef.current?.validate();
    const isLeadAuditor = leadAuditorRef.current?.validate();
    const isAuditor = auditorRef.current?.validate();
    const isTgl = tglAMIref.current?.validate();
    const isWaktuAwal = waktuAwalRef.current?.validate();
    const isWaktuAkhir = waktuAkhirRef.current?.validate();
    const isInstrumen = instrumenRef.current?.validate();

    if (!isAuditee) {
      auditeeRef.current?.focus();
      return;
    }

    if (!isLeadAuditor) {
      leadAuditorRef.current?.focus();
      return;
    }

    if (!isAuditor) {
      auditorRef.current?.focus();
      return;
    }

    const leadAuditor = leadAuditorRef.current?.value;
    const auditor = auditorRef.current?.value;
    if (leadAuditor === auditor) {
      SweetAlert(
        "Perhatian!",
        "Lead Auditor tidak boleh sama dengan Auditor.",
        "warning",
        "OK"
      );
      leadAuditorRef.current?.focus();
      return;
    }

    if (!isTgl) {
      tglAMIref.current?.focus();
      return;
    }

    if (!isWaktuAwal) {
      waktuAwalRef.current?.focus();
      return;
    }

    if (!isWaktuAkhir) {
      waktuAkhirRef.current?.focus();
      return;
    }

    if (!isInstrumen) {
      instrumenRef.current?.focus();
      return;
    }

    const waktuAwal = waktuAwalRef.current?.value;
    const waktuAkhir = waktuAkhirRef.current?.value;

    if (
      new Date(`1970-01-01T${waktuAwal}`) > new Date(`1970-01-01T${waktuAkhir}`)
    ) {
      SweetAlert(
        "Perhatian!",
        "Waktu akhir tidak boleh kurang dari waktu awal.",
        "warning",
        "OK"
      );
      waktuAwalRef.current?.focus();
      return;
    }

    try {
      const createResponse = await useFetch(
        `${API_LINK}/TransaksiJadwalAMI/EditJadwalAMIDraft`,
        formData
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
              <HeaderForm label="Formulir Jadwal Audit Mutu Internal" />

              <DropDown
                ref={auditeeRef}
                arrData={auditee}
                label="Bagian Auditee"
                type="pilih"
                value={formData.auditee}
                name="auditee"
                onChange={handleChange}
                isRequired={true}
              />

              <InputFieldLov
                ref={leadAuditorRef}
                id="leadAuditor"
                label="Lead Auditor"
                placeholder="Pilih Lead Auditor "
                isRequired={true}
                modalTarget="#kadepModal"
                value={displayLov.leadAuditor}
                onChange={handleChange}
                onClick={() => (activeModalFor.current = "leadAuditor")}
              />

              <InputFieldLov
                ref={auditorRef}
                id="auditor"
                label="Auditor"
                placeholder="Pilih Auditor"
                isRequired={true}
                modalTarget="#kadepModal"
                value={displayLov.auditor}
                onChange={handleChange}
                onClick={() => (activeModalFor.current = "auditor")}
              />

              <div className="row">
                <div className="col-lg-6 col-md-6">
                  <InputField
                    ref={tglAMIref}
                    label="Tanggal Pelaksanaan"
                    value={formData.tgl}
                    id="tgl"
                    onChange={handleChange}
                    isRequired={true}
                    type="date"
                  />
                </div>
                <div className="col-lg-3 col-md-3">
                  <InputField
                    ref={waktuAwalRef}
                    label="Waktu Awal"
                    value={formData.waktuAwal}
                    id="waktuAwal"
                    onChange={handleChange}
                    isRequired={true}
                    type="time"
                  />
                </div>
                <div className="col-lg-3 col-md-3">
                  <InputField
                    ref={waktuAkhirRef}
                    label="Waktu Akhir"
                    value={formData.waktuAkhir}
                    id="waktuAkhir"
                    onChange={handleChange}
                    isRequired={true}
                    type="time"
                  />
                </div>
              </div>

              {formData.auditee ? (
                <DropDown
                  ref={instrumenRef}
                  arrData={instrumen}
                  label="Instrumen Audit"
                  type="pilih"
                  value={formData.instrumen}
                  name="instrumen"
                  onChange={handleChange}
                  isRequired={true}
                />
              ) : (
                <div>
                  <strong> Instrumen Audit</strong>
                  <p>Harap pilih bagian auditee terlebih dahulu</p>
                </div>
              )}

              <div className="d-flex justify-content-between align-items-center">
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
          </div>
        </div>

        <div
          className="modal fade"
          id="kadepModal"
          tabIndex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
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
                  style={{ color: "white", backgroundColor: "white" }}
                  id="kadepModalClose"
                ></button>
              </div>
              <div className="modal-body">
                <div className="container-fluid">
                  <div className="row">
                    <div className="col-lg-10">
                      <SearchField
                        onChange={(e) =>
                          setCurrentFilter((prevFilter) => {
                            return {
                              ...prevFilter,
                              param1: e,
                            };
                          })
                        }
                      />
                    </div>
                    <div className="col-lg-2">
                      <Filter>
                        <DropDown
                          arrData={arrSort}
                          label="Urut Berdasarkan"
                          type="pilih"
                          defaultValue="[namaKry] ASC"
                          forInput="sortFilter"
                          onChange={(e) =>
                            setCurrentFilter((prevFilter) => {
                              return {
                                ...prevFilter,
                                param3: e.target.value,
                              };
                            })
                          }
                        />
                        <DropDown
                          arrData={arrStatus}
                          label="Status"
                          type="pilih"
                          defaultValue="Aktif"
                          forInput="statusFilter"
                          onChange={(e) =>
                            setCurrentFilter((prevFilter) => {
                              return {
                                ...prevFilter,
                                param2: e.target.value,
                              };
                            })
                          }
                        />
                      </Filter>
                    </div>
                  </div>
                </div>
                <div className="table-container bg-white rounded">
                  {loading ? (
                    <Loading />
                  ) : (
                    <div>
                      <Table
                        arrHeader={[
                          "No",
                          "Nama",
                          "Struktur",
                          "Jabatan",
                          "Role",
                        ]}
                        data={userData.map((item, index) => ({
                          Key: item.idKry,
                          No: (pageCurrent - 1) * pageSize + index + 1,
                          Nama: item.namaKry,
                          Struktur: item.strukturDes,
                          Jabatan: item.jabatanDes,
                          Role: item.roleDes,
                        }))}
                        actions={["Choose"]}
                        onChoose={handleChoose}
                      />

                      <Paging
                        pageSize={pageSize}
                        pageCurrent={pageCurrent}
                        totalData={totalData}
                        navigation={setPageCurrent}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
