const INDUSTRIES = [
  "Skincare",
  "Fashion",
  "Real Estate",
  "Music Industry",
  "Artists",
  "Tech",
  "Hospitality",
  "E-Commerce",
];

export default function Marquee() {
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {/* list doubled so the -50% slide loops seamlessly */}
        {[...INDUSTRIES, ...INDUSTRIES].map((name, i) => (
          <span key={i}>{name}</span>
        ))}
      </div>
    </div>
  );
}
