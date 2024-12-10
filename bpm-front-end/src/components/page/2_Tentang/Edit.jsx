import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import PageTitleNav from "../../part/PageTitleNav";
import TextArea from "../../part/TextArea";
import HeaderForm from "../../part/HeaderText";
import Button from "../../part/Button";
import DetailData from "../../part/DetailData";
import { API_LINK, TENTANGFILE_LINK } from "../../util/Constants";
import Loading from "../../part/Loading";
import FileUpload from "../../part/FileUpload";
import UploadFoto from "../../part/UploadFoto";
import SweetAlert from "../../util/SweetAlert";
import { useIsMobile } from "../../util/useIsMobile";

export default function Edit({ onChangePage }) {
  const location = useLocation();
  const isMobile = useIsMobile();

  const [formData, setFormData] = useState({
    Kategori: "",
    Isi: "",
    Createby: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    if (location.state?.idData) {
      const editId = location.state.idData;
      setLoading(true);
      fetch(API_LINK + `/MasterTentang/GetDataTentangById`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ten_id: editId }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data && data.length > 0) {
            setFormData({
              Kategori: data[0].ten_category,
              Isi: data[0].ten_isi,
              Createby: data[0].ten_created_by,
            });
          }
        })
        .catch((error) => console.error("Error fetching data:", error))
        .finally(() => setLoading(false));
    }
  }, [location.state?.idData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (file) => {
    setSelectedFile(file); // Store file in state
  };

  const renderContent = () => {
    const id = location.state?.idData;

    if (id === 7) {
      return (
        <UploadFoto
          id="upload-foto"
          label="Upload Foto"
          onChange={(file) => handleFileChange(file)}
          hasExisting={TENTANGFILE_LINK + formData.Isi}
          isRequired="true"
        />
      );
    } else if (id === 8) {
      return (
        <FileUpload
          label="Upload File"
          forInput="upload-file"
          formatFile=".pdf"
          onChange={(file) => handleFileChange(file)}
          hasExisting={TENTANGFILE_LINK + formData.Isi}
          isRequired="true"
        />
      );
    } else {
      return (
        <TextArea
          label="Isi"
          name="Isi"
          initialValue={formData.Isi}
          onChange={handleInputChange}
          isRequired="true"
        />
      );
    }
  };

  const handleSubmit = async () => {
    const currentTimestamp = new Date().toISOString();
    setLoading(true);

    try {
      let ten_isi = formData.Isi;

      // Upload file jika ada file yang dipilih
      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);

        const uploadResponse = await fetch(
          `${API_LINK}/MasterTentang/UploadFile`,
          {
            method: "POST",
            body: formData,
            headers: {
              Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
            },
          }
        );

        if (!uploadResponse.ok) {
          throw new Error("Gagal mengunggah file");
        }

        const uploadResult = await uploadResponse.json();
        ten_isi = uploadResult.hasil || ten_isi; // Gunakan nama file yang diunggah
      }

      // Kirim data edit ke server
      const editData = {
        ten_id: location.state.idData,
        ten_category: formData.Kategori,
        ten_isi,
        ten_status: 1,
        ten_modif_by: "User",
        ten_modif_date: currentTimestamp,
      };

      const editResponse = await fetch(
        `${API_LINK}/MasterTentang/EditTentang`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editData),
        }
      );

      if (!editResponse.ok) {
        throw new Error("Gagal memperbarui data");
      }

      SweetAlert(
        "Berhasil!",
        "Data berhasil diperbarui.",
        "success",
        "OK"
      ).then(() => onChangePage("read"));
    } catch (error) {
      console.error("Error:", error.message);
      SweetAlert("Terjadi Kesalahan!", error.message, "error", "OK");
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
          <div className={isMobile ? "m-0" : "m-3"}>
            <PageTitleNav
              title="Edit Tentang"
              breadcrumbs={[
                { label: "Tentang", href: "/tentang" },
                { label: "Kelola Tentang", href: "/tentang/kelola" },
                { label: "Edit Tentang" },
              ]}
              onClick={() => onChangePage("read")}
            />
          </div>

          <div
            className={
              isMobile
                ? "shadow p-3 m-2 mt-0 bg-white rounded"
                : "shadow p-5 m-5 mt-0 bg-white rounded"
            }
          >
            <HeaderForm label="Formulir Tentang" />
            <div className="row">
              <DetailData label="Kategori" isi={formData.Kategori} />
            </div>
            {renderContent()}
            <div className="d-flex justify-content-between align-items-center">
              <div className="flex-grow-1 m-2">
                <Button
                  classType="primary"
                  type="button"
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
                  onClick={() => onChangePage("read")}
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      {loading && <Loading />}
    </div>
  );
}
