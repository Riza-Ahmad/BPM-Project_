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
import Loading from "../../../part/Loading";
import TabTemuan from "./TabTemuan";
import { uploadFile } from "../../../util/UploadFile";

export default function EditTemuan({ onChangePage }) {
  const isMobile = useIsMobile();

  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const idData = location.state?.idData;
  const title = location.state?.instrumen;

  const [kriteria, setKriteria] = useState([]);

  useEffect(() => {
    const fetchKriteria = async () => {
      setLoading(true);
      try {
        const data = await useFetch(
          `${API_LINK}/TransaksiSelfAssessment/GetDataKriteriaSAById`,
          { id: idData },
          "POST"
        );

        setKriteria(data);
      } catch (err) {
        setError("Gagal mengambil data: " + err);
      } finally {
        setLoading(false);
      }
    };

    fetchKriteria();
  }, []);

  const [pertanyaan, setPertanyaan] = useState({});

  useEffect(() => {
    const fetchPertanyaan = async () => {
      setLoading(true);
      try {
        const data = await useFetch(
          `${API_LINK}/TransaksiSelfAssessment/GetDataPertanyaanSAById`,
          { id: idData },
          "POST"
        );

        setPertanyaan(data);
      } catch (err) {
        setError("Gagal mengambil data: " + err);
      } finally {
        setLoading(false);
      }
    };

    fetchPertanyaan();
  }, []);

  const [formData, setFormData] = useState({});
  const [files, setFiles] = useState({});

  const handleDataChange = (updatedFormData, updatedFiles) => {
    setFormData(updatedFormData);
    setFiles(updatedFiles);

    console.log(updatedFormData);
  };

  const handleSubmit = async () => {
    for (const [key, value] of Object.entries(formData)) {
      const updatedObject = {
        id: Number(key),
        namaTemuan: value.namaTemuan,
        kategoriTemuan: value.kategoriTemuan,
        saran: value.saran,
        idSea: idData,
      };

      console.log(updatedObject);

      const createResponse = await useFetch(
        `${API_LINK}/TransaksiTemuan/EditTemuan`,
        updatedObject
      );
      if (createResponse === "ERROR") {
        throw new Error("Gagal menambah data");
      }
    }

    SweetAlert("Berhasil!", "Data berhasil diperbarui.", "success", "OK").then(
      () => onChangePage("index")
    );
  };

  if (loading) return <Loading />;
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
              <HeaderForm label="Formulir Temuan" />

              <div className="border bg-white rounded mt-5 p-3">
                {pertanyaan && pertanyaan.length > 0 ? (
                  <>
                    <p>
                      Terakhir Diperbarui Oleh :{" "}
                      <strong>{pertanyaan[0].dimodifOleh || ""}</strong>
                    </p>
                    <p>
                      Pada :{" "}
                      <strong>
                        {pertanyaan[0].dimodifTgl
                          ? (() => {
                              const modifiedDate = new Date(
                                pertanyaan[0].dimodifTgl
                              );
                              if (isNaN(modifiedDate)) return "-";
                              return (
                                modifiedDate.toLocaleDateString("id-ID", {
                                  weekday: "long",
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric",
                                }) +
                                " " +
                                modifiedDate.toLocaleTimeString("id-ID", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }) +
                                " WIB"
                              );
                            })()
                          : "-"}
                      </strong>
                    </p>
                  </>
                ) : (
                  <p>Data pertanyaan tidak tersedia.</p>
                )}
              </div>

              <TabTemuan
                header={kriteria}
                pertanyaan={pertanyaan}
                onDataChange={handleDataChange}
              />

              <div className="d-flex justify-content-between align-items-center">
                <div className="flex-grow-1 m-2">
                  <Button
                    classType="primary"
                    type="button"
                    label="Simpan"
                    width="100%"
                    onClick={handleSubmit}
                    isDisabled={Object.keys(formData).length === 0}
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
      </main>
    </div>
  );
}
