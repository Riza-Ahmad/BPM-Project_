import React, { useState, useEffect, useRef } from "react";
import PageTitleNav from "../../part/PageTitleNav";
import InputField from "../../part/InputField";
import HeaderForm from "../../part/HeaderText";
import Dropdown from "../../part/Dropdown";
import { useLocation } from "react-router-dom";
import { API_LINK } from "../../util/Constants";
import Button from "../../part/Button";
import SweetAlert from "../../util/SweetAlert";
import { useIsMobile } from "../../util/useIsMobile";
import { useFetch } from "../../util/useFetch";
import Loading from "../../part/Loading";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toISOString().split("T")[0]; // Mengambil hanya bagian tanggal
};

export default function Edit({ onChangePage }) {
  const isMobile = useIsMobile();
  const [error, setError] = useState(null);

  const location = useLocation();
  const idMenu = location.state?.idMenu;
  const idData = location.state?.idData;
  const [loading, setLoading] = useState(true); // New loading state
  const [title, setTitle] = useState("");
  const [titleHeader, setTitleHeader] = useState("");
  const [breadcrumbs, setBreadcrumbs] = useState([]);
  const [formData, setFormData] = useState({
    idDok: "",
    judulDokumen: "",
    nomorInduk: "",
    tahunDokumen: "",
    tahunKadaluarsa: "",
    jenisDokumen: "",
  });

  // Refs for validation
  const judulDokumenRef = useRef();
  const nomorIndukRef = useRef();
  const tahunDokumenRef = useRef();
  const jenisDokumenRef = useRef();
  const tahunKadaluarsaRef = useRef();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await useFetch(
          `${API_LINK}/MasterPeraturan/GetDataPeraturanById`,
          {
            idData: idData,
          },
          "POST"
        );
        if (data.length > 0) {
          // Mengubah format tanggal untuk tahunDokumen dan tahunKadaluarsa
          setFormData({
            idDok: data[0].idDok || "",
            judulDokumen: data[0].judulDokumen || "",
            nomorInduk: data[0].nomorInduk || "",
            tahunDokumen: formatDate(data[0].tahunDokumen) || "", // Memformat tanggal
            tahunKadaluarsa: formatDate(data[0].tahunKadaluarsa) || "", // Memformat tanggal
            jenisDokumen: data[0].jenisDokumen || "",
          });
        }
      } catch (error) {
        setError("Gagal mengambil data kegiatan");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [location.state]);

  useEffect(() => {
    let newTitle = "";
    let newTitleHeader = "";
    let newBreadcrumbs = [];

    if (idMenu === 39) {
      newTitle = "Edit Peraturan";
      newTitleHeader = "Formulir Kebijakan Peraturan";
      newBreadcrumbs = [
        {
          label: "Peraturan",
          href: "/peraturan/kebijakan",
        },
        {
          label: "Kebijakan Peraturan",
          href: "/peraturan/kebijakan",
        },
        {
          label: "Edit Kebijakan Peraturan",
          href: "",
        },
      ];
    } else if (idMenu === 40) {
      newTitle = "Edit Peraturan Eksternal";
      newTitleHeader = "Formulir Peraturan Eksternal";
      newBreadcrumbs = [
        {
          label: "Peraturan",
          href: "/peraturan/eksternal",
        },
        {
          label: "Peraturan Eksternal",
          href: "/peraturan/eksternal",
        },
        { label: "Edit Peraturan Eksternal", href: "" },
      ];
    } else if (idMenu === 41) {
      newTitle = "Edit Instrumen APS";
      newTitleHeader = "Formulir Instrumen APS";
      newBreadcrumbs = [
        { label: "Peraturan", href: "/peraturan/aps" },
        {
          label: "instrumen APS",
          href: "/peraturan/aps",
        },
        { label: "Edit Instrumen APS", href: "" },
      ];
    }

    setTitle(newTitle);
    setTitleHeader(newTitleHeader);
    setBreadcrumbs(newBreadcrumbs);

    setLoading(false);
  }, [idMenu]);

  const handleSubmit = async () => {
    if (!judulDokumenRef.current?.validate()) {
      judulDokumenRef.current?.focus();
      return;
    }
    if (!nomorIndukRef.current?.validate()) {
      nomorIndukRef.current?.focus();
      return;
    }
    if (!tahunDokumenRef.current?.validate()) {
      tahunDokumenRef.current?.focus();
      return;
    }
    if (!jenisDokumenRef.current?.validate()) {
      jenisDokumenRef.current?.focus();
      return;
    }
    if (!tahunKadaluarsaRef.current?.validate()) {
      tahunKadaluarsaRef.current?.focus();
      return;
    }

    setFormData((prevData) => {
      setLoading(true);
      useFetch(`${API_LINK}/MasterPeraturan/EditPeraturan`, formData, "POST")
        .then((response) => {
          if (response === "ERROR") {
            throw new Error("Gagal memperbarui data");
          }
          SweetAlert(
            "Berhasil!",
            "Data berhasil diperbarui.",
            "success",
            "OK"
          ).then(() => onChangePage("index", { idMenu: idMenu }));
        })
        .catch((error) => {
          SweetAlert("Gagal!", error.message, "error", "OK");
        })
        .finally(() => {
          setLoading(false);
        });

      return formData;
    });
  };

  if (loading) return <Loading />;

  return (
    <div className="d-flex flex-column min-vh-100">
      <main className="flex-grow-1 p-3" style={{ marginTop: "80px" }}>
        <div className="d-flex flex-column">
          <div className={isMobile ? "m-0" : "m-3"}>
            <PageTitleNav
              title={title}
              breadcrumbs={breadcrumbs}
              onClick={() => onChangePage("index", { idMenu: idMenu })}
            />
          </div>

          <div
            className={
              isMobile
                ? "shadow p-4 m-2 mt-0 bg-white rounded"
                : "shadow p-5 m-5 mt-0 bg-white rounded"
            }
          >
            <HeaderForm label={titleHeader} />
            <div className="row">
              <InputField
                ref={judulDokumenRef}
                label="Judul Dokumen"
                value={formData.judulDokumen || ""}
                onChange={(e) =>
                  setFormData({ ...formData, judulDokumen: e.target.value })
                }
                isRequired={true}
              />
            </div>
            <div className="row">
              <div className="col-lg-6 col-md-6">
                <InputField
                  ref={nomorIndukRef}
                  label="Nomor Induk Dokumen"
                  value={formData.nomorInduk || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, nomorInduk: e.target.value })
                  }
                  isRequired={true}
                />
              </div>
              <div className="col-lg-6 col-md-6">
                <InputField
                  ref={tahunDokumenRef}
                  type="date"
                  label="Tahun Dokumen"
                  value={formData.tahunDokumen}
                  onChange={(e) =>
                    setFormData({ ...formData, tahunDokumen: e.target.value })
                  }
                  isRequired={true}
                />
              </div>
              <div className="col-lg-6 col-md-6">
                <Dropdown
                  ref={jenisDokumenRef}
                  type="pilih"
                  forInput="jenisDokumen"
                  value={formData.jenisDokumen}
                  label="Jenis Dokumen"
                  isRequired={true}
                  arrData={[
                    { Text: "Controlled Copy", Value: "Controlled Copy" },
                    { Text: "Uncontrolled Copy", Value: "Uncontrolled Copy" },
                  ]}
                  onChange={(e) =>
                    setFormData({ ...formData, jenisDokumen: e.target.value })
                  }
                />
              </div>
              <div className="col-lg-6 col-md-6">
                <InputField
                  ref={tahunKadaluarsaRef}
                  type="date"
                  label="Tahun Kadaluarsa"
                  value={formData.tahunKadaluarsa}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      tahunKadaluarsa: e.target.value,
                    })
                  }
                  isRequired={true}
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
                  onClick={() => {
                    onChangePage("index", { idMenu: idMenu });
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
