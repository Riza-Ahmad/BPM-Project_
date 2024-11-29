import Swal from "sweetalert2";

const SweetAlert = (
  title,
  text,
  icon,
  confirmText = "",
  inputType = null,
  placeholder = "",
  showCancelButton = false // Add a parameter to control the cancel button visibility
) => {
  if (confirmText === "") {
    return Swal.fire({
      title: title,
      text: text,
      icon: icon,
    });
  } else {
    let textContent = "";
    const inputOptions = inputType ? {
      input: inputType,
      inputPlaceholder: placeholder,
      inputAttributes: {
        onchange: (event) => (textContent = event.target.value),
      },
    } : {};

    return Swal.fire({
      title: title,
      text: text,
      icon: icon,
      showCancelButton: showCancelButton, // Use the parameter here
      confirmButtonText: confirmText,
      cancelButtonText: "Batal",
      ...inputOptions,
    }).then((result) => {
      if (inputType && result.isConfirmed) {
        return textContent || "-";
      }
      return result.isConfirmed;
    });
  }
};

export default SweetAlert;
