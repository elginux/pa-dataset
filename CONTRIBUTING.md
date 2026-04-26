# Contribuer à pa-dataset

Merci de l'intérêt porté au projet. Quelques règles d'hygiène.

## Avant de proposer un patch

### 1. Sources primaires obligatoires

Toute correction (ajout PA, modif statut, modif date d'agrément, modif raison sociale, etc.) **doit citer une URL primaire** :

- DGFiP : [impots.gouv.fr/je-consulte-la-liste-des-plateformes-agreees](https://www.impots.gouv.fr/je-consulte-la-liste-des-plateformes-agreees)
- Site officiel de l'éditeur de la PA
- INSEE / SIRENE pour la raison sociale et le SIREN

Sources non acceptables : blogs, forums, posts LinkedIn, articles SEO sans source primaire.

### 2. Pas de données fabriquées

Si une information n'est pas publiquement disponible, **le champ doit rester absent** ou marqué `null`. Ne jamais inventer pour "compléter".

C'est le contrat de transparence du dataset : l'utilisateur sait ce qu'on sait et ce qu'on ne sait pas.

### 3. Champs éditoriaux engageants

Les champs `strengths`, `weaknesses`, `notes_editoriales` engagent Elginux (et donc le contributeur initial) sur l'analyse. Toute PA citée a un **droit de réponse 48h ouvrées** via `corrections@elginux.fr` (cf. [CGU ConformiCheck Article 9](https://conformicheck.fr/cgu)).

Si tu ajoutes ce type de champ :
- Ton avis doit être **factuel et étayé** (pricing public, fonctionnalité documentée, intégration listée par l'éditeur)
- Pas de subjectif gratuit ("design moche", "support nul")
- Privilégier le langage neutre ("Pricing premium", "support uniquement par email")

### 4. Tests

Avant la PR :

```bash
pnpm install
pnpm check-types
```

Si tu touches au schéma TypeScript, vérifier la cohérence avec le JSON.

### 5. Format de commit

Suivre le format `[type] description courte` :

- `[data] add PA Untel (DGFiP 28/04/2026)` — ajout entrée
- `[data] fix Pennylane statut full → partial` — correction
- `[schema] add field tva_modes (CGI 256-2)` — évolution schéma
- `[meta] update CHANGELOG for 1.2.0`
- `[docs] add usage example with React Query`

## Process de release

Tags SemVer :

- **patch** (`1.1.0` → `1.1.1`) : ajout/correction PA, pas de breaking
- **minor** (`1.1.0` → `1.2.0`) : ajout champs schéma, enrichissement massif
- **major** (`1.1.0` → `2.0.0`) : breaking schema, suppression PA, refonte

Releases publiées par le mainteneur (Laurent Jachimiak) après validation manuelle.

## Demande de mise à jour ad-hoc

Si tu es **éditeur d'une PA listée** et tu veux corriger ta fiche :

1. Email à `corrections@elginux.fr` avec en sujet : `[pa-dataset] correction <nom-PA>`
2. Pièce jointe : capture/lien officiel justifiant la correction
3. Réponse sous 48h ouvrées (engagement écrit dans la CGU ConformiCheck)

C'est le canal préférentiel — pas besoin de PR GitHub.

## Code of Conduct

Bienveillance et respect. Pas de tolérance pour le harcèlement, la publicité commerciale agressive ou le dénigrement gratuit d'une PA citée.

## License

En contribuant, tu acceptes que ta contribution soit publiée sous [CC BY 4.0](./LICENSE).
