const app = document.getElementById('app');
let rowCounter = 0;

const DRAFT_KEY = 'bloomy_draft';
const HISTORY_KEY = 'bloomy_history';
const THEME_KEY = 'bloomy_theme';

const CHART_COLORS = ['#bd527c', '#f2a65a', '#7d8ce0', '#6fb1c9', '#8bc78e', '#c98bd6', '#e0c15c'];

/* ---------- generic helpers ---------- */

function rupiah(n){
  return 'Rp' + Math.round(n).toLocaleString('id-ID');
}

function moneyValue(el){
  if(!el) return 0;
  return Number(String(el.value).replace(/\./g,'').replace(/[^\d]/g,'')) || 0;
}

function formatMoneyInput(el){
  const raw = el.value.replace(/\D/g,'');
  el.value = raw ? Number(raw).toLocaleString('id-ID') : '';
}

function setMoneyField(id, value){
  const el = document.getElementById(id);
  if(!el) return;
  el.value = String(value || 0);
  formatMoneyInput(el);
}

function roundUp(value, step){
  if(!step) return value;
  return Math.ceil(value / step) * step;
}

function escapeHTML(s){
  return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

function formatDate(iso){
  try{
    const d = new Date(iso);
    return d.toLocaleDateString('id-ID', { day:'numeric', month:'short', year:'numeric' })
      + ' ' + d.toLocaleTimeString('id-ID', { hour:'2-digit', minute:'2-digit' });
  }catch(e){
    return '';
  }
}

// localStorage can throw in private-browsing / disabled-storage contexts —
// every call goes through these so a storage failure never breaks the calculator.
function storageGet(key){
  try{ return localStorage.getItem(key); }catch(e){ return null; }
}
function storageSet(key, value){
  try{ localStorage.setItem(key, value); return true; }catch(e){ return false; }
}
function storageRemove(key){
  try{ localStorage.removeItem(key); }catch(e){ /* ignore */ }
}

function flowerPriceOptions(selected){
  let opts = '';
  for(let p = 1000; p <= 10000; p += 1000){
    opts += `<option value="${p}" ${p === selected ? 'selected' : ''}>Rp${p.toLocaleString('id-ID')} / tangkai</option>`;
  }
  return opts;
}

const BONEKA_OPTIONS = [
  { v: 5000,  l: 'Kecil · 8 cm — Rp5.000' },
  { v: 18000, l: 'Sedang · 12 cm — Rp18.000' },
  { v: 30000, l: 'Besar · 20 cm — Rp30.000' }
];

function bonekaOptionsHTML(selected){
  return BONEKA_OPTIONS.map(o =>
    `<option value="${o.v}" ${o.v === selected ? 'selected' : ''}>${o.l}</option>`
  ).join('');
}

/* ---------- toast (with optional undo action) ---------- */

let toastTimer = null;

function showToast(message, actionLabel, onAction, timeout = 5000){
  const toastEl = document.getElementById('toast');
  if(!toastEl) return;
  clearTimeout(toastTimer);
  toastEl.innerHTML = `<span>${escapeHTML(message)}</span>`
    + (actionLabel ? `<button type="button" id="toastActionBtn">${escapeHTML(actionLabel)}</button>` : '');
  toastEl.classList.add('show');
  if(actionLabel && onAction){
    const btn = document.getElementById('toastActionBtn');
    btn.onclick = () => { onAction(); hideToast(); };
  }
  toastTimer = setTimeout(hideToast, timeout);
}

function hideToast(){
  const toastEl = document.getElementById('toast');
  if(toastEl) toastEl.classList.remove('show');
}

/* ---------- section builder ---------- */

function section(id, icon, title, sub, innerHTML){
  // insertAdjacentHTML appends without reparsing/destroying earlier
  // sections (unlike `app.innerHTML +=`, which would wipe out any
  // listeners or dynamically-added rows from sections built before it).
  app.insertAdjacentHTML('beforeend', `
  <section id="${id}">
    <div class="sec-head"><h2>${icon} ${title}</h2></div>
    ${sub ? `<p class="sec-sub">${sub}</p>` : ''}
    ${innerHTML}
  </section>`);
}

/* ---------- Bunga (repeatable rows) ---------- */

function addFlowerRow(price = 1000, qty = 1){
  rowCounter++;
  const row = document.createElement('div');
  row.className = 'item-row';
  row.dataset.rowId = rowCounter;
  row.innerHTML = `
    <select class="flower-price">${flowerPriceOptions(price)}</select>
    <input type="number" class="qty-input flower-qty" min="1" value="${qty}" inputmode="numeric" data-min="1">
    <button type="button" class="remove-btn" aria-label="Hapus bunga ini">✕</button>
  `;
  document.getElementById('flowerRows').appendChild(row);
  scheduleAutoSave();
}

function renderBungaSection(){
  section('bunga-section', '💐', 'Bunga', 'Pilih harga per tangkai, lalu jumlahnya. Bisa gabung beberapa jenis harga.', `
    <div class="row-list" id="flowerRows"></div>
    <button type="button" class="add-row-btn" id="addFlowerBtn">＋ Tambah Bunga</button>
  `);
  addFlowerRow(1000, 1);

  document.getElementById('addFlowerBtn').addEventListener('click', () => addFlowerRow());
  document.getElementById('flowerRows').addEventListener('click', (e) => {
    if(e.target.classList.contains('remove-btn')){
      const rows = document.querySelectorAll('#flowerRows .item-row');
      if(rows.length > 1){
        const row = e.target.closest('.item-row');
        const price = Number(row.querySelector('.flower-price').value) || 1000;
        const qty = Number(row.querySelector('.flower-qty').value) || 1;
        row.remove();
        scheduleAutoSave();
        showToast('Bunga dihapus', 'Undo', () => addFlowerRow(price, qty));
      }
    }
  });
}

/* ---------- Boneka (repeatable rows, optional) ---------- */

function addBonekaRow(type = 5000, qty = 1){
  rowCounter++;
  const row = document.createElement('div');
  row.className = 'item-row';
  row.dataset.rowId = rowCounter;
  row.innerHTML = `
    <select class="boneka-type">${bonekaOptionsHTML(type)}</select>
    <input type="number" class="qty-input boneka-qty" min="1" value="${qty}" inputmode="numeric" data-min="1">
    <button type="button" class="remove-btn" aria-label="Hapus boneka ini">✕</button>
  `;
  const list = document.getElementById('bonekaRows');
  const hint = document.getElementById('bonekaEmptyHint');
  if(hint) hint.remove();
  list.appendChild(row);
  scheduleAutoSave();
}

function clearBonekaRows(){
  document.getElementById('bonekaRows').innerHTML = '<p class="empty-hint" id="bonekaEmptyHint">Belum ada boneka ditambahkan</p>';
}

function renderBonekaSection(){
  section('boneka-section', '🧸', 'Boneka', 'Opsional. Bisa pakai lebih dari satu, misalnya 1 kecil + 1 besar.', `
    <div class="row-list" id="bonekaRows">
      <p class="empty-hint" id="bonekaEmptyHint">Belum ada boneka ditambahkan</p>
    </div>
    <button type="button" class="add-row-btn" id="addBonekaBtn">＋ Tambah Boneka</button>
  `);

  document.getElementById('addBonekaBtn').addEventListener('click', () => addBonekaRow());
  document.getElementById('bonekaRows').addEventListener('click', (e) => {
    if(e.target.classList.contains('remove-btn')){
      const row = e.target.closest('.item-row');
      const type = Number(row.querySelector('.boneka-type').value) || 5000;
      const qty = Number(row.querySelector('.boneka-qty').value) || 1;
      row.remove();
      if(!document.getElementById('bonekaRows').querySelector('.item-row')){
        clearBonekaRows();
      }
      scheduleAutoSave();
      showToast('Boneka dihapus', 'Undo', () => addBonekaRow(type, qty));
    }
  });
}

/* ---------- Tambahan Lain (free-form extra items, optional) ---------- */

function addExtraRow(name = '', price = '', qty = 1){
  rowCounter++;
  const row = document.createElement('div');
  row.className = 'item-row item-row-extra';
  row.dataset.rowId = rowCounter;
  const formattedPrice = price ? Number(price).toLocaleString('id-ID') : '';
  row.innerHTML = `
    <input type="text" class="extra-name" placeholder="cth: Vas bunga" value="${escapeHTML(name)}">
    <input type="text" class="money extra-price" placeholder="Harga" value="${formattedPrice}" inputmode="numeric">
    <input type="number" class="qty-input extra-qty" min="1" value="${qty}" inputmode="numeric" data-min="1">
    <button type="button" class="remove-btn" aria-label="Hapus item ini">✕</button>
  `;
  const list = document.getElementById('extraRows');
  const hint = document.getElementById('extraEmptyHint');
  if(hint) hint.remove();
  list.appendChild(row);
  scheduleAutoSave();
}

function clearExtraRows(){
  document.getElementById('extraRows').innerHTML = '<p class="empty-hint" id="extraEmptyHint">Belum ada item tambahan</p>';
}

function renderExtraSection(){
  section('extra-section', '✨', 'Tambahan Lain', 'Opsional. Buat vas, kartu ucapan, atau item lain di luar daftar — isi nama & harganya sendiri.', `
    <div class="row-list" id="extraRows">
      <p class="empty-hint" id="extraEmptyHint">Belum ada item tambahan</p>
    </div>
    <button type="button" class="add-row-btn" id="addExtraBtn">＋ Tambah Item</button>
  `);

  document.getElementById('addExtraBtn').addEventListener('click', () => addExtraRow());
  document.getElementById('extraRows').addEventListener('click', (e) => {
    if(e.target.classList.contains('remove-btn')){
      const row = e.target.closest('.item-row');
      const name = row.querySelector('.extra-name').value;
      const price = moneyValue(row.querySelector('.extra-price'));
      const qty = Number(row.querySelector('.extra-qty').value) || 1;
      row.remove();
      if(!document.getElementById('extraRows').querySelector('.item-row')){
        clearExtraRows();
      }
      scheduleAutoSave();
      showToast('Item dihapus', 'Undo', () => addExtraRow(name, price, qty));
    }
  });
}

/* ---------- Packaging ---------- */

function renderPackagingSection(){
  section('packaging-section', '🎀', 'Packaging', 'Total biaya untuk masing-masing bahan kemasan.', `
    <div class="grid-2">
      <div><label>🧻 Cellophane</label><input class="money" id="cell" value="3.000" inputmode="numeric"></div>
      <div><label>🎗️ Pita</label><input class="money" id="ribbon" value="2.000" inputmode="numeric"></div>
    </div>
    <div class="grid-2">
      <div><label>🍃 Daun</label><input class="money" id="leaf" value="1.000" inputmode="numeric"></div>
      <div><label>🛍️ Paper Bag</label><input class="money" id="bag" value="10.000" inputmode="numeric"></div>
    </div>
  `);
}

/* ---------- Snack ---------- */

function renderSnackSection(){
  section('snack-section', '🍫', 'Snack', 'Opsional, kosongkan kalau tidak pakai.', `
    <label>Nama Snack</label>
    <input id="snackName" placeholder="cth: Silverqueen">
    <div class="grid-2">
      <div><label>Jumlah</label><input class="qty-input" id="snackQty" value="0" inputmode="numeric" data-min="0"></div>
      <div><label>Harga Satuan</label><input class="money" id="snackPrice" value="0" inputmode="numeric"></div>
    </div>
  `);
}

/* ---------- Slot Uang ---------- */

const MONEY_SLOT_OPTIONS = [
  [0,'Tidak pakai'],[25000,'5 lembar — Rp25.000'],[35000,'6–10 lembar — Rp35.000'],
  [45000,'11–15 lembar — Rp45.000'],[55000,'16–20 lembar — Rp55.000'],
  [65000,'21–25 lembar — Rp65.000'],[75000,'26–30 lembar — Rp75.000'],
  [85000,'31–35 lembar — Rp85.000'],[95000,'36–40 lembar — Rp95.000'],
  [105000,'41–45 lembar — Rp105.000'],[115000,'46–50 lembar — Rp115.000'],
  [125000,'51–55 lembar — Rp125.000'],[135000,'56–60 lembar — Rp135.000'],
  [145000,'61–65 lembar — Rp145.000'],[155000,'66–70 lembar — Rp155.000'],
  [165000,'71–75 lembar — Rp165.000'],[175000,'76–80 lembar — Rp175.000'],
  [185000,'81–85 lembar — Rp185.000'],[195000,'86–90 lembar — Rp195.000'],
  [205000,'91–95 lembar — Rp205.000'],[215000,'96–100 lembar — Rp215.000'],
];

function renderMoneySlotSection(){
  section('money-section', '💵', 'Slot Uang', 'Opsional, untuk buket yang berisi uang.', `
    <select id="money">
      ${MONEY_SLOT_OPTIONS.map(o => `<option value="${o[0]}">${o[1]}</option>`).join('')}
    </select>
  `);
}

/* ---------- Biaya, Profit, Jumlah Pesanan ---------- */

function renderCostSection(){
  section('cost-section', '⚙️', 'Biaya Operasional', '', `
    <div class="grid-2">
      <div><label>⚡ Listrik</label><input class="money" id="electric" value="5.000" inputmode="numeric"></div>
      <div><label>🧑‍🔧 Tenaga</label><input class="money" id="worker" value="25.000" inputmode="numeric"></div>
    </div>
  `);
}

function renderProfitSection(){
  section('profit-section', '📈', 'Profit', '', `
    <label>Persentase Profit (%)</label>
    <input id="profit" class="numeric-input" value="30" inputmode="numeric" data-min="0">
    <label>Pembulatan Harga Jual</label>
    <select id="roundStep">
      <option value="0">Tidak dibulatkan</option>
      <option value="500">Ke atas, kelipatan Rp500</option>
      <option value="1000">Ke atas, kelipatan Rp1.000</option>
    </select>
  `);
}

function renderOrderQtySection(){
  section('order-qty-section', '📦', 'Jumlah Pesanan', 'Kalau bikin beberapa buket yang sama persis, isi jumlahnya di sini — total pesanan otomatis ikut dihitung.', `
    <label>Jumlah Buket</label>
    <input id="orderQty" class="numeric-input" value="1" inputmode="numeric" data-min="1">
  `);
}

/* ---------- form snapshot (used by autosave, reset, and history) ---------- */

function collectFormState(){
  return {
    flowers: Array.from(document.querySelectorAll('#flowerRows .item-row')).map(row => ({
      price: Number(row.querySelector('.flower-price').value) || 1000,
      qty: Number(row.querySelector('.flower-qty').value) || 1,
    })),
    boneka: Array.from(document.querySelectorAll('#bonekaRows .item-row')).map(row => ({
      type: Number(row.querySelector('.boneka-type').value) || 5000,
      qty: Number(row.querySelector('.boneka-qty').value) || 1,
    })),
    extra: Array.from(document.querySelectorAll('#extraRows .item-row-extra')).map(row => ({
      name: row.querySelector('.extra-name').value,
      price: moneyValue(row.querySelector('.extra-price')),
      qty: Number(row.querySelector('.extra-qty').value) || 1,
    })),
    packaging: {
      cell: moneyValue(document.getElementById('cell')),
      ribbon: moneyValue(document.getElementById('ribbon')),
      leaf: moneyValue(document.getElementById('leaf')),
      bag: moneyValue(document.getElementById('bag')),
    },
    snack: {
      name: document.getElementById('snackName').value,
      qty: Number(document.getElementById('snackQty').value) || 0,
      price: moneyValue(document.getElementById('snackPrice')),
    },
    money: Number(document.getElementById('money').value) || 0,
    cost: {
      electric: moneyValue(document.getElementById('electric')),
      worker: moneyValue(document.getElementById('worker')),
    },
    profit: Number(document.getElementById('profit').value) || 0,
    roundStep: Number(document.getElementById('roundStep').value) || 0,
    orderQty: Number(document.getElementById('orderQty').value) || 1,
  };
}

function applyFormState(state){
  if(!state) return;

  document.getElementById('flowerRows').innerHTML = '';
  (state.flowers && state.flowers.length ? state.flowers : [{ price: 1000, qty: 1 }])
    .forEach(f => addFlowerRow(f.price, f.qty));

  clearBonekaRows();
  (state.boneka || []).forEach(b => addBonekaRow(b.type, b.qty));

  clearExtraRows();
  (state.extra || []).forEach(x => addExtraRow(x.name, x.price, x.qty));

  const p = state.packaging || {};
  setMoneyField('cell', p.cell ?? 3000);
  setMoneyField('ribbon', p.ribbon ?? 2000);
  setMoneyField('leaf', p.leaf ?? 1000);
  setMoneyField('bag', p.bag ?? 10000);

  const s = state.snack || {};
  document.getElementById('snackName').value = s.name || '';
  document.getElementById('snackQty').value = s.qty ?? 0;
  setMoneyField('snackPrice', s.price ?? 0);

  document.getElementById('money').value = state.money ?? 0;

  const c = state.cost || {};
  setMoneyField('electric', c.electric ?? 5000);
  setMoneyField('worker', c.worker ?? 25000);

  document.getElementById('profit').value = state.profit ?? 30;
  document.getElementById('roundStep').value = state.roundStep ?? 0;
  document.getElementById('orderQty').value = state.orderQty ?? 1;
}

function resetToDefaults(){
  applyFormState({
    flowers: [{ price: 1000, qty: 1 }],
    boneka: [],
    extra: [],
    packaging: { cell: 3000, ribbon: 2000, leaf: 1000, bag: 10000 },
    snack: { name: '', qty: 0, price: 0 },
    money: 0,
    cost: { electric: 5000, worker: 25000 },
    profit: 30,
    roundStep: 0,
    orderQty: 1,
  });
  const result = document.getElementById('result');
  if(result) result.remove();
}

/* ---------- autosave draft ---------- */

let autosaveTimer = null;

function scheduleAutoSave(){
  clearTimeout(autosaveTimer);
  autosaveTimer = setTimeout(() => {
    storageSet(DRAFT_KEY, JSON.stringify(collectFormState()));
  }, 400);
}

function restoreDraftIfAny(){
  const raw = storageGet(DRAFT_KEY);
  if(!raw) return;
  try{
    applyFormState(JSON.parse(raw));
  }catch(e){
    // corrupted draft — ignore and keep the freshly-built defaults
  }
}

/* ---------- build page ---------- */

renderBungaSection();
renderBonekaSection();
renderExtraSection();
renderPackagingSection();
renderSnackSection();
renderMoneySlotSection();
renderCostSection();
renderProfitSection();
renderOrderQtySection();
restoreDraftIfAny();

// live thousand-separator formatting for money inputs (delegated, since some are static)
app.addEventListener('input', (e) => {
  if(e.target.classList.contains('money')){
    formatMoneyInput(e.target);
  }
  if(e.target.classList.contains('qty-input') || e.target.classList.contains('numeric-input')){
    // strip anything that isn't a digit as the person types (blocks
    // letters and the minus sign in real time; final min-value check
    // happens on blur so the field isn't force-corrected mid-type)
    const digits = e.target.value.replace(/[^\d]/g, '');
    if(digits !== e.target.value) e.target.value = digits;
  }
  scheduleAutoSave();
});
app.addEventListener('change', scheduleAutoSave);

// clamp to each field's data-min once the person leaves it (focusout
// bubbles, unlike blur, so one delegated listener covers every row —
// including rows added later dynamically)
app.addEventListener('focusout', (e) => {
  if(e.target.classList.contains('qty-input') || e.target.classList.contains('numeric-input')){
    const min = Number(e.target.dataset.min ?? 0);
    let val = parseInt(e.target.value, 10);
    if(isNaN(val) || val < min) val = min;
    e.target.value = val;
    scheduleAutoSave();
  }
});

/* ---------- reset button ---------- */

const resetBtnEl = document.getElementById('resetBtn');
if(resetBtnEl){
  resetBtnEl.addEventListener('click', () => {
    if(!confirm('Reset semua input ke pengaturan awal?')) return;
    storageRemove(DRAFT_KEY);
    resetToDefaults();
    showToast('Form direset ke awal');
  });
}

/* ---------- calculation ---------- */

function sumFlowerRows(){
  let total = 0;
  document.querySelectorAll('#flowerRows .item-row').forEach(row => {
    const price = Number(row.querySelector('.flower-price').value) || 0;
    const qty = Number(row.querySelector('.flower-qty').value) || 0;
    total += price * qty;
  });
  return total;
}

function sumBonekaRows(){
  let total = 0;
  document.querySelectorAll('#bonekaRows .item-row').forEach(row => {
    const price = Number(row.querySelector('.boneka-type').value) || 0;
    const qty = Number(row.querySelector('.boneka-qty').value) || 0;
    total += price * qty;
  });
  return total;
}

function sumExtraRows(){
  // returns both the total and a per-item breakdown (each item keeps
  // its own custom name, unlike the other categories which are summed
  // into one line)
  let total = 0;
  const items = [];
  document.querySelectorAll('#extraRows .item-row-extra').forEach(row => {
    const name = row.querySelector('.extra-name').value.trim() || 'Item tambahan';
    const price = moneyValue(row.querySelector('.extra-price'));
    const qty = Number(row.querySelector('.extra-qty').value) || 0;
    const lineTotal = price * qty;
    total += lineTotal;
    if(lineTotal > 0) items.push([`✨ ${name}`, lineTotal]);
  });
  return { total, items };
}

function calculate(){
  const bunga = sumFlowerRows();
  const boneka = sumBonekaRows();
  const extra = sumExtraRows();
  const packaging = moneyValue(document.getElementById('cell'))
    + moneyValue(document.getElementById('ribbon'))
    + moneyValue(document.getElementById('leaf'))
    + moneyValue(document.getElementById('bag'));
  const snack = (Number(document.getElementById('snackQty').value) || 0)
    * moneyValue(document.getElementById('snackPrice'));
  const moneySlot = Number(document.getElementById('money').value) || 0;
  const cost = moneyValue(document.getElementById('electric'))
    + moneyValue(document.getElementById('worker'));

  const modal = bunga + boneka + extra.total + packaging + snack + moneySlot + cost;
  const profitPct = Number(document.getElementById('profit').value) || 0;
  const rawJual = modal + (modal * profitPct / 100);

  const roundStep = Number(document.getElementById('roundStep').value) || 0;
  const jual = roundUp(rawJual, roundStep);
  const profitAmount = jual - modal;

  const orderQty = Math.max(1, Number(document.getElementById('orderQty').value) || 1);
  const modalTotal = modal * orderQty;
  const jualTotal = jual * orderQty;

  const breakdown = [
    ['💐 Bunga', bunga],
    ['🧸 Boneka', boneka],
    ...extra.items,
    ['🎀 Packaging', packaging],
    ['🍫 Snack', snack],
    ['💵 Slot Uang', moneySlot],
    ['⚙️ Biaya', cost],
  ].filter(row => row[1] > 0);

  const chartCats = [
    ['Bunga', bunga, CHART_COLORS[0]],
    ['Boneka', boneka, CHART_COLORS[1]],
    ['Tambahan', extra.total, CHART_COLORS[2]],
    ['Packaging', packaging, CHART_COLORS[3]],
    ['Snack', snack, CHART_COLORS[4]],
    ['Slot Uang', moneySlot, CHART_COLORS[5]],
    ['Biaya', cost, CHART_COLORS[6]],
  ].filter(c => c[1] > 0);

  let existing = document.getElementById('result');
  if(!existing){
    existing = document.createElement('div');
    existing.className = 'result';
    existing.id = 'result';
    // append inside #app (main), so it lands right after the last
    // section — not inside the outer .app wrapper, which would put it
    // after the sticky-button spacer and create a big empty gap.
    app.appendChild(existing);
  }

  const chartHTML = (modal > 0 && chartCats.length) ? `
    <div class="cost-chart">
      <div class="cost-chart-bar">
        ${chartCats.map(c => `<div class="cost-chart-seg" style="width:${(c[1] / modal * 100).toFixed(2)}%;background:${c[2]}"></div>`).join('')}
      </div>
      <div class="cost-chart-legend">
        ${chartCats.map(c => `<span class="legend-item"><span class="legend-dot" style="background:${c[2]}"></span>${c[0]} ${(c[1] / modal * 100).toFixed(0)}%</span>`).join('')}
      </div>
    </div>` : '';

  existing.innerHTML = `
    <h2>Ringkasan Perhitungan ${orderQty > 1 ? `<span class="per-unit-tag">per buket</span>` : ''}</h2>
    <div class="breakdown">
      ${breakdown.map(r => `<div class="breakdown-row"><span>${r[0]}</span><span>${rupiah(r[1])}</span></div>`).join('') || '<div class="breakdown-row"><span>Belum ada item</span><span>Rp0</span></div>'}
    </div>
    ${chartHTML}
    <div class="result-totals">
      <div class="total-box">
        <div class="lbl">Total Modal</div>
        <b>${rupiah(modal)}</b>
      </div>
      <div class="total-box jual">
        <div class="lbl">Harga Jual</div>
        <b>${rupiah(jual)}</b>
      </div>
    </div>
    <div class="profit-tag">+ Profit ${profitPct}% = ${rupiah(profitAmount)}</div>
    ${roundStep > 0 ? `<div class="round-note">Harga jual dibulatkan ke atas, kelipatan ${rupiah(roundStep)}</div>` : ''}
    ${orderQty > 1 ? `
    <div class="order-total">
      <div class="order-total-head">📦 Total ${orderQty} Buket</div>
      <div class="result-totals">
        <div class="total-box">
          <div class="lbl">Total Modal</div>
          <b>${rupiah(modalTotal)}</b>
        </div>
        <div class="total-box jual">
          <div class="lbl">Total Harga Jual</div>
          <b>${rupiah(jualTotal)}</b>
        </div>
      </div>
    </div>` : ''}
    <div class="result-actions">
      <button type="button" class="wa-btn" id="waShareBtn">📲 WhatsApp</button>
      <button type="button" id="saveHistoryBtn">💾 Simpan</button>
    </div>
  `;

  window.lastCalc = { breakdown, modal, jual, modalTotal, jualTotal, orderQty, profitPct, roundStep };

  document.getElementById('waShareBtn').addEventListener('click', shareToWhatsApp);
  document.getElementById('saveHistoryBtn').addEventListener('click', saveToHistory);

  existing.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/* ---------- WhatsApp share ---------- */

function shareToWhatsApp(){
  const calc = window.lastCalc;
  if(!calc) return;
  const lines = [];
  lines.push('🌷 Ringkasan Buket - Bloomy');
  lines.push('');
  calc.breakdown.forEach(r => lines.push(`${r[0]}: ${rupiah(r[1])}`));
  lines.push('');
  lines.push(`Total Modal: ${rupiah(calc.modal)}`);
  lines.push(`Harga Jual: ${rupiah(calc.jual)}`);
  if(calc.orderQty > 1){
    lines.push('');
    lines.push(`Total ${calc.orderQty} Buket`);
    lines.push(`Total Modal: ${rupiah(calc.modalTotal)}`);
    lines.push(`Total Harga Jual: ${rupiah(calc.jualTotal)}`);
  }
  const text = lines.join('\n');
  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
}

/* ---------- save / load history ---------- */

function readHistory(){
  try{
    return JSON.parse(storageGet(HISTORY_KEY) || '[]');
  }catch(e){
    return [];
  }
}

function writeHistory(history){
  storageSet(HISTORY_KEY, JSON.stringify(history));
}

function saveToHistory(){
  const calc = window.lastCalc;
  if(!calc) return;
  const suggested = 'Pesanan ' + new Date().toLocaleDateString('id-ID', { day:'numeric', month:'short' });
  const name = prompt('Simpan dengan nama apa?', suggested);
  if(!name || !name.trim()) return;

  const entry = {
    id: Date.now(),
    name: name.trim(),
    savedAt: new Date().toISOString(),
    state: collectFormState(),
    modal: calc.modal,
    jual: calc.jual,
    orderQty: calc.orderQty,
    modalTotal: calc.modalTotal,
    jualTotal: calc.jualTotal,
  };
  const history = readHistory();
  history.unshift(entry);
  writeHistory(history);
  showToast(`Tersimpan sebagai "${entry.name}"`);
}

function renderHistoryList(){
  const container = document.getElementById('historyList');
  if(!container) return;
  const history = readHistory();
  if(!history.length){
    container.innerHTML = '<p class="empty-hint">Belum ada riwayat tersimpan</p>';
    return;
  }
  container.innerHTML = history.map(h => `
    <div class="history-card">
      <div class="history-info">
        <div class="history-name">${escapeHTML(h.name)}</div>
        <div class="history-meta">${formatDate(h.savedAt)} · ${rupiah(h.jual)}${h.orderQty > 1 ? ` × ${h.orderQty}` : ''}</div>
      </div>
      <div class="history-actions">
        <button type="button" class="load-btn" data-id="${h.id}">Buka</button>
        <button type="button" class="del-btn" data-id="${h.id}">🗑</button>
      </div>
    </div>
  `).join('');
}

function closeHistoryPanel(){
  const overlay = document.getElementById('historyOverlay');
  if(overlay) overlay.classList.remove('open');
}

function openHistoryPanel(){
  renderHistoryList();
  const overlay = document.getElementById('historyOverlay');
  if(overlay) overlay.classList.add('open');
}

const historyBtnEl = document.getElementById('historyBtn');
if(historyBtnEl) historyBtnEl.addEventListener('click', openHistoryPanel);

const closeHistoryBtnEl = document.getElementById('closeHistoryBtn');
if(closeHistoryBtnEl) closeHistoryBtnEl.addEventListener('click', closeHistoryPanel);

const historyOverlayEl = document.getElementById('historyOverlay');
if(historyOverlayEl){
  historyOverlayEl.addEventListener('click', (e) => {
    if(e.target === historyOverlayEl) closeHistoryPanel();
  });
}

const historyListEl = document.getElementById('historyList');
if(historyListEl){
  historyListEl.addEventListener('click', (e) => {
    const loadBtn = e.target.closest('.load-btn');
    const delBtn = e.target.closest('.del-btn');

    if(loadBtn){
      const id = Number(loadBtn.dataset.id);
      const entry = readHistory().find(h => h.id === id);
      if(entry){
        applyFormState(entry.state);
        scheduleAutoSave();
        closeHistoryPanel();
        calculate();
        showToast(`Dimuat: "${entry.name}"`);
      }
    } else if(delBtn){
      const id = Number(delBtn.dataset.id);
      if(!confirm('Hapus riwayat ini?')) return;
      writeHistory(readHistory().filter(h => h.id !== id));
      renderHistoryList();
    }
  });
}

/* ---------- dark mode ---------- */

function applyTheme(theme){
  document.documentElement.setAttribute('data-theme', theme);
  const btn = document.getElementById('themeBtn');
  if(btn) btn.textContent = theme === 'dark' ? '☀️' : '🌙';
}

function initTheme(){
  let theme = storageGet(THEME_KEY);
  if(!theme){
    theme = (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light';
  }
  applyTheme(theme);
}

const themeBtnEl = document.getElementById('themeBtn');
if(themeBtnEl){
  themeBtnEl.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    storageSet(THEME_KEY, next);
    applyTheme(next);
  });
}

initTheme();
