# pa-dataset

[![License: CC BY 4.0](https://img.shields.io/badge/License-CC_BY_4.0-lightgrey.svg)](https://creativecommons.org/licenses/by/4.0/)

**Open dataset des Plateformes Agréées (PA) DGFiP** — facturation électronique française 2026-2027.

127 PA pleinement immatriculées + 19 en attente des tests d'interopérabilité + 3 Solutions Compatibles. Snapshot vérifié sur [impots.gouv.fr](https://www.impots.gouv.fr/je-consulte-la-liste-des-plateformes-agreees), mise à jour DGFiP du 24 avril 2026, vérifié Elginux le 26 avril 2026.

Source primaire de [ConformiCheck](https://conformicheck.fr) (comparateur) et FactureDirectory (annuaire SEO).

---

## Pourquoi ce dataset

La DGFiP publie la liste officielle des PA sur [impots.gouv.fr](https://www.impots.gouv.fr/je-consulte-la-liste-des-plateformes-agreees), mais sans données structurées exploitables (HTML brut, pas d'API). Cet open dataset propose une version **structurée, schématisée et versionnée** :

- **JSON unique** consommable depuis n'importe quel runtime
- **Types TypeScript** stricts pour intégration directe
- **Niveaux de complétude transparents** (`full`, `partial`, `minimal`) — on ne fabrique pas les champs manquants, on les déclare
- **Cadence de mise à jour mensuelle** (cron GitHub Actions, diff DGFiP, auto-issue si nouvelles entrées)

---

## Installation

```bash
# npm
npm install @elginux/pa-dataset

# pnpm
pnpm add @elginux/pa-dataset

# yarn
yarn add @elginux/pa-dataset
```

> **Note** : si tu n'utilises pas Node, tu peux aussi récupérer directement le JSON :
> [`data/pa-dataset-v1.json`](./data/pa-dataset-v1.json) (~250 KB, 127 + 19 + 3 entrées)

---

## Usage

### TypeScript / JavaScript

```ts
import paDataset from '@elginux/pa-dataset/data' assert { type: 'json' }
import type { Platform, PlatformsDataset } from '@elginux/pa-dataset'

const data = paDataset as PlatformsDataset

console.log(`${data._metadata.total_count_pa_immatriculees} PA pleinement immatriculées`)
console.log(`${data._metadata.total_count_pa_en_attente} PA en attente`)

// Filtrer les PA "full" (fiches enrichies)
const enriched = data.platforms.filter((p) => p.completion_level === 'full')
```

### Direct JSON fetch (sans Node)

```bash
curl -L https://raw.githubusercontent.com/elginux/pa-dataset/main/data/pa-dataset-v1.json
```

---

## Schéma

Voir [`src/types.ts`](./src/types.ts) pour les types TypeScript complets.

Champs principaux par plateforme :

| Champ | Description |
|---|---|
| `id` | Identifiant interne stable |
| `name` | Nom commercial (ex. "Pennylane") |
| `legal_name` | Raison sociale (quand publiée par DGFiP) |
| `url` | Site éditeur officiel |
| `dgfip_status` | `PA immatriculée` \| `PA en attente d'immatriculation` \| `SC (Solution Compatible)` |
| `dgfip_registration_date` | Date d'agrément DGFiP (ISO 8601) |
| `completion_level` | `full` \| `partial` \| `minimal` \| `sc_full` \| `en_attente_minimal` |
| `pricing` | Si `full` : structure pricing (free, paid, monthly, etc.) |
| `target_personas` | Si `full` : profils TPE/PME ciblés |
| `integrations` | Si `full` : ERP, banques, comptables compatibles |
| `strengths` / `weaknesses` | Si `full` : notes éditoriales |

### Niveaux de complétude

| Niveau | Définition |
|---|---|
| **full** | Toutes sections renseignées + vérification éditeur. **7 PA** au 26 avril 2026 (Indy, Pennylane, Tiime, Sellsy, Sage, Cegid, Quadient-Serensia) |
| **partial** | Champs essentiels (id, name, url, target_personas, pricing approximatif) |
| **minimal** | Identité officielle DGFiP uniquement (nom, raison sociale, adresse, URL, email, statut, date d'agrément) — **120 PA** au 26 avril 2026 |
| **sc_full** | Solutions Compatibles (3) — EBP, Henrri, Freebe |
| **en_attente_minimal** | 19 PA en attente des tests d'interopérabilité |

Le consommateur (UI ConformiCheck/FactureDirectory) doit afficher "Fiche en cours de complétion" sur les fiches `minimal`.

---

## Cadence de mise à jour

- **Source DGFiP** mise à jour ~3-5 fois par mois (avril 2026, peut accélérer en mai-août 2026)
- **Cron GitHub Actions** : 1ᵉʳ du mois 9h UTC, diff DGFiP, auto-issue si nouvelles entrées
- **Releases SemVer** sur changements substantiels :
  - **patch** : ajout PA, correction métadonnées
  - **minor** : ajout champs au schéma, enrichissement éditorial massif
  - **major** : breaking changes (rupture schéma, suppression PA, refonte structure)

---

## Contribution

Les contributions sont bienvenues. Avant de proposer un patch :

1. **Sources primaires obligatoires** — toute correction PA doit citer une URL DGFiP ou éditeur (pas de blog, pas de forum)
2. **Pas de données fabriquées** — si une info est inconnue, laisser le champ absent, ne pas inventer
3. **Champs éditoriaux signés** — `strengths`/`weaknesses` engagent Elginux, ouverts à la correction sous 48h ouvrées si une PA citée fait remonter une inexactitude
4. **Tests** — vérifier que `pnpm check-types` passe avant la PR

Voir [`CONTRIBUTING.md`](./CONTRIBUTING.md) pour le détail.

**Email correction** : `corrections@elginux.fr` (canal dédié droit de réponse PA)

---

## Méthodologie

Voir [conformicheck.fr/methodologie](https://conformicheck.fr/methodologie) pour le détail public de :

- Sources primaires consultées
- Critères de classification `full`/`partial`/`minimal`
- Périodicité de re-vérification
- Gestion des contestations

---

## Licence

[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) — voir [`LICENSE`](./LICENSE).

**Attribution demandée** :
> "Données issues de pa-dataset (Elginux), licence CC BY 4.0 — github.com/elginux/pa-dataset"

La donnée DGFiP est elle-même publique. Le travail éditorial (structure, enrichissement, schéma, niveaux de complétude) est ce qui est sous CC BY 4.0.

---

## Références

- **Source primaire** : [impots.gouv.fr/je-consulte-la-liste-des-plateformes-agreees](https://www.impots.gouv.fr/je-consulte-la-liste-des-plateformes-agreees)
- **Réforme** : facturation électronique obligatoire 1ᵉʳ septembre 2026 (réception toutes entreprises) + 1ᵉʳ septembre 2027 (émission TPE/PME)
- **Comparateur consommateur** : [conformicheck.fr](https://conformicheck.fr)
- **Algorithme de matching** : [github.com/elginux/conformicheck-scoring](https://github.com/elginux/conformicheck-scoring) (MIT)
- **Studio Elginux** : [elginux.fr](https://elginux.fr)
