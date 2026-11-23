'use strict';

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const state = { language: 'en', budget: '10', subject: '074', metric: 'nvs', comparison: 'low', comparisonSubject: '218' };


// UI-only translations: research measurements and citation metadata stay unchanged.
const messages = {
  en: {
    'budget.alt': 'Subject {subject} at {budget}% retained Gaussian budget, with facial detail crops',
    'budget.fullAlt': 'Subject {subject} at full budget, with facial detail crops',
    'budget.gtAlt': 'Ground truth for subject {subject}, with facial detail crops',
    'budget.label': '{budget}% budget',
    'comparison.alt': '{method} result for subject {subject} at {level} budget',
    'comparison.gtAlt': 'Ground truth for subject {subject}',
    'comparison.low': 'lower', 'comparison.mid': 'higher',
    'gaussians': '{count} Gaussians',
    'chart.nvsTitle': 'Novel view synthesis PSNR by rendered Gaussian count',
    'chart.nesTitle': 'Novel expression synthesis PSNR by rendered Gaussian count',
    'chart.description': 'RobustAvatar, ArchitectHead, ProgressiveAvatars, and the full GaussianAvatars baseline. All measurements are available in the expandable table below. Lines connect reported settings only.',
    'chart.axis': 'Rendered Gaussians',
    'chart.nvsSubtitle': 'Novel view synthesis · Higher PSNR is better',
    'chart.nesSubtitle': 'Novel expression synthesis · Higher PSNR is better',
    'chart.reported': 'ProgressiveAvatars (reported)',
    'chart.full': 'Full GaussianAvatars',
    'chart.point': '{method}: {count} Gaussians, {value} dB',
    'copy.button': 'Copy BibTeX', 'copy.done': 'Copied',
    'copy.success': 'BibTeX copied.',
    'copy.fallback': 'Citation selected. Press Ctrl+C (or Cmd+C) to copy.'
  },
  zh: {
    'budget.alt': '人物 {subject} 在保留 {budget}% 高斯基元预算下的结果，附面部细节裁剪图',
    'budget.fullAlt': '人物 {subject} 在完整预算下的结果，附面部细节裁剪图',
    'budget.gtAlt': '人物 {subject} 的真实参考图像，附面部细节裁剪图',
    'budget.label': '{budget}% 预算',
    'comparison.alt': '{method} 在{level}预算下对人物 {subject} 的重建结果',
    'comparison.gtAlt': '人物 {subject} 的真实参考图像',
    'comparison.low': '较低', 'comparison.mid': '较高',
    'gaussians': '{count} 个高斯基元',
    'chart.nvsTitle': '新视角合成的 PSNR 与渲染高斯基元数量的关系',
    'chart.nesTitle': '新表情合成的 PSNR 与渲染高斯基元数量的关系',
    'chart.description': '对比 RobustAvatar、ArchitectHead、ProgressiveAvatars 和完整 GaussianAvatars 基线。全部测量值可在下方展开的表格中查看。折线仅连接已报告的实验设置。',
    'chart.axis': '渲染高斯基元数量',
    'chart.nvsSubtitle': '新视角合成 · PSNR 越高越好',
    'chart.nesSubtitle': '新表情合成 · PSNR 越高越好',
    'chart.reported': 'ProgressiveAvatars（引用结果）',
    'chart.full': '完整 GaussianAvatars',
    'chart.point': '{method}：{count} 个高斯基元，{value} dB',
    'copy.button': '复制 BibTeX', 'copy.done': '已复制',
    'copy.success': '已复制 BibTeX 引用。',
    'copy.fallback': '已选中引用，请按 Ctrl+C（或 Cmd+C）复制。'
  }
};

function t(key, values = {}) {
  const template = messages[state.language][key] ?? window.translations?.[state.language]?.[key]
    ?? messages.en[key] ?? window.translations?.en?.[key] ?? key;
  return template.replace(/\{(\w+)\}/g, (match, name) => values[name] ?? match);
}

const languageStorageKey = 'robustavatar-language';
const isLanguage = value => value === 'en' || value === 'zh';
function preferredLanguage() {
  const requested = new URL(window.location.href).searchParams.get('lang');
  if (isLanguage(requested)) return requested;
  try {
    const saved = localStorage.getItem(languageStorageKey);
    if (isLanguage(saved)) return saved;
  } catch { /* Private browsing and disabled storage must not block the page. */ }
  return /^zh(?:-|$)/i.test(navigator.language || '') ? 'zh' : 'en';
}

