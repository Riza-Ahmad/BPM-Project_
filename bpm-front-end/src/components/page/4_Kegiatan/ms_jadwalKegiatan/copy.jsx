// src/index.jsx
import React, { useState, useRef } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Button from "../../../part/Button";
import Modal from "../../../part/Modal";

const localizer = momentLocalizer(moment);

const Index = () => {
  const [events, setEvents] = useState([
    // Example event data, replace this with actual data
    {
      id: 1,
      title: "Pelaksanaan Audit Eksternal",
      description: "Deskripsi audit eksternal",
      category: "terlaksana",
      start: new Date(2024, 9, 16),
      end: new Date(2024, 9, 16),
      location: "Politeknik Astra",
    },
    {
      id: 2,
      title: "Pelaksanaan Audit Eksternal",
      description: "Deskripsi audit eksternal",
      category: "rencana",
      start: new Date(2024, 9, 16),
      end: new Date(2024, 9, 16),
      location: "Politeknik Astra",
    },
  ]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    location: "",
  });

  const addModalRef = useRef();
  const updateModalRef = useRef();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddEvent = () => {
    const newEvent = {
      id: events.length + 1,
      title: formData.name,
      description: formData.description,
      start: new Date(`${formData.startDate}T${formData.startTime}`),
      end: new Date(`${formData.endDate}T${formData.endTime}`),
      location: formData.location,
    };
    setEvents([...events, newEvent]);
    setFormData({
      name: "",
      description: "",
      startDate: "",
      startTime: "",
      endDate: "",
      endTime: "",
      location: "",
    });
    addModalRef.current.close();
  };

  const handleUpdateEvent = () => {
    const updatedEvent = {
      ...selectedEvent,
      title: formData.name,
      description: formData.description,
      start: new Date(`${formData.startDate}T${formData.startTime}`),
      end: new Date(`${formData.endDate}T${formData.endTime}`),
      location: formData.location,
    };
    setEvents(
      events.map((event) =>
        event.id === selectedEvent.id ? updatedEvent : event
      )
    );
    setSelectedEvent(null);
    updateModalRef.current.close();
  };

  const handleDeleteEvent = () => {
    setEvents(events.filter((event) => event.id !== selectedEvent.id));
    setSelectedEvent(null);
    updateModalRef.current.close();
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setFormData({
      name: event.title,
      description: event.description,
      startDate: moment(event.start).format("YYYY-MM-DD"),
      startTime: moment(event.start).format("HH:mm"),
      endDate: moment(event.end).format("YYYY-MM-DD"),
      endTime: moment(event.end).format("HH:mm"),
      location: event.location,
    });
  };

  return (
    <div style={{ display: "flex", marginTop: "150px" }}>
      <div style={{ flex: 2 }}>
        <Button
          label="Tambah Rencana"
          onClick={() => addModalRef.current.open()}
        />
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          onSelectEvent={handleSelectEvent}
          style={{ height: 500, margin: "50px" }}
          eventPropGetter={(event) => {
            let backgroundColor = "";
            if (event.category === "terlaksana") {
              backgroundColor = "#28a745"; // Warna hijau
            } else if (event.category === "rencana") {
              backgroundColor = "#007bff"; // Warna biru
            }

            return {
              style: {
                backgroundColor,
                color: "white", // Warna teks
              },
            };
          }}
        />
      </div>

      {/* Right-side Event Detail Panel */}
      <div style={{ flex: 1, padding: "20px", borderLeft: "1px solid #ddd" }}>
        {selectedEvent ? (
          <div>
            <h3>{selectedEvent.title}</h3>
            <p>
              <strong>Tanggal:</strong>{" "}
              {moment(selectedEvent.start).format("dddd, DD MMMM YYYY")}
            </p>
            <p>
              <strong>Deskripsi:</strong> {selectedEvent.description}
            </p>
            <p>
              <strong>Tempat:</strong> {selectedEvent.location}
            </p>
            <Button
              label="Edit"
              onClick={() => updateModalRef.current.open()}
            />
          </div>
        ) : (
          <p>Pilih kegiatan untuk melihat detail.</p>
        )}
      </div>

      {/* Add Event Modal */}
      <Modal
        ref={addModalRef}
        title="Tambah Rencana"
        size="medium"
        Button1={<Button label="Simpan" onClick={handleAddEvent} />}
      >
        <form>
          <label>Nama Kegiatan</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
          />
          <label>Deskripsi</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
          />
          <label>Mulai Tanggal</label>
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleInputChange}
          />
          <label>Mulai Waktu</label>
          <input
            type="time"
            name="startTime"
            value={formData.startTime}
            onChange={handleInputChange}
          />
          <label>Selesai Tanggal</label>
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleInputChange}
          />
          <label>Selesai Waktu</label>
          <input
            type="time"
            name="endTime"
            value={formData.endTime}
            onChange={handleInputChange}
          />
          <label>Tempat</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
          />
        </form>
      </Modal>

      {/* Update Event Modal */}
      <Modal
        ref={updateModalRef}
        title="Update Rencana"
        size="medium"
        Button1={<Button label="Update" onClick={handleUpdateEvent} />}
        Button2={<Button label="Hapus" onClick={handleDeleteEvent} />}
      >
        <form>
          <label>Nama Kegiatan</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
          />
          <label>Deskripsi</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
          />
          <label>Mulai Tanggal</label>
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleInputChange}
          />
          <label>Mulai Waktu</label>
          <input
            type="time"
            name="startTime"
            value={formData.startTime}
            onChange={handleInputChange}
          />
          <label>Selesai Tanggal</label>
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleInputChange}
          />
          <label>Selesai Waktu</label>
          <input
            type="time"
            name="endTime"
            value={formData.endTime}
            onChange={handleInputChange}
          />
          <label>Tempat</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
          />
        </form>
      </Modal>
    </div>
  );
};

