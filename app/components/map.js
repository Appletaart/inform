import Component from '@glimmer/component';
import {tracked} from '@glimmer/tracking';
import {action} from '@ember/object';
import {geoMercator, geoPath} from 'd3-geo';
import d3 from 'd3';
import { inject as service } from '@ember/service';

export default class MapComponent extends Component {
  /* @action
    hello() {
        select(".d3-hello").text("HELLOWORLD BY D3")
    } */
    @service map;
    
    /* @action
    addToService(item){
      console.log(item.target.id); // in map hbs use  {{on "click" this.addToService}}
    } */
    
    @action
    initMap() {
        let provincesData;
        let gemeenteData;
        let mandatenData;

        const width = 800;
        const height = 330;
        const container = d3.select('.bp-map')
        
        const tooltip = d3.select("#tooltip");
        const textgraph = d3.select("#textgraph");
        const besturen = d3.select("#besturen");
        const agenda = d3.select("#agenda");
        const besluit = d3.select("#besluit");
        
        
        // function for make a cursor
        const cursor = document.querySelector("#tooltip");
        document.addEventListener("mousemove", function(e) {
        var x = e.clientX;
        var y = e.clientY;
        cursor.style.left = x + "px";
        cursor.style.top = y + "px";
      });

        const svg = container.append('svg')
        .attr("viewBox", [0, 0, width, height])

        const g = svg.append("g");

        const projection = geoMercator()
        .scale(13500) 
        .translate([-600, 14205]); 

        const path = geoPath().projection(projection);

    async function drawMap() {
        g.selectAll("path")
        .data(gemeenteData)
        .enter()
        .append("path")
        .attr("class", "municipalities") 
        .attr("id", gemeenteDataItem => {
          let name = gemeenteDataItem.properties["name_nl"];
          return name;
          })
          .attr("population", gemeenteDataItem => {
          let population = gemeenteDataItem.properties["population"];
          return population;
          })
          .attr("d", path)
          .attr("fill", (gemeenteDataItem) => {
          let name = gemeenteDataItem.properties["name_nl"];      
          if (name === 'Hasselt'){
              return "#e1e5e8";
          }
          let population = gemeenteDataItem.properties["population"];
          if (population <= 100000) {
              return "#f8f8f8";
          } else {
              return "#e1e5e8";
          }})
          .on("mouseover", (gemeenteDataItem) => {
            tooltip.transition().style("visibility", "visible");
            let name = gemeenteDataItem.properties["name_nl"];
            
            mandatenData.then(info =>{
              let input_name = info.find(hu => hu[19] === name);
              let put_name = input_name[19];  
              let bestuurseenheids = d3.group(info, d=> d[19]) //d3.group(info, d => d[19]);
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
                  eenBurgemeester.push({voornaam: burgemeesters[7], achternaam: burgemeesters[8], fractie: burgemeesters[25]})
                  return eenBurgemeester
              } //end condition
              })}
              tooltip.text(gemeenteDataItem["properties"].name_nl + " | "+ eenBurgemeester[0].voornaam + " " + eenBurgemeester[0].achternaam + " " + eenBurgemeester[0].fractie + " " );
            })
          })
          .on("click", (gemeenteDataItem) => {
             textgraph.transition().style("visibility", "visible");
             besturen.transition().style("visibility", "visible");
             agenda.transition().style("visibility", "visible");
             besluit.transition().style("visibility", "visible");
             container.transition().style("transform", "scale(.80)translate(-160px,0)")
            
            let name = gemeenteDataItem.properties["name_nl"];
            let population = gemeenteDataItem.properties["population"];
            // console.log(name, population);
            
            /* mandatenData.then(info =>{
            let input_name = info.find(hu => hu[19] === name);
            let put_name = input_name[19];
            mandaten(put_name, population);
            // console.log(put_name);
            }) // point to specific gemeente
 */
            d3.select(".toggle").on("click", () => {
              textgraph.transition().style("visibility", "hidden");
              besturen.transition().style("visibility", "hidden")
              agenda.transition().style("visibility", "hidden")
              besluit.transition().style("visibility", "hidden")
              container.transition().style("transform", "scale(1)translate(0,0)")
            });
          })
          .on("mouseout", gemeenteDataItem => {
            tooltip.transition().style("visibility", "hidden");
          })

          g.append("g")
          .selectAll("path")
          .data(provincesData)
          .enter()
          .append("path")
          .attr("stroke-linejoin", "round")
          .attr("class", "provinces")
          .attr("d", path);
        
      }//drawMap
      
      const map = async () => d3.json(await '/api/vlaanderens.json').then((data, error) => {
          if (error) {
            console.log(log);
          } else { 
            // console.log(data); 
            provincesData = topojson.feature(data, data.objects.provinces).features;
            gemeenteData = topojson.feature(data, data.objects.municipalities).features;
           
            mandatenData = fetch('/api/mandatenedit.csv').then(
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
              })) 
            drawMap();
          }})
          
        map()
    } //end initMap 
  
}
