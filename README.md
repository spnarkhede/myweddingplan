# My Wedding Plan

My Wedding Plan is a planner for an Indian Hindu wedding followed by a move to Germany. It runs entirely in the browser: no server, no account, no tracking.

**Live site:** https://spnarkhede.github.io/myweddingplan/

## Features

| Section | What it does |
|---|---|
| Overview | Countdowns to travel, the wedding and the return trip, a timeline, the next tasks due and progress per workstream |
| Workstreams | Checklists for documents before travel, the priest certificate, marriage registration (Hindu Marriage Act), the spouse visa, events, shopping and bookings, plus your own tasks, notes and request status tracking |
| Documents | A master list of every document for bride, groom and witnesses: court marriage, Hindu Marriage Act registration, affidavits, the marriage certificate, name change, identity documents, the spouse visa and the first months in Germany. Ticked documents stay on the list, struck through |
| Certificate | Priest certificate maker with 14 designs in English, Marathi and bilingual, each with a matching rituals guide for the back page, as an A4 PDF |
| Wedding Invitation | Six designs for engagement, haldi, sangeet and wedding, as a single page or a two page spread, as an image or a PDF |
| Visa letters | The husband's invitation letter and the wife's personal covering letter for a family reunion visa, in six designs, single page or with an annexure of enclosed documents |
| Name change | Comparison of keeping the maiden name, adding the spouse name, or changing the name in India or in Germany, with a decision guide, checklists and an FAQ |

## Getting started

1. Open the site and choose **Edit project details** on the Overview.
2. Enter your wedding date and travel dates. All due dates move with the wedding date.
3. Work through the checklists. Everything saves in your browser.

### Your data

Ticks, notes, form entries and settings are stored in your browser's local storage on that device. Nothing is sent anywhere. Use **Export backup** at the bottom of any page to save a copy, and **Import backup** to restore it on another device or browser.

## Development

Requires Node.js 18 or later. There are no dependencies to install.

```bash
npm run dev     # build and serve at http://localhost:5173
npm run build   # write the site to dist/
npm run check   # validate data and scripts, then build
```

### Project structure

```
myweddingplan/
├── src/
│   ├── index.html              Page shell with placeholders filled at build time
│   ├── partials/
│   │   └── certificate.html    Certificate maker markup and form
│   ├── styles/
│   │   ├── app.css             App shell, checklists, letters, invitations
│   │   └── certificate.css     Certificate sheets and designs
│   └── js/                     Concatenated in the order listed in scripts/build.mjs
│       ├── core.js             Constants, state, formatting helpers
│       ├── load.js             Loads tasks.json and saved state
│       ├── project-dates.js    Resolves dates relative to the wedding date
│       ├── storage.js          Saving (browser storage, or the Claude artifact store)
│       ├── helpers.js          Progress and checklist rows
│       ├── views.js            Overview and workstream pages
│       ├── name-change.js      Name change comparison and guide
│       ├── visa-letters.js     Invitation and covering letter maker
│       ├── router.js           Hash routing between sections
│       ├── events.js           Ticks, picks, custom tasks, notes
│       ├── settings-backup.js  Project details, export and import
│       ├── documents.js        Documents page
│       ├── invitations.js      Wedding invitation maker
│       └── certificate.js      Priest certificate maker
├── public/
│   └── tasks.json              All checklists, documents, events and name change content
├── scripts/
│   ├── build.mjs               Assembles dist/index.html and copies public/
│   ├── check.mjs               Validates tasks.json, ids, relative dates and script syntax
│   └── serve.mjs               Local development server
└── .github/workflows/deploy.yml  Checks, builds and deploys to GitHub Pages
```

### Editing content

Checklists, documents, events and the name change guide live in `public/tasks.json`. Dates are relative to the wedding date: `W-30` means 30 days before the wedding, `W+5` five days after. `npm run check` rejects fixed dates and duplicate ids.

To make sure no personal details slip into a commit, run the check with your own terms:

```bash
PERSONAL_TERMS="first name,surname,employer" npm run check
```

## Deployment

Every push to `main` runs the checks, builds the site and deploys it to GitHub Pages. Pull requests run the checks and build only.

One time setup: in the repository on GitHub, open **Settings → Pages** and set **Source** to **GitHub Actions**.

## Disclaimer

The checklists summarise public information from Indian and German authorities as of November 2026. Rules, fees and forms change, so confirm details with the relevant office before relying on them. This is not legal advice.

## Licence

MIT
