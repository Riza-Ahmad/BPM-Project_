import React, { useEffect, useState } from "react";
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
    const [kriteriaSurvei, setKriteriaSurvei] = useState([]);
    const [skalaPenilaian, setSkalaPenilaian] = useState([]);
    const [responden, setResponden] = useState("");
    const [isHeader, setIsHeader] = useState(false); // Set default as false
    const [isStatus, setIsStatus] = useState(1);
    const [isGeneral, setIsGeneral] = useState("");
    const [createdBy, setCreatedBy] = useState("");
    const [selectedKriteriaSurvei, setSelectedKriteriaSurvei] = useState("");
    const [selectedSkalaPenilaian, setSelectedSkalaPenilaian] = useState("");

    // Fungsi untuk menangani perubahan pada checkbox Pertanyaan Umum
    const handlePertanyaanUmumChange = (value) => {
        setPertanyaanUmumYes(value === "Ya");
    };

    useEffect(() => {
        const fetchDataSkala = async () => {
            try {
                const response = await fetch(`${API_LINK}/SkalaPenilaian/GetSkalaPenilaian`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({}),
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const result = await response.json();

                // Format data untuk dropdown
                const formattedData = result.map((item) => ({
                    Value: item.skp_id,  // Tambahkan key unik di sini
                    Text: item.skp_tipe,
                }));
                
                setSkalaPenilaian(formattedData);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        const fetchDataKriteria = async () => {
            try {
                const response = await fetch(`${API_LINK}/MasterKriteriaSurvei/GetDataKriteriaSurvei`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({}),
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const result = await response.json();

                // Format data untuk dropdown
                const formattedData = result.map((item) => ({
                    Value: item.ksr_id,  // Tambahkan key unik di sini
                    Text: item.ksr_nama,
                }));

                setKriteriaSurvei(formattedData);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchDataSkala();
        fetchDataKriteria();
    }, [API_LINK]);
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = {
            pertanyaan,
            isHeader: isHeader ? 1 : 0,
            isGeneral,
            isStatus,
            createdBy,
            selectedKriteriaSurvei, // Gunakan nilai yang dipilih
            selectedSkalaPenilaian,
        
        };
        
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
                                            onChange={(e) => {
                                                setIsGeneral("1");  // Panggil fungsi pertama
                                                handlePertanyaanUmumChange(e.target.value);  // Panggil fungsi kedua
                                            }}
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
                                        arrData={kriteriaSurvei}
                                        label="Kriteria Survei"
                                        isRequired={true}
                                        onChange={(e) => setSelectedKriteriaSurvei(e.target.value)} 
                                        value={selectedKriteriaSurvei} // Gunakan state yang baru
                                        type="pilih" 
                                        forInput="kriteriaSurvei"
                                        disabled={isPertanyaanUmumYes}
                                    />
                                </div>

                                <div className="col-lg-12 col-md-6">
                                    <Dropdown
                                        arrData={skalaPenilaian} // Data yang telah diformat
                                        label="Skala Penilaian"
                                        isRequired={true}
                                        onChange={(e) => setSelectedSkalaPenilaian(e.target.value)} 
                                        value={selectedSkalaPenilaian} // Gunakan state yang baru
                                        type="pilih" 
                                        forInput="skalaPenilaian"
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

