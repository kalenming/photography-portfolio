"use client";

import { Instagram, Youtube, MessageCircle } from "lucide-react";

interface SocialLink {
  name: string;
  icon: React.ReactNode;
  url: string;
}

const socialLinks: SocialLink[] = [
  {
    name: "小红书",
    icon: <MessageCircle size={20} />,
    url: "#",
  },
  {
    name: "微博",
    icon: <Instagram size={20} />,
    url: "#",
  },
  {
    name: "B站",
    icon: <Youtube size={20} />,
    url: "#",
  },
];

export default function SocialLinks() {
  return (
    <div className="flex items-center space-x-4">
      {socialLinks.map((link) => (
        <a
          key={link.name}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-all duration-200"
          aria-label={link.name}
        >
          {link.icon}
        </a>
      ))}
    </div>
  );
}
