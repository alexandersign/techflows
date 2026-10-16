import { useEffect } from "react";

export function useNoIndex(title: string) {
  useEffect(() => {
    const previous = document.title;
    document.title = title;
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex";
    document.head.appendChild(meta);
    return () => {
      document.title = previous;
      meta.remove();
    };
  }, [title]);
}
