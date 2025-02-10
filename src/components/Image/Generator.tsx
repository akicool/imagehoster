"use client";

import clsx from "clsx";
import Image from "next/image";
import { BotIcon, Loader2Icon } from "lucide-react";
import { ChangeEvent, useState } from "react";

export default function ImageGenerator() {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [error, setError] = useState("");
  const [isLoadingImage, setIsLoadingImage] = useState(false);
  const [isLoadingText, setIsLoadingText] = useState(false);

  const generateImage = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoadingImage(true);
    setError("");
    setImageUrl("");

    const uniqueId = String(Date.now()).slice(7, String(Date.now()).length);
    // const ModelAI = "flux-pro";
    // const modelsAI = ["flux-pro", "deepseek", "midijourney"];
    const ModelAI = "midijourney";

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

      setImageUrl(response.url);
    } catch (error) {
      console.error("Error generating image:", error);
      setError(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    } finally {
      setIsLoadingImage(false);
    }
  };

  const generateText = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoadingText(true);
    const uniqueId = String(Date.now()).slice(7, String(Date.now()).length);
    const ModelAI = "deepseek";

    try {
      const response = await fetch(`https://text.pollinations.ai`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content:
                "Generate a text prompt in the language in which the following message will be used to generate images, leave only the text prompt.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          seed: uniqueId,
          model: ModelAI,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const text = await response.text();
      setPrompt(text);
    } catch (error) {
      console.error("Error generating text:", error);
      setPrompt(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    } finally {
      setIsLoadingText(false);
    }
  };

  return (
    <div className="w-full max-w-md flex flex-col gap-4">
      {isLoadingImage && <div className="file-loader !w-full" />}

      <div
        className={clsx(
          "transition duration-1000 ease-in-out overflow-hidden",
          imageUrl && !isLoadingImage
            ? "max-h-full opacity-100"
            : "max-h-0 opacity-0"
        )}
        style={{
          maxHeight: imageUrl && !isLoadingImage ? "500px" : "0px",
          opacity: imageUrl && !isLoadingImage ? 1 : 0,
          transition:
            imageUrl && !isLoadingImage
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
          disabled={isLoadingImage || isLoadingText}
        />

        <div className="flex gap-2 items-center">
          <button
            type="submit"
            disabled={isLoadingImage || isLoadingText || !prompt}
            className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
          >
            {isLoadingImage ? "Генерирую..." : "Сгенерировать изображение"}
          </button>

          {isLoadingImage || (
            <button
              type="button"
              disabled={isLoadingImage || isLoadingText || !prompt}
              onClick={generateText}
              className="w-fit p-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
            >
              {isLoadingText ? (
                <div className="animate-spin">
                  <Loader2Icon />
                </div>
              ) : (
                <BotIcon />
              )}
            </button>
          )}
        </div>
      </form>

      {error && (
        <div className="mt-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
    </div>
  );
}
