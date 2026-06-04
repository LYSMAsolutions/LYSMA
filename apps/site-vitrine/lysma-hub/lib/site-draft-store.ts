import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { createToken } from "./auth-crypto";
import type { SiteConfig } from "./site-types";

export type SiteDraftRecord = {
  id: string;
  userId: string;
  siteSlug: string | null;
  config: SiteConfig;
  createdAt: string;
  updatedAt: string;
};

type SiteDraftStore = {
  drafts: SiteDraftRecord[];
};

const STORE_PATH = path.join(process.cwd(), ".next", "lysma-hub-site-drafts.json");

const readStore = async (): Promise<SiteDraftStore> => {
  try {
    const raw = await readFile(STORE_PATH, "utf8");
    return JSON.parse(raw) as SiteDraftStore;
  } catch {
    return { drafts: [] };
  }
};

const writeStore = async (store: SiteDraftStore) => {
  await mkdir(path.dirname(STORE_PATH), { recursive: true });
  await writeFile(STORE_PATH, JSON.stringify(store, null, 2), "utf8");
};

export const saveSiteDraft = async ({
  userId,
  siteSlug,
  config,
}: {
  userId: string;
  siteSlug: string | null;
  config: SiteConfig;
}) => {
  const store = await readStore();
  const timestamp = new Date().toISOString();
  const draft: SiteDraftRecord = {
    id: `draft_${createToken().slice(0, 18)}`,
    userId,
    siteSlug,
    config,
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  store.drafts.push(draft);
  await writeStore(store);

  return draft;
};

export const getSiteDraftForUser = async (draftId: string, userId: string) => {
  const store = await readStore();
  return store.drafts.find((draft) => draft.id === draftId && draft.userId === userId) ?? null;
};

export const getSiteDraftsForUser = async (userId: string) => {
  const store = await readStore();
  return store.drafts
    .filter((draft) => draft.userId === userId)
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
};

export const getLatestSiteDraftForUser = async (userId: string) => {
  const store = await readStore();
  return (
    store.drafts
      .filter((draft) => draft.userId === userId)
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())[0] ?? null
  );
};

export const updateSiteDraftForUser = async ({
  draftId,
  userId,
  config,
}: {
  draftId: string;
  userId: string;
  config: SiteConfig;
}) => {
  const store = await readStore();
  const draft = store.drafts.find((candidate) => candidate.id === draftId && candidate.userId === userId);

  if (!draft) {
    return null;
  }

  draft.config = config;
  draft.updatedAt = new Date().toISOString();
  await writeStore(store);

  return draft;
};
