import Link from "next/link";
import { notFound } from "next/navigation";
import { getProtectedDashboardData } from "../../../../../../lib/protected-dashboard";
import { getSiteDraftForUser } from "../../../../../../lib/site-draft-store";
import type { SiteBlock, SiteSection } from "../../../../../../lib/site-types";
import { updateSiteDraftAction } from "./actions";

const textInput = ({
  label,
  name,
  value,
  maxLength = 180,
}: {
  label: string;
  name: string;
  value?: string;
  maxLength?: number;
}) => (
  <label>
    {label}
    <input name={name} type="text" defaultValue={value ?? ""} maxLength={maxLength} />
  </label>
);

const textArea = ({
  label,
  name,
  value,
  maxLength = 700,
  rows = 3,
}: {
  label: string;
  name: string;
  value?: string;
  maxLength?: number;
  rows?: number;
}) => (
  <label>
    {label}
    <textarea name={name} defaultValue={value ?? ""} maxLength={maxLength} rows={rows} />
  </label>
);

function BlockEditor({
  block,
  pageIndex,
  sectionIndex,
  blockIndex,
}: {
  block: SiteBlock;
  pageIndex: number;
  sectionIndex: number;
  blockIndex: number;
}) {
  const prefix = `page_${pageIndex}_section_${sectionIndex}_block_${blockIndex}`;

  return (
    <div className="dashboard-edit-nested">
      <div className="dashboard-edit-row">
        <label>
          Actif
          <input type="checkbox" name={`${prefix}_enabled`} defaultChecked={block.enabled} />
        </label>
        <label>
          Supprimer
          <input type="checkbox" name={`${prefix}_delete`} />
        </label>
        <label>
          Ordre
          <input type="number" name={`${prefix}_order`} defaultValue={block.order} min={1} />
        </label>
      </div>

      {block.type === "text" ? (
        <>
          {textInput({ label: "Eyebrow", name: `${prefix}_eyebrow`, value: block.data.eyebrow, maxLength: 80 })}
          {textInput({ label: "Titre bloc", name: `${prefix}_title`, value: block.data.title })}
          {textArea({ label: "Texte bloc", name: `${prefix}_body`, value: block.data.body, maxLength: 900, rows: 4 })}
        </>
      ) : null}

      {block.type === "cta" ? (
        <>
          {textInput({ label: "Titre CTA", name: `${prefix}_title`, value: block.data.title })}
          {textArea({
            label: "Description CTA",
            name: `${prefix}_description`,
            value: block.data.description,
            maxLength: 420,
          })}
          <div className="dashboard-form-grid">
            {textInput({ label: "Libellé bouton", name: `${prefix}_label`, value: block.data.label, maxLength: 80 })}
            {textInput({ label: "Lien bouton", name: `${prefix}_href`, value: block.data.href, maxLength: 240 })}
          </div>
        </>
      ) : null}

      {block.type === "featureGrid" ? (
        <>
          {textInput({ label: "Titre grille", name: `${prefix}_title`, value: block.data.title })}
          {block.data.items.map((item, itemIndex) => (
            <div className="dashboard-edit-mini" key={`${block.id}-${itemIndex}`}>
              <div className="dashboard-form-grid">
                {textInput({
                  label: "Titre item",
                  name: `${prefix}_item_${itemIndex}_title`,
                  value: item.title,
                  maxLength: 120,
                })}
                {textInput({
                  label: "Badge",
                  name: `${prefix}_item_${itemIndex}_badge`,
                  value: item.badge,
                  maxLength: 60,
                })}
              </div>
              {textArea({
                label: "Description item",
                name: `${prefix}_item_${itemIndex}_description`,
                value: item.description,
                maxLength: 420,
              })}
            </div>
          ))}
        </>
      ) : null}
    </div>
  );
}

