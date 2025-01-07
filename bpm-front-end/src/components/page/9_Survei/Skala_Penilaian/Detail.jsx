import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Loading from "../../../part/Loading";
import PageTitleNav from "../../../part/PageTitleNav";
import Button from "../../../part/Button";
import { API_LINK } from "../../../util/Constants";

export default function Detail() {
  const { id } = useParams(); // Mengambil skp_id dari URL
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  // Fetch detail data berdasarkan skp_id
  useEffect(() => {
    const fetchDetailSkalaPenilaian = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${API_LINK}/SkalaPenilaian/GetSkalaPenilaian`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              p1: id,
              p2: "",
              p3: "",
              // Tambahkan semua parameter lain hingga p50, jika diperlukan
              p50: "",
            }),
          }
        );

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();

        // Format data sesuai kebutuhan
        setData({
          id: result.skp_id,
          skala: result.skp_skala,
          deskripsi: result.skp_deskripsi,
          tipe: result.skp_tipe,
          status: result.skp_status === 0 ? "Inactive" : "Active",
          createdBy: result.skp_created_by || "N/A",
          createdDate: result.skp_created_date
            ? new Date(result.skp_created_date).toLocaleDateString()
            : "-",
          modifiedBy: result.skp_modif_by || "-",
          modifiedDate: result.skp_modif_date
            ? new Date(result.skp_modif_date).toLocaleDateString()
            : "-",
        });
      } catch (error) {
        console.error("Fetch error:", error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: error.message || "Gagal mengambil detail skala penilaian!",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDetailSkalaPenilaian();
  }, [id]);

  if (loading) return <Loading />;

  if (!data) {
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
          <PageTitleNav
            title="Detail Skala Penilaian"
            breadcrumbs={[
              { label: "Survei", href: "/survei" },
              { label: "Skala Penilaian", href: "/survei/skala" },
              { label: "Detail Skala Penilaian" },
            ]}
            onClick={() => navigate("/survei/skala")}
          />

          <div className="card mt-4 p-4 shadow-sm">
            <h5 className="mb-3">Informasi Skala Penilaian</h5>
            <table className="table table-striped">
              <tbody>
                <tr>
                  <th scope="row">ID Skala</th>
                  <td>{data.id}</td>
                </tr>
                <tr>
                  <th scope="row">Skala</th>
                  <td>{data.skala}</td>
                </tr>
                <tr>
                  <th scope="row">Deskripsi</th>
                  <td>{data.deskripsi}</td>
                </tr>
                <tr>
                  <th scope="row">Tipe</th>
                  <td>{data.tipe}</td>
                </tr>
                <tr>
                  <th scope="row">Status</th>
                  <td>{data.status}</td>
                </tr>
                <tr>
                  <th scope="row">Dibuat Oleh</th>
                  <td>{data.createdBy}</td>
                </tr>
                <tr>
                  <th scope="row">Tanggal Dibuat</th>
                  <td>{data.createdDate}</td>
                </tr>
                <tr>
                  <th scope="row">Diubah Oleh</th>
                  <td>{data.modifiedBy}</td>
                </tr>
                <tr>
                  <th scope="row">Tanggal Diubah</th>
                  <td>{data.modifiedDate}</td>
                </tr>
              </tbody>
            </table>

            <div className="mt-4 d-flex justify-content-end gap-2">
              <Button
                classType="secondary"
                label="Kembali"
                onClick={() => navigate("/survei/skala")}
              />
              <Button
                classType="primary"
                label="Edit"
                onClick={() => navigate(`/survei/skala/edit/${data.id}`)}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
