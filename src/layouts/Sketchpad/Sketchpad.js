// Developed by Cloyd Abad
"use client";
import { v4 as uuidv4 } from "uuid";
import { useRef, useEffect, useState } from "react";
import css from "./styles.module.css";
import midpointEllipse from "@/utils/midpointAlgo";

export default function Sketchpad() {
  const canvasRef = useRef(null);
  const padWrapperRef = useRef(null);

  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [isDrawing, setIsDrawing] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [layerCount, setLayerCount] = useState(0);
  const [permanentEllipses, setPermanentEllipses] = useState([]);
  const [activeColor, setActiveColor] = useState("#000");

  function handleDeleteLayer(id) {
    const newPermEllips = [];
    permanentEllipses.forEach((item) => {
      if (item.id !== id) newPermEllips.push(item);
    });
    setPermanentEllipses(newPermEllips);
  }

  function handleAnimate() {
    const canvas = canvasRef.current;
    const wrapper = padWrapperRef.current;

    if (canvas && wrapper) {
      const rect = wrapper.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;

      const ctx = canvas.getContext("2d");
      redrawAll(ctx);

      function drawEllipse(ctx, points, color) {
        ctx.fillStyle = color;
        points.forEach(([x, y], i) => {
          setTimeout(() => {
            ctx.fillRect(x, y, 1, 1);
          }, i * 5); // delay increases with index
        });
      }

      function redrawAll(ctx, previewPoints = null) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw all saved circles
        permanentEllipses.forEach(({ points, color }) => {
          drawEllipse(ctx, points, color);
        });

        // Draw preview if exists
        if (previewPoints) {
          drawEllipse(ctx, previewPoints, "gray");
        }
      }
    }
  }

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

      function drawEllipse(ctx, points, color) {
        ctx.fillStyle = color;
        points.forEach(([x, y]) => {
          ctx.fillRect(x, y, 1, 1);
        });
      }

      function redrawAll(ctx, previewPoints = null) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw all saved circles
        permanentEllipses.forEach(({ points, color }) => {
          drawEllipse(ctx, points, color);
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
        setLayerCount(layerCount + 1);
        setPermanentEllipses((prev) => [
          ...prev,
          {
            points: finalPoints,
            id: uuidv4(),
            sequence: layerCount,
            color: activeColor,
          },
        ]);
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
      permanentEllipses.forEach(({ points, color }) => {
        drawEllipse(ctx, points, color);
      });

      function drawEllipse(ctx, points, color) {
        ctx.fillStyle = color;
        points.forEach(([x, y]) => {
          ctx.fillRect(x, y, 1, 1);
        });
      }
    }
  }, [permanentEllipses]);

  return (
    <div className={css.wrapper}>
      <div className={css.padWrapper}>
        <div ref={padWrapperRef} className={css.padContainer}>
          <canvas
            ref={canvasRef}
            style={{ width: "100%", height: "500px", backgroundColor: "#fff" }}
          />
        </div>
        <div className={css.layerWrapper}>
          <h4>Layers</h4>
          <div className={css.layerContainer}>
            {permanentEllipses.map((item, i) => (
              <div className={css.layer} key={item.id}>
                <p>layer: {item.sequence}</p>
                <a onClick={() => handleDeleteLayer(item.id)}>Delete Layer</a>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className={css.optionWrapper}>
        <button
          className={isActive ? css.activebtn : ""}
          onClick={() => {
            setIsActive(!isActive);
          }}
        >
          {isActive ? "Deactivate Drawing Mode" : "Activate Drawing Mode"}
        </button>
        <button
          onClick={() => {
            setPermanentEllipses([]);
          }}
        >
          Delete All Circles
        </button>
        <button onClick={handleAnimate}>Animate</button>
        <label
          className={css.colorLabel}
          htmlFor='colorinput'
          style={{ backgroundColor: activeColor }}
        >
          Color
        </label>
        <input
          type='color'
          className={css.colorInput}
          id='colorinput'
          onChange={(e) => {
            setActiveColor(e.currentTarget.value);
          }}
        />
      </div>
    </div>
  );
}
