function hitung(){
let total=0;
total += Number(document.getElementById('bunga').value)*Number(document.getElementById('jBunga').value||0);
total += Number(document.getElementById('daun').value||0)*1000;
total += Number(document.getElementById('cello').value||0)*3000;
total += Number(document.getElementById('tissu').value||0)*1000;
total += Number(document.getElementById('foam').value||0)*2000;
total += Number(document.getElementById('pita').value||0)*2000;
total += Number(document.getElementById('lem').value||0)*1000;
total += 5000+25000+50000;

document.getElementById('hasil').innerHTML=
"Total Modal: Rp"+total.toLocaleString("id-ID");
}
