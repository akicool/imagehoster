import ImageGenerator from "@/components/Image/Generator";
import { Logo } from "@/shared/Logo";

export default async function GeneratorPage() {
  return (
    <main className="container mx-auto flex min-h-screen flex-col items-center justify-center px-10 py-5 sm:p-20 text-black relative gap-4">
      <div className="absolute top-8 left-4">
        <Logo />
      </div>

      <h1 className="text-4xl font-bold">Image AI</h1>
      <ImageGenerator />
    </main>
  );
}
