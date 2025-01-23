import {
    BrowserRouter as Router,
    Routes,
    Route,
    useNavigate,
  } from "react-router-dom";
  import Index from "./Index";
  import ScrollToTop from "../../../part/ScrollToTop";
  import React from "react";
  
  export default function RingkasanAkre() {
    const navigate = useNavigate();
  
    const handlePageChange = () => {
      navigate("/");
    };
  
    return (
      <>
        <ScrollToTop />
        <Routes>
          <Route
            path="/"
            element={
              <Index
                onChangePage={handlePageChange}
                title={"Ringkasan Akreditasi Institusi dan Prodi"}
                breadcrumbs={[
                  { label: "SPME" },
                  { label: "Status Akreditasi" },
                  { label: "Ringkasan Akreditasi" },
                ]}
              />
            }
          />
        </Routes>
      </>
    );
  }
  