'use strict';

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const state = { budget: '10', subject: '074', metric: 'nvs', comparison: 'low', comparisonSubject: '218' };

function markPressed(selector, key, selected) {
  $$(selector).forEach(button => button.setAttribute('aria-pressed', String(button.dataset[key] === selected)));
}

function updateBudget() {
  const { budget, subject } = state;
  $('#budget-image').src = `assets/budget-${subject}-${budget}.webp`;
  $('#budget-image').alt = `Subject ${subject} at ${budget}% retained Gaussian budget, with facial detail crops`;
  $('#full-image').src = `assets/budget-${subject}-100.webp`;
  $('#full-image').alt = `Subject ${subject} at full budget, with facial detail crops`;
  $('#gt-image').src = `assets/budget-${subject}-gt.webp`;
  $('#gt-image').alt = `Ground truth for subject ${subject}, with facial detail crops`;
  $('#selected-budget-label').textContent = `${budget}% budget`;
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
  $('#ah-image').alt = `ArchitectHead result for subject ${subject} at ${comparison === 'low' ? 'lower' : 'higher'} budget`;
  $('#ours-image').src = `assets/comparison-${subject}-ours-${comparison}.webp`;
  $('#ours-image').alt = `RobustAvatar result for subject ${subject} at ${comparison === 'low' ? 'lower' : 'higher'} budget`;
  $('#comparison-gt').src = `assets/comparison-${subject}-gt.webp`;
  $('#comparison-gt').alt = `Ground truth for subject ${subject}`;
  $('#ah-count').textContent = comparison === 'low' ? '8,788 Gaussians' : '20,133 Gaussians';
  $('#ours-count').textContent = comparison === 'low' ? '8,000 Gaussians' : '20,000 Gaussians';
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
  { name: 'ProgressiveAvatars (reported)', color: '#459c8c', dash: true, counts: [10144, 37302], nvs: [27.89, 29.14], nes: [25.13, 25.58] },
  { name: 'Full GaussianAvatars', color: '#888c9e', counts: [46152], nvs: [29.19], nes: [25.55] }
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
  const title = `${metric === 'nvs' ? 'Novel view' : 'Novel expression'} synthesis PSNR by rendered Gaussian count`;
  let svg = `<svg viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="chart-title chart-desc"><title id="chart-title">${title}</title><desc id="chart-desc">RobustAvatar, ArchitectHead, ProgressiveAvatars, and the full GaussianAvatars baseline. All measurements are available in the expandable table below. Lines connect reported settings only.</desc>`;
  svg += '<g font-family="Noto Sans, Arial, sans-serif" font-size="11" fill="#62677c">';
  for (let tick = yMin; tick <= yMax; tick += step) {
    svg += `<line x1="${left}" y1="${y(tick)}" x2="${width-right}" y2="${y(tick)}" stroke="#e9ecf3"/><text x="${left-10}" y="${y(tick)+4}" text-anchor="end">${tick}</text>`;
  }
  for (let tick = 0; tick <= 50000; tick += 10000) {
    svg += `<text x="${x(tick)}" y="${height-bottom+22}" text-anchor="middle">${tick ? `${tick/1000}k` : '0'}</text>`;
  }
  svg += `<text x="${left}" y="14">PSNR (dB) ↑</text><text x="${(left+width-right)/2}" y="${height-5}" text-anchor="middle">Rendered Gaussians</text></g>`;
  for (const item of series) {
    const points = item.counts.map((count, index) => `${x(count)},${y(item[metric][index])}`).join(' ');
    if (item.counts.length > 1) svg += `<polyline points="${points}" fill="none" stroke="${item.color}" stroke-width="${item.name === 'RobustAvatar' ? 3 : 2}" ${item.dash ? 'stroke-dasharray="6 5"' : ''} stroke-linejoin="round"/>`;
    item.counts.forEach((count, index) => {
      const value = item[metric][index];
      svg += `<circle cx="${x(count)}" cy="${y(value)}" r="4" fill="white" stroke="${item.color}" stroke-width="2"><title>${item.name}: ${count.toLocaleString('en-US')} Gaussians, ${value.toFixed(2)} dB</title></circle>`;
    });
  }
  svg += '</svg>';
  $('#quality-chart').innerHTML = svg;
  $('#chart-subtitle').textContent = `${metric === 'nvs' ? 'Novel view' : 'Novel expression'} synthesis · Higher PSNR is better`;
  markPressed('[data-metric]', 'metric', metric);
}
$$('[data-metric]').forEach(button => button.addEventListener('click', () => {
  state.metric = button.dataset.metric;
  renderChart();
}));
renderChart();

const dialog = $('#image-dialog');
$$('[data-zoom]').forEach(button => button.addEventListener('click', () => {
  const source = button.querySelector('img');
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
    $('#copy-status').textContent = 'Provisional BibTeX copied.';
    $('#copy-citation').textContent = 'Copied';
    setTimeout(() => { $('#copy-citation').textContent = 'Copy BibTeX'; }, 2500);
  } catch {
    const range = document.createRange();
    range.selectNodeContents($('#bibtex'));
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    $('#copy-status').textContent = 'Citation selected. Press Ctrl+C (or Cmd+C) to copy.';
  }
});

// Match the teaser behavior of academic project pages, respecting reduced motion.
const teaser = document.querySelector('#showcase-video');
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  teaser.play().catch(() => {});
}
