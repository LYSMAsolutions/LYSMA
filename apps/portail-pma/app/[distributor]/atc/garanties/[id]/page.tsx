import { notFound } from "next/navigation";
import { requireAccess } from "@/lib/require-access";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import {
  Shield, ArrowLeft, User, MapPin, Wrench, Car, FileText,
  Clock, CheckCircle2, AlertTriangle, XCircle, RotateCcw, Printer,
} from "lucide-react";

const GOLD = "#ca8a04";

const STATUS_CONFIG: Record<string, { label: string; cls: string; Icon: React.ElementType }> = {
  brouillon:              { label: "Brouillon",           cls: "badge-gray",   Icon: Clock         },
  en_cours:               { label: "En cours",            cls: "badge-blue",   Icon: RotateCcw     },
  en_attente_fournisseur: { label: "Attente fournisseur", cls: "badge-yellow", Icon: AlertTriangle },
  validee:                { label: "Validée",             cls: "badge-green",  Icon: CheckCircle2  },
  refusee:                { label: "Refusée",             cls: "badge-red",    Icon: XCircle       },
};

const fmtDate     = (d: Date | string | null | undefined) => d ? new Intl.DateTimeFormat("fr-FR").format(new Date(d)) : null;
const fmtDateTime = (d: Date | string | null | undefined) => d ? new Intl.DateTimeFormat("fr-FR", { dateStyle: "short", timeStyle: "short" }).format(new Date(d)) : null;

function InfoRow({ label, value }: { label: string; value: string | number | null | undefined }) {
  if (!value && value !== 0) return null;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
      <span className="label-secondary" style={{ fontSize: "var(--font-xs)" }}>{label}</span>
      <span style={{ fontSize: "var(--font-md)", color: "var(--c-text)", fontWeight: 500 }}>{value}</span>
    </div>
  );
}

function Section({ title, Icon, color, children }: { title: string; Icon: React.ElementType; color: string; children: React.ReactNode }) {
  return (
    <div className="card-section">
      <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "1.25rem" }}>
        <div style={{ width: "32px", height: "32px", borderRadius: "var(--r-sm)", background: `${color}18`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Icon size={16} color={color} strokeWidth={2} />
        </div>
        <p className="label-secondary" style={{ textTransform: "uppercase", letterSpacing: "0.1em" }}>{title}</p>
      </div>
      {children}
    </div>
  );
}

