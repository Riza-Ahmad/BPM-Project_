import React, { useState, useRef, useEffect } from "react";
import Table from "../../../part/Table";
import Paging from "../../../part/Paging";
import PageTitleNav from "../../../part/PageTitleNav";
import Button from "../../../part/Button";
import TextField from "../../../part/TextField";
import Modal from "../../../part/Modal";
import Filter from "../../../part/Filter";
import SearchField from "../../../part/SearchField";
import SweetAlert from "../../../util/SweetAlert";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "../../../util/useIsMobile";
import { API_LINK } from "../../../util/Constants";

export default function Index({onChangePage}) {
    const [filterValue, setFilterValue] = useState("");
    const [pageSize] = useState(10);
    const [pageCurrent, setPageCurrent] = useState(1);
    const [selectedQuestion, setSelectedQuestion] = useState(null);
    const [formData, setFormData] = useState({ questionText: '' });
    const importModalRef = useRef();
    const [file, setFile] = useState(null);
    const [Data, setData] = useState(null);


    useEffect(() => {
        const fetchData = async () => {
          try {
            const result = await fetchWithParams(
              `${API_LINK}/MasterPertanyaan/GetDataPertanyaan`,
              {} // Parameter kosong jika tidak diperlukan
            );
      
            console.log(result); // Debugging jika diperlukan
            setData(result);
          } catch (err) {
            console.error("Fetch error:", err);
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Gagal mengambil data pertanyaan!",
            });
          } finally {
            setLoading(false);
          }
        };
      
        fetchData();
    }, []);

    const addModalRef = useRef();
    const updateModalRef = useRef();
    const detailModalRef = useRef();
    const navigate = useNavigate();
    const isMobile = useIsMobile();
    const [questions, setQuestions] = useState([]); 
    const [questionText, setQuestionText] = useState('');
    const [isHeader, setIsHeader] = useState(false);
    const [generalQuestion, setGeneralQuestion] = useState('Ya');
    const [surveyCriteria, setSurveyCriteria] = useState('');
    const [respondent, setRespondent] = useState('');

    const handleAddQuestion = () => {
        const newQuestion = {
            id: questions.length + 1,
            text: questionText,
            generalQuestion,
            surveyCriteria,
            respondent
        };
        setQuestions([...questions, newQuestion]);
        setQuestionText('');
        setSurveyCriteria('');
        setRespondent('');
        setIsHeader(false);
        setGeneralQuestion('Ya');
        addModalRef.current.close();5
    };

    const handleUpdateQuestion = () => {
        if (!selectedQuestion) return;
        const updatedQuestion = {
            ...selectedQuestion,
            text: formData.questionText,
            generalQuestion,
            surveyCriteria,
            respondent
        };
        setQuestions(questions.map(q => q.id === selectedQuestion.id ? updatedQuestion : q));
        setSelectedQuestion(null);
        setFormData({ questionText: '' });
        updateModalRef.current.close();
    };

    // const handleSelectQuestion = (question) => {
    //     setSelectedQuestion(question);
    //     setFormData({s
    //         questionText: question.text,
    //     });
    //     setGeneralQuestion(question.generalQuestion || 'Ya');
    //     setSurveyCriteria(question.surveyCriteria || '');
    //     setRespondent(question.respondent || '');
    //     updateModalRef.current.open();
    // };

    // const handleDetailQuestion = (question) => {
    //     setSelectedQuestion(question);
    //     detailModalRef.current.open();
    // };
    

    const handleExportQuestions = () => {
        const csvData = questions.map((q) => `${q.id},${q.text}`).join("\n");
        const blob = new Blob([csvData], { type: "text/csv" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "questions_export.csv";
        link.click();
    };

    const handleImportQuestions = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const content = e.target.result;
                const lines = content.split("\n");
                const newQuestions = lines.map((line) => {
                    const [id, text] = line.split(",");
                    return { id: parseInt(id, 10), text };
                });
                setQuestions(newQuestions);
            }; 
            reader.readAsText(file);
        }
    };
      const handleFileChange = (event) => {
        setFile(event.target.files[0]);
      };


    const indexOfLastData = pageCurrent * pageSize;
    const indexOfFirstData = indexOfLastData - pageSize;
    // const filteredQuestions = Data.filter((question) =>
    //     question.text.toLowerCase().includes(filterValue.toLowerCase())
    // );
    
    // Mengambil data yang sudah difilter berdasarkan halaman saat ini
    //const currentData = Data.slice(indexOfFirstData, indexOfLastData);
        

    const handlePageNavigation = (page) => {
        setPageCurrent(page);
    };
    
    const handleOpenImportModal = () => {
        importModalRef.current.open();
      };

    const title = "Daftar Pertanyaan";
    const breadcrumbs = [{ label: " Daftar Pertanyaan" }];

    const handleCheckboxChange = () => {
        setIsHeader(!isHeader);
    };

    const handleEdit = (item) => {
        onChangePage("edit", { state: { editData: item } });
      };

    const handleDetail = (item) => {
        onChangePage("detail", {state: {detailData: item }});
    }
    

    const handleSelectChange = (e) => {
        setGeneralQuestion(e.target.value);
    };


    const handleDelete = (id) => {
        SweetAlert(
            "Konfirmasi Hapus",
            "Apakah Anda yakin ingin menghapus pertanyaan ini?",
            "warning",
            "Hapus",
            null,
            "",
            true 
        ).then((result) => {
            if (result) {
                setQuestions((prevQuestions) =>
                    prevQuestions.filter((q) => q.id !== id)
                );
                SweetAlert("Berhasil", "Pertanyaan berhasil dihapus.", "success");
            } else {
                SweetAlert("Batal", "Penghapusan dibatalkan.", "info");
            }
        });
        ``
    };


    return (
        <div className="d-flex flex-column min-vh-100">
            <main className="flex-grow-1" style={{ marginTop: '80px' }}>
                <div className="d-flex flex-column">
                    <div className="mb-0" style={{ margin: isMobile ? "1rem" : "3rem" }}>
                        <PageTitleNav
                            title={title}
                            breadcrumbs={breadcrumbs}
                            onClick={() => navigate("/beranda")}
                        />
                    </div>
                    <div className="p-3 mt-2 mb-0" style={{ marginLeft: '50px', margin: isMobile ? "1rem" : "3rem" }}>
                    <div className="row" style={{ gap: "1rem" }}> {/* Menambahkan jarak antar elemen */}
                        <div className="">
                        </div>
                        <Button iconName="add" classType="primary" label="Tambah Pertanyaan" onClick={() => onChangePage("add")} />
                        <Button iconName="file-upload" classType="primary" label="Import Pertanyaan" onClick={handleOpenImportModal} />
                        <Button iconName="file-download" classType="primary" label="Export Pertanyaan" onClick={handleExportQuestions} />
                    </div>
                    <input type="file" id="import-file" style={{ display: "none" }} onChange={handleImportQuestions} />
                    <div className="row mt-5">
                        <div className="col-lg-10 col-md-6">
                            <SearchField />
                        </div>
                        <div className="col-lg-2 col-md-6">
                            <Filter />
                        </div>
                    </div>
                </div>

                    <div className="table-container bg-white p-3 mt-0 rounded" style={{ margin: isMobile ? "1rem" : "3rem" }}>
                        <Table
                            arrHeader={["No", "Pertanyaan", "Header", "Pertanyaan Umum"]}
                            headerToDataMap={{
                                "No": "No",
                                "Pertanyaan": "text",
                                "Header": "Header",
                                "Pertanyaan Umum": "generalQuestion",
                            }}
                            data={currentData.map((item, index) => ({
                                key: item.id,
                                No: indexOfFirstData + index + 1,
                                text: item.text,
                                Header: item.Header || "Tidak", 
                                generalQuestion: item.generalQuestion || "Ya",
                            }))}
                            actions={["Detail", "Edit", "Delete"]}
                            onDetail={handleDetail}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                        <Paging
                            pageSize={pageSize}
                            pageCurrent={pageCurrent}
                            totalData={questions.length}
                            navigation={handlePageNavigation}
                        />
                    </div>
                </div>
            </main>

            {/* Import Modal */}
            <Modal
                ref={importModalRef}
                title="Import Pertanyaan"
                size="medium"
                Button1={
                    <Button
                    classType="primary"
                    label="Simpan"
                    type="submit"
                    style={{
                        width: "200px",
                        height: "40px",
                        fontSize: "15px",
                        margin: "10px 0", // Jarak antar tombol
                    }}
                    onClick={() => {
                        if (file) {
                        handleImportQuestions();
                        }
                    }}
                    />
                }
                Button2={
                    <Button
                    classType="danger"
                    label="Batal"
                    style={{
                        width: "200px",
                        height: "40px",
                        fontSize: "15px",
                        margin: "10px 0", // Jarak antar tombol
                    }}
                    onClick={() => {
                        setFile(null);
                        importModalRef.current.close();
                    }}
                    />
                }
                >
                <div
                    className="form-group"
                    style={{
                    display: "flex",
                    flexDirection: "column", // Atur elemen form secara vertikal
                    // alignItems: "center", // Tengah horizontal
                    // textAlign: "center", // Tengah teks dalam label
                    gap: "10px", // Jarak antar elemen
                    width: "100%", // Elemen form memenuhi modal
                    }}
                >
                    <label>
                    Silahkan unduh format template pertanyaan terlebih dahulu, <br />
                    <a href="#" style={{ color: "blue", textDecoration: "underline" }}>
                        Klik disini
                    </a>
                    </label>
                    <label>
                    <strong>
                        Berkas Pertanyaan <span style={{ color: "red" }}>*</span>
                    </strong>
                    </label>
                    <input
                    type="file"
                    onChange={handleFileChange}
                    style={{
                        width: "100%",
                        padding: "10px",
                        border: "2px solid ",
                        borderRadius: "10px",
                        marginTop: "5px",
                    }}
                    name="import-file"
                    className="form-control"
                    />
                </div>
            </Modal>

            {/* ADD MODAL */}
            <Modal
                ref={addModalRef}
                title="Tambah Pertanyaan Survei"
                size="full"
                Button1={<Button classType="primary" label="Simpan" onClick={handleAddQuestion} />}
                Button2={<Button classType="secondary" label="Batal" onClick={() => addModalRef.current.close()} 
                />}
                
            >
                {/* Header Checkbox */}
                <div>
                    <label>Header</label>
                    <input type="checkbox" checked={isHeader} onChange={handleCheckboxChange} />
                </div>
                <br />
                
              {/* Pertanyaan Umum */}
                    <div>
                        <label htmlFor="generalQuestion">Pertanyaan Umum *</label>
                        <br />
                        <select
                            id="generalQuestion"
                            value={generalQuestion}
                            onChange={handleSelectChange}
                            required
                            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                        >
                            <option value="" disabled>Pilih salah satu</option>
                            <option value="Ya">Ya</option>
                            <option value="Tidak">Tidak</option>
                        </select>
                    </div>
                    <br />

                    {/* Input Pertanyaan */}
                    <div>
                        <TextField
                            label="Pertanyaan"
                            isRequired={true}
                            value={questionText}
                            onChange={(e) => setQuestionText(e.target.value)}
                            placeholder="Masukkan Pertanyaan"
                        />
                    </div>
                

               {/* Kriteria dan Responden, tampil jika "Tidak" */}
                {generalQuestion === "Tidak" && (
                    <>
                        <div>     
                            <label htmlFor="surveyCriteria" style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>
                                Kriteria Survei *
                            </label>
                            
                            <select
                                id="surveyCriteria"
                                value={surveyCriteria}
                                onChange={(e) => setSurveyCriteria(e.target.value)}
                                required
                                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                            >
                                <option value="" disabled>Pilih Kriteria</option>
                                <option value="Kepuasan Dosen">Kepuasan Dosen</option>
                                <option value="Kepuasan Tenaga Pendidik">Kepuasan Tenaga Pendidik</option>
                            </select>
                        </div>
                        <br />

                        <div>
                            
                            <label htmlFor="respondent" style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>
                                Responden  *
                            </label>
                            
                            <select
                                id="respondent"
                                value={respondent}
                                onChange={(e) => setRespondent(e.target.value)}
                                required
                                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                            >
                                <option value="" disabled>Pilih Responden</option>
                                <option value="Mahasiswa">Mahasiswa</option>
                                <option value="Tenaga Pendidik">Tenaga Pendidik</option>
                            </select>
                        </div>
                    </>
                )}

            </Modal>

            {/* Update Modal */}
            <Modal
                ref={updateModalRef}
                title="Update Pertanyaan"
                size="full"
                Button1={<Button classType="primary" label="Simpan" onClick={handleUpdateQuestion} />}
                Button2={<Button classType="secondary" label="Batal" onClick={() => updateModalRef.current.close()} />}
            >
                {/* Header */}
                <div>
                    <label> Header </label>
                    <input type="checkbox" checked={isHeader} onChange={handleCheckboxChange} />

                </div>

                {/* Pertanyaan Umum */}
                <div>
                    <label>Pertanyaan Umum</label>
                    <select value={generalQuestion} onChange={handleSelectChange}>
                        <option value="Ya">Ya</option>
                        <option value="Tidak">Tidak</option>
                    </select>
                </div>
                
                {/* Kriteria dan Responden, tampil jika "Tidak" */}
                {generalQuestion === "Tidak" && (
                    <>
                        <div>
                            <label>Kriteria Survei</label>
                            <select
                                value={surveyCriteria}
                                onChange={(e) => setSurveyCriteria(e.target.value)}
                            >
                                <option value="Kepuasan Dosen">Kepuasan Dosen</option>
                                <option value="Kepuasan Tenaga Pendidik">Kepuasan Tenaga Pendidik</option>
                            </select>
                        </div>
                    
                        <div>
                            <label>Responden</label>
                            <select
                                value={respondent}
                                onChange={(e) => setRespondent(e.target.value)}
                            >
                                <option value="Mahasiswa">Mahasiswa</option>
                                <option value="Tenaga Pendidik">Tenaga Pendidik</option>
                            </select>
                        </div>
                    </>
                )}
                
                <div>
                    <label>Pertanyaan</label>
                    <input
                        type="text"
                        value={formData.questionText}
                        onChange={(e) => setFormData({ ...formData, questionText: e.target.value })}
                        placeholder="Masukkan Pertanyaan"
                    />
                </div>
            </Modal>
            
        </div>
    );
}
