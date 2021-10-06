import Component from '@glimmer/component';
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
  @service map;
  @service hasagenda;
  @service hasbesluit;

  @action
  addToService(item){
    this.map.addItem(item)
  }

  @action
  initMap() {
      let provincesData;
      let gemeenteData;
      let mandatenData;
      let features;
      let agendaData;
      let besluitData;
      const hasagenda = this.hasagenda;
      const hasbesluit = this.hasbesluit;
      const width = 800;
      const height = 400;
      const container = d3.select('.bp-map')
      
      const tooltip = d3.select("#tooltip");
      const spike = (length = 10, width = 5) => `M${-width / 2},0L0,${-length}L${width / 2},0`
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
      .scale(13400) 
      .translate([-590, 14120]); 

    const path = geoPath().projection(projection);

    async function drawMap() {

      g.selectAll("path")
      .data(gemeenteData,)
      .enter()
      .append("path")
      .attr("class", "municipalities") 
      .attr("id", gemeenteDataItem => {
        let name = gemeenteDataItem.properties["name_nl"];
        return name;
        })
        .attr("d", path)
        .attr("fill", (gemeenteDataItem) => {
        let name = gemeenteDataItem.properties["name_nl"]; 
        agendaData.forEach(e => {
          if(name === e.name){
            return d3.select("#"+e.name).style("fill", "#e1e5e8")
          }
        })
        besluitData.forEach(e => {
          if(name === e.e){
            return d3.select("#"+e.e).style("fill", "#7f8d99")
          }
        })
       //  issue: doesn't show De Panne          
        return "#f8f8f8";
      }).on("mouseover", (gemeenteDataItem) => {
          tooltip.transition().style("visibility", "visible");
          let name = gemeenteDataItem.properties["name_nl"];
          over(name)
      }).on("click", (gemeenteDataItem) => {
            //  d3.select(".indexClick").transition().style("visibility", "visible")
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
    
    //agenda symbol
    svg.append("g")
    .attr("fill-opacity", 1)
    .attr("stroke", "#D92626")
    .selectAll("path")
  .data(agendaData)
  .join("path")
  .attr("id", d => {
    const name = d.name;
    return name;
    })
  .attr('class', 'spike')
  .attr("fill", (d) => {
        const name = d.name;
          // console.log(name, d.geplandeStart)
          const datenow = new Date(Date.now()).setHours(0,0,0,0) // toDateString()
          const f = new Date(d.geplandeStart);
          const dateplan = f.getTime()
          // console.log(name, d.geplandeStart, dateplan > datenow || dateplan == datenow)
          if(dateplan > datenow || dateplan == datenow){
            return d3.select("path#"+name+".spike").style("fill", "#FFC515")
          }
        return "#D92626" 
    })
  .attr("transform", d => `translate(${d.position})`)
  .attr("d", spike())
  .append("title")
  .text(d =>`${d.name}`);

// start legend
const legend = g.append("g");

// komende agenda
  legend.append("rect")
      .attr("x", 635)
      .attr("y", 15)
      .attr("width", 8)
      .attr("height", 8)
      .attr("class", "legend")
      .attr("fill", "#e1e5e8")

  legend.append("path")
      .attr("fill", "#FFC515")
      .attr("fill-opacity", 1)
      .attr("stroke", "#D92626")
      .attr("transform",`translate(639,18)`)
      .attr("d", spike());

  legend.append("text")
      .attr("x", 650)
      .attr("y", 22)
      .attr("class", "text_legend")
      .attr("fill", "#657d9a")
      .text("Agenda komende zittingen")

 // legend agenda
  legend.append("rect")
      .attr("x", 635)
      .attr("y", 30)
      .attr("width", 8)
      .attr("height", 8)
      .attr("class", "legend")
      .attr("fill", "#e1e5e8")

  legend.append("path")
      .attr("fill", "#D92626")
      .attr("fill-opacity", 0.5)
      .attr("stroke", "#D92626")
      .attr("transform",`translate(639,34)`)
      .attr("d", spike());

   legend.append("text")
      .attr("x", 650)
      .attr("y", 37)
      .attr("class", "text_legend")
      .attr("fill", "#657d9a")
      .text("Agenda recente 3 maanden")

// legend_besluit
  legend.append("rect")
      .attr("x", 635)
      .attr("y", 45)
      .attr("width", 8)
      .attr("height", 8)
      .attr("class", "legend_besluit")
      .attr("fill", "#7f8d99")

  legend.append("text")
      .attr("x", 650)
      .attr("y", 52)
      .attr("class", "text_legend")
      .attr("fill", "#657d9a")
      .text("Besluiten recente 4 maanden") 
// end legend

    }//drawMap
      //  "/lokaalbesluit/api/vlaanderen.json"
      const map = async () => d3.json('assets/api/vlaanderen.json').then((data, error) => {
        if (error) {
          console.log(log);
        } else { 
          provincesData = topojson.feature(data, data.objects.provinces).features;
          gemeenteData = topojson.feature(data, data.objects.municipalities).features;
          features = new Map(topojson.feature(data, data.objects.municipalities).features.map(d => [d.properties.name_nl, d]));
          // console.log(gemeenteData);
          mandatenData = fetch_mandataris().then(result => {
              const datas = result.results['bindings']
              const realdata = [];
              datas.forEach(e => {
                realdata.push({
                start: e.start.value,
                eind: e.eind, 
                achternaam: e.achternaam.value, 
                voornaam: e.voornaam.value, 
                fractie: e.fractie, 
                bestuurseenheidnaam: e.bestuurseenheidnaam.value
                })
              })  
              return realdata
          }).catch(function(error) {
            console.log("Failed!", error);
          })
          
          hasAgenda().then( result => {
            agendaData = result
          hasBesluit().then(result => {
            besluitData = result 
          drawMap();
      }); //hasBesluit
      }); //hasAgenda
      }});// end mandaten
      map();

      async function over(name) {
        let eenBurgemeester = []; 
          mandatenData.then(info =>{
          let input_name = info.find(hu => hu.bestuurseenheidnaam === name);
          let put_name = input_name.bestuurseenheidnaam;  
          let bestuurseenheids = d3.group(info, d=> d.bestuurseenheidnaam) //d3.group(info, d => d[19]);
          let bestuurseenheid = bestuurseenheids.get(put_name);
          let formatTime = new Date();
          let today = formatTime.getTime()
          let bestuurperiod = new Date("1/1/2019")
          let period_Start = bestuurperiod.getTime()
          bestuurseenheid.forEach(burgemeesters => {
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
            const classColor = eenBurgemeester[0].fractie.value;
            switch(classColor){
              case "N-VA":
              case "Groen":
              case "Vooruit":
              case "CD&V":
              case "CD&V+": 
              case "Open": 
              case "Open-Vld":
              case "Vlaams":
              case "TEAM":
              case "Lijst": 
            }
            //  console.log(classColor);
            return document.querySelector('#tooltip').innerHTML = `<span class="gemeente">${name}</span> | ${eenBurgemeester[0].voornaam} ${eenBurgemeester[0].achternaam} <span class="fractie ${classColor}">${eenBurgemeester[0].fractie.value}</span>`
          }
          }
        )   
      }//end over()

      async function fetch_mandataris(){
        const endpointUrl = 'https://centrale-vindplaats.lblod.info/sparql';
        const sparqlQuery = `
            PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
            PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
            PREFIX mandaat: <http://data.vlaanderen.be/ns/mandaat#>
            PREFIX besluit: <http://data.vlaanderen.be/ns/besluit#>
            PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
            PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
    
            SELECT DISTINCT ?start ?eind ?achternaam ?voornaam ?bestuursfunctie ?fractie ?bestuurseenheidnaam WHERE {
            ?mandataris a mandaat:Mandataris .
            ?mandataris mandaat:start ?start.
            OPTIONAL {?mandataris mandaat:einde ?eind.}
            OPTIONAL {?mandataris mandaat:rangorde ?rangorde.}
            OPTIONAL {?mandataris mandaat:beleidsdomein ?beleid;
                      skos:prefLabel ?beleidsdomein.}
            
            ?mandataris mandaat:isBestuurlijkeAliasVan ?person .
            ?person a <http://www.w3.org/ns/person#Person> .
            ?person <http://xmlns.com/foaf/0.1/familyName> ?achternaam .
            ?person <http://data.vlaanderen.be/ns/persoon#gebruikteVoornaam> ?voornaam.
            
            ?mandataris <http://www.w3.org/ns/org#holds> ?functie .
            ?functie <http://www.w3.org/ns/org#role> ?rol .
            ?rol <http://www.w3.org/2004/02/skos/core#prefLabel> 'Burgemeester' .
            
            OPTIONAL {?mandataris <http://www.w3.org/ns/org#hasMembership> ?lid .
                  ?lid <http://www.w3.org/ns/org#organisation> ?o.
                  ?o a mandaat:Fractie.
                  ?o <https://www.w3.org/ns/regorg#legalName> ?fractie.}
            
            ?mandataris <http://www.w3.org/ns/org#holds> ?manda .
            ?manda a mandaat:Mandaat .
            ?specializationInTime <http://www.w3.org/ns/org#hasPost> ?manda.
            ?manda <http://www.w3.org/ns/org#role> ?bo .
            ?bo <http://www.w3.org/2004/02/skos/core#prefLabel> ?bestuursorgaanTijd .
            ?specializationInTime mandaat:isTijdspecialisatieVan ?boo  .
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
        PREFIX besluit: <http://data.vlaanderen.be/ns/besluit#>
        PREFIX mandaat: <http://data.vlaanderen.be/ns/mandaat#>
        PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
        PREFIX terms: <http://purl.org/dc/terms/>
        PREFIX title: <http://purl.org/dc/terms/title>
        PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
        PREFIX ext: <http://mu.semte.ch/vocabularies/ext/>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

        SELECT DISTINCT  ?filterDate1 ?bestuurseenheidnaam WHERE {
          ?zitting a besluit:Zitting .
          ?zitting besluit:geplandeStart ?geplandeStart .
          OPTIONAL { ?zitting <http://www.w3.org/ns/prov#atLocation> ?location}

          ?zitting besluit:behandelt ?agendapunt.
          ?agendapunt a besluit:Agendapunt .
          ?agendapunt terms:title ?title .
          BIND(str(?title) AS ?title_agenda)
          OPTIONAL { ?agendapunt terms:description ?description .
            ?agendapunt besluit:geplandOpenbaar ?OpenbaarOfNiet .
            BIND (IF(?openbaarOfNiet = 1, "Openbaar", "Openbaar niet") as ?geplandOpenbaar)
          }

          { 
            ?zitting a besluit:Zitting.
            ?zitting besluit:isGehoudenDoor ?bestuursorgaan.
            ?bestuursorgaan besluit:classificatie ?classificatie.
            ?classificatie skos:prefLabel ?bestuursclassificatie .
            ?bestuursorgaan besluit:bestuurt ?eenheid.
            ?eenheid a besluit:Bestuurseenheid .
            ?eenheid besluit:werkingsgebied [rdfs:label ?bestuurseenheidnaam].
          }
          UNION
          {  
            ?zitting a besluit:Zitting.
            ?zitting besluit:isGehoudenDoor ?bestuursorgaanInTijd.
            ?bestuursorgaanInTijd mandaat:isTijdspecialisatieVan ?bestuursorgaan.
            ?bestuursorgaan besluit:classificatie ?classificatie.
            ?classificatie skos:prefLabel ?bestuursclassificatie .
            ?bestuursorgaan besluit:bestuurt ?eenheid.
            ?eenheid a besluit:Bestuurseenheid .
            ?eenheid besluit:werkingsgebied [rdfs:label ?bestuurseenheidnaam].
          }

          FILTER(?bestuursclassificatie = "Gemeenteraad" || ?bestuursclassificatie = "Raad voor Maatschappelijk Welzijn")

          BIND(day(now()) AS ?day)
          BIND(IF(?day < 10, "-0", "-") AS ?day2)
          BIND(month(now()) - 3 AS ?month)
          BIND(IF(?month < 1, ?month + 12, ?month) AS ?month2)
          BIND(IF(?month2 < 10, "-0", "-") AS ?month3)
          BIND(year(now()) AS ?year)
          BIND(IF(?month < 1, ?year - 1, ?year) AS ?year2)
          BIND(CONCAT(?year2, ?month3, ?month2, ?day2, ?day) as ?dayTofilter)
          BIND(STRDT(?dayTofilter, xsd:date) AS ?filterDate)

          BIND(day(?geplandeStart) AS ?day5)
          BIND(IF(?day5 < 10, "-0", "-") AS ?day6)
          BIND(month(?geplandeStart) AS ?month5)
          BIND(IF(?month5 < 1, ?month5 + 12, ?month5) AS ?month6)
          BIND(IF(?month6 < 10, "-0", "-") AS ?month7)
          BIND(year(?geplandeStart) AS ?year5)
          BIND(IF(?month5 < 1, ?year5 - 1, ?year5) AS ?year6)
          BIND(CONCAT(?year6, ?month7, ?month6, ?day6, ?day5) as ?dayTofilter1)
          BIND(STRDT(?dayTofilter1, xsd:date) AS ?filterDate1)
          FILTER (?geplandeStart > ?filterDate || ?geplandeStart = ?filterDate) 
        }
        GROUP BY (?bestuurseenheidnaam)
        ORDER BY DESC(?geplandeStart)
        `;
        const results = []
        const queryDispatcher = new SPARQLQueryDispatcher(endpointUrl);
        const data_qa = await queryDispatcher.query( sparqlQuery ).then(results);
        const realdata = [];
        data_qa.results.bindings.forEach(e => {
          realdata.push({
            bestuurseenheidnaam:e.bestuurseenheidnaam.value,
            geplandeStart:e.filterDate1.value
          })
        })
        // console.log(realdata);
        const hu = d3.group(realdata, d => d.bestuurseenheidnaam)
        const eenheidnaam = [];
        for (const [key, value] of hu) { 
          eenheidnaam.push({ bestuurseenheidnaam: key, geplandeStart: value[0].geplandeStart })
        }
      // console.log(eenheidnaam);
        // service to take info to search bar
        hasagenda.addItem(eenheidnaam)
        // make legend
        const agendadata = []
        eenheidnaam.forEach(e => {
        //  console.log(e);
        const feature = features.get(e.bestuurseenheidnaam)
       // console.log(feature);
        agendadata.push({
        position: feature && path.centroid(feature),
        name: feature && feature.properties.name_nl,
        geplandeStart:e.geplandeStart
        })
        }) 
        
       // console.log(agendadata);
        agendadata.filter(d => d.position)
        agendadata.sort((a, b) => d3.ascending(a.position[1], b.position[1])
         || d3.ascending(a.position[0], b.position[0]))
        return agendadata
        }

      async function hasBesluit(){
        const endpointUrl = 'https://qa.centrale-vindplaats.lblod.info/sparql';
        // const endpointUrl1 = 'https://openbelgium-2021.lblod.info/sparql';
        const sparqlQuery = `
        PREFIX besluit: <http://data.vlaanderen.be/ns/besluit#>
        PREFIX mandaat: <http://data.vlaanderen.be/ns/mandaat#>
        PREFIX persoon: <http://data.vlaanderen.be/ns/persoon#>
        PREFIX prov: <http://www.w3.org/ns/prov#>
        PREFIX ontology: <http://data.europa.eu/eli/ontology#> 
        PREFIX foaf: <http://xmlns.com/foaf/0.1/> 
        PREFIX terms: <http://purl.org/dc/terms/> 
        PREFIX familyName: <http://xmlns.com/foaf/0.1/familyName>
        PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
        PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
                
            SELECT DISTINCT ?bestuurseenheidnaam WHERE {
              
            ?zitting a besluit:Zitting ;
            besluit:geplandeStart ?geplandeStart;
            besluit:behandelt ?agendapunt .
              
          ?behandelingAgendapunt a besluit:BehandelingVanAgendapunt;
                            terms:subject ?agendapunt;
                      prov:generated ?decision.
          ?behandelingAgendapunt prov:generated ?decision.
          ?behandelingAgendapunt besluit:openbaar ?openbaar .
          FILTER(?openbaar)
                    ?decision ontology:title ?titles.
          
          { 
          ?zitting besluit:isGehoudenDoor ?bo .  
          ?bo besluit:classificatie ?classificatie.
          ?classificatie skos:prefLabel ?bestuursclassificatie .
          ?bo besluit:bestuurt ?s .
          ?s a besluit:Bestuurseenheid .
          ?s besluit:werkingsgebied [rdfs:label ?bestuurseenheidnaam].
          }
            UNION
          {  
            ?zitting a besluit:Zitting.
            ?zitting besluit:isGehoudenDoor ?bestuursorgaanInTijd.
            ?bestuursorgaanInTijd mandaat:isTijdspecialisatieVan ?boo  .
            ?boo besluit:classificatie ?classificatie.
            ?classificatie skos:prefLabel ?bestuursclassificatie .
            ?boo besluit:bestuurt ?s .
            ?s a besluit:Bestuurseenheid .
            ?s besluit:werkingsgebied [rdfs:label ?bestuurseenheidnaam].
          
          }

          FILTER(?bestuursclassificatie = "Gemeenteraad" || ?bestuursclassificatie = "Raad voor Maatschappelijk Welzijn")
            
          BIND(day(now()) AS ?day)
          BIND(IF(?day < 10, "-0", "-") AS ?day2)
          BIND(month(now()) - 4 AS ?month)
          BIND(IF(?month < 1, ?month + 12, ?month) AS ?month2)
          BIND(IF(?month2 < 10, "-0", "-") AS ?month3)
          BIND(year(now()) AS ?year)
          BIND(IF(?month < 1, ?year - 1, ?year) AS ?year2)
          BIND(CONCAT(?year2, ?month3, ?month2, ?day2, ?day) as ?dayTofilter)
          BIND(STRDT(?dayTofilter, xsd:date) AS ?filterDate)
          FILTER (?geplandeStart > ?filterDate || ?geplandeStart = ?filterDate)
            }
        ORDER BY DESC(?geplandeStart) 
        `;
        const results = []
        const queryDispatcher = new SPARQLQueryDispatcher(endpointUrl);
        const data_qa = await queryDispatcher.query( sparqlQuery ).then(results);
        const realdata = [];
        data_qa.results.bindings.forEach(e => {
          realdata.push(e.bestuurseenheidnaam.value)
        }) 
        // service to take info to search bar
        hasbesluit.addItem(realdata)
        const result = [];
        realdata.forEach(e => result.push({e}))
        return result
        }
  } //end initMap 
  
}