function SectionEditor({
  section,
  pageIndex,
  sectionIndex,
}: {
  section: SiteSection;
  pageIndex: number;
  sectionIndex: number;
}) {
  const prefix = `page_${pageIndex}_section_${sectionIndex}`;

  return (
    <details className="dashboard-edit-section" open={section.type === "hero" || section.type === "contentBlocks"}>
      <summary>
        <strong>{section.type}</strong>
        <span>{section.anchorId ?? section.id}</span>
      </summary>
      <div className="dashboard-edit-row">
        <label>
          Actif
          <input type="checkbox" name={`${prefix}_enabled`} defaultChecked={section.enabled} />
        </label>
        <label>
          Ordre
          <input type="number" name={`${prefix}_order`} defaultValue={section.order} min={1} />
        </label>
        {textInput({ label: "Anchor", name: `${prefix}_anchorId`, value: section.anchorId ?? section.id, maxLength: 80 })}
      </div>

      {"eyebrow" in section.data
        ? textInput({ label: "Eyebrow", name: `${prefix}_eyebrow`, value: section.data.eyebrow, maxLength: 120 })
        : null}
      {"title" in section.data
        ? textInput({ label: "Titre", name: `${prefix}_title`, value: section.data.title, maxLength: 180 })
        : null}
      {"description" in section.data
        ? textArea({
            label: "Description",
            name: `${prefix}_description`,
            value: section.data.description,
            maxLength: 520,
          })
        : null}

      {section.type === "hero" ? (
        <>
          {textArea({ label: "Sous-titre hero", name: `${prefix}_subtitle`, value: section.data.subtitle, maxLength: 420 })}
          <div className="dashboard-form-grid">
            {textInput({ label: "Bouton principal", name: `${prefix}_primaryCta`, value: section.data.primaryCta })}
            {textInput({ label: "Lien principal", name: `${prefix}_primaryCtaHref`, value: section.data.primaryCtaHref })}
            {textInput({ label: "Bouton secondaire", name: `${prefix}_secondaryCta`, value: section.data.secondaryCta })}
            {textInput({ label: "Lien secondaire", name: `${prefix}_secondaryCtaHref`, value: section.data.secondaryCtaHref })}
          </div>
        </>
      ) : null}

      {section.type === "services" || section.type === "gallery" ? (
        <div className="dashboard-edit-list">
          {section.data.items.map((item, itemIndex) => (
            <div className="dashboard-edit-mini" key={`${section.id}-${itemIndex}`}>
              <div className="dashboard-form-grid">
                {textInput({
                  label: "Titre item",
                  name: `${prefix}_item_${itemIndex}_title`,
                  value: item.title,
                  maxLength: 140,
                })}
                {"badge" in item
                  ? textInput({
                      label: "Badge",
                      name: `${prefix}_item_${itemIndex}_badge`,
                      value: item.badge,
                      maxLength: 80,
                    })
                  : null}
              </div>
              {textArea({
                label: "Description item",
                name: `${prefix}_item_${itemIndex}_description`,
                value: item.description,
                maxLength: 520,
              })}
            </div>
          ))}
        </div>
      ) : null}

      {section.type === "reviews" ? (
        <div className="dashboard-edit-list">
          {section.data.items.map((item, itemIndex) => (
            <div className="dashboard-edit-mini" key={`${section.id}-${itemIndex}`}>
              <div className="dashboard-form-grid">
                {textInput({
                  label: "Auteur",
                  name: `${prefix}_item_${itemIndex}_author`,
                  value: item.author,
                  maxLength: 120,
                })}
                {textInput({
                  label: "Contexte",
                  name: `${prefix}_item_${itemIndex}_context`,
                  value: item.context,
                  maxLength: 120,
                })}
              </div>
              {textArea({
                label: "Commentaire",
                name: `${prefix}_item_${itemIndex}_comment`,
                value: item.comment,
                maxLength: 620,
              })}
            </div>
          ))}
        </div>
      ) : null}

      {section.type === "contact" ? (
        <div className="dashboard-form-grid">
          {textInput({ label: "Téléphone", name: `${prefix}_phone`, value: section.data.phone, maxLength: 60 })}
          {textInput({ label: "Email", name: `${prefix}_email`, value: section.data.email, maxLength: 160 })}
          {textInput({ label: "Adresse", name: `${prefix}_address`, value: section.data.address, maxLength: 220 })}
        </div>
      ) : null}

      {section.type === "contentBlocks" ? (
        <>
          <div className="dashboard-edit-list">
            {section.data.blocks.map((block, blockIndex) => (
              <BlockEditor
                key={block.id}
                block={block}
                pageIndex={pageIndex}
                sectionIndex={sectionIndex}
                blockIndex={blockIndex}
              />
            ))}
          </div>
          <div className="dashboard-edit-mini">
            <span>Nouveau bloc texte</span>
            {textInput({ label: "Titre", name: `${prefix}_new_block_title`, maxLength: 160 })}
            {textArea({ label: "Texte", name: `${prefix}_new_block_body`, maxLength: 900, rows: 4 })}
          </div>
        </>
      ) : null}
    </details>
  );
}

