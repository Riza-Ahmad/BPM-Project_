import React, {
  useCallback,
  useRef,
  useState,
  useImperativeHandle,
  useEffect,
} from "react";
import JoditEditor from "jodit-react";

const TextArea = React.forwardRef(
  (
    {
      id,
      label,
      name,
      isRequired = false,
      errorMsg,
      onChange,
      initialValue = "",
      maxChar,
      isDisabled = false,
      ...props
    },
    ref
  ) => {
    const [editorValue, setEditorValue] = useState(initialValue);
    const [error, setError] = useState(false);
    const editorRef = useRef(null);

    useEffect(() => {
      setEditorValue(initialValue);
    }, [initialValue]);

    const handleEditorChange = useCallback(
      (content) => {
        setEditorValue(content);
        onChange && onChange({ target: { name, value: content } });
        if (isRequired) {
          setError(!content.trim());
        }
      },
      [onChange, name, isRequired]
    );

    const focusEditor = () => {
      if (editorRef.current) {
        editorRef.current.focus();
      }
    };

    const validate = () => {
      if (isRequired && !editorValue.trim()) {
        setError(true);
        return false;
      }
      setError(false);
      return true;
    };

    useImperativeHandle(ref, () => ({
      focus: focusEditor,
      validate: validate,
    }));

    return (
      <div className="mb-3">
        {label && (
          <label htmlFor={id} className="form-label fw-bold">
            {label}
            {isRequired && <span className="text-danger"> *</span>}
          </label>
        )}

        <JoditEditor
          ref={editorRef}
          value={editorValue}
          config={{
            readonly: isDisabled,
            toolbarButtonSize: "middle",
            buttons: [
              "bold",
              "italic",
              "underline",
              "strikethrough",
              "|",
              "ul",
              "ol",
              "outdent",
              "indent",
              "|",
              "link",
              "|",
              "undo",
              "redo",
            ],
            toolbarSticky: false,
            placeholder: "Start typing here...",
          }}
          onBlur={(newContent) => handleEditorChange(newContent)}
          tabIndex={1}
          {...props}
        />
        {error && (
          <span className="small text-danger">
            {errorMsg || "This field is required."}
          </span>
        )}
        {maxChar && (
          <div className="small text-muted mt-1">
            {editorValue.length}/{maxChar} characters
          </div>
        )}
      </div>
    );
  }
);

export default TextArea;
