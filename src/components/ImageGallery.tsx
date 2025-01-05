import Image from "next/image";
import { readdir } from "fs/promises";
import path from "path";

async function getImages() {
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  const files = await readdir(uploadsDir);
  return files.filter((file) => /\.(jpg|jpeg|png|gif)$/i.test(file));
}

export async function ImageGallery() {
  const images = await getImages();

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {images.map((image) => (
        <div key={image} className="relative aspect-square">
          <Image
            src={`/uploads/${image}`}
            alt={image}
            fill
            className="object-cover rounded-lg"
          />
        </div>
      ))}
    </div>
  );
}
