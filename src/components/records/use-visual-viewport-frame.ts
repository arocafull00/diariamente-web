"use client";

import { useLayoutEffect, useState } from "react";

type ViewportFrame = {
  top: number;
  height: number;
  bottom: "auto";
};

export function useVisualViewportFrame() {
  const [frame, setFrame] = useState<ViewportFrame>();

  useLayoutEffect(() => {
    const viewport = window.visualViewport;

    if (!viewport) {
      return;
    }

    const update = () =>
      setFrame({ top: viewport.offsetTop, height: viewport.height, bottom: "auto" });

    update();
    viewport.addEventListener("resize", update);
    viewport.addEventListener("scroll", update);

    return () => {
      viewport.removeEventListener("resize", update);
      viewport.removeEventListener("scroll", update);
    };
  }, []);

  return frame;
}
