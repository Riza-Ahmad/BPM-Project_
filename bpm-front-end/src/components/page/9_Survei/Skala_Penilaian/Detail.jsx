import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import Loading from "../../../part/Loading";
import Button from "../../../part/Button";
import { API_LINK } from "../../../util/Constants";

export default function Detail() {
  const { id } = useParams(); // Ambil ID dari URL
  const navigate = useNavigate();
  const location = useLocation(); // Untuk menerima data tambahan dari state

  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState(null);

  // Fetch detail data berdasarkan ID
  useEffect(() => {
    const fetchDetailSkalaPenilaian = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${API_LINK}/SkalaPenilaian/GetDataSkalaPenilaianById`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ p1: id }),
          }
        );

        if (!response.ok) {
          throw new Error("Gagal mengambil data skala penilaian.");
        }

        const result = await response.json();
        if (result && result.length > 0) {
          setDetail(result[0]);
        } else {
          throw new Error("Data tidak ditemukan.");
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: error.message || "Gagal mengambil detail skala penilaian!",
        });
        navigate("/survei/skala"); // Kembali ke halaman sebelumnya jika gagal
      } finally {
        setLoading(false);
      }
    };

    fetchDetailSkalaPenilaian();
  }, [id, navigate]);

  if (loading) return <Loading />;

  if (!detail) {
    return (
      <div className="p-5 text-center">
        <h4>Data tidak ditemukan.</h4>
        <Button
          classType="secondary"
          label="Kembali"
          onClick={() => navigate("/survei/skala")}
        />
      </div>
    );
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <main className="flex-grow-1 p-3" style={{ marginTop: "80px" }}>
        <div className="container">
          <div className="card mt-4 p-4 shadow-sm">
            <h5 className="mb-3">Detail Skala Penilaian</h5>
            <table className="table table-striped">
              <tbody>
                <tr>
                  <th scope="row">ID Skala</th>
                  <td>{detail.skp_id}</td>
                </tr>
                <tr>
                  <th scope="row">Skala</th>
                  <td>{detail.skp_skala}</td>
                </tr>
                <tr>
                  <th scope="row">Deskripsi</th>
                  <td>{detail.skp_deskripsi}</td>
                </tr>
                <tr>
                  <th scope="row">Tipe</th>
                  <td>{detail.skp_tipe}</td>
                </tr>
                <tr>
                  <th scope="row">Status</th>
                  <td>{detail.skp_status === 0 ? "Inactive" : "Active"}</td>
                </tr>
                <tr>
                  <th scope="row">Dibuat Oleh</th>
                  <td>{detail.skp_created_by || "N/A"}</td>
                </tr>
                <tr>
                  <th scope="row">Tanggal Dibuat</th>
                  <td>
                    {detail.skp_created_date
                      ? new Date(detail.skp_created_date).toLocaleDateString()
                      : "-"}
                  </td>
                </tr>
                <tr>
                  <th scope="row">Dimodifikasi Oleh</th>
                  <td>{detail.skp_modif_by || "-"}</td>
                </tr>
                <tr>
                  <th scope="row">Tanggal Dimodifikasi</th>
                  <td>
                    {detail.skp_modif_date
                      ? new Date(detail.skp_modif_date).toLocaleDateString()
                      : "-"}
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="mt-4 d-flex justify-content-end gap-2">
              <Button
                classType="secondary"
                label="Kembali"
                onClick={() => navigate("/survei/skala")}
              />
              
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
