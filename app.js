function formatRupiah(el){
el.addEventListener('input',()=>{
let x=el.value.replace(/\D/g,'');
el.value=x?Number(x).toLocaleString('id-ID'):'';
});
}
document.querySelectorAll('.harga').forEach(formatRupiah);

function n(id){
return Number(document.getElementById(id).value.replace(/\./g,''))||0;
}

function hitung(){
let total=0;
total+=n('cellQty')*n('cellPrice');
total+=n('ribbonQty')*n('ribbonPrice');
total+=n('leafQty')*n('leafPrice');
total+=n('bagQty')*n('bagPrice');
total+=n('snackQty')*n('snackPrice');

hasil.innerHTML='Total Packaging + Snack<br><b>Rp'+total.toLocaleString('id-ID')+'</b>';
}
