"use client";

import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import {
  ButtonLysma,
  CardLysma,
  FieldLysma,
  FooterLysma,
  FormLysma,
  HeroLysma,
  InputLysma,
  LayoutLysma,
  SidebarLysma,
  TextareaLysma,
  type LysmaNavItem,
  type LysmaSidebarEntry,
} from "@lysma/design-system";
import styles from "./page.module.css";

const menuItems: LysmaNavItem[] = [
  { href: "/dashboard", label: "Dashboard", description: "Vue globale", icon: <IconMark label="D" /> },
  { href: "/applications", label: "Applications", description: "Produits LYSMA", icon: <IconMark label="A" /> },
  { href: "/sites-vitrines", label: "Sites vitrines", description: "Clients publics", icon: <IconMark label="S" /> },
  { href: "/livo", label: "LIVO", description: "Atelier auto", icon: <IconMark label="L" />, badge: "Lab" },
  { href: "/pma", label: "PMA", description: "Portail metier", icon: <IconMark label="P" /> },
  { href: "/parametres", label: "Parametres", description: "Systeme", icon: <IconMark label="G" /> },
];

const menuNavigation: LysmaSidebarEntry[] = [
  menuItems[0],
  {
    id: "produits",
    label: "Produits",
    icon: <IconMark label="P" />,
    items: [menuItems[1], menuItems[3], menuItems[4]],
  },
  {
    id: "sites",
    label: "Sites & contenus",
    icon: <IconMark label="S" />,
    items: [menuItems[2]],
  },
  menuItems[5],
];

const inspirationGroups = [
  { name: "Linear", angle: "Densite calme, navigation produit, hierarchie nette." },
  { name: "Vercel", angle: "Minimalisme, noir et blanc, contraste tres controle." },
  { name: "Stripe Dashboard", angle: "Tableaux de bord, cartes data, accents fonctionnels." },
  { name: "Notion", angle: "Simplicite documentaire, espaces blancs, navigation douce." },
  { name: "Raycast", angle: "Command UI, rapidite percue, surfaces compactes." },
  { name: "Supabase", angle: "Developer console, vert technique, grilles et produits modulaires." },
  { name: "Resend", angle: "Noir premium, typographie nette, focus developer." },
  { name: "Retool", angle: "Densite enterprise, outils internes, panels lisibles." },
  { name: "Clerk", angle: "Auth flows propres, formulaires rassurants." },
  { name: "Arc Browser", angle: "Sidebar expressive, app personnelle, couleurs profondes." },
  { name: "Magic UI / Aceternity", angle: "Micro-interactions, profondeur, effets premium." },
  { name: "shadcn / Origin / 21st.dev", angle: "Primitives sobres, variantes composables, communaute UI." },
];

const sidebarVariants = [
  { id: "classic", name: "SaaS classique", meta: "Stable, comprehensible, faible risque.", className: styles.sidebarClassic },
  { id: "linear", name: "Linear", meta: "Dense, focus, raccourcis et sections.", className: styles.sidebarLinear },
  { id: "vercel", name: "Vercel", meta: "Noir/blanc, minimal, tres systeme.", className: styles.sidebarVercel },
  { id: "notion", name: "Notion", meta: "Documentaire, doux, leger.", className: styles.sidebarNotion },
  { id: "vscode", name: "VS Code", meta: "Technique, tres dense, admin.", className: styles.sidebarVsCode },
  { id: "arc", name: "Arc", meta: "Expressif, personnel, colore.", className: styles.sidebarArc },
  { id: "codex", name: "Premium LYSMA", meta: "Compact, premium, utilisable multi-projets.", className: styles.sidebarCodex },
];

