let count=0;

function addFlower(){
 count++;
 let d=document.createElement('div');
 d.className='flower';
 d.innerHTML=`
 <b>Bunga ${count}</b>
 <input class="qty" type="number" value="1">
 <select class="price">
 <option value="1000">Kecil 1000</option>
 <option value="3000">Sedang 3000</option>
 <option value="5000">Besar 5000</option>
 </select>`;
 document.getElementById('flowers').appendChild(d);
}
addFlower();

function hitung(){
let total=0;
document.querySelectorAll('.flower').forEach(f=>{
 total += Number(f.querySelector('.qty').value)*Number(f.querySelector('.price').value);
});

total += Number(bonekaQty.value)*Number(bonekaPrice.value);
total += Number(daun.value)*1000;
total += Number(cello.value)*3000;
total += Number(tissu.value)*1000;
total += Number(listrik.value)+Number(tenaga.value)+Number(jasa.value);

let jual=total+(total*Number(profit.value)/100);

result.innerHTML=`Modal: Rp${total.toLocaleString('id-ID')}<br>Harga Jual: Rp${Math.round(jual).toLocaleString('id-ID')}`;
}
