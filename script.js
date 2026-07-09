
let sessions=JSON.parse(localStorage.getItem("sessions")||"{}");
let active="";

function refresh(){
let s=document.getElementById("sessionList");
s.innerHTML="";
Object.keys(sessions).forEach(x=>{
s.innerHTML+=`<option>${x}</option>`;
});
}

function buatSession(){
active=document.getElementById("sessionName").value;
sessions[active]=[];
save();
refresh();
}

function loadSession(){
active=document.getElementById("sessionList").value;
show();
}

function addItem(){
let d=document.createElement("div");
d.className="item";
d.innerHTML=`
<input placeholder="Nama bahan (Mawar besar/Boneka)">
<input type="number" placeholder="Qty">
<input type="number" placeholder="Harga">
`;
document.getElementById("items").appendChild(d);
}

function simpanBuket(){
if(!active){alert("Buat session dulu");return;}
let data=[];
document.querySelectorAll(".item").forEach(x=>{
let i=x.querySelectorAll("input");
data.push({nama:i[0].value,qty:i[1].value,harga:i[2].value});
});
sessions[active].push({
nama:document.getElementById("namaBuket").value,
items:data,
jual:document.getElementById("hargaJual").value
});
save();
show();
}

function save(){
localStorage.setItem("sessions",JSON.stringify(sessions));
}

function show(){
let el=document.getElementById("listBuket");
el.innerHTML="";
(sessions[active]||[]).forEach((b,i)=>{
el.innerHTML+=`<div class="box"><b>${b.nama}</b><br>Harga Jual Rp${Number(b.jual).toLocaleString()}<br>Item: ${b.items.length}</div>`;
});
}

function makePdf(detail){
const {jsPDF}=window.jspdf;
let pdf=new jsPDF();
let y=20;
pdf.text(detail?"BREAKDOWN BUKET":"PRICELIST BUKET",10,y);
y+=10;
(sessions[active]||[]).forEach(b=>{
pdf.text(b.nama+" - Rp"+b.jual,10,y);
y+=8;
if(detail){
b.items.forEach(i=>{
pdf.text(i.nama+" "+i.qty+" x "+i.harga,15,y);
y+=7;
});
}
});
pdf.save(detail?"breakdown.pdf":"pricelist.pdf");
}

function pdfPrice(){makePdf(false)}
function pdfBreak(){makePdf(true)}

addItem();
refresh();
