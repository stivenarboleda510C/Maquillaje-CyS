import Image from "next/image";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center ${className}`}>
      <Image
        src="/logo.png"
        alt="Makeup Pinklu"
        width={48}
        height={48}
        className="h-12 w-12 rounded-full object-cover"
        priority
      />
    </span>
  );
}
