let n=0;
function addFlower(){n++;let x=document.createElement('div');x.className='flower';x.innerHTML=`Bunga ${n}<input class=q value=1><select class=h><option value=5000>Besar 5000</option><option value=3000>Sedang 3000</option><option value=1000>Kecil 1000</option></select>`;flowers.appendChild(x)}
addFlower();
function num(id){return Number(document.getElementById(id).value||0)}
function hitung(){let t=0;document.querySelectorAll('.flower').forEach(x=>t+=num2(x.querySelector('.q').value)*num2(x.querySelector('.h').value));t+=num('b8')*5000+num('b12')*18000+num('b20')*30000;t+=num('cqty')*num('cprice')+num('pqty')*num('pprice')+num('dqty')*num('dprice')+num('plqty')*num('plprice')+num('pbqty')*num('pbprice');t+=num('listrik')+num('tenaga')+num('jasa');let j=t+(t*num('profit')/100);hasil.innerHTML='Modal Rp'+t.toLocaleString('id-ID')+'<br>Harga Jual Rp'+Math.round(j).toLocaleString('id-ID')}
function num2(x){return Number(x||0)}
