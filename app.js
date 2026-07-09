function angka(v){return Number(String(v).replace(/\./g,''))||0}
function rupiah(v){return Number(v).toLocaleString('id-ID')}

document.querySelectorAll('.nominal').forEach(el=>{
 el.addEventListener('input',()=>{
  let x=el.value.replace(/\D/g,'');
  el.value=x?rupiah(x):'';
 });
});

let n=0;
function addFlower(){
 n++;
 let d=document.createElement('div');
 d.className='flower';
 d.innerHTML=`Bunga ${n}<input class="qty" value="1"><select class="price"><option value="1000">Rp1.000</option><option value="2000">Rp2.000</option><option value="3000">Rp3.000</option><option value="4000">Rp4.000</option><option value="5000">Rp5.000</option><option value="10000">Rp10.000</option></select>`;
 flowers.appendChild(d);
}
addFlower();

function v(id){return angka(document.getElementById(id).value)}
function hitung(){
 let total=0;
 document.querySelectorAll('.flower').forEach(x=>total+=Number(x.querySelector('.qty').value)*Number(x.querySelector('.price').value));
 total+=v('cq')*v('cp')+v('pq')*v('pp')+v('dq')*v('dp')+v('pbq')*v('pbp');
 total+=v('listrik')+v('tenaga')+v('jasa');
 let jual=total+(total*Number(profit.value)/100);
 hasil.innerHTML='Modal<br><b>Rp'+rupiah(total)+'</b><br><br>Harga Jual<br><b>Rp'+rupiah(Math.round(jual))+'</b>';
}
