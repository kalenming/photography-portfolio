import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SocialLinks from "@/components/SocialLinks";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-black">
      <Header />
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-light mb-12">关于我</h1>

        <div className="grid md:grid-cols-3 gap-12">
          <div className="md:col-span-1">
            <div className="aspect-square bg-gray-800 rounded-lg overflow-hidden">
              <div className="w-full h-full flex items-center justify-center text-gray-600">
                <svg
                  className="w-24 h-24"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 space-y-6">
            <section>
              <h2 className="text-xl font-medium mb-4">个人简介</h2>
              <p className="text-gray-300 leading-relaxed">
                这里可以写一段关于你自己的介绍。比如你从事摄影多少年，你的摄影风格是什么，你擅长拍摄什么类型的照片等等。
              </p>
            </section>

            <section>
              <h2 className="text-xl font-medium mb-4">拍摄理念</h2>
              <p className="text-gray-300 leading-relaxed">
                在这里分享你的摄影理念和创作灵感。是什么让你拿起相机？你希望通过照片传达什么？
              </p>
            </section>

            <section>
              <h2 className="text-xl font-medium mb-4">器材装备</h2>
              <ul className="text-gray-300 space-y-2">
                <li>相机：Sony A7IV / Canon R5 / Nikon Z8</li>
                <li>镜头：24-70mm f/2.8 / 70-200mm f/2.8</li>
                <li>其他：三脚架、滤镜、闪光灯等</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-medium mb-4">联系方式</h2>
              <div className="flex items-center gap-6">
                <SocialLinks />
              </div>
              <p className="text-gray-400 mt-4 text-sm">
                欢迎通过社交媒体联系我，或发送邮件至：your@email.com
              </p>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
