function cleanNumber(value) {
  return Number(String(value).replace(/\./g, "")) || 0;
}

function attachRupiahFormatter(el) {
  if (el.dataset.formatted === "yes") return;
  el.dataset.formatted = "yes";
  el.addEventListener("input", () => {
    const raw = el.value.replace(/\D/g, "");
    el.value = raw ? Number(raw).toLocaleString("id-ID") : "";
  });
  const initial = el.value.replace(/\D/g, "");
  el.value = initial ? Number(initial).toLocaleString("id-ID") : "";
}

function setupHargaFields() {
  document.querySelectorAll(".harga").forEach(attachRupiahFormatter);
}

let flowerCount = 0;

function addFlower() {
  flowerCount++;
  const box = document.createElement("div");
  box.className = "flower-box";
  box.innerHTML = `
    <div class="item-title">🌸 Bunga ${flowerCount}</div>
    <div class="field-label">Jumlah</div>
    <input class="qty" type="number" min="0" value="1">
    <div class="field-label">Harga</div>
    <input class="harga flower-price" type="text" value="5000">
  `;
  document.getElementById("flowers").appendChild(box);
  setupHargaFields();
}

function n(id) {
  return cleanNumber(document.getElementById(id).value);
}

function hitung() {
  let total = 0;

  document.querySelectorAll(".flower-box").forEach(box => {
    const qty = Number(box.querySelector(".qty").value || 0);
    const harga = cleanNumber(box.querySelector(".harga").value);
    total += qty * harga;
  });

  [
    ["b8q","b8p"],["b12q","b12p"],["b20q","b20p"],
    ["cq","cp"],["pq","pp"],["dq","dp"],["pbq","pbp"]
  ].forEach(([qtyId, hargaId]) => {
    total += n(qtyId) * n(hargaId);
  });

  total += n("listrik") + n("tenaga") + n("jasa");

  const profit = Number(document.getElementById("profit").value || 0);
  const jual = total + (total * profit / 100);

  document.getElementById("hasil").innerHTML = `
    <div class="result-label">Total Modal</div>
    <div class="result-value">Rp${Math.round(total).toLocaleString("id-ID")}</div>
    <div class="result-separator"></div>
    <div class="result-label">Harga Jual</div>
    <div class="result-value accent">Rp${Math.round(jual).toLocaleString("id-ID")}</div>
  `;
}

addFlower();
setupHargaFields();
hitung();
