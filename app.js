let counter=0;

function addItem(){
counter++;
let div=document.createElement("div");
div.className="item";
div.innerHTML=`
<div class="title">🌸 Item ${counter}</div>
<select class="harga">
<option value="5000">Bunga Besar - 5000</option>
<option value="3000">Bunga Sedang - 3000</option>
<option value="1000">Bunga Kecil - 1000</option>
<option value="3000">Cello - 3000</option>
<option value="1000">Tissu - 1000</option>
</select>
<input class="qty" value="1" type="number">
`;
document.getElementById("items").appendChild(div);
}

addItem();

function hitung(){
let modal=0;

document.querySelectorAll(".item").forEach(x=>{
modal+=Number(x.querySelector(".harga").value)*Number(x.querySelector(".qty").value);
});

modal+=Number(boneka.value)*5000;
modal+=Number(boneka2.value)*18000;
modal+=Number(boneka3.value)*30000;

modal+=Number(listrik.value)+Number(tenaga.value)+Number(jasa.value);

let jual=modal+(modal*Number(profit.value)/100);

document.getElementById("modal").innerHTML="Rp"+modal.toLocaleString("id-ID");
document.getElementById("jual").innerHTML="Rp"+Math.round(jual).toLocaleString("id-ID");
}