let copyFeedback = '';
let copyResetTimer;
let zoomSource = null;
function renderCopyFeedback() {
  $('#copy-citation').textContent = t(copyFeedback === 'success' ? 'copy.done' : 'copy.button');
  $('#copy-status').textContent = copyFeedback ? t(`copy.${copyFeedback}`) : '';
}

function applyLanguage(language, persist = false) {
  state.language = isLanguage(language) ? language : 'en';
  document.documentElement.lang = state.language === 'zh' ? 'zh-CN' : 'en';
  $$('[data-i18n]').forEach(element => { element.textContent = t(element.dataset.i18n); });
  // Rich translations are trusted, repository-authored strings, never URL or user input.
  $$('[data-i18n-html]').forEach(element => { element.innerHTML = t(element.dataset.i18nHtml); });
  ['aria-label', 'alt', 'content'].forEach(attribute => {
    $$(`[data-i18n-${attribute}]`).forEach(element => {
      element.setAttribute(attribute, t(element.getAttribute(`data-i18n-${attribute}`)));
    });
  });
  markPressed('[data-language]', 'language', state.language);
  updateBudget();
  updateComparison();
  renderChart();
  renderCopyFeedback();
  if (zoomSource && dialog.open) {
    $('#dialog-image').alt = zoomSource.alt;
    $('#dialog-caption').textContent = zoomSource.alt;
  }
  if (persist) {
    try { localStorage.setItem(languageStorageKey, state.language); } catch { /* Optional preference. */ }
    const url = new URL(window.location.href);
    url.searchParams.set('lang', state.language);
    try { window.history.replaceState(null, '', url); } catch { /* Also supports file:// previews. */ }
  }
}

function markPressed(selector, key, selected) {
  $$(selector).forEach(button => button.setAttribute('aria-pressed', String(button.dataset[key] === selected)));
}

function updateBudget() {
  const { budget, subject } = state;
  $('#budget-image').src = `assets/budget-${subject}-${budget}.webp`;
  $('#budget-image').alt = t('budget.alt', { subject, budget });
  $('#full-image').src = `assets/budget-${subject}-100.webp`;
  $('#full-image').alt = t('budget.fullAlt', { subject });
  $('#gt-image').src = `assets/budget-${subject}-gt.webp`;
  $('#gt-image').alt = t('budget.gtAlt', { subject });
  $('#selected-budget-label').textContent = t('budget.label', { budget });
  markPressed('[data-budget]', 'budget', budget);
}

$$('[data-budget]').forEach(button => button.addEventListener('click', () => {
  state.budget = button.dataset.budget;
  updateBudget();
}));
$('#subject-select').addEventListener('change', event => {
  state.subject = event.target.value;
  updateBudget();
});

function updateComparison() {
  const { comparison, comparisonSubject: subject } = state;
  $('#ah-image').src = `assets/comparison-${subject}-ah-${comparison}.webp`;
  $('#ah-image').alt = t('comparison.alt', { method: 'ArchitectHead', subject, level: t(`comparison.${comparison}`) });
  $('#ours-image').src = `assets/comparison-${subject}-ours-${comparison}.webp`;
  $('#ours-image').alt = t('comparison.alt', { method: 'RobustAvatar', subject, level: t(`comparison.${comparison}`) });
  $('#comparison-gt').src = `assets/comparison-${subject}-gt.webp`;
  $('#comparison-gt').alt = t('comparison.gtAlt', { subject });
  $('#ah-count').textContent = t('gaussians', { count: comparison === 'low' ? '8,788' : '20,133' });
  $('#ours-count').textContent = t('gaussians', { count: comparison === 'low' ? '8,000' : '20,000' });
  markPressed('[data-comparison]', 'comparison', comparison);
}
$$('[data-comparison]').forEach(button => button.addEventListener('click', () => {
  state.comparison = button.dataset.comparison;
  updateComparison();
}));
$('#comparison-subject').addEventListener('change', event => {
  state.comparisonSubject = event.target.value;
  updateComparison();
});

// Table 1: actual reported counts; method-specific ratios are not aligned across methods.
const series = [
  { name: 'RobustAvatar', color: '#4059d4', counts: [2307, 4615, 9230, 23076], nvs: [26.36, 28.42, 29.47, 29.72], nes: [24.17, 25.05, 25.54, 25.67] },
  { name: 'ArchitectHead', color: '#cc7a56', counts: [4871, 8788, 23133], nvs: [26.18, 26.62, 27.72], nes: [17.83, 18.75, 18.72] },
  { name: 'ProgressiveAvatars (reported)', labelKey: 'chart.reported', color: '#459c8c', dash: true, counts: [10144, 37302], nvs: [27.89, 29.14], nes: [25.13, 25.58] },
  { name: 'Full GaussianAvatars', labelKey: 'chart.full', color: '#888c9e', counts: [46152], nvs: [29.19], nes: [25.55] }
];

