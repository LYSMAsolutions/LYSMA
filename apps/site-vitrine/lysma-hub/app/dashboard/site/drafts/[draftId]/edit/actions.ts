"use server";

import { redirect } from "next/navigation";
import { createToken } from "../../../../../../lib/auth-crypto";
import { getProtectedDashboardData } from "../../../../../../lib/protected-dashboard";
import { getSiteDraftForUser, updateSiteDraftForUser } from "../../../../../../lib/site-draft-store";
import { isSafeSlug, sanitizeText } from "../../../../../../lib/security";
import type { ContentBlocksSectionData, SiteBlock, SiteConfig, SitePage, SiteSection } from "../../../../../../lib/site-types";

const COLOR_PATTERN = /^#[0-9a-fA-F]{6}$/;

const slugify = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

const readColor = (formData: FormData, key: string, fallback: string) => {
  const value = sanitizeText(formData.get(key), 12);
  return COLOR_PATTERN.test(value) ? value : fallback;
};

const readBool = (formData: FormData, key: string) => formData.get(key) === "on";

const readNumber = (formData: FormData, key: string, fallback: number) => {
  const value = Number(sanitizeText(formData.get(key), 10));
  return Number.isFinite(value) ? value : fallback;
};

const updateBlocks = (formData: FormData, pageIndex: number, sectionIndex: number, blocks: SiteBlock[]) => {
  const updatedBlocks: SiteBlock[] = [];

  blocks.forEach((block, blockIndex) => {
    const prefix = `page_${pageIndex}_section_${sectionIndex}_block_${blockIndex}`;

    if (readBool(formData, `${prefix}_delete`)) {
      return;
    }

    const enabled = readBool(formData, `${prefix}_enabled`);
    const order = readNumber(formData, `${prefix}_order`, block.order);

    if (block.type === "text") {
      updatedBlocks.push({
        ...block,
        enabled,
        order,
        data: {
          ...block.data,
          eyebrow: sanitizeText(formData.get(`${prefix}_eyebrow`), 80) || undefined,
          title: sanitizeText(formData.get(`${prefix}_title`), 160),
          body: sanitizeText(formData.get(`${prefix}_body`), 900),
        },
      });
      return;
    }

    if (block.type === "cta") {
      updatedBlocks.push({
        ...block,
        enabled,
        order,
        data: {
          ...block.data,
          title: sanitizeText(formData.get(`${prefix}_title`), 160),
          description: sanitizeText(formData.get(`${prefix}_description`), 420),
          label: sanitizeText(formData.get(`${prefix}_label`), 80),
          href: sanitizeText(formData.get(`${prefix}_href`), 240) || "#contact",
        },
      });
      return;
    }

    updatedBlocks.push({
      ...block,
      enabled,
      order,
      data: {
        ...block.data,
        title: sanitizeText(formData.get(`${prefix}_title`), 160),
        items: block.data.items.map((item, itemIndex) => ({
          ...item,
          title: sanitizeText(formData.get(`${prefix}_item_${itemIndex}_title`), 120),
          description: sanitizeText(formData.get(`${prefix}_item_${itemIndex}_description`), 420),
          badge: sanitizeText(formData.get(`${prefix}_item_${itemIndex}_badge`), 60),
        })),
      },
    });
  });

  const newBlockTitle = sanitizeText(formData.get(`page_${pageIndex}_section_${sectionIndex}_new_block_title`), 160);
  const newBlockBody = sanitizeText(formData.get(`page_${pageIndex}_section_${sectionIndex}_new_block_body`), 900);

  if (newBlockTitle && newBlockBody) {
    updatedBlocks.push({
      id: `block_${createToken().slice(0, 12)}`,
      type: "text",
      enabled: true,
      order: updatedBlocks.length + 1,
      data: {
        eyebrow: "Nouveau bloc",
        title: newBlockTitle,
        body: newBlockBody,
      },
    });
  }

  return updatedBlocks.sort((a, b) => a.order - b.order);
};