const heroVariants = [
  {
    name: "SaaS",
    tone: "blue" as const,
    title: "Piloter les produits LYSMA depuis un espace clair",
    text: "Une hero sobre pour les logiciels B2B, avec promesse courte, actions nettes et panneau de preuves.",
    metrics: [
      { label: "Apps", value: "6", detail: "actives" },
      { label: "Sites", value: "14", detail: "suivis" },
    ],
  },
  {
    name: "Site vitrine",
    tone: "orange" as const,
    title: "Une signature premium adaptable a chaque client",
    text: "Plus visuelle, plus editoriale, adaptee aux pages publiques et aux vitrines.",
    metrics: [
      { label: "Sections", value: "8", detail: "modulaires" },
      { label: "CTA", value: "3", detail: "priorises" },
    ],
  },
  {
    name: "Application metier",
    tone: "green" as const,
    title: "Des interfaces denses pour travailler vite",
    text: "Moins marketing, plus operationnelle, pensee pour dashboards, ateliers et portails.",
    metrics: [
      { label: "Taches", value: "42", detail: "ouvertes" },
      { label: "SLA", value: "98%", detail: "suivi" },
    ],
  },
  {
    name: "Premium LYSMA",
    tone: "blue" as const,
    title: "Propre, premium, utile",
    text: "Direction proposee: sidebar compacte, cartes nettes, accents bleus et orange controles, forte lisibilite.",
    metrics: [
      { label: "ADN", value: "4", detail: "piliers" },
      { label: "Risque", value: "0", detail: "integration directe" },
    ],
  },
];

const cardFamilies = [
  { name: "KPI", value: "87%", label: "Atelier mesure", style: styles.cardKpi },
  { name: "Service", value: "Sites vitrines", label: "Offre structuree", style: styles.cardService },
  { name: "Fonctionnalite", value: "Pointage OR", label: "Action metier", style: styles.cardFeature },
  { name: "Temoignage", value: "\"Interface claire\"", label: "Preuve courte", style: styles.cardQuote },
  { name: "Statistique", value: "14", label: "Vehicules suivis", style: styles.cardStat },
  { name: "Dashboard", value: "Live", label: "Console dense", style: styles.cardDashboard },
  { name: "Premium SaaS", value: "LYSMA Core", label: "Surface noble", style: styles.cardPremium },
  { name: "Glassmorphism", value: "Blur", label: "Leger et profond", style: styles.cardGlass },
  { name: "Enterprise", value: "Controle", label: "Fiabilite admin", style: styles.cardEnterprise },
];

const palette = [
  { name: "Deep Navy", value: "#050812" },
  { name: "LYSMA Blue", value: "#1e73d8" },
  { name: "Signal Cyan", value: "#77b7ff" },
  { name: "Action Orange", value: "#ff7a2a" },
  { name: "Success Green", value: "#56d68a" },
  { name: "Surface", value: "#0d1322" },
];

const compareRows = [
  ["Sidebar", "SaaS stable", "Linear dense", "Vercel minimal", "Arc expressif", "LYSMA premium"],
  ["Hero", "Produit", "Vitrine", "Metier", "Editorial", "Signature"],
  ["Cards", "Data", "Service", "Glass", "Enterprise", "Dashboard"],
  ["Footer", "SaaS", "Corporate", "Metier", "Dense", "Premium"],
  ["Formulaires", "Simple", "Auth", "Enterprise", "Inline", "Wizard"],
];

type SelectionKey = "sidebar" | "hero" | "cards" | "buttons" | "forms" | "footer" | "layout" | "motion";

type SelectItem = {
  id: string;
  label: string;
  tag: string;
  description: string;
  preview: string;
};

type SelectionGroup = {
  key: SelectionKey;
  label: string;
  items: SelectItem[];
};

type SelectionState = Record<SelectionKey, string>;

