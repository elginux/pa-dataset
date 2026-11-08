// Source unique du dataset PA DGFiP — partagé entre ConformiCheck et FactureDirectory.
// Pour l'instant le fichier JSON canonique vit dans data/ pour éviter
// la duplication. Voir data/README.md pour la procédure de mise à jour.
//
// Pour mettre à jour : éditer data/pa-dataset-v1.json
// (vérifier la cohérence avec impots.gouv.fr).

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore — chemin relatif inter-packages, résolu par le bundler Next.js / TS.
// L'attribut d'import rend le module lisible par Node hors bundler, ce qui
// permet aux tests du package d'exercer les predicats sur le vrai dataset.
import paDataset from "../data/pa-dataset-v1.json" with { type: "json" };

export type CompletionLevel = "full" | "partial" | "minimal";

// Une fiche est dite "sourcable" quand son contenu permet de la presenter au
// public sans rien inventer : elle porte au moins le prix, les statuts, les
// secteurs, les forces et les faiblesses. C'est le critere commun aux deux
// sites — ConformiCheck pour la notation, FactureDirectory pour l'affichage
// editorial et les comparatifs.
//
// Pourquoi ce critere remplace le libelle _metadata.completion_level : ce
// libelle etait pose a la main. Une fiche enrichie gardait donc son ancien
// libelle, et une fiche annoncee "full" pouvait ne contenir aucun prix. Le
// 2026-09-16, 13 fiches portaient "full" mais 9 seulement etaient notables.
// Voir docs/operations/evals/evidence/pa-completion-audit-2026-09-16.md.
export function isPlatformSourced(platform: PaPlatform): boolean {
  const pricing = platform.pricing;
  if (typeof pricing !== "object" || pricing === null) return false;

  const record = pricing as Record<string, unknown>;
  const tiers = Array.isArray(record.tiers) ? record.tiers : [];
  const hasPrice = tiers.some((tier) => {
    if (typeof tier !== "object" || tier === null) return false;
    const row = tier as Record<string, unknown>;
    return (
      typeof row.price_month_ht_eur === "number" ||
      typeof row.price_month_ht_eur_min === "number" ||
      typeof row.price_month_ht_eur_max === "number"
    );
  });
  // Meme exigence que getPublishedMinPrice : une gratuite posee par la
  // detection automatique d'avril 2026 (note « A valider par l'editeur ») n'est
  // pas un tarif publie. L'ancien test `record.has_free_tier === true` laissait
  // entrer trois fiches (agicap, docoon, iopole) que getPublishedMinPrice
  // refusait ensuite : la fiche etait annoncee presentable avec un tarif, mais
  // affichait « Tarif sur demande ». Revele par le test de non-regression du
  // 2026-09-17.
  if (!hasPrice && !hasVerifiedFreeTier(platform)) return false;

  return hasEditorialSignal(platform);
}

// Signal editorial : la fiche porte de quoi ecrire un comparatif utile sans
// rien inventer — statuts, secteurs, forces et faiblesses. Le prix n'est pas
// exige ici : une PA qui ne publie pas de tarif reste comparable, elle
// affichera "Tarif sur demande". C'est le critere des pages /comparatif.
export function hasEditorialSignal(platform: PaPlatform): boolean {
  return Boolean(
    platform.statuses_supported?.length &&
      platform.sectors_supported?.length &&
      platform.strengths?.length &&
      platform.weaknesses?.length,
  );
}

// Une gratuite annoncee par la detection automatique d'avril 2026 (note
// "Tiers detectes automatiquement... A valider par l'editeur") n'est pas une
// gratuite verifiee. Publier "gratuit" a partir de cette seule note ferait
// afficher un tarif non confirme : on la considere comme non publiee.
function hasVerifiedFreeTier(platform: PaPlatform): boolean {
  const pricing = platform.pricing;
  if (typeof pricing !== "object" || pricing === null) return false;
  const record = pricing as Record<string, unknown>;
  if (record.has_free_tier !== true) return false;
  const note = typeof record.note === "string" ? record.note : "";
  return !/valider par l'editeur|detecte automatiquement/iu.test(note);
}

