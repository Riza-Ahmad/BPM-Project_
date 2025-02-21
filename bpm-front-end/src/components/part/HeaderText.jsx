export default function HeaderText({
  label,
  warna = "#5F5858",
  ukuran = "30px",
  alignText = "center",
  marginBottom = "40px",
  fontWeight = "600",
  marginTop = "10px",
  width = "auto",
}) {
  return (
    <h3
      style={{
        color: warna,
        fontSize: ukuran,
        textAlign: alignText,
        marginBottom: marginBottom,
        fontWeight: fontWeight,
        marginTop: marginTop,
        width: width,
      }}
      dangerouslySetInnerHTML={{ __html: label }}
    />
  );
}
