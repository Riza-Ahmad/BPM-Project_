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
