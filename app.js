const flowersEl=document.getElementById("flowers");
const bonekaEl=document.getElementById("boneka");
const packagingEl=document.getElementById("packaging");

function clean(v){
 return Number(String(v).replace(/\./g,''))||0;
}

function formatRupiah(el){
 el.addEventListener("input",()=>{
  let x=el.value.replace(/\D/g,'');
  el.value=x?Number(x).toLocaleString('id-ID'):'';
 });
}

function applyFormat(){
 document.querySelectorAll(".harga").forEach(formatRupiah);
}

let flowerCount=0;

function addFlower(){
 flowerCount++;
 const div=document.createElement("div");
 div.className="box";
 div.innerHTML=`
 <b>🌸 Bunga ${flowerCount}</b>
 <label>Jumlah</label>
 <input class="qty" value="1">
 <label>Harga</label>
 <input class="harga" value="5000">`;
 flowersEl.appendChild(div);
 applyFormat();
}

function addProduct(parent,name,price){
 const div=document.createElement("div");
 div.className="box";
 div.innerHTML=`
 <b>${name}</b>
 <label>Jumlah</label>
 <input class="qty" value="0">
 <label>Harga</label>
 <input class="harga" value="${price}">`;
 parent.appendChild(div);
}

addFlower();

addProduct(bonekaEl,"🧸 Boneka 8 cm",5000);
addProduct(bonekaEl,"🧸 Boneka 12 cm",18000);
addProduct(bonekaEl,"🧸 Boneka 20 cm",30000);

addProduct(packagingEl,"📄 Cellophane",3000);
addProduct(packagingEl,"🎀 Pita",2000);
addProduct(packagingEl,"🍃 Daun",1000);
addProduct(packagingEl,"🛍 Paper Bag",10000);

applyFormat();

function getValue(id){
 return clean(document.getElementById(id).value);
}

function hitung(){
 let modal=0;

 document.querySelectorAll(".box").forEach(box=>{
  const qty=box.querySelector(".qty");
  const harga=box.querySelector(".harga");
  if(qty && harga){
   modal += Number(qty.value||0)*clean(harga.value);
  }
 });

 modal += getValue("listrik");
 modal += getValue("tenaga");
 modal += getValue("jasa");

 modal += Number(document.getElementById("snackQty").value||0)*
 clean(document.getElementById("snackPrice").value);

 const profit=Number(document.getElementById("profit").value||0);
 const jual=modal+(modal*profit/100);

 document.getElementById("modal").innerHTML="Rp"+modal.toLocaleString("id-ID");
 document.getElementById("jual").innerHTML="Rp"+Math.round(jual).toLocaleString("id-ID");
}
