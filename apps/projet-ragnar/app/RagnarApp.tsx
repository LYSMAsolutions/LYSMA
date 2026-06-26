'use client'

import { useEffect, useMemo, useState } from 'react'
import styles from './page.module.css'

type WorkoutType = 'A' | 'B'
type Screen = 'home' | 'session' | 'summary' | 'history' | 'nutrition' | 'settings'
type RestMode = 'between-sets' | 'next-exercise' | null
type Feeling = 'facile' | 'normal' | 'dur' | 'crame'
type ExerciseDifficulty = 'facile' | 'normal' | 'dur'
type ActivityKind = 'walk' | 'run' | 'kettlebell' | 'active-rest'
type WakeLockStatus = 'idle' | 'active' | 'unsupported' | 'unavailable'
type SportProfileId =
  | 'marche-tranquille'
  | 'marche-rapide'
  | 'marche-sac'
  | 'footing-leger'
  | 'kettlebell-modere'
  | 'kettlebell-intense'
  | 'repos-actif'
type MealMode = 'weighed' | 'estimated' | 'natural'
type EstimatedMealType = 'salade' | 'assiette' | 'sandwich' | 'bowl' | 'tapas' | 'autre'
type ProteinSource = 'poulet' | 'oeufs' | 'crevettes' | 'thon' | 'jambon' | 'skyr' | 'whey' | 'autre'
type PortionSize = 'petite' | 'normale' | 'genereuse'

type Exercise = {
  id: string
  name: string
  muscles: string
  instruction: string
  fullInstruction: string
  mistakes: string[]
  tempo: string
  difficultyTips: Record<ExerciseDifficulty, string>
  sets: number
  reps: string
  videoUrl: string
}

type Workout = {
  type: WorkoutType
  name: string
  focus: string
  exercises: Exercise[]
}

type DayPlan = {
  dayName: string
  quest: string
  movement: string
  workoutType: WorkoutType | null
  activities: ActivityKind[]
  restLocked: boolean
  note: string
}

type WeeklyGoals = {
  walks: number
  runs: number
  kettlebell: number
}

type Settings = {
  restDuration: 60 | 75 | 90
  weeklyGoals: WeeklyGoals
  weightKg: number
  proteinGoalGrams: number
}

type SportCalories = {
  profileId: SportProfileId
  label: string
  type: ActivityKind
  met: number
  durationSeconds: number
  weightKg: number
  estimatedCalories: number
  calories: number
  manualCalories: boolean
}

type HistoryEntry = {
  id: string
  date: string
  workoutName: string
  quest: string
  activities?: ActivityKind[]
  sport?: SportCalories
  exercisesCompleted: number
  totalExercises: number
  durationSeconds: number
  feeling: Feeling
  comment: string
}

type MealEntry = {
  id: string
  date: string
  mode: MealMode
  label: string
  proteinGrams: number
  proteinMin?: number
  proteinMax?: number
  details?: string
}

type WakeLockSentinelLike = {
  release: () => Promise<void>
}

type NavigatorWithWakeLock = Navigator & {
  wakeLock?: {
    request: (type: 'screen') => Promise<WakeLockSentinelLike>
  }
}

const HISTORY_KEY = 'projet-ragnar-history-v1'
const SETTINGS_KEY = 'projet-ragnar-settings-v1'
const MEALS_KEY = 'projet-ragnar-meals-v1'
const DEFAULT_WEIGHT_KG = 83

const defaultSettings: Settings = {
  restDuration: 75,
  weeklyGoals: {
    walks: 3,
    runs: 2,
    kettlebell: 5,
  },
  weightKg: DEFAULT_WEIGHT_KG,
  proteinGoalGrams: Math.round(DEFAULT_WEIGHT_KG * 1.6),
}

const sportProfiles: Record<SportProfileId, { label: string; type: ActivityKind; met: number }> = {
  'marche-tranquille': { label: 'Marche tranquille', type: 'walk', met: 3.5 },
  'marche-rapide': { label: 'Marche rapide', type: 'walk', met: 5 },
  'marche-sac': { label: 'Marche avec sac', type: 'walk', met: 6 },
  'footing-leger': { label: 'Footing leger', type: 'run', met: 7 },
  'kettlebell-modere': { label: 'Kettlebell leger/modere', type: 'kettlebell', met: 5 },
  'kettlebell-intense': { label: 'Kettlebell intense', type: 'kettlebell', met: 8 },
  'repos-actif': { label: 'Repos actif', type: 'active-rest', met: 3.5 },
}

const weighedFoods = [
  { id: 'skyr', label: 'Skyr', proteinPer100g: 10 },
  { id: 'whey', label: 'Whey', proteinPer100g: 80 },
  { id: 'avoine', label: 'Flocons d avoine', proteinPer100g: 13 },
  { id: 'oeuf', label: 'Oeuf', proteinPerUnit: 6 },
  { id: 'poulet', label: 'Poulet', proteinPer100g: 23 },
  { id: 'crevettes', label: 'Crevettes', proteinPer100g: 20 },
  { id: 'riz-cuit', label: 'Riz cuit', proteinPer100g: 2.7 },
] as const

const proteinSourceRanges: Record<ProteinSource, { petite: [number, number]; normale: [number, number]; genereuse: [number, number] }> = {
  poulet: { petite: [18, 25], normale: [28, 38], genereuse: [40, 55] },
  oeufs: { petite: [6, 12], normale: [12, 18], genereuse: [18, 30] },
  crevettes: { petite: [14, 20], normale: [20, 30], genereuse: [30, 42] },
  thon: { petite: [16, 24], normale: [25, 35], genereuse: [36, 48] },
  jambon: { petite: [10, 16], normale: [16, 24], genereuse: [24, 34] },
  skyr: { petite: [10, 16], normale: [17, 25], genereuse: [25, 35] },
  whey: { petite: [18, 22], normale: [22, 28], genereuse: [30, 45] },
  autre: { petite: [8, 14], normale: [15, 25], genereuse: [25, 35] },
}

const mealTypeLabels: Record<EstimatedMealType, string> = {
  salade: 'Salade',
  assiette: 'Assiette classique',
  sandwich: 'Sandwich',
  bowl: 'Bowl',
  tapas: 'Tapas',
  autre: 'Autre',
}

const sourceLabels: Record<ProteinSource, string> = {
  poulet: 'Poulet',
  oeufs: 'Oeufs',
  crevettes: 'Crevettes',
  thon: 'Thon',
  jambon: 'Jambon',
  skyr: 'Skyr',
  whey: 'Whey',
  autre: 'Autre',
}

const portionLabels: Record<PortionSize, string> = {
  petite: 'Petite',
  normale: 'Normale',
  genereuse: 'Genereuse',
}

