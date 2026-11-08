# Changelog

Format basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.1.0/), versionning [SemVer](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.4.0] — 2026-11-07

### Added

- Snapshot DGFiP du 3 novembre 2026 (vérifié le 7 novembre 2026) : **158 PA pleinement immatriculées** + **7 PA en attente** des tests d'interopérabilité + **3 Solutions Compatibles**.
- 3 nouveaux ajouts immatriculés (@GP, Konica Minolta Business Solutions France, Ponsot Conseil Gestion) et 1 ajout en attente (Sage Holding France).
- 8 promotions de l'attente vers l'immatriculation (BE FRESH S.à r.l., FACTUREAPP, Insiders Technologies GmbH, KALANDA, MY-EDDY, RATIOO, SWILE, ZEFYR).
- Prédicats et helpers exportés dans src/index.ts : isPlatformSourced, hasEditorialSignal, getPublishedMinPrice, getPaDatasetFreshness, assertPaDatasetFresh, et constantes de comptage.

### Changed

- Renommage officiel rapproché : Shine -> Shine Solutions ApS (identifiant shine conservé).
- Retraits reflétant la liste officielle DGFiP : ATGP, DOCPROCESS.
- Recalcul déterministe de completion_breakdown (full: 13, partial: 118, minimal: 27, sc_full: 3, en_attente_minimal: 7).

## [1.3.0] — 2026-09-17

### Added

- Snapshot DGFiP du 10 septembre 2026 (vérifié le 16 septembre 2026, re-vérifié le 2 octobre 2026 sur la liste du 22 septembre 2026) : **149 PA pleinement immatriculées** + **14 PA en attente** + **3 Solutions Compatibles**.

## [1.2.0] — 2026-08-05

### Added

- Snapshot DGFiP du 5 août 2026 : **145 PA pleinement immatriculées** + **18 PA en attente** + **3 Solutions Compatibles**.

## [1.1.0] — 2026-04-26

### Added

- Snapshot DGFiP du 26 avril 2026 : **127 PA pleinement immatriculées** (vs 124 au 24 avril) + **19 PA en attente** des tests d'interopérabilité.
- 3 Solutions Compatibles (EBP, Henrri, Freebe) dans `platforms_sc` pour informer l'utilisateur sur la dépendance à une PA tierce.
- Niveaux de complétude documentés : `full` (7 PA enrichies), `partial`, `minimal` (120 PA), `sc_full` (3), `en_attente_minimal` (19).
- Champ `_metadata.last_dgfip_check` pour tracer la date de dernière vérification source DGFiP.
- Champ `relay_pa` sur les SC, pointant vers la PA effective utilisée pour transmission.

### Changed

- Schéma `dgfip_status_values` clarifié (3 valeurs canoniques au lieu de 2).
- Documentation des `completion_levels` enrichie avec exemples explicites.

### Notes éditoriales

- Les 7 PA `full` enrichies sont : Indy, Pennylane, Tiime, Sellsy, Sage, Cegid, Quadient-Serensia.
- Les 120 PA `minimal` sont volontairement non enrichies pour ne pas fabriquer de données. Pipeline d'enrichissement progressif prévu.

## [1.0.0] — 2026-04-24

### Added

- Premier snapshot public du dataset.
- Schéma TypeScript initial (`Platform`, `PlatformsDataset`).
- Source primaire : DGFiP via [impots.gouv.fr](https://www.impots.gouv.fr/je-consulte-la-liste-des-plateformes-agreees).

[Unreleased]: https://github.com/elginux/pa-dataset/compare/v1.4.0...HEAD
[1.4.0]: https://github.com/elginux/pa-dataset/compare/v1.1.0...v1.4.0
[1.1.0]: https://github.com/elginux/pa-dataset/releases/tag/v1.1.0
[1.0.0]: https://github.com/elginux/pa-dataset/releases/tag/v1.0.0
