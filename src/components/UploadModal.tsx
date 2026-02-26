"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, Check, Loader2, Image as ImageIcon } from "lucide-react";
import { THEME_CATEGORIES } from "@/lib/constants";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadComplete: () => void;
}

interface FileWithPreview {
  file: File;
  preview: string;
  title: string;
  description: string;
  categories: string[];
  location: string;
  status: "pending" | "uploading" | "success" | "error";
}

export default function UploadModal({
  isOpen,
  onClose,
  onUploadComplete,
}: UploadModalProps) {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files).filter((file) =>
      file.type.startsWith("image/")
    );

    const newFiles = droppedFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      title: file.name.replace(/\.[^/.]+$/, ""),
      description: "",
      categories: [] as string[],
      location: "",
      status: "pending" as const,
    }));

    setFiles((prev) => [...prev, ...newFiles]);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []).filter((file) =>
      file.type.startsWith("image/")
    );

    const newFiles = selectedFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      title: file.name.replace(/\.[^/.]+$/, ""),
      description: "",
      categories: [] as string[],
      location: "",
      status: "pending" as const,
    }));

    setFiles((prev) => [...prev, ...newFiles]);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => {
      const newFiles = [...prev];
      URL.revokeObjectURL(newFiles[index].preview);
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const updateFile = (
    index: number,
    updates: Partial<FileWithPreview>
  ) => {
    setFiles((prev) => {
      const newFiles = [...prev];
      newFiles[index] = { ...newFiles[index], ...updates };
      return newFiles;
    });
  };

  const toggleCategory = (fileIndex: number, category: string) => {
    setFiles((prev) => {
      const newFiles = [...prev];
      const categories = newFiles[fileIndex].categories;
      if (categories.includes(category)) {
        newFiles[fileIndex].categories = categories.filter(
          (c) => c !== category
        );
      } else {
        newFiles[fileIndex].categories = [...categories, category];
      }
      return newFiles;
    });
  };

  const uploadFiles = async () => {
    setIsUploading(true);

    for (let i = 0; i < files.length; i++) {
      const fileData = files[i];
      if (fileData.status !== "pending") continue;

      updateFile(i, { status: "uploading" });

      try {
        const formData = new FormData();
        formData.append("file", fileData.file);
        formData.append("title", fileData.title);
        formData.append("description", fileData.description);
        formData.append("categories", fileData.categories.join(","));
        formData.append("location", fileData.location);

        const response = await fetch("/api/photos", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          updateFile(i, { status: "success" });
        } else {
          updateFile(i, { status: "error" });
        }
      } catch (error) {
        console.error("Upload error:", error);
        updateFile(i, { status: "error" });
      }
    }

    setIsUploading(false);
    onUploadComplete();
  };

  const handleClose = () => {
    files.forEach((f) => URL.revokeObjectURL(f.preview));
    setFiles([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-gray-900 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-4 border-b border-gray-800">
            <h2 className="text-xl font-medium">上传作品</h2>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-800 rounded-full"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-4 overflow-y-auto max-h-[calc(90vh-140px)]">
            {files.length === 0 ? (
              <div
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                className="border-2 border-dashed border-gray-700 rounded-lg p-12 text-center hover:border-gray-500 transition-colors cursor-pointer"
              >
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="mx-auto mb-4 text-gray-500" size={48} />
                  <p className="text-gray-400 mb-2">
                    拖拽图片到这里，或点击选择文件
                  </p>
                  <p className="text-gray-600 text-sm">
                    支持 JPEG、PNG、RAW、TIFF 等格式
                  </p>
                </label>
              </div>
            ) : (
              <div className="space-y-4">
                {files.map((fileData, index) => (
                  <div
                    key={index}
                    className="bg-gray-800 rounded-lg p-4 flex gap-4"
                  >
                    <div className="w-32 h-24 relative flex-shrink-0">
                      <img
                        src={fileData.preview}
                        alt={fileData.title}
                        className="w-full h-full object-cover rounded"
                      />
                      {fileData.status !== "pending" && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded">
                          {fileData.status === "uploading" && (
                            <Loader2 className="animate-spin" size={24} />
                          )}
                          {fileData.status === "success" && (
                            <Check className="text-green-500" size={24} />
                          )}
                          {fileData.status === "error" && (
                            <X className="text-red-500" size={24} />
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <input
                          type="text"
                          value={fileData.title}
                          onChange={(e) =>
                            updateFile(index, { title: e.target.value })
                          }
                          placeholder="作品标题"
                          className="bg-gray-700 px-3 py-1.5 rounded text-sm w-64"
                        />
                        <button
                          onClick={() => removeFile(index)}
                          className="p-1 hover:bg-gray-700 rounded"
                        >
                          <X size={16} />
                        </button>
                      </div>

                      <input
                        type="text"
                        value={fileData.location}
                        onChange={(e) =>
                          updateFile(index, { location: e.target.value })
                        }
                        placeholder="拍摄地点（可选）"
                        className="bg-gray-700 px-3 py-1.5 rounded text-sm w-full"
                      />

                      <textarea
                        value={fileData.description}
                        onChange={(e) =>
                          updateFile(index, { description: e.target.value })
                        }
                        placeholder="作品描述（可选）"
                        className="bg-gray-700 px-3 py-1.5 rounded text-sm w-full h-16 resize-none"
                      />

                      <div className="flex flex-wrap gap-2">
                        {THEME_CATEGORIES.map((category) => (
                          <button
                            key={category}
                            onClick={() => toggleCategory(index, category)}
                            className={`px-3 py-1 rounded-full text-xs transition-colors ${
                              fileData.categories.includes(category)
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
                ))}

                <div
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                  className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center hover:border-gray-500 transition-colors cursor-pointer"
                >
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="file-upload-more"
                  />
                  <label
                    htmlFor="file-upload-more"
                    className="cursor-pointer text-gray-400"
                  >
                    <ImageIcon className="mx-auto mb-2" size={24} />
                    添加更多图片
                  </label>
                </div>
              </div>
            )}
          </div>

          {files.length > 0 && (
            <div className="flex items-center justify-between p-4 border-t border-gray-800">
              <span className="text-gray-400 text-sm">
                {files.filter((f) => f.status === "success").length} /{" "}
                {files.length} 已上传
              </span>
              <div className="flex gap-3">
                <button
                  onClick={handleClose}
                  className="px-4 py-2 text-gray-400 hover:text-white"
                >
                  取消
                </button>
                <button
                  onClick={uploadFiles}
                  disabled={isUploading || files.every((f) => f.status !== "pending")}
                  className="px-6 py-2 bg-white text-black rounded-full hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isUploading && <Loader2 className="animate-spin" size={16} />}
                  开始上传
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
