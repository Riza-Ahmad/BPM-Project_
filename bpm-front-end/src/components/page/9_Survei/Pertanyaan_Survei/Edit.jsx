
import React, { useRef, useEffect, useState } from "react";
import PageTitleNav from "../../../part/PageTitleNav";
import { useLocation, useNavigate } from "react-router-dom";
import InputField from "../../../part/InputField";
import HeaderForm from "../../../part/HeaderText";
import Button from "../../../part/Button";
import Dropdown from "../../../part/Dropdown";
import { API_LINK } from "../../../util/Constants";
import RadioButton from "../../../part/RadioButton";
import SweetAlert from "../../../util/SweetAlert";

export default function Edit({ onChangePage, questionId }) {
  const title = "Edit Pertanyaan";
  const breadcrumbs = [
    { label: "Daftar Pertanyaan", href: "/survei/pertanyaan" },
    { label: "Edit Pertanyaan", href: `/survei/pertanyaan/edit/${questionId}` },
  ];

  const location = useLocation();
  const navigate = useNavigate();
  const [isPertanyaanUmumYes, setPertanyaanUmumYes] = useState(false);
  const [pertanyaan, setPertanyaan] = useState("");
  const [kriteriaSurvei, setKriteriaSurvei] = useState([]);
  const [skalaPenilaian, setSkalaPenilaian] = useState([]);
  const [responden, setResponden] = useState("");
  const [isHeader, setIsHeader] = useState(false);
  const [isStatus, setIsStatus] = useState(1);
  const [isGeneral, setIsGeneral] = useState(); // Set to "" initially, to handle radio input correctly
  const [createdBy, setCreatedBy] = useState("");
  const [selectedKriteriaSurvei, setSelectedKriteriaSurvei] = useState("");
  const [selectedSkalaPenilaian, setSelectedSkalaPenilaian] = useState("");
  const [pertanyaanId, setPertanyaanId] = useState("");

  useEffect(() => {
    const fetchDataSkala = async () => {
      try {
        const response = await fetch(
          `${API_LINK}/SkalaPenilaian/GetSkalaPenilaian`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({}),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        const formattedData = result.map((item) => ({
          Value: item.skp_id,
          Text: item.skp_tipe,
        }));

        setSkalaPenilaian(formattedData);
      } catch (error) {
        console.error("Error fetching SkalaPenilaian:", error);
      }
    };

    const fetchDataKriteria = async () => {
      try {
        const response = await fetch(
          `${API_LINK}/MasterKriteriaSurvei/GetDataKriteriaSurvei`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({}),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        const formattedData = result.map((item) => ({
          Value: item.ksr_id,
          Text: item.ksr_nama,
        }));

        setKriteriaSurvei(formattedData);
      } catch (error) {
        console.error("Error fetching KriteriaSurvei:", error);
      }
    };

    const fetchDataPertanyaan = async (pertanyaanId) => {
      try {
        const response = await fetch(
          `${API_LINK}/MasterPertanyaan/GetPertanyaanById`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ id: pertanyaanId }),
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        const pertanyaanData = result[0]; // Assuming it's an array with the first element containing the data
        setPertanyaanId(pertanyaanId);
        setPertanyaan(pertanyaanData.pty_pertanyaan);
        setIsHeader(pertanyaanData.pty_isheader);
        setIsGeneral(pertanyaanData.pty_isgeneral); // Correctly set the general question state
        setIsStatus(pertanyaanData.pty_status);
        setCreatedBy(pertanyaanData.pty_created_by);
        setSelectedKriteriaSurvei(pertanyaanData.ksr_id);
        setSelectedSkalaPenilaian(pertanyaanData.skp_id);

        if (pertanyaanData.pty_isgeneral === 1) {
          setPertanyaanUmumYes(true);
        } else if (pertanyaanData.pty_isgeneral === 0) {
          setPertanyaanUmumYes(false);
        }
      } catch (error) {
        console.error("Error fetching Pertanyaan data:", error);
      }
    };
    const pertanyaanId = location.state.idPertanyaan;

    fetchDataSkala();
    fetchDataKriteria();
    fetchDataPertanyaan(pertanyaanId);
  }, []);

  const handlePertanyaanUmumChange = (value) => {
    // setIsGeneral(value); // Directly set the value of isGeneral
    //setPertanyaanUmumYes(value === "Ya"); // Control the 'pertanyaanUmumYes' state based on radio value
    setIsGeneral(value === "Ya" ? 1 : 0); // Atur nilai isGeneral dengan angka
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      pertanyaanId,
      pertanyaan,
      isHeader: isHeader ? 1 : 0,
      isGeneral,
      isStatus,
      createdBy,
      selectedKriteriaSurvei,
      selectedSkalaPenilaian,
    };

    const confirm = await SweetAlert(
      "Konfirmasi",
      "Apakah Anda yakin ingin menyimpan perubahan?",
      "warning",
      "Ya",
      null,
      "",
      true // Menampilkan tombol batal
    );
    if (!confirm) {
      // Jika pengguna membatalkan, hentikan proses submit
      return;
    }

    try {
      const response = await fetch(
        `${API_LINK}/MasterPertanyaan/editPertanyaan`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      const result = await response.json();
      console.log("Hasil dari server:", result);
      await SweetAlert(
        "Berhasil",
        "Pertanyaan berhasil diperbarui!",
        "success"
      );
      onChangePage("index");
    } catch (error) {
      console.error("Error:", error);
      await SweetAlert("Error", `Terjadi kesalahan: ${error.message}`, "error");
    }
  };
  const handleCancel = () => {
    onChangePage("index");
  };

  const [selectedValue, setSelectedValue] = useState(""); // State untuk menyimpan nilai radio yang dipilih
  const radioRef = useRef(); // Referensi untuk akses fungsi internal komponen RadioButton

  return (
    <div className="d-flex flex-column min-vh-100">
      <main className="flex-grow-1 p-3" style={{ marginTop: "80px" }}>
        <div className="d-flex flex-column">
          <div className="m-3">
            <PageTitleNav
              title={title}
              breadcrumbs={breadcrumbs}
              onClick={() => onChangePage("index")}
            />
          </div>
          <div className="shadow p-5 m-5 mt-0 bg-white rounded">
            <HeaderForm label="Formulir Pertanyaan" />
            <form onSubmit={handleSubmit}>
              {/* Checkbox Header */}
              <div className="row">
                <div className="col-lg-12">
                  <label>
                    <strong>Header</strong>
                  </label>
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      checked={isHeader}
                      onChange={(e) => setIsHeader(e.target.checked)}
                    />
                  </div>
                </div>
              </div>
              {/* Pertanyaan Umum */}
              <div className="row">
                <label style={{ fontWeight: "bold" }}>
                  Pertanyaan Umum <span style={{ color: "red" }}>*</span>
                </label>
                <div className="custom-radio-dropdown">
                  {/* <RadioButton
                                    ref={radioRef} // Berikan referensi untuk validasi dan reset
                                    arrData={[
                                        { Value: "0", Text: "Tidak" },
                                        { Value: "1", Text: "Ya" },
                                    ]}
                                    label="Apakah ini pertanyaan umum?"
                                    name="pertanyaanUmum"
                                    isRequired={true} // Menjadikan pilihan wajib
                                    checked={isGeneral}
                                    value={!isGeneral}
                                    onChange={(e) => handlePertanyaanUmumChange(e.target.value)}
                                    // Perbarui nilai saat ada perubahan
                                    errorMessage="Harap pilih salah satu opsi." // Pesan kesalahan kustom
                                    /> */}

                  <div className="radio-item">
                    <input
                      type="radio"
                      id="ya"
                      name="pertanyaanUmum"
                      value="Ya"
                      required
                      checked={isGeneral === 1}
                      onChange={(e) => {
                        handlePertanyaanUmumChange(e.target.value);
                        setPertanyaanUmumYes(true);
                      }}
                    />
                    <label htmlFor="ya">Ya</label>
                  </div>
                  <div className="radio-item">
                    <input
                      type="radio"
                      id="tidak"
                      name="pertanyaanUmum"
                      value="Tidak"
                      required
                      checked={isGeneral === 0}
                      onChange={(e) => {
                        handlePertanyaanUmumChange(e.target.value);
                        setPertanyaanUmumYes(false);
                      }}
                    />
                    <label htmlFor="tidak">Tidak</label>
                  </div>
                </div>
              </div>
              {/* Input Pertanyaan */}
              <div className="row">
                <div className="col-lg-12 col-md-6">
                  <InputField
                    label="Pertanyaan"
                    value={pertanyaan}
                    onChange={(e) => setPertanyaan(e.target.value)}
                    isRequired={true}
                  />
                </div>
                <div className="col-lg-12 col-md-6">
                  <Dropdown
                    arrData={kriteriaSurvei}
                    label="Kriteria Survei"
                    isRequired={true}
                    onChange={(e) => setSelectedKriteriaSurvei(e.target.value)}
                    value={selectedKriteriaSurvei}
                    type="pilih"
                    forInput="kriteriaSurvei"
                    disabled={isPertanyaanUmumYes}
                  />
                </div>
                <div className="col-lg-12 col-md-6">
                  <Dropdown
                    arrData={skalaPenilaian}
                    label="Skala Penilaian"
                    isRequired={true}
                    onChange={(e) => setSelectedSkalaPenilaian(e.target.value)}
                    value={selectedSkalaPenilaian}
                    type="pilih"
                    forInput="skalaPenilaian"
                    disabled={isPertanyaanUmumYes}
                  />
                </div>
              </div>
              {/* Button Submit and Cancel */}
              <div className="row mt-3">
                <div className="col-md-6 text-center">
                  <Button
                    classType="primary"
                    type="submit"
                    label="Simpan"
                    width="100%"
                    onClick={handleSubmit}
                  />
                </div>
                <div className="col-md-6 text-center">
                  <Button
                    classType="danger"
                    type="button"
                    label="Batal"
                    width="100%"
                    onClick={handleCancel}
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
