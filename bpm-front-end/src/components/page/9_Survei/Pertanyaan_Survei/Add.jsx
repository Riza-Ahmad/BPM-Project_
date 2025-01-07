import React, { useState } from "react";
import PageTitleNav from "../../../part/PageTitleNav";
import TextField from "../../../part/TextField";
import HeaderForm from "../../../part/HeaderText";
import Button from "../../../part/Button";
import Dropdown from "../../../part/Dropdown";
import { API_LINK } from "../../../util/Constants";

export default function Add({ onChangePage }) {
    const title = "Tambah Pertanyaan";
    const breadcrumbs = [
        { label: "Daftar Pertanyaan", href: "/survei/pertanyaan" },
        { label: "Tambah Pertanyaan", href: "/survei/pertanyaan/add" },
    ];

    const [isPertanyaanUmumYes, setPertanyaanUmumYes] = useState(false);
    const [pertanyaan, setPertanyaan] = useState("");
    const [kriteriaSurvei, setKriteriaSurvei] = useState("");
    const [skalaPenilaian, setSkalaPenilaian] = useState("");
    const [responden, setResponden] = useState("");
    const [isHeader, setIsHeader] = useState(false); // Set default as false
    const [isStatus, setIsStatus] = useState("");
    const [createdBy, setCreatedBy] = useState("");
    const [isGeneral, setGeneral] = useState("");
    

    // Fungsi untuk menangani perubahan pada checkbox Pertanyaan Umum
    const handlePertanyaanUmumChange = (value) => {
        setPertanyaanUmumYes(value === "Ya");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = {
            pertanyaan,
            isHeader: isHeader ? 1 : 0,
            isStatus: parseInt(isStatus, 10),
            createdBy,
            kriteriaSurvei,
            skalaPenilaian,
            responden,
        };
    
        console.log("Data yang dikirim:", data); // Debugging
    
        try {
            const response = await fetch(
                `${API_LINK}/MasterPertanyaan/CreatePertanyaan`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });
        
            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }
        
            const result = await response.json();
            console.log("Hasil dari server:", result);
        
            alert("Pertanyaan berhasil dibuat!");
            onChangePage("index");
        } catch (error) {
            console.error("Error:", error);
            alert(`Terjadi kesalahan: ${error.message}`);
        }
    }
    
    // Fungsi untuk menangani tombol batal
    const handleCancel = () => {
        onChangePage("index"); // Arahkan kembali ke halaman daftar pertanyaan
    };

    return (
        <div className="d-flex flex-column min-vh-100">
            <main className="flex-grow-1 p-3" style={{ marginTop: "80px" }}>
                <div className="d-flex flex-column">
                    <div className="m-3">
                        <PageTitleNav
                            title={title}
                            breadcrumbs={breadcrumbs}
                            onClick={() => onChangePage("index")}
                        />
                    </div>

                    <div className="shadow p-5 m-5 mt-0 bg-white rounded">
                        <HeaderForm label="Formulir Pertanyaan" />

                        <form onSubmit={handleSubmit}>
                            {/* Checkbox Header */}
                            <div className="row">
                                <div className="col-lg-12">
                                    <label><strong>Header</strong></label>
                                    <div className="form-check">
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            onChange={(e) => setIsHeader(e.target.checked)}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Pertanyaan Umum */}
                            <div className="row">
                                <label style={{ fontWeight: "bold" }}>
                                    Pertanyaan Umum <span style={{ color: "red" }}>*</span>
                                </label>
                                <div className="custom-radio-dropdown">
                                    <div className="radio-item">
                                        <input
                                            type="radio"
                                            id="tidak"
                                            name="pertanyaanUmum"
                                            value="Tidak"
                                            required
                                            onChange={(e) => handlePertanyaanUmumChange(e.target.value)}
                                        />
                                        <label htmlFor="tidak">Tidak</label>
                                    </div>
                                    <div className="radio-item">
                                        <input
                                            type="radio"
                                            id="ya"
                                            name="pertanyaanUmum"
                                            value="Ya"
                                            required
                                            onChange={(e) => handlePertanyaanUmumChange(e.target.value)}
                                        />
                                        <label htmlFor="ya">Ya</label>
                                    </div>
                                </div>
                            </div>

                            {/* Input Pertanyaan */}
                            <div className="row">
                                <div className="col-lg-12 col-md-6">
                                    <TextField
                                        label="Pertanyaan"
                                        value={pertanyaan}
                                        onChange={(e) => setPertanyaan(e.target.value)}
                                        isRequired={true}
                                    />
                                </div>

                                <div className="col-lg-12 col-md-6">
                                    <Dropdown
                                        label="Kriteria Survei"
                                        isRequired={true}
                                        arrData={[
                                            { Text: "", Value: "" },
                                            { Text: "", Value: "  " },
                                        ]}
                                        onChange={(e) => setKriteriaSurvei(e.target.value)}
                                        disabled={isPertanyaanUmumYes}
                                    />
                                </div>

                                <div className="col-lg-12 col-md-6">
                                    <Dropdown
                                        label="Skala Penilaian"
                                        isRequired={true}
                                        arrData={[
                                            { Text: "" },
                                            { Text: " ", Value: "" },
                                        ]}
                                        onChange={(e) => setSkalaPenilaian(e.target.value)}
                                        disabled={isPertanyaanUmumYes}
                                    />
                                </div>

                                <div className="col-lg-12 col-md-6">
                                    <Dropdown
                                        label="Responden"
                                        isRequired={true}
                                        arrData={[
                                            { Text: "", Value: "" },
                                            { Text: "", Value: "" },
                                        ]}
                                        onChange={(e) => setResponden(e.target.value)}
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
                                        onClick={handleCancel}
                                    />
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
}