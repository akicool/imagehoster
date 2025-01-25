import ImageGenerator from "@/components/Image/Generator";
import { Logo } from "@/shared/Logo";

export default async function GeneratorPage() {
  return (
    <main className="container mx-auto flex w-full h-dvh flex-col items-center justify-center px-10 pt-20 pb-5 sm:p-20 text-black relative gap-4">
      <div className="absolute top-8 left-4">
        <Logo />
      </div>

      <h1 className="text-4xl font-bold">Image AI</h1>
      <ImageGenerator />
    </main>
  );
}