const workouts: Record<WorkoutType, Workout> = {
  A: {
    type: 'A',
    name: 'Kettlebell A',
    focus: 'Poussee',
    exercises: [
      {
        id: 'floor-press',
        name: 'Floor Press',
        muscles: 'Pectoraux, triceps, epaules',
        instruction: 'Allonge-toi au sol, gainage serre, pousse les kettlebells sans cambrer.',
        fullInstruction:
          'Place les kettlebells au sol de chaque cote du buste. Serre les abdos, garde les omoplates stables, puis pousse fort jusqu aux bras tendus sans perdre le contact du dos avec le tapis.',
        mistakes: [
          'Cambrer le bas du dos pour chercher plus de force.',
          'Laisser les coudes partir trop loin des cotes.',
          'Rebondir les bras au sol entre deux repetitions.',
        ],
        tempo: 'Poussee dynamique, descente lente 2-3 sec, pause courte au sol.',
        difficultyTips: {
          facile: 'Garde une seule kettlebell et alterne droite/gauche.',
          normal: 'Travaille avec les deux kettlebells et une amplitude propre.',
          dur: 'Ajoute une pause de 1 sec en bas sur chaque repetition.',
        },
        sets: 4,
        reps: '10 a 15 reps',
        videoUrl: '',
      },
      {
        id: 'developpe-militaire',
        name: 'Developpe militaire',
        muscles: 'Epaules, triceps, haut du dos',
        instruction: 'Debout, abdos verrouilles, pousse au-dessus de la tete sans casser les poignets.',
        fullInstruction:
          'Pars kettlebells au niveau des epaules, pieds ancres. Contracte les fessiers et les abdos, pousse au-dessus de la tete, puis redescends sous controle sans ecraser la nuque.',
        mistakes: [
          'Creuser le dos en fin de poussee.',
          'Hausser les epaules vers les oreilles.',
          'Descendre trop vite et perdre la trajectoire.',
        ],
        tempo: 'Poussee nette, descente lente 2-3 sec, respiration controlee.',
        difficultyTips: {
          facile: 'Presse une kettlebell a la fois, main libre sur le ventre.',
          normal: 'Presse les deux kettlebells avec un tronc fixe.',
          dur: 'Bloque 1 sec bras tendus avant chaque descente.',
        },
        sets: 4,
        reps: '10 reps',
        videoUrl: '',
      },
      {
        id: 'pompes',
        name: 'Pompes',
        muscles: 'Pectoraux, triceps, gainage',
        instruction: 'Corps aligne, descente controlee, garde une marge propre avant l echec.',
        fullInstruction:
          'Place les mains sous les epaules, corps gainé des talons a la tete. Descends en gardant les coudes orientes vers l arriere, puis repousse le sol sans casser la ligne du corps.',
        mistakes: [
          'Laisser les hanches tomber.',
          'Ouvrir les coudes a 90 degres.',
          'Reduire l amplitude quand la fatigue arrive.',
        ],
        tempo: 'Poussee dynamique, descente lente 2-3 sec.',
        difficultyTips: {
          facile: 'Fais les pompes mains surelevees sur une marche stable.',
          normal: 'Pompes classiques au sol.',
          dur: 'Ajoute une pause de 1 sec en bas.',
        },
        sets: 3,
        reps: 'Max propre',
        videoUrl: '',
      },
      {
        id: 'extension-triceps',
        name: 'Extension triceps',
        muscles: 'Triceps, epaules, gainage',
        instruction: 'Coudes fixes, mouvement lent, garde les epaules basses.',
        fullInstruction:
          'Tiens une kettlebell avec les deux mains. Garde les coudes proches de la tete, descends lentement derriere le crane, puis tends les bras sans bouger le buste.',
        mistakes: [
          'Ecarter les coudes a chaque repetition.',
          'Cambrer pour compenser.',
          'Aller trop vite sur la descente.',
        ],
        tempo: 'Extension dynamique, descente lente 2-3 sec.',
        difficultyTips: {
          facile: 'Reduis l amplitude si les epaules tirent.',
          normal: 'Amplitude complete, coudes fixes.',
          dur: 'Ajoute une pause en bas sans relacher la tension.',
        },
        sets: 3,
        reps: '15 reps',
        videoUrl: '',
      },
      {
        id: 'farmer-walk-a',
        name: 'Farmer Walk',
        muscles: 'Avant-bras, trapezes, gainage, jambes',
        instruction: 'Marche droit, epaules basses, respiration reguliere, poignee ferme.',
        fullInstruction:
          'Prends les kettlebells, verrouille la posture, regarde loin devant et marche sans balancer les charges. Cherche une respiration calme et une colonne haute.',
        mistakes: [
          'Se pencher vers l avant.',
          'Laisser les kettlebells taper les jambes.',
          'Retenir la respiration.',
        ],
        tempo: 'Pas reguliers, controle permanent, aucune precipitation.',
        difficultyTips: {
          facile: 'Marche 30-40 sec et complete la serie.',
          normal: 'Tiens les 60 sec propres.',
          dur: 'Marche plus lentement avec une posture stricte.',
        },
        sets: 3,
        reps: '60 secondes',
        videoUrl: '',
      },
    ],
  },
  B: {
    type: 'B',
    name: 'Kettlebell B',
    focus: 'Tirage',
    exercises: [
      {
        id: 'rowing-un-bras',
        name: 'Rowing un bras',
        muscles: 'Dos, grand dorsal, biceps',
        instruction: 'Dos plat, coude proche du corps, tire sans rotation du buste.',
        fullInstruction:
          'Pose une main sur la cuisse ou une marche stable, dos long. Tire la kettlebell vers la hanche, marque une courte contraction, puis redescends sans arrondir le dos.',
        mistakes: [
          'Tourner le buste pour aider le mouvement.',
          'Tirer vers l epaule au lieu de la hanche.',
          'Arrondir le bas du dos.',
        ],
        tempo: 'Tirage dynamique, descente lente 2-3 sec.',
        difficultyTips: {
          facile: 'Ralentis et reduis l amplitude si le dos bouge.',
          normal: '12 reps nettes par bras.',
          dur: 'Ajoute une pause de 1 sec en haut.',
        },
        sets: 4,
        reps: '12 reps par bras',
        videoUrl: '',
      },
      {
        id: 'halo',
        name: 'Halo',
        muscles: 'Epaules, haut du dos, mobilite',
        instruction: 'Mouvement lent autour de la tete, cotes basses, nuque longue.',
        fullInstruction:
          'Tiens la kettlebell proche du visage, fais-la passer lentement autour de la tete sans bouger le bassin. Le mouvement doit rester fluide et controle.',
        mistakes: [
          'Compresser la nuque.',
          'Cambrer en passant derriere la tete.',
          'Aller vite et perdre le controle.',
        ],
        tempo: 'Lent et fluide, aucune acceleration.',
        difficultyTips: {
          facile: 'Fais des demi-cercles devant toi.',
          normal: '10 tours par sens avec controle.',
          dur: 'Ralentis chaque passage derriere la tete.',
        },
        sets: 3,
        reps: '10 dans chaque sens',
        videoUrl: '',
      },
      {
        id: 'shrugs',
        name: 'Shrugs',
        muscles: 'Trapezes, avant-bras',
        instruction: 'Monte les epaules verticalement, marque une pause, redescends sans a-coup.',
        fullInstruction:
          'Tiens les kettlebells le long du corps. Monte les epaules vers le haut sans rouler vers l avant, marque une pause courte, puis redescends lentement.',
        mistakes: [
          'Rouler les epaules.',
          'Plier les coudes comme un curl.',
          'Faire des repetitions trop rapides.',
        ],
        tempo: 'Montee nette, pause en haut, descente lente 2-3 sec.',
        difficultyTips: {
          facile: 'Fais 12-15 reps strictes.',
          normal: '20 reps sans balancer.',
          dur: 'Tiens 2 sec en haut a chaque rep.',
        },
        sets: 4,
        reps: '20 reps',
        videoUrl: '',
      },
      {
        id: 'curl-biceps',
        name: 'Curl biceps',
        muscles: 'Biceps, avant-bras',
        instruction: 'Coudes pres du corps, montee controlee, descente lente.',
        fullInstruction:
          'Tiens les kettlebells sans casser les poignets. Monte en gardant les coudes fixes, serre les biceps en haut, puis redescends lentement.',
        mistakes: [
          'Balancer le buste.',
          'Avancer les coudes.',
          'Lacher la descente.',
        ],
        tempo: 'Montee controlee, descente lente 2-3 sec.',
        difficultyTips: {
          facile: 'Alterner bras droit et bras gauche.',
          normal: 'Deux bras ensemble, 15 reps propres.',
          dur: 'Pause de 1 sec au milieu de la descente.',
        },
        sets: 3,
        reps: '15 reps',
        videoUrl: '',
      },
      {
        id: 'farmer-walk-b',
        name: 'Farmer Walk',
        muscles: 'Avant-bras, trapezes, gainage, jambes',
        instruction: 'Posture haute, pas stables, garde les kettlebells immobiles.',
        fullInstruction:
          'Prends les kettlebells, rentre legerement les cotes, verrouille la posture et avance avec des pas calmes. La qualite prime sur la vitesse.',
        mistakes: [
          'Marcher trop vite.',
          'Laisser les epaules monter.',
          'Perdre le gainage au fil des secondes.',
        ],
        tempo: 'Pas reguliers, controle permanent, respiration stable.',
        difficultyTips: {
          facile: 'Coupe en 2 blocs de 30 sec.',
          normal: '60 sec continues.',
          dur: 'Ajoute un demi-tour lent sans perdre la posture.',
        },
        sets: 3,
        reps: '60 secondes',
        videoUrl: '',
      },
    ],
  },
}

const dayPlans: Record<number, DayPlan> = {
  0: {
    dayName: 'Dimanche',
    quest: 'Repos complet',
    movement: 'Aucune seance. Recuperation prioritaire.',
    workoutType: null,
    activities: [],
    restLocked: true,
    note: 'Repos obligatoire pour laisser le corps reconstruire.',
  },
  1: {
    dayName: 'Lundi',
    quest: 'Marche avec sac + Kettlebell A',
    movement: 'Marche matinale avec sac a dos, puis seance poussee.',
    workoutType: 'A',
    activities: ['walk', 'kettlebell'],
    restLocked: false,
    note: 'Garde la marche reguliere et la seance propre.',
  },
  2: {
    dayName: 'Mardi',
    quest: 'Footing leger + Kettlebell B',
    movement: 'Footing facile, puis seance tirage.',
    workoutType: 'B',
    activities: ['run', 'kettlebell'],
    restLocked: false,
    note: 'Rythme conversationnel, aucune course en force.',
  },
  3: {
    dayName: 'Mercredi',
    quest: 'Marche avec sac + Kettlebell A',
    movement: 'Marche matinale avec sac a dos, puis seance poussee.',
    workoutType: 'A',
    activities: ['walk', 'kettlebell'],
    restLocked: false,
    note: 'Meme structure que lundi, execution stricte.',
  },
  4: {
    dayName: 'Jeudi',
    quest: 'Footing leger + Kettlebell B',
    movement: 'Footing facile, puis seance tirage.',
    workoutType: 'B',
    activities: ['run', 'kettlebell'],
    restLocked: false,
    note: 'Reste leger : l objectif est la regularite.',
  },
  5: {
    dayName: 'Vendredi',
    quest: 'Marche calme + Kettlebell A',
    movement: 'Marche calme, puis derniere seance poussee de la semaine.',
    workoutType: 'A',
    activities: ['walk', 'kettlebell'],
    restLocked: false,
    note: 'Finir propre, sans chercher a battre un record.',
  },
  6: {
    dayName: 'Samedi',
    quest: 'Repos famille',
    movement: 'Aucune seance kettlebell.',
    workoutType: null,
    activities: [],
    restLocked: true,
    note: 'Repos obligatoire samedi et dimanche.',
  },
}

