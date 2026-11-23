# RobustAvatar project page

English / 简体中文 academic website for **One Avatar, Any Budget: Robust LoD for Dynamic Gaussian Avatars**.

## Preview and hosting

The deployable files are in the **repository root**, alongside this README. There is no build step, package install, API key, or backend.

From the repository root, run:

```sh
python3 -m http.server 8080
```

Then open http://localhost:8080. Opening `index.html` directly also works; clipboard and saved-language permissions depend on the browser.

For GitHub Pages, publish the repository root from your configured branch. Keep `index.html`, `styles.css`, `translations.js`, `app.js`, and the `assets/` directory together. All asset URLs are relative, so hosting under `/RobustAvatar/` works without a build step. If moving the site to another domain, update the absolute Open Graph image URL in `index.html`.

## Languages / 语言切换

Use **English / 中文** at the top of the page to change language without reloading. The selected budget, subject, comparison setting, and chart task are preserved. Headings, research descriptions, image descriptions, controls, chart labels, accessibility labels, and copy feedback follow the selected language.

Language selection uses this order:

1. A supported URL query: `?lang=en` or `?lang=zh`.
2. A saved choice in `localStorage`, under `robustavatar-language`.
3. The browser's primary language: Chinese selects Simplified Chinese; other languages use English.
4. English when browser language information is unavailable.

Language links can be shared directly, for example `https://HaoyuZhao31415.github.io/RobustAvatar/?lang=zh`. Explicit language switching updates the URL and saves the choice when browser storage is available. The original English HTML remains readable when JavaScript is disabled. Interactive selectors and language switching require JavaScript.

点击页面顶部的 **中文 / English** 即可切换语言，无需刷新，当前人物、预算比例、对比设置和图表任务会保留。可通过 `?lang=zh` 分享中文版，通过 `?lang=en` 分享英文版；手动选择会在浏览器允许的情况下保存。首次访问时，中文浏览器默认显示简体中文，其他语言默认显示英文。禁用 JavaScript 时，页面仍可阅读英文内容。

The paper PDF, original research figures/video, author names, method names, numerical results, and BibTeX are preserved. Text embedded in the original research media remains in its original language.

## Content and updates

- `index.html`: English fallback content, author links, publication status, resource links, BibTeX, Table 1 measurements, and `data-i18n*` markers.
- `translations.js`: paired English and Simplified Chinese translations for static page content. Keep the keys aligned across both dictionaries.
- `styles.css`: academic layout, local fonts, responsive rules, language controls, Chinese typography, and visible keyboard focus.
- `app.js`: language selection and rendering, budget/subject selectors, NVS/NES chart data, comparison toggles, figure zoom, citation copying, and reduced-motion-aware teaser playback.
- `assets/`: paper, H.264 MP4, poster, extracted figure panels, method figure, local fonts, and font licenses.

When editing text, update the English fallback in `index.html` and both language entries in `translations.js`; dynamic interface strings are maintained in `app.js`. Preserve the research values and update the supplied publication metadata only when final bibliographic details are available. Add the code repository link when it becomes available.

## Verification

Check both languages at desktop and narrow mobile widths. Switch budgets and subjects, compare lower/higher budgets, change NVS/NES, enlarge figures, and copy the citation before and after changing language. Confirm that selected controls and the numerical results remain unchanged. Reload to check saved language, open `?lang=en` and `?lang=zh` to check URL precedence, and test with browser storage blocked and JavaScript disabled to check fallbacks.

## Research provenance

- Budget explorer: Figure 4, subjects 074/104/302/460, retained ratios 10/20/50/100%, plus ground truth. These are pre-rendered images, not live model inference.
- Method: Figure 2 rendered from page 4.
- Comparison explorer: Figure 3, subjects 218/253/264/306. Lower-budget labels: ArchitectHead 8,788 vs. Ours 8,000; higher-budget labels: ArchitectHead 20,133 vs. Ours 20,000. Those figure labels differ from aggregate Table 1 counts and are preserved as supplied.
- Chart and table: Table 1. ProgressiveAvatars numbers are cited measurements, not reproduced runs. Lines connect reported points only.
- Showcase: the supplied 15.47-second, 992×720 silent HEVC video was converted to H.264/yuv420p with MP4 fast-start for browser compatibility. The original source was not changed.
- English abstract: transcription of the supplied manuscript, with PDF line numbers and typography artifacts removed. The Chinese text translates that content.

## Design

The page follows the Nerfies-derived academic project-page style used by [Scaffold-GS](https://city-super.github.io/scaffold-gs/) and [GAF](https://tangjiapeng.github.io/projects/GAF/): full paper title, centered metadata, dark rounded resource buttons, a video teaser, and white single-column research sections. This is an independent lightweight implementation with no Bulma runtime dependency. Research assets belong to their respective authors. Google Sans and Noto Sans are distributed under their included SIL Open Font Licenses. Page functionality does not depend on external fonts, CDNs, analytics, or JavaScript libraries.
