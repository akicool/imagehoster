import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { ArrowLeft } from "lucide-react";
import { ButtonCopy } from "@/shared/ButtonCopy";

export const revalidate = 0; // Отключаем кэширование для этой страницы

async function getImageData(id: string) {
  const { data, error } = await supabase
    .from("image_metadata")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    notFound();
  }

  return data;
}

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ImagePage({ params }: Props) {
  const { id } = await params;
  const imageData = await getImageData(id);

  if (!imageData) {
    notFound();
  }

  const { data: publicUrlData } = supabase.storage
    .from("images")
    .getPublicUrl(imageData.filename);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/">
          <ArrowLeft />
        </Link>
        <h1 className="text-3xl font-bold">Просмотр изображения</h1>
      </div>

      <div className="bg-gray-700 shadow-lg rounded-lg overflow-hidden">
        <div className="relative aspect-video">
          <div className="absolute top-2 right-2 z-10 active:pt-1">
            <ButtonCopy params={{ id: imageData.id }} />
          </div>

          <Image
            src={publicUrlData.publicUrl}
            alt={`Изображение ${imageData.filename}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-contain"
            priority
          />
        </div>

        <div className="p-6 text-white">
          <h2 className="text-xl font-semibold mb-2">Детали изображения</h2>

          <p className=" mb-1">
            <span className="font-medium">Имя файла:</span> {imageData.filename}
          </p>

          <p className=" mb-1">
            <span className="font-medium">Загружено:</span>{" "}
            {new Date(imageData.uploaded_at).toLocaleString()}
          </p>

          <p className=" mb-1">
            <span className="font-medium">ID:</span> {imageData.id}
          </p>

          <p className="">
            <span className="font-medium">Тип:</span>{" "}
            {imageData.is_private ? "Приватное" : "Публичное"}
          </p>
        </div>
      </div>
    </div>
  );
}
