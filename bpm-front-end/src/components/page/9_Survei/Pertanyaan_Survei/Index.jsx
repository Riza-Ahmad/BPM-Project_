import React, { useState, useRef } from "react";
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

export default function Index({onChangePage}) {
    const [filterValue, setFilterValue] = useState("");
    const [pageSize] = useState(10);
    const [pageCurrent, setPageCurrent] = useState(1);
    const [selectedQuestion, setSelectedQuestion] = useState(null);
    const [formData, setFormData] = useState({ questionText: '' });
    const importModalRef = useRef();
    const [file, setFile] = useState(null);
    const [questions, setQuestions] = useState([
        
        { id: 1, text: 'Apa itu React?' },
        { id: 2, text: 'Bagaimana cara menggunakan useState?' },
        { id: 3, text: 'Apa perbedaan antara useEffect dan useLayoutEffect?' },
        { id: 4, text: 'Apa kelebihan React dibandingkan dengan framework lain?' },
        { id: 5, text: 'Bagaimana cara membuat komponen fungsional di React?' },
        { id: 6, text: 'Apa itu React Hook dan bagaimana cara kerjanya?' },
        { id: 7, text: 'Bagaimana cara menggunakan React Context untuk manajemen state?' },
        { id: 8, text: 'Apa perbedaan antara props dan state di React?' },
        { id: 9, text: 'Bagaimana cara menangani event di React?' },
        { id: 10, text: 'Apa yang dimaksud dengan lifting state up di React?' },
        { id: 11, text: 'Apa yang dimaksud dengan lifting state up di React?' },

    ]);

    const addModalRef = useRef();
    const updateModalRef = useRef();
    const detailModalRef = useRef();
    const navigate = useNavigate();
    const isMobile = useIsMobile();

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
        addModalRef.current.close();
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
    //     setFormData({
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
    const filteredQuestions = questions.filter((question) =>
        question.text.toLowerCase().includes(filterValue.toLowerCase())
    );
    
    // Mengambil data yang sudah difilter berdasarkan halaman saat ini
    const currentData = filteredQuestions.slice(indexOfFirstData, indexOfLastData);
        

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


        const handleFilterChange = (e) => {
            setFilterValue(e.target.value);
          };  
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
                            label="Import"
                            onClick={() => {
                                if (file) {
                                    handleImportQuestions();
                                }
                            }}
                        />
                    }
                    Button2={
                        <Button
                            classType="secondary"
                            label="Batal"
                            onClick={() => {
                                setFile(null); // Reset file input
                                importModalRef.current.close();
                            }}
                        />
                    }
                >
                  <div className="form-group">
                    <label> Silahkan unduh format template pertanyaan terlebih dahulu,
                        <br/>Klik disini
                        <br/>
                        <br/>

                    </label>
                    <br/>
                    <label>
                    <strong>Berkas Pertanyaan <span style={{ color: "red" }}>*</span></strong>
                    </label>
                    <input
                        type="file"
                        onChange={handleFileChange}
                        
                        style={{ width: '100%', padding: '8px', marginTop: '5px' }}
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
