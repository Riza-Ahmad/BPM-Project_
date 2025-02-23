import React from "react";
import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import PageTitleNav from "../../../part/PageTitleNav";
import HeaderForm from "../../../part/HeaderText";
import InputField from "../../../part/InputField";
import Button from "../../../part/Button";
import DropDown from "../../../part/Dropdown";
import { useFetch } from "../../../util/useFetch";
import { API_LINK } from "../../../util/Constants";
import { useIsMobile } from "../../../util/useIsMobile";
import SweetAlert from "../../../util/SweetAlert";
import Loading from "../../../part/Loading";
import InputFieldLov from "../../../part/InputFieldLov";
import SearchField from "../../../part/SearchField";
import Filter from "../../../part/Filter";
import Cookies from "js-cookie";
import Table from "../../../part/Table";
import Paging from "../../../part/Paging";

const arrSort = [
  { Value: "[judulDok] ASC", Text: "Judul Dokumen [↑]" },
  { Value: "[judulDok] DESC", Text: "Judul Dokumen [↓]" },
];

const arrStatus = [
  { Value: "Aktif", Text: "Aktif" },
  { Value: "Tidak Aktif", Text: "Tidak Aktif" },
];

export default function Edit({ onChangePage }) {
  const activeUser = Cookies.get("activeUser");
  let role = ""; // Jika undefined, gunakan nilai default
  let roleNama = "";
  let namaPengguna = "";
  if (activeUser) {
    role = JSON.parse(activeUser).RoleID.slice(0, 5);
    roleNama = JSON.parse(activeUser).Role;
    namaPengguna = JSON.parse(activeUser).Nama;
  }
  const title = "Edit Data";
  const breadcrumbs = [
    { label: "SPME" },
    { label: "Status Akreditasi" },
    { label: "Program Studi" },
  ];
  const isMobile = useIsMobile();
  const [loading, setLoading] = useState(true);
  const [loading2, setLoading2] = useState(true);

  const location = useLocation();
  const idMenu = location.state?.idMenu;
  const idData = location.state?.idData;

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

  useEffect(() => {
    setCurrentFilter((prevFilter) => ({
      ...prevFilter,
      param6: pageCurrent,
    }));
  }, [pageCurrent]);

  const [displayLov, setDisplayLov] = useState({
    fileSkAkr: "",
    fileSertifAkr: "",
  });

  const [formData, setFormData] = useState({
    kodeAkr: "",
    namaAkr: "",
    jenjangAkr: "",
    wilayahAkr: "",
    peringkatAkr: "",
    nomorSKAkr: "",
    berlakuAkr: "",
    kadaluarsaAkr: "",
    fileSkAkr: "",
    fileSertifAkr: "",
    judulDokSertifAkr: "",
    jenisDokSertifAkr: "",
  });

  const [fileSK, setFileSK] = useState(null);
  const [fileSertif, setFileSertif] = useState(null);

  const kodeAkrRef = useRef();
  const namaAkrRef = useRef();
  const jenjangAkrRef = useRef();
  const wilayahAkrRef = useRef();
  const peringkatAkrRef = useRef();
  const nomorSKAkrRef = useRef();
  const berlakuAkrRef = useRef();
  const kadaluarsaAkrRef = useRef();
  const fileSertifAkrRef = useRef();
  const fileSKAkrRef = useRef();

  const activeModalFor = useRef();

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
    const fetchAkreProdi = async () => {
      setLoading(true);
      try {
        const result = await useFetch(
          `${API_LINK}/MasterAkreditasi/GetAkreditasiProdiById`,
          { idData: idData },
          "POST"
        );

        if (result === "ERROR" || result === null || result.length === 0) {
        } else {
          const arrRe = Object.values(result);
          const obj = arrRe[0];
          setFormData({
            kodeAkr: obj.kodeAkr,
            namaAkr: obj.namaAkr,
            jenjangAkr: obj.jenjangAkr,
            wilayahAkr: obj.wilayahAkr,
            peringkatAkr: obj.peringkatAkr,
            nomorSKAkr: obj.noAkr,
            berlakuAkr: obj.tahunAkr,
            kadaluarsaAkr: obj.expAkr,
            judulDokSKAkr: obj.judulSkAkr,
            fileSkAkr: obj.fileSkAkr,
            judulDokSertifAkr: obj.judulSertifAkr,
            fileSertifAkr: obj.fileSertifAkr,
          });
        }
      } catch (err) {
        setError("Gagal mengambil data: " + err);
      } finally {
        setLoading(false);
      }
    };
    fetchAkreProdi();
  }, [location.state?.idData]);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    // e.preventDefault();

    const isKodeAkrValid = kodeAkrRef.current?.validate();
    const isNamaAkrValid = namaAkrRef.current?.validate();
    const isJenjangAkrValid = jenjangAkrRef.current?.validate();
    const isPeringkatAkrValid = peringkatAkrRef.current?.validate();
    const isNomorSKAkrValid = nomorSKAkrRef.current?.validate();
    const isBerlakuAkrValid = berlakuAkrRef.current?.validate();
    const isKadaluarsaAkrValid = kadaluarsaAkrRef.current?.validate();

    if (!isKodeAkrValid) {
      kodeAkrRef.current?.focus();
      return;
    }
    if (!isNamaAkrValid) {
      namaAkrRef.current?.focus();
      return;
    }
    if (!isJenjangAkrValid) {
      jenjangAkrRef.current?.focus();
      return;
    }
    if (!isPeringkatAkrValid) {
      peringkatAkrRef.current?.focus();
      return;
    }
    if (!isNomorSKAkrValid) {
      nomorSKAkrRef.current?.focus();
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
        idAkr: idData,
        kodeAkr: formData.kodeAkr,
        namaAkr: formData.namaAkr,
        jenjangAkr: formData.jenjangAkr,
        wilayahAkr: "",
        nomorSKAkr: formData.nomorSKAkr ? formData.nomorSKAkr : "",
        tahunAkr: formData.berlakuAkr
          ? new Date(formData.berlakuAkr).getFullYear()
          : "",
        peringkatAkr: formData.peringkatAkr ? formData.peringkatAkr : "",
        kadaluarsaAkr: formData.kadaluarsaAkr ? formData.kadaluarsaAkr : "",
        SKAkr: displayLov.fileSkAkr ? displayLov.fileSkAkr : "",
        SertifAkr: displayLov.fileSertifAkr ? displayLov.fileSertifAkr : "",
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
          "Data berhasil diperbarui.",
          "success",
          "OK"
        ).then(() =>
          onChangePage("index", {
            idMenu: idMenu,
          })
        );
      }
    } catch (error) {
      SweetAlert("Gagal!", error.message, "error", "OK");
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="d-flex flex-column min-vh-100">
      <main className="flex-grow-1 p-3" style={{ marginTop: "80px" }}>
        <div className="d-flex flex-column">
          <div className="container mb-3">
            <div className="p-3">
              <PageTitleNav
                title={title}
                breadcrumbs={breadcrumbs}
                onClick={() => onChangePage("index")}
              />
            </div>
            <div
              className={
                isMobile
                  ? "shadow p-4 m-2 mt-0 bg-white rounded"
                  : "shadow p-5 m-5 mt-0 bg-white rounded"
              }
            >
              <div>
                <HeaderForm label="Formulir Akreditasi" />
                <div className="row mb-3">
                  <div className="col-lg-6 col-md-6 ">
                    <InputField
                      ref={kodeAkrRef}
                      label="Kode Prodi"
                      value={formData.kodeAkr || "-"}
                      onChange={handleChange}
                      isRequired={true}
                      name="kodeAkr"
                      type="text"
                      maxChar="10"
                    />
                  </div>
                  <div className="col-lg-6 col-md-6">
                    <InputField
                      ref={namaAkrRef}
                      label="Nama Prodi"
                      value={formData.namaAkr || "-"}
                      onChange={handleChange}
                      isRequired={true}
                      name="namaAkr"
                      type="text"
                      maxChar="100"
                    />
                  </div>
                  <div className="col-lg-6 col-md-6">
                    <InputField
                      ref={jenjangAkrRef}
                      label="Jenjang"
                      value={formData.jenjangAkr || "-"}
                      onChange={handleChange}
                      isRequired={true}
                      name="jenjangAkr"
                      type="text"
                      maxChar="20"
                    />
                  </div>
                </div>
              </div>
              <div>
                <div className="row mb-3">
                  <div className="col-lg-6 col-md-6">
                    <InputField
                      ref={peringkatAkrRef}
                      label="Peringkat"
                      value={formData.peringkatAkr || "-"}
                      onChange={handleChange}
                      isRequired={false}
                      name="peringkatAkr"
                      type="text"
                      maxChar="20"
                    />
                  </div>
                  <div className="col-lg-6 col-md-6">
                    <InputField
                      ref={nomorSKAkrRef}
                      label="Nomor SK"
                      value={formData.nomorSKAkr || "-"}
                      onChange={handleChange}
                      isRequired={false}
                      name="nomorSKAkr"
                      type="text"
                      maxChar="20"
                    />
                  </div>
                  <div className="col-lg-6 col-md-6">
                    <InputField
                      ref={berlakuAkrRef}
                      label="Tahun SK"
                      value={formData.berlakuAkr ? formData.berlakuAkr : null}
                      onChange={handleChange}
                      isRequired={false}
                      name="berlakuAkr"
                      type="number"
                    />
                  </div>
                  <div className="col-lg-6 col-md-6">
                    <InputField
                      ref={kadaluarsaAkrRef}
                      label="Tanggal Kadaluwarsa SK"
                      value={
                        formData.kadaluarsaAkr
                          ? formData.kadaluarsaAkr.toString().split("T")[0]
                          : null
                      }
                      onChange={handleChange}
                      isRequired={false}
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
              </div>
              <div className="row">
                <div className="d-flex justify-content-between align-items-center">
                  <div className="flex-grow-1 m-2">
                    <Button
                      classType="primary"
                      type="submit"
                      label="Submit"
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
                      onClick={() =>
                        onChangePage("index", {
                          idMenu: idMenu,
                        })
                      }
                    />
                  </div>
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
