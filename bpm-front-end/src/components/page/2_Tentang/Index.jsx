import React, { useState, useEffect } from "react";
import Orang from "../../../assets/element/orang.png";
import Logo from "../../../assets/bpm-logo.png";
import Bangunan from "../../../assets/element/bangunan.png";
import OrangLaptop from "../../../assets/element/orang-laptop.png";
import OrangKerja from "../../../assets/element/orang-kerja.png";
import Mahasiswa from "../../../assets/element/mahasiswa.png";
import Gedung from "../../../assets/element/gedung-astra.png";

import Text from "../../part/Text";
import HeaderText from "../../part/HeaderText";
import Button from "../../part/Button";
import Icon from "../../part/Icon";
import { API_LINK, TENTANGFILE_LINK } from "../../util/Constants";
import Loading from "../../part/Loading";
import { useIsMobile } from "../../util/useIsMobile";

export default function Index({ onChangePage }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isMobile = useIsMobile(); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching data...");
        const response = await fetch(API_LINK + '/api/MasterTentang/GetDataTentang', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            
          }),
        });

        console.log("Response status:", response.status);
        if (!response.ok) throw new Error("Network response was not ok");

        const result = await response.json();
        console.log("Fetched data:", result);
        setData(result); // Store fetched data here
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Gagal mengambil data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <Loading/>;
  if (error) return <p>{error}</p>;

  const handleDownloadClick = () => {
    const url = `${TENTANGFILE_LINK}${data[7].ten_isi}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      <div className="latarGradasi mt-5">
        <div className="position-absolute top-0 end-0 p-5" style={{ zIndex: 20 }}>
          <Button
            className="btn btn-primary"
            title="Kelola Tentang"
            label="Kelola Tentang"
            onClick={() => onChangePage("read")}
          />
        </div>

        <img src={Bangunan} alt="Bangunan" style={{
          position: 'absolute', bottom: '0', width: '100%', left: '0', zIndex: 1
        }} />

        <img src={Orang} alt="Orang" style={{
          position: 'absolute', bottom: '-30px', left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: '33vw', minWidth: '380px', zIndex: 2
        }} />

        <div style={{
          position: 'relative', zIndex: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'start', margin: '1rem', padding: '2rem', minHeight: '100vh', width: '800px'
        }}>
          <img src={Logo} alt="Logo" style={{ width: '200px', height: 'auto', marginBottom: '25px' }} />
          
          {data[0] && (
            <Text
              isi={data[0].ten_isi}
              alignText="center"
              ukuran="18px"
            />
          )}
        </div>
      </div>

      <div  className="shadow bg-white rounded" 
            style={{
              padding: isMobile ? "2rem" : "5rem", // Padding lebih kecil di mobile
              margin: isMobile ? "2rem" : "5rem", // Margin lebih kecil di mobile
              marginTop: "3rem",
            }}>
        <HeaderText
          label="Sejarah BPM"
          warna="#2654A1"
          alignText="left"
          fontWeight="700"
        />

        <div className="row align-items-center">
          <div className="col-lg-4 col-md-6">
            <img src={OrangLaptop} alt="Logo" style={{ width: '80%', height: 'auto', marginBottom: '25px' }} />
          </div>
          <div className="col-lg-8 col-md-6">
            {data[1] && (
              <Text
                isi={data[1].ten_isi}
                alignText="justify"
                ukuran="16px"
                warna="grey"
              />
            )}
          </div>
        </div>

        <div className="row">
          <div className="col-lg-5 col-md-6 mt-5">
            <div className="shadow p-4 mt-5 bg-white rounded">
              <HeaderText
                label="SK Pendirian BPM"
                warna="#2654A1"
                alignText="left"
                fontWeight="700"
                marginBottom="20px"
              />
              
              <Text
                  isi= "SK Pendirian BPM dapat diakses  dengan mengklik kolom dibawah ini:"
                  alignText="left"
                  ukuran="16px"
                  warna="grey"
                />  
              
              <Button
                className="btn btn-primary"
                title="Unduh SK Pendirian"
                label="Unduh SK Pendirian"
                iconName="download"
                onClick={handleDownloadClick}
              />
            </div>
          </div>
          <div className="col-lg-5 col-md-6">
            <img src={OrangKerja} alt="Logo" style={{ width: '100%', height: 'auto', marginBottom: '25px' }} />
          </div>
        </div>
      </div>

      <div className="flex-grow-1" style={{ backgroundColor: '#193756', padding: isMobile ? "2rem" : "4rem" }}>
        <div className="row">
          <div className="col-lg-6 col-md-6" style={{padding: isMobile ? "1rem" : "2rem"}}>
            <div className="card" style={{padding: isMobile ? "2rem" : "3rem"}}>
              <HeaderText
                label="Sasaran Badan Penjamin Mutu"
                warna="white"
                alignText="center"
                ukuran="25px"
                fontWeight="700"
              />
              {data[1] && (
                <Text
                  isi={data[2].ten_isi}
                  alignText="justify"
                  ukuran="16px"
                  warna="white"
                />
              )}
            </div>
          </div>
          <div className="col-lg-6 col-md-6" style={{padding: isMobile ? "1rem" : "2rem"}}>
            <div className="card" style={{padding: isMobile ? "2rem" : "3rem"}}>
              <HeaderText
                label="Strategi Badan Penjamin Mutu"
                warna="white"
                alignText="center"
                ukuran="25px"
                fontWeight="700"
              />
              {data[1] && (
                <Text
                  isi={data[3].ten_isi}
                  alignText="justify"
                  ukuran="16px"
                  warna="white"
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex-grow-1 p-5">
        <HeaderText
          label="Struktur BPM"
          warna="#2654A1"
          alignText="center"
          fontWeight="700"
          marginBottom="50px"
        />
        <img src={`${TENTANGFILE_LINK}${data[6].ten_isi}`} alt="Logo" style={{ width: '100%', height: 'auto', marginBottom: '25px' }} />
      </div>

      <div className="latarGradasi2">
        <div className="d-flex flex-column align-items-center justify-content-start m-5 p-3" style={{ minHeight: '100vh', width: '800px' }}>
          <Icon name="book-open-cover" cssClass="text-white" ukuran="80px" margin="10px" />
          
          <HeaderText label="Visi" warna="white" alignText="center" ukuran="35px" fontWeight="700" />
          {data[3] && (
            <Text isi={data[4].ten_isi} alignText="center" ukuran="18px" />
          )}

          <HeaderText label="Misi" warna="white" alignText="center" ukuran="35px" fontWeight="700" />
          {data[4] && (
            <Text isi={data[5].ten_isi} alignText="center" ukuran="18px" />
          )}

          <img src={Gedung} alt="Bangunan" style={{ position: 'absolute', width: '100%', height: 'auto', bottom:'0px' }} />
          <img src={Mahasiswa} alt="Orang" style={{ position: 'relative', width: '150%', height: 'auto', bottom:'-70px' }} />
        </div>
      </div>
    </>
  );
}
