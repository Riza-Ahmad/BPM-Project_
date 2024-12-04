import Icon from "./Icon";

export default function Button({
  classType,
  iconName,
  label = "",
  title = "",
  type = "button",
  isDisabled = false,
  width = "auto", // Default width
  boxShadow = "0px 4px 6px rgba(0, 0, 0, 0.1)", // Example shadow
  ...props
}) {
  return (
    <button
      type={type}
      className={"btn btn-" + classType}
      {...props}
      title={title}
      disabled={isDisabled}
      style={{ width: width, boxShadow }}
    >
      {iconName && (
        <Icon name={iconName} cssClass={label === "" ? undefined : "pe-2"} />
      )}
      <span style={{ fontWeight: "600" }}>{label}</span>
    </button>
  );
}
