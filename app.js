function clean(v){return Number(String(v).replace(/\./g,''))||0}
function format(e){e.addEventListener('input',()=>{let x=e.value.replace(/\D/g,'');e.value=x?Number(x).toLocaleString('id-ID'):''})}
function setup(){document.querySelectorAll('.harga').forEach(format)}
let count=0;
function addFlower(){count++;let d=document.createElement('div');d.className='box';d.innerHTML='🌸 Bunga '+count+'<input class="qty" value="1"><input class="harga" value="5000">';flowers.appendChild(d);setup()}
addFlower();setup();
function n(id){return clean(document.getElementById(id).value)}
function hitung(){let t=0;document.querySelectorAll('.box').forEach(x=>{let q=x.querySelector('.qty'),h=x.querySelector('.harga');if(q&&h)t+=Number(q.value)*clean(h.value)});t+=n('listrik')+n('tenaga')+n('jasa');let j=t+t*Number(profit.value)/100;hasil.innerHTML='Modal<br><b>Rp'+t.toLocaleString('id-ID')+'</b><br><br>Harga Jual<br><b>Rp'+Math.round(j).toLocaleString('id-ID')+'</b>'}