// Le prix du marche : un tarif chiffre publie, ou une gratuite verifiee. Seul
// un prix "publie" peut etre affiche au public sans validation supplementaire.
export function getPublishedMinPrice(platform: PaPlatform): number | null {
  const pricing = platform.pricing;
  if (typeof pricing !== "object" || pricing === null) return null;

  const record = pricing as Record<string, unknown>;
  const tiers = Array.isArray(record.tiers) ? record.tiers : [];
  const prices: number[] = [];
  for (const tier of tiers) {
    if (typeof tier !== "object" || tier === null) continue;
    const row = tier as Record<string, unknown>;
    for (const key of [
      "price_month_ht_eur",
      "price_month_ht_eur_min",
      "price_month_ht_eur_max",
    ]) {
      const value = row[key];
      if (typeof value === "number" && Number.isFinite(value) && value >= 0) {
        prices.push(value);
      }
    }
  }
  if (prices.length > 0) return Math.min(...prices);
  return hasVerifiedFreeTier(platform) ? 0 : null;
}

export type DgfipStatus =
  | "PA immatriculée"
  | "PA en attente d'immatriculation"
  | "SC (Solution Compatible)";

export interface PaPlatform {
  id: string;
  name: string;
  legal_name: string | null;
  website: string;
  dgfip_status: DgfipStatus;
  dgfip_status_url: string;
  dgfip_status_verified_at: string;
  dgfip_registration_date?: string | null;
  relay_pa: string | null;
  address?: string;
  contact_email?: string | null;
  headquarters?: string;
  pricing?: unknown;
  statuses_supported?: string[];
  statuses_not_supported_or_weak?: string[];
  sectors_supported?: string[];
  sectors_weak?: string[];
  volumes_supported?: string[];
  tva?: Record<string, boolean | string>;
  support?: Record<string, unknown>;
  integrations?: string[];
  formats?: string[];
  ttm_setup_days?: number;
  strengths?: string[];
  weaknesses?: string[];
  sources?: Array<{ label: string; url: string; consulted_at: string }>;
  notes?: string;
  last_verified: string;
  _metadata: { completion_level: CompletionLevel };
}

export interface PaDataset {
  version: string;
  generated_at: string;
  source_count: number;
  _metadata: {
    total_count_pa_immatriculees: number;
    total_count_pa_en_attente: number;
    total_count_sc: number;
    last_dgfip_check: string;
    completion_breakdown: Record<string, number>;
    notes_completion: string;
    official_source?: {
      url: string;
      consulted_at: string;
      source_modified_at: string;
      fully_registered_file: string;
      fully_registered_sha256: string;
      waiting_file: string;
      waiting_sha256: string;
      counting_method: string;
    };
  };
  schema_notes: Record<string, unknown>;
  methodology: string;
  platforms: PaPlatform[];
  platforms_en_attente_tests_interop: PaPlatform[];
  platforms_sc: PaPlatform[];
}

export const dataset = paDataset as unknown as PaDataset;

export const platforms = dataset.platforms;
export const platformsEnAttente = dataset.platforms_en_attente_tests_interop;
export const platformsSc = dataset.platforms_sc;

// Helpers couramment utilisés par ConformiCheck et FactureDirectory.

export function findPlatformById(id: string): PaPlatform | undefined {
  return [...platforms, ...platformsEnAttente, ...platformsSc].find(
    (p) => p.id === id,
  );
}

export function platformsByCompletionLevel(
  level: CompletionLevel,
): PaPlatform[] {
  return platforms.filter((p) => p._metadata.completion_level === level);
}

export function getPlatformsForListing(): PaPlatform[] {
  // Pour les pages annuaire/SEO : seulement les PA immatriculées (pas en attente, pas SC).
  return platforms;
}

