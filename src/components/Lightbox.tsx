"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Photo } from "@/lib/types";

interface LightboxProps {
  photos: Photo[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function Lightbox({
  photos,
  initialIndex,
  isOpen,
  onClose,
}: LightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") goToPrevious();
    if (e.key === "ArrowRight") goToNext();
    if (e.key === "Escape") onClose();
  };

  if (!isOpen || photos.length === 0) return null;

  const currentPhoto = photos[currentIndex];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black flex items-center justify-center"
        onClick={onClose}
        onKeyDown={handleKeyDown}
        tabIndex={0}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-white/70 hover:text-white z-10"
          aria-label="关闭"
        >
          <X size={32} />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            goToPrevious();
          }}
          className="absolute left-4 p-2 text-white/70 hover:text-white z-10"
          aria-label="上一张"
        >
          <ChevronLeft size={48} />
        </button>

        <motion.div
          key={currentPhoto.id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="max-w-[90vw] max-h-[90vh] flex flex-col items-center"
          onClick={(e) => e.stopPropagation()}
        >
          <img
            src={currentPhoto.src}
            alt={currentPhoto.title}
            className="max-h-[85vh] object-contain"
          />
          <div className="mt-4 text-center">
            <h3 className="text-lg font-medium">{currentPhoto.title}</h3>
            {currentPhoto.description && (
              <p className="text-sm text-gray-400 mt-1">
                {currentPhoto.description}
              </p>
            )}
          </div>
        </motion.div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            goToNext();
          }}
          className="absolute right-4 p-2 text-white/70 hover:text-white z-10"
          aria-label="下一张"
        >
          <ChevronRight size={48} />
        </button>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm text-gray-400">
          {currentIndex + 1} / {photos.length}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