export default async function AtcGarantieDetailPage({
  params,
}: {
  params: Promise<{ distributor: string; id: string }>;
}) {
  const { distributor, id } = await params;
  const user    = await requireAccess({ allowedRoles: ["atc"], distributorSlug: distributor });
  const atcBase = `/${user.distributorSlug}/atc`;

  const g = await prisma.garanties.findFirst({
    where: { id, distributor_id: user.distributorId },
    include: {
      clients: { select: { name: true, code: true, phone: true, email: true } },
      stores:  { select: { name: true, code: true } },
      users:   { select: { first_name: true, last_name: true } },
    },
  });

  if (!g) notFound();

  const st = STATUS_CONFIG[g.status ?? "brouillon"] ?? STATUS_CONFIG.brouillon;
  const { Icon: StatusIcon } = st;
  const kmParcourus = g.km_montage_1 && g.km_montage_2 ? Math.max(0, Number(g.km_montage_2) - Number(g.km_montage_1)) : null;

  // Historique reconstitué depuis les champs de dates
  const timeline: { date: Date; label: string; desc?: string; color: string; Icon: React.ElementType }[] = [
    { date: g.created_at, label: "Demande créée", desc: g.users ? `Par ${g.users.first_name} ${g.users.last_name}`.trim() : undefined, color: "var(--c-blue-primary)", Icon: Shield },
  ];
  if (g.date_envoi_expert)
    timeline.push({ date: new Date(g.date_envoi_expert), label: "Envoyée à l'expert / fournisseur", color: "#7c3aed", Icon: RotateCcw });
  if (g.date_decision && g.decision) {
    const ok = g.decision === "acceptee" || g.decision === "validee";
    timeline.push({ date: new Date(g.date_decision), label: ok ? "Garantie acceptée ✓" : "Garantie refusée", desc: g.decision_commentaire ?? undefined, color: ok ? "var(--c-success)" : "var(--c-danger)", Icon: ok ? CheckCircle2 : XCircle });
  }
  timeline.sort((a, b) => a.date.getTime() - b.date.getTime());

  const DOCS = [
    { key: "doc_carte_grise", label: "Carte grise",          value: g.doc_carte_grise },
    { key: "doc_facture_1",   label: "Facture 1er montage",  value: g.doc_facture_1   },
    { key: "doc_facture_2",   label: "Facture 2ème montage", value: g.doc_facture_2   },
    { key: "doc_bl_1",        label: "BL magasin n°1",       value: g.doc_bl_1        },
    { key: "doc_bl_2",        label: "BL magasin n°2",       value: g.doc_bl_2        },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

      {/* Hero */}
      <div style={{ padding: "1.75rem", borderRadius: "var(--r-2xl)", background: "linear-gradient(135deg,rgba(202,138,4,0.06),rgba(217,119,6,0.03))", border: "1px solid rgba(253,230,138,0.6)" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "var(--r-lg)", background: `${GOLD}18`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Shield size={24} color={GOLD} strokeWidth={2} />
            </div>
            <div>
              <p style={{ margin: 0, fontSize: "var(--font-xs)", fontWeight: 800, color: GOLD, textTransform: "uppercase", letterSpacing: "0.1em" }}>ATC · Garantie</p>
              <h1 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 800, color: "var(--c-text)", letterSpacing: "-0.02em" }}>
                {g.numero_garantie ?? "Brouillon"}
              </h1>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.375rem", flexWrap: "wrap" }}>
                <span className={`badge-lysma ${st.cls}`} style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem" }}>
                  <StatusIcon size={10} strokeWidth={2.5} /> {st.label}
                </span>
                <span style={{ fontSize: "var(--font-xs)", color: "var(--c-text-muted)" }}>
                  Créée le {fmtDateTime(g.created_at)}
                </span>
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: "0.625rem", flexWrap: "wrap" }}>
            <Link href={`${atcBase}/garanties/${id}/print`} className="btn-secondary"
              style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
              <Printer size={14} strokeWidth={2} /> Imprimer
            </Link>
            <Link href={`${atcBase}/garanties`} className="btn-secondary"
              style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
              <ArrowLeft size={14} strokeWidth={2.5} /> Retour
            </Link>
          </div>
        </div>
      </div>

      {/* Client & Magasin */}
      <div className="atc-grid-2">
        <Section title="Client" Icon={User} color="var(--c-blue-primary)">
          {g.clients ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
              <p style={{ margin: 0, fontSize: "var(--font-lg)", fontWeight: 700, color: "var(--c-text)" }}>
                {g.clients.code && <span style={{ fontFamily: "monospace", color: "var(--c-blue-primary)", marginRight: "0.4rem" }}>{g.clients.code}</span>}
                {g.clients.name}
              </p>
              <InfoRow label="Téléphone" value={g.clients.phone} />
              <InfoRow label="Email"     value={g.clients.email} />
            </div>
          ) : <p style={{ margin: 0, color: "var(--c-text-muted)" }}>—</p>}
        </Section>
        <Section title="Magasin" Icon={MapPin} color="var(--c-blue-secondary)">
          {g.stores ? (
            <p style={{ margin: 0, fontSize: "var(--font-lg)", fontWeight: 700, color: "var(--c-text)" }}>
              <span style={{ fontFamily: "monospace", color: "var(--c-blue-primary)", marginRight: "0.4rem" }}>{g.stores.code}</span>
              {g.stores.name}
            </p>
          ) : <p style={{ margin: 0, color: "var(--c-text-muted)" }}>—</p>}
        </Section>
      </div>

      {/* Pièce */}
      <Section title="Pièce en garantie" Icon={Wrench} color={GOLD}>
        <div className="atc-grid-3">
          <InfoRow label="Marque"       value={g.marque_piece}    />
          <InfoRow label="Fournisseur"  value={g.fournisseur}     />
          <InfoRow label="Référence"    value={g.reference_piece} />
          <InfoRow label="Quantité"     value={g.quantite}        />
          <InfoRow label="N° BL client" value={g.n_bon_livraison} />
          <InfoRow label="Date BL"      value={fmtDate(g.date_bon_livraison)} />
        </div>
        {g.defaut_constate && (
          <div style={{ marginTop: "1rem", padding: "0.875rem 1rem", borderRadius: "var(--r-md)", background: "var(--c-warning-bg)", border: "1px solid #fde68a" }}>
            <p className="label-secondary" style={{ marginBottom: "0.375rem" }}>Défaut constaté</p>
            <p style={{ margin: 0, fontSize: "var(--font-md)", color: "var(--c-text)", fontWeight: 500, whiteSpace: "pre-line" }}>{g.defaut_constate}</p>
          </div>
        )}
      </Section>

      {/* Montages */}
      <Section title="Montages" Icon={Clock} color="var(--c-blue-primary)">
        <div className="atc-grid-2">
          <div style={{ padding: "1rem", borderRadius: "var(--r-md)", background: "var(--c-blue-light)", border: "1px solid var(--c-border)" }}>
            <p className="label-secondary" style={{ marginBottom: "0.75rem" }}>1er montage</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <InfoRow label="Date"        value={fmtDate(g.date_montage_1)} />
              <InfoRow label="Kilométrage" value={g.km_montage_1 ? `${Number(g.km_montage_1).toLocaleString("fr-FR")} km` : null} />
            </div>
          </div>
          <div style={{ padding: "1rem", borderRadius: "var(--r-md)", background: "var(--c-bg)", border: "1px solid var(--c-border)" }}>
            <p className="label-secondary" style={{ marginBottom: "0.75rem" }}>2ème montage (dépose)</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <InfoRow label="Date"        value={fmtDate(g.date_montage_2)} />
              <InfoRow label="Kilométrage" value={g.km_montage_2 ? `${Number(g.km_montage_2).toLocaleString("fr-FR")} km` : null} />
            </div>
          </div>
        </div>
        {kmParcourus !== null && (
          <div style={{ marginTop: "1rem", padding: "0.875rem 1.25rem", borderRadius: "var(--r-md)", background: kmParcourus < 5000 ? "var(--c-blue-light)" : "var(--c-warning-bg)", border: `1px solid ${kmParcourus < 5000 ? "var(--c-border)" : "#fde68a"}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <p style={{ margin: 0, fontSize: "var(--font-sm)", fontWeight: 600, color: "var(--c-text-secondary)" }}>Kilométrage parcouru</p>
            <p style={{ margin: 0, fontSize: "1.375rem", fontWeight: 800, color: kmParcourus < 5000 ? "var(--c-blue-primary)" : "#b45309" }}>
              {kmParcourus.toLocaleString("fr-FR")} km
            </p>
          </div>
        )}
      </Section>

      {/* Véhicule */}
      <Section title="Véhicule" Icon={Car} color="#6b7280">
        <div className="atc-grid-3">
          <InfoRow label="Marque"          value={g.marque_vehicule} />
          <InfoRow label="Type / Modèle"   value={g.type_vehicule}   />
          <InfoRow label="Immatriculation" value={g.immat_vehicule}  />
          <InfoRow label="Cylindrée"       value={g.cylindree}       />
          <InfoRow label="Année"           value={g.annee_vehicule}  />
        </div>
      </Section>

      {/* Documents */}
      <Section title="Documents joints" Icon={FileText} color={GOLD}>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
          {DOCS.map(({ key, label, value }) => (
            <div key={key} style={{ display: "flex", alignItems: "center", gap: "0.875rem", padding: "0.875rem 1rem", borderRadius: "var(--r-md)", background: value ? "var(--c-success-bg)" : "var(--c-bg)", border: `1px solid ${value ? "rgba(16,185,129,0.2)" : "var(--c-border)"}` }}>
              {value ? (
                <>
                  {value.startsWith("data:image") ? (
                    <img src={value} alt={label} style={{ width: "48px", height: "48px", objectFit: "cover", borderRadius: "var(--r-sm)", flexShrink: 0 }} />
                  ) : (
                    <div style={{ width: "48px", height: "48px", borderRadius: "var(--r-sm)", background: "rgba(16,185,129,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <FileText size={20} color="var(--c-success)" strokeWidth={2} />
                    </div>
                  )}
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontSize: "var(--font-sm)", fontWeight: 700, color: "var(--c-success)" }}>✓ {label}</p>
                    <p style={{ margin: 0, fontSize: "var(--font-xs)", color: "var(--c-text-muted)" }}>Document joint</p>
                  </div>
                </>
              ) : (
                <>
                  <div style={{ width: "48px", height: "48px", borderRadius: "var(--r-sm)", background: "var(--c-bg)", border: "1px dashed var(--c-border)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <FileText size={20} color="var(--c-text-muted)" strokeWidth={1.5} />
                  </div>
                  <p style={{ margin: 0, fontSize: "var(--font-sm)", color: "var(--c-text-muted)" }}>{label} — non fourni</p>
                </>
              )}
            </div>
          ))}
        </div>
      </Section>

      {/* Décision fournisseur */}
      {(g.decision || g.decision_bl || g.decision_commentaire) && (
        <Section title="Décision fournisseur" Icon={CheckCircle2} color={g.decision === "acceptee" || g.decision === "validee" ? "var(--c-success)" : "var(--c-danger)"}>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <InfoRow label="Décision"      value={g.decision}                />
            <InfoRow label="Date décision" value={fmtDate(g.date_decision)}  />
            <InfoRow label="BL décision"   value={g.decision_bl}             />
            {g.decision_commentaire && (
              <div>
                <p className="label-secondary" style={{ marginBottom: "0.3rem", fontSize: "var(--font-xs)" }}>Commentaire</p>
                <p style={{ margin: 0, fontSize: "var(--font-md)", color: "var(--c-text)", whiteSpace: "pre-line" }}>{g.decision_commentaire}</p>
              </div>
            )}
          </div>
        </Section>
      )}

      {/* Commentaire */}
      {g.commentaire && (
        <div className="card-section">
          <p className="label-secondary" style={{ marginBottom: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>Commentaire</p>
          <p style={{ margin: 0, fontSize: "var(--font-md)", color: "var(--c-text)", whiteSpace: "pre-line", lineHeight: 1.6 }}>{g.commentaire}</p>
        </div>
      )}

      {/* Historique */}
      <div className="card-section">
        <p className="label-secondary" style={{ marginBottom: "1.25rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>Historique du dossier</p>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {timeline.map((event, i) => {
            const { Icon: EvIcon } = event;
            const isLast = i === timeline.length - 1;
            return (
              <div key={i} style={{ display: "flex", gap: "1rem", position: "relative" }}>
                {!isLast && (
                  <div style={{ position: "absolute", left: "15px", top: "34px", bottom: 0, width: "2px", background: "var(--c-border)" }} />
                )}
                <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: `${event.color}15`, border: `2px solid ${event.color}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, zIndex: 1, marginTop: "2px" }}>
                  <EvIcon size={14} color={event.color} strokeWidth={2.5} />
                </div>
                <div style={{ flex: 1, paddingBottom: isLast ? 0 : "1.25rem" }}>
                  <p style={{ margin: 0, fontSize: "var(--font-md)", fontWeight: 700, color: "var(--c-text)" }}>{event.label}</p>
                  {event.desc && <p style={{ margin: "0.15rem 0 0", fontSize: "var(--font-xs)", color: "var(--c-text-secondary)" }}>{event.desc}</p>}
                  <p style={{ margin: "0.2rem 0 0", fontSize: "var(--font-xs)", color: "var(--c-text-muted)" }}>{fmtDateTime(event.date)}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "0.625rem" }}>
        <Link href={`${atcBase}/garanties`} className="btn-secondary"
          style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
          <ArrowLeft size={14} strokeWidth={2.5} /> Retour à mes garanties
        </Link>
        <Link href={`${atcBase}/garanties/${id}/print`} className="btn-secondary"
          style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
          <Printer size={14} strokeWidth={2} /> Version imprimable
        </Link>
      </div>
    </div>
  );
}