import React from "react";
import { useLocation } from "react-router-dom";
import PageTitleNav from "../../../part/PageTitleNav";
import HeaderForm from "../../../part/HeaderText";
import DetailData from "../../../part/DetailData";
import Button from "../../../part/Button";

export default function Detail({ onChangePage }) {
  const location = useLocation();
  const questionData = location.state || {};

  return (
    <div className="d-flex flex-column min-vh-100">
      <main className="flex-grow-1 p-3" style={{ marginTop: "80px" }}>
        <div className="d-flex flex-column">
            
          {/* Breadcrumb Navigation */}
          <div className="m-3 mb-0">
            <PageTitleNav
              title="Detail Pertanyaan"
              breadcrumbs={[
                { label: "Daftar Pertanyaan", 
                 href: "/survei/pertanyaan" },

                { label: "Detail Pertanyaan" },
              ]}
              onClick={() => onChangePage("index")}
            />
          </div>

          {/* Detail Content */}
          <div className="shadow p-5 m-5 mt-0 bg-white rounded">
            <HeaderForm 
            label="Detail Pertanyaan" 
            isi={questionData.pertanyaan || "Tidak"}
            />

            {/* Pertanyaan Umum */}
            <DetailData 
            label="Pertanyaan Umum" 
            isi={questionData.pertanyaanUmum || "Tidak"} />

            {/* Pertanyaan */}
            <DetailData 
            label="Pertanyaan" 
            isi={questionData.pertanyaan || "Presentase kehadiran tenanga pendidik"} />

            {/* Kriteria Survei */}
            <DetailData 
            label="Kriteria Survei"
            isi={questionData.kriteriaSurvei || "Kepuasan Dosen"} />

            {/* Responden */}
            <DetailData 
            label="Responden" 
            isi={questionData.responden || "Dosen"} />

            {/* Button Kembali */}
            <div className="d-flex justify-content-end mt-4">
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
      </main>
    </div>
  );
}