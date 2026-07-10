function clean(v){return Number(String(v).replace(/\./g,''))||0}
function format(e){e.addEventListener('input',()=>{let x=e.value.replace(/\D/g,'');e.value=x?Number(x).toLocaleString('id-ID'):''})}
document.querySelectorAll('.harga').forEach(format);

function addCard(parent,title,price){
let d=document.createElement('div');
d.className='item';
d.innerHTML=`<b>${title}</b><label>Jumlah</label><input class="qty" value="0"><label>Harga</label><input class="harga" value="${price}">`;
parent.appendChild(d);
document.querySelectorAll('.harga').forEach(format);
}

let flowerCount=0;
function addFlower(){
flowerCount++;
addCard(document.getElementById('flowers'),'🌸 Bunga '+flowerCount,5000);
}
addFlower();

addCard(boneka,'🧸 Boneka 8 cm',5000);
addCard(boneka,'🧸 Boneka 12 cm',18000);
addCard(boneka,'🧸 Boneka 20 cm',30000);

addCard(packaging,'📄 Cellophane',3000);
addCard(packaging,'🎀 Pita',2000);
addCard(packaging,'🍃 Daun',1000);
addCard(packaging,'🛍 Paper Bag',10000);

function hitung(){
let modal=0;
document.querySelectorAll('.item').forEach(x=>{
let q=x.querySelector('.qty'),h=x.querySelector('.harga');
if(q&&h) modal+=Number(q.value||0)*clean(h.value);
});
modal+=clean(listrik.value)+clean(tenaga.value)+clean(jasa.value);
modal+=Number(snackQty.value||0)*clean(snackPrice.value);
modal+=Number(moneySlot.value||0);
let jual=modal+(modal*Number(profit.value||0)/100);
result.innerHTML=`Total Modal<br><h2>Rp${modal.toLocaleString('id-ID')}</h2>Harga Jual<br><h1>Rp${Math.round(jual).toLocaleString('id-ID')}</h1>`;
}
