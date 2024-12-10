import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Index from './Index';
import Add from './Add';
import Edit from './Edit';
import ScrollToTop from '../../../part/ScrollToTop';
import Detail from './Detail';

export default function Pertanyaan_Survei(){
    const navigate = useNavigate();

    const handlePageChange = (page, withState = {}) => {
        switch (page) {
            case "index":
                navigate("/survei/pertanyaan");
                break;
            case "add":
                navigate("/survei/pertanyaan/tambah");
                break;
            case "edit":
                navigate("/survei/pertanyaan/edit"); 
                break;
            case "detail":
                navigate("/survei/pertanyaan/detail");
                break;
            default:
                console.warn(`Halaman "${page}" tidak dikenali.`);
                break;
        }
    };

    return(
        <>
            <ScrollToTop/>
            <Routes>
                <Route path="/survei/pertanyaan" element={<Index onChangePage={handlePageChange}/>}/>
                <Route path="/survei/pertanyaan/tambah" element={<Add onChangePage={handlePageChange}/>}/>
                <Route path="/survei/pertanyaan/edit" element={<Edit onChangePage={handlePageChange}/>}/>
                <Route path="/survei/pertanyaan/detail" element={<Detail onChangePage={handlePageChange}/>}/>
            </Routes>
        </>
    )
}