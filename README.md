# RobustAvatar project page

English academic website for **One Avatar, Any Budget: Robust LoD for Dynamic Gaussian Avatars**.

## Preview and hosting

All deployable files are in `dist/`. There is no build step, package install, API key, or backend.

Run `python -m http.server 8080 --directory dist`, then open http://localhost:8080. Opening `dist/index.html` directly also works; clipboard permissions depend on the browser.

For GitHub Pages, upload the **contents** of `dist/` to the repository root or your configured publishing directory. Preserve the `assets/` directory. To host under a repository subpath, existing relative asset URLs work without modification. Update the absolute Open Graph image URL in `index.html` to your final public origin.

## Content and updates

- `dist/index.html`: paper title, author/affiliation placeholders, status, resource links, abstract, provisional BibTeX, and Table 1 measurements.
- `dist/styles.css`: Nerfies-style academic layout, local Google Sans and Noto Sans fonts, responsive rules, and accessible focus states.
- `dist/app.js`: budget/subject selectors, NVS/NES chart data, comparison toggles, figure zoom, citation copy, and reduced-motion-aware teaser playback.
- `dist/assets/`: provided paper, browser-compatible H.264 MP4, poster, original-resolution extracted figure panels, method figure, local font and license.

Before a public research release, replace `Anonymous Authors`, the provisional `@misc` citation and manuscript status with your approved final metadata. Add the actual author homepage/affiliation links and code repository when available. No author, acceptance, DOI, arXiv URL, funding, or repository metadata was invented.

The supplied manuscript says NeurIPS 2026 submission. The site therefore uses that status. Update it if the final publication status differs.

## Research provenance

- Budget explorer: Figure 4, subjects 074/104/302/460, retained ratios 10/20/50/100%, plus ground truth. These are pre-rendered images, not live model inference.
- Method: Figure 2 rendered from page 4.
- Comparison explorer: Figure 3, subjects 218/253/264/306. Lower-budget labels: ArchitectHead 8,788 vs. Ours 8,000; higher-budget labels: ArchitectHead 20,133 vs. Ours 20,000. Those figure labels differ from aggregate Table 1 counts and are preserved as supplied.
- Chart and table: Table 1. ProgressiveAvatars numbers are cited measurements, not reproduced runs. Lines connect reported points only.
- Showcase: the supplied 15.47-second, 992×720 silent HEVC video was converted to H.264/yuv420p with MP4 fast-start for browser compatibility. The original source was not changed.
- Abstract: transcription of the supplied manuscript, with PDF line numbers and typography artifacts removed.

## Design

Version 2 follows the classic Nerfies-derived academic project-page style used by Scaffold-GS (https://city-super.github.io/scaffold-gs/) and GAF (https://tangjiapeng.github.io/projects/GAF/): full paper title, centered metadata, dark rounded resource buttons, a video teaser, and white single-column research sections. This is an independent lightweight implementation with no Bulma runtime dependency. Research assets belong to their respective authors. Google Sans and Noto Sans are distributed under their included SIL Open Font Licenses. Font declarations were obtained from the official Google Fonts API. Page functionality does not depend on external fonts, CDNs, analytics, or JavaScript libraries.

Sites hosting metadata is in `.openai/hosting.json`; it is not required for GitHub Pages or local use. The portable ZIP contains only website files and this README, without Sites identity or repository credentials.
