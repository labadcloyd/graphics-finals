"use client";
import { useRef, useEffect } from "react";
import css from "./styles.module.css";

export default function Sketchpad() {
  const canvasRef = useRef(null);
  const padWrapperRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrapper = padWrapperRef.current;

    if (canvas && wrapper) {
      const rect = wrapper.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    }
  }, []);

  return (
    <div className={css.wrapper}>
      <div ref={padWrapperRef} className={css.padWrapper}>
        <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} />
      </div>
    </div>
  );
}
