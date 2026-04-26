// Source ouverte (CC BY 4.0) du dataset des Plateformes Agréées DGFiP.
// Le JSON canonique vit dans data/pa-dataset-v1.json.
// Pour mettre à jour : voir CONTRIBUTING.md (sources primaires obligatoires,
// vérification systématique sur impots.gouv.fr).

// resolveJsonModule + bundler resolution — fonctionne avec Next.js, Vite, tsx, esbuild.
// Pour Node ESM strict, utiliser fetch() ou fs.readFileSync(require.resolve('@elginux/pa-dataset/data')).
import paDataset from '../data/pa-dataset-v1.json'

export type CompletionLevel = 'full' | 'partial' | 'minimal'

export type DgfipStatus =
    | 'PA immatriculée'
    | "PA en attente d'immatriculation"
    | 'SC (Solution Compatible)'

export interface PaPlatform {
    id: string
    name: string
    legal_name: string | null
    website: string
    dgfip_status: DgfipStatus
    dgfip_status_url: string
    dgfip_status_verified_at: string
    relay_pa: string | null
    address?: string
    contact_email?: string | null
    headquarters?: string
    pricing?: unknown
    statuses_supported?: string[]
    statuses_not_supported_or_weak?: string[]
    sectors_supported?: string[]
    sectors_weak?: string[]
    volumes_supported?: string[]
    tva?: Record<string, boolean | string>
    support?: Record<string, unknown>
    integrations?: string[]
    formats?: string[]
    ttm_setup_days?: number
    strengths?: string[]
    weaknesses?: string[]
    sources?: Array<{ label: string; url: string; consulted_at: string }>
    notes?: string
    last_verified: string
    _metadata: { completion_level: CompletionLevel }
}

export interface PaDataset {
    version: string
    generated_at: string
    source_count: number
    _metadata: {
        total_count_pa_immatriculees: number
        total_count_pa_en_attente: number
        total_count_sc: number
        last_dgfip_check: string
        completion_breakdown: Record<string, number>
        notes_completion: string
    }
    schema_notes: Record<string, unknown>
    methodology: string
    platforms: PaPlatform[]
    platforms_en_attente_tests_interop: PaPlatform[]
    platforms_sc: PaPlatform[]
}

export const dataset = paDataset as unknown as PaDataset

export const platforms = dataset.platforms
export const platformsEnAttente = dataset.platforms_en_attente_tests_interop
export const platformsSc = dataset.platforms_sc

// Helpers couramment utilisés par ConformiCheck et FactureDirectory.

export function findPlatformById(id: string): PaPlatform | undefined {
    return [...platforms, ...platformsEnAttente, ...platformsSc].find(
        (p) => p.id === id,
    )
}

export function platformsByCompletionLevel(
    level: CompletionLevel,
): PaPlatform[] {
    return platforms.filter((p) => p._metadata.completion_level === level)
}

export function getPlatformsForListing(): PaPlatform[] {
    // Pour les pages annuaire/SEO : seulement les PA immatriculées (pas en attente, pas SC).
    return platforms
}

export default dataset
