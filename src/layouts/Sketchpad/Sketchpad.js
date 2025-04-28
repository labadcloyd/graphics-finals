"use client";
import { useRef, useEffect, useState } from "react";
import css from "./styles.module.css";
import midpointEllipse from "@/utils/midpointAlgo";

export default function Sketchpad() {
  const canvasRef = useRef(null);
  const padWrapperRef = useRef(null);

  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrapper = padWrapperRef.current;

    if (canvas && wrapper) {
      const rect = wrapper.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;

      const ctx = canvas.getContext("2d");

      function getMousePos(e) {
        const rect = canvas.getBoundingClientRect();
        return {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        };
      }

      function handleMouseDown(e) {
        const pos = getMousePos(e);
        setStartPos(pos);
      }

      function handleMouseUp(e) {
        const endPos = getMousePos(e);

        const xc = (startPos.x + endPos.x) / 2;
        const yc = (startPos.y + endPos.y) / 2;
        const rx = Math.abs(endPos.x - startPos.x) / 2;
        const ry = Math.abs(endPos.y - startPos.y) / 2;

        const points = midpointEllipse(rx, ry, xc, yc);
        drawEllipse(ctx, points);
      }

      function drawEllipse(ctx, points) {
        ctx.fillStyle = "black";
        points.forEach(([x, y]) => {
          ctx.fillRect(x, y, 1, 1);
        });
      }

      canvas.addEventListener("mousedown", handleMouseDown);
      canvas.addEventListener("mouseup", handleMouseUp);

      return () => {
        canvas.removeEventListener("mousedown", handleMouseDown);
        canvas.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [startPos]);

  return (
    <div className={css.wrapper}>
      <div ref={padWrapperRef} className={css.padWrapper}>
        <canvas
          ref={canvasRef}
          style={{ width: "100%", height: "100%", backgroundColor: "#fff" }}
        />
      </div>
    </div>
  );
}
