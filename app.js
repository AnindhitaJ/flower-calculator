let data=[];
let menus=[];

const bunga=[
["Mawar Besar",5000],
["Mawar Sedang",3000],
["Mawar Kecil",1000],
["Daisy Kecil",1000],
["Tulip Besar",5000]
];

function addItem(){
let div=document.createElement("div");
div.className="row";
div.innerHTML=`
<select class="bunga">
${bunga.map(x=>`<option value="${x[1]}">${x[0]} - ${x[1]}</option>`).join("")}
</select>
<input class="qty" value="1" type="number">
`;
document.getElementById("items").appendChild(div);
hitung();
}

function hitung(){
let modal=0;
document.querySelectorAll(".row").forEach(r=>{
modal += Number(r.querySelector(".bunga").value)*Number(r.querySelector(".qty").value);
});

document.getElementById("modal").innerHTML="Rp"+modal.toLocaleString();

let p=Number(document.getElementById("profit").value);
document.getElementById("jual").innerHTML="Rp"+Math.round(modal+(modal*p/100)).toLocaleString();
}

function simpanMenu(){
alert("Masuk ke menu siap disimpan");
}

function buatMenu(){
let n=document.getElementById("namaMenu").value;
let h=document.getElementById("hargaMenu").value;

let d=document.createElement("div");
d.innerHTML=`🌷 ${n} - Rp${h}`;
document.getElementById("menuList").appendChild(d);
}

addItem();
