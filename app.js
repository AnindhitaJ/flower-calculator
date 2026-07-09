let n=0;
function addFlower(){
n++;
let d=document.createElement('div');
d.className='flower';
d.innerHTML=`🌸 Bunga ${n}
<input class="qty" value="1">
<select class="price">
<option value="5000">Besar Rp5.000</option>
<option value="3000">Sedang Rp3.000</option>
<option value="1000">Kecil Rp1.000</option>
</select>`;
flowers.appendChild(d);
}
addFlower();

function v(id){return Number(document.getElementById(id).value||0)}
function rupiah(x){return "Rp"+Math.round(x).toLocaleString("id-ID")}

function hitung(){
let modal=0;
document.querySelectorAll('.flower').forEach(x=>{
modal+=v2(x.querySelector('.qty').value)*v2(x.querySelector('.price').value);
});
[
['b8q','b8p'],['b12q','b12p'],['b20q','b20p'],
['cq','cp'],['pq','pp'],['dq','dp'],['plq','plp'],['pbq','pbp']
].forEach(a=>modal+=v(a[0])*v(a[1]));

modal+=v('listrik')+v('tenaga')+v('jasa');

let jual=modal+(modal*v('profit')/100);

hasil.innerHTML=`Modal<br><b>${rupiah(modal)}</b><br><br>Harga Jual<br><b>${rupiah(jual)}</b>`;
}
function v2(x){return Number(x||0)}
