import React, { useState, useRef } from "react";
import { useEffect } from "react";
import PageTitleNav from "../../../part/PageTitleNav";
import InputField from "../../../part/InputField";
import HeaderForm from "../../../part/HeaderText";
import Button from "../../../part/Button";
import DocUpload from "../../../part/DocUpload";
import DropDown from "../../../part/Dropdown";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import SweetAlert from "../../../util/SweetAlert";
import FileUpload from "../../../part/FileUpload";
import { useIsMobile } from "../../../util/useIsMobile";
import { API_LINK } from "../../../util/Constants";
import { useFetch } from "../../../util/useFetch";
import { uploadFile } from "../../../util/UploadFile";
import Table from "../../../part/Table";
import Paging from "../../../part/Paging";
import Cookies from "js-cookie";
import Loading from "../../../part/Loading";
import SearchField from "../../../part/SearchField";
import Filter from "../../../part/Filter";
import InputFieldLov from "../../../part/InputFieldLov";

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
  const activeUser = Cookies.get("activeUser");
  let role = ""; // Jika undefined, gunakan nilai default
  let roleNama = "";
  let namaPengguna = "";
  if (activeUser) {
    role = JSON.parse(activeUser).RoleID.slice(0, 5);
    roleNama = JSON.parse(activeUser).Role;
    namaPengguna = JSON.parse(activeUser).Nama;
  }
  const isMobile = useIsMobile();
  const title = "Edit Data";
  const location = useLocation();
  const idMenu = location.state?.idMenu;
  const idData = location.state?.idData;

  const [pageSize] = useState(10);
  const [pageCurrent, setPageCurrent] = useState(1);
  const [totalData, setTotalData] = useState(0);
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    idBad: idData,
    kodeBad: "",
    namaBad: "",
    kadepBad: "",
    pic1Bad: "",
    pic2Bad: "",
  });

  const [displayLov, setDisplayLov] = useState({
    kadepBad: "",
    pic1Bad: "",
    pic2Bad: "",
  });

  const kodeBadRef = useRef(null);
  const namaBadRef = useRef(null);
  const kadepBadRef = useRef(null);
  const pic1BadRef = useRef(null);
  const pic2BadRef = useRef(null);
  const activeModalFor = useRef();

  const [currentFilter, setCurrentFilter] = useState({
    param1: "",
    param2: "Aktif",
    param3: "namaKry ASC",
    param4: pageSize,
    param5: pageCurrent,
  });

  useEffect(() => {
    setCurrentFilter((prevFilter) => ({
      ...prevFilter,
      param5: pageCurrent,
    }));
  }, [pageCurrent]);

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

  useEffect(() => {
    const fetchAuditee = async () => {
      setLoading(true);
      try {
        const body = {
          id: idData,
        };
        const result = await useFetch(
          `${API_LINK}/MasterBagianAuditee/GetDataBagianAuditeeById`,
          body,
          "POST"
        );

        if (result === "ERROR" || result === null || result.length === 0) {
        } else {
          const arrResult = Object.values(result);
          console.log(arrResult);
          setFormData((prevData) => ({
            ...prevData,
            kodeBad: arrResult[0].kodeBad,
            namaBad: arrResult[0].namaBad,
            kadepBad: arrResult[0].kaDep,
            pic1Bad: arrResult[0].pic1Bad,
            pic2Bad: arrResult[0].pic2Bad,
          }));
          setDisplayLov((prevData) => ({
            ...prevData,
            kadepBad: arrResult[0].kadepBad,
            pic1Bad: arrResult[0].pic1NamaBad,
            pic2Bad: arrResult[0].pic2NamaBad,
          }));
          setTotalData(arrResult[0][0].TotalCount);
        }
      } catch (err) {
        setError("Gagal mengambil data: " + err);
      } finally {
        setLoading(false);
      }
    };
    fetchAuditee();
  }, [idData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleChoose = (e) => {
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

  const handleSubmit = async () => {
    const isKodeBadValid = kodeBadRef.current?.validate();
    const isNamaBadValid = namaBadRef.current?.validate();
    const isKadepBadValid = kadepBadRef.current?.validate();
    const isPic1BadValid = pic1BadRef.current?.validate();
    const isPic2BadValid = pic2BadRef.current?.validate();

    if (!isKodeBadValid) {
      kodeBadRef.current?.focus();
      return;
    }
    if (!isNamaBadValid) {
      namaBadRef.current?.focus();
      return;
    }
    if (!isKadepBadValid) {
      kadepBadRef.current?.focus();
      return;
    }
    if (!isPic1BadValid) {
      pic1BadRef.current?.focus();
      return;
    }
    if (!isPic2BadValid) {
      pic2BadRef.current?.focus();
      return;
    }

    console.log(formData);

    try {
      const result = await useFetch(
        `${API_LINK}/MasterBagianAuditee/CheckBagianAuditeeExistEdit`,
        {
          param1: formData.kodeBad,
          param2: formData.namaBad,
          param3: idData,
        },
        "POST"
      );

      if (result.length > 0) {
        SweetAlert("Gagal!", "Data bagian auditee sudah ada", "error", "OK");
        return;
      }

      const createResponse = await useFetch(
        `${API_LINK}/MasterBagianAuditee/EditBagianAuditee`,
        formData,
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
      console.error("Error:", error.message);
      SweetAlert("Gagal!", error.message, "error", "OK");
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <main className="flex-grow-1 p-3" style={{ marginTop: "80px" }}>
        <div className="d-flex flex-column">
          {/* Breadcrumbs and Page Title */}
          <div className={isMobile ? "m-0 p-0" : "m-3 mb-0"}>
            <PageTitleNav
              title={title}
              breadcrumbs={location.state.breadcrumbs}
              onClick={() =>
                onChangePage("index", {
                  idMenu: idMenu,
                })
              }
            />
          </div>
          <div className={isMobile ? "m-0" : "m-3"}>
            <div
              className={
                isMobile
                  ? "shadow p-4 m-2 mt-0 bg-white rounded"
                  : "shadow p-5 m-5 mt-0 bg-white rounded"
              }
            >
              <HeaderForm label="Formulir Kriteria" />
              <InputField
                ref={kodeBadRef}
                label="Kode Bagian Auditee"
                value={formData.kodeBad}
                onChange={handleChange}
                isRequired={true}
                id="kodeBad"
                type="text"
                maxChar="50"
              />
              <InputField
                ref={namaBadRef}
                label="Nama Bagian Auditee"
                value={formData.namaBad}
                onChange={handleChange}
                isRequired={true}
                id="namaBad"
                type="text"
                maxChar="50"
              />
              <InputFieldLov
                ref={kadepBadRef}
                id="kadepBad"
                label="Kepala Departmen"
                placeholder="PIlih kepala departemen"
                isRequired={true}
                modalTarget="#kadepModal"
                value={displayLov.kadepBad}
                onChange={handleChange}
                onClick={() => (activeModalFor.current = "kadepBad")}
              />
              <InputFieldLov
                ref={pic1BadRef}
                id="pic1Bad"
                label="PIC 1"
                placeholder="PIlih PIC 1"
                isRequired={false}
                modalTarget="#kadepModal"
                type="text"
                value={displayLov.pic1Bad}
                onChange={handleChange}
                onClick={() => (activeModalFor.current = "pic1Bad")}
              />
              <InputFieldLov
                ref={pic2BadRef}
                id="pic2Bad"
                label="PIC 2"
                placeholder="PIlih PIC 2"
                isRequired={false}
                modalTarget="#kadepModal"
                value={displayLov.pic2Bad}
                onChange={handleChange}
                onClick={() => (activeModalFor.current = "pic2Bad")}
              />
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
                      {role === "ROL01" ? (
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