const updateSection = (formData: FormData, pageIndex: number, sectionIndex: number, section: SiteSection): SiteSection => {
  const prefix = `page_${pageIndex}_section_${sectionIndex}`;
  const enabled = readBool(formData, `${prefix}_enabled`);
  const order = readNumber(formData, `${prefix}_order`, section.order);
  const anchorId = slugify(sanitizeText(formData.get(`${prefix}_anchorId`), 80) || section.anchorId || section.id);

  switch (section.type) {
    case "hero":
      return {
        ...section,
        enabled,
        order,
        anchorId,
        data: {
          ...section.data,
          eyebrow: sanitizeText(formData.get(`${prefix}_eyebrow`), 120),
          title: sanitizeText(formData.get(`${prefix}_title`), 180),
          subtitle: sanitizeText(formData.get(`${prefix}_subtitle`), 420),
          primaryCta: sanitizeText(formData.get(`${prefix}_primaryCta`), 80),
          secondaryCta: sanitizeText(formData.get(`${prefix}_secondaryCta`), 80),
          primaryCtaHref: sanitizeText(formData.get(`${prefix}_primaryCtaHref`), 160) || "#contact",
          secondaryCtaHref: sanitizeText(formData.get(`${prefix}_secondaryCtaHref`), 160) || "#services",
        },
      };
    case "services":
    case "gallery":
      return {
        ...section,
        enabled,
        order,
        anchorId,
        data: {
          ...section.data,
          eyebrow: sanitizeText(formData.get(`${prefix}_eyebrow`), 120),
          title: sanitizeText(formData.get(`${prefix}_title`), 180),
          description: sanitizeText(formData.get(`${prefix}_description`), 520),
          items: section.data.items.map((item, itemIndex) => ({
            ...item,
            title: sanitizeText(formData.get(`${prefix}_item_${itemIndex}_title`), 140),
            description: sanitizeText(formData.get(`${prefix}_item_${itemIndex}_description`), 520),
            badge: "badge" in item ? sanitizeText(formData.get(`${prefix}_item_${itemIndex}_badge`), 80) : undefined,
          })),
        },
      } as SiteSection;
    case "reviews":
      return {
        ...section,
        enabled,
        order,
        anchorId,
        data: {
          ...section.data,
          eyebrow: sanitizeText(formData.get(`${prefix}_eyebrow`), 120),
          title: sanitizeText(formData.get(`${prefix}_title`), 180),
          items: section.data.items.map((item, itemIndex) => ({
            ...item,
            author: sanitizeText(formData.get(`${prefix}_item_${itemIndex}_author`), 120),
            comment: sanitizeText(formData.get(`${prefix}_item_${itemIndex}_comment`), 620),
            context: sanitizeText(formData.get(`${prefix}_item_${itemIndex}_context`), 120),
          })),
        },
      };
    case "contact":
      return {
        ...section,
        enabled,
        order,
        anchorId,
        data: {
          ...section.data,
          eyebrow: sanitizeText(formData.get(`${prefix}_eyebrow`), 120),
          title: sanitizeText(formData.get(`${prefix}_title`), 180),
          description: sanitizeText(formData.get(`${prefix}_description`), 520),
          phone: sanitizeText(formData.get(`${prefix}_phone`), 60),
          email: sanitizeText(formData.get(`${prefix}_email`), 160),
          address: sanitizeText(formData.get(`${prefix}_address`), 220),
        },
      };
    case "contentBlocks":
      return {
        ...section,
        enabled,
        order,
        anchorId,
        data: {
          ...section.data,
          eyebrow: sanitizeText(formData.get(`${prefix}_eyebrow`), 120),
          title: sanitizeText(formData.get(`${prefix}_title`), 180),
          description: sanitizeText(formData.get(`${prefix}_description`), 520),
          blocks: updateBlocks(formData, pageIndex, sectionIndex, (section.data as ContentBlocksSectionData).blocks),
        },
      };
    default:
      return { ...section, enabled, order, anchorId };
  }
};

