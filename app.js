let count=0;
const rupiah=n=>"Rp"+Number(n).toLocaleString("id-ID");

function addItem(){
count++;
let d=document.createElement("div");
d.className="item";
d.innerHTML=`
<b>🌸 Bunga ${count}</b>
<select class="price">
<option value="5000">Besar - Rp5.000</option>
<option value="3000">Sedang - Rp3.000</option>
<option value="1000">Kecil - Rp1.000</option>
</select>
<input class="qty" value="1" type="number">`;
document.getElementById("items").appendChild(d);
}
addItem();

function formatInput(el){
el.addEventListener("blur",()=> {
el.value=Number(el.value.replace(/\D/g,"")).toLocaleString("id-ID");
});
}
["listrik","tenaga","jasa"].forEach(id=>formatInput(document.getElementById(id)));

function num(id){
return Number(document.getElementById(id).value.replace(/\./g,"")||0);
}

function hitung(){
let modal=0;
document.querySelectorAll(".item").forEach(x=>{
modal+=Number(x.querySelector(".price").value)*Number(x.querySelector(".qty").value);
});
modal+=num("b1")*5000+num("b2")*18000+num("b3")*30000;
modal+=num("listrik")+num("tenaga")+num("jasa");

let jual=modal+(modal*Number(profit.value)/100);
document.getElementById("modal").innerHTML=rupiah(modal);
document.getElementById("jual").innerHTML=rupiah(Math.round(jual));
}
