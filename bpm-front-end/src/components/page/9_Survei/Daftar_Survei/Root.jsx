import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Index from './Index';
import ScrollToTop from '../../../part/ScrollToTop';

export default function Daftar_Survei(){
    const navigate = useNavigate();

    const handlePageChange = (page, withState = {}) => {
        switch (page) {
            case "index":
                navigate("/survei/daftar");
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
                <Route path="/survei/daftar" element={<Index onChangePage={handlePageChange}/>}/>
                           
            </Routes>
        </>
    )
}