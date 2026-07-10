const app=document.getElementById('app');

function section(title,html){
app.innerHTML+=`<section><h2>${title}</h2>${html}</section>`;
}

function input(label,id,value=''){
return `<label>${label}</label><input id="${id}" value="${value}">`;
}

section('💐 Bunga',
input('Jumlah bunga','flowerQty','1')+
input('Harga bunga','flowerPrice','5000'));

section('🧸 Boneka',
`<label>Pilihan Boneka</label>
<select id="boneka">
<option value="0">Tidak pakai</option>
<option value="5000">Boneka 8 cm - Rp5.000</option>
<option value="18000">Boneka 12 cm - Rp18.000</option>
<option value="30000">Boneka 20 cm - Rp30.000</option>
</select>`);

section('🎀 Packaging',
input('Cellophane (lembar)','cell','3000')+
input('Pita (meter)','ribbon','2000')+
input('Daun (batang)','leaf','1000')+
input('Paper Bag','bag','10000'));

section('🍫 Snack',
input('Nama Snack','snackName')+
input('Jumlah Snack','snackQty','0')+
input('Harga Snack','snackPrice','0'));

section('💵 Slot Uang',
`<label>Pilih Slot Uang</label>
<select id="money">
<option value="0">Tidak pakai</option>
<option value="25000">5 lembar - Rp25.000</option>
<option value="35000">6-10 lembar - Rp35.000</option>
<option value="45000">11-15 lembar - Rp45.000</option>
<option value="55000">16-20 lembar - Rp55.000</option>
<option value="65000">21-25 lembar - Rp65.000</option>
<option value="75000">26-30 lembar - Rp75.000</option>
<option value="85000">31-35 lembar - Rp85.000</option>
<option value="95000">36-40 lembar - Rp95.000</option>
<option value="105000">41-45 lembar - Rp105.000</option>
<option value="115000">46-50 lembar - Rp115.000</option>
<option value="125000">51-55 lembar - Rp125.000</option>
<option value="135000">56-60 lembar - Rp135.000</option>
<option value="145000">61-65 lembar - Rp145.000</option>
<option value="155000">66-70 lembar - Rp155.000</option>
<option value="165000">71-75 lembar - Rp165.000</option>
<option value="175000">76-80 lembar - Rp175.000</option>
<option value="185000">81-85 lembar - Rp185.000</option>
<option value="195000">86-90 lembar - Rp195.000</option>
<option value="205000">91-95 lembar - Rp205.000</option>
<option value="215000">96-100 lembar - Rp215.000</option>
</select>`);

section('⚙️ Biaya',
input('Listrik','electric','5000')+
input('Tenaga','worker','25000'));

section('📈 Profit',
input('Persentase Profit (%)','profit','30'));

function num(id){
return Number(document.getElementById(id).value.replace(/\./g,''))||0;
}

function calculate(){
let modal=0;
modal+=num('flowerQty')*num('flowerPrice');
modal+=num('boneka');
modal+=num('cell')+num('ribbon')+num('leaf')+num('bag');
modal+=num('snackQty')*num('snackPrice');
modal+=num('money');
modal+=num('electric')+num('worker');
let jual=modal+(modal*num('profit')/100);
document.getElementById('result').innerHTML=
`Total Modal<br><b>Rp${modal.toLocaleString('id-ID')}</b><br><br>Harga Jual<br><b>Rp${Math.round(jual).toLocaleString('id-ID')}</b>`;
}
