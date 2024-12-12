import React from "react";
import { decodeHtml } from "../util/DecodeHtml";

const Text = ({
  isi,
  ukuran = "15px",
  alignText = "left",
  warna = "white",
  style = {},
}) => {
  const decodedIsi = decodeHtml(isi);

  return (
    <p
      style={{
        fontFamily: "Poppins, sans-serif",
        color: warna,
        fontSize: ukuran,
        textAlign: alignText,
        ...style,
      }}
      dangerouslySetInnerHTML={{ __html: decodedIsi }}
    ></p>
  );
};

export default Text;
