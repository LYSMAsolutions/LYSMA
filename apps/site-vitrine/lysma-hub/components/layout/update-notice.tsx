"use client";

import { useEffect, useMemo, useState } from "react";

const STORAGE_VERSION_KEY = "lysma:last-seen-version";
const FORM_DRAFT_PREFIX = "lysma:form-draft:";
const CURRENT_VERSION = process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA || "local-dev";

const getFormKey = (form: HTMLFormElement, index: number) => {
  const names = Array.from(form.elements)
    .map((element) => ("name" in element ? element.name : ""))
    .filter(Boolean)
    .join("|");
  const identity = form.getAttribute("data-form-id") || form.id || form.getAttribute("name") || form.action || index;

  return `${FORM_DRAFT_PREFIX}${window.location.pathname}:${identity}:${names}`;
};

const saveFormDrafts = () => {
  document.querySelectorAll("form").forEach((form, formIndex) => {
    const draft: Record<string, string | boolean> = {};
    const elements = Array.from(form.elements);

    elements.forEach((element) => {
      if (!(element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement || element instanceof HTMLSelectElement)) {
        return;
      }

      if (!element.name || element.type === "password" || element.type === "file") {
        return;
      }

      if (element instanceof HTMLInputElement && (element.type === "checkbox" || element.type === "radio")) {
        draft[element.name] = element.checked;
        return;
      }

      draft[element.name] = element.value;
    });

    sessionStorage.setItem(getFormKey(form, formIndex), JSON.stringify(draft));
  });
};

const restoreFormDrafts = () => {
  document.querySelectorAll("form").forEach((form, formIndex) => {
    const rawDraft = sessionStorage.getItem(getFormKey(form, formIndex));

    if (!rawDraft) {
      return;
    }

    const draft = JSON.parse(rawDraft) as Record<string, string | boolean>;
    Array.from(form.elements).forEach((element) => {
      if (!(element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement || element instanceof HTMLSelectElement)) {
        return;
      }

      if (!element.name || !(element.name in draft)) {
        return;
      }

      if (element instanceof HTMLInputElement && (element.type === "checkbox" || element.type === "radio")) {
        element.checked = Boolean(draft[element.name]);
        return;
      }

      if (!element.value) {
        element.value = String(draft[element.name]);
      }
    });
  });
};

export function UpdateNotice() {
  const [visible, setVisible] = useState(false);
  const version = useMemo(() => CURRENT_VERSION, []);

  useEffect(() => {
    restoreFormDrafts();

    const lastSeenVersion = localStorage.getItem(STORAGE_VERSION_KEY);

    if (!lastSeenVersion) {
      localStorage.setItem(STORAGE_VERSION_KEY, version);
      return;
    }

    if (lastSeenVersion !== version) {
      setVisible(true);
    }
  }, [version]);

  if (!visible) {
    return null;
  }

  return (
    <button
      className="lysma-update-notice"
      type="button"
      onClick={() => {
        saveFormDrafts();
        localStorage.setItem(STORAGE_VERSION_KEY, version);
        window.location.reload();
      }}
    >
      <strong>Mise à jour disponible</strong>
      <span>Actualiser sans perdre le formulaire</span>
    </button>
  );
}
