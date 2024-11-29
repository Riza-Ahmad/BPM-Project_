import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
  useEffect,
} from "react";
import Button from "./Button";

const Modal = forwardRef(function Modal(
  { title, children, size, Button1 = null, Button2 = null },
  ref
) {
  const dialog = useRef();
  const formRef = useRef();
  const [isCancelDisabled, setIsCancelDisabled] = useState(true);
  let maxSize;

  switch (size) {
    case "small":
      maxSize = "480px";
      break;
    case "medium":
      maxSize = "720px";
      break;
    case "large":
      maxSize = "1024px";
      break;
    case "full":
      maxSize = "100%";
      break;
    default:
      maxSize = "720px";
  }

  useImperativeHandle(ref, () => ({
    open() {
      dialog.current.showModal();
    },
    close() {
      dialog.current.close();
    },
  }));

  // Fungsi untuk memeriksa apakah form anak memiliki nilai atau tidak
  const checkFormValues = () => {
    const formElements = formRef.current ? formRef.current.elements : null;

    if (formElements) {
      let hasValue = false;

      Array.from(formElements).forEach((element) => {
        if (element.type !== "button" && element.value) {
          hasValue = true;
        }
      });

      setIsCancelDisabled(!hasValue);
    }
  };

  useEffect(() => {
    checkFormValues();
  }, [children]);

  return (
    <dialog
      ref={dialog}
      style={{ maxWidth: maxSize }}
      className="modal-container"
    >
      <div className="row">
        <div className="col-lg-0 col-md-6 ">
          <button
            className="modal-close-button ml-2"
            onClick={() => dialog.current.close()}
          >
            &times;
          </button>
        </div>
        <div className="col-lg-12 col-md-6">
          <div className="modal-header lead fw-medium p-3">{title}</div>
        </div>
      </div>

      <hr className="m-0" />

      <div className="modal-body p-3">
        {/* Pastikan `children` dibungkus dalam elemen `form` agar bisa di-reset */}
        <form ref={formRef} onInput={checkFormValues}>
          {children}
        </form>
      </div>

      <hr className="m-0" />

      <div className="modal-footer p-3">
        <div style={{ display: "flex", gap: "7px" }}>
          <div>{Button1 && React.cloneElement(Button1)}</div>
          <div>{Button2 && React.cloneElement(Button2)}</div>
        </div>
      </div>
    </dialog>
  );
});

export default Modal;
