"use client";

import clsx from "clsx";
import Image from "next/image";
import { ChangeEvent, useState, useRef } from "react";

export default function ImageGenerator() {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // eslint-disable-next-line
  const addWatermark = (originalImageUrl: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const image = new window.Image() as HTMLImageElement;
      image.crossOrigin = "anonymous";
      image.src = originalImageUrl;

      image.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        canvas.width = image.width;
        canvas.height = image.height;

        ctx.drawImage(image, 0, 0);

        ctx.fillStyle = "rgba(0, 0, 0)";
        ctx.font = "bold 26px monospace";
        ctx.lineWidth = 4;
        ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";

        const badgeText = "imagehoster.ru";

        const textMetrics = ctx.measureText(badgeText);
        const padding = 20;

        const badgeX = canvas.width - textMetrics.width - padding * 2;
        const badgeY = canvas.height - 45 - padding;
        ctx.strokeRect(
          badgeX,
          badgeY,
          textMetrics.width + padding * 2,
          45 + padding
        );

        ctx.fillRect(
          badgeX,
          badgeY,
          textMetrics.width + padding * 2,
          45 + padding
        );

        ctx.fillStyle = "white";
        ctx.fillText(
          badgeText,
          canvas.width - textMetrics.width - padding,
          canvas.height - padding
        );

        const watermarkedImageUrl = canvas.toDataURL("image/png");
        resolve(watermarkedImageUrl);
      };

      image.onerror = () => {
        reject(new Error("Failed to load image"));
      };
    });
  };

  const generateImage = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setImageUrl("");

    const uniqueId = String(Date.now()).slice(7, String(Date.now()).length);
    const ModelAI = "flux-pro";

    try {
      const url = `https://image.pollinations.ai/prompt/${prompt}?seed=${uniqueId}&nologo=true&model=${ModelAI}&enhance=true`;

      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      };

      const response = await fetch(url, options);
      console.log("response:", response);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      //   const watermarkedImage = await addWatermark(response.url);
      setImageUrl(response.url);
    } catch (error) {
      console.error("Error generating image:", error);
      setError(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md flex flex-col gap-4">
      {/* <canvas ref={canvasRef} style={{ display: "none" }} /> */}

      {isLoading && <div className="file-loader !w-full" />}

      <div
        className={clsx(
          "transition duration-1000 ease-in-out overflow-hidden",
          imageUrl && !isLoading
            ? "max-h-full opacity-100"
            : "max-h-0 opacity-0"
        )}
        style={{
          maxHeight: imageUrl && !isLoading ? "500px" : "0px",
          opacity: imageUrl && !isLoading ? 1 : 0,
          transition:
            imageUrl && !isLoading
              ? "max-height 500ms ease-out, opacity 500ms ease-out"
              : "max-height 300ms ease-in, opacity 630ms ease-in",
        }}
      >
        {imageUrl && (
          <Image
            src={imageUrl}
            alt="Generated image"
            className="w-full rounded-lg shadow-lg"
            width={500}
            height={500}
          />
        )}
      </div>

      <form onSubmit={generateImage} className="space-y-4 text-black">
        <textarea
          value={prompt}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
            setPrompt(e.target.value)
          }
          rows={5}
          placeholder="Введите описание изображения"
          required
          className="w-full p-2 border border-gray-300 rounded-lg h-fit text-wrap resize-none"
        />

        <button
          type="submit"
          disabled={isLoading || !prompt}
          className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {isLoading ? "Генерирую..." : "Сгенерировать изображение"}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
    </div>
  );
}
