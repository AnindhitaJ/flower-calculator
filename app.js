let flowerCount = 0;

function createFlowerPriceOptions() {
  const prices = [1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000];
  return prices.map(price => `<option value="${price}">Rp${price.toLocaleString('id-ID')}</option>`).join("");
}

function addFlower() {
  flowerCount++;
  const flower = document.createElement("div");
  flower.className = "flower";
  flower.innerHTML = `
    <div class="flower-title">🌸 Bunga ${flowerCount}</div>
    <div class="flower-grid">
      <input class="qty" type="number" min="0" value="1" placeholder="Jumlah" />
      <select class="price">
        ${createFlowerPriceOptions()}
      </select>
    </div>
  `;
  document.getElementById("flowers").appendChild(flower);
}

function valueOf(id) {
  return Number(document.getElementById(id).value || 0);
}

function rupiah(x) {
  return "Rp" + Math.round(x).toLocaleString("id-ID");
}

function hitung() {
  let modal = 0;

  document.querySelectorAll(".flower").forEach(flower => {
    const qty = Number(flower.querySelector(".qty").value || 0);
    const price = Number(flower.querySelector(".price").value || 0);
    modal += qty * price;
  });

  [
    ["b8q","b8p"], ["b12q","b12p"], ["b20q","b20p"],
    ["cq","cp"], ["pq","pp"], ["dq","dp"], ["plq","plp"], ["pbq","pbp"]
  ].forEach(([qtyId, priceId]) => {
    modal += valueOf(qtyId) * valueOf(priceId);
  });

  modal += valueOf("listrik") + valueOf("tenaga") + valueOf("jasa");

  const hargaJual = modal + (modal * valueOf("profit") / 100);

  document.getElementById("hasil").innerHTML = `
    <div class="summary-block">
      <div class="label">Total Modal</div>
      <div class="value">${rupiah(modal)}</div>
    </div>
    <div class="divider"></div>
    <div class="summary-block">
      <div class="label">Harga Jual</div>
      <div class="value accent">${rupiah(hargaJual)}</div>
    </div>
  `;
}

addFlower();
hitung();