export default Index;


import React, { useRef, useState } from "react";
import PageTitleNav from "../../part/PageTitleNav";
import TextField from "../../part/TextField";
import TextArea from "../../part/TextArea";
import DatePicker from "../../part/DatePicker";
import UploadFoto from "../../part/UploadFotoMulti";
import HeaderForm from "../../part/HeaderText";
import Button from "../../part/Button";
import { API_LINK } from "../../util/Constants";
import SweetAlert from "../../util/SweetAlert";
import { useIsMobile } from "../../util/useIsMobile";

export default function Add({ onChangePage }) {
  const title = "Tambah Berita";
  const breadcrumbs = [
    { label: "Berita", href: "/berita" },
    { label: "Kelola Berita", href: "/berita/kelola" },
    { label: "Tambah Berita" },
  ];
  const isMobile = useIsMobile();

  const [images, setImages] = useState([]);
  const [isiBerita, setIsiBerita] = useState("");

  // Refs untuk input
  const judulRef = useRef();
  const penulisRef = useRef();
  const tanggalRef = useRef();
  const isiRef = useRef();
  const fotoRef = useRef();

  const handleUploadChange = (updatedFiles) => {
    setImages(updatedFiles);
  };

  const handleSubmit = async () => {
    const isJudulValid = judulRef.current?.validate();
    const isPenulisValid = penulisRef.current?.validate();
    const isTanggalValid = tanggalRef.current?.validate();
    const isIsiValid = isiRef.current?.validate();
    const isFotoValid = fotoRef.current?.validate();

    if (!isJudulValid) {
      judulRef.current?.focus();
      return;
    }
    if (!isPenulisValid) {
      penulisRef.current?.focus();
      return;
    }
    if (!isTanggalValid) {
      tanggalRef.current?.focus();
      return;
    }
    if (!isIsiValid) {
      isiRef.current?.focus();
      return;
    }
    if (!isFotoValid) {
      fotoRef.current?.focus();
      return;
    }

    try {
      // Upload foto
      const formData = new FormData();
      images.forEach((file) => formData.append("files", file));

      const uploadResponse = await fetch(
        `${API_LINK}/MasterBerita/UploadFiles`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!uploadResponse.ok) {
        throw new Error("Gagal mengunggah gambar");
      }

      const uploadedFileNames = await uploadResponse.json();

      const beritaData = {
        ber_judul: judulRef.current.value,
        ber_tgl: tanggalRef.current.value,
        ber_isi: isiBerita,
        ber_status: 1,
        ber_created_by: penulisRef.current.value,
        fotoList: uploadedFileNames,
        ber_penulis: penulisRef.current.value,
      };

      const createResponse = await fetch(
        `${API_LINK}/MasterBerita/CreateBerita`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(beritaData),
        }
      );

      if (!createResponse.ok) {
        throw new Error("Gagal menambahkan berita");
      }

      SweetAlert(
        "Berhasil!",
        "Data berhasil ditambahkan.",
        "success",
        "OK"
      ).then(() => onChangePage("read"));
    } catch (error) {
      console.error("Error:", error.message);
      SweetAlert("Gagal!", error.message, "error", "OK");
    }
  };

  const handleIsiChange = (e) => {
    setIsiBerita(e.target.value);
  };

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
            <HeaderForm label="Formulir Berita" />
            <div className="row">
              <div className="col-lg-6 col-md-6">
                <TextField
                  ref={judulRef}
                  label="Judul Berita"
                  isRequired={true}
                />
                <TextField ref={penulisRef} label="Penulis" isRequired={true} />
              </div>
              <div className="col-lg-6 col-md-6">
                <DatePicker
                  ref={tanggalRef}
                  label="Tanggal Berita"
                  isRequired={true}
                />
              </div>
            </div>
            <TextArea
              ref={isiRef}
              label="Isi Berita"
              value={isiBerita}
              onChange={handleIsiChange}
              isRequired={true}
            />
            <div className="row">
              <UploadFoto
                ref={fotoRef}
                label="Masukkan Foto"
                onChange={handleUploadChange}
                multiple
                isRequired={true}
              />
            </div>
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
