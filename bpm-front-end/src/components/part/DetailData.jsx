export default function DetailData({ label, isi, id }) {
  return (
    <>
      <label htmlFor={id} className="form-label fw-bold">
        {label}
      </label>
      <p
        id={id}
        className="text-secondary mb-4"
        dangerouslySetInnerHTML={{ __html: isi }}
      />
    </>
  );
}
