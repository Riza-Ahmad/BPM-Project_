export default function Icon({
  type = "Reguler",
  name,
  cssClass = "",
  ukuran = "1.2rem",
  margin = "0px",
  ...props
}) {
  const prefix =
    type === "Bold"
      ? "fi fi-br"
      : type === "Reguler"
      ? "fi fi-rr"
      : type === "Brands"
      ? "fi fi-brands"
      : type === "Block"
      ? "fi fi-block"
      : type === "full"
      ? "fi fi-sr"
      : type === "Solid"
      ? "fi fi-ss"
      : "fi fi-rr";

  const iconClass = `${prefix}-${name} ${cssClass}`;

  return (
    <i
      className={iconClass}
      style={{ fontSize: ukuran, margin }}
      {...props}
    ></i>
  );
}
