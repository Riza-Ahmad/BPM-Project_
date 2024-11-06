import React, { useState } from "react"; 
import { useParams, useNavigate, Link } from "react-router-dom";
import PageTitleNav from "../../part/PageTitleNav"; 
import TextField from "../../part/TextField"; 
import TextArea from "../../part/TextArea"; 
import DatePicker from "../../part/DatePicker"; 
import UploadFoto from "../../part/UploadFoto"; 
import HeaderForm from "../../part/HeaderForm"; 
import Button from "../../part/Button";
import DetailData from "../../part/DetailData"; 

export default function Add() {
    const navigate = useNavigate();

    const title = "Tambah Berita";
    const breadcrumbs = [
        { label: "Berita", href: "/berita" }, 
        { label: "Kelola Berita", href: "/kelolaBerita" }, 
        { label: "Tambah Berita" } 
    ];

  return ( 
    <div className="d-flex flex-column min-vh-100">
     
      <main className="flex-grow-1" style={{ marginTop: '80px' }}>
        <div className="d-flex flex-column">
          {/* Breadcrumbs and Page Title */}
          <div className="m-3">
            <PageTitleNav 
                title={title}
                breadcrumbs={breadcrumbs}
                onClick={() => navigate("/kelolaBerita")} 
            />
          </div>

          {/* Main Content Section */}
          <div className="shadow p-5 m-5 mt-0 bg-white rounded">
            <HeaderForm label="Formulir Berita"/>
            <div className="row">
              <div className="col-lg-6 col-md-6 ">
                <TextField label="Nama" isRequired="true" />
                <DetailData label="Dibuat Oleh" isi="Retno Widiastuti"/>
              </div>
              <div className="col-lg-6 col-md-6">
                <DatePicker label="Tanggal"/>
              </div>
            </div>
            
            <TextArea label="Deskripsi"/>

            <div className="row">
              <div className="col-lg-4 col-md-6 mb-4">
                <UploadFoto label="Masukkan Foto"/>
              </div>
              <div className="col-lg-4 col-md-6 mb-4">
                <UploadFoto label="Masukkan Foto"/>
              </div>
              <div className="col-lg-4 col-md-6 mb-4">
                <UploadFoto label="Masukkan Foto"/>
              </div>
            </div>

            <div className="d-flex justify-content-between align-items-center">
              <div className="flex-grow-1 m-2">
                <Button classType="primary" type="submit" label="Simpan" width="100%" />
              </div>
              <div className="flex-grow-1 m-2">
                <Button classType="danger" type="button" label="Batal" width="100%" />
              </div>
            </div>

          </div>
        </div>
      </main>

    </div>
  );
}

