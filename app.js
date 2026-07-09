document.querySelectorAll('.harga').forEach(el=>{
el.addEventListener('input',()=>{
let x=el.value.replace(/\D/g,'');
el.value=x?Number(x).toLocaleString('id-ID'):'';
});
});
