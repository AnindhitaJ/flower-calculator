const root=document.getElementById('sections');

function money(e){
e.addEventListener('input',()=>{
let v=e.value.replace(/\D/g,'');
e.value=v?Number(v).toLocaleString('id-ID'):'';
});
}
function addSection(title,items){
let s=document.createElement('section');
s.className='card';
s.innerHTML='<h2>'+title+'</h2>';
items.forEach(i=>{
s.innerHTML+=`
<div class="item">
<b>${i}</b>
<label>Jumlah</label>
<input class="qty" value="0">
<label>Harga</label>
<input class="harga" value="0" placeholder="Rp">
</div>`;
});
root.appendChild(s);
}

addSection('💐 Bunga',['Bunga']);
addSection('🧸 Boneka',['Boneka 8 cm','Boneka 12 cm','Boneka 20 cm']);
addSection('🎀 Packaging',['Cellophane','Pita','Daun','Paper Bag']);
addSection('🍫 Snack',['Snack']);
addSection('💵 Slot Uang',['Slot Uang']);

addSection('⚙️ Biaya',['Listrik','Tenaga']);

let profit=document.createElement('section');
profit.className='card';
profit.innerHTML='<h2>📈 Profit</h2><label>Persentase Profit (%)</label><input id="profit" value="30">';
root.appendChild(profit);

document.querySelectorAll('.harga').forEach(money);

document.getElementById('calculate').onclick=()=>{
let modal=0;
document.querySelectorAll('.item').forEach(x=>{
let q=x.querySelector('.qty').value||0;
let h=x.querySelector('.harga').value.replace(/\./g,'')||0;
modal+=Number(q)*Number(h);
});
let p=Number(document.getElementById('profit').value)||0;
let jual=modal+(modal*p/100);
document.getElementById('modal').innerHTML='Rp'+modal.toLocaleString('id-ID');
document.getElementById('jual').innerHTML='Rp'+Math.round(jual).toLocaleString('id-ID');
};
