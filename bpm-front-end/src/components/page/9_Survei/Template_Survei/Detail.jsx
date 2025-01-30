import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Loading from "../../../part/Loading";
import PageTitleNav from "../../../part/PageTitleNav";
import Button from "../../../part/Button";
import { API_LINK } from "../../../util/Constants";

export default function Detail() {
  const { id } = useParams(); // Mengambil ID dari URL
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  // Fetch detail data berdasarkan ID
  useEffect(() => {
    const fetchDetailTemplateSurvei = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${API_LINK}/TemplateSurvei/GetTemplateSurvei`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ tsu_id: id }), // Kirim ID ke API
          }
        );

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();

        // Format data sesuai kebutuhan
        setData({
          id: result.tsu_id,
          name: result.tsu_nama,
          status: result.tsu_status === 0 ? "Draft" : "Final",
          createdBy: result.tsu_create_by || "N/A",
          createdDate: result.tsu_create_date
            ? new Date(result.tsu_create_date).toLocaleDateString()
            : "-",
          modifiedBy: result.tsu_modif_by || "-",
          modifiedDate: result.tsu_modif_date
            ? new Date(result.tsu_modif_date).toLocaleDateString()
            : "-",
        });
      } catch (error) {
        console.error("Fetch error:", error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: error.message || "Gagal mengambil detail template survei!",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDetailTemplateSurvei();
  }, [id]);

  if (loading) return <Loading />;

  if (!data) {
    return (
      <div className="p-5 text-center">
        <h4>Data tidak ditemukan.</h4>
        <Button
          classType="secondary"
          label="Kembali"
          onClick={() => navigate("/survei/template")}
        />
      </div>
    );
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <main className="flex-grow-1 p-3" style={{ marginTop: "80px" }}>
        <div className="container">
          <PageTitleNav
            title="Detail Template Survei"
            breadcrumbs={[
              { label: "Survei", href: "/survei" },
              { label: "Template Survei", href: "/survei/template" },
              { label: "Detail Survei" },
            ]}
            onClick={() => navigate("/survei/template")}
          />

          <div className="card mt-4 p-4 shadow-sm">
            <h5 className="mb-3">Informasi Template</h5>
            <table className="table table-striped">
              <tbody>
                <tr>
                  <th scope="row">ID Template</th>
                  <td>{data.id}</td>
                </tr>
                <tr>
                  <th scope="row">Nama Template</th>
                  <td>{data.name}</td>
                </tr>
                <tr>
                  <th scope="row">Deskripsi</th>
                  <td>{data.description}</td>
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
                onClick={() => navigate("/survei/template")}
              />
              <Button
                classType="primary"
                label="Edit"
                onClick={() => navigate(`/survei/template/edit/${data.id}`)}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
