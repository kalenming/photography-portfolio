export interface Photo {
  id: string;
  title: string;
  src: string;
  width: number;
  height: number;
  themes: string[];
  year: number;
  location?: string;
  description?: string;
}

export interface Category {
  id: string;
  name: string;
  type: "theme" | "year" | "location";
  count: number;
}
