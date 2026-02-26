"use client";

import { motion } from "framer-motion";
import { Category } from "@/lib/types";
import { getCategoryCounts } from "@/lib/data";

interface CategoryFilterProps {
  categories: Category[];
  activeCategory: string | null;
  onCategoryChange: (categoryId: string | null) => void;
  title: string;
}

export default function CategoryFilter({
  categories,
  activeCategory,
  onCategoryChange,
  title,
}: CategoryFilterProps) {
  const { themeCounts, yearCounts, locationCounts } = getCategoryCounts();

  const getCount = (category: Category): number => {
    if (category.type === "theme") return themeCounts[category.id] || 0;
    if (category.type === "year") return yearCounts[category.id] || 0;
    return locationCounts[category.id] || 0;
  };

  return (
    <div className="mb-8">
      <h3 className="text-sm font-medium text-gray-400 mb-3">{title}</h3>
      <div className="flex flex-wrap gap-2">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onCategoryChange(null)}
          className={`px-4 py-2 rounded-full text-sm transition-colors duration-200 ${
            activeCategory === null
              ? "bg-white text-black"
              : "bg-gray-800 text-gray-300 hover:bg-gray-700"
          }`}
        >
          全部
        </motion.button>
        {categories.map((category) => {
          const count = getCount(category);
          if (count === 0) return null;
          return (
            <motion.button
              key={category.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onCategoryChange(category.id)}
              className={`px-4 py-2 rounded-full text-sm transition-colors duration-200 ${
                activeCategory === category.id
                  ? "bg-white text-black"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              {category.name}
              <span className="ml-1 text-gray-500">({count})</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