function renderChart() {
  const metric = state.metric;
  const width = 620, height = 330;
  const left = 48, right = 18, top = 29, bottom = 49;
  const yMin = metric === 'nvs' ? 25 : 16;
  const yMax = metric === 'nvs' ? 31 : 28;
  const step = metric === 'nvs' ? 1 : 2;
  const x = count => left + count / 50000 * (width - left - right);
  const y = value => top + (yMax - value) / (yMax - yMin) * (height - top - bottom);
  const title = t(`chart.${metric}Title`);
  let svg = `<svg viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="chart-title chart-desc"><title id="chart-title">${title}</title><desc id="chart-desc">${t('chart.description')}</desc>`;
  svg += '<g font-family="Noto Sans, Arial, sans-serif" font-size="11" fill="#62677c">';
  for (let tick = yMin; tick <= yMax; tick += step) {
    svg += `<line x1="${left}" y1="${y(tick)}" x2="${width-right}" y2="${y(tick)}" stroke="#e9ecf3"/><text x="${left-10}" y="${y(tick)+4}" text-anchor="end">${tick}</text>`;
  }
  for (let tick = 0; tick <= 50000; tick += 10000) {
    svg += `<text x="${x(tick)}" y="${height-bottom+22}" text-anchor="middle">${tick ? `${tick/1000}k` : '0'}</text>`;
  }
  svg += `<text x="${left}" y="14">PSNR (dB) ↑</text><text x="${(left+width-right)/2}" y="${height-5}" text-anchor="middle">${t('chart.axis')}</text></g>`;
  for (const item of series) {
    const points = item.counts.map((count, index) => `${x(count)},${y(item[metric][index])}`).join(' ');
    if (item.counts.length > 1) svg += `<polyline points="${points}" fill="none" stroke="${item.color}" stroke-width="${item.name === 'RobustAvatar' ? 3 : 2}" ${item.dash ? 'stroke-dasharray="6 5"' : ''} stroke-linejoin="round"/>`;
    item.counts.forEach((count, index) => {
      const value = item[metric][index];
      svg += `<circle cx="${x(count)}" cy="${y(value)}" r="4" fill="white" stroke="${item.color}" stroke-width="2"><title>${t('chart.point', { method: item.labelKey ? t(item.labelKey) : item.name, count: count.toLocaleString('en-US'), value: value.toFixed(2) })}</title></circle>`;
    });
  }
  svg += '</svg>';
  $('#quality-chart').innerHTML = svg;
  $('#chart-subtitle').textContent = t(`chart.${metric}Subtitle`);
  markPressed('[data-metric]', 'metric', metric);
}
$$('[data-metric]').forEach(button => button.addEventListener('click', () => {
  state.metric = button.dataset.metric;
  renderChart();
}));

const dialog = $('#image-dialog');
$$('[data-zoom]').forEach(button => button.addEventListener('click', () => {
  const source = button.querySelector('img');
  zoomSource = source;
  $('#dialog-image').src = source.src;
  $('#dialog-image').alt = source.alt;
  $('#dialog-caption').textContent = source.alt;
  dialog.showModal();
}));
$('#close-dialog').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  if (event.target === dialog) {
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  }
});

$('#copy-citation').addEventListener('click', async () => {
  const content = $('#bibtex').textContent;
  try {
    await navigator.clipboard.writeText(content);
    copyFeedback = 'success';
    clearTimeout(copyResetTimer);
    renderCopyFeedback();
    copyResetTimer = setTimeout(() => { copyFeedback = ''; renderCopyFeedback(); }, 2500);
  } catch {
    const range = document.createRange();
    range.selectNodeContents($('#bibtex'));
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    clearTimeout(copyResetTimer);
    copyFeedback = 'fallback';
    renderCopyFeedback();
  }
});

// Match the teaser behavior of academic project pages, respecting reduced motion.
const teaser = document.querySelector('#showcase-video');
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  teaser.play().catch(() => {});
}


// Initialize after all interactive components exist, without changing selected results.
applyLanguage(preferredLanguage());
$$('[data-language]').forEach(button => {
  button.addEventListener('click', () => applyLanguage(button.dataset.language, true));
  button.closest('[hidden]')?.removeAttribute('hidden');
});
window.addEventListener('popstate', () => applyLanguage(preferredLanguage()));
