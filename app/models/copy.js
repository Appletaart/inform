const vlaanMap = "./vlaanderen.json";
const getMandaten = "./mandatenedit.csv";

const width = 1200;
const height = 600;

let provincesData;
let gemeenteData;

const svg = d3.select("#canvas")
  .attr("viewBox", [0, 0, width, height]);

const tooltip = d3.select("#tooltip");
const insert = d3.select("#insert");
const textgraph = d3.select("#textgraph");

const g = svg.append("g");

const projection = d3
  .geoMercator()
  .scale(17500) // full 18400 ,15980
  .translate([-700, 18500]); // full -780, 19450 /-680 16800

const path = d3.geoPath().projection(projection);

// function for make a cursor
const cursor = document.querySelector("#tooltip");
document.addEventListener("mousemove", function(e) {
  var x = e.clientX;
  var y = e.clientY;
  cursor.style.left = x + "px";
  cursor.style.top = y + "px";
});

async function drawMap() {
  g.selectAll("path")
    .data(gemeenteData)
    .enter()
    .append("path")
    .attr("class", "municipalities")
    .attr("id", gemeenteDataItem => {
      let name = gemeenteDataItem.properties["name_nl"];
      //console.log(name);
      return name;
    })// .attr("gemeente", "")
    .attr("population", gemeenteDataItem => {
      let population = gemeenteDataItem.properties["population"];
      return population;
    })
    .attr("d", path)
    .attr("fill", (gemeenteDataItem, i) => {
      //console.log(gemeenteDataItem);
      let nis = gemeenteDataItem.properties["nis"];
      let name = gemeenteDataItem.properties["name_nl"];
      let id = gemeenteData.find(id => {
        return id.properties["nis"] === nis;
      });      
      // && 'Brugge' && 'Antwerpen' && 'Gent' && 'Leuven'
      if (name === 'Hasselt'){
        return "#e1e5e8";
      }
      let population = id.properties["population"];
      if (population <= 100000) {
        return "#f8f8f8";
      } else {
        return "#e1e5e8";
      }
    })
    .on("mouseover", (gemeenteDataItem, i) => {
      tooltip.transition().style("visibility", "visible");
      let name = i.properties["name_nl"];
      mandatenData.then(info =>{
        let input_name = info.find(hu => hu[19] === name);
        let put_name = input_name[19];  
        let bestuurseenheids = d3.group(info, d => d[19]);
        let bestuurseenheid = bestuurseenheids.get(put_name);
        let bestuurfunctie = d3.group(bestuurseenheid, d => d[12]);
        let burgemeester = bestuurfunctie.get('Burgemeester'); 
        let formatTime = new Date();
        let today = formatTime.getTime()
        let bestuurperiod = new Date("1/1/2019")
        let period_Start = bestuurperiod.getTime()
        let eenBurgemeester = []; 
        if(!burgemeester){
        }else{
        burgemeester.forEach(burgemeesters => {
        let start_date = new Date(burgemeesters[1])
        let bestuur_Start = start_date.getTime()
        let end_date = new Date(burgemeesters[2])
        let bestuur_End = end_date.getTime()
        if(+period_Start <= +bestuur_Start && !(+bestuur_End <= +today)){   
            let voornaam = burgemeesters[7] + " " + burgemeesters[8]+ " " + burgemeesters[25];
            eenBurgemeester.push(voornaam)
              return eenBurgemeester
        } //end condition
        })}
        tooltip.text( i["properties"].name_nl + " | "+ eenBurgemeester[0]);
      })
    })
    .on("click", (gemeenteDataItem, i) => {
      tooltip.transition().style("visibility", "visible");
      textgraph.transition().style("visibility", "visible");

      let name = i.properties["name_nl"];
      let population = i.properties["population"];
      
        mandatenData.then(info =>{
        let input_name = info.find(hu => hu[19] === name);
        let put_name = input_name[19];

        document.getElementById("textgraph").innerHTML = `${mandaten(put_name, population)}`;
       // toggle.transition().style("visibility", "hidden")
      // console.log(put_name);
      }) 
      // tooltip.text( i["properties"].name_nl + " | Burgemeester : onclick show ");
    })
    .on("mouseout", gemeenteDataItem => {
      tooltip.transition().style("visibility", "hidden");
    })
    
  g.append("g")
    .selectAll("path")
    .data(provincesData)
    .enter()
    .append("path")
    .attr("stroke", "darkred")
    .attr("stroke-linejoin", "round")
    .attr("class", "provinces")
    .attr("d", path);
}

