import React from "react";

const Text = ({
  isi,
  ukuran = "15px",
  alignText = "left",
  warna = "white",
  style = {},
}) => {
  return (
    <p
      style={{
        fontFamily: "Poppins, sans-serif",
        color: warna,
        fontSize: ukuran,
        textAlign: alignText,
        ...style,
      }}
      dangerouslySetInnerHTML={{ __html: isi }}
    ></p>
  );
};

export default Text;
