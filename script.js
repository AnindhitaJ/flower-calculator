let jumlahBunga=0;

function tambahBunga(){
jumlahBunga++;
let div=document.createElement("div");
div.className="row";
div.innerHTML=`
<span>Bunga ${jumlahBunga}</span>
<input type="number" class="bJumlah" value="1">
<select class="bHarga">
<option value="1000">Rp1.000</option>
<option value="2000">Rp2.000</option>
<option value="3000">Rp3.000</option>
<option value="4000">Rp4.000</option>
<option value="5000">Rp5.000</option>
</select>`;
document.getElementById("bungaArea").appendChild(div);
}

tambahBunga();

function hitung(){
let total=0;

document.querySelectorAll(".row").forEach((r)=>{
let j=r.querySelector(".bJumlah");
let h=r.querySelector(".bHarga");
if(j&&h) total += Number(j.value||0)*Number(h.value);
});

total += Number(daunJumlah.value||0)*Number(daunHarga.value);
total += Number(celloJumlah.value||0)*Number(celloHarga.value);
total += Number(tissuJumlah.value||0)*Number(tissuHarga.value);

total += Number(listrik.value||0);
total += Number(tenaga.value||0);
total += Number(jasa.value||0);

hasil.innerHTML="Total Modal: Rp"+total.toLocaleString("id-ID");
}
