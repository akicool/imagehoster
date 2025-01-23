"use client";
import { CopyIcon } from "lucide-react";
import React from "react";
import { toast } from "react-toastify";

type Props = { params: { unique_id: string } };

export const ButtonCopy = ({ params }: Props) => {
  const handleCopyImageUrl = () => {
    navigator.clipboard.writeText(
      `${window.location.origin}/image/${params.unique_id}`
    );

    toast.success("Ссылка на изображение скопирована!");
  };

  return (
    <button
      className="px-4 py-2 rounded-md shadow-lg text-white"
      style={{ backgroundColor: "#1DA1F2", borderColor: "#1DA1F2" }}
      onClick={handleCopyImageUrl}
    >
      <CopyIcon />
    </button>
  );
};