const selectionGroups: SelectionGroup[] = [
  {
    key: "sidebar",
    label: "Sidebar",
    items: [
      { id: "sidebar-lysma-rail", label: "Sidebar LIVO standard", tag: "Par defaut", description: "Rail desktop compact et drawer mobile, valide comme navigation LYSMA commune.", preview: "sidebarRail" },
      { id: "sidebar-linear", label: "Linear dense", tag: "SaaS", description: "Navigation calme, dense, tres lisible pour produit B2B.", preview: "sidebarLinear" },
      { id: "sidebar-arc", label: "Arc expressive", tag: "Exploration", description: "Sidebar plus personnelle, profonde, avec variation couleur.", preview: "sidebarArc" },
      { id: "sidebar-vscode", label: "VS Code admin", tag: "Metier", description: "Approche tres dense pour outils internes et Super Admin.", preview: "sidebarVs" },
    ],
  },
  {
    key: "hero",
    label: "Hero",
    items: [
      { id: "hero-saas", label: "SaaS sobre", tag: "Produit", description: "Titre net, panneau data, CTA court.", preview: "heroSaas" },
      { id: "hero-vitrine", label: "Vitrine premium", tag: "Public", description: "Plus emotionnel, adaptee aux sites clients.", preview: "heroVitrine" },
      { id: "hero-metier", label: "Application metier", tag: "Dashboard", description: "Moins marketing, plus operationnel.", preview: "heroMetier" },
      { id: "hero-lysma", label: "Premium LYSMA", tag: "ADN", description: "Propre, premium, utile, avec preuve visuelle.", preview: "heroLysma" },
    ],
  },
  {
    key: "cards",
    label: "Cards",
    items: [
      { id: "cards-kpi", label: "KPI net", tag: "Data", description: "Cartes chiffre, comparison, statut.", preview: "cardsKpi" },
      { id: "cards-glass", label: "Glass controle", tag: "Premium", description: "Translucide mais lisible, sans brouiller le metier.", preview: "cardsGlass" },
      { id: "cards-enterprise", label: "Enterprise dense", tag: "Admin", description: "Surfaces froides, tables et panels.", preview: "cardsEnterprise" },
      { id: "cards-service", label: "Service editorial", tag: "Vitrine", description: "Cards plus genereuses pour offres et pages publiques.", preview: "cardsService" },
    ],
  },
  {
    key: "buttons",
    label: "Boutons",
    items: [
      { id: "buttons-pill", label: "Pill premium", tag: "LYSMA", description: "CTA arrondi, compact, tres reconnaissable.", preview: "buttonsPill" },
      { id: "buttons-minimal", label: "Minimal Vercel", tag: "Systeme", description: "Noir/blanc, tres peu decoratif.", preview: "buttonsMinimal" },
      { id: "buttons-command", label: "Command Raycast", tag: "Rapide", description: "Boutons courts, sensation d action immediate.", preview: "buttonsCommand" },
      { id: "buttons-enterprise", label: "Enterprise", tag: "Metier", description: "Plus anguleux, etats tres explicites.", preview: "buttonsEnterprise" },
    ],
  },
  {
    key: "forms",
    label: "Formulaires",
    items: [
      { id: "forms-clerk", label: "Auth propre", tag: "Clerk", description: "Champs rassurants, messages simples.", preview: "formsAuth" },
      { id: "forms-enterprise", label: "Form dense", tag: "Retool", description: "Controle, select, etats, grilles.", preview: "formsDense" },
      { id: "forms-soft", label: "Notion soft", tag: "Editorial", description: "Champs calmes, peu de bordures.", preview: "formsSoft" },
      { id: "forms-mobile", label: "Mobile atelier", tag: "LIVO", description: "Grosses zones tactiles et libelles courts.", preview: "formsMobile" },
    ],
  },
  {
    key: "footer",
    label: "Footer",
    items: [
      { id: "footer-saas", label: "SaaS court", tag: "Produit", description: "Liens essentiels, legal, statut.", preview: "footerSaas" },
      { id: "footer-corporate", label: "Corporate", tag: "Agence", description: "Marque, contact, pages publiques.", preview: "footerCorporate" },
      { id: "footer-metier", label: "Metier", tag: "App", description: "Tres discret, utile en bas d app.", preview: "footerMetier" },
      { id: "footer-premium", label: "Premium LYSMA", tag: "ADN", description: "Signature visuelle forte sans prendre le dessus.", preview: "footerPremium" },
    ],
  },
  {
    key: "layout",
    label: "Layout",
    items: [
      { id: "layout-dashboard", label: "Dashboard", tag: "SaaS", description: "Rail + topbar + cards data.", preview: "layoutDashboard" },
      { id: "layout-vitrine", label: "Site vitrine", tag: "Public", description: "Hero large + sections + CTA.", preview: "layoutVitrine" },
      { id: "layout-portail", label: "Portail metier", tag: "LIVO/PMA", description: "Navigation stable et contenu dense.", preview: "layoutPortail" },
      { id: "layout-mobile", label: "Mobile first", tag: "Atelier", description: "Actions tactiles et lecture rapide.", preview: "layoutMobile" },
    ],
  },
  {
    key: "motion",
    label: "Motion",
    items: [
      { id: "motion-sidebar-expand", label: "Sidebar expand", tag: "Favori", description: "L animation de rail qui revele la navigation.", preview: "motionSidebar" },
      { id: "motion-soft-lift", label: "Soft lift", tag: "Cards", description: "Micro elevation au hover, discrete.", preview: "motionLift" },
      { id: "motion-command", label: "Command focus", tag: "Raycast", description: "Focus rapide, action directe.", preview: "motionCommand" },
      { id: "motion-minimal", label: "Minimal", tag: "Stable", description: "Transitions sobres, presque invisibles.", preview: "motionMinimal" },
    ],
  },
];

