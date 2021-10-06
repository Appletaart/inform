import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
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
export default class SwitchBarAgendaComponent extends Component {
    @tracked selected;
    @tracked agendalist;
    @service map;
    
    @action toggleClose() {
        d3.select(".agenda").transition().style("visibility", "hidden")
        if(this.checked){
          return this.identifier = "bar-right", this.checked = false;
        }
    }

    get getGemeente() {
        if (!this.map['gemeente'].name) {
        } else {
          this.selected = this.map['gemeente'].name;
          this.agendalist = null

          // console.log(this.selected);
          return this.selected
        }
      }

      
      @tracked checked = false;
      @tracked identifier = "bar-right";
    
      @action
      onChange() {
        this.checked = !this.checked;
        if(!this.checked){
          // console.log("hello left", this.identifier = "bar-right");
          return this.identifier = "bar-right";
        }else{
          // console.log("hello right", this.identifier = "bar-left");
          return this.identifier = "bar-left";
        }
      }

      get agenda(){
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

        SELECT DISTINCT ?geplandeStart ?location ?title_agenda ?description ?bestuursclassificatie WHERE {
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
              ?eenheid besluit:werkingsgebied [rdfs:label "${this.selected}"].
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
              ?eenheid besluit:werkingsgebied [rdfs:label "${this.selected}"].
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
          BIND(xsd:date(now()) AS ?time)
          BIND(STRDT(?dayTofilter, xsd:date) AS ?filterDate)
          FILTER (?geplandeStart > ?filterDate || ?geplandeStart = ?filterDate)
        }
        ORDER BY DESC(?geplandeStart) xsd:integer( ?title_agenda ) ASC(?title_agenda) 
          `;
      
        const queryDispatcher = new SPARQLQueryDispatcher( endpointUrl );
        const results = [];
        const getData = queryDispatcher.query( sparqlQuery ).then(results)
        // console.log(getData);
        getData.then( results => {
        const datas = []
        results.results.bindings.forEach(e => {
        datas.push({
        // bestuurseenheidnaam: e.bestuurseenheidnaam.value,
        bestuursclassificatie: e.bestuursclassificatie.value,
        geplandeStart: e.geplandeStart.value,
        location: e.location,
        title_agenda: e.title_agenda,
        description: e.description
        })
        })// end first binding
        
        // const bestuurseenheids = d3.group(this.model, d => d.bestuurseenheidnaam);     
        // const een_bestuurseenheid = []
        // for (const [key] of bestuurseenheids) {een_bestuurseenheid.push(key)}
        // const bestuurseenheid = bestuurseenheids.get(this.gemeente);
            let detailsAgenda = [];
            let groupAgenda = [];
            // console.log(datas);
            datas.forEach(bestuurseenheids => {
            detailsAgenda.push({
                geplandeStart: bestuurseenheids.geplandeStart,
                bestuursclassificatie: bestuurseenheids.bestuursclassificatie,
                location: bestuurseenheids.location,
                title_agenda: bestuurseenheids.title_agenda,
                description: bestuurseenheids.description
            })
            return detailsAgenda
            })
            let nameschepen = d3.group(detailsAgenda, d => d.geplandeStart)
            for (const [key, value] of nameschepen) {
            const classificatie = d3.group(value, d => d.bestuursclassificatie)
            const classy = []
            for (const [key, value] of classificatie) { 
            classy.push({ bestuursclassificatie: key, details: value }) 
            } 
            groupAgenda.push({ 
                geplandeStart: key, 
                location: value[0].location,
                classy: classy
            })
            }
        
          this.agendalist = {groupAgenda}
         //   console.log(this.agendalist);
          return this.agendalist
        });//end then
        }
}
