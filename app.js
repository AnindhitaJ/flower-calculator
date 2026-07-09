function bersih(v){return Number(String(v).replace(/\./g,''))||0}
function format(el){el.addEventListener('input',()=>{let x=el.value.replace(/\D/g,'');el.value=x?Number(x).toLocaleString('id-ID'):''})}
document.querySelectorAll('.harga').forEach(format);

let flower=0;
function addFlower(){
flower++;
let d=document.createElement('div');
d.className='box';
d.innerHTML=`🌸 Bunga ${flower}<input class="qty" value="1"><input class="harga" value="5000">`;
flowers.appendChild(d);
document.querySelectorAll('.harga').forEach(format);
}
addFlower();

let bonekaData=[['Boneka 8 cm','b8'],['Boneka 12 cm','b12'],['Boneka 20 cm','b20']];
bonekaData.forEach(x=>{
boneka.innerHTML+=`<div class="box">${x[0]}<input class="qty" id="${x[1]}q" value="0"><input class="harga" id="${x[1]}p" value="0"></div>`;
});
document.querySelectorAll('.harga').forEach(format);

function n(id){return bersih(document.getElementById(id).value)}
function hitung(){
let total=0;
document.querySelectorAll('.box').forEach(x=>{
let q=x.querySelector('.qty');let h=x.querySelector('.harga');
if(q&&h) total+=Number(q.value)*bersih(h.value);
});
[['cq','cp'],['pq','pp'],['dq','dp'],['pbq','pbp']].forEach(a=>total+=n(a[0])*n(a[1]));
total+=n('listrik')+n('tenaga')+n('jasa');
let jual=total+(total*Number(profit.value)/100);
hasil.innerHTML=`Modal<br><b>Rp${total.toLocaleString('id-ID')}</b><br><br>Harga Jual<br><b>Rp${Math.round(jual).toLocaleString('id-ID')}</b>`;
}