async function mandaten(put_name, population) {
  const render = row => {
    let bestuurseenheids = d3.group(row, d => d[19]);
    let bestuurseenheid = bestuurseenheids.get(put_name);
    let bestuurfunctie = d3.group(bestuurseenheid, d => d[12]);

    let formatTime = new Date();
    let today = formatTime.getTime()
    let bestuurperiod = new Date("1/1/2019")
    let period_Start = bestuurperiod.getTime()
    let timeformat = d3.timeFormat("%m/%d/%Y");//toLocaleDateString()

/* Burgemeester */
    let eenBurgemeester = []; 
    let burgemeester = bestuurfunctie.get('Burgemeester'); 
    if(!burgemeester){
    }else{
    burgemeester.forEach(burgemeesters => {
    let start_date = new Date(burgemeesters[1])
    let bestuur_Start = start_date.getTime()
    let end_date = new Date(burgemeesters[2])
    let bestuur_End = end_date.getTime()
    if(+period_Start <= +bestuur_Start && !(+bestuur_End <= +today)){
          let voornaam = burgemeesters[7] + " " + burgemeesters[8]+ " " + burgemeesters[12] + " <strong>" + burgemeesters[25] +"</strong>";
          eenBurgemeester.push(voornaam)
          return eenBurgemeester
    }// end condition
  })}

    // Voorzitter van de gemeenteraad
    let voorZgr = [];
    let een_voorZgr = [];
    let vgrl = bestuurfunctie.get('Voorzitter van de gemeenteraad');   
    if(!vgrl){
    }else{
    vgrl.forEach(vgr => {
      let start_date = new Date(vgr[1])
      let bestuur_Start = start_date.getTime()
      let end_date = new Date(vgr[2])
      let bestuur_End = end_date.getTime()
      if(+period_Start <= +bestuur_Start && !(+bestuur_End <= +today)){
        let voornaam = vgr[7] + " " + vgr[8]+ " " + vgr[12] + " <strong>" + vgr[25] +"</strong><br>";
        voorZgr.push({
          voornaam: vgr[7],achternaam: vgr[8],functie: vgr[12],fractie: vgr[25]})
        return voorZgr
    }// end condition 
  })
  let nameschepen = d3.group(voorZgr, d => d.voornaam)
  for (const [key, value] of nameschepen){
       let testp = key + " " + value[0].achternaam + " " + value[0].functie + "<strong> " + value[0].fractie +"</strong> <br>"
       een_voorZgr.push(testp)}
}

   //  Schepenen
   let schepen = bestuurfunctie.get('Schepen');
   let rangonde = d3.group(schepen, d => d[3]); 

   // Eerste schepen
   let eschepen = rangonde.get('Eerste schepen')
   let co_eschepens = []; 
   let een_eschep = []
   if(!eschepen){
   }else{
   eschepen.forEach(eschepens => {
   let start_date = new Date(eschepens[1])
    let bestuur_Start = start_date.getTime()
    let end_date = new Date(eschepens[2])
    let bestuur_End = end_date.getTime()
    if(+period_Start <= +bestuur_Start && !(+bestuur_End <= +today)){
      co_eschepens.push({
          voornaam: eschepens[7], achternaam: eschepens[8],functie: eschepens[3], fractie: eschepens[25]})
      return co_eschepens
   }// end condition 
  })
  let nameschepen = d3.group(co_eschepens, d => d.voornaam)
  for (const [key, value] of nameschepen){
       let testp = key + " " + value[0].achternaam + " " + value[0].functie + "<strong> " + value[0].fractie +"</strong> <br>"
       een_eschep.push(testp)}
  }

// Schepen
let co_schepen = []
let eenschep = []

if(!schepen){
}else{
schepen.forEach(schepens => {   
let start_date = new Date(schepens[1])
let bestuur_Start = start_date.getTime()
let end_date = new Date(schepens[2])
let bestuur_End = end_date.getTime()
if(+period_Start <= +bestuur_Start && !(+bestuur_End <= +today)){
    co_schepen.push({
        voornaam: schepens[7],achternaam: schepens[8],functie: schepens[12],fractie: schepens[25]})
    return co_schepen
}
}) // end foreach 
let nameschepen = d3.group(co_schepen, d => d.voornaam)
for (const [key, value] of nameschepen){
     let testp = key + " " + value[0].achternaam + " " + value[0].functie + "<strong> " + value[0].fractie +"</strong> <br>"
     eenschep.push(testp)
}
}// end else

  // Toegevoegde schepen
  let tvsch = bestuurfunctie.get('Toegevoegde schepen');
  let co_tvschs = []; 
  let een_tschep = [] 
  if(!tvsch){
  }else{
  tvsch.forEach(tvschs => {
    let start_date = new Date(tvschs[1])
      let bestuur_Start = start_date.getTime()
      let end_date = new Date(tvschs[2])
      let bestuur_End = end_date.getTime()
      if(+period_Start <= +bestuur_Start && !(+bestuur_End <= +today)){
        co_tvschs.push({
          voornaam: tvschs[7], achternaam: tvschs[8],functie: tvschs[12], fractie: tvschs[25]})
          return co_tvschs
    }// end condition 
})
let nameschepen = d3.group(co_tvschs, d => d.voornaam)
for (const [key, value] of nameschepen){
    let testp = key + " " + value[0].achternaam + " " + value[0].functie + "<strong> " + value[0].fractie +"</strong> <br>"
    een_tschep.push(testp)}
}

   // Gemeenteraadsleden
   let grleden = [];
   let een_gr = [];
   let grl = bestuurfunctie.get('Gemeenteraadslid');
   if(!grl){
    }else{
      grl.forEach(gr => {
      let start_date = new Date(gr[1])
      let bestuur_Start = start_date.getTime()
      let end_date = new Date(gr[2])
      let bestuur_End = end_date.getTime()
      if(+period_Start <= +bestuur_Start && !(+bestuur_End <= +today)){
          grleden.push({
            voornaam: gr[7],achternaam: gr[8],functie: gr[12],fractie: gr[25]})
      return grleden
    }// end condition
  })
  let nameschepen = d3.group(grleden, d => d.voornaam)
  for (const [key, value] of nameschepen){
      let testp = key + " " + value[0].achternaam + " <strong> " + value[0].fractie +"</strong> <br>"
     // const dji = testp.slice().sort((key, value) => d3.ascending(key.last, value.last) || d3.ascending(key.first, value.first))
     // console.log(dji);     
      een_gr.push(testp)}
}

   document.getElementById("textgraph").innerHTML = 
    `<div class="toggle"></div>
    <div class="head_cut">
    <strong>${put_name}</strong> | Inwoners : ${population.toLocaleString()}<br>
    ${eenBurgemeester[0]}<br>
    <hr></hr>
    <strong>College van Burgemeester en Schepenen</strong><br>
    ${
      "<p>"+ een_eschep.join('')+ "</p>" +
      "<p>"+ eenschep.join('')+ "</p>" +
      "<p>"+ een_tschep.join('')+ "</p>" }
    <hr></hr>
    <strong>Gemeenteraadsleden</strong><br> 
    ${
      "<p>"+ een_voorZgr.join('') + "<p>"+ 
      "<p>"+ een_gr.join('') + "<p>"}</div>`;


// start menu
let toggleMenu = true;
let toggleTextGraph = function() {
let closeTextGraph = document.querySelector(".textgraph")
let closeToggle = document.querySelector(".textgraph .toggle")
let closeText = document.querySelectorAll(".textgraph .head_cut")
if (toggleMenu === true){
  closeText.style.visibility = "visible";
  closeTextGraph.style.width = "30vw";
  closeToggle.style.opacity = "0.5";
}
}
const toggle = document.querySelector('.toggle');
//const mandataris = document.querySelector('.mandataris');
const textgraph = document.querySelector('.textgraph');

toggle.addEventListener('click', () => {
  toggle.classList.toggle('active');
 // mandataris.classList.toggle('active');
  //textgraph.classList.toggle('active');

});
// end menu


  }; // end render
  mandatenData.then(row => {
    render(row); // make new function to input data for each row and don't do it with column
  }); //end row
} // mandatenend chart()


const map = async () => d3.json(await vlaanMap).then((data, error) => {
  if (error) {
    console.log(log);
  } else { 
    provincesData = topojson.feature(data, data.objects.provinces).features;
    gemeenteData = topojson.feature(data, data.objects.municipalities).features;

  mandatenData = fetch(getMandaten).then(
      response => response.text().then((data, error) => {
      if (error) {
        console.log(error);
      } else {
        const realData = []
          const datas = data.split("\n")
          // console.log(datas);
          datas.forEach(datas => {
          const passData = datas.split(",");
          realData.push(passData)
          }) 
           return realData
      }  // end else
      } //
      )) 

    drawMap();
  }
});
map();

