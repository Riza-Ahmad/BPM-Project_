import underconstr from "../../../assets/element/underconstr.png";

export default function UnderConstr({ isi = "" }) {
  return (
    <div
      className="container"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "95vh",
      }}
    >
      <div className="text-center">
        <img
          src={underconstr}
          alt="Dalam Pengembangan"
          style={{ height: "15rem", marginLeft: "2rem" }}
        />
        <h1 className="display-5">Halaman Dalam Pengembangan</h1>
        <p className="lead">{isi}</p>
        <a href="/" className="btn btn-primary mt-3">
          Kembali ke Halaman Utama
        </a>
      </div>
    </div>
  );
}
