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
        const editor = editorRef.current.editor;
        if (editor) {
          editor.focus();
        }
      }
    };

    const validate = () => {
      if (isRequired && !editorValue.trim()) {
        setError(true);
        return false;
      }

      const isEmptyHtml = /^(<p><br><\/p>|<br\s*\/?>|\s*)$/i.test(
        editorValue.trim()
      );

      if (isEmptyHtml) {
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
            toolbarSticky: true,
            toolbarStickyOffset: 0,
            height: 300,
            style: {
              overflow: "auto",
            },
            toolbarButtonSize: "middle",
            placeholder: "Start typing here...",
            buttons: [
              "bold",
              "underline",
              "italic",
              "strikeThrough",
              "link",
              "ul",
              "ol",
            ],
            buttonsMD: [
              "bold",
              "underline",
              "italic",
              "strikeThrough",
              "link",
              "ul",
              "ol",
            ],
            buttonsSM: [
              "bold",
              "underline",
              "italic",
              "strikeThrough",
              "link",
              "ul",
              "ol",
            ],
            buttonsXS: [
              "bold",
              "underline",
              "italic",
              "strikeThrough",
              "link",
              "ul",
              "ol",
            ],
          }}
          onBlur={(newContent) => handleEditorChange(newContent)}
          tabIndex={1}
          {...props}
        />
        {error && (
          <span className="small text-danger">
            {errorMsg || "field ini wajib diisi."}
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
