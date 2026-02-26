"use client";

import SocialLinks from "./SocialLinks";

export default function Footer() {
  return (
    <footer className="bg-black border-t border-gray-800 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h3 className="text-lg font-medium mb-2">摄影作品集</h3>
            <p className="text-gray-400 text-sm">
              用镜头记录光影，用影像讲述故事
            </p>
          </div>

          <div className="flex flex-col items-center md:items-end gap-4">
            <SocialLinks />
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