// Constantes exportees a partir du dataset — a utiliser dans toute copy / metadata
// pour eviter la duplication des chiffres en dur. Recalcule a chaque build Next.js.
export const PA_COUNT_IMMATRICULEES =
  dataset._metadata.total_count_pa_immatriculees;
export const PA_COUNT_EN_ATTENTE = dataset._metadata.total_count_pa_en_attente;
export const SC_COUNT = dataset._metadata.total_count_sc;
export const PA_COUNT_TOTAL_LISTING =
  PA_COUNT_IMMATRICULEES + PA_COUNT_EN_ATTENTE + SC_COUNT;
export const PA_LAST_DGFIP_CHECK = dataset._metadata.last_dgfip_check;

// Counts par completion level (uniquement PA immatriculees)
export const PA_COUNT_FULL = dataset._metadata.completion_breakdown?.full ?? 0;
export const PA_COUNT_PARTIAL =
  dataset._metadata.completion_breakdown?.partial ?? 0;
export const PA_COUNT_MINIMAL =
  dataset._metadata.completion_breakdown?.minimal ?? 0;
export const PA_COUNT_ENRICHED = PA_COUNT_FULL + PA_COUNT_PARTIAL;

// ─── Fraicheur du dataset ─────────────────────────────────────────
// Helpers utilises par les sites publics (facturedirectory.fr, conformicheck.fr)
// pour afficher la date du dernier check DGFiP avec une couleur d'alerte si
// le dataset commence à dater. Transparence radicale : si >30j, on signale
// "mise à jour en cours" au visiteur. Force la discipline mensuelle.

export type DatasetFreshness = {
  /** Date ISO YYYY-MM-DD du dernier check DGFiP. */
  readonly lastCheckIso: string;
  /** Libellé français : "26 avril 2026". */
  readonly lastCheckLabel: string;
  /** Nombre de jours entiers depuis le dernier check (au moment du build). */
  readonly daysSinceCheck: number;
  /** Statut : `fresh` (<14j), `aging` (14-30j), `stale` (>30j). */
  readonly status: "fresh" | "aging" | "stale";
};

/**
 * Calcule la fraicheur du dataset PA au moment de l'appel.
 * Pur, deterministe pour une date donnee. Pas d'effet de bord.
 *
 * Note : appele a chaque build Next.js (composants Server). En SSR,
 * `now = build time` ; en SSG/ISR, `now = revalidate time`.
 */
export function getPaDatasetFreshness(
  now: Date = new Date(),
): DatasetFreshness {
  const lastCheckIso = PA_LAST_DGFIP_CHECK;
  const lastCheckDate = new Date(lastCheckIso);
  const daysSinceCheck = Math.floor(
    (now.getTime() - lastCheckDate.getTime()) / (1000 * 60 * 60 * 24),
  );
  const status: DatasetFreshness["status"] =
    daysSinceCheck < 14 ? "fresh" : daysSinceCheck <= 30 ? "aging" : "stale";
  const lastCheckLabel = lastCheckDate.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return { lastCheckIso, lastCheckLabel, daysSinceCheck, status };
}

/**
 * Bloque une publication si le snapshot DGFiP dépasse la cadence mensuelle
 * et sa marge de grâce. À appeler depuis les builds des surfaces publiques.
 */
export function assertPaDatasetFresh(
  now: Date = new Date(),
  maxAgeDays = 35,
): DatasetFreshness {
  const freshness = getPaDatasetFreshness(now);
  if (freshness.daysSinceCheck < 0) {
    throw new Error(
      `Dataset PA invalide : last_dgfip_check ${freshness.lastCheckIso} est dans le futur.`,
    );
  }
  if (freshness.daysSinceCheck > maxAgeDays) {
    throw new Error(
      `Dataset PA trop ancien : ${freshness.daysSinceCheck} jours (maximum ${maxAgeDays}). Lancer /pa-dataset-refresh avant publication.`,
    );
  }
  return freshness;
}

export default dataset;
