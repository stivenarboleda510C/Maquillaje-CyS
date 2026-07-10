"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { Ad } from "@/lib/api";

const AUTOPLAY_MS = 5000;

export default function AdsCarousel({ ads }: { ads: Ad[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (ads.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % ads.length);
    }, AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [ads.length]);

  if (ads.length === 0) return null;

  function goTo(i: number) {
    setIndex((i + ads.length) % ads.length);
  }

  return (
    <div className="relative mt-6 aspect-[3/1] w-full overflow-hidden rounded-xl bg-pink-50">
      {ads.map((ad, i) => (
        <div
          key={ad.id}
          className={`absolute inset-0 transition-opacity duration-500 ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image src={ad.image_url} alt="Publicidad" fill className="object-cover" />
        </div>
      ))}

      {ads.length > 1 ? (
        <>
          <button
            type="button"
            onClick={() => goTo(index - 1)}
            aria-label="Banner anterior"
            className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-gray-700 shadow hover:bg-white"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => goTo(index + 1)}
            aria-label="Siguiente banner"
            className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-gray-700 shadow hover:bg-white"
          >
            ›
          </button>
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
            {ads.map((ad, i) => (
              <button
                key={ad.id}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Ir al banner ${i + 1}`}
                className={`h-2.5 w-2.5 rounded-full ${
                  i === index ? "bg-pink-600" : "bg-white/80"
                }`}
              />
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}
