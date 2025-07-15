import React, { useRef, useEffect, useState } from "react";
import Webcam from "react-webcam";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import * as tf from "@tensorflow/tfjs";

export default function WebcamDetector() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [model, setModel] = useState(null);
  const [predList, setPredList] = useState([]);

  useEffect(() => {
    cocoSsd.load().then((m) => setModel(m));
  }, []);

  useEffect(() => {
    const detect = async () => {
      if (
        webcamRef.current &&
        webcamRef.current.video &&
        webcamRef.current.video.readyState === 4 &&
        model
      ) {
        const predictions = await model.detect(webcamRef.current.video);
        const ctx = canvasRef.current.getContext("2d");

        canvasRef.current.width = webcamRef.current.video.videoWidth;
        canvasRef.current.height = webcamRef.current.video.videoHeight;

        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        let emptyList = [];
        predictions.forEach((pred) => {
          const [x, y, width, height] = pred.bbox;
          ctx.strokeStyle = "#00FF00";
          ctx.lineWidth = 2;
          ctx.strokeRect(x, y, width, height);
          ctx.font = "16px Arial";
          ctx.fillStyle = "#00FF00";
          ctx.fillText(pred.class, x, y > 10 ? y - 5 : 10);
          emptyList.push(pred.class);
        });

        setPredList(emptyList);
      }
    };

    const interval = setInterval(detect, 200);
    return () => clearInterval(interval);
  }, [model]);

  return (
    <>
      <div className="relative w-full h-[250px] mb-5">
        <Webcam
          ref={webcamRef}
          audio={false}
          mirrored={false}
          playsInline
          videoConstraints={{ facingMode: "environment" }}
          className="absolute w-full h-full object-cover"
        />
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-[250px]"
        />
      </div>
      <div className="overflow-hidden rounded-2xl m-5">
        <div className="bg-gray-800 text-gray-200 font-bold text-center p-4 mb-1 ">
          Detected Objects : {predList.length}
        </div>
        {predList.map((p, i) => {
          return (
            <div
              className={`bg-white border-b-2 border-gray-500 text-center text-gray-800 px-4 py-2 uppercase`}
            >
              {p}
            </div>
          );
        })}
      </div>
    </>
  );
}
