"use client";

import React from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "react-toastify";
import { TrashIcon } from "lucide-react";

type Props = {
  image: {
    unique_id: string;
    filename: string;
  };
};

const handleImageRemove = async (image: {
  unique_id: string;
  filename: string;
}) => {
  const { error } = await supabase
    .from("image_metadata")
    .delete()
    .eq("unique_id", image.unique_id);

  if (error) {
    console.error("Error deleting image:", error);
  } else {
    const { error: deleteError } = await supabase
      .from("image_metadata")
      .delete()
      .eq("unique_id", image.unique_id);

    if (deleteError)
      console.error("Error deleting image metadata:", deleteError);

    const { data } = await supabase.storage
      .from("images")
      .remove([image.filename]);

    if (!data) {
      toast.success("Изображение удалено");
    }
  }
};

export const ButtonRemove = ({ image }: Props) => {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();

        handleImageRemove(image);
      }}
      className="absolute top-2 right-2 text-white p-2 rounded z-10"
      style={{ backgroundColor: "red" }}
    >
      <TrashIcon size={16} />
    </button>
  );
};
