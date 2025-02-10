import React, { useState, useRef, useEffect } from "react";
import PageTitleNav from "../../../part/PageTitleNav";
import InputField from "../../../part/InputField";
import HeaderForm from "../../../part/HeaderText";
import Button from "../../../part/Button";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import SweetAlert from "../../../util/SweetAlert";
import { useIsMobile } from "../../../util/useIsMobile";
import { API_LINK, AUDIT_FILE_LINK } from "../../../util/Constants";
import { useFetch } from "../../../util/useFetch";
import TextArea from "../../../part/TextArea";
import Loading from "../../../part/Loading";
import DetailData from "../../../part/DetailData";
import FileUploadMulti from "../../../part/FileUploadMulti";
import Icon from "../../../part/Icon";
import FileUpload from "../../../part/FileUpload";
import { uploadFile } from "../../../util/UploadFile";
import { decodeHtml } from "../../../util/DecodeHtml";

export default function EditAnalisaTemuan({ onChangePage }) {
  const isMobile = useIsMobile();
  const title = "Detail Analisa Temuan";
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const idData = location.state?.idData;
  const idAnalisa = location.state?.idAnalisa;
  const [result, setResult] = useState("");

  const [formData, setFormData] = useState({
    id: idData,
    problem: "",
    why1: "",
    why2: "",
    why3: "",
    why4: "",
    why5: "",
    penyebab: "",
    perbaikan: "",
    pencegahan: "",
    deadline: "",
  });

  useEffect(() => {
    const fetchPertanyaan = async () => {
      const body = {
        idData: idData,
      };
      setLoading(true);

      try {
        setResult(
          await useFetch(
            `${API_LINK}/TransaksiAnalisaTemuan/GetAnalisaTemuanById`,
            body,
            "POST"
          )
        );
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPertanyaan();
  }, [idData]);

  useEffect(() => {
    if (result && result.length > 0) {
      setFormData({
        id: idData,
        problem: decodeHtml(result[0].problem || ""),
        why1: result[0].why1 || "",
        why2: result[0].why2 || "",
        why3: result[0].why3 || "",
        why4: result[0].why4 || "",
        why5: result[0].why5 || "",
        penyebab: decodeHtml(result[0].akarmasalah || ""),
        perbaikan: decodeHtml(result[0].perbaikan || ""),
        pencegahan: decodeHtml(result[0].pencegahan || ""),
        deadline: result[0].TglRencanaTemuan?.split("T")[0] || "",
        file: result[0].berkasPendukung || "",
      });
    }
  }, [result, idData]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => {
      const updatedData = {
        ...prevData,
        [name]: value,
      };

      return updatedData;
    });
  };

  const [selectedFile, setSelectedFile] = useState(null);
  const handleFileChange = (file) => {
    setSelectedFile(file);
  };

  const problemRef = useRef();
  const why1Ref = useRef();
  const deadlineRef = useRef();
  const fileRef = useRef();
  const penyebabRef = useRef();
  const pencegahanRef = useRef();
  const perbaikanRef = useRef();

  const handleSubmit = async () => {
    const refs = [
      problemRef,
      why1Ref,
      deadlineRef,
      penyebabRef,
      pencegahanRef,
      perbaikanRef,
    ];

    for (let ref of refs) {
      const isValid = ref.current?.validate();
      if (!isValid) {
        ref.current?.focus();
        return; // Jika ada yang tidak valid, berhenti di sini
      }
    }

    let uploadedFile = formData.file || "";

    if (selectedFile) {
      const folderName = "Audit";
      const filePrefix = selectedFile.name
        .replace(/\.[^/.]+$/, "")
        .replace(/\s+/g, "_");

      const uploadResult = await uploadFile(
        selectedFile,
        folderName,
        filePrefix
      );
      uploadedFile = uploadResult[0];
    }

    const updatedData = { ...formData, file: uploadedFile };

    setLoading(true);
    try {
      const createResponse = await useFetch(
        `${API_LINK}/TransaksiAnalisaTemuan/EditAnalisaTemuan`,
        updatedData,
        "POST"
      );

      if (createResponse === "ERROR") {
        throw new Error("Gagal menambah data");
      } else {
        SweetAlert(
          "Berhasil!",
          "Analisa Temuan berhasil ditambahkan.",
          "success",
          "OK"
        ).then(() =>
          onChangePage("analisaTemuan", {
            idData: idAnalisa,
            breadcrumbs: location.state.breadcrumbs,
          })
        );
      }
    } catch (error) {
      console.error("Error:", error.message);
      SweetAlert("Gagal!", error.message, "error", "OK");
    } finally {
      setLoading(false);
    }
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
              onClick={() =>
                onChangePage("analisaTemuan", {
                  idData: idAnalisa,
                  breadcrumbs: location.state.breadcrumbs,
                })
              }
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
              <HeaderForm label="Formulir Analisa Temuan" />

              {result.length > 0 && (
                <>
                  <div className="border bg-white rounded mt-5 mb-5">
                    <div
                      className="ps-3 rounded"
                      style={{ backgroundColor: "#2654A1", fontSize: "1.5rem" }}
                    >
                      <strong className="text-white">Temuan </strong>
                    </div>

                    <div className="p-3">
                      <DetailData
                        label="Pertanyaan"
                        isi={result[0].pertanyaan}
                      />
                      <DetailData
                        label="Pertanyaan Lanjutan"
                        isi={result[0].pertanyaanLanjutan || "-"}
                      />

                      <DetailData
                        label="Jawaban"
                        isi={result[0].jawaban || "-"}
                      />
                      <DetailData
                        label="Jawaban"
                        isi={result[0].jawabanLanjutan || "-"}
                      />
                      {result[0]?.berkasDokumen ? (
                        <FileUploadMulti
                          label="Berkas Pendukung Jawaban"
                          forInput="upload-file"
                          formatFile=".pdf, .docx, .xlsx, .zip"
                          initialFiles={
                            [
                              result[0].berkasDokumen
                                .split(",")
                                .map((file) => file.replace(/"/g, "").trim()),
                            ] || []
                          }
                          isRequired={true}
                          mode="tidak"
                        />
                      ) : (
                        []
                      )}

                      <DetailData
                        label="Temuan"
                        isi={result[0].temuan || "-"}
                      />
                      <DetailData label="Saran" isi={result[0].saran || "-"} />
                    </div>
                  </div>
                </>
              )}

              <div className="border bg-white rounded mt-5 mb-5">
                <div
                  className="ps-3 rounded"
                  style={{ backgroundColor: "#2654A1", fontSize: "1.5rem" }}
                >
                  <strong className="text-white">Analisa Temuan</strong>
                </div>

                <div className="p-3">
                  {" "}
                  <TextArea
                    ref={problemRef}
                    label="Problem"
                    value={formData.problem || ""}
                    onChange={handleChange}
                    isRequired={true}
                    name="problem"
                  />
                  <InputField
                    ref={why1Ref}
                    label="Why"
                    value={formData.why1}
                    onChange={handleChange}
                    isRequired={true}
                    id="why1"
                    type="text"
                  />
                  <Icon
                    type="full"
                    name="down"
                    ukuran="2rem"
                    cssClass="text-secondary d-flex justify-content-center align-items-center"
                    title="Riwayat Pembaruan"
                  />
                  <InputField
                    label="Why"
                    value={formData.why2}
                    onChange={handleChange}
                    id="why2"
                    type="text"
                  />
                  <Icon
                    type="full"
                    name="down"
                    ukuran="2rem"
                    cssClass="text-secondary d-flex justify-content-center align-items-center"
                    title="Riwayat Pembaruan"
                  />
                  <InputField
                    label="Why"
                    value={formData.why3}
                    onChange={handleChange}
                    id="why3"
                    type="text"
                  />
                  <Icon
                    type="full"
                    name="down"
                    ukuran="2rem"
                    cssClass="text-secondary d-flex justify-content-center align-items-center"
                    title="Riwayat Pembaruan"
                  />
                  <InputField
                    label="Why"
                    value={formData.why4}
                    onChange={handleChange}
                    id="why4"
                    type="text"
                  />
                  <Icon
                    type="full"
                    name="down"
                    ukuran="2rem"
                    cssClass="text-secondary d-flex justify-content-center align-items-center"
                    title="Riwayat Pembaruan"
                  />
                  <InputField
                    label="Why"
                    value={formData.why5}
                    onChange={handleChange}
                    id="why5"
                    type="text"
                  />
                  <TextArea
                    ref={penyebabRef}
                    label="Akar Penyebab Masalah"
                    value={formData.penyebab || ""}
                    onChange={handleChange}
                    isRequired={true}
                    name="penyebab"
                  />
                  <TextArea
                    ref={perbaikanRef}
                    label="Tindakan Perbaikan"
                    value={formData.perbaikan || ""}
                    onChange={handleChange}
                    isRequired={true}
                    name="perbaikan"
                  />
                  <TextArea
                    ref={pencegahanRef}
                    label="Tindakan Pencegahan"
                    value={formData.pencegahan || ""}
                    onChange={handleChange}
                    isRequired={true}
                    name="pencegahan"
                  />
                  <div className="row">
                    <div className="col-6">
                      <InputField
                        ref={deadlineRef}
                        label="Tanggal Deadline Penyelesaian"
                        value={formData.deadline}
                        onChange={handleChange}
                        id="deadline"
                        type="date"
                        min={new Date().toISOString().split("T")[0]}
                        isRequired={true}
                      />
                    </div>
                    <div className="col-6">
                      <FileUpload
                        ref={fileRef}
                        label="Berkas Pendukung"
                        forInput="upload-file"
                        formatFile=".pdf, .xlsx, .zip, .word"
                        onChange={(file) => handleFileChange(file)}
                        hasExisting={
                          formData.file
                            ? `${AUDIT_FILE_LINK}${formData.file}`
                            : undefined
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>

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
                      onChangePage("analisaTemuan", {
                        idData: idAnalisa,
                        breadcrumbs: location.state.breadcrumbs,
                      })
                    }
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
