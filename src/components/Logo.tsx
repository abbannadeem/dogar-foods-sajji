import Link from "next/link";

type Variant = "horizontal" | "stacked";

export default function Logo({
  variant = "horizontal",
  height = 44,
  href = "/",
}: {
  variant?: Variant;
  height?: number;
  href?: string | null;
}) {
  const src = variant === "horizontal" ? "/logo-horizontal.svg" : "/logo.svg";
  // intrinsic aspect ratios from the SVG viewBoxes
  const ratio = variant === "horizontal" ? 320 / 80 : 200 / 230;
  const width = Math.round(height * ratio);

  const content = (
    <span
      className="inline-block text-white shrink-0"
      style={{ width, height }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt="Dogar Foods & Sajji"
        width={width}
        height={height}
        style={{ width: "100%", height: "100%", display: "block" }}
      />
    </span>
  );

  if (!href) return content;
  return (
    <Link
      href={href}
      aria-label="Dogar Foods & Sajji home"
      className="inline-flex items-center hover:opacity-90 transition shrink-0"
    >
      {content}
    </Link>
  );
}
