import TabTahun from "./TabTahunKegiatan";

export default function Index({ onChangePage }) {
  const data = [
    {
      year: 2024,
      kegiatanList: [
        {
          title: "Simulasi Eksternal Akreditasi Program Studi TRPL",
          date: "Rabu, 16 Oktober 2024",
          time: "09.00 WIB - 16.00 WIB",
          location: "Politeknik Astra",
          image: "https://via.placeholder.com/400x200", // Ganti dengan URL gambar sebenarnya
          galleryLink: "#",
        },
        // Tambahkan kegiatan lainnya
      ],
    },
    {
      year: 2023,
      kegiatanList: [
        {
          title: "Simulasi Eksternal Akreditasi Program Studi TRPL 2023",
          date: "Senin, 10 Oktober 2023",
          time: "08.00 WIB - 14.00 WIB",
          location: "Politeknik Astra",
          image: "https://via.placeholder.com/400x200", // Ganti dengan URL gambar sebenarnya
          galleryLink: "#",
        },
        // Tambahkan kegiatan lainnya
      ],
    },
  ];

  return (
    <div className="container my-5">
      <div style={{ marginTop: "7rem" }}>
        {data.map((tab, index) => (
          <TabTahun
            key={index}
            year={tab.year}
            kegiatanList={tab.kegiatanList}
          />
        ))}
      </div>
    </div>
  );
}
