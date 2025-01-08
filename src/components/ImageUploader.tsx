"use client";

import Link from "next/link";
import { FormEvent, memo, useCallback, useEffect, useState } from "react";
import { type FileWithPath, useDropzone } from "react-dropzone";
import { toast } from "react-toastify";
import { FileIcon, InfoIcon, UploadIcon, XIcon } from "lucide-react";
import clsx from "clsx";
import { Inter } from "next/font/google";
import { Popover } from "react-tiny-popover";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const FileSize = ({ size }: { size: number }) => {
  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  };

  return <span className="text-xs text-gray-500">{formatBytes(size)}</span>;
};

const FileList = memo(
  ({
    files,
    uploading,
    handleRemoveFile,
  }: {
    files: FileWithPath[];
    uploading: boolean;
    handleRemoveFile: (file: FileWithPath) => void;
  }) => {
    return (
      <div className="flex flex-col">
        {files.map((file, idx) => (
          <div
            key={idx}
            className="mb-2 p-2 border-solid border-[#E6E6E6] border-2 rounded-md flex justify-between items-center"
          >
            <div className="flex gap-2 items-center">
              <FileIcon size={16} color="#ADACB0" />

              <p
                className={clsx(
                  "text-sm text-gray-600 font-medium",
                  inter.variable
                )}
              >
                File {file.name}
              </p>

              <FileSize size={file.size} />
            </div>

            <div className="flex items-center gap-2">
              {uploading && <div className="file-loader" />}

              <button onClick={() => handleRemoveFile(file)}>
                <XIcon size={16} color="#0A090B" />
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  }
);

FileList.displayName = "FileList";

export function ImageUploader() {
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone();

  const [files, setFiles] = useState<FileWithPath[] | File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [viewUrl, setViewUrl] = useState<string | null>(null);
  const [isPrivate, setIsPrivate] = useState(false);
  const [info, setInfo] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!files || files.length === 0) return;

    if (files.length > 5) {
      toast.error("Можно загрузить не более 5 файлов");
      return;
    }

    setUploading(true);

    const formData = new FormData();
    files.map((file) => formData.append("files", file));
    formData.append("isPrivate", isPrivate.toString());

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Успешно загружено");
        setFiles([]);
        setViewUrl(data.viewUrl);
      } else {
        throw new Error(data.error || "Ошибка при загрузке");
      }
    } catch (error) {
      console.error("Error uploading file:", error);

      toast.error(
        error instanceof Error ? error.message : "Ошибка при загрузке"
      );
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveFile = useCallback((file: FileWithPath) => {
    setFiles((prevFiles) => prevFiles.filter((prevFile) => prevFile !== file));
  }, []);

  useEffect(() => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      setFiles(acceptedFiles as FileWithPath[]);
    }
  }, [acceptedFiles]);

  return (
    <div className="space-y-4" onClick={() => setInfo(false)}>
      <section className="">
        <div
          {...getRootProps({
            className: clsx(
              "dropzone cursor-pointer py-20",
              "border-2 border-dashed border-gray-300",
              "p-4 rounded-lg",
              "hover:border-blue-500 hover:bg-[#F8F8F8]",
              "focus:outline-none focus:border-blue-500",
              "transition duration-300 ease-in-out",
              inter.variable
            ),
          })}
        >
          <input {...getInputProps()} accept="image/*" multiple />

          <div className="flex flex-col items-center gap-1">
            <div className="bg-[#F8F8F8] p-4 rounded-lg">
              <UploadIcon />
            </div>

            <p className="text-center text-black font-semibold text-sm">
              Загрузите / перенесите файл
            </p>

            <span className="text-[#4F4D55] text-xs">
              png, jpg, jpeg, gif, bmp, ico, tiff, webp
            </span>
          </div>
        </div>

        <aside className="mt-4">
          <h4 className="text-lg font-medium">Загруженные файлы</h4>
          {files.length > 0 && (
            <FileList
              files={files as FileWithPath[]}
              uploading={uploading}
              handleRemoveFile={handleRemoveFile}
            />
          )}
        </aside>
      </section>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col-reverse sm:flex-row gap-3 sm:items-center"
      >
        <button
          type="submit"
          disabled={!files?.length || uploading}
          className="w-fit text-white bg-[#1751D0] px-4 py-2 rounded-md
                    hover:bg-blue-600 focus:ring-blue-400
                    disabled:bg-gray-500 cursor-pointer"
        >
          {uploading ? "Загрузка..." : "Загрузить"}
        </button>

        <div className="flex items-center space-x-2 w-fit">
          <input
            type="checkbox"
            id="private-mode"
            checked={isPrivate}
            onChange={(e) => setIsPrivate(e.target.checked)}
            className="ios8-switch appearance-none"
          />

          <label
            htmlFor="private-mode"
            className="cursor-pointer text-nowrap !pt-0 w-full"
          >
            Приватное изображение
          </label>

          <button
            className={clsx("relative", info || "active:pt-2")}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setInfo(!info);
            }}
          >
            <Popover
              isOpen={info}
              positions={["top", "bottom", "left", "right"]}
              content={
                <div className="w-full flex justify-center">
                  <div className="bg-gray-900 rounded p-2 w-3/4 text-balance text-center mb-2">
                    Приватное изображение не будет отображаться в галерее
                  </div>
                </div>
              }
            >
              <div onClick={() => setInfo(!info)}>
                <InfoIcon size={20} />
              </div>
            </Popover>
          </button>
        </div>
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
