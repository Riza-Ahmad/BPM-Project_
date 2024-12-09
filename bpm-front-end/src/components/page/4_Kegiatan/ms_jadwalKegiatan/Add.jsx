import React, { useState, useRef, useEffect } from "react";
import PageTitleNav from "../../../part/PageTitleNav";
import InputField from "../../../part/InputField";
import TextArea from "../../../part/TextArea";
import HeaderForm from "../../../part/HeaderText";
import Button from "../../../part/Button";
import Loading from "../../../part/Loading";
import DropDown from "../../../part/Dropdown";
import { API_LINK } from "../../../util/Constants";
import SweetAlert from "../../../util/SweetAlert";
import { useIsMobile } from "../../../util/useIsMobile";

export default function Add({ onChangePage }) {
  const title = "Tambah Jadwal Kegiatan";
  const breadcrumbs = [
    { label: "Jadwal Kegiatan", href: "/kegiatan/jadwal" },
    { label: "Kelola Jadwal Kegiatan", href: "/kegiatan/jadwal/kelola" },
    { label: "Tambah Jadwal Kegiatan" },
  ];
  const isMobile = useIsMobile();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    place: "",
    jenisKegiatan: "",
  });

  const [jenisKegiatan, setJenisKegiatan] = useState([]);

  // Fetch jenis kegiatan data on component mount
  useEffect(() => {
    const fetchJenisKegiatan = async () => {
      try {
        const response = await fetch(
          `${API_LINK}/MasterKegiatan/GetDataJenisKegiatan`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({}),
          }
        );

        if (response.ok) {
          const data = await response.json();
          const formattedData = data.map((item) => ({
            Value: item.jkg_id, // ID untuk nilai dropdown
            Text: item.jkg_nama, // Nama untuk teks dropdown
          }));
          setJenisKegiatan(formattedData); // Menyimpan data ke state
        } else {
          throw new Error("Gagal mengambil data jenis kegiatan");
        }
      } catch (error) {
        setError(error.message); // Menangani error
      }
    };

    fetchJenisKegiatan();
  }, []);

  // Refs for validation
  const namaRef = useRef();
  const deskripsiRef = useRef();
  const tempatRef = useRef();
  const tglMulaiRef = useRef();
  const jamMulaiRef = useRef();
  const tglSelesaiRef = useRef();
  const jamSelesaiRef = useRef();
  const jenisKegiatanRef = useRef();

  const handleSubmit = async () => {
    console.log(formData.jenisKegiatan);
    if (!namaRef.current?.validate()) {
      namaRef.current?.focus();
      return;
    }
    if (!deskripsiRef.current?.validate()) {
      deskripsiRef.current?.focus();
      return;
    }
    if (!tempatRef.current?.validate()) {
      tempatRef.current?.focus();
      return;
    }
    if (!tglMulaiRef.current?.validate()) {
      tglMulaiRef.current?.focus();
      return;
    }
    if (!jamMulaiRef.current?.validate()) {
      jamMulaiRef.current?.focus();
      return;
    }
    if (!tglSelesaiRef.current?.validate()) {
      tglSelesaiRef.current?.focus();
      return;
    }
    if (!jamSelesaiRef.current?.validate()) {
      jamSelesaiRef.current?.focus();
      return;
    }

    if (!jenisKegiatanRef.current?.value === "") {
      jenisKegiatanRef.current?.focus();
      return;
    }

    // Combine date and time values into Date objects
    const startDate = new Date(
      `${tglMulaiRef.current.value} ${jamMulaiRef.current.value}`
    );
    const endDate = new Date(
      `${tglSelesaiRef.current.value} ${jamSelesaiRef.current.value}`
    );

    // Validate that start date is less than end date
    if (startDate >= endDate) {
      SweetAlert(
        "Gagal!",
        "Tanggal dan waktu mulai harus lebih awal dari tanggal dan waktu selesai.",
        "error",
        "OK"
      );
      return;
    }

    const kegiatanData = {
      keg_nama: formData.name,
      keg_deskripsi: formData.description,
      keg_tgl_mulai: formData.startDate,
      keg_jam_mulai: formData.startTime,
      keg_tgl_selesai: formData.endDate,
      keg_jam_selesai: formData.endTime,
      keg_tempat: formData.place,
      keg_created_by: "Admin",
      jkg_id: formData.jenisKegiatan,
    };

    setLoading(true);
    console.log(kegiatanData);
    try {
      const response = await fetch(
        `${API_LINK}/MasterKegiatan/CreateJadwalKegiatan`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(kegiatanData),
        }
      );

      if (response.ok) {
        SweetAlert(
          "Berhasil!",
          "Jadwal kegiatan berhasil dibuat.",
          "success",
          "OK"
        ).then(() => onChangePage("read"));
      } else {
        throw new Error("Gagal membuat jadwal kegiatan");
      }
    } catch (error) {
      SweetAlert("Gagal!", error.message, "error", "OK");
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
              title={title}
              breadcrumbs={breadcrumbs}
              onClick={() => onChangePage("read")}
            />
          </div>
          <div
            className={
              isMobile
                ? "shadow p-4 m-2 mt-0 bg-white rounded"
                : "shadow p-5 m-5 mt-0 bg-white rounded"
            }
          >
            <HeaderForm label="Formulir Jadwal Kegiatan" />
            <div className="row">
              <InputField
                ref={namaRef}
                label="Nama Kegiatan"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                isRequired={true}
                maxChar="100"
              />
              <div className="col-lg-6 col-md-6">
                <DropDown
                  ref={jenisKegiatanRef}
                  arrData={jenisKegiatan}
                  label="Jenis Kegiatan"
                  type="pilih"
                  forInput="jenisKegiatan"
                  value={formData.jenisKegiatan}
                  onChange={(e) =>
                    setFormData({ ...formData, jenisKegiatan: e.target.value })
                  }
                  isRequired={true}
                />
              </div>
              <div className="col-lg-6 col-md-6">
                <InputField
                  ref={tempatRef}
                  label="Tempat"
                  value={formData.place}
                  onChange={(e) =>
                    setFormData({ ...formData, place: e.target.value })
                  }
                  isRequired={true}
                  maxChar="50"
                />
              </div>
            </div>
            <div className="row">
              <div className="col-lg-6 col-md-6">
                <InputField
                  ref={tglMulaiRef}
                  label="Tanggal Mulai"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                  isRequired={true}
                  type="date"
                />
                <InputField
                  ref={jamMulaiRef}
                  label="Waktu Mulai"
                  value={formData.startTime}
                  onChange={(e) =>
                    setFormData({ ...formData, startTime: e.target.value })
                  }
                  isRequired={true}
                  type="time"
                />
              </div>
              <div className="col-lg-6 col-md-6">
                <InputField
                  ref={tglSelesaiRef}
                  label="Tanggal Selesai"
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData({ ...formData, endDate: e.target.value })
                  }
                  isRequired={true}
                  type="date"
                />
                <InputField
                  ref={jamSelesaiRef}
                  label="Waktu Selesai"
                  value={formData.endTime}
                  onChange={(e) =>
                    setFormData({ ...formData, endTime: e.target.value })
                  }
                  isRequired={true}
                  type="time"
                />
              </div>
            </div>
            <TextArea
              ref={deskripsiRef}
              label="Deskripsi Singkat"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              isRequired={true}
            />

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
    </div>
  );
}
