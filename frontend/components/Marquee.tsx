export default function Marquee({ text }: { text: string }) {
  return (
    <div className="overflow-hidden whitespace-nowrap">
      <div className="inline-flex animate-marquee">
        <span className="mx-6">{text}</span>
        <span className="mx-6">{text}</span>
      </div>
    </div>
  );
}
