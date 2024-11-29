import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Index from './Index';
import ScrollToTop from '../../../part/ScrollToTop';

export default function Pertanyaan_Survei(){
    const navigate = useNavigate();

    const handlePageChange = (page, withState = {}) => {
        switch (page) {
            case "index":
                navigate("/survei/pertanyaan");
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
                           
            </Routes>
        </>
    )
}