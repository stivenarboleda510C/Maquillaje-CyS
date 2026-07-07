export default function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <span
        className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-white"
        style={{
          background: "linear-gradient(135deg, #ec4899 0%, #2dd4bf 100%)",
        }}
      >
        CyS
      </span>
      <span className="text-xl font-bold leading-none text-gray-900">
        Maquillaje <span className="text-pink-600">CyS</span>
      </span>
    </span>
  );
}