const initialSelection: SelectionState = {
  sidebar: "sidebar-lysma-rail",
  hero: "hero-metier",
  cards: "cards-kpi",
  buttons: "buttons-pill",
  forms: "forms-mobile",
  footer: "footer-premium",
  layout: "layout-mobile",
  motion: "motion-sidebar-expand",
};

function findSelectedLabel(key: SelectionKey, value: string) {
  const group = selectionGroups.find((item) => item.key === key);
  return group?.items.find((item) => item.id === value)?.label ?? value;
}

export default function DesignSystemPreviewPage() {
  return (
    <div className={styles.page}>
      <aside className={styles.toc} aria-label="Navigation showroom">
        <a className={styles.brand} href="#top">
          <span>LY</span>
          <strong>DS Preview</strong>
        </a>
        <nav>
          <a href="#inspirations">Inspirations</a>
          <a href="#references">Composants</a>
          <a href="#sidebars">Sidebars</a>
          <a href="#heroes">Hero</a>
          <a href="#cards">Cards</a>
          <a href="#buttons">Boutons</a>
          <a href="#forms">Formulaires</a>
          <a href="#layouts">Layouts</a>
          <a href="#footers">Footers</a>
          <a href="#tokens">Tokens</a>
          <a href="#compare">Choisir ADN</a>
        </nav>
      </aside>

      <main id="top" className={styles.main}>
        <section className={styles.heroIntro}>
          <div>
            <p className={styles.kicker}>Laboratoire isole</p>
            <h1>Design System Preview LYSMA</h1>
            <p>
              Showroom pour comparer plusieurs directions premium avant de figer la signature LYSMA.
              Aucune app existante ne consomme ces variantes.
            </p>
            <div className={styles.heroActions}>
              <a className={styles.primaryLink} href="#compare">Choisir l ADN</a>
              <a className={styles.secondaryLink} href="#sidebars">Comparer les sidebars</a>
            </div>
          </div>
          <div className={styles.heroMock} aria-label="Mise en scene dashboard">
            <div className={styles.mockTopbar}>
              <span />
              <span />
              <span />
            </div>
            <div className={styles.mockGrid}>
              <span />
              <span />
              <span />
              <span />
            </div>
            <div className={styles.mockPanel}>
              <strong>LYSMA Core</strong>
              <small>Sidebar compacte + surfaces premium + data lisible</small>
            </div>
          </div>
        </section>

        <SelectionStudio />

        <ShowroomSection id="inspirations" title="Inspirations et angles retenus">
          <div className={styles.inspirationGrid}>
            {inspirationGroups.map((item) => (
              <article key={item.name} className={styles.inspirationCard}>
                <strong>{item.name}</strong>
                <p>{item.angle}</p>
              </article>
            ))}
          </div>
        </ShowroomSection>

        <ShowroomSection id="references" title="Composants de reference">
          <div className={styles.referenceGrid}>
            <div className={styles.sidebarFrame}>
              <SidebarLysma
                brand={{
                  name: "LYSMA",
                  subtitle: "Design System",
                  logo: <IconMark label="L" />,
                  href: "#references",
                }}
                navigation={menuNavigation}
                activeHref="/livo"
                heading="Navigation LYSMA"
                bottomItems={[
                  { href: "/connexion", label: "Connexion", icon: <IconMark label="→" />, variant: "secondary" },
                  { href: "/nouveau", label: "Nouveau projet", icon: <IconMark label="+" />, variant: "primary" },
                ]}
                footer={<span>Preview isolee</span>}
              />
            </div>
            <HeroLysma
              eyebrow="HeroLysma"
              title="Une base visuelle commune, sans imposer les memes couleurs"
              description="Composant de reference pour pages SaaS, vitrines et applications metier."
              tone="blue"
              actions={[
                { label: "Action principale", href: "#buttons", variant: "primary" },
                { label: "Comparer", href: "#compare", variant: "secondary" },
              ]}
              metrics={[
                { label: "Composants", value: "7", detail: "fondation" },
                { label: "Variantes", value: "30+", detail: "showroom" },
              ]}
            />
          </div>
          <div className={styles.componentStrip}>
            <CardLysma title="CardLysma" eyebrow="Surface" description="Carte stable, composable et themeable.">
              <p>Utilisable pour KPI, service, feature, temoignage ou panel metier.</p>
            </CardLysma>
            <FormLysma
              title="FormLysma"
              description="Formulaire de reference, avec champs et messages."
              actions={<ButtonLysma type="button">Valider</ButtonLysma>}
            >
              <FieldLysma id="ref-email" label="Email" hint="Champ de demonstration">
                <InputLysma id="ref-email" placeholder="contact@lysma.fr" type="email" />
              </FieldLysma>
            </FormLysma>
          </div>
        </ShowroomSection>

        <ShowroomSection id="sidebars" title="Sidebars comparees">
          <div className={styles.sidebarGrid}>
            {sidebarVariants.map((variant) => (
              <article key={variant.id} className={styles.variantCard}>
                <header>
                  <strong>{variant.name}</strong>
                  <span>{variant.meta}</span>
                </header>
                <SidebarMock className={variant.className} />
              </article>
            ))}
          </div>
        </ShowroomSection>

        <ShowroomSection id="heroes" title="Hero variants">
          <div className={styles.heroGrid}>
            {heroVariants.map((variant) => (
              <div key={variant.name} className={styles.heroVariant}>
                <HeroLysma
                  eyebrow={variant.name}
                  title={variant.title}
                  description={variant.text}
                  tone={variant.tone}
                  actions={[
                    { label: "CTA principal", href: "#", variant: "primary" },
                    { label: "CTA secondaire", href: "#", variant: "secondary" },
                  ]}
                  metrics={variant.metrics}
                  media={<ScenePreview name={variant.name} />}
                />
              </div>
            ))}
          </div>
        </ShowroomSection>

        <ShowroomSection id="cards" title="Families de cards">
          <div className={styles.cardFamilyGrid}>
            {cardFamilies.map((card) => (
              <article key={card.name} className={`${styles.familyCard} ${card.style}`}>
                <span>{card.name}</span>
                <strong>{card.value}</strong>
                <small>{card.label}</small>
              </article>
            ))}
          </div>
        </ShowroomSection>

        <ShowroomSection id="buttons" title="Boutons et etats">
          <div className={styles.buttonShowcase}>
            {(["primary", "secondary", "ghost", "outline", "danger"] as const).map((variant) => (
              <div key={variant} className={styles.buttonRow}>
                <span>{variant}</span>
                <ButtonLysma variant={variant}>Normal</ButtonLysma>
                <ButtonLysma variant={variant} className={styles.forceHover}>Hover</ButtonLysma>
                <ButtonLysma variant={variant} disabled>Disabled</ButtonLysma>
                <ButtonLysma variant={variant} loading>Loading</ButtonLysma>
              </div>
            ))}
          </div>
          <div className={styles.buttonStyles}>
            <button className={styles.raycastButton}>Command action</button>
            <button className={styles.vercelButton}>Minimal action</button>
            <button className={styles.arcButton}>Arc style</button>
          </div>
        </ShowroomSection>

        <ShowroomSection id="forms" title="Formulaires modernes">
          <div className={styles.formsGrid}>
            <FormLysma
              title="Formulaire SaaS"
              description="Champs standards, messages courts, actions en bas."
              actions={
                <>
                  <ButtonLysma type="button" variant="secondary">Annuler</ButtonLysma>
                  <ButtonLysma type="button">Enregistrer</ButtonLysma>
                </>
              }
            >
              <FieldLysma id="name" label="Texte" hint="Nom de l espace">
                <InputLysma id="name" placeholder="LYSMA Hub" />
              </FieldLysma>
              <FieldLysma id="email" label="Email">
                <InputLysma id="email" type="email" placeholder="admin@lysma.fr" />
              </FieldLysma>
              <FieldLysma id="password" label="Mot de passe">
                <InputLysma id="password" type="password" placeholder="********" />
              </FieldLysma>
              <FieldLysma id="notes" label="Textarea">
                <TextareaLysma id="notes" placeholder="Note de validation..." />
              </FieldLysma>
            </FormLysma>

            <div className={styles.formPanel}>
              <h3>Etats UX</h3>
              <label>
                <span>Select</span>
                <select>
                  <option>Sidebar premium</option>
                  <option>Hero SaaS</option>
                  <option>Cards dashboard</option>
                </select>
              </label>
              <label className={styles.errorField}>
                <span>Erreur</span>
                <input defaultValue="route invalide" />
                <small>Message court, actionnable.</small>
              </label>
              <label className={styles.successField}>
                <span>Succes</span>
                <input defaultValue="preview validee" />
                <small>Etat positif discret.</small>
              </label>
              <label>
                <span>Desactive</span>
                <input disabled defaultValue="verrouille" />
              </label>
              <div className={styles.choiceGrid}>
                <label><input type="checkbox" defaultChecked /> Compact</label>
                <label><input type="radio" name="tone" defaultChecked /> Bleu</label>
                <label><input type="radio" name="tone" /> Orange</label>
                <label className={styles.switch}><input type="checkbox" defaultChecked /><span /> Animations</label>
              </div>
            </div>
          </div>
        </ShowroomSection>

        <ShowroomSection id="layouts" title="Layouts a tester">
          <div className={styles.layoutGrid}>
            <DeviceFrame name="Desktop dashboard" type="desktop" />
            <DeviceFrame name="Tablette portail metier" type="tablet" />
            <DeviceFrame name="Mobile SaaS" type="mobile" />
            <div className={styles.layoutReference}>
              <LayoutLysma
                sidebar={<MiniRail />}
                header={<div className={styles.layoutHeader}>LayoutLysma / portail</div>}
                footer={<div className={styles.layoutFooter}>Footer applicatif</div>}
                contained
              >
                <div className={styles.layoutCards}>
                  <span />
                  <span />
                  <span />
                </div>
              </LayoutLysma>
            </div>
          </div>
        </ShowroomSection>

        <ShowroomSection id="footers" title="Footers">
          <div className={styles.footerGrid}>
            <FooterLysma
              brand={{ name: "LYSMA SaaS", subtitle: "Applications utiles" }}
              navigation={menuItems.slice(0, 4)}
              legal={[{ href: "#", label: "Confidentialite" }, { href: "#", label: "Cookies" }]}
              note="Footer SaaS avec navigation courte et liens de confiance."
            />
            <FooterVariant name="Corporate" tone="corporate" />
            <FooterVariant name="Application metier" tone="business" />
            <FooterVariant name="Premium LYSMA" tone="premium" />
          </div>
        </ShowroomSection>

        <ShowroomSection id="tokens" title="Design tokens">
          <div className={styles.tokensGrid}>
            <div className={styles.tokenPanel}>
              <h3>Palettes</h3>
              <div className={styles.swatches}>
                {palette.map((color) => (
                  <div key={color.name}>
                    <span style={{ background: color.value }} />
                    <strong>{color.name}</strong>
                    <small>{color.value}</small>
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.tokenPanel}>
              <h3>Typographies</h3>
              <p className={styles.typeHero}>Hero 48/1.04</p>
              <p className={styles.typeTitle}>Section 28/1.12</p>
              <p className={styles.typeBody}>Body 15/1.6 pour les interfaces longues.</p>
              <p className={styles.typeMono}>Mono 12 pour labels systeme</p>
            </div>
            <div className={styles.tokenPanel}>
              <h3>Espacements, rayons, ombres</h3>
              <div className={styles.spacingDemo}><span /><span /><span /><span /></div>
              <div className={styles.radiusDemo}><span /><span /><span /></div>
              <div className={styles.shadowDemo}><span /></div>
            </div>
            <div className={styles.tokenPanel}>
              <h3>Animations, icones, grilles</h3>
              <div className={styles.motionDemo}><span /><span /><span /></div>
              <div className={styles.iconGrid}>
                {["D", "A", "S", "L", "P", "G"].map((icon) => <IconMark key={icon} label={icon} />)}
              </div>
              <div className={styles.gridDemo}><span /><span /><span /><span /><span /><span /></div>
            </div>
          </div>
        </ShowroomSection>

        <ShowroomSection id="compare" title="Choisir l ADN LYSMA">
          <div className={styles.compareTable}>
            {compareRows.map((row) => (
              <div key={row[0]} className={styles.compareRow}>
                {row.map((cell, index) => (
                  <span key={`${row[0]}-${cell}`} className={index === 0 ? styles.compareHead : undefined}>
                    {cell}
                  </span>
                ))}
              </div>
            ))}
          </div>
          <div className={styles.selectionBoard}>
            <SelectionCard title="Direction sure" body="Sidebar SaaS + Hero metier + cards dashboard + footer applicatif." />
            <SelectionCard title="Direction premium" body="Sidebar LYSMA + Hero signature + cards glass controlees + footer premium." />
            <SelectionCard title="Direction enterprise" body="Sidebar VS Code + formulaires denses + cards enterprise + tableaux futurs." />
          </div>
        </ShowroomSection>
      </main>
    </div>
  );
}

function SelectionStudio() {
  const [active, setActive] = useState<SelectionKey>("sidebar");
  const [selection, setSelection] = useState<SelectionState>(initialSelection);
  const [copied, setCopied] = useState(false);
  const activeGroup = selectionGroups.find((group) => group.key === active) ?? selectionGroups[0];

  const finalText = useMemo(() => {
    const lines = [
      "BRIEF ADN LYSMA - selection design-system-preview",
      "",
      `Sidebar: ${findSelectedLabel("sidebar", selection.sidebar)}`,
      `Hero: ${findSelectedLabel("hero", selection.hero)}`,
      `Cards: ${findSelectedLabel("cards", selection.cards)}`,
      `Boutons: ${findSelectedLabel("buttons", selection.buttons)}`,
      `Formulaires: ${findSelectedLabel("forms", selection.forms)}`,
      `Footer: ${findSelectedLabel("footer", selection.footer)}`,
      `Layout: ${findSelectedLabel("layout", selection.layout)}`,
      `Motion: ${findSelectedLabel("motion", selection.motion)}`,
      "",
      "Direction souhaitee:",
      "- Construire une interface LYSMA premium, propre, utile, avec forte lisibilite metier.",
      "- Garder la sidebar compacte/extensible comme signature centrale.",
      "- Utiliser les composants selectionnes comme base du futur Design System LYSMA.",
      "- Ne pas copier les inspirations; garder une identite LYSMA coherente.",
      "- LIVO reste le laboratoire d integration progressive.",
    ];

    return lines.join("\n");
  }, [selection]);

  async function copyBrief() {
    try {
      await navigator.clipboard.writeText(finalText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <section id="selection" className={styles.selectionStudio}>
      <div className={styles.selectionHeader}>
        <div>
          <p className={styles.kicker}>Mode selection</p>
          <h2>Choisir item par item, puis copier le brief ADN</h2>
          <p>
            Clique sur les familles, selectionne les rendus que tu aimes, puis recupere le texte final
            pour me le recoller directement.
          </p>
        </div>
        <a href="#final-brief" className={styles.primaryLink}>Voir le brief</a>
      </div>

      <div className={styles.selectionTabs} role="tablist" aria-label="Familles de composants">
        {selectionGroups.map((group) => (
          <button
            key={group.key}
            type="button"
            className={active === group.key ? styles.selectionTabActive : undefined}
            onClick={() => setActive(group.key)}
          >
            <span>{group.label}</span>
            <small>{findSelectedLabel(group.key, selection[group.key])}</small>
          </button>
        ))}
      </div>

      <div className={styles.selectionBody}>
        <div className={styles.choicePanel}>
          <header>
            <span>{activeGroup.label}</span>
            <strong>Selection rapide</strong>
          </header>
          <div className={styles.choiceGridLarge}>
            {activeGroup.items.map((item) => {
              const selected = selection[activeGroup.key] === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  className={`${styles.choiceCard} ${selected ? styles.choiceCardActive : ""}`}
                  onClick={() => setSelection((current) => ({ ...current, [activeGroup.key]: item.id }))}
                >
                  <MiniPreview type={item.preview} />
                  <span>{item.tag}</span>
                  <strong>{item.label}</strong>
                  <small>{item.description}</small>
                </button>
              );
            })}
          </div>
        </div>

        <FinalRender selection={selection} />
      </div>

      <div id="final-brief" className={styles.finalBrief}>
        <div>
          <p className={styles.kicker}>Brief copiable</p>
          <h3>Compte rendu a me recoller</h3>
          <p>Ce texte resume tes choix dans un format directement exploitable pour figer l ADN LYSMA.</p>
        </div>
        <textarea readOnly value={finalText} />
        <ButtonLysma type="button" onClick={copyBrief}>
          {copied ? "Copie" : "Copier le brief"}
        </ButtonLysma>
      </div>
    </section>
  );
}

function MiniPreview({ type }: { type: string }) {
  return (
    <span className={`${styles.miniPreview} ${styles[`mini_${type}`] ?? ""}`} aria-hidden="true">
      <i />
      <i />
      <i />
      <i />
    </span>
  );
}

function FinalRender({ selection }: { selection: SelectionState }) {
  const selectedPairs = selectionGroups.map((group) => ({
    key: group.key,
    label: group.label,
    value: findSelectedLabel(group.key, selection[group.key]),
  }));

  return (
    <aside className={styles.finalRender}>
      <header>
        <span>Rendu final combine</span>
        <strong>Survole la sidebar</strong>
      </header>
      <div className={styles.finalStage}>
        <div className={styles.finalAnimatedSidebar}>
          <div className={styles.finalBrand}>LY</div>
          {["D", "A", "S", "L", "P", "G"].map((item, index) => (
            <div key={item} className={index === 3 ? styles.finalActiveItem : undefined}>
              <IconMark label={item} />
              <span className={styles.finalItemLabel}>{menuItems[index]?.label ?? "Item"}</span>
            </div>
          ))}
        </div>
        <div className={styles.finalCanvas}>
          <div className={styles.finalHeroBlock}>
            <span>{findSelectedLabel("hero", selection.hero)}</span>
            <strong>Signature LYSMA</strong>
            <small>{findSelectedLabel("motion", selection.motion)}</small>
          </div>
          <div className={styles.finalCardGrid}>
            <span />
            <span />
            <span />
          </div>
          <div className={styles.finalFormLine}>
            <span />
            <button type="button">{findSelectedLabel("buttons", selection.buttons)}</button>
          </div>
        </div>
      </div>
      <div className={styles.selectionChips}>
        {selectedPairs.map((item) => (
          <span key={item.key}>
            <strong>{item.label}</strong>
            {item.value}
          </span>
        ))}
      </div>
    </aside>
  );
}

function ShowroomSection({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className={styles.section}>
      <div className={styles.sectionHeader}>
        <span>{id}</span>
        <h2>{title}</h2>
      </div>
      {children}
    </section>
  );
}

function IconMark({ label }: { label: string }) {
  return <span className={styles.iconMark}>{label}</span>;
}

function SidebarMock({ className }: { className: string }) {
  return (
    <div className={`${styles.sidebarMock} ${className}`}>
      <div className={styles.sidebarMockBrand}><span>LY</span><strong>LYSMA</strong></div>
      <nav>
        {menuItems.map((item) => (
          <a key={item.href} className={item.href === "/livo" ? styles.activeMock : undefined} href="#">
            <span>{item.icon}</span>
            <strong>{item.label}</strong>
            {item.badge ? <em>{item.badge}</em> : null}
          </a>
        ))}
      </nav>
      <div className={styles.sidebarMockFooter}>Preview</div>
    </div>
  );
}

function ScenePreview({ name }: { name: string }) {
  return (
    <div className={styles.scenePreview}>
      <div className={styles.sceneToolbar}><span /><span /><span /></div>
      <div className={styles.sceneBody}>
        <strong>{name}</strong>
        <span />
        <span />
        <span />
      </div>
    </div>
  );
}

function DeviceFrame({ name, type }: { name: string; type: "desktop" | "tablet" | "mobile" }) {
  return (
    <article className={`${styles.deviceFrame} ${styles[`device-${type}`]}`}>
      <header>{name}</header>
      <div>
        <aside />
        <main>
          <span />
          <span />
          <span />
        </main>
      </div>
    </article>
  );
}

function MiniRail() {
  return (
    <div className={styles.miniRail}>
      {["L", "D", "A", "S", "P"].map((item) => <span key={item}>{item}</span>)}
    </div>
  );
}

function FooterVariant({ name, tone }: { name: string; tone: "corporate" | "business" | "premium" }) {
  return (
    <footer className={`${styles.footerVariant} ${styles[`footer-${tone}`]}`}>
      <div>
        <strong>{name}</strong>
        <p>Navigation secondaire, confiance et signature de marque.</p>
      </div>
      <nav>
        <a href="#">Produits</a>
        <a href="#">Clients</a>
        <a href="#">Contact</a>
      </nav>
    </footer>
  );
}

function SelectionCard({ title, body }: { title: string; body: string }) {
  return (
    <article className={styles.selectionCard}>
      <strong>{title}</strong>
      <p>{body}</p>
    </article>
  );
}
