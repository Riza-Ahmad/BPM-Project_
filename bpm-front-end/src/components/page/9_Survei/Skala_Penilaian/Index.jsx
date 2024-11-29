import React, { useState, useRef, useEffect } from "react";
import Table from "../../../part/Table";
import Paging from "../../../part/Paging";
import PageTitleNav from "../../../part/PageTitleNav";
import Button from "../../../part/Button";
import TextField from "../../../part/TextField";
import Modal from "../../../part/Modal";
import Filter from "../../../part/Filter";
import SearchField from "../../../part/SearchField";
import FileUpload from "../../../part/FileUpload";
import DropDown from "../../../part/Dropdown";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "../../../util/useIsMobile";

export default function Index() {
    const [pageSize] = useState(10);
    const [pageCurrent, setPageCurrent] = useState(1);
    const [selectedSkala, setSelectedSkala] = useState(null);
    const [formData, setFormData] = useState({ name: '' });
    const addModalRef = useRef();
    const updateModalRef = useRef();
    const detailModalRef = useRef();
    const navigate = useNavigate();
    const isMobile = useIsMobile(); 

    useEffect(() => {
        if (selectedSkala && detailModalRef.current) {
            detailModalRef.current.open();
        }
    }, [selectedSkala]);
    
    const dataOptions = [
        { Value: "1", Text: "Pria" },
        { Value: "2", Text: "Wanita" },
        { Value: "3", Text: "Tidak Ingin Disebutkan" },
    ];

    const [Skala, setSkala] = useState([
        { id: 1, Nama: 'Dosen' },
        { id: 2, Nama: 'Tenaga Pendidik' },
        { id: 3, Nama: 'Mahasiswa' }
    ]);

    const handleAddSkala = () => {
        const newSkala = {
            id: Skala.length + 1,
            Nama: formData.name,
        };
        setSkala([...Skala, newSkala]);
        setFormData({ name: '' });
        addModalRef.current.close();
    };

    const handleUpdateSkala = () => {
        if (!selectedSkala) return; // Check if selectedSkala is set
        const updatedSkala = {
            ...selectedSkala,
            Nama: formData.name,
        };
        setSelectedSkala(null);
        setSkala(Skala.map(Skala => Skala.id === selectedSkala.id ? updatedSkala : Skala));
        setFormData({ name: '' }); // Reset form data
        updateModalRef.current.close();
    };

    const handleSelectSkala = (Skala) => {
        setSelectedSkala(Skala);
        setFormData({
            name: Skala.Nama,
        });
        updateModalRef.current.open();
    };

    const handleDetailSkala = (Skala) => {
        setSelectedSkala(Skala);
        detailModalRef.current.open();
    };

    const indexOfLastData = pageCurrent * pageSize;
    const indexOfFirstData = indexOfLastData - pageSize;
    const currentData = Skala.slice(indexOfFirstData, indexOfLastData);

    const handlePageNavigation = (page) => {
        setPageCurrent(page);
    };

    const title = "Skala Penilaian";
    const breadcrumbs = [{ label: "Skala Penilaian" }];

    return (
        <div className="d-flex flex-column min-vh-100">
            <main className="flex-grow-1" style={{ marginTop: '80px' }}>
                <div className="d-flex flex-column">
                    <div className="mb-0" style={{margin: isMobile ? "1rem" : "3rem"}}>
                        <PageTitleNav
                            title={title}
                            breadcrumbs={breadcrumbs}
                            onClick={() => navigate("/beranda")}
                        />
                    </div>
                    <div className="p-3 mt-2 mb-0" style={{ marginLeft: '50px', margin: isMobile ? "1rem" : "3rem"}}>
                        <Button iconName="add" classType="primary" label="Tambah Skala Penilaian" onClick={() => addModalRef.current.open()} />
                        <div className="row mt-5 ">
                            <div className="col-lg-10 col-md-6 ">
                                <SearchField />
                            </div>
                            <div className="col-lg-2 col-md-6">
                                <Filter />
                            </div>
                        </div>
                    </div>
                    <div className="table-container bg-white p-3 mt-0 rounded" style={{margin: isMobile ? "1rem" : "3rem"}}>
                        {/* <Table
                            arrHeader={["No", "Nama Skala Penilaian"]}
                            headerToDataMap={{
                                "No": "No",
                                "Nama Skala Penilaian": "Nama",
                            }}
                            data={currentData.map((item, index) => ({
                                key: item.id,
                                No: indexOfFirstData + index + 1,
                                Nama: item.Nama
                            }))}
                            actions={["Detail", "Edit", "Surveyor", "Responden"]}
                            onDetail={handleDetailSkala}
                            onEdit={handleSelectSkala}
                        /> */}
                            <Table
                            arrHeader={["No", "Nama Skala Penilaian"]}
                            headerToDataMap={{
                                "No": "No",
                                "Nama Skala Penilaian": "Nama",
                            }}
                            data={currentData.map((item, index) => ({
                                key: item.id, // Pastikan key cocok dengan id Skala
                                No: indexOfFirstData + index + 1,
                                Nama: item.Nama
                            }))}
                            actions={["Detail", "Edit", "Surveyor", "Responden"]}
                            onDetail={(id) => {
                                const selected = Skala.find((item) => item.id === id);
                                if (selected) handleDetailSkala(selected);
                            }}
                            onEdit={(id) => {
                                const selected = Skala.find((item) => item.id === id);
                                if (selected) handleSelectSkala(selected);
                            }}
                        />

                        <Paging
                            pageSize={pageSize}
                            pageCurrent={pageCurrent}
                            totalData={Skala.length}
                            navigation={handlePageNavigation}
                        />
                    </div>
                </div>
            </main>

            {/* ADD MODAL */}
            <Modal
                ref={addModalRef}
                title="Tambah Skala Penilaian"
                size="full"
                Button1={<Button classType="primary" label="Simpan" onClick={handleAddSkala} />}
            >
                <TextField label="Skala Penilaian" isRequired={true} onChange={(e) => setFormData({ ...formData, name: e.target.value })} value={formData.name} />
              
            </Modal>

            {/* EDIT MODAL */}
            <Modal
                ref={updateModalRef}
                title="Update Skala Penilaian"
                size="medium"
                Button1={<Button label="Update" onClick={handleUpdateSkala} />}
            >
                <TextField label="Skala Penilaian" isRequired={true} onChange={(e) => setFormData({ ...formData, name: e.target.value })} value={formData.name} />
            </Modal>

            {/* DETAIL MODAL */}
            <Modal
                ref={detailModalRef}
                title="Detail Skala Penilaian"
                size="medium"
                Button1={<Button classType="secondary" label="Tutup" onClick={() => detailModalRef.current.close()} />}
            >
                <label htmlFor="" className="fw-bold">Nama Skala Penilaian</label>
                <br />
                <p>{selectedSkala ? selectedSkala.Nama : "Data tidak tersedia"}</p>
            </Modal>
        </div>
    );
}
