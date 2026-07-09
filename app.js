function clean(v){return Number(String(v).replace(/\./g,''))||0}
function format(e){e.addEventListener('input',()=>{let x=e.value.replace(/\D/g,'');e.value=x?Number(x).toLocaleString('id-ID'):''})}
document.querySelectorAll('.harga').forEach(format);

function card(parent,title,price){
parent.innerHTML+=`<div class="item"><b>${title}</b><label>Jumlah</label><input class="qty" value="0"><label>Harga</label><input class="harga" value="${price}"></div>`;
document.querySelectorAll('.harga').forEach(format);
}

let c=0;
function addFlower(){
c++;
flower.innerHTML+=`<div class="item"><b>🌸 Bunga ${c}</b><label>Jumlah</label><input class="qty" value="1"><label>Harga</label><input class="harga" value="5000"></div>`;
document.querySelectorAll('.harga').forEach(format);
}
addFlower();

card(boneka,'🧸 Boneka 8 cm',5000);
card(boneka,'🧸 Boneka 12 cm',18000);
card(boneka,'🧸 Boneka 20 cm',30000);
card(pack,'📄 Cellophane',3000);
card(pack,'🎀 Pita',2000);
card(pack,'🍃 Daun',1000);
card(pack,'🛍 Paper Bag',10000);

function hitung(){
let total=0;
document.querySelectorAll('.item').forEach(x=>{
let q=x.querySelector('.qty');
let h=x.querySelector('.harga');
if(q&&h) total+=Number(q.value||0)*clean(h.value);
});
total+=clean(listrik.value)+clean(tenaga.value)+clean(jasa.value);
total+=Number(snackQty.value||0)*clean(snackPrice.value);
let jual=total+(total*Number(profit.value||0)/100);
hasil.innerHTML=`Total Modal<br><b>Rp${total.toLocaleString('id-ID')}</b><br><br>Harga Jual<br><b>Rp${Math.round(jual).toLocaleString('id-ID')}</b>`;
}
