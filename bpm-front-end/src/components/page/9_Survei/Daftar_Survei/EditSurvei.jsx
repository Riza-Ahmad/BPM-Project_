import React, { useState, useEffect } from "react";
import PageTitleNav from "../../../part/PageTitleNav";
import DetailData from "../../../part/DetailData";
import HeaderForm from "../../../part/HeaderText";
import Button from "../../../part/Button";
import Loading from "../../../part/Loading";
import { API_LINK } from "../../../util/Constants";
import { useIsMobile } from "../../../util/useIsMobile";
import { useFetch } from "../../../util/useFetch";
import SweetAlert from "../../../util/SweetAlert";
import { useLocation, useNavigate } from "react-router-dom";
import TabPreviewSurvei from "./TabPreviewSurvei";
import Cookies from "js-cookie";

export default function EditSurvei({ onChangePage }) {
  const activeUser = Cookies.get("activeUser");
  let role = ""; // Jika undefined, gunakan nilai default
  let roleNama = "";
  let namaPengguna = "";
  let username = "";
  if (activeUser) {
    role = JSON.parse(activeUser).RoleID.slice(0, 5);
    roleNama = JSON.parse(activeUser).Role;
    namaPengguna = JSON.parse(activeUser).Nama;
    username = JSON.parse(activeUser).username;
  }
  const title = "Daftar Survei";
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    idTransaksi: "",
    namaTemplateSurvei: "",
    kataPembuka: "",
    kataPenutup: "",
    tanggalAwal: "",
    tanggalAkhir: "",
    dibuatOleh: "",
    dibuatTanggal: "",
    diubahOleh: "",
    diubahTanggal: "",
    statusTransaksi: "",
  });

  const idData = location.state?.idData;

  // Track when template fetch is completed
  const [isTemplateFetched, setIsTemplateFetched] = useState(false);
  const [kriteria, setKriteria] = useState([]);
  const [pertanyaan, setPertanyaan] = useState({});

  // GET DATA BY ID
  useEffect(() => {
    const fetchKriteria = async () => {
      setLoading(true);
      try {
        const data = await useFetch(
          `${API_LINK}/TransaksiSurvei/GetDataKriteriaTransaksiSurveiByIdxx`,
          { id: idData },
          "POST"
        );
        console.log("Kriteria Survei :", data);
        setKriteria(data);
      } catch (err) {
        setError("Gagal mengambil data: " + err);
      } finally {
        setLoading(false);
      }
    };

    fetchKriteria();
  }, []);

  useEffect(() => {
    const fetchPertanyaan = async () => {
      setLoading(true);
      try {
        console.log("Hallo Pertanyaan :", { id: idData, nama: username });
        const data = await useFetch(
          `${API_LINK}/TransaksiSurvei/GetDataPertanyaanTransaksiSurveiByIdxx`,
          { id: idData, nama: username },
          "POST"
        );

        console.log("Pertanyaan Survei :", data);
        setPertanyaan(data);
      } catch (err) {
        setError("Gagal mengambil data: " + err);
      } finally {
        setLoading(false);
      }
    };

    fetchPertanyaan();
  }, []);

  useEffect(() => {
    const fetchTemplateData = async () => {
      const body = { idData: idData };
      setLoading(true);

      try {
        const result = await useFetch(
          `${API_LINK}/TransaksiSurvei/GetDataTransaksiSurveiByIdxx`,
          body,
          "POST"
        );
        console.log("Transaksi Survei: ", result);
        if (result === "ERROR" || result === null || result.length === 0) {
          setFormData({
            idTransaksi: "",
            namaTemplateSurvei: "",
            kataPembuka: "",
            kataPenutup: "",
            tanggalAwal: "",
            tanggalAkhir: "",
            dibuatOleh: "",
            dibuatTanggal: "",
            diubahOleh: "",
            diubahTanggal: "",
            statusTransaksi: "",
          });
        } else {
          const fetchedData = result[0];
          setFormData({
            idTransaksi: fetchedData.idTransaksi,
            namaTemplateSurvei: fetchedData.namaTemplateSurvei,
            kataPembuka: fetchedData.kataPembuka,
            kataPenutup: fetchedData.kataPenutup,
            tanggalAwal: new Date(fetchedData.tanggalAwal).toLocaleDateString(
              "id-ID",
              {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              }
            ),
            tanggalAkhir: fetchedData.tanggalAkhir || "-",
            dibuatOleh: fetchedData.dibuatOleh,
            dibuatTanggal: new Date(
              fetchedData.dibuatTanggal
            ).toLocaleDateString("id-ID", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            }),
            diubahOleh: fetchedData.diubahOleh || "-",
            diubahTanggal: fetchedData.dimodifTgl
              ? new Date(fetchedData.diubahTanggal).toLocaleDateString(
                  "id-ID",
                  {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  }
                )
              : "-",
            statusTransaksi: fetchedData.statusTransaksi || "-",
          });
        }
      } catch (err) {
        setError("Gagal mengambil data: " + err);
      } finally {
        setLoading(false);
        setIsTemplateFetched(true); // Mark as fetched
      }
    };

    fetchTemplateData();
  }, [idData]);
  const [formDataTab, setFormDataTab] = useState({});

  const handleDataChange = (updatedFormData, updatedFiles) => {
    setFormDataTab(updatedFormData);
  };

  const handleSubmit = async () => {
    console.log("Data Tab: ", formDataTab);
    console.log("Data Pertanyaan: ", pertanyaan);

    // Ambil semua idDetailJawabanSurvei dari pertanyaan
    const requiredIds = pertanyaan.map((p) => p.idDetailJawabanSurvei);

    // Cari ID yang tidak memiliki jawaban atau jawabannya kosong
    const missingIds = requiredIds.filter((id) => {
      const jawaban = formDataTab[id]?.jawaban;

      // Jika jawaban tidak ada (undefined/null), tandai sebagai belum diisi
      if (jawaban === undefined || jawaban === null) return true;

      // Jika jawaban adalah array, pastikan arraynya tidak kosong
      if (Array.isArray(jawaban)) return jawaban.length === 0;

      // Jika jawaban adalah string, pastikan tidak hanya whitespace
      if (typeof jawaban === "string") return jawaban.trim() === "";

      return false; // Jika format lain, anggap sudah terisi
    });

    if (missingIds.length > 0) {
      SweetAlert(
        "Peringatan!",
        "Semua pertanyaan harus diisi sebelum menyimpan.",
        "warning",
        "OK"
      );
      return;
    }

    setLoading(true);

    try {
      const createResponse = await useFetch(
        `${API_LINK}/TransaksiSurvei/UpdateDaftarSurveiByUserxx`,
        { idTransaksi: formData.idTransaksi }
      );

      if (createResponse === "ERROR") {
        throw new Error("Gagal menambah data");
      }

      await Promise.all(
        Object.entries(formDataTab).map(async ([key, value]) => {
          const updatedObject = {
            id: Number(key),
            jawaban: value.jawaban,
          };
          console.log("Data Ke- ", updatedObject);

          const createResponseJawaban = await useFetch(
            `${API_LINK}/TransaksiSurvei/UpdateDaftarSurveiJawabanByUserxx`,
            updatedObject
          );
          if (createResponseJawaban === "ERROR") {
            throw new Error("Gagal menambah data");
          }
        })
      );

      setLoading(false);
      SweetAlert(
        "Berhasil!",
        "Data berhasil diperbarui.",
        "success",
        "OK"
      ).then(() => onChangePage("index"));
    } catch (error) {
      setLoading(false);
      SweetAlert("Error!", error.message, "error", "OK");
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
              <HeaderForm label={formData.namaTemplateSurvei} />

              <div className="border bg-white rounded mt-5 p-3">
                <div className="row">
                  <div className="col-lg-6 col-md-6">
                    <DetailData
                      label="Kata Pembuka"
                      isi={formData.kataPembuka}
                    />
                  </div>
                  <div className="col-lg-6 col-md-6">
                    <DetailData
                      label="Kata Penutup"
                      isi={formData.kataPenutup}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-6 col-md-6">
                    <DetailData
                      label="Tanggal Mulai Survei"
                      isi={formData.tanggalAwal}
                    />
                  </div>
                  <div className="col-lg-6 col-md-6">
                    <DetailData
                      label="Tanggal Akhir Survei"
                      isi={formData.tanggalAkhir}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-6 col-md-6">
                    <DetailData label="Dibuat Oleh" isi={formData.dibuatOleh} />
                  </div>
                  <div className="col-lg-6 col-md-6">
                    <DetailData
                      label="Dibuat Tanggal"
                      isi={formData.dibuatTanggal}
                    />
                  </div>
                </div>
              </div>
              <TabPreviewSurvei
                header={kriteria}
                pertanyaan={pertanyaan}
                onDataChange={handleDataChange}
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
