let count=0;
function addFlower(){
count++;
let d=document.createElement('div');
d.className='flower';
d.innerHTML=`🌸 Bunga ${count}<input class="qty" value="1"><select class="nominal"><option value="1000">Rp1.000</option><option value="5000">Rp5.000</option><option value="10000">Rp10.000</option></select>`;
flowers.appendChild(d);
document.querySelectorAll('.nominal').forEach(format);
}
function format(el){
el.addEventListener('input',()=>{let x=el.value.replace(/\D/g,'');el.value=x?Number(x).toLocaleString('id-ID'):''})
}
document.querySelectorAll('.nominal').forEach(format);
addFlower();
function n(id){return Number(document.getElementById(id).value.replace(/\./g,''))||0}
function hitung(){
let total=0;
document.querySelectorAll('.flower').forEach(x=>total+=Number(x.querySelector('.qty').value)*Number(x.querySelector('.nominal').value));
[['b8q','b8p'],['b12q','b12p'],['b20q','b20p'],['cq','cp'],['pq','pp'],['dq','dp'],['pbq','pbp']].forEach(x=>total+=n(x[0])*n(x[1]));
total+=n('listrik')+n('tenaga')+n('jasa');
let jual=total+(total*n('profit')/100);
hasil.innerHTML='Modal<br><b>Rp'+total.toLocaleString('id-ID')+'</b><br><br>Harga Jual<br><b>Rp'+Math.round(jual).toLocaleString('id-ID')+'</b>';
}
