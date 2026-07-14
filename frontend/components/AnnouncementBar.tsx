"use client";

import { usePathname } from "next/navigation";
import Marquee from "@/components/Marquee";

export default function AnnouncementBar() {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <div className="bg-pink-200 py-2 text-sm font-semibold text-pink-900">
      <Marquee text="🚚 Envios GRATIS por compras superiores a $120.000" />
    </div>
  );
}