const createBlankPage = (title: string, order: number): SitePage => {
  const slug = slugify(title) || `page-${order}`;

  return {
    id: `page_${createToken().slice(0, 12)}`,
    slug,
    path: slug,
    title,
    description: `${title} - page draft`,
    seo: {
      title,
      description: `${title} - page draft`,
    },
    order,
    enabled: true,
    showInNavigation: true,
    navigationLabel: title,
    sections: [
      {
        id: `content_${createToken().slice(0, 10)}`,
        type: "contentBlocks",
        enabled: true,
        order: 1,
        anchorId: "presentation",
        data: {
          eyebrow: "Page",
          title,
          description: "Ajoutez ici les premiers contenus de cette page.",
          blocks: [
            {
              id: `block_${createToken().slice(0, 10)}`,
              type: "text",
              enabled: true,
              order: 1,
              data: {
                eyebrow: "Contenu",
                title,
                body: "Texte a personnaliser pour cette page.",
              },
            },
          ],
        },
      },
    ],
  };
};

export async function updateSiteDraftAction(formData: FormData) {
  const dashboard = await getProtectedDashboardData();
  const draftId = sanitizeText(formData.get("draftId"), 80);
  const draft = await getSiteDraftForUser(draftId, dashboard.user.id);

  if (!draft) {
    redirect("/dashboard/site/drafts?error=Draft%20introuvable");
  }

  const config = clone<SiteConfig>(draft.config);
  const slug = slugify(sanitizeText(formData.get("slug"), 100));

  if (!slug || !isSafeSlug(slug)) {
    redirect(`/dashboard/site/drafts/${draftId}/edit?error=Slug%20invalide`);
  }

  config.slug = slug;
  config.name = sanitizeText(formData.get("name"), 120);
  config.baseline = sanitizeText(formData.get("baseline"), 240);
  config.businessType = sanitizeText(formData.get("businessType"), 120);
  config.mode = sanitizeText(formData.get("mode"), 20) === "multiPage" ? "multiPage" : "singlePage";
  config.branding = sanitizeText(formData.get("logoUrl"), 500)
    ? {
        logoUrl: sanitizeText(formData.get("logoUrl"), 500),
        logoAlt: `${config.name} logo`,
      }
    : undefined;
  config.theme = {
    ...config.theme,
    primaryColor: readColor(formData, "primaryColor", config.theme.primaryColor),
    secondaryColor: readColor(formData, "secondaryColor", config.theme.secondaryColor),
    backgroundColor: readColor(formData, "backgroundColor", config.theme.backgroundColor),
    textColor: readColor(formData, "textColor", config.theme.textColor),
  };

  const updatedPages: SitePage[] = [];

  config.pages.forEach((page, pageIndex) => {
    const prefix = `page_${pageIndex}`;
    const deleted = readBool(formData, `${prefix}_delete`);

    if (deleted) {
      return;
    }

    const title = sanitizeText(formData.get(`${prefix}_title`), 160) || page.title;
    const pageSlug = slugify(sanitizeText(formData.get(`${prefix}_slug`), 90) || page.slug);
    const order = readNumber(formData, `${prefix}_order`, page.order ?? pageIndex + 1);

    updatedPages.push({
      ...page,
      title,
      slug: pageSlug,
      path: pageSlug,
      description: sanitizeText(formData.get(`${prefix}_description`), 240) || page.description,
      order,
      enabled: readBool(formData, `${prefix}_enabled`),
      showInNavigation: readBool(formData, `${prefix}_showInNavigation`),
      navigationLabel: sanitizeText(formData.get(`${prefix}_navigationLabel`), 120) || title,
      seo: {
        title: sanitizeText(formData.get(`${prefix}_seoTitle`), 180) || title,
        description: sanitizeText(formData.get(`${prefix}_seoDescription`), 260) || page.description,
      },
      sections: page.sections
        .map((section, sectionIndex) => updateSection(formData, pageIndex, sectionIndex, section))
        .sort((a, b) => a.order - b.order),
    });
  });

  const newPageTitle = sanitizeText(formData.get("newPageTitle"), 160);

  if (newPageTitle) {
    updatedPages.push(createBlankPage(newPageTitle, updatedPages.length + 1));
  }

  if (!updatedPages.length) {
    redirect(`/dashboard/site/drafts/${draftId}/edit?error=Le%20draft%20doit%20garder%20au%20moins%20une%20page`);
  }

  config.pages = updatedPages.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  config.navigation = { mode: "pages" };

  await updateSiteDraftForUser({
    draftId,
    userId: dashboard.user.id,
    config,
  });

  redirect(`/dashboard/site/drafts/${draftId}/edit?saved=1`);
}
