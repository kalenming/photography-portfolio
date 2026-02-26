"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, Edit2, X, Check, Search, Filter } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import UploadModal from "@/components/UploadModal";
import Lightbox from "@/components/Lightbox";
import { THEME_CATEGORIES } from "@/lib/constants";

interface Photo {
  id: string;
  title: string;
  filename: string;
  originalPath: string;
  thumbnailPath: string;
  width: number;
  height: number;
  shotAt: string | null;
  location: string | null;
  camera: string | null;
  lens: string | null;
  iso: number | null;
  aperture: string | null;
  shutterSpeed: string | null;
  focalLength: string | null;
  description: string | null;
  year: number;
  month: number;
  day: number;
  categories: { category: { id: string; name: string } }[];
}

interface Stats {
  years: number[];
  months: { year: number; month: number }[];
  locations: string[];
  totalPhotos: number;
}

export default function ManagePage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [editingPhoto, setEditingPhoto] = useState<Photo | null>(null);

  const [filterYear, setFilterYear] = useState<string>("");
  const [filterMonth, setFilterMonth] = useState<string>("");
  const [filterLocation, setFilterLocation] = useState<string>("");
  const [filterCategory, setFilterCategory] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchPhotos = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterYear) params.append("year", filterYear);
      if (filterMonth) params.append("month", filterMonth);
      if (filterLocation) params.append("location", filterLocation);
      if (filterCategory) params.append("category", filterCategory);

      const response = await fetch(`/api/photos?${params.toString()}`);
      const data = await response.json();
      setPhotos(data);
    } catch (error) {
      console.error("Error fetching photos:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/stats");
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    fetchPhotos();
  }, [filterYear, filterMonth, filterLocation, filterCategory]);

  const handleDelete = async (id: string) => {
    if (!confirm("确定要删除这张照片吗？")) return;

    try {
      await fetch(`/api/photos/${id}`, { method: "DELETE" });
      setPhotos((prev) => prev.filter((p) => p.id !== id));
      fetchStats();
    } catch (error) {
      console.error("Error deleting photo:", error);
    }
  };

  const handleUpdate = async (photo: Photo) => {
    try {
      const response = await fetch(`/api/photos/${photo.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: photo.title,
          description: photo.description,
          location: photo.location,
          categories: photo.categories.map((c) => c.category.name),
        }),
      });
      const updated = await response.json();
      setPhotos((prev) =>
        prev.map((p) => (p.id === updated.id ? updated : p))
      );
      setEditingPhoto(null);
    } catch (error) {
      console.error("Error updating photo:", error);
    }
  };

  const filteredPhotos = photos.filter(
    (photo) =>
      photo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      photo.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      photo.location?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const uniqueMonths = stats?.months
    .filter((m) => !filterYear || m.year === parseInt(filterYear))
    .map((m) => `${m.year}-${m.month.toString().padStart(2, "0")}`) || [];

  return (
    <main className="min-h-screen bg-black">
      <Header />
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-light">作品管理</h1>
            <p className="text-gray-400 mt-1">
              共 {stats?.totalPhotos || 0} 张作品
            </p>
          </div>
          <button
            onClick={() => setIsUploadOpen(true)}
            className="flex items-center gap-2 px-6 py-2 bg-white text-black rounded-full hover:bg-gray-200"
          >
            <Plus size={18} />
            上传作品
          </button>
        </div>

        <div className="bg-gray-900 rounded-lg p-4 mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <Search size={18} className="text-gray-400" />
              <input
                type="text"
                placeholder="搜索作品..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-gray-800 px-3 py-1.5 rounded text-sm w-48"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter size={18} className="text-gray-400" />
              <select
                value={filterYear}
                onChange={(e) => {
                  setFilterYear(e.target.value);
                  setFilterMonth("");
                }}
                className="bg-gray-800 px-3 py-1.5 rounded text-sm"
              >
                <option value="">全部年份</option>
                {stats?.years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>

              <select
                value={filterMonth}
                onChange={(e) => setFilterMonth(e.target.value.split("-")[1] || "")}
                className="bg-gray-800 px-3 py-1.5 rounded text-sm"
              >
                <option value="">全部月份</option>
                {uniqueMonths.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>

              <select
                value={filterLocation}
                onChange={(e) => setFilterLocation(e.target.value)}
                className="bg-gray-800 px-3 py-1.5 rounded text-sm"
              >
                <option value="">全部地点</option>
                {stats?.locations.map((loc) => (
                  <option key={loc} value={loc || ""}>
                    {loc}
                  </option>
                ))}
              </select>

              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="bg-gray-800 px-3 py-1.5 rounded text-sm"
              >
                <option value="">全部分类</option>
                {THEME_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-400">加载中...</div>
        ) : filteredPhotos.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            暂无作品，点击上方按钮上传
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPhotos.map((photo, index) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className="bg-gray-900 rounded-lg overflow-hidden group"
              >
                <div
                  className="relative aspect-[4/3] cursor-pointer"
                  onClick={() => {
                    setLightboxIndex(index);
                    setLightboxOpen(true);
                  }}
                >
                  <img
                    src={photo.thumbnailPath}
                    alt={photo.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors">
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingPhoto(photo);
                        }}
                        className="p-2 bg-black/50 rounded-full hover:bg-black/70"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(photo.id);
                        }}
                        className="p-2 bg-black/50 rounded-full hover:bg-red-500/70"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-medium truncate">{photo.title}</h3>
                  <div className="text-sm text-gray-400 mt-1 space-y-1">
                    {photo.shotAt && (
                      <p>{new Date(photo.shotAt).toLocaleDateString("zh-CN")}</p>
                    )}
                    {photo.location && <p>📍 {photo.location}</p>}
                    {photo.camera && <p>📷 {photo.camera}</p>}
                  </div>
                  {photo.categories.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {photo.categories.map((c) => (
                        <span
                          key={c.category.id}
                          className="px-2 py-0.5 bg-gray-800 rounded text-xs"
                        >
                          {c.category.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
      <Footer />

      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUploadComplete={() => {
          fetchPhotos();
          fetchStats();
        }}
      />

      <Lightbox
        photos={filteredPhotos.map((p) => ({
          id: p.id,
          title: p.title,
          src: p.originalPath,
          width: p.width,
          height: p.height,
          themes: p.categories.map((c) => c.category.name),
          year: p.year,
          location: p.location || undefined,
          description: p.description || undefined,
        }))}
        initialIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />

      {editingPhoto && (
        <EditModal
          photo={editingPhoto}
          onClose={() => setEditingPhoto(null)}
          onSave={handleUpdate}
        />
      )}
    </main>
  );
}

function EditModal({
  photo,
  onClose,
  onSave,
}: {
  photo: Photo;
  onClose: () => void;
  onSave: (photo: Photo) => void;
}) {
  const [title, setTitle] = useState(photo.title);
  const [description, setDescription] = useState(photo.description || "");
  const [location, setLocation] = useState(photo.location || "");
  const [categories, setCategories] = useState(
    photo.categories.map((c) => c.category.name)
  );

  const toggleCategory = (category: string) => {
    setCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleSave = () => {
    onSave({
      ...photo,
      title,
      description,
      location,
      categories: categories.map((name) => ({
        category: { id: "", name },
      })),
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-gray-900 rounded-lg w-full max-w-lg p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-medium">编辑作品</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-full">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">标题</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-gray-800 px-3 py-2 rounded"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">拍摄地点</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-gray-800 px-3 py-2 rounded"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">描述</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-gray-800 px-3 py-2 rounded h-24 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">分类标签</label>
            <div className="flex flex-wrap gap-2">
              {THEME_CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => toggleCategory(category)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    categories.includes(category)
                      ? "bg-white text-black"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-400 hover:text-white"
          >
            取消
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-white text-black rounded-full hover:bg-gray-200 flex items-center gap-2"
          >
            <Check size={16} />
            保存
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
