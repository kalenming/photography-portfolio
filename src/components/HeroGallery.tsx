"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { photos } from "@/lib/data";

export default function HeroGallery() {
  const featuredPhotos = photos.slice(0, 6);

  return (
    <section className="relative h-screen w-full overflow-hidden">
      <div className="absolute inset-0 grid grid-cols-2 md:grid-cols-3 gap-1">
        {featuredPhotos.map((photo, index) => (
          <motion.div
            key={photo.id}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: index * 0.1 }}
            className="relative overflow-hidden"
          >
            <img
              src={photo.src}
              alt={photo.title}
              className="w-full h-full object-cover opacity-60"
            />
          </motion.div>
        ))}
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/80" />

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-4xl md:text-6xl lg:text-7xl font-light tracking-wide mb-6"
        >
          摄影作品集
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="text-gray-300 text-lg md:text-xl mb-8 max-w-2xl"
        >
          用镜头记录光影，用影像讲述故事
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
        >
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 px-8 py-3 bg-white text-black rounded-full hover:bg-gray-200 transition-colors duration-200"
          >
            浏览作品
            <ArrowRight size={18} />
          </Link>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1.5 h-1.5 bg-white/50 rounded-full mt-2"
          />
        </div>
      </motion.div>
    </section>
  );
}
