let bungaCount = 0;

function formatRupiah(nilai) {
  return "Rp" + Number(nilai).toLocaleString("id-ID");
}

function tambahBunga() {
  bungaCount++;
  const row = document.createElement("div");
  row.className = "bunga-row";
  row.innerHTML = `
    <div class="bunga-label">Bunga ${bungaCount}</div>
    <input class="bungaQty" type="number" min="0" value="1" />
    <select class="bungaHarga">
      <option value="1000">Rp1.000</option>
      <option value="2000">Rp2.000</option>
      <option value="3000">Rp3.000</option>
      <option value="4000">Rp4.000</option>
      <option value="5000">Rp5.000</option>
    </select>
  `;
  document.getElementById("bungaArea").appendChild(row);
}

function updateBonekaHarga() {
  const tipe = document.getElementById("bonekaTipe").value;
  document.getElementById("bonekaHarga").value = tipe;
}

function hitung() {
  let modal = 0;

  document.querySelectorAll(".bunga-row").forEach((row) => {
    const qty = Number(row.querySelector(".bungaQty").value || 0);
    const harga = Number(row.querySelector(".bungaHarga").value || 0);
    modal += qty * harga;
  });

  modal += Number(document.getElementById("bonekaQty").value || 0) * Number(document.getElementById("bonekaHarga").value || 0);
  modal += Number(document.getElementById("daunQty").value || 0) * Number(document.getElementById("daunHarga").value || 0);
  modal += Number(document.getElementById("celloQty").value || 0) * Number(document.getElementById("celloHarga").value || 0);
  modal += Number(document.getElementById("tissuQty").value || 0) * Number(document.getElementById("tissuHarga").value || 0);

  modal += Number(document.getElementById("listrik").value || 0);
  modal += Number(document.getElementById("tenaga").value || 0);
  modal += Number(document.getElementById("jasa").value || 0);

  const persenProfit = Number(document.getElementById("profit").value || 0);
  const hargaJual = modal + (modal * persenProfit / 100);

  document.getElementById("modalText").textContent = formatRupiah(Math.round(modal));
  document.getElementById("profitText").textContent = persenProfit + "%";
  document.getElementById("jualText").textContent = formatRupiah(Math.round(hargaJual));
}

tambahBunga();
updateBonekaHarga();
hitung();
