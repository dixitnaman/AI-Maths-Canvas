import React, { useEffect, useRef, useState } from "react";
import { SWATCHES } from "../../constants";
import { ColorSwatch, Group, keys } from "@mantine/core";
import axios from "axios";
import { Button } from "../../components/ui/button";
import Draggable from "react-draggable";
import { url } from "inspector";
import { Key } from "lucide-react";

//response sent back from the backend server
interface Response {
  expr: string;
  result: string;
  assign: boolean;
}

interface GeneratedResult {
  expression: string;
  answer: string;
}

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setcolor] = useState("rgb(255,255,255)");
  const [reset, setreset] = useState(false);
  const [result, setResult] = useState<GeneratedResult>();
  const [latexExpression, setlatexExpression] = useState<Array<string>>([]);
  const [latexPosition, setlatexPosition] = useState({ x: 10, y: 200 });
  const [dicofvar, setdicofvar] = useState({});

  useEffect(() => {
    if (reset) {
      resetCanvas();
      setlatexExpression([]);
      setResult(undefined);
      setdicofvar({});
      setreset(false);
    }
  }, [reset]); //only runs when reste state changes

  useEffect(() => {
    if (result) {
      renderLatexToCanvas(result.expression, result.answer);
    }
  }, [result]);

  useEffect(() => {
    if (latexExpression.length > 0 && window.MathJax) {
      setTimeout(() => {
        window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub]);
      }, 0);
    }
  }, [latexExpression]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight - canvas.offsetTop;
        ctx.lineCap = "round"; //for brush type
        ctx.lineWidth = 3; //for brush type
      }
    }

    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.7/config/TeX-MML-AM_CHTML.js";
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      window.MathJax.Hub.Config({
        tex2jax: {
          inlineMath: [
            ["$", "$"],
            ["\\(", "\\)"],
          ],
        },
      });
    };

    return () => {
      document.head.removeChild(script);
    };
  }, []); //[] empty dependency array, to prevent running with every state change

  const renderLatexToCanvas = (expression: string, answer: string) => {
    const latex = `${expression} = ${answer}`;
    setlatexExpression([...latexExpression, latex]);

    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  };

  const sendData = async () => {
    const canvas = canvasRef.current;
    if (canvas) {
      console.log(
        "Sending Data...",
        `${import.meta.env.VITE_API_URL}/calculate`
      );
      const response = await axios({
        method: "post",
        url: `${import.meta.env.VITE_API_URL}/calculate`,
        data: {
          image: canvas.toDataURL("image/png"),
          dict_of_vars: dicofvar,
        },
      });

      const resp = await response.data;
      // console.log("Response : ", resp);
      resp.data.forEach((data: Response) => {
        if (data.assign === true) {
          setdicofvar({
            ...dicofvar,
            [data.expr]: data.result,
          });
        }
      });
      const ctx = canvas.getContext("2d");
      const imageData = ctx!.getImageData(0, 0, canvas.width, canvas.height);
      let minX = canvas.width,
        minY = canvas.height,
        maxX = 0,
        maxY = 0;

      for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
          const i = (y * canvas.width + x) * 4;
          if (imageData.data[i + 3] > 0) {
            // If pixel is not transparent
            minX = Math.min(minX, x);
            minY = Math.min(minY, y);
            maxX = Math.max(maxX, x);
            maxY = Math.max(maxY, y);
          }
        }
      }
      const centerX = (minX + maxX) / 2;
      const centerY = (minY + maxY) / 2;

      setlatexPosition({ x: centerX, y: centerY });
      resp.data.forEach((data: Response) => {
        setTimeout(() => {
          setResult({
            expression: data.expr,
            answer: data.result,
          });
        }, 200);
      });
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.style.background = "black";
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.beginPath();
        ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
        setIsDrawing(true);
      }
    }
  };

  const resetCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) {
      return;
    }
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.strokeStyle = color;
        ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
        ctx.stroke();
      }
    }
  };

  return (
    <>
      <div className="grid grid-cols-[1fr_2fr_1fr] items-center justify-between gap-2  p-4">
        <Button
          onClick={() => setreset(true)}
          className="z-20 bg-red-500 text-white"
          variant="default"
          color="black"
        >
          Reset
        </Button>

        <Group className="z-20 ">
          {SWATCHES.map((swatch) => (
            <ColorSwatch
              key={swatch}
              color={swatch}
              onClick={() => setcolor(swatch)}
            />
          ))}
        </Group>

        <Button
          onClick={sendData}
          className="z-20 bg-green-400 text-white"
          variant="default"
          color="black"
        >
          RUN
        </Button>
      </div>
      <canvas
        ref={canvasRef}
        id="canvas"
        className="absolute top-0 left-0 w-full h-full"
        onMouseDown={startDrawing}
        onMouseOut={stopDrawing}
        onMouseUp={stopDrawing}
        onMouseMove={draw}
      />
      {latexExpression &&
        latexExpression.map((latex, index) => (
          <Draggable
            key={index}
            defaultPosition={latexPosition}
            onStop={(e, data) => setlatexPosition({ x: data.x, y: data.y })}
          >
            <div className="absolute p-2 text-white">
              <div className="latex-content">{latex}</div>
            </div>
          </Draggable>
        ))}
    </>
  );
}
