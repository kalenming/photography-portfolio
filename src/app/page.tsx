import Header from "@/components/Header";
import HeroGallery from "@/components/HeroGallery";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Header />
      <HeroGallery />
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="p-8">
              <div className="text-4xl font-light mb-4">100+</div>
              <div className="text-gray-400">精选作品</div>
            </div>
            <div className="p-8">
              <div className="text-4xl font-light mb-4">5</div>
              <div className="text-gray-400">摄影主题</div>
            </div>
            <div className="p-8">
              <div className="text-4xl font-light mb-4">∞</div>
              <div className="text-gray-400">光影故事</div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
