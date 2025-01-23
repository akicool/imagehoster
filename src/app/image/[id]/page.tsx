import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import clsx from "clsx";

import { supabase } from "@/lib/supabase";
import { ButtonCopy } from "@/shared/Buttons/Copy";
import { DateTime } from "luxon";

export const revalidate = 0; // Отключаем кэширование для этой страницы

async function getImageData(unique_id: string) {
  const { data, error } = await supabase
    .from("image_metadata")
    .select("*")
    .eq("unique_id", unique_id)
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
  const { id: unique_id } = await params;

  const imageData = await getImageData(unique_id);

  if (!imageData) {
    notFound();
  }

  const { data: publicUrlData } = supabase.storage
    .from("images")
    .getPublicUrl(imageData?.filename);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center gap-3 mb-4">
        <Link href="/">
          <ArrowLeft color="#000" />
        </Link>

        <h1 className="text-3xl font-bold text-black">Просмотр изображения</h1>
      </div>

      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="relative aspect-video">
          <div
            className="absolute inset-0 bg-white scale-105 filter blur-md"
            style={{
              backgroundImage: `url(${publicUrlData?.publicUrl})`,
              backgroundSize: "cover",
            }}
          />

          <div
            className={clsx(
              "flex w-full p-3 items-start z-10 relative",
              imageData?.is_private ? "justify-between" : "justify-end"
            )}
          >
            {imageData?.is_private && (
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-xs font-medium filter backdrop-blur-md bg-opacity-20">
                Private
              </span>
            )}

            <div className="active:pt-1">
              <ButtonCopy params={{ unique_id: imageData.unique_id }} />
            </div>
          </div>

          <Image
            src={publicUrlData?.publicUrl}
            alt={`Изображение ${imageData?.filename}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-contain"
            priority
          />
        </div>

        <div className="p-6 text-black relative z-10 mt-3">
          <h2 className="text-xl font-semibold mb-2">Детали изображения</h2>

          <p className="mb-1">
            <span className="font-medium">Имя файла: </span>
            {imageData?.filename}
          </p>

          <p className="mb-1">
            <span className="font-medium">Загружено: </span>
            <span>
              {DateTime.fromISO(imageData?.created_at)
                .setZone("Europe/Moscow")
                .toFormat("dd.MM.yyyy")}
            </span>{" "}
            в{" "}
            <span>
              {DateTime.fromISO(imageData?.created_at)
                .setZone("Europe/Moscow")
                .toFormat("HH:mm")}
            </span>
          </p>

          <p className="mb-1">
            <span className="font-medium">ID: </span> {imageData?.id}
          </p>

          <p className="">
            <span className="font-medium">Тип: </span>
            {imageData?.is_private ? "Приватное" : "Публичное"}
          </p>
        </div>
      </div>
    </div>
  );
}