export default async function SiteDraftEditPage({
  params,
  searchParams,
}: {
  params: Promise<{ draftId: string }>;
  searchParams?: Promise<{ error?: string; saved?: string }>;
}) {
  const { draftId } = await params;
  const query = (await searchParams) ?? {};
  const dashboard = await getProtectedDashboardData();
  const draft = await getSiteDraftForUser(draftId, dashboard.user.id);

  if (!draft) {
    notFound();
  }

  const config = draft.config;

  return (
    <section className="dashboard-grid">
      <article className="dashboard-card dashboard-card-wide">
        <span>Édition du brouillon</span>
        <h2>{config.name}</h2>
        <p>Modifiez la structure et les textes du brouillon. Chaque sauvegarde vérifie le propriétaire côté serveur.</p>
        {query.error ? <p className="lysma-auth-error">{query.error}</p> : null}
        {query.saved ? <p className="lysma-auth-success">Brouillon sauvegardé.</p> : null}
        <div className="dashboard-card-actions">
          <Link className="lysma-ui-button lysma-ui-button-secondary" href="/dashboard/site/drafts">
            Retour aux brouillons
          </Link>
          <Link className="lysma-ui-button lysma-ui-button-primary" href={`/dashboard/site/create/preview?draftId=${draft.id}`}>
            Prévisualiser
          </Link>
        </div>
      </article>

      <form action={updateSiteDraftAction} className="dashboard-card dashboard-card-wide dashboard-onboarding-form">
        <input type="hidden" name="draftId" value={draft.id} />

        <fieldset>
          <legend>Identité</legend>
          <div className="dashboard-form-grid">
            {textInput({ label: "Nom", name: "name", value: config.name, maxLength: 120 })}
            {textInput({ label: "Slug", name: "slug", value: config.slug, maxLength: 80 })}
            {textInput({ label: "Activité", name: "businessType", value: config.businessType, maxLength: 120 })}
            {textInput({ label: "Logo URL", name: "logoUrl", value: config.branding?.logoUrl, maxLength: 500 })}
          </div>
          {textArea({ label: "Baseline", name: "baseline", value: config.baseline, maxLength: 240 })}
          <div className="dashboard-edit-row">
            <label>
              Monopage
              <input type="radio" name="mode" value="singlePage" defaultChecked={config.mode !== "multiPage"} />
            </label>
            <label>
              Multipage
              <input type="radio" name="mode" value="multiPage" defaultChecked={config.mode === "multiPage"} />
            </label>
          </div>
        </fieldset>

        <fieldset>
          <legend>Couleurs</legend>
          <div className="dashboard-color-grid">
            <label>
              Primaire
              <input name="primaryColor" type="color" defaultValue={config.theme.primaryColor} />
            </label>
            <label>
              Accent
              <input name="secondaryColor" type="color" defaultValue={config.theme.secondaryColor} />
            </label>
            <label>
              Fond
              <input name="backgroundColor" type="color" defaultValue={config.theme.backgroundColor} />
            </label>
            <label>
              Texte
              <input name="textColor" type="color" defaultValue={config.theme.textColor} />
            </label>
          </div>
        </fieldset>

        <fieldset>
          <legend>Pages</legend>
          <div className="dashboard-edit-list">
            {config.pages.map((page, pageIndex) => (
              <details className="dashboard-edit-page" key={page.id} open={pageIndex === 0}>
                <summary>
                  <strong>{page.title}</strong>
                  <span>{page.path ?? page.slug}</span>
                </summary>
                <div className="dashboard-edit-row">
                  <label>
                    Active
                    <input type="checkbox" name={`page_${pageIndex}_enabled`} defaultChecked={page.enabled !== false} />
                  </label>
                  <label>
                    Dans la navigation
                    <input
                      type="checkbox"
                      name={`page_${pageIndex}_showInNavigation`}
                      defaultChecked={page.showInNavigation !== false}
                    />
                  </label>
                  <label>
                    Supprimer
                    <input type="checkbox" name={`page_${pageIndex}_delete`} />
                  </label>
                  <label>
                    Ordre
                    <input type="number" name={`page_${pageIndex}_order`} defaultValue={page.order ?? pageIndex + 1} min={1} />
                  </label>
                </div>
                <div className="dashboard-form-grid">
                  {textInput({ label: "Titre page", name: `page_${pageIndex}_title`, value: page.title, maxLength: 160 })}
                  {textInput({ label: "Slug page", name: `page_${pageIndex}_slug`, value: page.slug, maxLength: 90 })}
                  {textInput({
                    label: "Label navigation",
                    name: `page_${pageIndex}_navigationLabel`,
                    value: page.navigationLabel,
                    maxLength: 120,
                  })}
                  {textInput({
                    label: "SEO title",
                    name: `page_${pageIndex}_seoTitle`,
                    value: page.seo?.title ?? page.title,
                    maxLength: 180,
                  })}
                </div>
                {textArea({
                  label: "Description page",
                  name: `page_${pageIndex}_description`,
                  value: page.description,
                  maxLength: 240,
                })}
                {textArea({
                  label: "SEO description",
                  name: `page_${pageIndex}_seoDescription`,
                  value: page.seo?.description ?? page.description,
                  maxLength: 260,
                })}
                {page.sections.map((section, sectionIndex) => (
                  <SectionEditor
                    key={section.id}
                    section={section}
                    pageIndex={pageIndex}
                    sectionIndex={sectionIndex}
                  />
                ))}
              </details>
            ))}
          </div>
          <div className="dashboard-edit-mini">
            {textInput({ label: "Ajouter une page", name: "newPageTitle", maxLength: 160 })}
          </div>
        </fieldset>

        <div className="dashboard-card-actions">
          <button type="submit" className="lysma-ui-button lysma-ui-button-primary">
            Sauvegarder le brouillon
          </button>
          <Link className="lysma-ui-button lysma-ui-button-secondary" href={`/dashboard/site/create/preview?draftId=${draft.id}`}>
            Prévisualiser
          </Link>
        </div>
      </form>
    </section>
  );
}
