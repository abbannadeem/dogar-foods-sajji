type Review = {
  id: string;
  name: string;
  city: string;
  branch: string;
  rating: number;
  text: string;
};

const REVIEWS: Review[] = [
  {
    id: "rev-ahmad",
    name: "Ahmad Hassan",
    city: "Lahore",
    branch: "Tajpura local",
    rating: 5,
    text:
      "Full Chicken Sajji here has the char that cracks under teeth. My kids won't eat Sajji anywhere else now. Every Friday — Dogar or nothing.",
  },
  {
    id: "rev-fatima",
    name: "Fatima Khan",
    city: "Faisalabad",
    branch: "Susan Road regular",
    rating: 5,
    text:
      "The Mutton Karahi brought my dadi to tears — tastes exactly like her Baloch family recipe. Red oil, char, the works. Asli swad.",
  },
  {
    id: "rev-umer",
    name: "Umer Iqbal",
    city: "Lahore",
    branch: "Garhi Shahu late-night",
    rating: 5,
    text:
      "After midnight movies at Cineplex, we hit Garhi Shahu for hot naan and tikka. Smokiness on that tikka at 2 AM hits zabardast — it's a ritual now.",
  },
];

function Star() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="text-accent-500 drop-shadow-[0_0_3px_rgba(245,158,11,0.4)]"
      aria-hidden="true"
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

export default function Testimonials() {
  return (
    <section className="container-x py-16 md:py-20">
      <div className="text-center mb-12 max-w-2xl mx-auto">
        <span className="text-[11px] uppercase tracking-[0.3em] text-brand-500 font-bold">
          Loved by Foodies
        </span>
        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black mt-2 uppercase leading-[1.05] tracking-tight">
          Real Plates. <br className="sm:hidden" /> Real People.
        </h2>
        <p className="text-muted mt-4 text-sm sm:text-base">
          From Tajpura regulars to Faisalabad foodies — here&apos;s what they
          say after dinner.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-5 md:gap-6 items-stretch">
        {REVIEWS.map((r, i) => (
          <article
            key={r.id}
            className={`relative bg-surface rounded-2xl p-7 pt-10 border border-border hover:border-brand-600/60 transition-all duration-300 ${
              i === 1 ? "md:-translate-y-4 md:shadow-warm" : ""
            }`}
          >
            {/* Giant red quote mark */}
            <div
              aria-hidden="true"
              className="absolute -top-2 left-5 font-display text-7xl leading-none text-brand-500 select-none"
            >
              &ldquo;
            </div>

            {/* Stars */}
            <div className="flex items-center gap-1 mb-4">
              {Array.from({ length: r.rating }).map((_, idx) => (
                <Star key={idx} />
              ))}
            </div>

            <p className="font-display italic text-base sm:text-lg text-white/90 leading-relaxed">
              {r.text}
            </p>

            <div className="mt-6 pt-5 border-t border-border flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-white grid place-items-center font-display font-extrabold shadow-warm">
                {r.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-sm text-white truncate">
                  {r.name}
                </div>
                <div className="text-[11px] text-muted truncate">
                  {r.city} · {r.branch}
                </div>
              </div>
              <span className="text-[9px] uppercase tracking-[0.18em] font-bold text-emerald-400 border border-emerald-500/40 bg-emerald-500/10 rounded-full px-2 py-1 whitespace-nowrap">
                Verified
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
