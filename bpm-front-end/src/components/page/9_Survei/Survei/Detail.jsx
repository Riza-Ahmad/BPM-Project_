import React, { useState, useRef } from "react";
import PageTitleNav from "../../../part/PageTitleNav";
import InputField from "../../../part/InputField";
import TextArea from "../../../part/TextArea";
import HeaderForm from "../../../part/HeaderText";
import Button from "../../../part/Button";
import { API_LINK } from "../../../util/Constants";
import SweetAlert from "../../../util/SweetAlert";
import { useIsMobile } from "../../../util/useIsMobile";

export default function Detail({ onChangePage }) {
  const title = "Detail Survei";
  const breadcrumbs = [
    { label: "Survei", href: "/survei/survei" },
    { label: "Detail Survei" },
  ];
  const isMobile = useIsMobile();

  return (
    <div className="d-flex flex-column min-vh-100">
      <main className="flex-grow-1 p-3" style={{ marginTop: "80px" }}>
        <div className="d-flex flex-column">
          <PageTitleNav
            title={title}
            breadcrumbs={breadcrumbs}
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
              <HeaderForm label="Detail Survei" />
              <div className="row">
                <div className="col-lg-6 col-md-6">
                  <InputField />
                  <InputField />
                </div>
                <div className="col-lg-6 col-md-6">
                  <InputField />
                </div>
              </div>
              <TextArea />

              <div className="d-flex justify-content-between align-items-center">
                <div className="flex-grow-1 m-2">
                  <Button
                    classType="danger"
                    type="button"
                    label="Batal"
                    width="100%"
                    onClick="#"
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
