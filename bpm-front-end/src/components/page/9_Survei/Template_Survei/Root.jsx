import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Index from './Index';
import ScrollToTop from '../../../part/ScrollToTop';
import Detail from '../Pertanyaan_Survei/Detail';

export default function Template_Survei(){
    const navigate = useNavigate();

    const handlePageChange = (page, withState = {}) => {
        switch (page) {
            case "index":
                navigate("/survei/template");
                break;
            case "add":
                navigate("/survei/template/add");
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
                <Route path="/" element={<Index onChangePage={handlePageChange}/>}/>
                <Route path="add" element={<Add onChangePage={handlePageChange}/>}/>
                         
            </Routes>
        </>
    )
}