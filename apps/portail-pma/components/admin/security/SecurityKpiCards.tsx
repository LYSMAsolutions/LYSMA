import Link from "next/link";

type SecurityKpi = {
  title: string;
  value: string | number;
  note: string;
  href: string;
  tone?: "blue" | "neutral" | "yellow" | "green" | "red";
};

function toneClasses(tone: SecurityKpi["tone"]) {
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

export default function SecurityKpiCards({
  items,
}: {
  items: SecurityKpi[];
}) {
  return (
    <section className={`grid-kpi ${items.length >= 5 ? "cols-5" : "cols-4"}`}>
      {items.map((item) => (
        <Link key={item.title} href={item.href} className={toneClasses(item.tone)}>
          <p className="section-copy" style={{ margin: 0 }}>
            {item.title}
          </p>

          <p
            className="section-title"
            style={{ fontSize: "2rem", marginTop: "1rem" }}
          >
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