import Component from '@glimmer/component';
import {tracked} from '@glimmer/tracking';
import {action} from '@ember/object';
import {geoMercator, geoPath} from 'd3-geo';
import d3 from 'd3';
import { inject as service } from '@ember/service';
class SPARQLQueryDispatcher {
  constructor( endpoint ) {
      this.endpoint = endpoint;
  }

  async query( sparqlQuery ) {
      const fullUrl = this.endpoint + '?query=' + encodeURIComponent( sparqlQuery );
      const headers = { 'Accept': 'application/sparql-results+json' };

      const body = await fetch(fullUrl, { headers });
    return await body.json();
  }
}
export default class MapComponent extends Component {
  /* @action
    hello() {
        select(".d3-hello").text("HELLOWORLD BY D3")
    } */
    @service map;
    @tracked gemeente;
    @tracked toggleClick;
    
    @action
    addToService(item){
      // console.log(item.target.id); // in map hbs use  {{on "click" this.addToService}}
      this.map.addItem(item)
    }


    @action
    initMap() {
        let provincesData;
        let gemeenteData;
        let mandatenData;
        let hasDataAgenda;
        let hasDataBesluit;

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

              g.append("rect")
              .attr("x", 650)
              .attr("y", 40)
              .attr("width", 8)
              .attr("height", 8)
              .attr("class", "legend")
              .attr("fill", "#e1e5e8")

              g.append("text")
              .attr("x", 665)
              .attr("y", 47)
              .attr("class", "text_legend")
              .attr("fill", "#657d9a")
              .text("beschikbaar agenda")

              g.append("rect")
              .attr("x", 650)
              .attr("y", 55)
              .attr("width", 8)
              .attr("height", 8)
              .attr("class", "legend_besluit")
              .attr("fill", "#7f8d99")

              g.append("text")
              .attr("x", 665)
              .attr("y", 62)
              // .attr("dy", 3)
              .attr("class", "text_legend")
              // .attr("height", "0.1em")
              .attr("fill", "#657d9a")
              .text("beschikbaar besluiten")

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
          // let input_name = info.find(hu => hu === name);
          hasDataAgenda.then(result => {
            let input_name = result.find(hu => hu.e === name)
            // console.log(input_name.e);
            return d3.select("#"+input_name.e).transition().style("fill", "#e1e5e8")
          }).catch(e => e)

          hasDataBesluit.then(result => {
            let input_name = result.find(hu => hu.e === name)
            //  console.log(input_name.e);
            return d3.select("#"+input_name.e).transition().style("fill", "#7f8d99")
          }).catch(e => e)

          if (name === "De Panne"){
            return "#e1e5e8";
          } 
          return "#f8f8f8";
          /*
          if (name === "De Panne"){
            return "#e1e5e8";
          } 
          let population = gemeenteDataItem.properties["population"];
          if (population <= 100000) {
              return "#f8f8f8";
          } else {
              return "#e1e5e8";
          } */
        // end
        }).on("mouseover", (gemeenteDataItem) => {
            tooltip.transition().style("visibility", "visible");
            let name = gemeenteDataItem.properties["name_nl"];
            over(name)
            // big file
           /*  mandatenData.then(info =>{
              let input_name = info.find(hu => hu.bestuurseenheidLabel === name);
              let put_name = input_name.bestuurseenheidLabel;  
              let bestuurseenheids = d3.group(info, d=> d.bestuurseenheidLabel) //d3.group(info, d => d[19]);
              let bestuurseenheid = bestuurseenheids.get(put_name);
              let bestuurfunctie = d3.group(bestuurseenheid, d => d.bestuursfunctieLabel);
              let burgemeester = bestuurfunctie.get('Burgemeester'); 
              let formatTime = new Date();
              let today = formatTime.getTime()
              let bestuurperiod = new Date("1/1/2019")
              let period_Start = bestuurperiod.getTime()
              let eenBurgemeester = []; 
              if(!burgemeester){
              }else{
              burgemeester.forEach(burgemeesters => {
              let start_date = new Date(burgemeesters.start)
              let bestuur_Start = start_date.getTime()
              let end_date = new Date(burgemeesters.eind)
              let bestuur_End = end_date.getTime()
              if(+period_Start <= +bestuur_Start && !(+bestuur_End <= +today)){   
                  eenBurgemeester.push({voornaam: burgemeesters.voornaam, achternaam: burgemeesters.achternaam, fractie: burgemeesters.fractieNaam})
                  return eenBurgemeester
              } //end condition
              })}
              tooltip.text(gemeenteDataItem["properties"].name_nl + " | "+ eenBurgemeester[0].voornaam + " " + eenBurgemeester[0].achternaam + " " + eenBurgemeester[0].fractie + " " );
            }) */  
          })
          .on("click", (gemeenteDataItem) => {
            //  textgraph.transition().style("visibility", "visible");
            //  besturen.transition().style("visibility", "visible");
            //  agenda.transition().style("visibility", "visible");
            //  besluit.transition().style("visibility", "visible");
            //  d3.select("#archieven").transition().style("visibility", "visible")
            //  container.transition().style("transform", "scale(.80)translate(-160px,0)")
            
            //  let name = gemeenteDataItem.properties["name_nl"];
            //  let population = gemeenteDataItem.properties["population"];
            //  console.log(name, population);
            
            /* mandatenData.then(info =>{
            let input_name = info.find(hu => hu[19] === name);
            let put_name = input_name[19];
            mandaten(put_name, population);
            // console.log(put_name);
            }) // point to specific gemeente
            */
            /* d3.select(".toggle").on("click", () => {
              textgraph.transition().style("visibility", "hidden");
              besturen.transition().style("visibility", "hidden")
              agenda.transition().style("visibility", "hidden")
              besluit.transition().style("visibility", "hidden")
              d3.select("#archieven").transition().style("visibility", "hidden")
              container.transition().style("transform", "scale(1)translate(0,0)")
            }); */
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
      
      const map = async () => d3.json('/api/vlaanderens.json').then((data, error) => {
          if (error) {
            console.log(log);
          } else { 
            // console.log(data); 
            provincesData = topojson.feature(data, data.objects.provinces).features;
            gemeenteData = topojson.feature(data, data.objects.municipalities).features;
           
            /* mandatenData = fetch('/api/mandaten.json').then(
              response => response.json().then(
                (data, error) => {
                  if (error) {
                    console.log(log);
                  } else {
                    return data
                }})) */

             mandatenData = fetch_mandataris().then(
              function(result) {// console.log("Success!", result.results['bindings']);
                const datas = result.results['bindings']
                const realdata = [];
                datas.forEach(e => {
                  realdata.push({
                        start: e.start.value,
                        eind: e.eind, 
                        achternaam: e.achternaam.value, 
                        voornaam: e.voornaam.value, 
                        bestuursfunctie: e.bestuursfunctie.value, 
                        fractie: e.fractie, 
                        bestuurseenheidnaam: e.bestuurseenheidnaam.value
                    })
                })  
                // console.log(realdata);
                return realdata
              }).catch(function(error) {
                console.log("Failed!", error);
              })
            hasDataAgenda = hasAgenda().then(
              result => {
                const realdata = [];
                result.forEach(e => realdata.push({e}))
                // console.log(realdata)
                return realdata
              } );
            hasDataBesluit = hasBesluit().then(
              result => {
                const realdata = [];
                result.forEach(e => realdata.push({e}))
                // console.log(realdata)
                return realdata
              } );

            drawMap();
            }})// end mandaten
        map()

        async function over(name) {
          let eenBurgemeester = []; 
          mandatenData.then(info =>{
            let input_name = info.find(hu => hu.bestuurseenheidnaam === name);
            let put_name = input_name.bestuurseenheidnaam;  
            let bestuurseenheids = d3.group(info, d=> d.bestuurseenheidnaam) //d3.group(info, d => d[19]);
            let bestuurseenheid = bestuurseenheids.get(put_name);
            let bestuurfunctie = d3.group(bestuurseenheid, d => d.bestuursfunctie);
            let burgemeester = bestuurfunctie.get('Burgemeester'); 
            let formatTime = new Date();
            let today = formatTime.getTime()
            let bestuurperiod = new Date("1/1/2019")
            let period_Start = bestuurperiod.getTime()
            if(!burgemeester){
              return document.querySelector('#tooltip').innerHTML = `<span class="gemeente">${name}</span> `
            }else{
            burgemeester.forEach(burgemeesters => {
            let start_date = new Date(burgemeesters.start)
            let bestuur_Start = start_date.getTime()
            let end_date = new Date(burgemeesters.eind)
            let bestuur_End = end_date.getTime()
            if(+period_Start <= +bestuur_Start && !(+bestuur_End <= +today)){   
                eenBurgemeester.push({voornaam: burgemeesters.voornaam, achternaam: burgemeesters.achternaam, fractie: burgemeesters.fractie})
                return eenBurgemeester
            } //end condition
            })
            if(!eenBurgemeester[0].fractie){
              return document.querySelector('#tooltip').innerHTML = `<span class="gemeente">${name}</span> | ${eenBurgemeester[0].voornaam} ${eenBurgemeester[0].achternaam} ${[eenBurgemeester[0].fractie]} `
            }else{
              return document.querySelector('#tooltip').innerHTML = `<span class="gemeente">${name}</span> | ${eenBurgemeester[0].voornaam} ${eenBurgemeester[0].achternaam} <span class="burgermeester">${eenBurgemeester[0].fractie.value}</span> `
            }
            }
          })   
        }//end over()

        async function fetch_mandataris(){
          const endpointUrl = 'https://openbelgium-2021.lblod.info/sparql';
          const sparqlQuery = `
              PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
              PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
              PREFIX mandaat: <http://data.vlaanderen.be/ns/mandaat#>
              PREFIX mandataris: <http://data.vlaanderen.be/ns/mandaat#Mandataris>
              PREFIX besluit: <http://data.vlaanderen.be/ns/besluit#>
              PREFIX bevat: <http://www.w3.org/ns/org#hasPost>
              PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
              PREFIX bestuurseenheidt: <https://data.vlaanderen.be/ns/besluit#Bestuurseenheid>
              PREFIX bestuursorgaan: <http://data.vlaanderen.be/ns/besluit#Bestuursorgaan>
              PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
      
              SELECT DISTINCT ?start ?eind ?achternaam ?voornaam ?bestuursfunctie ?fractie ?bestuurseenheidnaam WHERE {
              ?mandataris a mandaat:Mandataris .
              ?mandataris mandaat:start ?start.
              OPTIONAL {?mandataris mandaat:einde ?eind.}
              OPTIONAL {?mandataris <http://data.vlaanderen.be/ns/mandaat#rangorde> ?rangorde.}
              OPTIONAL {?mandataris <http://data.vlaanderen.be/ns/mandaat#beleidsdomein> ?beleid.
                          ?beleid skos:prefLabel ?beleidsdomein.}
              
              ?mandataris <http://data.vlaanderen.be/ns/mandaat#isBestuurlijkeAliasVan> ?person .
              ?person a <http://www.w3.org/ns/person#Person> .
              ?person <http://xmlns.com/foaf/0.1/familyName> ?achternaam .
              ?person <http://data.vlaanderen.be/ns/persoon#gebruikteVoornaam> ?voornaam.
              
              ?mandataris <http://www.w3.org/ns/org#holds> ?functie .
              ?functie <http://www.w3.org/ns/org#role> ?rol .
              ?rol <http://www.w3.org/2004/02/skos/core#prefLabel> ?bestuursfunctie .
              
              OPTIONAL {?mandataris <http://www.w3.org/ns/org#hasMembership> ?lid .
                    ?lid <http://www.w3.org/ns/org#organisation> ?o.
                    ?o a <http://data.vlaanderen.be/ns/mandaat#Fractie>.
                      ?o <https://www.w3.org/ns/regorg#legalName> ?fractie.}
              
              ?mandataris <http://www.w3.org/ns/org#holds> ?manda .
              ?manda a <http://data.vlaanderen.be/ns/mandaat#Mandaat> .
              ?specializationInTime <http://www.w3.org/ns/org#hasPost> ?manda.
              ?manda <http://www.w3.org/ns/org#role> ?bo .
              ?bo <http://www.w3.org/2004/02/skos/core#prefLabel> ?bestuursorgaanTijd .
              ?specializationInTime <http://data.vlaanderen.be/ns/mandaat#isTijdspecialisatieVan> ?boo  .
              ?boo <http://www.w3.org/2004/02/skos/core#prefLabel> ?bestuursorgaan .
              ?boo besluit:classificatie ?classificatie.
              ?classificatie skos:prefLabel ?bestuursclassificatie .
              ?boo besluit:bestuurt ?s .
              ?s a besluit:Bestuurseenheid .
              ?s besluit:werkingsgebied [rdfs:label ?bestuurseenheidnaam]
                    
              FILTER (?eind >= xsd:date(NOW()) || NOT EXISTS {?mandataris mandaat:einde ?eind.} )
              }
      
              ORDER BY ASC(?bestuurseenheidnaam) ASC(?fractie) ASC(?voornaam) 
          `;
          const results = []
          const queryDispatcher = new SPARQLQueryDispatcher( endpointUrl );
          return await queryDispatcher.query( sparqlQuery ).then(results);
          }

        async function hasAgenda(){
          const endpointUrl = 'https://qa.centrale-vindplaats.lblod.info/sparql';
          const sparqlQuery = `
          PREFIX dcterm: <http://purl.org/dc/terms/>
          PREFIX dct: <http://purl.org/dc/terms/>
          PREFIX dc: <http://purl.org/dc/elements/1.1/>
          PREFIX bs: <https://w3id.org/def/basicsemantics-owl#>
          PREFIX ma: <http://www.w3.org/ns/ma-ont#>
          PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
          PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
          PREFIX besluit: <http://data.vlaanderen.be/ns/besluit#>
          PREFIX mandaat: <http://data.vlaanderen.be/ns/mandaat#>
          PREFIX persoon: <http://data.vlaanderen.be/ns/persoon#>
          PREFIX dcterms: <http://purl.org/dc/terms/>
          PREFIX prov: <http://www.w3.org/ns/prov#>
          PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>

          SELECT ?bestuurseenheidnaam WHERE {
            ?zitting a besluit:Zitting .
            ?zitting besluit:behandelt ?agendapunt .
            ?zitting besluit:geplandeStart ?geplandeStart.
            ?zitting besluit:isGehoudenDoor ?bo .
            ?bo besluit:bestuurt ?s .
            ?s a besluit:Bestuurseenheid .
            ?s besluit:werkingsgebied [rdfs:label ?bestuurseenheidnaam]
            FILTER (?geplandeStart > "2021-04-01"^^xsd:date)
          }
          GROUP BY ?bestuurseenheidnaam
          `;
          const results = []
          const queryDispatcher = new SPARQLQueryDispatcher( endpointUrl);
          const data_qa = await queryDispatcher.query( sparqlQuery ).then(results);
          const realdata = [];
          data_qa.results.bindings.forEach(e => {
            realdata.push(e.bestuurseenheidnaam.value)
          }) 
          return realdata
          }

        async function hasBesluit(){
          const endpointUrl = 'https://openbelgium-2021.lblod.info/sparql';
          const sparqlQuery = `
          PREFIX dcterm: <http://purl.org/dc/terms/>
          PREFIX dct: <http://purl.org/dc/terms/>
          PREFIX dc: <http://purl.org/dc/elements/1.1/>
          PREFIX bs: <https://w3id.org/def/basicsemantics-owl#>
          PREFIX ma: <http://www.w3.org/ns/ma-ont#>
          PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
          PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
          PREFIX besluit: <http://data.vlaanderen.be/ns/besluit#>
          PREFIX bestuursorgaan:<http://data.vlaanderen.be/ns/besluit#Bestuursorgaan>
          PREFIX mandaat: <http://data.vlaanderen.be/ns/mandaat#>
          PREFIX mandataris: <http://data.vlaanderen.be/ns/mandaat#Mandataris>
          PREFIX persoon: <http://data.vlaanderen.be/ns/persoon#>
          PREFIX dcterms: <http://purl.org/dc/terms/>
          PREFIX prov: <http://www.w3.org/ns/prov#>
          PREFIX ontology: <http://data.europa.eu/eli/ontology#> 
          PREFIX citeeropschrift: <http://data.europa.eu/eli/ontology#title_short>
          PREFIX foaf: <http://xmlns.com/foaf/0.1/> 
          PREFIX terms: <http://purl.org/dc/terms/> 
          PREFIX isBestuurlijkeAliasVan: <http://data.vlaanderen.be/ns/mandaat#isBestuurlijkeAliasVan>
          PREFIX gebruikteVoornaam: <https://data.vlaanderen.be/ns/persoon#gebruikteVoornaam>
          PREFIX familyName: <http://xmlns.com/foaf/0.1/familyName>
          PREFIX classificatie: <http://data.vlaanderen.be/ns/besluit#classificatie>
          PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
          PREFIX behandelingAgendapunt: <https://data.vlaanderen.be/ns/besluit#BehandelingVanAgendapunt>
          PREFIX skos: <http://www.w3.org/2004/02/skos/core#>

          SELECT DISTINCT ?bestuurseenheidnaam WHERE {
            ?zitting a besluit:Zitting ;
                  besluit:geplandeStart ?geplandeStart;
                  besluit:behandelt ?agendapunt .
                  ?agendapunt a besluit:Agendapunt .
          OPTIONAL { ?zitting <http://www.w3.org/ns/prov#atLocation> ?location}
            
          ?behandelingAgendapunt a besluit:BehandelingVanAgendapunt;
              terms:subject ?agendapunt;
              prov:generated ?decision.
            ?decision ontology:title ?title;
              prov:value ?value;
              besluit:motivering ?motivering;
              ontology:description ?description .
                
          ?behandelingVanAgendapunt dcterms:subject ?agendapunt ;
                                      besluit:heeftStemming ?stemming.
          ?stemming besluit:aantalVoorstanders ?nbPro;
                      besluit:aantalTegenstanders ?nbAnti;
                      besluit:aantalOnthouders ?nbNoVote.
          
          ?besluit prov:wasGeneratedBy ?behandelingVanAgendapunt ;
                  ontology:title ?title .
          ?zitting besluit:isGehoudenDoor ?bo .
          OPTIONAL {	?bo a <http://www.w3.org/ns/org#classification> .}
          OPTIONAL {  ?bo <http://www.w3.org/2004/02/skos/core#prefLabel> ?bestuursorgaan .}
          OPTIONAL {  ?bo besluit:classificatie ?classificatie.
                  ?classificatie skos:prefLabel ?bestuursclassificatie .}

                  ?bo besluit:bestuurt ?s .
                  ?s a besluit:Bestuurseenheid .
                  ?s <http://www.w3.org/2004/02/skos/core#prefLabel> ?bestuurseenheidnaam .
            
          FILTER (?geplandeStart > "2021-02-01"^^xsd:date)
          }
          `;
          const results = []
          const queryDispatcher = new SPARQLQueryDispatcher( endpointUrl);
          const data_qa = await queryDispatcher.query( sparqlQuery ).then(results);
          const realdata = [];
          data_qa.results.bindings.forEach(e => {
            realdata.push(e.bestuurseenheidnaam.value)
          }) 
          return realdata
          }

    } //end initMap 



  
}
