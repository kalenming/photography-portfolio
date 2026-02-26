"use client";

import { motion } from "framer-motion";
import { Photo } from "@/lib/types";

interface PhotoGridProps {
  photos: Photo[];
  onPhotoClick: (index: number) => void;
}

export default function PhotoGrid({ photos, onPhotoClick }: PhotoGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {photos.map((photo, index) => (
        <motion.div
          key={photo.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.05 }}
          className="relative aspect-[4/3] cursor-pointer overflow-hidden group"
          onClick={() => onPhotoClick(index)}
        >
          <img
            src={photo.src}
            alt={photo.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300">
            <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <h3 className="text-white font-medium">{photo.title}</h3>
              {photo.description && (
                <p className="text-white/70 text-sm mt-1">{photo.description}</p>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
