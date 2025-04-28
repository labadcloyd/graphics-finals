"use client";
import { useRef, useEffect, useState } from "react";
import css from "./styles.module.css";
import midpointEllipse from "@/utils/midpointAlgo";

export default function Sketchpad() {
  const canvasRef = useRef(null);
  const padWrapperRef = useRef(null);

  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [isDrawing, setIsDrawing] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [permanentEllipses, setPermanentEllipses] = useState([]);

  useEffect(() => {
    if (!isActive) return;
    const canvas = canvasRef.current;
    const wrapper = padWrapperRef.current;

    if (canvas && wrapper) {
      const rect = wrapper.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;

      const ctx = canvas.getContext("2d");
      redrawAll(ctx);

      function getMousePos(e) {
        const rect = canvas.getBoundingClientRect();
        return {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        };
      }

      function drawEllipse(ctx, points, color = "black") {
        ctx.fillStyle = color;
        points.forEach(([x, y]) => {
          ctx.fillRect(x, y, 1, 1);
        });
      }

      function redrawAll(ctx, previewPoints = null) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw all saved circles
        permanentEllipses.forEach(({ points }) => {
          drawEllipse(ctx, points, "black");
        });

        // Draw preview if exists
        if (previewPoints) {
          drawEllipse(ctx, previewPoints, "gray");
        }
      }

      function handleMouseDown(e) {
        const pos = getMousePos(e);
        setStartPos(pos);
        setIsDrawing(true);
      }

      function handleMouseMove(e) {
        if (!isDrawing) return;

        const endPos = getMousePos(e);

        const xc = (startPos.x + endPos.x) / 2;
        const yc = (startPos.y + endPos.y) / 2;
        const rx = Math.abs(endPos.x - startPos.x) / 2;
        const ry = Math.abs(endPos.y - startPos.y) / 2;

        const previewPoints = midpointEllipse(rx, ry, xc, yc);

        redrawAll(ctx, previewPoints);
      }

      function handleMouseUp(e) {
        if (!isDrawing) return;
        setIsDrawing(false);

        const endPos = getMousePos(e);

        const xc = (startPos.x + endPos.x) / 2;
        const yc = (startPos.y + endPos.y) / 2;
        const rx = Math.abs(endPos.x - startPos.x) / 2;
        const ry = Math.abs(endPos.y - startPos.y) / 2;

        const finalPoints = midpointEllipse(rx, ry, xc, yc);

        // Save the final ellipse to permanentEllipses
        setPermanentEllipses((prev) => [...prev, { points: finalPoints }]);
      }

      canvas.addEventListener("mousedown", handleMouseDown);
      canvas.addEventListener("mousemove", handleMouseMove);
      canvas.addEventListener("mouseup", handleMouseUp);

      return () => {
        canvas.removeEventListener("mousedown", handleMouseDown);
        canvas.removeEventListener("mousemove", handleMouseMove);
        canvas.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDrawing, startPos, permanentEllipses, isActive]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (canvas) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw all saved circles
      permanentEllipses.forEach(({ points }) => {
        drawEllipse(ctx, points, "black");
      });

      function drawEllipse(ctx, points, color = "black") {
        ctx.fillStyle = color;
        points.forEach(([x, y]) => {
          ctx.fillRect(x, y, 1, 1);
        });
      }
    }
  }, [permanentEllipses]);

  return (
    <div className={css.wrapper}>
      <div ref={padWrapperRef} className={css.padWrapper}>
        <canvas
          ref={canvasRef}
          style={{ width: "100%", height: "500px", backgroundColor: "#fff" }}
        />
      </div>
      <div className={css.optionWrapper}>
        <button
          className={isActive ? css.activebtn : ""}
          onClick={() => {
            setIsActive(!isActive);
            console.log(isActive);
          }}
        >
          {isActive ? "Deactivate Drawing Mode" : "Activate Drawing Mode"}
        </button>
      </div>
    </div>
  );
}
