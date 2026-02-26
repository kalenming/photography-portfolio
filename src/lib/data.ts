import { Photo, Category } from "./types";

export const photos: Photo[] = [
  {
    id: "1",
    title: "晨曦中的山脉",
    src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80",
    width: 1920,
    height: 1280,
    themes: ["landscape"],
    year: 2026,
    location: "云南",
    description: "日出时分的山脉剪影",
  },
  {
    id: "2",
    title: "城市霓虹",
    src: "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1920&q=80",
    width: 1920,
    height: 1280,
    themes: ["street", "architecture"],
    year: 2026,
    location: "上海",
    description: "夜晚的城市街道",
  },
  {
    id: "3",
    title: "静谧时光",
    src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1920&q=80",
    width: 1920,
    height: 1280,
    themes: ["portrait"],
    year: 2026,
    location: "北京",
    description: "自然光下的人像",
  },
  {
    id: "4",
    title: "光影静物",
    src: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=1920&q=80",
    width: 1920,
    height: 1280,
    themes: ["still-life"],
    year: 2026,
    location: "工作室",
    description: "窗边的光影",
  },
  {
    id: "5",
    title: "古镇晨雾",
    src: "https://images.unsplash.com/photo-1528164344705-47542687000d?w=1920&q=80",
    width: 1920,
    height: 1280,
    themes: ["landscape", "architecture"],
    year: 2025,
    location: "江南",
    description: "清晨的古镇",
  },
  {
    id: "6",
    title: "街头故事",
    src: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1920&q=80",
    width: 1920,
    height: 1280,
    themes: ["street"],
    year: 2025,
    location: "成都",
    description: "城市的另一面",
  },
  {
    id: "7",
    title: "建筑几何",
    src: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1920&q=80",
    width: 1920,
    height: 1280,
    themes: ["architecture"],
    year: 2025,
    location: "深圳",
    description: "现代建筑的线条",
  },
  {
    id: "8",
    title: "海边日落",
    src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80",
    width: 1920,
    height: 1280,
    themes: ["landscape"],
    year: 2025,
    location: "三亚",
    description: "黄昏的海岸线",
  },
  {
    id: "9",
    title: "咖啡时光",
    src: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1920&q=80",
    width: 1920,
    height: 1280,
    themes: ["still-life", "street"],
    year: 2025,
    location: "杭州",
    description: "午后的咖啡馆",
  },
  {
    id: "10",
    title: "雪山之巅",
    src: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=80",
    width: 1920,
    height: 1280,
    themes: ["landscape"],
    year: 2026,
    location: "西藏",
    description: "高原的壮美",
  },
  {
    id: "11",
    title: "都市夜景",
    src: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=1920&q=80",
    width: 1920,
    height: 1280,
    themes: ["architecture", "street"],
    year: 2026,
    location: "广州",
    description: "城市的脉搏",
  },
  {
    id: "12",
    title: "光影人像",
    src: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=1920&q=80",
    width: 1920,
    height: 1280,
    themes: ["portrait"],
    year: 2025,
    location: "工作室",
    description: "光与影的对话",
  },
];

export const themeCategories: Category[] = [
  { id: "landscape", name: "风光", type: "theme", count: 0 },
  { id: "portrait", name: "人像", type: "theme", count: 0 },
  { id: "street", name: "街拍", type: "theme", count: 0 },
  { id: "still-life", name: "静物", type: "theme", count: 0 },
  { id: "architecture", name: "建筑", type: "theme", count: 0 },
];

export const yearCategories: Category[] = [
  { id: "2026", name: "2026", type: "year", count: 0 },
  { id: "2025", name: "2025", type: "year", count: 0 },
];

export const locationCategories: Category[] = [
  { id: "beijing", name: "北京", type: "location", count: 0 },
  { id: "shanghai", name: "上海", type: "location", count: 0 },
  { id: "guangzhou", name: "广州", type: "location", count: 0 },
  { id: "shenzhen", name: "深圳", type: "location", count: 0 },
  { id: "chengdu", name: "成都", type: "location", count: 0 },
  { id: "hangzhou", name: "杭州", type: "location", count: 0 },
  { id: "yunnan", name: "云南", type: "location", count: 0 },
  { id: "tibet", name: "西藏", type: "location", count: 0 },
  { id: "sanya", name: "三亚", type: "location", count: 0 },
  { id: "jiangnan", name: "江南", type: "location", count: 0 },
];

export function getPhotosByTheme(theme: string): Photo[] {
  return photos.filter((photo) => photo.themes.includes(theme));
}

export function getPhotosByYear(year: number): Photo[] {
  return photos.filter((photo) => photo.year === year);
}

export function getPhotosByLocation(location: string): Photo[] {
  return photos.filter((photo) => photo.location === location);
}

export function getPhotoById(id: string): Photo | undefined {
  return photos.find((photo) => photo.id === id);
}

export function getCategoryCounts() {
  const themeCounts: Record<string, number> = {};
  const yearCounts: Record<string, number> = {};
  const locationCounts: Record<string, number> = {};

  photos.forEach((photo) => {
    photo.themes.forEach((theme) => {
      themeCounts[theme] = (themeCounts[theme] || 0) + 1;
    });
    yearCounts[photo.year.toString()] = (yearCounts[photo.year.toString()] || 0) + 1;
    if (photo.location) {
      const locationKey = photo.location.toLowerCase();
      locationCounts[locationKey] = (locationCounts[locationKey] || 0) + 1;
    }
  });

  return { themeCounts, yearCounts, locationCounts };
}