const feelings: { value: Feeling; label: string }[] = [
  { value: 'facile', label: 'Facile' },
  { value: 'normal', label: 'Normal' },
  { value: 'dur', label: 'Dur' },
  { value: 'crame', label: 'Crame' },
]

const exerciseDifficulties: { value: ExerciseDifficulty; label: string }[] = [
  { value: 'facile', label: 'Facile' },
  { value: 'normal', label: 'Normal' },
  { value: 'dur', label: 'Dur' },
]

function formatDuration(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

function dateKey(date: Date) {
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  return `${year}-${month}-${day}`
}

function startOfWeek(date: Date) {
  const result = new Date(date)
  const day = result.getDay()
  const diff = day === 0 ? -6 : 1 - day
  result.setDate(result.getDate() + diff)
  result.setHours(0, 0, 0, 0)
  return result
}

function readHistory(): HistoryEntry[] {
  try {
    const stored = window.localStorage.getItem(HISTORY_KEY)
    if (!stored) return []
    const parsed = JSON.parse(stored)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeHistory(entries: HistoryEntry[]) {
  window.localStorage.setItem(HISTORY_KEY, JSON.stringify(entries))
}

function readMeals(): MealEntry[] {
  try {
    const stored = window.localStorage.getItem(MEALS_KEY)
    if (!stored) return []
    const parsed = JSON.parse(stored)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeMeals(entries: MealEntry[]) {
  window.localStorage.setItem(MEALS_KEY, JSON.stringify(entries))
}

function readSettings(): Settings {
  try {
    const stored = window.localStorage.getItem(SETTINGS_KEY)
    if (!stored) return defaultSettings
    const parsed = JSON.parse(stored) as Partial<Settings>
    const weightKg = sanitizeWeight(parsed.weightKg, defaultSettings.weightKg)

    return {
      restDuration: parsed.restDuration === 60 || parsed.restDuration === 75 || parsed.restDuration === 90
        ? parsed.restDuration
        : defaultSettings.restDuration,
      weeklyGoals: {
        walks: sanitizeGoal(parsed.weeklyGoals?.walks, defaultSettings.weeklyGoals.walks),
        runs: sanitizeGoal(parsed.weeklyGoals?.runs, defaultSettings.weeklyGoals.runs),
        kettlebell: sanitizeGoal(parsed.weeklyGoals?.kettlebell, defaultSettings.weeklyGoals.kettlebell),
      },
      weightKg,
      proteinGoalGrams: sanitizeProteinGoal(parsed.proteinGoalGrams, Math.round(weightKg * 1.6)),
    }
  } catch {
    return defaultSettings
  }
}

function writeSettings(settings: Settings) {
  window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
}

function sanitizeGoal(value: unknown, fallback: number) {
  const parsed = Number(value)
  if (!Number.isFinite(parsed)) return fallback
  return Math.max(0, Math.min(14, Math.round(parsed)))
}

function sanitizeWeight(value: unknown, fallback: number) {
  const parsed = Number(value)
  if (!Number.isFinite(parsed)) return fallback
  return Math.max(35, Math.min(180, Math.round(parsed * 10) / 10))
}

function sanitizeProteinGoal(value: unknown, fallback: number) {
  const parsed = Number(value)
  if (!Number.isFinite(parsed)) return fallback
  return Math.max(40, Math.min(280, Math.round(parsed)))
}

function caloriesFromMet(met: number, weightKg: number, durationSeconds: number) {
  return Math.round(met * weightKg * (durationSeconds / 3600))
}

function buildSportCalories(profileId: SportProfileId, weightKg: number, durationSeconds: number, manualValue?: number): SportCalories {
  const profile = sportProfiles[profileId]
  const estimatedCalories = caloriesFromMet(profile.met, weightKg, durationSeconds)
  const hasManualValue = Number.isFinite(manualValue) && manualValue !== undefined
  return {
    profileId,
    label: profile.label,
    type: profile.type,
    met: profile.met,
    durationSeconds,
    weightKg,
    estimatedCalories,
    calories: hasManualValue ? Math.max(0, Math.round(manualValue)) : estimatedCalories,
    manualCalories: hasManualValue,
  }
}

function defaultSportProfileForPlan(plan: DayPlan): SportProfileId {
  if (plan.activities.includes('run')) return 'footing-leger'
  if (plan.activities.includes('walk')) return 'marche-sac'
  return 'kettlebell-modere'
}

function getDayPlan(date: Date) {
  return dayPlans[date.getDay()]
}

function inferActivities(entry: HistoryEntry): ActivityKind[] {
  if (entry.sport?.type) return [entry.sport.type]
  if (entry.activities?.length) return entry.activities

  const text = `${entry.quest} ${entry.workoutName}`.toLowerCase()
  const activities: ActivityKind[] = []
  if (text.includes('marche')) activities.push('walk')
  if (text.includes('footing')) activities.push('run')
  if (text.includes('kettlebell')) activities.push('kettlebell')
  return activities
}

function getWeeklyEntries(entries: HistoryEntry[], date: Date) {
  const weekStart = startOfWeek(date)
  const nextWeek = new Date(weekStart)
  nextWeek.setDate(weekStart.getDate() + 7)

  return entries.filter((entry) => {
    const entryDate = new Date(entry.date)
    return entryDate >= weekStart && entryDate < nextWeek
  })
}

function countActivities(entries: HistoryEntry[]) {
  return entries.reduce(
    (totals, entry) => {
      inferActivities(entry).forEach((activity) => {
        totals[activity] += 1
      })
      return totals
    },
    { walk: 0, run: 0, kettlebell: 0, 'active-rest': 0 } satisfies Record<ActivityKind, number>,
  )
}

function getTodayMeals(entries: MealEntry[], date: Date) {
  const todayKey = dateKey(date)
  return entries.filter((entry) => dateKey(new Date(entry.date)) === todayKey)
}

function getTodayCalories(entries: HistoryEntry[], date: Date) {
  const todayKey = dateKey(date)
  return entries
    .filter((entry) => dateKey(new Date(entry.date)) === todayKey)
    .reduce((sum, entry) => sum + (entry.sport?.calories ?? 0), 0)
}

function getMealTotal(entries: MealEntry[]) {
  return entries.reduce((sum, entry) => sum + entry.proteinGrams, 0)
}

function midpoint(range: [number, number]) {
  return Math.round((range[0] + range[1]) / 2)
}

function estimateMealProtein(mealType: EstimatedMealType, source: ProteinSource, portion: PortionSize) {
  const baseRange = proteinSourceRanges[source][portion]
  const mealAdjustment: Record<EstimatedMealType, number> = {
    salade: 0,
    assiette: 4,
    sandwich: -3,
    bowl: 3,
    tapas: -4,
    autre: 0,
  }
  const adjustment = mealAdjustment[mealType]
  const min = Math.max(0, baseRange[0] + adjustment)
  const max = Math.max(min + 4, baseRange[1] + adjustment)
  return { min, max, value: midpoint([min, max]) }
}

function normalizeMealText(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

function estimateNaturalMeal(description: string) {
  const text = normalizeMealText(description)
  const detected: string[] = []
  let range: [number, number] = [8, 15]

  const proteinRules: { keywords: string[]; label: string; range: [number, number] }[] = [
    { keywords: ['crevette', 'crevettes'], label: 'crevettes : portion normale estimee', range: [22, 30] },
    { keywords: ['poulet', 'dinde'], label: 'poulet : portion normale estimee', range: [28, 38] },
    { keywords: ['thon'], label: 'thon : portion normale estimee', range: [25, 35] },
    { keywords: ['oeuf', 'oeufs', 'omelette'], label: 'oeufs : portion normale estimee', range: [12, 18] },
    { keywords: ['skyr'], label: 'skyr : portion normale estimee', range: [17, 25] },
    { keywords: ['whey', 'proteine'], label: 'whey : dose normale estimee', range: [22, 28] },
    { keywords: ['jambon'], label: 'jambon : portion normale estimee', range: [16, 24] },
  ]

  const mainProtein = proteinRules.find((rule) => rule.keywords.some((keyword) => text.includes(keyword)))
  if (mainProtein) {
    detected.push(mainProtein.label)
    range = mainProtein.range
  }

  const sideRules: { keywords: string[]; label: string; protein: number }[] = [
    { keywords: ['riz'], label: 'riz : accompagnement', protein: 3 },
    { keywords: ['avoine', 'flocon'], label: 'flocons d avoine : accompagnement proteine', protein: 5 },
    { keywords: ['legume', 'legumes', 'concombre', 'salade', 'ananas'], label: 'legumes/fruits : faible proteine', protein: 0 },
  ]

  sideRules.forEach((rule) => {
    if (rule.keywords.some((keyword) => text.includes(keyword))) {
      detected.push(rule.label)
      range = [range[0] + rule.protein, range[1] + rule.protein]
    }
  })

  if (detected.length === 0) {
    detected.push('aucune source principale detectee : portion normale prudente')
  }

  return {
    detected,
    min: range[0],
    max: range[1],
    value: midpoint(range),
  }
}

function computeProgramStreak(entries: HistoryEntry[], fromDate: Date) {
  const completedDays = new Set(entries.map((entry) => dateKey(new Date(entry.date))))
  const cursor = new Date(fromDate)
  let streak = 0

  for (let index = 0; index < 30; index += 1) {
    const plan = getDayPlan(cursor)

    if (!plan.restLocked) {
      if (!completedDays.has(dateKey(cursor))) break
      streak += 1
    }

    cursor.setDate(cursor.getDate() - 1)
  }

  return streak
}

function vibrateRestEnd() {
  if ('vibrate' in navigator) {
    navigator.vibrate([140, 80, 140])
  }
}

export function RagnarApp() {
  const [screen, setScreen] = useState<Screen>('home')
  const [today, setToday] = useState(() => new Date())
  const [settings, setSettings] = useState<Settings>(defaultSettings)
  const [activeWorkoutType, setActiveWorkoutType] = useState<WorkoutType | null>(null)
  const [exerciseIndex, setExerciseIndex] = useState(0)
  const [completedSets, setCompletedSets] = useState<Record<string, number>>({})
  const [completedExerciseIds, setCompletedExerciseIds] = useState<string[]>([])
  const [restDuration, setRestDuration] = useState<60 | 75 | 90>(defaultSettings.restDuration)
  const [restRemaining, setRestRemaining] = useState(0)
  const [restMode, setRestMode] = useState<RestMode>(null)
  const [startedAt, setStartedAt] = useState<number | null>(null)
  const [finishedAt, setFinishedAt] = useState<number | null>(null)
  const [timerNow, setTimerNow] = useState(() => Date.now())
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [meals, setMeals] = useState<MealEntry[]>([])
  const [feeling, setFeeling] = useState<Feeling>('normal')
  const [comment, setComment] = useState('')
  const [savedEntryId, setSavedEntryId] = useState<string | null>(null)
  const [exerciseDifficulty, setExerciseDifficulty] = useState<ExerciseDifficulty>('normal')
  const [wakeLockStatus, setWakeLockStatus] = useState<WakeLockStatus>('idle')
  const [sportProfileId, setSportProfileId] = useState<SportProfileId>('kettlebell-modere')
  const [manualCalories, setManualCalories] = useState('')

  const plan = useMemo(() => getDayPlan(today), [today])
  const activeWorkout = activeWorkoutType ? workouts[activeWorkoutType] : null
  const currentExercise = activeWorkout?.exercises[exerciseIndex] ?? null
  const weeklyEntries = useMemo(() => getWeeklyEntries(history, today), [history, today])
  const weeklyCounts = useMemo(() => countActivities(weeklyEntries), [weeklyEntries])
  const streak = useMemo(() => computeProgramStreak(history, today), [history, today])
  const todayMeals = useMemo(() => getTodayMeals(meals, today), [meals, today])
  const proteinToday = useMemo(() => getMealTotal(todayMeals), [todayMeals])
  const sportCaloriesToday = useMemo(() => getTodayCalories(history, today), [history, today])
  const totalSets = activeWorkout?.exercises.reduce((sum, exercise) => sum + exercise.sets, 0) ?? 0
  const doneSets = activeWorkout?.exercises.reduce(
    (sum, exercise) => sum + Math.min(completedSets[exercise.id] ?? 0, exercise.sets),
    0,
  ) ?? 0
  const sessionProgress = totalSets > 0 ? Math.round((doneSets / totalSets) * 100) : 0
  const durationSeconds = startedAt
    ? Math.max(0, Math.round(((finishedAt ?? timerNow) - startedAt) / 1000))
    : 0

  useEffect(() => {
    const storedSettings = readSettings()
    setToday(new Date())
    setHistory(readHistory())
    setMeals(readMeals())
    setSettings(storedSettings)
    setRestDuration(storedSettings.restDuration)
  }, [])

  useEffect(() => {
    if (screen !== 'session' || !startedAt) return

    const timer = window.setInterval(() => setTimerNow(Date.now()), 1000)
    return () => window.clearInterval(timer)
  }, [screen, startedAt])

  useEffect(() => {
    if (screen !== 'session' || restRemaining <= 0) return

    const timer = window.setInterval(() => {
      setRestRemaining((current) => Math.max(0, current - 1))
    }, 1000)

    return () => window.clearInterval(timer)
  }, [restRemaining, screen])

  useEffect(() => {
    if (screen !== 'session') return

    let released = false
    let sentinel: WakeLockSentinelLike | null = null

    async function requestWakeLock() {
      const wakeLock = (navigator as NavigatorWithWakeLock).wakeLock
      if (!wakeLock) {
        setWakeLockStatus('unsupported')
        return
      }

      try {
        sentinel = await wakeLock.request('screen')
        if (!released) setWakeLockStatus('active')
      } catch {
        if (!released) setWakeLockStatus('unavailable')
      }
    }

    void requestWakeLock()

    return () => {
      released = true
      setWakeLockStatus('idle')
      void sentinel?.release().catch(() => undefined)
    }
  }, [screen, activeWorkoutType])

  useEffect(() => {
    if (screen !== 'session' || restRemaining !== 0 || !restMode || !activeWorkout) return

    vibrateRestEnd()

    if (restMode === 'next-exercise') {
      setExerciseIndex((current) => Math.min(current + 1, activeWorkout.exercises.length - 1))
    }

    setRestMode(null)
  }, [activeWorkout, restMode, restRemaining, screen])

  function resetSession() {
    setActiveWorkoutType(null)
    setExerciseIndex(0)
    setCompletedSets({})
    setCompletedExerciseIds([])
    setRestRemaining(0)
    setRestMode(null)
    setStartedAt(null)
    setFinishedAt(null)
    setTimerNow(Date.now())
    setFeeling('normal')
    setComment('')
    setSavedEntryId(null)
    setExerciseDifficulty('normal')
    setRestDuration(settings.restDuration)
    setSportProfileId(defaultSportProfileForPlan(plan))
    setManualCalories('')
  }

  function startWorkout(type: WorkoutType) {
    resetSession()
    setActiveWorkoutType(type)
    setRestDuration(settings.restDuration)
    setSportProfileId(defaultSportProfileForPlan(plan))
    setStartedAt(Date.now())
    setTimerNow(Date.now())
    setScreen('session')
  }

  function finishWorkout() {
    setFinishedAt(Date.now())
    setRestRemaining(0)
    setRestMode(null)
    setScreen('summary')
  }

  function startRest(mode: Exclude<RestMode, null>) {
    setRestMode(mode)
    setRestRemaining(restDuration)
  }

  function finishCurrentSet() {
    if (!activeWorkout || !currentExercise || restRemaining > 0) return

    const currentDone = completedSets[currentExercise.id] ?? 0
    const nextDone = Math.min(currentDone + 1, currentExercise.sets)

    setCompletedSets((current) => ({
      ...current,
      [currentExercise.id]: nextDone,
    }))

    if (nextDone < currentExercise.sets) {
      startRest('between-sets')
      return
    }

    setCompletedExerciseIds((current) =>
      current.includes(currentExercise.id) ? current : [...current, currentExercise.id],
    )

    if (exerciseIndex >= activeWorkout.exercises.length - 1) {
      finishWorkout()
      return
    }

    startRest('next-exercise')
  }

  function skipExercise() {
    if (!activeWorkout) return

    setRestRemaining(0)
    setRestMode(null)

    if (exerciseIndex >= activeWorkout.exercises.length - 1) {
      finishWorkout()
      return
    }

    setExerciseIndex((current) => current + 1)
    setExerciseDifficulty('normal')
  }

  function skipRest() {
    if (!activeWorkout || !restMode) return

    if (restMode === 'next-exercise') {
      setExerciseIndex((current) => Math.min(current + 1, activeWorkout.exercises.length - 1))
      setExerciseDifficulty('normal')
    }

    setRestRemaining(0)
    setRestMode(null)
  }

  function saveSession() {
    if (!activeWorkout || !startedAt || savedEntryId) return
    const parsedManualCalories = manualCalories.trim() ? Number(manualCalories) : undefined
    const sport = buildSportCalories(sportProfileId, settings.weightKg, durationSeconds, parsedManualCalories)

    const entry: HistoryEntry = {
      id: `ragnar-${Date.now()}`,
      date: new Date().toISOString(),
      workoutName: `${activeWorkout.name} - ${activeWorkout.focus}`,
      quest: plan.quest,
      activities: [sport.type],
      sport,
      exercisesCompleted: completedExerciseIds.length,
      totalExercises: activeWorkout.exercises.length,
      durationSeconds,
      feeling,
      comment: comment.trim(),
    }

    const nextHistory = [entry, ...history].slice(0, 60)
    writeHistory(nextHistory)
    setHistory(nextHistory)
    setSavedEntryId(entry.id)
  }

  function addMeal(entry: Omit<MealEntry, 'id' | 'date'>) {
    const nextEntry: MealEntry = {
      id: `meal-${Date.now()}`,
      date: new Date().toISOString(),
      ...entry,
    }
    const nextMeals = [nextEntry, ...meals].slice(0, 120)
    writeMeals(nextMeals)
    setMeals(nextMeals)
  }

  function updateSettings(nextSettings: Settings) {
    setSettings(nextSettings)
    writeSettings(nextSettings)
    if (!activeWorkoutType) setRestDuration(nextSettings.restDuration)
  }

  function goHomeFromSummary() {
    resetSession()
    setScreen('home')
  }

  return (
    <main className={`${styles.page} ${screen === 'session' ? styles.sessionPage : ''}`}>
      <div className={styles.shell}>
        <header className={styles.header}>
          <div>
            <p className={styles.kicker}>LYSMA Personal</p>
            <h1>Projet Ragnar</h1>
          </div>
          <p className={styles.dateLine}>
            {plan.dayName} - {today.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long' })}
          </p>
        </header>

        <nav className={styles.tabs} aria-label="Navigation Projet Ragnar">
          <button
            type="button"
            className={screen === 'home' ? styles.activeTab : undefined}
            onClick={() => setScreen('home')}
          >
            Accueil
          </button>
          <button
            type="button"
            className={screen === 'session' ? styles.activeTab : undefined}
            disabled={!activeWorkoutType && !plan.workoutType}
            onClick={() => {
              if (activeWorkoutType) setScreen('session')
              else if (plan.workoutType) startWorkout(plan.workoutType)
            }}
          >
            Seance
          </button>
          <button
            type="button"
            className={screen === 'history' ? styles.activeTab : undefined}
            onClick={() => setScreen('history')}
          >
            Historique
          </button>
          <button
            type="button"
            className={screen === 'nutrition' ? styles.activeTab : undefined}
            onClick={() => setScreen('nutrition')}
          >
            Nutrition
          </button>
          <button
            type="button"
            className={screen === 'settings' ? styles.activeTab : undefined}
            onClick={() => setScreen('settings')}
          >
            Reglages
          </button>
        </nav>

        {screen === 'home' ? (
          <HomeView
            plan={plan}
            history={history}
            activeWorkout={activeWorkout}
            settings={settings}
            weeklyCounts={weeklyCounts}
            streak={streak}
            sportCaloriesToday={sportCaloriesToday}
            proteinToday={proteinToday}
            onStart={() => plan.workoutType && startWorkout(plan.workoutType)}
            onResume={() => setScreen('session')}
            onHistory={() => setScreen('history')}
            onSettings={() => setScreen('settings')}
            onNutrition={() => setScreen('nutrition')}
          />
        ) : null}

        {screen === 'session' && activeWorkout && currentExercise ? (
          <SessionView
            workout={activeWorkout}
            exercise={currentExercise}
            exerciseIndex={exerciseIndex}
            completedSets={completedSets[currentExercise.id] ?? 0}
            completedExerciseCount={completedExerciseIds.length}
            restDuration={restDuration}
            restRemaining={restRemaining}
            restMode={restMode}
            durationSeconds={durationSeconds}
            progress={sessionProgress}
            difficulty={exerciseDifficulty}
            wakeLockStatus={wakeLockStatus}
            onRestDurationChange={setRestDuration}
            onDifficultyChange={setExerciseDifficulty}
            onFinishSet={finishCurrentSet}
            onSkipExercise={skipExercise}
            onSkipRest={skipRest}
          />
        ) : null}

        {screen === 'summary' && activeWorkout ? (
          <SummaryView
            workout={activeWorkout}
            durationSeconds={durationSeconds}
            completedExerciseCount={completedExerciseIds.length}
            feeling={feeling}
            comment={comment}
            settings={settings}
            sportProfileId={sportProfileId}
            manualCalories={manualCalories}
            saved={Boolean(savedEntryId)}
            onFeelingChange={setFeeling}
            onCommentChange={setComment}
            onSportProfileChange={setSportProfileId}
            onManualCaloriesChange={setManualCalories}
            onSave={saveSession}
            onHome={goHomeFromSummary}
          />
        ) : null}

        {screen === 'history' ? (
          <HistoryView
            entries={history}
            weeklyEntries={weeklyEntries}
            weeklyCounts={weeklyCounts}
            settings={settings}
            streak={streak}
            today={today}
          />
        ) : null}

        {screen === 'nutrition' ? (
          <NutritionView
            settings={settings}
            meals={meals}
            today={today}
            onAddMeal={addMeal}
          />
        ) : null}

        {screen === 'settings' ? (
          <SettingsView settings={settings} onSettingsChange={updateSettings} />
        ) : null}
      </div>
    </main>
  )
}

function HomeView({
  plan,
  history,
  activeWorkout,
  settings,
  weeklyCounts,
  streak,
  sportCaloriesToday,
  proteinToday,
  onStart,
  onResume,
  onHistory,
  onSettings,
  onNutrition,
}: {
  plan: DayPlan
  history: HistoryEntry[]
  activeWorkout: Workout | null
  settings: Settings
  weeklyCounts: Record<ActivityKind, number>
  streak: number
  sportCaloriesToday: number
  proteinToday: number
  onStart: () => void
  onResume: () => void
  onHistory: () => void
  onSettings: () => void
  onNutrition: () => void
}) {
  const plannedWorkout = plan.workoutType ? workouts[plan.workoutType] : null
  const latest = history[0]
  const proteinRemaining = Math.max(0, settings.proteinGoalGrams - proteinToday)

  return (
    <section className={styles.homeGrid}>
      <article className={styles.heroCard}>
        <span className={styles.statusPill}>{plan.workoutType ? 'Quete du jour' : 'Repos verrouille'}</span>
        <h2>{plan.quest}</h2>
        <p>{plan.movement}</p>
        <p className={styles.note}>{plan.note}</p>

        {activeWorkout ? (
          <button type="button" className={styles.primaryButton} onClick={onResume}>
            Reprendre la seance
          </button>
        ) : plan.workoutType ? (
          <button type="button" className={styles.primaryButton} onClick={onStart}>
            Demarrer la seance
          </button>
        ) : (
          <button type="button" className={styles.primaryButton} disabled>
            Repos obligatoire
          </button>
        )}
      </article>

      <article className={styles.panel}>
        <div className={styles.panelHeader}>
          <div>
            <span className={styles.smallLabel}>Tableau du jour</span>
            <h2>Calories & proteines</h2>
          </div>
          <button type="button" className={styles.textButton} onClick={onNutrition}>
            Nutrition
          </button>
        </div>
        <div className={styles.todayGrid}>
          <div>
            <span>Calories sport</span>
            <strong>{sportCaloriesToday} kcal</strong>
          </div>
          <div>
            <span>Proteines</span>
            <strong>{proteinToday} g</strong>
          </div>
          <div>
            <span>Objectif</span>
            <strong>{settings.proteinGoalGrams} g</strong>
          </div>
          <div>
            <span>Reste</span>
            <strong>{proteinRemaining} g</strong>
          </div>
        </div>
      </article>

      <article className={styles.panel}>
        <div className={styles.panelHeader}>
          <div>
            <span className={styles.smallLabel}>Reglages actifs</span>
            <h2>Repos {settings.restDuration}s</h2>
          </div>
          <button type="button" className={styles.textButton} onClick={onSettings}>
            Modifier
          </button>
        </div>
        <div className={styles.goalGrid}>
          <GoalPill label="Marches" value={weeklyCounts.walk} target={settings.weeklyGoals.walks} />
          <GoalPill label="Footings" value={weeklyCounts.run} target={settings.weeklyGoals.runs} />
          <GoalPill label="Kettlebell" value={weeklyCounts.kettlebell} target={settings.weeklyGoals.kettlebell} />
        </div>
      </article>

      <article className={styles.panel}>
        <h2>Materiel</h2>
        <div className={styles.equipmentGrid}>
          <span>2 kettlebells de 5 kg</span>
          <span>1 tapis</span>
          <span>Marches avec sac a dos</span>
          <span>Repos samedi et dimanche</span>
        </div>
      </article>

      {plannedWorkout ? (
        <article className={styles.panel}>
          <div className={styles.panelHeader}>
            <div>
              <span className={styles.smallLabel}>Seance prevue</span>
              <h2>{plannedWorkout.name} - {plannedWorkout.focus}</h2>
            </div>
            <strong>{plannedWorkout.exercises.length} exercices</strong>
          </div>
          <ol className={styles.exercisePreview}>
            {plannedWorkout.exercises.map((exercise) => (
              <li key={exercise.id}>
                <span>{exercise.name}</span>
                <small>{exercise.sets} series - {exercise.reps}</small>
              </li>
            ))}
          </ol>
        </article>
      ) : null}

      <article className={styles.panel}>
        <div className={styles.panelHeader}>
          <div>
            <span className={styles.smallLabel}>Streak {streak} jour{streak > 1 ? 's' : ''}</span>
            <h2>Historique local</h2>
          </div>
          <button type="button" className={styles.textButton} onClick={onHistory}>
            Voir
          </button>
        </div>
        {latest ? (
          <p className={styles.historySummary}>
            {latest.workoutName} - {formatDuration(latest.durationSeconds)} - {latest.exercisesCompleted}/{latest.totalExercises} exercices
          </p>
        ) : (
          <p className={styles.muted}>Aucune seance enregistree pour l instant.</p>
        )}
      </article>
    </section>
  )
}

function SessionView({
  workout,
  exercise,
  exerciseIndex,
  completedSets,
  completedExerciseCount,
  restDuration,
  restRemaining,
  restMode,
  durationSeconds,
  progress,
  difficulty,
  wakeLockStatus,
  onRestDurationChange,
  onDifficultyChange,
  onFinishSet,
  onSkipExercise,
  onSkipRest,
}: {
  workout: Workout
  exercise: Exercise
  exerciseIndex: number
  completedSets: number
  completedExerciseCount: number
  restDuration: 60 | 75 | 90
  restRemaining: number
  restMode: RestMode
  durationSeconds: number
  progress: number
  difficulty: ExerciseDifficulty
  wakeLockStatus: WakeLockStatus
  onRestDurationChange: (value: 60 | 75 | 90) => void
  onDifficultyChange: (value: ExerciseDifficulty) => void
  onFinishSet: () => void
  onSkipExercise: () => void
  onSkipRest: () => void
}) {
  const isResting = restRemaining > 0
  const currentSet = Math.min(completedSets + 1, exercise.sets)
  const wakeLabel = {
    idle: 'Veille standard',
    active: 'Ecran maintenu actif',
    unsupported: 'Anti-veille non supporte',
    unavailable: 'Anti-veille indisponible',
  }[wakeLockStatus]

  return (
    <section className={styles.session}>
      <div className={styles.sessionTop}>
        <div>
          <span className={styles.smallLabel}>{workout.name} - {workout.focus}</span>
          <h2>Exercice {exerciseIndex + 1}/{workout.exercises.length}</h2>
        </div>
        <div className={styles.timerBadge}>
          <span>Duree</span>
          <strong>{formatDuration(durationSeconds)}</strong>
        </div>
      </div>

      <div className={styles.progressWrap} aria-label={`Progression ${progress}%`}>
        <span style={{ width: `${progress}%` }} />
      </div>

      <article className={styles.exerciseCard}>
        <div className={styles.exerciseHeader}>
          <div>
            <span className={styles.statusPill}>
              {completedExerciseCount}/{workout.exercises.length} termines
            </span>
            <h2>{exercise.name}</h2>
          </div>
          <div className={styles.setCounter}>
            <span>Serie</span>
            <strong>{Math.min(completedSets, exercise.sets)}/{exercise.sets}</strong>
          </div>
        </div>

        <div className={styles.exerciseMeta}>
          <div>
            <span>Muscles</span>
            <strong>{exercise.muscles}</strong>
          </div>
          <div>
            <span>Objectif</span>
            <strong>{exercise.reps}</strong>
          </div>
        </div>

        <div className={styles.restPanel} data-active={isResting || undefined}>
          <span>{isResting ? 'Repos automatique' : 'Chrono de repos'}</span>
          <strong>{formatDuration(isResting ? restRemaining : restDuration)}</strong>
          <small>
            {isResting && restMode === 'next-exercise'
              ? 'Prochain exercice apres vibration.'
              : isResting
                ? `Reprise sur la serie ${currentSet}.`
                : 'Demarre apres Serie terminee.'}
          </small>
        </div>

        <div className={styles.sessionActions}>
          <button
            type="button"
            className={`${styles.primaryButton} ${styles.finishButton}`}
            onClick={onFinishSet}
            disabled={isResting || completedSets >= exercise.sets}
          >
            Serie terminee
          </button>
          {isResting ? (
            <button type="button" className={styles.secondaryButton} onClick={onSkipRest}>
              Passer le repos
            </button>
          ) : (
            <button type="button" className={styles.secondaryButton} onClick={onSkipExercise}>
              Passer
            </button>
          )}
        </div>

        <div className={styles.compactTools}>
          <div className={styles.restChoices} aria-label="Duree du repos">
            {[60, 75, 90].map((seconds) => (
              <button
                key={seconds}
                type="button"
                className={restDuration === seconds ? styles.selectedChoice : undefined}
                onClick={() => onRestDurationChange(seconds as 60 | 75 | 90)}
                disabled={isResting}
              >
                {seconds}s
              </button>
            ))}
          </div>
          <span className={styles.wakeStatus}>{wakeLabel}</span>
        </div>

        <ExerciseDetail
          exercise={exercise}
          difficulty={difficulty}
          onDifficultyChange={onDifficultyChange}
        />
      </article>
    </section>
  )
}

function ExerciseDetail({
  exercise,
  difficulty,
  onDifficultyChange,
}: {
  exercise: Exercise
  difficulty: ExerciseDifficulty
  onDifficultyChange: (value: ExerciseDifficulty) => void
}) {
  return (
    <details className={styles.exerciseDetail}>
      <summary>Fiche exercice detaillee</summary>
      <div className={styles.detailGrid}>
        <section>
          <span className={styles.smallLabel}>Consigne complete</span>
          <p>{exercise.fullInstruction}</p>
        </section>
        <section>
          <span className={styles.smallLabel}>Tempo conseille</span>
          <p>{exercise.tempo}</p>
        </section>
        <section>
          <span className={styles.smallLabel}>Erreurs a eviter</span>
          <ul>
            {exercise.mistakes.map((mistake) => (
              <li key={mistake}>{mistake}</li>
            ))}
          </ul>
        </section>
        <section>
          <span className={styles.smallLabel}>Option</span>
          <div className={styles.difficultyChoices}>
            {exerciseDifficulties.map((item) => (
              <button
                key={item.value}
                type="button"
                className={difficulty === item.value ? styles.selectedChoice : undefined}
                onClick={() => onDifficultyChange(item.value)}
              >
                {item.label}
              </button>
            ))}
          </div>
          <p className={styles.optionText}>{exercise.difficultyTips[difficulty]}</p>
        </section>
      </div>
    </details>
  )
}

function SummaryView({
  workout,
  durationSeconds,
  completedExerciseCount,
  feeling,
  comment,
  settings,
  sportProfileId,
  manualCalories,
  saved,
  onFeelingChange,
  onCommentChange,
  onSportProfileChange,
  onManualCaloriesChange,
  onSave,
  onHome,
}: {
  workout: Workout
  durationSeconds: number
  completedExerciseCount: number
  feeling: Feeling
  comment: string
  settings: Settings
  sportProfileId: SportProfileId
  manualCalories: string
  saved: boolean
  onFeelingChange: (value: Feeling) => void
  onCommentChange: (value: string) => void
  onSportProfileChange: (value: SportProfileId) => void
  onManualCaloriesChange: (value: string) => void
  onSave: () => void
  onHome: () => void
}) {
  const manualValue = manualCalories.trim() ? Number(manualCalories) : undefined
  const sport = buildSportCalories(sportProfileId, settings.weightKg, durationSeconds, manualValue)

  return (
    <section className={styles.summary}>
      <article className={styles.heroCard}>
        <span className={styles.statusPill}>Quete accomplie</span>
        <h2>Quete accomplie</h2>
        <div className={styles.summaryStats}>
          <div>
            <span>Duree totale</span>
            <strong>{formatDuration(durationSeconds)}</strong>
          </div>
          <div>
            <span>Exercices termines</span>
            <strong>{completedExerciseCount}/{workout.exercises.length}</strong>
          </div>
        </div>
      </article>

      <article className={styles.panel}>
        <div className={styles.panelHeader}>
          <div>
            <span className={styles.smallLabel}>Calories sport</span>
            <h2>{sport.calories} kcal</h2>
          </div>
          <strong>{sport.met} MET</strong>
        </div>
        <div className={styles.sportChoices}>
          {(Object.keys(sportProfiles) as SportProfileId[]).map((profileId) => (
            <button
              key={profileId}
              type="button"
              className={sportProfileId === profileId ? styles.selectedChoice : undefined}
              onClick={() => onSportProfileChange(profileId)}
            >
              {sportProfiles[profileId].label}
            </button>
          ))}
        </div>
        <div className={styles.todayGrid}>
          <div>
            <span>Poids</span>
            <strong>{settings.weightKg} kg</strong>
          </div>
          <div>
            <span>Duree</span>
            <strong>{formatDuration(durationSeconds)}</strong>
          </div>
          <div>
            <span>Estimation</span>
            <strong>{sport.estimatedCalories} kcal</strong>
          </div>
          <label className={styles.inlineField}>
            <span>Correction</span>
            <input
              type="number"
              min={0}
              inputMode="numeric"
              value={manualCalories}
              placeholder={`${sport.estimatedCalories}`}
              onChange={(event) => onManualCaloriesChange(event.target.value)}
            />
          </label>
        </div>
        <p className={styles.notice}>Estimation indicative, pas une mesure medicale.</p>
      </article>

      <article className={styles.panel}>
        <h2>Ressenti</h2>
        <div className={styles.feelingGrid}>
          {feelings.map((item) => (
            <button
              key={item.value}
              type="button"
              className={feeling === item.value ? styles.selectedChoice : undefined}
              onClick={() => onFeelingChange(item.value)}
            >
              {item.label}
            </button>
          ))}
        </div>
        <label className={styles.commentField}>
          <span>Commentaire libre</span>
          <textarea
            value={comment}
            onChange={(event) => onCommentChange(event.target.value)}
            rows={4}
            placeholder="Note rapide : energie, douleur, difficulte, marche..."
          />
        </label>
        <div className={styles.sessionActions}>
          <button type="button" className={styles.primaryButton} onClick={onSave} disabled={saved}>
            {saved ? 'Enregistre' : 'Enregistrer'}
          </button>
          <button type="button" className={styles.secondaryButton} onClick={onHome}>
            Retour accueil
          </button>
        </div>
      </article>
    </section>
  )
}

function HistoryView({
  entries,
  weeklyEntries,
  weeklyCounts,
  settings,
  streak,
  today,
}: {
  entries: HistoryEntry[]
  weeklyEntries: HistoryEntry[]
  weeklyCounts: Record<ActivityKind, number>
  settings: Settings
  streak: number
  today: Date
}) {
  const weeklyDuration = weeklyEntries.reduce((sum, entry) => sum + entry.durationSeconds, 0)
  const weekStart = startOfWeek(today)

  return (
    <section className={styles.history}>
      <div className={styles.sectionTitle}>
        <span className={styles.smallLabel}>Semaine du {weekStart.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long' })}</span>
        <h2>Historique hebdo</h2>
      </div>

      <article className={styles.panel}>
        <div className={styles.weekStats}>
          <div>
            <span>Seances</span>
            <strong>{weeklyEntries.length}</strong>
          </div>
          <div>
            <span>Duree totale</span>
            <strong>{formatDuration(weeklyDuration)}</strong>
          </div>
          <div>
            <span>Streak</span>
            <strong>{streak}</strong>
          </div>
        </div>
        <div className={styles.goalGrid}>
          <GoalPill label="Marches" value={weeklyCounts.walk} target={settings.weeklyGoals.walks} />
          <GoalPill label="Footings" value={weeklyCounts.run} target={settings.weeklyGoals.runs} />
          <GoalPill label="Kettlebell" value={weeklyCounts.kettlebell} target={settings.weeklyGoals.kettlebell} />
        </div>
      </article>

      {entries.length === 0 ? (
        <article className={styles.panel}>
          <p className={styles.muted}>Aucune seance enregistree.</p>
        </article>
      ) : (
        <div className={styles.historyList}>
          {entries.map((entry) => (
            <article key={entry.id} className={styles.historyItem}>
              <div>
                <span>{new Date(entry.date).toLocaleDateString('fr-FR', {
                  weekday: 'long',
                  day: '2-digit',
                  month: 'long',
                })}</span>
                <h3>{entry.workoutName}</h3>
                <p>{entry.quest}</p>
              </div>
              <dl>
                <div>
                  <dt>Duree</dt>
                  <dd>{formatDuration(entry.durationSeconds)}</dd>
                </div>
                <div>
                  <dt>Sport</dt>
                  <dd>{entry.sport?.label ?? 'Non renseigne'}</dd>
                </div>
                <div>
                  <dt>Calories</dt>
                  <dd>{entry.sport ? `${entry.sport.calories} kcal` : '-'}</dd>
                </div>
                <div>
                  <dt>Exercices</dt>
                  <dd>{entry.exercisesCompleted}/{entry.totalExercises}</dd>
                </div>
                <div>
                  <dt>Ressenti</dt>
                  <dd>{feelings.find((item) => item.value === entry.feeling)?.label ?? entry.feeling}</dd>
                </div>
              </dl>
              {entry.comment ? <p className={styles.comment}>{entry.comment}</p> : null}
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

function NutritionView({
  settings,
  meals,
  today,
  onAddMeal,
}: {
  settings: Settings
  meals: MealEntry[]
  today: Date
  onAddMeal: (entry: Omit<MealEntry, 'id' | 'date'>) => void
}) {
  const [mealMode, setMealMode] = useState<MealMode>('weighed')
  const [foodId, setFoodId] = useState<(typeof weighedFoods)[number]['id']>('skyr')
  const [quantity, setQuantity] = useState(100)
  const [mealType, setMealType] = useState<EstimatedMealType>('salade')
  const [proteinSource, setProteinSource] = useState<ProteinSource>('crevettes')
  const [portion, setPortion] = useState<PortionSize>('normale')
  const [estimatedCorrection, setEstimatedCorrection] = useState('')
  const [description, setDescription] = useState('')
  const [naturalCorrection, setNaturalCorrection] = useState('')

  const todayMeals = useMemo(() => getTodayMeals(meals, today), [meals, today])
  const proteinToday = useMemo(() => getMealTotal(todayMeals), [todayMeals])
  const remaining = Math.max(0, settings.proteinGoalGrams - proteinToday)
  const selectedFood = weighedFoods.find((food) => food.id === foodId) ?? weighedFoods[0]
  const weighedProtein = 'proteinPerUnit' in selectedFood
    ? Math.round(quantity * selectedFood.proteinPerUnit)
    : Math.round(quantity * selectedFood.proteinPer100g / 100)
  const estimated = estimateMealProtein(mealType, proteinSource, portion)
  const estimatedValue = estimatedCorrection.trim() ? sanitizeProteinGoal(estimatedCorrection, estimated.value) : estimated.value
  const naturalEstimate = estimateNaturalMeal(description)
  const naturalValue = naturalCorrection.trim() ? sanitizeProteinGoal(naturalCorrection, naturalEstimate.value) : naturalEstimate.value
  const groupedMeals = useMemo(() => {
    const groups = new Map<string, MealEntry[]>()
    meals.forEach((meal) => {
      const key = dateKey(new Date(meal.date))
      groups.set(key, [...(groups.get(key) ?? []), meal])
    })
    return Array.from(groups.entries())
      .map(([key, dayMeals]) => ({ key, meals: dayMeals, total: getMealTotal(dayMeals) }))
      .slice(0, 10)
  }, [meals])

  function addWeighedMeal() {
    onAddMeal({
      mode: 'weighed',
      label: selectedFood.label,
      proteinGrams: weighedProtein,
      details: 'proteinPerUnit' in selectedFood
        ? `${quantity} unite(s) - ${selectedFood.proteinPerUnit} g par unite`
        : `${quantity} g - ${selectedFood.proteinPer100g} g / 100 g`,
    })
  }

  function addEstimatedMeal() {
    onAddMeal({
      mode: 'estimated',
      label: `${mealTypeLabels[mealType]} ${sourceLabels[proteinSource].toLowerCase()} ${portionLabels[portion].toLowerCase()}`,
      proteinGrams: estimatedValue,
      proteinMin: estimated.min,
      proteinMax: estimated.max,
      details: 'Estimation rapide - utile pour suivre une tendance, pas pour etre au gramme pres.',
    })
    setEstimatedCorrection('')
  }

  function addNaturalMeal() {
    const label = description.trim() || 'Repas decrit'
    onAddMeal({
      mode: 'natural',
      label,
      proteinGrams: naturalValue,
      proteinMin: naturalEstimate.min,
      proteinMax: naturalEstimate.max,
      details: naturalEstimate.detected.join(' | '),
    })
    setDescription('')
    setNaturalCorrection('')
  }

  return (
    <section className={styles.nutrition}>
      <div className={styles.sectionTitle}>
        <span className={styles.smallLabel}>Nutrition simple</span>
        <h2>Proteines du jour</h2>
      </div>

      <article className={styles.heroCard}>
        <div className={styles.todayGrid}>
          <div>
            <span>Consomme</span>
            <strong>{proteinToday} g</strong>
          </div>
          <div>
            <span>Objectif</span>
            <strong>{settings.proteinGoalGrams} g</strong>
          </div>
          <div>
            <span>Reste</span>
            <strong>{remaining} g</strong>
          </div>
          <div>
            <span>Base</span>
            <strong>{settings.weightKg} kg x 1,6</strong>
          </div>
        </div>
      </article>

      <article className={styles.panel}>
        <div className={styles.panelHeader}>
          <div>
            <span className={styles.smallLabel}>Ajouter un repas</span>
            <h2>Mode rapide</h2>
          </div>
        </div>
        <div className={styles.modeTabs}>
          <button type="button" className={mealMode === 'weighed' ? styles.selectedChoice : undefined} onClick={() => setMealMode('weighed')}>
            Repas pese
          </button>
          <button type="button" className={mealMode === 'estimated' ? styles.selectedChoice : undefined} onClick={() => setMealMode('estimated')}>
            Estime
          </button>
          <button type="button" className={mealMode === 'natural' ? styles.selectedChoice : undefined} onClick={() => setMealMode('natural')}>
            Decrire
          </button>
        </div>

        {mealMode === 'weighed' ? (
          <div className={styles.formGrid}>
            <label>
              <span>Aliment</span>
              <select value={foodId} onChange={(event) => setFoodId(event.target.value as typeof foodId)}>
                {weighedFoods.map((food) => (
                  <option key={food.id} value={food.id}>{food.label}</option>
                ))}
              </select>
            </label>
            <label>
              <span>{'proteinPerUnit' in selectedFood ? 'Unites' : 'Grammes'}</span>
              <input type="number" min={0} value={quantity} onChange={(event) => setQuantity(Number(event.target.value))} />
            </label>
            <div className={styles.resultBox}>
              <span>Proteines calculees</span>
              <strong>{weighedProtein} g</strong>
            </div>
            <button type="button" className={styles.primaryButton} onClick={addWeighedMeal}>
              Ajouter ce repas
            </button>
          </div>
        ) : null}

        {mealMode === 'estimated' ? (
          <div className={styles.formGrid}>
            <label>
              <span>Type de repas</span>
              <select value={mealType} onChange={(event) => setMealType(event.target.value as EstimatedMealType)}>
                {(Object.keys(mealTypeLabels) as EstimatedMealType[]).map((key) => (
                  <option key={key} value={key}>{mealTypeLabels[key]}</option>
                ))}
              </select>
            </label>
            <label>
              <span>Proteine principale</span>
              <select value={proteinSource} onChange={(event) => setProteinSource(event.target.value as ProteinSource)}>
                {(Object.keys(sourceLabels) as ProteinSource[]).map((key) => (
                  <option key={key} value={key}>{sourceLabels[key]}</option>
                ))}
              </select>
            </label>
            <label>
              <span>Portion</span>
              <select value={portion} onChange={(event) => setPortion(event.target.value as PortionSize)}>
                {(Object.keys(portionLabels) as PortionSize[]).map((key) => (
                  <option key={key} value={key}>{portionLabels[key]}</option>
                ))}
              </select>
            </label>
            <label>
              <span>Correction optionnelle</span>
              <input
                type="number"
                min={0}
                value={estimatedCorrection}
                placeholder={`${estimated.value}`}
                onChange={(event) => setEstimatedCorrection(event.target.value)}
              />
            </label>
            <div className={styles.resultBox}>
              <span>Fourchette</span>
              <strong>{estimated.min} a {estimated.max} g</strong>
            </div>
            <p className={styles.notice}>Estimation rapide - utile pour suivre une tendance, pas pour etre au gramme pres.</p>
            <button type="button" className={styles.primaryButton} onClick={addEstimatedMeal}>
              Ajouter {estimatedValue} g
            </button>
          </div>
        ) : null}

        {mealMode === 'natural' ? (
          <div className={styles.formGrid}>
            <label className={styles.fullField}>
              <span>Decris ton repas</span>
              <textarea
                rows={4}
                value={description}
                placeholder="Salade avec riz, crevettes, ananas, concombre et legumes"
                onChange={(event) => setDescription(event.target.value)}
              />
            </label>
            <div className={styles.resultBox}>
              <span>Repas detecte</span>
              <ul>
                {naturalEstimate.detected.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <strong>{naturalEstimate.min} a {naturalEstimate.max} g - valeur {naturalEstimate.value} g</strong>
            </div>
            <label>
              <span>Correction</span>
              <input
                type="number"
                min={0}
                value={naturalCorrection}
                placeholder={`${naturalEstimate.value}`}
                onChange={(event) => setNaturalCorrection(event.target.value)}
              />
            </label>
            <p className={styles.notice}>Analyse locale par mots cles. Pas d IA externe, pas d API payante.</p>
            <button type="button" className={styles.primaryButton} onClick={addNaturalMeal}>
              Ajouter {naturalValue} g
            </button>
          </div>
        ) : null}
      </article>

      <article className={styles.panel}>
        <h2>Repas aujourd hui</h2>
        {todayMeals.length === 0 ? (
          <p className={styles.muted}>Aucun repas ajoute aujourd hui.</p>
        ) : (
          <div className={styles.mealList}>
            {todayMeals.map((meal) => (
              <div key={meal.id} className={styles.mealItem}>
                <div>
                  <strong>{meal.label}</strong>
                  <span>{meal.details}</span>
                </div>
                <b>{meal.proteinGrams} g</b>
              </div>
            ))}
          </div>
        )}
      </article>

      <article className={styles.panel}>
        <h2>Historique par jour</h2>
        {groupedMeals.length === 0 ? (
          <p className={styles.muted}>Aucun historique nutrition.</p>
        ) : (
          <div className={styles.mealList}>
            {groupedMeals.map((group) => (
              <div key={group.key} className={styles.mealItem}>
                <div>
                  <strong>{new Date(group.key).toLocaleDateString('fr-FR', { weekday: 'long', day: '2-digit', month: 'long' })}</strong>
                  <span>{group.meals.length} repas</span>
                </div>
                <b>{group.total} g</b>
              </div>
            ))}
          </div>
        )}
      </article>
    </section>
  )
}

function SettingsView({
  settings,
  onSettingsChange,
}: {
  settings: Settings
  onSettingsChange: (settings: Settings) => void
}) {
  function updateRestDuration(restDuration: 60 | 75 | 90) {
    onSettingsChange({ ...settings, restDuration })
  }

  function updateWeight(value: number) {
    const weightKg = sanitizeWeight(value, settings.weightKg)
    onSettingsChange({
      ...settings,
      weightKg,
      proteinGoalGrams: Math.round(weightKg * 1.6),
    })
  }

  function updateProteinGoal(value: number) {
    onSettingsChange({
      ...settings,
      proteinGoalGrams: sanitizeProteinGoal(value, settings.proteinGoalGrams),
    })
  }

  function updateGoal(key: keyof WeeklyGoals, value: number) {
    onSettingsChange({
      ...settings,
      weeklyGoals: {
        ...settings.weeklyGoals,
        [key]: sanitizeGoal(value, settings.weeklyGoals[key]),
      },
    })
  }

  return (
    <section className={styles.settings}>
      <div className={styles.sectionTitle}>
        <span className={styles.smallLabel}>Preferences locales</span>
        <h2>Reglages</h2>
      </div>

      <article className={styles.panel}>
        <h2>Repos par defaut</h2>
        <div className={styles.restChoices}>
          {[60, 75, 90].map((seconds) => (
            <button
              key={seconds}
              type="button"
              className={settings.restDuration === seconds ? styles.selectedChoice : undefined}
              onClick={() => updateRestDuration(seconds as 60 | 75 | 90)}
            >
              {seconds}s
            </button>
          ))}
        </div>
      </article>

      <article className={styles.panel}>
        <h2>Poids & proteines</h2>
        <div className={styles.settingFields}>
          <label>
            <span>Poids utilisateur</span>
            <input
              type="number"
              min={35}
              max={180}
              step="0.1"
              value={settings.weightKg}
              onChange={(event) => updateWeight(Number(event.target.value))}
            />
          </label>
          <label>
            <span>Objectif proteines/jour</span>
            <input
              type="number"
              min={40}
              max={280}
              value={settings.proteinGoalGrams}
              onChange={(event) => updateProteinGoal(Number(event.target.value))}
            />
          </label>
          <div className={styles.resultBox}>
            <span>Base par defaut</span>
            <strong>{settings.weightKg} kg x 1,6 = {Math.round(settings.weightKg * 1.6)} g</strong>
          </div>
        </div>
      </article>

      <article className={styles.panel}>
        <h2>Objectif hebdo</h2>
        <div className={styles.settingFields}>
          <label>
            <span>Marches</span>
            <input
              type="number"
              min={0}
              max={14}
              value={settings.weeklyGoals.walks}
              onChange={(event) => updateGoal('walks', Number(event.target.value))}
            />
          </label>
          <label>
            <span>Footings</span>
            <input
              type="number"
              min={0}
              max={14}
              value={settings.weeklyGoals.runs}
              onChange={(event) => updateGoal('runs', Number(event.target.value))}
            />
          </label>
          <label>
            <span>Kettlebell</span>
            <input
              type="number"
              min={0}
              max={14}
              value={settings.weeklyGoals.kettlebell}
              onChange={(event) => updateGoal('kettlebell', Number(event.target.value))}
            />
          </label>
        </div>
      </article>

      <article className={styles.panel}>
        <h2>Repos verrouille</h2>
        <div className={styles.lockedDays}>
          <span>Samedi</span>
          <span>Dimanche</span>
        </div>
        <p className={styles.muted}>Ces jours restent verrouilles dans le programme. Aucun bouton de seance n est propose.</p>
      </article>
    </section>
  )
}

function GoalPill({ label, value, target }: { label: string; value: number; target: number }) {
  return (
    <div className={styles.goalPill}>
      <span>{label}</span>
      <strong>{value}/{target}</strong>
    </div>
  )
}
