import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageTitleNav from "../../../part/PageTitleNav";
import HeaderForm from "../../../part/HeaderText";
import { API_LINK } from "../../../util/Constants";
import { useIsMobile } from "../../../util/useIsMobile";
import Button from "../../../part/Button";
import DropDown from "../../../part/Dropdown";
import SweetAlert from "../../../util/SweetAlert";
import { useFetch } from "../../../util/useFetch";

export default function Add({ onChangePage }) {
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    skp_tipe: "",
    scale: 1,
    descriptions: [],
    skp_deskripsi: "",
    checkedValues: [],
  });

  const [errors, setErrors] = useState({
    skp_tipe: false,
    descriptions: false,
    skp_deskripsi: false,
  });

  const validateForm = () => {
    const newErrors = {
      skp_tipe: !formData.skp_tipe,
      scale: formData.scale <= 0,
      descriptions: false,
      skp_deskripsi: false,
    };

    // Validate descriptions for RadioButton and CheckBox
    if (
      formData.skp_tipe === "RadioButton" ||
      formData.skp_tipe === "CheckBox"
    ) {
      newErrors.descriptions =
        formData.descriptions.length !== formData.scale ||
        formData.descriptions.some((desc) => !desc.trim());
    }

    // Validate TextBox and TextArea
    if (formData.skp_tipe === "TextBox" || formData.skp_tipe === "TextArea") {
      newErrors.skp_deskripsi = !formData.skp_deskripsi.trim();
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  const renderErrorMessage = (errorType) => {
    return errors[errorType] ? (
      <div className="text-danger mt-1" style={{ fontSize: "0.8rem" }}>
        {errorType === "skp_tipe" && "Tipe skala harus dipilih"}
        {errorType === "scale" && "Skala harus lebih besar dari 0"}
        {errorType === "descriptions" && "Semua deskripsi harus diisi"}
        {errorType === "skp_deskripsi" && "Deskripsi tidak boleh kosong"}
      </div>
    ) : null;
  };

  const handleTypeChange = (e) => {
    const value = e.target.value;
    setFormData({
      ...formData,
      skp_tipe: value,
      scale: 1,
      descriptions: [],
      skp_deskripsi: "",
      checkedValues: [],
    });

    setErrors((prev) => ({
      ...prev,
      skp_tipe: !value,
    }));
  };

  const handleSave = async () => {
    if (!validateForm()) {
      await SweetAlert(
        "Peringatan!",
        "Harap lengkapi semua data yang diperlukan.",
        "warning",
        "OK"
      );
      return;
    }

    try {
      let deskripsiToSend;

      if (formData.skp_tipe === "TextBox" || formData.skp_tipe === "TextArea") {
        deskripsiToSend = formData.skp_deskripsi;
      } else {
        deskripsiToSend = formData.descriptions.join(", ");
      }

      const payload = {
        skp_skala: formData.scale,
        skp_deskripsi: deskripsiToSend,
        skp_tipe: formData.skp_tipe,
      };

      const response = await useFetch(
        `${API_LINK}/SkalaPenilaian/CreateSkalaPenilaian`,
        payload,
        "POST"
      );

      if (response === "ERROR") {
        throw new Error("Gagal menyimpan skala penilaian.");
      } else {
        await SweetAlert(
          "Berhasil!",
          "Data berhasil Disimpan.",
          "success",
          "OK"
        );
        navigate("/survei/skala"); // Kembali ke halaman survei/skala
      }
    } catch (error) {
      console.error("Error saving skala penilaian:", error);
      SweetAlert("Gagal!", error.message, "error", "OK");
    }
  };

  const handleCancel = () => {
    navigate("/survei/skala");
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <main className="flex-grow-1 p-3" style={{ marginTop: "80px" }}>
        <div className="d-flex flex-column">
          <PageTitleNav
            title="Tambah Skala Penilaian"
            breadcrumbs={[
              { label: "Skala", href: "/survei/skala" },
              { label: "Tambah Skala Penilaian" },
            ]}
            onClick={() => navigate("/survei/skala")}
          />
          <div className={isMobile ? "m-0" : "m-3"}>
            <div
              className={
                isMobile
                  ? "shadow p-4 m-2 mt-0 bg-white rounded"
                  : "shadow p-5 m-5 mt-0 bg-white rounded"
              }
            >
              <HeaderForm label="Tambah Skala Penilaian" />

              <DropDown
                type="pilih"
                label="Tipe Skala"
                isRequired
                forInput="skp_tipe"
                value={formData.skp_tipe}
                onChange={handleTypeChange}
                arrData={[
                  { Value: "RadioButton", Text: "RadioButton" },
                  { Value: "TextBox", Text: "TextBox" },
                  { Value: "TextArea", Text: "TextArea" },
                  { Value: "CheckBox", Text: "CheckBox" },
                ]}
              />
              {renderErrorMessage("skp_tipe")}

              {formData.skp_tipe === "TextBox" && (
                <div style={{ marginTop: "20px" }}>
                  <div>
                    <label style={{ fontWeight: "bold", marginBottom: "10px" }}>
                      Preview <span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Masukkan Text Box"
                      value={formData.skp_deskripsi}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          skp_deskripsi: e.target.value,
                        })
                      }
                      style={{
                        width: "100%",
                        padding: "10px",
                        border: "1px solid #ccc",
                        borderRadius: "5px",
                      }}
                    />
                    {renderErrorMessage("skp_deskripsi")}
                  </div>
                </div>
              )}

              {formData.skp_tipe === "TextArea" && (
                <div style={{ marginTop: "20px" }}>
                  <div>
                    <label style={{ fontWeight: "bold", marginBottom: "10px" }}>
                      Preview <span style={{ color: "red" }}>*</span>
                    </label>
                    <textarea
                      rows="4"
                      placeholder="Masukkan Text Area"
                      value={formData.skp_deskripsi}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          skp_deskripsi: e.target.value,
                        })
                      }
                      style={{
                        width: "100%",
                        padding: "10px",
                        border: "1px solid #ccc",
                        borderRadius: "5px",
                      }}
                    />
                    {renderErrorMessage("skp_deskripsi")}
                  </div>
                </div>
              )}

              {formData.skp_tipe === "RadioButton" && (
                <div style={{ marginTop: "20px" }}>
                  <div style={{ marginBottom: "20px" }}>
                    <label>
                      <strong>
                        Skala <span style={{ color: "red" }}>*</span>
                      </strong>
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={formData.scale}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          scale: Number(e.target.value),
                          name: null,
                        })
                      }
                      style={{
                        display: "block",
                        width: "80px",
                        padding: "5px",
                        marginTop: "5px",
                        border: "1px solid #ccc",
                        borderRadius: "5px",
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: "20px" }}>
                    <label>
                      <strong>Preview</strong>
                    </label>
                    <div style={{ marginTop: "10px" }}>
                      {Array.from(
                        { length: formData.scale },
                        (_, i) => i + 1
                      ).map((value) => (
                        <label
                          key={value}
                          style={{
                            marginRight: "15px",
                            display: "inline-flex",
                            alignItems: "center",
                          }}
                        >
                          <input
                            type="radio"
                            name="preview"
                            value={value}
                            checked={formData.name === String(value)}
                            onChange={(e) =>
                              setFormData({ ...formData, name: e.target.value })
                            }
                            style={{ marginRight: "5px" }}
                          />
                          {value}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label>
                      <strong>
                        Deskripsi Nilai <span style={{ color: "red" }}>*</span>
                      </strong>
                    </label>
                    {Array.from({ length: formData.scale }, (_, i) => (
                      <div key={i} style={{ marginBottom: "10px" }}>
                        <input
                          type="text"
                          placeholder={`Deskripsi untuk nilai ${i + 1}`}
                          value={formData.descriptions[i] || ""}
                          onChange={(e) => {
                            const newDescriptions = [...formData.descriptions];
                            newDescriptions[i] = e.target.value;
                            setFormData({
                              ...formData,
                              descriptions: newDescriptions,
                            });
                          }}
                          style={{
                            width: "100%",
                            padding: "5px",
                            border: "1px solid #ccc",
                            borderRadius: "5px",
                          }}
                        />
                      </div>
                    ))}
                    {renderErrorMessage("descriptions")}
                  </div>

                  <p
                    style={{
                      marginTop: "10px",
                      color: "#555",
                      fontStyle: "italic",
                    }}
                  >
                    {formData.name
                      ? formData.descriptions[Number(formData.name) - 1] ||
                        "Deskripsi belum diisi."
                      : "Pilih skala untuk melihat deskripsi."}
                  </p>
                </div>
              )}

              {formData.skp_tipe === "CheckBox" && (
                <div style={{ marginTop: "20px" }}>
                  <div style={{ marginBottom: "20px" }}>
                    <label>
                      <strong>
                        Skala <span style={{ color: "red" }}>*</span>
                      </strong>
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={formData.scale}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          scale: Number(e.target.value),
                          checkedValues: [],
                        })
                      }
                      style={{
                        display: "block",
                        width: "80px",
                        padding: "5px",
                        marginTop: "5px",
                        border: "1px solid #ccc",
                        borderRadius: "5px",
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: "20px" }}>
                    <label>
                      <strong>Preview</strong>
                    </label>
                    <div style={{ marginTop: "10px" }}>
                      {Array.from(
                        { length: formData.scale },
                        (_, i) => i + 1
                      ).map((value) => (
                        <label
                          key={value}
                          style={{
                            marginRight: "15px",
                            display: "inline-flex",
                            alignItems: "center",
                          }}
                        >
                          <input
                            type="checkbox"
                            value={value}
                            checked={formData.checkedValues?.includes(value)}
                            onChange={(e) => {
                              const checkedValues =
                                formData.checkedValues || [];
                              if (e.target.checked) {
                                setFormData({
                                  ...formData,
                                  checkedValues: [...checkedValues, value],
                                });
                              } else {
                                setFormData({
                                  ...formData,
                                  checkedValues: checkedValues.filter(
                                    (v) => v !== value
                                  ),
                                });
                              }
                            }}
                            style={{ marginRight: "5px" }}
                          />
                          {value}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label>
                      <strong>
                        Deskripsi Nilai <span style={{ color: "red" }}>*</span>
                      </strong>
                    </label>
                    {Array.from({ length: formData.scale }, (_, i) => (
                      <div key={i} style={{ marginBottom: "10px" }}>
                        <input
                          type="text"
                          placeholder={`Deskripsi untuk nilai ${i + 1}`}
                          value={formData.descriptions[i] || ""}
                          onChange={(e) => {
                            const newDescriptions = [...formData.descriptions];
                            newDescriptions[i] = e.target.value;
                            setFormData({
                              ...formData,
                              descriptions: newDescriptions,
                            });
                          }}
                          style={{
                            width: "100%",
                            padding: "5px",
                            border: "1px solid #ccc",
                            borderRadius: "5px",
                          }}
                        />
                      </div>
                    ))}
                    {renderErrorMessage("descriptions")}
                  </div>

                  <p
                    style={{
                      marginTop: "10px",
                      color: "#555",
                      fontStyle: "italic",
                    }}
                  >
                    {formData.checkedValues?.length > 0
                      ? `Nilai dipilih: ${formData.checkedValues.join(", ")}`
                      : "Tidak ada nilai yang dipilih."}
                  </p>
                  <ul>
                    {formData.checkedValues?.map((value) => (
                      <li key={value}>
                        {value}:{" "}
                        {formData.descriptions[value - 1] ||
                          "Deskripsi belum diisi."}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="d-flex justify-content-between align-items-center mt-4">
                <div className="flex-grow-1 m-2">
                  <Button
                    width="100%"
                    label="Simpan"
                    classType="primary"
                    onClick={handleSave}
                  />
                </div>
                <div className="flex-grow-1 m-2">
                  <Button
                    width="100%"
                    label="Batal"
                    classType="danger"
                    onClick={handleCancel}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
