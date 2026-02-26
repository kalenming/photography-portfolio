"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PhotoGrid from "@/components/PhotoGrid";
import Lightbox from "@/components/Lightbox";
import { THEME_CATEGORIES } from "@/lib/constants";

interface PhotoData {
  id: string;
  title: string;
  originalPath: string;
  thumbnailPath: string;
  width: number;
  height: number;
  shotAt: string | null;
  location: string | null;
  description: string | null;
  year: number;
  month: number;
  categories: { category: { id: string; name: string } }[];
}

interface Stats {
  years: number[];
  months: { year: number; month: number }[];
  locations: string[];
  totalPhotos: number;
}

export default function GalleryPage() {
  const [photos, setPhotos] = useState<PhotoData[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTheme, setActiveTheme] = useState<string | null>(null);
  const [activeYear, setActiveYear] = useState<string | null>(null);
  const [activeLocation, setActiveLocation] = useState<string | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    fetchPhotos();
  }, [activeTheme, activeYear, activeLocation]);

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/stats");
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const fetchPhotos = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (activeYear) params.append("year", activeYear);
      if (activeTheme) params.append("category", activeTheme);
      if (activeLocation) params.append("location", activeLocation);

      const response = await fetch(`/api/photos?${params.toString()}`);
      const data = await response.json();
      setPhotos(data);
    } catch (error) {
      console.error("Error fetching photos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoClick = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const lightboxPhotos = photos.map((p) => ({
    id: p.id,
    title: p.title,
    src: p.originalPath,
    width: p.width,
    height: p.height,
    themes: p.categories.map((c) => c.category.name),
    year: p.year,
    location: p.location || undefined,
    description: p.description || undefined,
  }));

  return (
    <main className="min-h-screen bg-black">
      <Header />
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-light mb-8">作品集</h1>

        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium text-gray-400 mb-3">按年份</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveYear(null)}
                className={`px-4 py-2 rounded-full text-sm transition-colors ${
                  activeYear === null
                    ? "bg-white text-black"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
              >
                全部
              </button>
              {stats?.years.map((year) => (
                <button
                  key={year}
                  onClick={() => setActiveYear(year.toString())}
                  className={`px-4 py-2 rounded-full text-sm transition-colors ${
                    activeYear === year.toString()
                      ? "bg-white text-black"
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  {year}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-400 mb-3">按主题</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveTheme(null)}
                className={`px-4 py-2 rounded-full text-sm transition-colors ${
                  activeTheme === null
                    ? "bg-white text-black"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
              >
                全部
              </button>
              {THEME_CATEGORIES.map((theme) => (
                <button
                  key={theme}
                  onClick={() => setActiveTheme(theme)}
                  className={`px-4 py-2 rounded-full text-sm transition-colors ${
                    activeTheme === theme
                      ? "bg-white text-black"
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  {theme}
                </button>
              ))}
            </div>
          </div>

          {stats?.locations && stats.locations.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-3">按地点</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setActiveLocation(null)}
                  className={`px-4 py-2 rounded-full text-sm transition-colors ${
                    activeLocation === null
                      ? "bg-white text-black"
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  全部
                </button>
                {stats.locations.map((loc) => (
                  <button
                    key={loc}
                    onClick={() => setActiveLocation(loc || null)}
                    className={`px-4 py-2 rounded-full text-sm transition-colors ${
                      activeLocation === loc
                        ? "bg-white text-black"
                        : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                    }`}
                  >
                    {loc}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-8">
          {loading ? (
            <div className="text-center py-20 text-gray-400">加载中...</div>
          ) : photos.length > 0 ? (
            <PhotoGrid
              photos={lightboxPhotos}
              onPhotoClick={handlePhotoClick}
            />
          ) : (
            <div className="text-center py-20 text-gray-400">
              暂无符合条件的作品
            </div>
          )}
        </div>
      </div>
      <Footer />

      <Lightbox
        photos={lightboxPhotos}
        initialIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </main>
  );
}
