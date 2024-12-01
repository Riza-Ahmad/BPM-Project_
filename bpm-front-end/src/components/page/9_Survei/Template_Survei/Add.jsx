import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../../part/Button";
import TextField from "../../../part/TextField";
import Table from "../../../part/Table";
import Dropdown from "../../../part/Dropdown";
import Modal from "../../../part/Modal";
import { useIsMobile } from "../../../util/useIsMobile";
import PageTitleNav from "../../../part/PageTitleNav";

function Add() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [questions, setQuestions] = useState([
    { id: 1, header: "", question: "", scale: "Radio Button" },
    { id: 2, header: "", question: "", scale: "Text Area" },
    { id: 3, header: "", question: "", scale: "Radio Button" },
    { id: 4, header: "", question: "", scale: "Check Box" },
    { id: 5, header: "", question: "", scale: "Radio Button" },
  ]);

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: questions.length + 1,
        header: "",
        question: "",
        scale: "Radio Button",
      },
    ]);
  };

  const handleDeleteQuestion = (id) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  const handleInputChange = (id, field, value) => {
    setQuestions(
      questions.map((q) => (q.id === id ? { ...q, [field]: value } : q))
    );
  };

  const handleSave = () => {
    console.log("Template disimpan dengan pertanyaan:", questions);
    navigate("/survei/template");
  };

  const handleCancel = () => {
    navigate("/survei/template");
  };

  const title = "Tambah Template Survei";
  const breadcrumbs = [
    { label: "Survei/Template Survei/Tambah Template Survei" },
  ];

  return (
    <div className="d-flex flex-column min-vh-100">
      <main className="flex-grow-1" style={{ marginTop: "80px" }}>
        <div className="d-flex flex-column" style={{ padding: "0 3rem" }}>
          <div
            className="mb-0"
            style={{
              display: "flex",
              justifyContent: "space-between", // Align breadcrumbs and title
              alignItems: "center",
            }}
          >
            <PageTitleNav
              title={title}
              breadcrumbs={breadcrumbs}
              onClick={() => navigate("/survei/template")}
            />
          </div>

          <div
            className="form-container" // Added container class for shadow
            style={{
              marginTop: "2rem", // Spacing between breadcrumb and form
              padding: isMobile ? "1rem" : "2rem", // Padding for the form
              borderRadius: "8px", // Rounded corners
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)", // Shadow effect
              backgroundColor: "#fff", // White background
            }}
          >
            <div
              className="form-section"
              style={{
                marginBottom: isMobile ? "1rem" : "2rem",
              }}
            >
              <h3
                style={{
                  fontSize: isMobile ? "1.25rem" : "1.5rem",
                  textAlign: "center",
                }}
              >
                Formulir Template Survei
                <hr />
              </h3>
              <form>
                <TextField
                  label="Nama Template"
                  isRequired={true}
                  placeholder="Masukkan Nama Template"
                  style={{
                    marginBottom: isMobile ? "1rem" : "2rem",
                  }}
                />
                <TextField
                  label="Kriteria Survei"
                  isRequired={true}
                  placeholder="Masukkan Kriteria Survei"
                  style={{
                    marginBottom: isMobile ? "1rem" : "2rem",
                  }}
                />
                <Dropdown
                  label="Skala Penilaian"
                  isRequired={true}
                  options={[
                    { label: "Radio Button", value: "Radio Button" },
                    { label: "Text Box", value: "Text Box" },
                    { label: "Check Box", value: "Check Box" },
                    { label: "Text Area", value: "Text Area" },
                  ]}
                  selectedValue="Radio Button" // Set default value
                  onChange={(value) => console.log(value)} // Handle change event
                  required
                  style={{ width: isMobile ? "100%" : "auto" }}
                />
              </form>
            </div>

            <div
              className="question-section"
              style={{
                marginBottom: isMobile ? "1rem" : "2rem",
              }}
            >
              <h3 className="text-center">
                Tambah Pertanyaan
                <hr />
              </h3>
              <div className="mb-3">
                <Button
                  iconName="add"
                  classType="primary"
                  label="Tambah Pertanyaan Baru"
                  onClick={handleAddQuestion}
                  style={{
                    marginBottom: isMobile ? "1rem" : "2rem",
                  }}
                />
              </div>

              <Table
                arrHeader={["No", "Header", "Pertanyaan", "Skala"]}
                headerToDataMap={{
                  No: "No",
                  Header: "header",
                  Pertanyaan: "question",
                  Skala: "scale",
                }}
                data={questions.map((q, index) => ({
                  key: q.id,
                  No: index + 1,
                  header: q.header,
                  question: q.question,
                  scale: q.scale,
                }))}
                actions={["Delete"]}
                onDelete={(id) => handleDeleteQuestion(id)}
              />
            </div>

            <div
              className="action-buttons"
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: isMobile ? "1rem" : "2rem",
              }}
            >
              <Button classType="primary" label="Simpan" onClick={handleSave} />
              <Button
                classType="secondary"
                label="Batal"
                onClick={handleCancel}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Add;
