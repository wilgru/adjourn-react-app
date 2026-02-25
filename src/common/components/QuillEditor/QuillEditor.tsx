import "./style.css";
import Quill from "quill";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { RangeStatic, StringMap } from "quill";
import type Delta from "quill-delta";

type QuillEditorProps = {
  toolbarId: string;
  value?: Delta;
  onChange: (delta: Delta) => void;
  onSelectedFormattingChange: (selectionFormatting: StringMap) => void;
};

// https://quilljs.com/docs/modules/toolbar/
// https://quilljs.com/docs/api#formatting
// https://medium.com/@mircea.calugaru/react-quill-editor-with-full-toolbar-options-and-custom-buttons-undo-redo-176d79f8d375

// TODO: override quills internal value updating? make this comp more like textarea, pass value and onChange and use onChange to update a state to pass to the value
const QuillEditor = ({
  toolbarId,
  value,
  onChange,
  onSelectedFormattingChange,
}: QuillEditorProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const onChangeRef = useRef(onChange);
  const [quillEditor, setQuillEditor] = useState<Quill | null>();

  useLayoutEffect(() => {
    onChangeRef.current = onChange;
  });

  useEffect(() => {
    if (!quillEditor) return;
    if (value === undefined) return;

    const current = quillEditor.getContents();
    try {
      if (JSON.stringify(current) !== JSON.stringify(value)) {
        quillEditor.setContents(value, "api");
      }
    } catch {
      quillEditor.setContents(value, "api");
    }
  }, [value, quillEditor]);

  useEffect(() => {
    if (!quillEditor) return;

    const handleTextChange = (
      _delta: Delta,
      _oldDelta: Delta,
      source: string,
    ) => {
      const selection = quillEditor.getSelection();

      if (selection) {
        const selectionFormatting = quillEditor.getFormat(
          selection.index,
          selection.length,
        );

        onSelectedFormattingChange(selectionFormatting);
      }

      // Only notify consumers for user-driven changes (like a textarea)
      if (source === "user") {
        onChangeRef.current?.(quillEditor.getContents());
      }
    };

    const handleSelectionChange = (range: RangeStatic) => {
      if (range) {
        const selectionFormatting = quillEditor.getFormat(
          range.index,
          range.length,
        );

        onSelectedFormattingChange(selectionFormatting);
      }
    };

    quillEditor.on("text-change", handleTextChange);
    quillEditor.on("selection-change", handleSelectionChange);

    return () => {
      quillEditor?.off("text-change", handleTextChange);
      quillEditor?.off("selection-change", handleSelectionChange);
    };
  }, [onSelectedFormattingChange, quillEditor]);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    const editorContainer = container.appendChild(
      container.ownerDocument.createElement("div"),
    );

    const quill = new Quill(editorContainer, {
      // debug: import.meta.env.DEV ? "info" : undefined, // TODO: add back in with dev tools
      placeholder: "No content",
      modules: {
        toolbar: {
          container: `#${toolbarId}`,
          handlers: {
            bold: function () {
              const selection = quill.getSelection();

              if (!selection) {
                return;
              }

              const selectionFormatting = quill.getFormat(
                selection.index,
                selection.length,
              );

              quill.format("bold", selectionFormatting.bold ? false : true);
            },
            italic: function () {
              const selection = quill.getSelection();

              if (!selection) {
                return;
              }

              const selectionFormatting = quill.getFormat(
                selection.index,
                selection.length,
              );

              quill.format("italic", selectionFormatting.italic ? false : true);
            },
            underline: function () {
              const selection = quill.getSelection();

              if (!selection) {
                return;
              }

              const selectionFormatting = quill.getFormat(
                selection.index,
                selection.length,
              );

              quill.format(
                "underline",
                selectionFormatting.underline ? false : true,
              );
            },
            strike: function () {
              const selection = quill.getSelection();

              if (!selection) {
                return;
              }

              const selectionFormatting = quill.getFormat(
                selection.index,
                selection.length,
              );

              quill.format("strike", selectionFormatting.strike ? false : true);
            },
          },
        },
      },
      formats: [
        "bold",
        "italic",
        "underline",
        "strike",
        "list",
        "blockquote",
        "code-block",
        "link",
      ],
    });

    setQuillEditor(quill);

    return () => {
      container.innerHTML = "";

      setQuillEditor(null);
    };
  }, [toolbarId]);

  return (
    <div
      id="quill-editor"
      ref={containerRef}
      className="h-fit placeholder-slate-500"
    ></div>
  );
};

export { QuillEditor };
