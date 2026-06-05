type ChatboxPageMetadata = {
  page?: {
    path: string;
    url: string;
    title: string;
    referrer: string | null;
  };
};

const trimValue = (value: string, maxLength: number) => value.replace(/\s+/g, " ").trim().slice(0, maxLength);

export function getChatboxPageMetadata(): ChatboxPageMetadata {
  if (typeof window === "undefined") {
    return {};
  }

  return {
    page: {
      path: trimValue(window.location.pathname || "/", 180),
      url: trimValue(window.location.href, 500),
      title: trimValue(document.title || "", 180),
      referrer: document.referrer ? trimValue(document.referrer, 500) : null,
    },
  };
}
