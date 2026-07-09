function angka(id){
return Number(document.getElementById(id).value.replace(/[^0-9]/g,'')||0);
}

function formatInput(id){
let el=document.getElementById(id);
el.value='Rp'+Number(el.value.replace(/[^0-9]/g,'')).toLocaleString('id-ID');

el.addEventListener('blur',()=>{
el.value='Rp'+Number(el.value.replace(/[^0-9]/g,'')).toLocaleString('id-ID');
});
}

['listrik','tenaga','jasa'].forEach(formatInput);

function hitung(){
let modal=angka('listrik')+angka('tenaga')+angka('jasa');
let jual=modal+(modal*Number(profit.value)/100);

result.innerHTML=
`Total Modal<br><b>Rp${modal.toLocaleString('id-ID')}</b><br><br>
Harga Jual<br><b>Rp${Math.round(jual).toLocaleString('id-ID')}</b>`;
}
