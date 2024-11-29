import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import IndexRencanaKegiatan from './RencanaKegiatan/Index'


export default function Tentang(){
    return(
        <>
            <Routes>
                <Route path="/kegiatan/jadwal" element={<IndexRencanaKegiatan />} />
            </Routes>
        </>
    )
}