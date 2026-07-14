"use client";

import { useState } from "react";
import Image from "next/image";

export default function ProductGallery({
  images,
  alt,
}: {
  images: string[];
  alt: string;
}) {
  const [active, setActive] = useState(0);
  const src = images[active];

  return (
    <div>
      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-pink-50">
        {src ? (
          <Image src={src} alt={alt} fill className="object-cover" />
        ) : null}
      </div>

      {images.length > 1 ? (
        <div className="mt-3 flex gap-2">
          {images.map((img, i) => (
            <button
              key={img}
              type="button"
              onClick={() => setActive(i)}
              className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-md border-2 ${
                i === active ? "border-pink-600" : "border-transparent"
              }`}
            >
              <Image
                src={img}
                alt={`${alt} ${i + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
