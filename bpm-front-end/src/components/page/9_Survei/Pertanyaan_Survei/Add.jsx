import React, { useState } from "react";
import PageTitleNav from "../../../part/PageTitleNav";
import TextField from "../../../part/TextField";
import HeaderForm from "../../../part/HeaderText";
import Button from "../../../part/Button";
import Dropdown from "../../../part/Dropdown";

export default function Add({ onChangePage }) {
    const title = "Tambah Pertanyaan";
    const breadcrumbs = [
        { label: "Daftar Pertanyaan", href: "/survei/pertanyaan" },
        { 
            label: "Tambah Pertanyaan", 
            href: "/survei/pertanyaan/tambah"
        },
    ];

        // State untuk mengontrol apakah dropdown Kriteria Survei dan Responden dinonaktifkan
        const [isPertanyaanUmumYes, setPertanyaanUmumYes] = useState(false);

        // Fungsi untuk menangani perubahan pada dropdown Pertanyaan Umum
        const handlePertanyaanUmumChange = (value) => {
        setPertanyaanUmumYes(value === "Ya");
    };

    return (
        <div className="d-flex flex-column min-vh-100">
            <main className="flex-grow-1 p-3" style={{ marginTop: "80px" }}>
                <div className="d-flex flex-column">
                    {/* Breadcrumbs and Page Title */}
                        <div className="m-3">
                            <PageTitleNav
                            title={title}
                            breadcrumbs={breadcrumbs}
                            onClick={() => onChangePage("index")}
                            />
                        </div>

                        {/* Main Content Section */}
                        <div className="shadow p-5 m-5 mt-0 bg-white rounded">
                            <HeaderForm label="Formulir Pertanyaan" />
                            
                            {/*  Checkbox */}
                            <div className="row"  isRequired={true}>
                                <div className="col-lg-12">
                                    <label>
                                    <strong>Header</strong> 
                                    </label>
                                    <div className="form-check">
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            id="check1"
                                            onChange={(e) => handleCheckboxChange(e.target.checked)}
                                        />
                                    <br/>
                                    <br/>

                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <Dropdown
                                    label="Pertanyaan Umum"
                                    isRequired={true}
                                    arrData={[
                                    { Text: "Tidak", Value: "Tidak" },
                                    { Text: "Ya", Value: "Ya" },
                                    ]}
                                    onChange={(e) => handlePertanyaanUmumChange(e.target.value)}
                                />
                            </div>

                            <div className="row">
                            <div className="col-lg-12 col-md-6">
                                <TextField label="Pertanyaan" isRequired={true} />
                            </div>

                            <div className="col-lg-12 col-md-6">
                                <Dropdown
                                label="Kriteria Survei"
                                isRequired={true}
                                arrData={[
                                    { Text: " Kepuasan Dosen", Value: "Kepuasan Dosen" },
                                    { Text: "Kepuasan Tenaga Pendidik", Value: "Kepuasan Tenaga Pendidik" },
                                ]}
                                disabled={isPertanyaanUmumYes}
                                />
                            </div>  

                            <div className="col-lg-12 col-md-6">
                                <Dropdown
                                label="Responden"
                                isRequired={true}
                                arrData={[
                                    { Text: " Mahasiswa ", Value: " Mahasiswa " },
                                    { Text: " Dosen ", Value: " Dosen " },
                                ]}
                                disabled={isPertanyaanUmumYes}
                                />
                            </div>
                            </div>

                            <div className="d-flex justify-content-between align-items-center mt-4">
                            <div className="flex-grow-1 m-2">
                                <Button
                                classType="primary"
                                type="submit"
                                label="Simpan"
                                width="100%"
                                />
                            </div>
                            <div className="flex-grow-1 m-2">
                                <Button
                                classType="danger"
                                type="button"
                                label="Batal"
                                width="100%"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
