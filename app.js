const app = document.getElementById('app');
let rowCounter = 0;

/* ---------- helpers ---------- */

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
    <input type="number" class="qty-input flower-qty" min="1" value="${qty}" inputmode="numeric">
    <button type="button" class="remove-btn" aria-label="Hapus bunga ini">✕</button>
  `;
  document.getElementById('flowerRows').appendChild(row);
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
        e.target.closest('.item-row').remove();
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
    <input type="number" class="qty-input boneka-qty" min="1" value="${qty}" inputmode="numeric">
    <button type="button" class="remove-btn" aria-label="Hapus boneka ini">✕</button>
  `;
  const list = document.getElementById('bonekaRows');
  const hint = document.getElementById('bonekaEmptyHint');
  if(hint) hint.remove();
  list.appendChild(row);
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
      e.target.closest('.item-row').remove();
      const list = document.getElementById('bonekaRows');
      if(!list.querySelector('.item-row')){
        list.innerHTML = '<p class="empty-hint" id="bonekaEmptyHint">Belum ada boneka ditambahkan</p>';
      }
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
      <div><label>Jumlah</label><input class="qty-input" id="snackQty" value="0" inputmode="numeric"></div>
      <div><label>Harga Satuan</label><input class="money" id="snackPrice" value="0" inputmode="numeric"></div>
    </div>
  `);
}

/* ---------- Slot Uang ---------- */

function renderMoneySlotSection(){
  const opts = [
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
  section('money-section', '💵', 'Slot Uang', 'Opsional, untuk buket yang berisi uang.', `
    <select id="money">
      ${opts.map(o => `<option value="${o[0]}">${o[1]}</option>`).join('')}
    </select>
  `);
}

/* ---------- Biaya & Profit ---------- */

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
    <input id="profit" value="30" inputmode="numeric">
  `);
}

/* ---------- build page ---------- */

renderBungaSection();
renderBonekaSection();
renderPackagingSection();
renderSnackSection();
renderMoneySlotSection();
renderCostSection();
renderProfitSection();

// live thousand-separator formatting for money inputs (delegated, since some are static)
app.addEventListener('input', (e) => {
  if(e.target.classList.contains('money')){
    formatMoneyInput(e.target);
  }
});

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

function calculate(){
  const bunga = sumFlowerRows();
  const boneka = sumBonekaRows();
  const packaging = moneyValue(document.getElementById('cell'))
    + moneyValue(document.getElementById('ribbon'))
    + moneyValue(document.getElementById('leaf'))
    + moneyValue(document.getElementById('bag'));
  const snack = (Number(document.getElementById('snackQty').value) || 0)
    * moneyValue(document.getElementById('snackPrice'));
  const moneySlot = Number(document.getElementById('money').value) || 0;
  const cost = moneyValue(document.getElementById('electric'))
    + moneyValue(document.getElementById('worker'));

  const modal = bunga + boneka + packaging + snack + moneySlot + cost;
  const profitPct = Number(document.getElementById('profit').value) || 0;
  const profitAmount = modal * profitPct / 100;
  const jual = modal + profitAmount;

  const breakdown = [
    ['💐 Bunga', bunga],
    ['🧸 Boneka', boneka],
    ['🎀 Packaging', packaging],
    ['🍫 Snack', snack],
    ['💵 Slot Uang', moneySlot],
    ['⚙️ Biaya', cost],
  ].filter(row => row[1] > 0);

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

  existing.innerHTML = `
    <h2>Ringkasan Perhitungan</h2>
    <div class="breakdown">
      ${breakdown.map(r => `<div class="breakdown-row"><span>${r[0]}</span><span>${rupiah(r[1])}</span></div>`).join('') || '<div class="breakdown-row"><span>Belum ada item</span><span>Rp0</span></div>'}
    </div>
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
  `;
  existing.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}
