import PageTitleNav from "../../../part/PageTitleNav";
import HeaderForm from "../../../part/HeaderText";
import Button from "../../../part/Button";
import InputField from "../../../part/InputField";
import React, { useRef, useState, useEffect } from "react";
import { API_LINK } from "../../../util/Constants";
import SweetAlert from "../../../util/SweetAlert";
import { useFetch } from "../../../util/useFetch";
import moment from "moment";
import InputFieldLov from "../../../part/InputFieldLov";
import Loading from "../../../part/Loading";
import { useLocation } from "react-router-dom";
import SearchField from "../../../part/SearchField";
import Filter from "../../../part/Filter";
import DropDown from "../../../part/Dropdown";
import Table from "../../../part/Table";
import Paging from "../../../part/Paging";
import Cookies from "js-cookie";

const arrSort = [
  { Value: "[judulDok] ASC", Text: "Judul Dokumen [↑]" },
  { Value: "[judulDok] DESC", Text: "Judul Dokumen [↓]" },
];

export default function Edit({ onChangePage, idAkreditasi }) {
  const activeUser = Cookies.get("activeUser");
  let role = ""; // Jika undefined, gunakan nilai default
  let roleNama = "";
  let namaPengguna = "";
  if (activeUser) {
    role = JSON.parse(activeUser).RoleID.slice(0, 5);
    roleNama = JSON.parse(activeUser).Role;
    namaPengguna = JSON.parse(activeUser).Nama;
  }
  const title = "Akreditasi Prodi";
  const breadcrumbs = [
    { label: "SPME" },
    { label: "Status Akreditasi" },
    { label: "Program Studi" },
    { label: "Edit" },
  ];

  const [loading, setLoading] = useState(true);
  const [loading2, setLoading2] = useState(true);
  const location = useLocation();

  const [pageSize] = useState(10);
  const [pageCurrent, setPageCurrent] = useState(1);
  const [totalData, setTotalData] = useState(0);
  const [filteredData, setFilteredData] = useState([]);
  const [error, setError] = useState(null);

  const [currentFilter, setCurrentFilter] = useState({
    param1: 50,
    param2: "Aktif",
    param3: "",
    param4: "",
    param5: pageSize,
    param6: pageCurrent,
    param7: "[judulDok] ASC",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const [formData, setFormData] = useState({
    kodeAkr: "",
    namaAkr: "",
    jenjangAkr: "",
    wilayahAkr: "",
    peringkatAkr: "",
    nomorSkAkr: "",
    berlakuAkr: "",
    kadaluarsaAkr: "",
    judulDokSKAkr: "",
    jenisDokSKAkr: "",
    judulDokSertifAkr: "",
    jenisDokSertifAkr: "",
  });

  const namaAkrRef = useRef();
  const nomorSkAkrRef = useRef();
  const peringkatAkrRef = useRef();
  const berlakuAkrRef = useRef();
  const kadaluarsaAkrRef = useRef();
  const activeModalFor = useRef();
  const fileSertifAkrRef = useRef();
  const fileSKAkrRef = useRef();

  const [displayLov, setDisplayLov] = useState({
    fileSkAkr: "",
    fileSertifAkr: "",
  });

  const handleChoose = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [activeModalFor.current]: e.Key,
    }));
    setDisplayLov((prevData) => ({
      ...prevData,
      [activeModalFor.current]: e["Judul Dokumen"],
    }));
    document.getElementById("dokModalClose").click();
  };

  useEffect(() => {
    if (!location.state?.idAkre) return;

    const editId = location.state.idAkre;
    setLoading(true);

    const fetchDokumenById = async () => {
      const body = { idAkreditasi: editId };
      setLoading(true);
      const result = await useFetch(
        `${API_LINK}/MasterAkreditasi/GetAkreditasiProdiById`,
        body,
        "POST"
      ).finally(() => setLoading(false));

      if (result === "ERROR" || result === null || result.length === 0) {
        setFormData(null);
      } else {
        const dokumenArray = result;
        setFormData({
          kodeAkr: dokumenArray[0].kodeAkr,
          namaAkr: dokumenArray[0].namaAkr,
          jenjangAkr: dokumenArray[0].jenjangAkr,
          wilayahAkr: dokumenArray[0].wilayahAkr,
          peringkatAkr: dokumenArray[0].peringkatAkr,
          nomorSkAkr: dokumenArray[0].noAkr,
          berlakuAkr: dokumenArray[0].tahunAkr,
          kadaluarsaAkr: moment(dokumenArray[0].expAkr).format("YYYY-MM-DD"),
          judulDokSKAkr: dokumenArray[0].judulSkAkr,
          fileSkAkr: dokumenArray[0].fileSkAkr,
          judulDokSertifAkr: dokumenArray[0].judulSertifAkr,
          fileSertifAkr: dokumenArray[0].fileSertifAkr,
        });
      }
    };

    fetchDokumenById();
  }, [location.state?.idAkre]);

  useEffect(() => {
    const fetchDokumen = async () => {
      setLoading2(true);
      try {
        const result = await useFetch(
          `${API_LINK}/MasterDokumen/GetDataDokumenByMenu`,
          currentFilter,
          "POST"
        );

        if (result === "ERROR" || result === null || result.length === 0) {
          setFilteredData([]);
          setTotalData(0);
        } else {
          const dokumenArray = Object.values(result);
          setFilteredData(dokumenArray);
          setTotalData(dokumenArray[0].TotalCount);
        }
      } catch (err) {
        setError("Gagal mengambil data: " + err);
      } finally {
        setLoading2(false);
      }
    };
    fetchDokumen();
  }, [currentFilter]);

  const handleSubmit = async () => {
    if (!formData) {
      console.error("Form data is null");
      return;
    }
    const isNamaAkrValid = namaAkrRef.current?.validate();
    const isPeringkatAkrValid = peringkatAkrRef.current?.validate();
    const isNomorSKAkrValid = nomorSkAkrRef.current?.validate();
    const isBerlakuAkrValid = berlakuAkrRef.current?.validate();
    const isKadaluarsaAkrValid = kadaluarsaAkrRef.current?.validate();

    if (!isNamaAkrValid) {
      namaAkrRef.current?.focus();
      return;
    }
    if (!isPeringkatAkrValid) {
      peringkatAkrRef.current?.focus();
      return;
    }
    if (!isNomorSKAkrValid) {
      nomorSkAkrRef.current?.focus();
      return;
    }
    if (!isBerlakuAkrValid) {
      berlakuAkrRef.current?.focus();
      return;
    }
    if (!isKadaluarsaAkrValid) {
      kadaluarsaAkrRef.current?.focus();
      return;
    }
    try {
      const AkreData = {
        idAkr: location.state?.idAkre,
        kodeAkr: formData.kodeAkr || "",
        namaAkr: formData.namaAkr || "",
        jenjangAkr: formData.jenjangAkr || "",
        wilayahAkrRef: formData.wilayahAkr || "",
        nomorSKAkr: formData.nomorSkAkr ? formData.nomorSkAkr : "",
        tahunAkr: formData.berlakuAkr
          ? new Date(formData.berlakuAkr).getFullYear()
          : "",
        peringkatAkr: formData.peringkatAkr ? formData.peringkatAkr : "",
        kadaluarsaAkr: formData.kadaluarsaAkr ? formData.kadaluarsaAkr : "",
        SKAkr: formData.fileSkAkr ? formData.fileSkAkr : "",
        SertifAkr: formData.fileSertifAkr ? formData.fileSertifAkr : "",
      };

      const createResponse = await useFetch(
        `${API_LINK}/MasterAkreditasi/EditDataAkreditasi`,
        AkreData,
        "POST"
      );

      if (createResponse === "ERROR") {
        throw new Error("Gagal memperbarui data");
      } else {
        SweetAlert(
          "Berhasil!",
          "Data berhasil ditambahkan.",
          "success",
          "OK"
        ).then(() => onChangePage("index"));
      }
    } catch (error) {
      console.error("Error:", error.message);
      SweetAlert("Gagal!", error.message, "error", "OK");
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="d-flex flex-column min-vh-100">
      <main className="flex-grow-1 mb-5" style={{ marginTop: "80px" }}>
        <div className="d-flex flex-column">
          <div className="container mb-3">
            {/* Breadcrumbs and Page Title */}
            <div className="mt-4">
              <PageTitleNav
                title={title}
                breadcrumbs={breadcrumbs}
                onClick={() => onChangePage("index")}
              />
            </div>

            {/* Main Content Section */}
            <div className="shadow p-5 mt-0 bg-white rounded">
              <HeaderForm label={"Formulir " + title} />

              <div className="row">
                <div className="col-lg-6 col-md-6 ">
                  <InputField
                    ref={namaAkrRef}
                    label="Nama"
                    value={formData.namaAkr || ""}
                    onChange={handleChange}
                    isRequired="true"
                    name="namaAkr"
                    type="text"
                    maxChar="100"
                  />
                </div>

                <div className="col-lg-6 col-md-6">
                  <InputField
                    label="Peringkat"
                    isRequired={true}
                    onChange={handleChange}
                    value={formData.peringkatAkr || ""}
                    ref={peringkatAkrRef}
                    name="peringkatAkr"
                    type="text"
                    maxChar="20"
                  />
                </div>

                <div className="col-lg-12 col-md-12">
                  <InputField
                    label="Nomor SK"
                    isRequired={true}
                    onChange={handleChange}
                    value={formData.nomorSkAkr || ""}
                    ref={nomorSkAkrRef}
                    name="nomorSkAkr"
                    type="text"
                    maxChar="50"
                  />
                </div>
                <div className="col-lg-6 col-md-6">
                  <InputField
                    label="Tahun SK"
                    isRequired={true}
                    onChange={handleChange}
                    value={formData.berlakuAkr || ""}
                    ref={berlakuAkrRef}
                    name="berlakuAkr"
                    type="number"
                  />
                </div>
                <div className="col-lg-6 col-md-6">
                  <InputField
                    label="Tanggal Kadaluwarsa"
                    isRequired={true}
                    onChange={handleChange}
                    value={formData.kadaluarsaAkr || ""}
                    ref={kadaluarsaAkrRef}
                    name="kadaluarsaAkr"
                    type="date"
                  />
                </div>
                <div className="col-lg-12 col-md-12">
                  <InputFieldLov
                    ref={fileSKAkrRef}
                    id="fileSkAkr"
                    label="Dokumen SK"
                    placeholder="PIlih Dokumen"
                    isRequired={false}
                    modalTarget="#dokModal"
                    value={displayLov.fileSkAkr}
                    onChange={handleChange}
                    onClick={() => (activeModalFor.current = "fileSkAkr")}
                  />
                </div>
                <div className="col-lg-12 col-md-12">
                  <InputFieldLov
                    ref={fileSertifAkrRef}
                    id="fileSertifAkr"
                    label="Dokumen Sertifikat"
                    placeholder="PIlih Dokumen"
                    isRequired={false}
                    modalTarget="#dokModal"
                    value={displayLov.fileSertifAkr}
                    onChange={handleChange}
                    onClick={() => (activeModalFor.current = "fileSertifAkr")}
                  />
                </div>
              </div>

              <div className="d-flex justify-content-between align-items-center mt-4">
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
          id="dokModal"
          tabIndex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-xl modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="staticBackdropLabel">
                  Pilih Dokumen
                </h1>
                <button
                  type="button"
                  className="btn-close rounded-5"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  style={{ color: "white", backgroundColor: "white" }}
                  id="dokModalClose"
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
                              param3: e,
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
                          defaultValue="[judulDok] ASC"
                          forInput="sortFilter"
                          onChange={(e) =>
                            setCurrentFilter((prevFilter) => {
                              return {
                                ...prevFilter,
                                param7: e.target.value,
                              };
                            })
                          }
                        />
                      </Filter>
                    </div>
                  </div>
                </div>
                <div className="table-container bg-white rounded">
                  {loading2 ? (
                    <Loading />
                  ) : (
                    <div>
                      {role === "ROL01" ? (
                        <Table
                          arrHeader={["No", "Judul Dokumen"]}
                          data={filteredData.map((item, index) => ({
                            Key: item.idDok,
                            No: (pageCurrent - 1) * pageSize + index + 1,
                            "Judul Dokumen": item.judulDok,
                            status: item.status,
                          }))}
                          actions={["Choose"]}
                          onChoose={handleChoose}
                        />
                      ) : (
                        ""
                      )}
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
