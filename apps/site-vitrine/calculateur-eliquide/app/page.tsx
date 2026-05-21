"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ChevronLeft,
  FlaskConical,
  Droplets,
  SlidersHorizontal,
  Beaker,
} from "lucide-react";

type Mode = "recipe" | "dilution";
type AromaMode = "percent" | "ml";

type StatusState =
  | {
      message: string;
      ok: boolean;
    }
  | null;

function round2(value: number) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function formatMl(value: number) {
  const n = round2(value);
  return Number.isInteger(n) ? `${n} ml` : `${n.toFixed(2).replace(".", ",")} ml`;
}

function formatMg(value: number) {
  const n = round2(value);
  return Number.isInteger(n) ? `${n} mg/ml` : `${n.toFixed(2).replace(".", ",")} mg/ml`;
}

function formatPercent(value: number) {
  const n = round2(value);
  return Number.isInteger(n) ? `${n} %` : `${n.toFixed(2).replace(".", ",")} %`;
}

type RecipeResult =
  | {
      error: string;
    }
  | {
      nicotineBaseMl: number;
      aromaMl: number;
      neutralBaseMl: number;
      neutralPgMl: number;
      neutralVgMl: number;
      targetPgMl: number;
      targetVgMl: number;
      currentPgMl: number;
      currentVgMl: number;
      nicotineBaseRatio: number;
      aromaRatio: number;
      neutralBaseRatio: number;
    };

type DilutionResult =
  | {
      error: string;
    }
  | {
      sourceBaseToUseMl: number;
      neutralBaseToAddMl: number;
      finalVolumeMl: number;
    };

