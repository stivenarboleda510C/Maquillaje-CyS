import Image from "next/image";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <Image
        src="/logo.png"
        alt="Makeup Pinklu"
        width={48}
        height={48}
        className="h-12 w-12 rounded-full object-cover"
        priority
      />
      <span className="text-xl font-bold leading-none text-gray-900">
        Makeup <span className="text-pink-600">PINKLu</span>
      </span>
    </span>
  );
}
