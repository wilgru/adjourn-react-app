import { useEffect, useRef } from "react";

/**
 * Returns a ref to attach to a <textarea> element. Whenever `value` changes
 * the textarea height is recalculated so it always fits its content without
 * showing a scrollbar.
 */
export const useAutoResize = (value: string | null | undefined) => {
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    // Reset to "auto" first so shrinking works correctly, then set to scrollHeight.
    element.style.height = "auto";
    element.style.height = `${element.scrollHeight}px`;
  }, [value]);

  return ref;
};