export default function CalculateurELiquidePage() {
  const [mode, setMode] = useState<Mode>("recipe");
  const [status, setStatus] = useState<StatusState>(null);

  const [finalVolume, setFinalVolume] = useState<number>(70);
  const [targetNicotine, setTargetNicotine] = useState<number>(6);
  const [sourceNicotine, setSourceNicotine] = useState<number>(20);

  const [aromaMode, setAromaMode] = useState<AromaMode>("percent");
  const [aromaPercent, setAromaPercent] = useState<number>(15);
  const [aromaMlFixed, setAromaMlFixed] = useState<number>(10);

  const [targetPg, setTargetPg] = useState<number>(50);
  const [targetVg, setTargetVg] = useState<number>(50);

  const [sourcePg, setSourcePg] = useState<number>(50);
  const [sourceVg, setSourceVg] = useState<number>(50);

  const [aromaPg, setAromaPg] = useState<number>(100);
  const [aromaVg, setAromaVg] = useState<number>(0);

  const [dilutionStartNicotine, setDilutionStartNicotine] = useState<number>(12);
  const [dilutionStartVolume, setDilutionStartVolume] = useState<number>(100);
  const [dilutionTargetNicotine, setDilutionTargetNicotine] = useState<number>(6);

  const quickVolumes = [30, 60, 70, 100, 120, 200];
  const targetNicotinePresets = [0, 3, 6, 10, 12];
  const sourceNicotinePresets = [6, 10, 12, 18, 20];
  const ratios = [
    { pg: 50, vg: 50, label: "50/50" },
    { pg: 30, vg: 70, label: "30/70" },
    { pg: 20, vg: 80, label: "20/80" },
    { pg: 70, vg: 30, label: "70/30" },
  ];

  const recipeResult = useMemo<RecipeResult>(() => {
    if (
      Number.isNaN(finalVolume) ||
      Number.isNaN(targetNicotine) ||
      Number.isNaN(sourceNicotine) ||
      Number.isNaN(aromaPercent) ||
      Number.isNaN(aromaMlFixed) ||
      Number.isNaN(targetPg) ||
      Number.isNaN(targetVg) ||
      Number.isNaN(sourcePg) ||
      Number.isNaN(sourceVg) ||
      Number.isNaN(aromaPg) ||
      Number.isNaN(aromaVg)
    ) {
      return { error: "Merci de remplir tous les champs avec des valeurs valides." };
    }

    if (finalVolume <= 0) {
      return { error: "Le volume final doit être supérieur à 0." };
    }

    if (targetNicotine < 0) {
      return { error: "La nicotine cible ne peut pas être négative." };
    }

    if (sourceNicotine <= 0 && targetNicotine > 0) {
      return { error: "La force de la base nicotinée source doit être supérieure à 0." };
    }

    if (sourceNicotine < targetNicotine) {
      return {
        error:
          "La nicotine de la base source est inférieure à la nicotine cible. Le mélange est impossible.",
      };
    }

    if (targetPg + targetVg !== 100) {
      return { error: "Le ratio cible PG/VG doit faire 100%." };
    }

    if (sourcePg + sourceVg !== 100) {
      return { error: "Le ratio PG/VG de la base nicotinée doit faire 100%." };
    }

    if (aromaPg + aromaVg !== 100) {
      return { error: "Le ratio PG/VG du concentré doit faire 100%." };
    }

    let aromaMl = 0;

    if (aromaMode === "percent") {
      if (aromaPercent < 0 || aromaPercent > 100) {
        return { error: "L’arôme en pourcentage doit être compris entre 0 et 100." };
      }
      aromaMl = finalVolume * (aromaPercent / 100);
    } else {
      if (aromaMlFixed < 0 || aromaMlFixed > finalVolume) {
        return {
          error: "Le volume de concentré doit être compris entre 0 et le volume final.",
        };
      }
      aromaMl = aromaMlFixed;
    }

    const nicotineBaseMl =
      targetNicotine === 0 ? 0 : (finalVolume * targetNicotine) / sourceNicotine;

    const neutralBaseMl = finalVolume - nicotineBaseMl - aromaMl;

    if (neutralBaseMl < 0) {
      return {
        error:
          "Le mélange est impossible : base nicotinée + concentré dépassent le volume final.",
      };
    }

    const targetPgMl = finalVolume * (targetPg / 100);
    const targetVgMl = finalVolume * (targetVg / 100);

    const sourcePgMl = nicotineBaseMl * (sourcePg / 100);
    const sourceVgMl = nicotineBaseMl * (sourceVg / 100);

    const aromaPgMl = aromaMl * (aromaPg / 100);
    const aromaVgMl = aromaMl * (aromaVg / 100);

    const currentPgMl = sourcePgMl + aromaPgMl;
    const currentVgMl = sourceVgMl + aromaVgMl;

    const neutralPgMl = targetPgMl - currentPgMl;
    const neutralVgMl = targetVgMl - currentVgMl;

    if (neutralPgMl < -0.01 || neutralVgMl < -0.01) {
      return {
        error:
          "Le ratio PG/VG demandé est impossible avec cette base nicotinée et ce concentré.",
      };
    }

    return {
      nicotineBaseMl,
      aromaMl,
      neutralBaseMl,
      neutralPgMl: Math.max(0, neutralPgMl),
      neutralVgMl: Math.max(0, neutralVgMl),
      targetPgMl,
      targetVgMl,
      currentPgMl,
      currentVgMl,
      nicotineBaseRatio: (nicotineBaseMl / finalVolume) * 100,
      aromaRatio: (aromaMl / finalVolume) * 100,
      neutralBaseRatio: (neutralBaseMl / finalVolume) * 100,
    };
  }, [
    finalVolume,
    targetNicotine,
    sourceNicotine,
    aromaMode,
    aromaPercent,
    aromaMlFixed,
    targetPg,
    targetVg,
    sourcePg,
    sourceVg,
    aromaPg,
    aromaVg,
  ]);

  const dilutionResult = useMemo<DilutionResult>(() => {
    if (
      Number.isNaN(dilutionStartNicotine) ||
      Number.isNaN(dilutionStartVolume) ||
      Number.isNaN(dilutionTargetNicotine)
    ) {
      return { error: "Merci de remplir tous les champs avec des valeurs valides." };
    }

    if (dilutionStartVolume <= 0) {
      return { error: "Le volume de départ doit être supérieur à 0." };
    }

    if (dilutionStartNicotine <= 0) {
      return { error: "La nicotine de départ doit être supérieure à 0." };
    }

    if (dilutionTargetNicotine < 0) {
      return { error: "La nicotine cible ne peut pas être négative." };
    }

    if (dilutionTargetNicotine > dilutionStartNicotine) {
      return {
        error:
          "La nicotine cible est supérieure à la nicotine de départ. La dilution est impossible.",
      };
    }

    if (dilutionTargetNicotine === 0) {
      return {
        error:
          "Pour atteindre 0 mg/ml, la dilution devient théoriquement infinie. Mets une valeur > 0.",
      };
    }

    const finalVolumeMl =
      (dilutionStartNicotine * dilutionStartVolume) / dilutionTargetNicotine;

    const neutralBaseToAddMl = finalVolumeMl - dilutionStartVolume;

    return {
      sourceBaseToUseMl: dilutionStartVolume,
      neutralBaseToAddMl,
      finalVolumeMl,
    };
  }, [dilutionStartNicotine, dilutionStartVolume, dilutionTargetNicotine]);

  function handleCalculate() {
    if (mode === "recipe") {
      if ("error" in recipeResult) {
        setStatus({ message: recipeResult.error, ok: false });
        return;
      }
      setStatus({ message: "Calcul effectué avec succès.", ok: true });
      return;
    }

    if ("error" in dilutionResult) {
      setStatus({ message: dilutionResult.error, ok: false });
      return;
    }

    setStatus({ message: "Calcul effectué avec succès.", ok: true });
  }

  function resetRecipe() {
    setFinalVolume(70);
    setTargetNicotine(6);
    setSourceNicotine(20);
    setAromaMode("percent");
    setAromaPercent(15);
    setAromaMlFixed(10);
    setTargetPg(50);
    setTargetVg(50);
    setSourcePg(50);
    setSourceVg(50);
    setAromaPg(100);
    setAromaVg(0);
    setStatus(null);
  }

  function resetDilution() {
    setDilutionStartNicotine(12);
    setDilutionStartVolume(100);
    setDilutionTargetNicotine(6);
    setStatus(null);
  }

  const recipeSafe = "error" in recipeResult ? null : recipeResult;
  const dilutionSafe = "error" in dilutionResult ? null : dilutionResult;

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#F2F4F7] text-[#0F172A]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(10,77,155,0.08),transparent_28%),radial-gradient(circle_at_80%_10%,rgba(30,115,216,0.10),transparent_24%),radial-gradient(circle_at_50%_100%,rgba(110,168,255,0.14),transparent_30%)] pointer-events-none" />
      <div className="absolute -top-16 -left-10 h-64 w-64 rounded-full bg-[rgba(30,115,216,0.18)] blur-[90px] pointer-events-none" />
      <div className="absolute top-24 -right-10 h-60 w-60 rounded-full bg-[rgba(110,168,255,0.14)] blur-[90px] pointer-events-none" />

      <div className="absolute inset-x-0 top-2 flex justify-center pointer-events-none">
        <img
          src="/logo-lysma.png"
          alt=""
          className="w-[min(1000px,95vw)] h-[min(420px,40vw)] object-contain opacity-[0.20] select-none"
        />
      </div>

      <section className="relative z-10 mx-auto max-w-7xl px-4 pb-12 pt-6 md:px-8">
        <Link
          href="http://localhost:3000"
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-[rgba(10,77,155,0.12)] bg-white/70 px-4 py-2 text-sm font-semibold text-[#1E73D8] backdrop-blur-md transition hover:-translate-y-[1px] hover:text-[#0A4D9B]"
        >
          <ChevronLeft className="h-4 w-4" />
          Retour au Hub
        </Link>

        <section className="relative mx-auto max-w-4xl px-2 pb-14 pt-10 text-center">
          <span className="inline-flex min-h-10 items-center rounded-full border border-[rgba(10,77,155,0.12)] bg-white/70 px-4 text-sm font-bold text-[#0A4D9B] backdrop-blur-md shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
            Outil métier LYSMA
          </span>

          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-[#0F172A] md:text-6xl">
            Calculateur e-liquide
          </h1>

          <p className="mx-auto mt-5 max-w-3xl text-lg leading-relaxed text-[#667085] md:text-xl">
            Un outil premium, clair et précis pour préparer une recette complète,
            gérer une dilution nicotinée et contrôler l’équilibre PG/VG.
          </p>
        </section>

        <section className="relative mx-auto mb-8 max-w-6xl">
          <div className="grid gap-4 md:grid-cols-2">
            <ModeCard
              active={mode === "recipe"}
              onClick={() => {
                setMode("recipe");
                setStatus(null);
              }}
              icon={<FlaskConical className="h-5 w-5 text-[#0A4D9B]" />}
              title="Recette complète"
              description="Volume final, nicotine cible, base nicotinée source, arôme et calcul PG/VG."
            />

            <ModeCard
              active={mode === "dilution"}
              onClick={() => {
                setMode("dilution");
                setStatus(null);
              }}
              icon={<Droplets className="h-5 w-5 text-[#0A4D9B]" />}
              title="Dilution simple"
              description="Tu as déjà une base nicotinée et tu veux la diluer avec de la base neutre."
            />
          </div>
        </section>

        {mode === "recipe" ? (
          <section className="relative mx-auto grid max-w-7xl gap-6 xl:grid-cols-[1.05fr_.95fr]">
            <Card>
              <SectionHeader
                kicker="Paramètres"
                title="Préparation complète"
                icon={<SlidersHorizontal className="h-5 w-5 text-[#0A4D9B]" />}
              />

              <div className="mb-6">
                <MiniTitle>Volumes rapides</MiniTitle>
                <div className="grid grid-cols-3 gap-2">
                  {quickVolumes.map((v) => (
                    <QuickButton
                      key={v}
                      active={finalVolume === v}
                      onClick={() => {
                        setFinalVolume(v);
                        setStatus(null);
                      }}
                    >
                      {v} ml
                    </QuickButton>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <MiniTitle>Nicotine cible</MiniTitle>
                <div className="mb-3 flex flex-wrap gap-2">
                  {targetNicotinePresets.map((preset) => (
                    <ChipButton
                      key={preset}
                      active={targetNicotine === preset}
                      onClick={() => {
                        setTargetNicotine(preset);
                        setStatus(null);
                      }}
                    >
                      {preset} mg/ml
                    </ChipButton>
                  ))}
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <Field
                    label="Volume final (ml)"
                    value={finalVolume}
                    onChange={(value) => {
                      setFinalVolume(value);
                      setStatus(null);
                    }}
                  />
                  <Field
                    label="Nicotine cible (mg/ml)"
                    value={targetNicotine}
                    step="1"
                    onChange={(value) => {
                      setTargetNicotine(value);
                      setStatus(null);
                    }}
                  />
                </div>
              </div>

              <div className="mb-6">
                <MiniTitle>Base nicotinée source</MiniTitle>
                <div className="mb-3 flex flex-wrap gap-2">
                  {sourceNicotinePresets.map((preset) => (
                    <ChipButton
                      key={preset}
                      active={sourceNicotine === preset}
                      onClick={() => {
                        setSourceNicotine(preset);
                        setStatus(null);
                      }}
                    >
                      {preset} mg/ml
                    </ChipButton>
                  ))}
                </div>

                <div className="grid gap-3 md:grid-cols-3">
                  <Field
                    label="Force nicotine source"
                    value={sourceNicotine}
                    step="1"
                    onChange={(value) => {
                      setSourceNicotine(value);
                      setStatus(null);
                    }}
                  />
                  <Field
                    label="PG base source (%)"
                    value={sourcePg}
                    onChange={(value) => {
                      setSourcePg(value);
                      setStatus(null);
                    }}
                  />
                  <Field
                    label="VG base source (%)"
                    value={sourceVg}
                    onChange={(value) => {
                      setSourceVg(value);
                      setStatus(null);
                    }}
                  />
                </div>
              </div>

              <div className="mb-6">
                <MiniTitle>Concentré / arôme</MiniTitle>

                <div className="mb-3 grid grid-cols-2 gap-2">
                  <QuickButton
                    active={aromaMode === "percent"}
                    onClick={() => {
                      setAromaMode("percent");
                      setStatus(null);
                    }}
                  >
                    Arôme en %
                  </QuickButton>

                  <QuickButton
                    active={aromaMode === "ml"}
                    onClick={() => {
                      setAromaMode("ml");
                      setStatus(null);
                    }}
                  >
                    Concentré en ml
                  </QuickButton>
                </div>

                <div className="grid gap-3 md:grid-cols-3">
                  {aromaMode === "percent" ? (
                    <Field
                      label="Arôme (%)"
                      value={aromaPercent}
                      step="1"
                      onChange={(value) => {
                        setAromaPercent(value);
                        setStatus(null);
                      }}
                    />
                  ) : (
                    <Field
                      label="Concentré prévu (ml)"
                      value={aromaMlFixed}
                      step="1"
                      onChange={(value) => {
                        setAromaMlFixed(value);
                        setStatus(null);
                      }}
                    />
                  )}

                  <Field
                    label="PG concentré (%)"
                    value={aromaPg}
                    onChange={(value) => {
                      setAromaPg(value);
                      setStatus(null);
                    }}
                  />

                  <Field
                    label="VG concentré (%)"
                    value={aromaVg}
                    onChange={(value) => {
                      setAromaVg(value);
                      setStatus(null);
                    }}
                  />
                </div>
              </div>

              <div className="mb-6">
                <MiniTitle>Ratio final souhaité</MiniTitle>

                <div className="mb-3 flex flex-wrap gap-2">
                  {ratios.map((ratio) => (
                    <ChipButton
                      key={ratio.label}
                      active={targetPg === ratio.pg && targetVg === ratio.vg}
                      onClick={() => {
                        setTargetPg(ratio.pg);
                        setTargetVg(ratio.vg);
                        setStatus(null);
                      }}
                    >
                      {ratio.label}
                    </ChipButton>
                  ))}
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <Field
                    label="PG cible (%)"
                    value={targetPg}
                    onChange={(value) => {
                      setTargetPg(value);
                      setStatus(null);
                    }}
                  />
                  <Field
                    label="VG cible (%)"
                    value={targetVg}
                    onChange={(value) => {
                      setTargetVg(value);
                      setStatus(null);
                    }}
                  />
                </div>
              </div>

              <ActionRow
                onCalculate={handleCalculate}
                onReset={resetRecipe}
                status={status}
              />
            </Card>

            <Card>
              <SectionHeader
                kicker="Résultat"
                title="Lecture finale"
                icon={<Beaker className="h-5 w-5 text-[#0A4D9B]" />}
              />

              <ResultHero
                title="Base neutre à compléter"
                value={formatMl(recipeSafe?.neutralBaseMl ?? 0)}
                items={[
                  { label: "Nicotine cible", value: formatMg(targetNicotine) },
                  {
                    label: aromaMode === "percent" ? "Arôme" : "Concentré",
                    value:
                      aromaMode === "percent"
                        ? formatPercent(aromaPercent)
                        : formatMl(recipeSafe?.aromaMl ?? aromaMlFixed),
                  },
                  {
                    label: "Base nicotinée",
                    value: formatMl(recipeSafe?.nicotineBaseMl ?? 0),
                  },
                  { label: "Volume final", value: formatMl(finalVolume) },
                ]}
              />

              <div className="mt-4 grid grid-cols-2 gap-3">
                <SummaryCard
                  label="Base nicotinée"
                  value={formatMl(recipeSafe?.nicotineBaseMl ?? 0)}
                />
                <SummaryCard
                  label="Concentré"
                  value={formatMl(recipeSafe?.aromaMl ?? 0)}
                />
                <SummaryCard
                  label="Base neutre totale"
                  value={formatMl(recipeSafe?.neutralBaseMl ?? 0)}
                />
                <SummaryCard label="Ratio cible" value={`${targetPg}/${targetVg}`} />
              </div>

              <DetailBlock title="Répartition de la base neutre">
                <PrepItem
                  index={1}
                  label="PG neutre à ajouter"
                  value={formatMl(recipeSafe?.neutralPgMl ?? 0)}
                />
                <PrepItem
                  index={2}
                  label="VG neutre à ajouter"
                  value={formatMl(recipeSafe?.neutralVgMl ?? 0)}
                />
              </DetailBlock>

              <DetailBlock title="Répartition globale du mélange">
                <PrepItem
                  index={1}
                  label="Base nicotinée"
                  value={`${formatMl(recipeSafe?.nicotineBaseMl ?? 0)} • ${formatPercent(
                    recipeSafe?.nicotineBaseRatio ?? 0
                  )}`}
                />
                <PrepItem
                  index={2}
                  label="Concentré"
                  value={`${formatMl(recipeSafe?.aromaMl ?? 0)} • ${formatPercent(
                    recipeSafe?.aromaRatio ?? 0
                  )}`}
                />
                <PrepItem
                  index={3}
                  label="Base neutre"
                  value={`${formatMl(recipeSafe?.neutralBaseMl ?? 0)} • ${formatPercent(
                    recipeSafe?.neutralBaseRatio ?? 0
                  )}`}
                />
              </DetailBlock>
            </Card>
          </section>
        ) : (
          <section className="relative mx-auto grid max-w-7xl gap-6 xl:grid-cols-[1.05fr_.95fr]">
            <Card>
              <SectionHeader
                kicker="Paramètres"
                title="Dilution simple"
                icon={<Droplets className="h-5 w-5 text-[#0A4D9B]" />}
              />

              <div className="mb-6 grid gap-3 md:grid-cols-3">
                <Field
                  label="Nicotine de départ (mg/ml)"
                  value={dilutionStartNicotine}
                  step="1"
                  onChange={(value) => {
                    setDilutionStartNicotine(value);
                    setStatus(null);
                  }}
                />
                <Field
                  label="Volume de départ (ml)"
                  value={dilutionStartVolume}
                  step="1"
                  onChange={(value) => {
                    setDilutionStartVolume(value);
                    setStatus(null);
                  }}
                />
                <Field
                  label="Nicotine cible (mg/ml)"
                  value={dilutionTargetNicotine}
                  step="1"
                  onChange={(value) => {
                    setDilutionTargetNicotine(value);
                    setStatus(null);
                  }}
                />
              </div>

              <ActionRow
                onCalculate={handleCalculate}
                onReset={resetDilution}
                status={status}
              />
            </Card>

            <Card>
              <SectionHeader
                kicker="Résultat"
                title="Dilution finale"
                icon={<Beaker className="h-5 w-5 text-[#0A4D9B]" />}
              />

              <ResultHero
                title="Base neutre à ajouter"
                value={formatMl(dilutionSafe?.neutralBaseToAddMl ?? 0)}
                items={[
                  { label: "Nicotine départ", value: formatMg(dilutionStartNicotine) },
                  { label: "Nicotine cible", value: formatMg(dilutionTargetNicotine) },
                  { label: "Volume départ", value: formatMl(dilutionStartVolume) },
                  { label: "Volume final", value: formatMl(dilutionSafe?.finalVolumeMl ?? 0) },
                ]}
              />

              <div className="mt-4 grid grid-cols-2 gap-3">
                <SummaryCard
                  label="Base départ utilisée"
                  value={formatMl(dilutionSafe?.sourceBaseToUseMl ?? 0)}
                />
                <SummaryCard
                  label="Base neutre à ajouter"
                  value={formatMl(dilutionSafe?.neutralBaseToAddMl ?? 0)}
                />
                <SummaryCard
                  label="Volume final obtenu"
                  value={formatMl(dilutionSafe?.finalVolumeMl ?? 0)}
                />
                <SummaryCard
                  label="Résultat cible"
                  value={formatMg(dilutionTargetNicotine)}
                />
              </div>

              <DetailBlock title="Étapes de dilution">
                <PrepItem
                  index={1}
                  label="Conserver la base de départ"
                  value={formatMl(dilutionSafe?.sourceBaseToUseMl ?? 0)}
                />
                <PrepItem
                  index={2}
                  label="Ajouter la base neutre"
                  value={formatMl(dilutionSafe?.neutralBaseToAddMl ?? 0)}
                />
                <PrepItem
                  index={3}
                  label="Obtenir le volume final"
                  value={formatMl(dilutionSafe?.finalVolumeMl ?? 0)}
                />
              </DetailBlock>
            </Card>
          </section>
        )}
      </section>
    </main>
  );
}

function ModeCard({
  active,
  onClick,
  icon,
  title,
  description,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "group rounded-[28px] border p-6 text-left transition-all duration-300 backdrop-blur-md",
        active
          ? "border-[#DCE5F0] bg-white/85 shadow-[0_16px_38px_rgba(15,23,42,0.08)]"
          : "border-[#E2E8F0] bg-white/65 hover:-translate-y-[2px] hover:shadow-[0_12px_30px_rgba(15,23,42,0.05)]",
      ].join(" ")}
    >
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#E8F1FB]">
        {icon}
      </div>
      <h2 className="mb-2 text-xl font-semibold text-[#0F172A] transition group-hover:text-[#0A4D9B]">
        {title}
      </h2>
      <p className="leading-relaxed text-[#667085]">{description}</p>
    </button>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-[32px] border border-[#DCE5F0] bg-white/80 p-5 shadow-[0_14px_34px_rgba(15,23,42,0.08)] backdrop-blur-md md:p-6">
      {children}
    </div>
  );
}

function SectionHeader({
  kicker,
  title,
  icon,
}: {
  kicker: string;
  title: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="mb-5">
      <div className="mb-2 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E8F1FB]">
          {icon}
        </div>
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#1E73D8]">
            {kicker}
          </p>
          <h2 className="mt-1 text-xl font-black tracking-tight md:text-2xl">{title}</h2>
        </div>
      </div>
      <div className="h-px bg-gradient-to-r from-[#0A4D9B]/20 to-transparent" />
    </div>
  );
}

function MiniTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-3 text-[11px] font-black uppercase tracking-[0.16em] text-[#1E73D8]">
      {children}
    </p>
  );
}

function QuickButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "h-10 rounded-xl text-sm font-bold transition",
        active
          ? "bg-gradient-to-br from-[#0A4D9B] via-[#1E73D8] to-[#6EA8FF] text-white shadow-[0_8px_18px_rgba(10,77,155,0.22)]"
          : "bg-[#EEF3F9] text-[#0F172A] hover:-translate-y-[1px]",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function ChipButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "rounded-full border px-3 py-2 text-sm font-bold transition",
        active
          ? "border-[#0A4D9B] bg-[#0A4D9B] text-white shadow-[0_6px_16px_rgba(10,77,155,0.18)]"
          : "border-[#DCE5F0] bg-white text-[#0F172A] hover:border-[#1E73D8] hover:text-[#0A4D9B]",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function ActionRow({
  onCalculate,
  onReset,
  status,
}: {
  onCalculate: () => void;
  onReset: () => void;
  status: StatusState;
}) {
  return (
    <>
      <div className="grid gap-3 md:grid-cols-[1.15fr_.85fr]">
        <button
          type="button"
          onClick={onCalculate}
          className="h-12 rounded-2xl bg-gradient-to-br from-[#0A4D9B] via-[#1E73D8] to-[#6EA8FF] font-extrabold text-white shadow-[0_10px_22px_rgba(10,77,155,0.22)] transition hover:-translate-y-[1px]"
        >
          Calculer
        </button>

        <button
          type="button"
          onClick={onReset}
          className="h-12 rounded-2xl bg-[#EEF2F7] font-extrabold text-[#0F172A] transition hover:-translate-y-[1px]"
        >
          Reset
        </button>
      </div>

      {status && (
        <div
          className={[
            "mt-4 rounded-2xl border px-4 py-3 text-sm font-bold",
            status.ok
              ? "border-[rgba(22,163,74,.18)] bg-[rgba(22,163,74,.10)] text-[#16A34A]"
              : "border-[rgba(220,38,38,.18)] bg-[rgba(220,38,38,.10)] text-[#DC2626]",
          ].join(" ")}
        >
          {status.message}
        </div>
      )}
    </>
  );
}

function Field({
  label,
  value,
  onChange,
  step = "1",
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  step?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="overflow-hidden text-ellipsis whitespace-nowrap text-[11px] font-bold text-[#6B7280]">
        {label}
      </label>
      <input
        type="number"
        inputMode="decimal"
        step={step}
        value={Number.isNaN(value) ? "" : value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-11 w-full rounded-[14px] border-[1.5px] border-[#DCE5F0] bg-white px-3 text-base text-[#0F172A] outline-none transition focus:border-[#1E73D8] focus:shadow-[0_0_0_3px_rgba(30,115,216,0.10)] md:h-12 md:text-lg"
      />
    </div>
  );
}

function ResultHero({
  title,
  value,
  items,
}: {
  title: string;
  value: string;
  items: { label: string; value: string }[];
}) {
  return (
    <div className="flex flex-col gap-4 rounded-[26px] bg-gradient-to-br from-[#0A4D9B] via-[#1E73D8] to-[#6EA8FF] p-5 text-white shadow-[0_12px_26px_rgba(10,77,155,0.20)]">
      <div>
        <div className="mb-1 text-[10px] font-black uppercase tracking-[0.14em] text-white/75">
          Lecture principale
        </div>
        <div className="mb-1 text-sm font-bold text-white/90">{title}</div>
        <div className="text-4xl font-black leading-none md:text-5xl">{value}</div>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-3">
        {items.map((item) => (
          <div key={item.label} className="flex flex-col gap-0.5">
            <span className="whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.08em] text-white/70">
              {item.label}
            </span>
            <span className="whitespace-nowrap text-sm font-extrabold md:text-base">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[18px] border border-[#DCE5F0] bg-gradient-to-b from-white to-[#F7FAFE] p-4">
      <div className="mb-2 whitespace-nowrap text-[11px] font-bold text-[#6B7280]">
        {label}
      </div>
      <div className="whitespace-nowrap text-xl font-black leading-none md:text-2xl">
        {value}
      </div>
    </div>
  );
}

function DetailBlock({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-4 rounded-[22px] border border-dashed border-[rgba(10,77,155,.22)] bg-[#FBFCFF] p-4">
      <h3 className="mb-4 text-base font-black">{title}</h3>
      <div className="grid gap-3">{children}</div>
    </div>
  );
}

function PrepItem({
  index,
  label,
  value,
}: {
  index: number;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-[#E7ECF4] bg-white px-4 py-3">
      <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#EAF3FF] text-xs font-black text-[#0A4D9B]">
        {index}
      </div>
      <div className="flex-1 text-sm font-semibold leading-snug md:text-[15px]">
        {label}
      </div>
      <div className="whitespace-nowrap text-sm font-black md:text-base">{value}</div>
    </div>
  );
}