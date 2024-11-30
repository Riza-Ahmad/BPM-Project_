import React, { useState, useEffect, useRef } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Button from "../../../part/Button";
import HeaderText from "../../../part/HeaderText";
import Text from "../../../part/Text";
import { API_LINK } from "../../../util/Constants";
import "moment-timezone";
const localizer = momentLocalizer(moment);

export default function Index({ onChangePage }) {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const fetchEvents = async () => {
    try {
      const response = await fetch(
        API_LINK + "/MasterKegiatan/GetDataKegiatan",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Gagal mengambil data kegiatan");
      }

      const data = await response.json();
      console.log(data);

      const formattedEvents = data.map((item) => {
        const startDate = moment(item.keg_tgl_mulai).format("YYYY-MM-DD");
        const endDate = moment(item.keg_tgl_selesai).format("YYYY-MM-DD");

        return {
          id: item.keg_id,
          title: item.keg_nama,
          description: item.keg_deskripsi,
          category: item.keg_kategori,
          start: moment(`${startDate}T${item.keg_jam_mulai}`).toDate(),
          end: moment(`${endDate}T${item.keg_jam_selesai}`).toDate(),
          location: item.keg_tempat,
        };
      });

      console.log(formattedEvents);
      setEvents(formattedEvents);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
  };

  const buttonStyle = {
    backgroundColor: "#B8E8FF",
    color: "#2654A1",
    border: "none",
    padding: "8px 10px",
    borderRadius: "10px",
  };

  const viewButtonStyle = (isActive) => ({
    backgroundColor: isActive ? "white" : "#0056b3",
    color: isActive ? "#007bff" : "white",
    border: "none",
    padding: "5px 10px",
    borderRadius: "5px",
  });

  const eventStyles = {
    1: {
      backgroundColor: "rgba(181, 202, 251, 0.3)",
      borderColor: "#4989C2",
    },
    3: {
      backgroundColor: "rgba(193, 232, 191, 0.3)",
      borderColor: "#08A500",
    },
    default: {
      backgroundColor: "rgba(108, 117, 125, 0.1)",
      borderColor: "#6c757d",
    },
  };

  const getDetailPanelStyle = () => {
    const { backgroundColor, borderColor } =
      (selectedEvent && eventStyles[selectedEvent.category]) ||
      eventStyles.default;

    return {
      flex: 1,
      backgroundColor,
      padding: "20px",
      borderRadius: "8px",
      boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
      borderLeft: `5px solid ${borderColor}`,
      minWidth: "400px",
    };
  };

  const paragraphStyle = {
    display: "flex",
    alignItems: "center",
    color: "#575050",
    marginBottom: "5px",
    fontWeight: "500",
  };

  const iconStyle = {
    fontSize: "25px",
    marginRight: "8px",
    position: "relative",
    top: "3px",
  };

  const titleStyle = () => {
    const { borderColor } =
      (selectedEvent && eventStyles[selectedEvent.category]) ||
      eventStyles.default;

    return {
      color: borderColor,
      marginBottom: "10px",
    };
  };

  const containerStyle = {
    maxHeight: "550px",
    overflowY: "auto",
    padding: "10px",
  };

  const flexStyle = {
    display: "flex",
    alignItems: "center",
    marginBottom: "5px",
  };

  const textStyle = {
    color: "#575050",
    marginBottom: "5px",
  };

  const descriptionStyle = {
    marginTop: "20px",
  };

  const noEventMessageStyle = {
    textAlign: "center",
    color: "#575050",
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        marginTop: "5rem",
        marginBottom: "3rem",
        padding: "1rem",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "20px",
          color: "white",
          textAlign: "center",
          borderRadius: "8px",
        }}
      >
        <HeaderText
          label="Jadwal Kegiatan <br/>Badan Penjamin Mutu (BPM)"
          warna="#2654A1"
          ukuran="1.8rem"
          fontWeight="700"
          marginBottom="10px"
        />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginRight: "3rem",
        }}
      >
        <Button
          classType="btn btn-primary"
          title="Kelola Jadwal Kegiatan"
          label="Kelola Jadwal Kegiatan"
          onClick={() => onChangePage("read")}
        />
      </div>

      {/* Main Content */}
      <div
        className="row"
        style={{
          display: "flex",
          margin: "1.5rem",
          gap: "1rem",
          padding: "0 20px",
        }}
      >
        {/* Calendar Section */}
        <div
          style={{
            flex: 2,
            backgroundColor: "#FFFFFF",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          }}
        >
          <div
            style={{
              overflowX: "auto",
              WebkitOverflowScrolling: "touch",
              paddingBottom: "20px",
            }}
          >
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              onSelectEvent={handleSelectEvent}
              style={{
                height: 500,
                margin: "0",
                minWidth: "700px",
                borderCollapse: "collapse",
              }}
              components={{
                toolbar: (props) => (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "10px",
                      color: "#2654A1",
                      marginBottom: "10px",
                    }}
                  >
                    <div style={{ display: "flex", gap: "5px" }}>
                      <button
                        onClick={() => props.onNavigate("PREV")}
                        style={{ ...buttonStyle }}
                      >
                        <i className="fi fi-br-angle-left"></i>
                      </button>
                      <button
                        onClick={() => props.onNavigate("TODAY")}
                        style={{ ...buttonStyle, fontWeight: "600" }}
                      >
                        Hari Ini
                      </button>
                      <button
                        onClick={() => props.onNavigate("NEXT")}
                        style={{ ...buttonStyle }}
                      >
                        <i className="fi fi-br-angle-right"></i>
                      </button>
                    </div>

                    <div style={{ display: "flex", gap: "5px" }}>
                      <Text
                        isi={props.label}
                        warna="#2654A1"
                        ukuran="1.3rem"
                        alignText="center"
                        style={{ margin: "0", fontWeight: "500" }}
                      />
                    </div>

                    <div style={{ display: "flex", gap: "5px" }}>
                      <button
                        onClick={() => props.onView("month")}
                        style={viewButtonStyle(props.view === "month")}
                      >
                        Month
                      </button>
                      <button
                        onClick={() => props.onView("week")}
                        style={viewButtonStyle(props.view === "week")}
                      >
                        Week
                      </button>
                      <button
                        onClick={() => props.onView("day")}
                        style={viewButtonStyle(props.view === "day")}
                      >
                        Day
                      </button>
                      <button
                        onClick={() => props.onView("agenda")}
                        style={viewButtonStyle(props.view === "agenda")}
                      >
                        Agenda
                      </button>
                    </div>
                  </div>
                ),
              }}
              eventPropGetter={(event) => {
                const { backgroundColor, borderColor } =
                  eventStyles[event.category] || eventStyles.default;

                return {
                  style: {
                    borderRadius: "8px",
                    borderLeft: `5px solid ${borderColor}`,
                    backgroundColor,
                    color: "#333",
                  },
                };
              }}
            />
          </div>

          <div className="row">
            <div class="col-lg-4 col-md-6 mb-0">
              <p style={paragraphStyle}>
                <i
                  class="fi fi-sr-square-small"
                  style={{ ...iconStyle, color: "#4989C2" }}
                ></i>
                Rencana Kegiatan
              </p>
            </div>
            <div class="col-lg-4 col-md-6 mb-0">
              <p style={paragraphStyle}>
                <i
                  class="fi fi-sr-square-small"
                  style={{ ...iconStyle, color: "#08A500" }}
                ></i>
                Kegiatan Terlaksana
              </p>
            </div>
          </div>
          <div class="col-lg-4 col-md-6 mb-0">
            <p style={paragraphStyle}>
              <i
                class="fi fi-sr-square-small"
                style={{ ...iconStyle, color: "#6c757d" }}
              ></i>
              Kegiatan Terlewat
            </p>
          </div>
        </div>

        {/* Event Detail Panel */}
        <div style={getDetailPanelStyle()}>
          {selectedEvent ? (
            <div>
              <h4 style={titleStyle()}>{selectedEvent.title}</h4>
              <div style={containerStyle}>
                <p style={flexStyle}>
                  <i className="fi fi-br-calendar-day" style={iconStyle}></i>
                  {moment(selectedEvent.start)
                    .tz("Asia/Jakarta")
                    .format("dddd, DD MMMM YYYY HH:mm [WIB]")}
                </p>
                <i className="fi fi-rr-arrow-down"></i>
                <p style={flexStyle}>
                  <i className="fi fi-br-calendar-day" style={iconStyle}></i>
                  {moment(selectedEvent.end)
                    .tz("Asia/Jakarta")
                    .format("dddd, DD MMMM YYYY HH:mm [WIB]")}
                </p>

                <p style={{ ...flexStyle, ...textStyle }}>
                  <i className="fi fi-br-marker" style={iconStyle}></i>
                  {selectedEvent.location}
                </p>

                <Text
                  isi={selectedEvent.description}
                  warna="#575050"
                  alignText="justify"
                  style={descriptionStyle}
                ></Text>
              </div>
            </div>
          ) : (
            <p style={noEventMessageStyle}>
              Pilih kegiatan untuk melihat detail.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
