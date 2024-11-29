import React, {
  useCallback,
  useRef,
  useState,
  useImperativeHandle,
  useEffect,
} from "react";
import { Editor } from "@tinymce/tinymce-react";

const TextArea = React.forwardRef(
  (
    {
      id,
      label,
      name,
      isRequired = false,
      errorMsg,
      onChange,
      initialValue = "", // Default value passed once
      maxChar,
      isDisabled = false,
      ...props
    },
    ref
  ) => {
    const [editorValue, setEditorValue] = useState(initialValue); // Local state for editor content
    const [error, setError] = useState(false); // State for error handling
    const editorInstanceRef = useRef(null); // Store the TinyMCE editor instance

    // Sync initialValue with editorValue when initialValue changes
    useEffect(() => {
      setEditorValue(initialValue);
    }, [initialValue]);

    const handleEditorChange = useCallback(
      (content, editor) => {
        setEditorValue(content); // Update local state with the editor content
        onChange && onChange({ target: { name, value: content } }); // Trigger onChange callback
        if (isRequired) {
          setError(!content.trim()); // Validate input if required
        }
      },
      [onChange, name, isRequired]
    );

    const focusEditor = () => {
      if (editorInstanceRef.current) {
        editorInstanceRef.current.focus(); // Call the TinyMCE editor's focus method
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
        <Editor
          apiKey="8aan1jhdusk13xws06e13w6e3igg00kygp1xubuhymmmg4r2"
          value={editorValue} // Controlled value
          onEditorChange={handleEditorChange} // Change handler
          onInit={(evt, editor) => {
            editorInstanceRef.current = editor; // Capture TinyMCE editor instance
          }}
          init={{
            plugins: "lists link",
            toolbar:
              "undo redo | bold italic underline strikethrough | align lineheight | numlist bullist indent outdent | linkGenerator | removeformat",
            setup: (editor) => {
              editor.ui.registry.addButton("linkGenerator", {
                icon: "link",
                tooltip: "Insert Link",
                onAction: () => {
                  editor.windowManager.open({
                    title: "Insert/Edit Link",
                    body: {
                      type: "panel",
                      items: [
                        { type: "input", name: "url", label: "URL" },
                        {
                          type: "input",
                          name: "text",
                          label: "Text to display",
                        },
                        { type: "input", name: "title", label: "Title" },
                        {
                          type: "selectbox",
                          name: "target",
                          label: "Open link in...",
                          items: [
                            { value: "_self", text: "Current window" },
                            { value: "_blank", text: "New window" },
                          ],
                        },
                      ],
                    },
                    buttons: [
                      {
                        type: "submit",
                        text: "Save",
                        primary: true,
                      },
                    ],
                    onSubmit: (dialog) => {
                      const data = dialog.getData();
                      const linkHTML = `<a href="${data.url}" target="${data.target}" title="${data.title}">${data.text}</a>`;
                      editor.insertContent(linkHTML);
                      dialog.close();
                    },
                  });
                },
              });
            },
          }}
          disabled={isDisabled} // Pass disabled state
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
