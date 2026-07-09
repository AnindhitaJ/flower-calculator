let n=0;
function addFlower(){
n++;
let d=document.createElement('div');
d.className='flower';
d.innerHTML=`
<div class="flower-head">🌸 Bunga ${n}</div>
<div class="two">
<input value="1" placeholder="Jumlah">
<select>
<option>Besar - Rp5.000</option>
<option>Sedang - Rp3.000</option>
<option>Kecil - Rp1.000</option>
</select>
</div>`;
flowers.appendChild(d);
}
addFlower();
