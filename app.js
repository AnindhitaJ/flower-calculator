
let count=0;

const rupiah = (n) => "Rp" + Number(n).toLocaleString("id-ID");

function formatRupiahInput(input){
    input.addEventListener("input", function(){
        let angka = this.value.replace(/\D/g, "");
        this.value = angka ? Number(angka).toLocaleString("id-ID") : "";
    });
}

["listrik","tenaga","jasa"].forEach(id=>{
    formatRupiahInput(document.getElementById(id));
});

function angka(id){
    return Number(document.getElementById(id).value.replace(/\./g,"") || 0);
}

function hitung(){
    let modal = 0;

    document.querySelectorAll(".item").forEach(item=>{
        modal += Number(item.querySelector(".price").value) *
                 Number(item.querySelector(".qty").value || 0);
    });

    modal += angka("b1") * 5000;
    modal += angka("b2") * 18000;
    modal += angka("b3") * 30000;

    modal += angka("listrik");
    modal += angka("tenaga");
    modal += angka("jasa");

    let profitValue = Number(document.getElementById("profit").value || 0);
    let jual = modal + (modal * profitValue / 100);

    document.getElementById("modal").innerHTML = rupiah(modal);
    document.getElementById("jual").innerHTML = rupiah(Math.round(jual));
}
