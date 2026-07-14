"use client";

import { usePathname } from "next/navigation";
import Marquee from "@/components/Marquee";
import {
  FacebookIcon,
  InstagramIcon,
  TikTokIcon,
  YoutubeIcon,
} from "@/components/SocialIcons";

const INSTAGRAM_URL =
  "https://www.instagram.com/maquillajecys9?igsh=MWNnNzVuNzJ4Nno4Mw==";

// TODO: reemplazar por los links reales de cada red social cuando los tengamos.
const SOCIALS = [
  { name: "Facebook", href: INSTAGRAM_URL, Icon: FacebookIcon },
  { name: "Instagram", href: INSTAGRAM_URL, Icon: InstagramIcon },
  { name: "TikTok", href: INSTAGRAM_URL, Icon: TikTokIcon },
  { name: "YouTube", href: INSTAGRAM_URL, Icon: YoutubeIcon },
];

export default function Footer() {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="mt-10 border-t border-pink-100 bg-white">
      <div className="bg-pink-50 py-2 text-sm font-semibold text-pink-600">
        <Marquee text="Excelente calidad | Atencion personalizada | Envios a nivel nacional" />
      </div>
      <div className="flex justify-center gap-4 py-6">
        {SOCIALS.map(({ name, href, Icon }) => (
          <a
            key={name}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={name}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-600 text-white hover:bg-pink-700"
          >
            <Icon />
          </a>
        ))}
      </div>
    </footer>
  );
}
