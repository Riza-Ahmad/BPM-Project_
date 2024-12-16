import { decodeHtml } from "../util/DecodeHtml";
export default function DetailData({ label, isi, id }) {
  const decodedIsi = decodeHtml(isi);
  return (
    <>
      <label htmlFor={id} className="form-label fw-bold">
        {label}
      </label>
      <p
        id={id}
        className="text-secondary mb-4"
        dangerouslySetInnerHTML={{ __html: decodedIsi }}
      />
    </>
  );
}
