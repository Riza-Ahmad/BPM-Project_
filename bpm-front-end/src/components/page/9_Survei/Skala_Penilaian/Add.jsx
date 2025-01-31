import React, { useState } from "react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageTitleNav from "../../../part/PageTitleNav";
import HeaderForm from "../../../part/HeaderText";
import { API_LINK } from "../../../util/Constants";
import Button from "../../../part/Button";
import DropDown from "../../../part/Dropdown";
import SweetAlert from "../../../util/SweetAlert";
import { useIsMobile } from "../../../util/useIsMobile";

export default function Add({ onChangePage }) {
  const scaleTypes = {
    textarea: "TextArea",
    textbox: "TextBox",
    checkbox: "CheckBox",
    radio: "RadioButton",
  };

  const dropdownOptions = [
    { value: scaleTypes.radio, text: "RadioButton" },
    { value: scaleTypes.textbox, text: "TextBox" },
    { value: scaleTypes.textarea, text: "TextArea" },
    { value: scaleTypes.checkbox, text: "CheckBox" },
  ];

  const initialFormState = {
    name: "",
    skp_tipe: "",
    scale: 1,
    descriptions: [],
    skp_deskripsi: "",
    checkedValues: [],
  };

  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialFormState);

  const handleTypeChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
      [name]: value,
      scale: 1,
      descriptions: [],
      skp_deskripsi: "",
      checkedValues: [],
    });
  };

  
  const handleSave = async () => {
    try {
      const response = await fetch(
        `${API_LINK}/SkalaPenilaian/CreateSkalaPenilaian`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            skp_skala: formData.scale,
            skp_deskripsi: formData.descriptions.join(", "), // Gabungkan deskripsi jika perlu
            skp_tipe: formData.type,
            skp_created_by: "Admin", // Ganti dengan nilai yang sesuai
          }),
        }
      );

      if (response.ok) {
        alert("Skala berhasil ditambahkan!");
        navigate("/survei/skala");
      } else {
        const errorData = await response.json();
        alert(
          `Gagal menyimpan data: ${
            errorData.message || "Error tidak diketahui."
          }`
        );
      }
    } catch (error) {
      alert(`Terjadi kesalahan: ${error.message}`);
    }
  };

  const handleCancel = () => {
    navigate("/survei/skala");
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f4f4f4",
      }}
    >
      <div
        style={{
          padding: "30px",
          maxWidth: "800px",
          width: "100%",
          backgroundColor: "#fff",
          borderRadius: "10px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h2
          style={{ textAlign: "center", marginBottom: "20px", color: "#333" }}
        >
          Tambah Skala Penilaian
        </h2>

        {/* Dropdown untuk memilih tipe */}
        <div className="mb-3">
          <label>
            <strong>Tipe Skala:</strong>
          </label>
          <select
            className="form-select"
            value={formData.type}
            onChange={handleTypeChange}
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "5px",
              marginTop: "5px",
            }}
          >
            <option value="">Pilih tipe skala...</option>
            <option value="Radio Button">Radio Button</option>
            <option value="TextBox">TextBox</option>
            <option value="TextArea">TextArea</option>
            <option value="CheckBox">CheckBox</option>
          </select>
        </div>

        {/* Kondisional untuk tipe */}
        {formData.type === "Radio Button" && (
          <div style={{ marginTop: "20px" }}>
            {/* Input untuk skala */}
            <div style={{ marginBottom: "20px" }}>
              <label>
                <strong>Skala *</strong>
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={formData.scale || 4}
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

            {/* Preview */}
            <div style={{ marginBottom: "20px" }}>
              <label>
                <strong>Preview</strong>
              </label>
              <div style={{ marginTop: "10px" }}>
                {Array.from(
                  { length: formData.scale || 4 },
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
  const handleSave = async () => {
    try {
      const deskripsiToSend = isTextInput(formData.skp_tipe)
        ? formData.skp_deskripsi
        : formData.descriptions.join(", ");

      const response = await fetch(
        `${API_LINK}/SkalaPenilaian/CreateSkalaPenilaian`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            skp_skala: formData.scale,
            skp_deskripsi: deskripsiToSend,
            skp_tipe: formData.skp_tipe,
            skp_created_by: "Admin",
          }),
        }
      );

      if (response.ok) {
        await SweetAlert(
          "Berhasil!",
          "Data berhasil Disimpan.",
          "success",
          "OK"
        );
        navigate("/survei/skala");
      } else {
        const errorData = await response.json();
        alert(
          `Gagal menyimpan data: ${
            errorData.message || "Error tidak diketahui."
          }`
        );
      }
    } catch (error) {
      alert(`Terjadi kesalahan: ${error.message}`);
    }
  };

  const handleCancel = () => {
    onChangePage("index");
  };

  const isTextInput = (type) =>
    type === scaleTypes.textbox || type === scaleTypes.textarea;

  const renderTextBox = () => (
    <div className="mt-3">
      <div>
        <label className="form-label fw-bold">Deskripsi</label>
        <input
          type="text"
          className="form-control"
          placeholder="Masukkan Text Box"
          value={formData.skp_deskripsi}
          onChange={(e) =>
            setFormData({
              ...formData,
              skp_deskripsi: e.target.value,
            })
          }
        />
      </div>
    </div>
  );

            {/* Input deskripsi nilai */}
            <div>
              <label>
                <strong>Deskripsi Nilai *</strong>
              </label>
              {Array.from({ length: formData.scale || 4 }, (_, i) => (
                <div key={i} style={{ marginBottom: "10px" }}>
                  <input
                    type="text"
                    placeholder={`Deskripsi untuk nilai ${i + 1}`}
                    value={formData.descriptions?.[i] || ""}
                    onChange={(e) => {
                      const newDescriptions = [
                        ...(formData.descriptions || []),
                      ];
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
            </div>

            {/* Tampilkan deskripsi berdasarkan pilihan */}
            <p
              style={{
                marginTop: "10px",
                color: "#555",
                fontStyle: "italic",
              }}
            >
              {formData.name
                ? formData.descriptions?.[Number(formData.name) - 1] ||
                  "Deskripsi belum diisi."
                : "Pilih skala untuk melihat deskripsi."}
            </p>
          </div>
        )}

        {formData.type === "TextBox" && (
          <div style={{ marginTop: "20px" }}>
            <label>
              <strong>Input TextBox:</strong>
            </label>
            <textarea
              rows="1"
              cols="50"
              className="form-control"
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              value={formData.name || ""}
              style={{
                width: "100%",
                padding: "5px",
                border: "1px solid #ccc",
                borderRadius: "5px",
              }}
            />
            <div style={{ marginTop: "20px" }}>
              <label>
                <strong>Deskripsi:</strong>
              </label>
              <input
                type="text"
                placeholder="Deskripsi untuk TextBox"
                value={formData.descriptions[0] || ""}
                onChange={(e) => {
                  const newDescriptions = [...(formData.descriptions || [])];
                  newDescriptions[0] = e.target.value;
                  setFormData({ ...formData, descriptions: newDescriptions });
                }}
                style={{
                  width: "100%",
                  padding: "5px",
                  border: "1px solid #ccc",
                  borderRadius: "5px",
                  marginTop: "10px",
                }}
              />
            </div>
          </div>
        )}

        {formData.type === "TextArea" && (
          <div style={{ marginTop: "20px" }}>
            <label>
              <strong>Input TextArea:</strong>
            </label>
            <textarea
              rows="4"
              cols="50"
              className="form-control"
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              value={formData.name}
              style={{
                width: "100%",
                padding: "5px",
                border: "1px solid #ccc",
                borderRadius: "5px",
              }}
            />
            <div style={{ marginTop: "20px" }}>
              <label>
                <strong>Deskripsi:</strong>
              </label>
              <input
                type="text"
                placeholder="Deskripsi untuk TextArea"
                value={formData.descriptions[0] || ""}
                onChange={(e) => {
                  const newDescriptions = [...(formData.descriptions || [])];
                  newDescriptions[0] = e.target.value;
                  setFormData({ ...formData, descriptions: newDescriptions });
                }}
                style={{
                  width: "100%",
                  padding: "5px",
                  border: "1px solid #ccc",
                  borderRadius: "5px",
                  marginTop: "10px",
                }}
              />
            </div>
          </div>
        )}

        {formData.type === "CheckBox" && (
          <div style={{ marginTop: "20px" }}>
            {/* Input untuk skala */}
            <div style={{ marginBottom: "20px" }}>
              <label>
                <strong>Skala *</strong>
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={formData.scale || 4}
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
  const renderTextArea = () => (
    <div style={{ marginTop: "20px" }}>
      <div>
        <label style={{ fontWeight: "bold", marginBottom: "10px" }}>
          Deskripsi
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
      </div>
    </div>
  );

  const renderScaleInput = () => (
    <div style={{ marginBottom: "20px" }}>
      <label>
        <strong>Skala *</strong>
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
            [formData.skp_tipe === scaleTypes.radio ? "name" : "checkedValues"]:
              formData.skp_tipe === scaleTypes.radio ? null : [],
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
  );

            {/* Preview */}
            <div style={{ marginBottom: "20px" }}>
              <label>
                <strong>Preview</strong>
              </label>
              <div style={{ marginTop: "10px" }}>
                {Array.from(
                  { length: formData.scale || 4 },
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
                        const checkedValues = formData.checkedValues || [];
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
  const renderOptionPreview = (type) => (
    <div style={{ marginBottom: "20px" }}>
      <label>
        <strong>Preview</strong>
      </label>
      <div style={{ marginTop: "10px" }}>
        {Array.from({ length: formData.scale }, (_, i) => i + 1).map(
          (value) => (
            <label
              key={value}
              style={{
                marginRight: "15px",
                display: "inline-flex",
                alignItems: "center",
              }}
            >
              <input
                type={type}
                name={type === "radio" ? "preview" : undefined}
                value={value}
                checked={
                  type === "radio"
                    ? formData.name === String(value)
                    : formData.checkedValues?.includes(value)
                }
                onChange={(e) => {
                  if (type === "radio") {
                    setFormData({ ...formData, name: e.target.value });
                  } else {
                    const checkedValues = formData.checkedValues || [];
                    const newValues = e.target.checked
                      ? [...checkedValues, value]
                      : checkedValues.filter((v) => v !== value);
                    setFormData({ ...formData, checkedValues: newValues });
                  }
                }}
                style={{ marginRight: "5px" }}
              />
              {value}
            </label>
          )
        )}
      </div>
    </div>
  );

            {/* Input deskripsi nilai */}
            <div>
              <label>
                <strong>Deskripsi Nilai *</strong>
              </label>
              {Array.from({ length: formData.scale || 4 }, (_, i) => (
                <div key={i} style={{ marginBottom: "10px" }}>
                  <input
                    type="text"
                    placeholder={`Deskripsi untuk nilai ${i + 1}`}
                    value={formData.descriptions?.[i] || ""}
                    onChange={(e) => {
                      const newDescriptions = [
                        ...(formData.descriptions || []),
                      ];
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
            </div>
  const renderDescriptionInputs = () => (
    <div>
      <label>
        <strong>Deskripsi Nilai *</strong>
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
    </div>
  );

            {/* Tampilkan deskripsi berdasarkan pilihan */}
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
                  {formData.descriptions?.[value - 1] ||
                    "Deskripsi belum diisi."}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Tombol aksi */}
        <div style={{ marginTop: "20px", textAlign: "right" }}>
          <button
            className="btn btn-primary"
            onClick={handleSave}
            style={{ marginRight: "10px", padding: "10px 20px" }}
          >
            Simpan
          </button>
          <button
            className="btn btn-secondary"
            onClick={handleCancel}
            style={{ padding: "10px 20px" }}
          >
            Batal
          </button>
        </div>
      </div>
  const renderSelectedValues = () => {
    if (formData.skp_tipe !== scaleTypes.checkbox) return null;

    return (
      <>
        <p style={{ marginTop: "10px", color: "#555", fontStyle: "italic" }}>
          {formData.checkedValues?.length > 0
            ? `Nilai dipilih: ${formData.checkedValues.join(", ")}`
            : "Tidak ada nilai yang dipilih."}
        </p>
        <ul>
          {formData.checkedValues?.map((value) => (
            <li key={value}>
              {value}:{" "}
              {formData.descriptions[value - 1] || "Deskripsi belum diisi."}
            </li>
          ))}
        </ul>
      </>
    );
  };

  const renderRadioDescription = () => {
    if (formData.skp_tipe !== scaleTypes.radio) return null;

    return (
      <p style={{ marginTop: "10px", color: "#555", fontStyle: "italic" }}>
        {formData.name
          ? formData.descriptions[Number(formData.name) - 1] ||
            "Deskripsi belum diisi."
          : "Pilih skala untuk melihat deskripsi."}
      </p>
    );
  };

  const renderTypeSpecificInputs = () => {
    switch (formData.skp_tipe) {
      case scaleTypes.textbox:
        return renderTextBox();
      case scaleTypes.textarea:
        return renderTextArea();
      case scaleTypes.radio:
        return (
          <div style={{ marginTop: "20px" }}>
            {renderScaleInput()}
            {renderOptionPreview("radio")}
            {renderDescriptionInputs()}
            {renderRadioDescription()}
          </div>
        );
      case scaleTypes.checkbox:
        return (
          <div style={{ marginTop: "20px" }}>
            {renderScaleInput()}
            {renderOptionPreview("checkbox")}
            {renderDescriptionInputs()}
            {renderSelectedValues()}
          </div>
        );
      default:
        return null;
    }
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
            onClick={() => onChangePage("index")}
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
                onChange={(e) => handleTypeChange("skp_tipe", e.target.value)}
                arrData={dropdownOptions.map((option) => ({
                  Value: option.value,
                  Text: option.text,
                }))}
              />

              {renderTypeSpecificInputs()}

              <div className="d-flex justify-content-between align-items-center">
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
