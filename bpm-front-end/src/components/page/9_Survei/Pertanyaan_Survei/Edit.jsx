import React, { useEffect, useState } from "react";
import PageTitleNav from "../../../part/PageTitleNav";
import TextField from "../../../part/TextField";
import HeaderForm from "../../../part/HeaderText";
import Button from "../../../part/Button";
import Dropdown from "../../../part/Dropdown";
import { API_LINK } from "../../../util/Constants";

export default function Edit({ onChangePage, questionId }) {
    const title = "Edit Pertanyaan";
    const breadcrumbs = [
        { label: "Daftar Pertanyaan", href: "/survei/pertanyaan" },
        { label: "Edit Pertanyaan", href: `/survei/pertanyaan/edit/${questionId}` },
    ];

    const [isPertanyaanUmumYes, setPertanyaanUmumYes] = useState(false);
    const [pertanyaan, setPertanyaan] = useState("");
    const [kriteriaSurvei, setKriteriaSurvei] = useState([]);
    const [skalaPenilaian, setSkalaPenilaian] = useState([]);
    const [responden, setResponden] = useState("");
    const [isHeader, setIsHeader] = useState(false);
    const [isStatus, setIsStatus] = useState(1);
    const [isGeneral, setIsGeneral] = useState(""); // Set to "" initially, to handle radio input correctly
    const [createdBy, setCreatedBy] = useState("");
    const [selectedKriteriaSurvei, setSelectedKriteriaSurvei] = useState("");
    const [selectedSkalaPenilaian, setSelectedSkalaPenilaian] = useState("");

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

                const formattedData = result.map((item) => ({
                    Value: item.skp_id,
                    Text: item.skp_tipe,
                }));

                setSkalaPenilaian(formattedData);
            } catch (error) {
                console.error("Error fetching SkalaPenilaian:", error);
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

                const formattedData = result.map((item) => ({
                    Value: item.ksr_id,
                    Text: item.ksr_nama,
                }));

                setKriteriaSurvei(formattedData);
            } catch (error) {
                console.error("Error fetching KriteriaSurvei:", error);
            }
        };

        const fetchDataPertanyaan = async () => {
            try {
                const response = await fetch(`${API_LINK}/MasterPertanyaan/GetPertanyaanById/${questionId}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const result = await response.json();
                const pertanyaanData = result[0]; // Assuming it's an array with the first element containing the data
                setPertanyaan(pertanyaanData.pty_pertanyaan);
                setIsHeader(pertanyaanData.pty_isheader === 1);
                setIsGeneral(pertanyaanData.pty_isgeneral.toString()); // Correctly set the general question state
                setIsStatus(pertanyaanData.pty_status);
                setCreatedBy(pertanyaanData.pty_created_by);
                setSelectedKriteriaSurvei(pertanyaanData.ksr_id);
                setSelectedSkalaPenilaian(pertanyaanData.skp_id);
                if (pertanyaanData.pty_isgeneral === 1) {
                    setPertanyaanUmumYes(true);
                }
            } catch (error) {
                console.error("Error fetching Pertanyaan data:", error);
            }
        };

        fetchDataSkala();
        fetchDataKriteria();
        fetchDataPertanyaan();
    }, [API_LINK, questionId]);

    const handlePertanyaanUmumChange = (value) => {
        setIsGeneral(value); // Directly set the value of isGeneral
        setPertanyaanUmumYes(value === "Ya"); // Control the 'pertanyaanUmumYes' state based on radio value
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = {
            pty_id: questionId,
            pertanyaan,
            isHeader: isHeader ? 1 : 0,
            isGeneral,
            isStatus,
            createdBy,
            selectedKriteriaSurvei,
            selectedSkalaPenilaian,
        };

        try {
            const response = await fetch(
                `${API_LINK}/MasterPertanyaan/editPertanyaan`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                }
            );

            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            const result = await response.json();
            console.log("Hasil dari server:", result);
            alert("Pertanyaan berhasil diperbarui!");
            onChangePage("index");
        } catch (error) {
            console.error("Error:", error);
            alert(`Terjadi kesalahan: ${error.message}`);
        }
    };

    const handleCancel = () => {
        onChangePage("index");
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
                                            checked={isHeader}
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
                                            checked={isGeneral === "1"}
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
                                            checked={isGeneral === "0"}
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
                                        value={selectedKriteriaSurvei}
                                        type="pilih"
                                        forInput="kriteriaSurvei"
                                        disabled={isPertanyaanUmumYes}
                                    />
                                </div>
                                <div className="col-lg-12 col-md-6">
                                    <Dropdown
                                        arrData={skalaPenilaian}
                                        label="Skala Penilaian"
                                        isRequired={true}
                                        onChange={(e) => setSelectedSkalaPenilaian(e.target.value)}
                                        value={selectedSkalaPenilaian}
                                        type="pilih"
                                        forInput="skalaPenilaian"
                                        disabled={isPertanyaanUmumYes}
                                    />
                                </div>
                            </div>
                            {/* Button Submit and Cancel */}
                            <div className="row mt-3">
                                <div className="col-md-6 text-center">
                                    <Button
                                        label="Simpan"
                                        style={{ paddingLeft: "50px", paddingRight: "50px" }}
                                        type="submit"
                                    />
                                </div>
                                <div className="col-md-6 text-center">
                                    <Button
                                        label="Batal"
                                        style={{
                                            paddingLeft: "50px",
                                            paddingRight: "50px",
                                            backgroundColor: "gray",
                                        }}
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
