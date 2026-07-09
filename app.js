function rupiahInput(e){
e.addEventListener('input',()=>{
let x=e.value.replace(/\D/g,'');
e.value=x?Number(x).toLocaleString('id-ID'):'';
});
}
function clean(v){return Number(String(v).replace(/\./g,''))||0}

let flower=0;
function addFlower(){
flower++;
let d=document.createElement('div');
d.className='item';
d.innerHTML=`🌸 Bunga ${flower}
<label>Jumlah</label>
<input class="qty" value="1">
<label>Harga</label>
<input class="harga" value="5000">`;
flowers.appendChild(d);
document.querySelectorAll('.harga').forEach(rupiahInput);
}

function makeProduct(target,name,price){
target.innerHTML+=`
<div class="item">
<h3>${name}</h3>
<label>Jumlah</label>
<input class="qty" value="0">
<label>Harga</label>
<input class="harga" value="${price}">
</div>`;
}

addFlower();

makeProduct(boneka,"Boneka 8 cm","5000");
makeProduct(boneka,"Boneka 12 cm","18000");
makeProduct(boneka,"Boneka 20 cm","30000");

makeProduct(package,"📄 Cellophane","3000");
makeProduct(package,"🎀 Pita","2000");
makeProduct(package,"🍃 Daun","1000");
makeProduct(package,"🛍️ Paper Bag","10000");

document.querySelectorAll('.harga').forEach(rupiahInput);

function hitung(){
let total=0;

document.querySelectorAll('.item').forEach(x=>{
let q=x.querySelector('.qty');
let h=x.querySelector('.harga');
if(q&&h) total+=Number(q.value)*clean(h.value);
});

total+=clean(listrik.value)+clean(tenaga.value)+clean(jasa.value);
total+=Number(snackQty.value)*clean(snackPrice.value);

let jual=total+(total*Number(profit.value)/100);

modal.innerHTML="Rp"+total.toLocaleString('id-ID');
jual.innerHTML="Rp"+Math.round(jual).toLocaleString('id-ID');
}
