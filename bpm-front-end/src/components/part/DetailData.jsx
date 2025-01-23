import { decodeHtml } from "../util/DecodeHtml";
export default function DetailData({
  label,
  isi,
  id,
  colorIsi = "text-secondary mb-4",
}) {
  const decodedIsi = decodeHtml(isi);
  return (
    <>
      <label htmlFor={id} className="form-label fw-bold">
        {label}
      </label>
      <p
        id={id}
        className={colorIsi}
        dangerouslySetInnerHTML={{ __html: decodedIsi }}
      />
    </>
  );
}
