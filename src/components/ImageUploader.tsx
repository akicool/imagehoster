"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";

export function ImageUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [viewUrl, setViewUrl] = useState<string | null>(null);
  const [isPrivate, setIsPrivate] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("isPrivate", isPrivate.toString());

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (data.success) {
        toast.success("Успешно загружено");
        setFile(null);
        setViewUrl(data.viewUrl);
      } else {
        throw new Error(data.error || "Ошибка при загрузке");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      toast("Ошибка");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <label
          htmlFor="file"
          className="w-full text-sm text-slate-500
            flex items-center justify-center
            bg-violet-50 px-4 py-2 rounded-full
            border-2 border-violet-200
            hover:border-violet-400 hover:bg-violet-100
            cursor-pointer"
        >
          <span className="mr-2 font-bold">Выбрать изображение</span>
          <input
            type="file"
            accept="image/*"
            id="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="hidden"
          />
        </label>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="private-mode"
            checked={isPrivate}
            onChange={(e) => setIsPrivate(e.target.checked)}
            className="ios8-switch appearance-none"
          />

          <label htmlFor="private-mode">Приватное изображение</label>
        </div>

        <button
          type="submit"
          disabled={!file || uploading}
          className="w-full text-white bg-violet-500 px-4 py-2 rounded-full
                     hover:bg-violet-600 focus:outline-none focus:ring-2
                     focus:ring-violet-400 disabled:bg-violet-900"
        >
          {uploading ? "Загрузка..." : "Загрузить"}
        </button>
      </form>

      {viewUrl && (
        <div className="mt-4">
          <p className="text-sm text-gray-600 mb-2">
            Ссылка для просмотра изображения:
          </p>
          <Link
            href={viewUrl}
            className="text-blue-500 hover:underline break-all inline-block px-4 py-2 bg-blue-100 rounded-md"
          >
            Просмотреть загруженное изображение
          </Link>
        </div>
      )}
    </div>
  );
}
