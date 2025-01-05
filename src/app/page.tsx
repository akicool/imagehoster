import { ImageUploader } from "../components/ImageUploader";
import { ImageGallery } from "../components/ImageGallery";

export default function Home() {
  return (
    <main className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Хостер изображений</h1>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Загрузить изображение</h2>
        <ImageUploader />
      </div>
      <div>
        <h2 className="text-2xl font-semibold mb-4">Галерея изображений</h2>
        <ImageGallery />
      </div>
    </main>
  );
}
