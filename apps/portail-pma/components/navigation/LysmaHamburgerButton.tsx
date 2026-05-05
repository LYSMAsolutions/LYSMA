"use client";

type LysmaHamburgerButtonProps = {
  isOpen: boolean;
  onClick: () => void;
  mode?: "mobile" | "desktop";
};

export default function LysmaHamburgerButton({
  isOpen,
  onClick,
  mode = "mobile",
}: LysmaHamburgerButtonProps) {
  const isDesktop = mode === "desktop";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
      aria-expanded={isOpen}
      className={[
        "group relative inline-flex h-12 w-12 items-center justify-center rounded-xl",
      ].join(" ")}
    >
      <span className="sr-only">
        {isOpen ? "Fermer la navigation" : "Ouvrir la navigation"}
      </span>

      <span className="relative h-4 w-4">
        {isDesktop ? (
          <>
            <span
              className={[
                "absolute left-1/2 top-[2px] h-[2px] -translate-x-1/2 rounded-full bg-[#0A4D9B] transition-all duration-200",
                isOpen ? "top-[7px] w-3 rotate-45" : "w-4",
              ].join(" ")}
            />
            <span
              className={[
                "absolute left-1/2 top-[7px] h-[2px] w-4 -translate-x-1/2 rounded-full bg-[#0A4D9B] transition-all duration-200",
                isOpen ? "opacity-0" : "opacity-100",
              ].join(" ")}
            />
            <span
              className={[
                "absolute left-1/2 top-[12px] h-[2px] -translate-x-1/2 rounded-full bg-[#0A4D9B] transition-all duration-200",
                isOpen ? "top-[7px] w-3 -rotate-45" : "w-4",
              ].join(" ")}
            />
          </>
        ) : (
<>
  <span
    className={[
      "absolute left-1/2 h-[2px] -translate-x-1/2 rounded-full bg-[#0A4D9B] transition-all duration-200",
      isOpen ? "top-1/2 w-3 -translate-y-1/2 rotate-45" : "top-[2px] w-4",
    ].join(" ")}
  />
  <span
    className={[
      "absolute left-1/2 h-[2px] w-4 -translate-x-1/2 rounded-full bg-[#0A4D9B] transition-all duration-200",
      isOpen ? "opacity-0" : "top-1/2 -translate-y-1/2 opacity-100",
    ].join(" ")}
  />
  <span
    className={[
      "absolute left-1/2 h-[2px] -translate-x-1/2 rounded-full bg-[#0A4D9B] transition-all duration-200",
      isOpen ? "top-1/2 w-3 -translate-y-1/2 -rotate-45" : "top-[12px] w-4",
    ].join(" ")}
  />
</>
        )}
      </span>
    </button>
  );
}