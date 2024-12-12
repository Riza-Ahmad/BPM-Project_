import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Index from './Index';
import Add from './Add';
import Detail from './Detail'
import ScrollToTop from '../../../part/ScrollToTop';

export default function Survei(){
    const navigate = useNavigate();

    const handlePageChange = (page, withState = {}) => {
        switch (page) {
            case "index":
                navigate("/survei");
                break;
            case "add":
            navigate("/survei/survei/tambah");
            break;
            case "detail":
            navigate("/survei/survei/detail");
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
                <Route path="/tambah" element={<Add onChangePage={handlePageChange}/>}/>
                <Route path="/detail" element={<Detail onChangePage={handlePageChange}/>}/>
            </Routes>
        </>
    )
}