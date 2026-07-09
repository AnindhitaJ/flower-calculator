let bunga=[];

function simpanBunga(){
let harga=Number(document.getElementById('ukuran').value);
let jumlah=Number(document.getElementById('jumlah').value);
bunga.push({harga,jumlah});
render();
}

function render(){
let html="";
bunga.forEach((b,i)=>{
html+=`Bunga ${i+1}: ${b.jumlah} kuntum x Rp${b.harga.toLocaleString()}<br>`;
});
document.getElementById('listBunga').innerHTML=html;
}

function hitung(){
let total=0;
bunga.forEach(b=> total+=b.harga*b.jumlah);
total+=Number(document.getElementById('boneka').value);
total+=5000+25000+50000;

let p=Number(document.getElementById('profit').value);
let jual=total+(total*p/100);

document.getElementById('hasil').innerHTML=
`Modal: Rp${total.toLocaleString()}<br>
Harga Jual: Rp${Math.round(jual).toLocaleString()}`;
}

if('serviceWorker' in navigator){
navigator.serviceWorker.register('sw.js');
}
