# AMR/AI Scoping Review Dashboard

Read-only web dashboard for exploring the validated AMR/AI scoping-review extraction.

## Data

The dashboard is generated from:

`../extraction_run/collated.csv`

Current release:

- 346 studies
- 215 extraction fields
- Publication years 2000–2026

Do not edit `public/data/amr_ai_collated.json` or `public/data/collated.csv` manually. Regenerate both from the canonical collation:

```bash
npm run data:build
```

The conversion keeps all populated source fields under each study's `raw` object and creates standardised summary fields for charts and filtering.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Verify

```bash
npm run data:build
/opt/homebrew/anaconda3/bin/python3 scripts/test_dashboard_data.py
npm run lint
npm run build
```

The production build is a static export in `out/` and uses `/amr-ai-dashboard` as its GitHub Pages base path.

## Dashboard sections

- Overview
- Geographic distribution
- AI/ML landscape
- Pathogens and resistance
- Performance and clinical maturity
- Reporting, transparency and equity
- Publication trends
- Study Explorer with filters, CSV download and all populated extraction fields
- About and provenance

## Deployment

```bash
npm run deploy
```

Deployment changes external state and should only be run after reviewing the generated site and confirming the target GitHub Pages repository.
