"use client";

import { useState } from "react";
import { lysmaHome } from "../../data/lysma-home";
import { Badge } from "../ui/badge";
import { SectionTitle } from "../ui/section-title";

type ShowcaseItem = (typeof lysmaHome.showcase)[number];

function ProjectPreview({ item }: { item: ShowcaseItem }) {
  if (item.preview.type === "iframe") {
    return (
      <div className="lysma-project-preview lysma-project-preview-iframe">
        <iframe src={item.preview.url} title={`Apercu ${item.title}`} loading="lazy" />
      </div>
    );
  }

  return (
    <div className="lysma-project-preview lysma-project-preview-livo">
      <div className="lysma-project-preview-brand">
        <strong>LIVO</strong>
        <span>Outil web métier</span>
      </div>
      <div className="lysma-project-preview-lines">
        <span />
        <span />
        <span />
      </div>
    </div>
  );
}

const getPositionClass = (index: number, activeIndex: number, total: number) => {
  if (index === activeIndex) return "is-active";
  if (total === 2) return "is-next";

  const previous = (activeIndex - 1 + total) % total;
  const next = (activeIndex + 1) % total;

  if (index === previous) return "is-previous";
  if (index === next) return "is-next";

  return "is-hidden";
};

export function ShowcaseSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const items = lysmaHome.showcase;

  const goToPrevious = () => {
    setActiveIndex((current) => (current === 0 ? items.length - 1 : current - 1));
  };

  const goToNext = () => {
    setActiveIndex((current) => (current === items.length - 1 ? 0 : current + 1));
  };

  return (
    <section className="lysma-section lysma-section-strong" id="realisations">
      <SectionTitle
        eyebrow="Ils nous font confiance"
        title="Des réalisations concrètes."
        description="Des projets réels, présentés simplement."
      />

      <div className="lysma-coverflow" aria-label="Réalisations LYSMA">
        <button
          className="lysma-coverflow-arrow lysma-coverflow-arrow-left"
          type="button"
          onClick={goToPrevious}
          aria-label="Réalisation précédente"
        >
          &lsaquo;
        </button>

        <div className="lysma-coverflow-stage">
          {items.map((item, index) => (
            <article
              key={item.title}
              className={`lysma-coverflow-card ${getPositionClass(index, activeIndex, items.length)}`}
              onClick={() => setActiveIndex(index)}
            >
              {index === 0 ? <span className="lysma-project-featured">&#9733;</span> : null}
              <ProjectPreview item={item} />
              <div className="lysma-project-body">
                <Badge>{item.status}</Badge>
                <h3>{item.title}</h3>
                <p className="lysma-project-note">{item.note}</p>
                <p>{item.description}</p>
                <a href={item.href} target={item.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
                  Voir le projet -&gt;
                </a>
              </div>
            </article>
          ))}
        </div>

        <button
          className="lysma-coverflow-arrow lysma-coverflow-arrow-right"
          type="button"
          onClick={goToNext}
          aria-label="Réalisation suivante"
        >
          &rsaquo;
        </button>
      </div>

      <div className="lysma-coverflow-dots" aria-label="Navigation des réalisations">
        {items.map((item, index) => (
          <button
            key={item.title}
            type="button"
            className={index === activeIndex ? "is-active" : undefined}
            onClick={() => setActiveIndex(index)}
            aria-label={`Afficher ${item.title}`}
          >
            <span />
          </button>
        ))}
      </div>
    </section>
  );
}
