# Changelog

Format basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.1.0/), versionning [SemVer](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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

[Unreleased]: https://github.com/elginux/pa-dataset/compare/v1.1.0...HEAD
[1.1.0]: https://github.com/elginux/pa-dataset/releases/tag/v1.1.0
[1.0.0]: https://github.com/elginux/pa-dataset/releases/tag/v1.0.0
