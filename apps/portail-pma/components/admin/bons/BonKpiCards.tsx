import Link from "next/link";

type KpiItem = {
  title: string;
  value: string | number;
  note: string;
  href: string;
  tone?: "blue" | "neutral" | "yellow" | "green" | "red";
};

function toneClass(tone?: KpiItem["tone"]) {
  switch (tone) {
    case "yellow":
      return "kpi-card kpi-yellow";
    case "green":
      return "kpi-card kpi-green";
    case "red":
      return "kpi-card kpi-red";
    case "neutral":
      return "kpi-card kpi-neutral";
    default:
      return "kpi-card kpi-blue";
  }
}

export default function BonKpiCards({ items }: { items: KpiItem[] }) {
  return (
    <section className={`grid-kpi ${items.length >= 5 ? "cols-5" : "cols-4"}`}>
      {items.map((item) => (
        <Link key={item.title} href={item.href} className={toneClass(item.tone)}>
          <p className="section-copy" style={{ margin: 0 }}>
            {item.title}
          </p>
          <p className="section-title" style={{ fontSize: "2rem", marginTop: "1rem" }}>
            {item.value}
          </p>
          <p className="section-copy" style={{ marginTop: ".5rem" }}>
            {item.note}
          </p>
        </Link>
      ))}
    </section>
  );
}