import "./style.css";
import Quill from "quill";
import { useEffect, useRef } from "react";
import { cn } from "src/common/utils/cn";
import type Delta from "quill-delta";

type QuillViewerProps = {
  content: Delta;
  className?: string;
};

export default function QuillViewer({ content, className }: QuillViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    const editorContainer = container.appendChild(
      container.ownerDocument.createElement("div"),
    );

    const quillEditor = new Quill(editorContainer, {
      readOnly: true,
    });

    quillEditor?.setContents(content);

    return () => {
      container.innerHTML = "";
    };
  }, [content]);

  return (
    <div
      id="quill-editor"
      ref={containerRef}
      className={cn("h-fit placeholder-slate-500", className)}
    />
  );
}
