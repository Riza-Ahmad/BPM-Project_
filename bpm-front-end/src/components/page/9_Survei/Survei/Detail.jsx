import React, { useState, useRef } from "react";
import PageTitleNav from "../../../part/PageTitleNav";
import InputField from "../../../part/InputField";
import TextArea from "../../../part/TextArea";
import HeaderForm from "../../../part/HeaderText";
import Button from "../../../part/Button";
import { API_LINK } from "../../../util/Constants";
import SweetAlert from "../../../util/SweetAlert";
import { useIsMobile } from "../../../util/useIsMobile";

export default function Detail({ onChangePage }) {
  const title = "Detail Survei";
  const breadcrumbs = [
    { label: "Survei", href: "/survei/survei" },
    { label: "Detail Survei" }
  ];
  const isMobile = useIsMobile();
//   const [isiBerita, setIsiBerita] = useState("");

//   const [formData, setFormData] = useState({
//     judul: "",
//     penulis: "",
//     tanggal: "",
//     isi: "",
//   });

//   const [images, setImages] = useState([]);

//   // Refs untuk validasi
//   const judulRef = useRef();
//   const penulisRef = useRef();
//   const tanggalRef = useRef();
//   const isiRef = useRef();
//   const fotoRef = useRef();

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   const handleUploadChange = (updatedFiles) => {
//     setImages(updatedFiles);
//   };

//   const handleSubmit = async () => {
//     const isJudulValid = judulRef.current?.validate();
//     const isPenulisValid = penulisRef.current?.validate();
//     const isTanggalValid = tanggalRef.current?.validate();
//     const isIsiValid = isiRef.current?.validate();
//     const isFotoValid = fotoRef.current?.validate();

//     if (!isJudulValid) {
//       judulRef.current?.focus();
//       return;
//     }
//     if (!isPenulisValid) {
//       penulisRef.current?.focus();
//       return;
//     }
//     if (!isTanggalValid) {
//       tanggalRef.current?.focus();
//       return;
//     }
//     if (!isIsiValid) {
//       isiRef.current?.focus();
//       return;
//     }
//     if (!isFotoValid) {
//       fotoRef.current?.focus();
//       return;
//     }

//     try {
//       // Upload foto
//       const formData = new FormData();
//       images.forEach((file) => formData.append("files", file));

//       const uploadResponse = await fetch(
//         `${API_LINK}/MasterBerita/UploadFiles`,
//         {
//           method: "POST",
//           body: formData,
//         }
//       );

//       if (!uploadResponse.ok) {
//         throw new Error("Gagal mengunggah gambar");
//       }

//       const uploadedFileNames = await uploadResponse.json();

//       const beritaData = {
//         ber_judul: judulRef.current.value,
//         ber_tgl: tanggalRef.current.value,
//         ber_isi: isiBerita,
//         ber_status: 1,
//         ber_created_by: penulisRef.current.value,
//         ber_penulis: penulisRef.current.value,
//         fotoList: uploadedFileNames,
//       };

//       console.log(beritaData);

//       const createResponse = await fetch(
//         `${API_LINK}/MasterBerita/CreateBerita`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(beritaData),
//         }
//       );

//       if (!createResponse.ok) {
//         throw new Error("Gagal menambahkan berita");
//       }

//       SweetAlert(
//         "Berhasil!",
//         "Data berhasil ditambahkan.",
//         "success",
//         "OK"
//       ).then(() => onChangePage("read"));
//     } catch (error) {
//       console.error("Error:", error.message);
//       SweetAlert("Gagal!", error.message, "error", "OK");
//     }
//   };

//   const handleIsiChange = (e) => {
//     setIsiBerita(e.target.value);
//   };

  return (
    <div className="d-flex flex-column min-vh-100">
      <main className="flex-grow-1 p-3" style={{ marginTop: "80px" }}>
        <div className="d-flex flex-column">
          <PageTitleNav
            title={title}
            breadcrumbs={breadcrumbs}
            onClick={() => onChangePage("index")}
          />
          <div className={isMobile ? "m-0" : "m-3"}>
            <div
              className={
                isMobile
                  ? "shadow p-4 m-2 mt-0 bg-white rounded"
                  : "shadow p-5 m-5 mt-0 bg-white rounded"
              }
            >
              <HeaderForm label="Detail Survei" />
              <div className="row">
                <div className="col-lg-6 col-md-6">
                  <InputField

                  />
                  <InputField
                   
                  />
                </div>
                <div className="col-lg-6 col-md-6">
                  <InputField
                  
                  />
                </div>
              </div>
              <TextArea

              />

              <div className="d-flex justify-content-between align-items-center">
                <div className="flex-grow-1 m-2">
                  <Button
                    classType="danger"
                    type="button"
                    label="Batal"
                    width="100%"
                    onClick="#"
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