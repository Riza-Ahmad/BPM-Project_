export default function HeaderText({
  label, // Properti 'isi' akan digunakan untuk teks HTML
  warna = "#5F5858",
  ukuran = "30px",
  alignText = "center",
  marginBottom = "40px",
  fontWeight = "600", // Default ketebalan teks adalah normal
  marginTop = "10px",
  width = "auto", // Default lebar jika tidak ditentukan
}) {
  return (
    <h3
      style={{
        color: warna,
        fontSize: ukuran,
        textAlign: alignText,
        marginBottom: marginBottom,
        fontWeight: fontWeight, // Mengatur ketebalan teks
        marginTop: marginTop,
        width: width, // Mengatur lebar elemen
      }}
      dangerouslySetInnerHTML={{ __html: label }} // Menampilkan isi HTML
    />
  );
}
