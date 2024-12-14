import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_LINK } from "../../../util/Constants";

export default function Detail() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${API_LINK}SkalaPenilaian/GetSkalaPenilaian`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
          }
        );

        if (response.ok) {
          const result = await response.json();
          setData(JSON.parse(result)); // Parsing JSON hasil dari backend
        } else {
          throw new Error("Gagal mengambil data skala penilaian.");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleBack = () => {
    navigate("/survei/skala");
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "auto" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
        Detail Skala Penilaian
      </h2>

      {loading ? (
        <p>Loading data...</p>
      ) : error ? (
        <p style={{ color: "red" }}>Error: {error}</p>
      ) : (
        <table className="table table-bordered table-striped">
          <thead>
            <tr>
              <th>#</th>
              <th>Skala</th>
              <th>Deskripsi</th>
              <th>Tipe</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={item.skp_id}>
                <td>{index + 1}</td>
                <td>{item.skp_skala}</td>
                <td>{item.skp_deskripsi}</td>
                <td>{item.skp_tipe}</td>
                <td>{item.skp_status === 1 ? "Aktif" : "Tidak Aktif"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div style={{ textAlign: "right", marginTop: "20px" }}>
        <button className="btn btn-secondary" onClick={handleBack}>
          Kembali
        </button>
      </div>
    </div>
  );
}
