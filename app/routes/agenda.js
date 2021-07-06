import Route from '@ember/routing/route';
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
export default class AgendaRoute extends Route {
 /*  @service map;
  setupController() {
    super.setupController(...arguments);
    this.map.empty();
  } */
  async model(){
               /*  let response = await fetch('/api/agenda.json');
                let datas = await response.json(); 
                const data = [];
                datas.results.bindings.forEach(e => {
                    data.push({
                    bestuurseenheidnaam: e.bestuurseenheidnaam.value,
                    bestuursclassificatie: e.bestuursclassificatie.value,
                    // bestuursorgaan: e.bestuursorgaan.value,
                    geplandeStart: e.geplandeStart.value,
                    location: e.location,
                    title_agenda: e.title_agenda,
                    // make condition first cause some arg doesn't have value then got error
                    title_before_agendapunt: e.title_before_agendapunt,
                    description: e.description
                })
                }) */
                const endpointUrl1 = 'https://openbelgium-2021.lblod.info/sparql';
                const endpointUrl = 'https://qa.centrale-vindplaats.lblod.info/sparql';
                const sparqlQuery = `
                PREFIX besluit: <http://data.vlaanderen.be/ns/besluit#>
                PREFIX mandaat: <http://data.vlaanderen.be/ns/mandaat#>
                PREFIX Zitting: <https://data.vlaanderen.be/ns/besluit#Zitting>
                PREFIX Bestuurseenheid: <http://data.vlaanderen.be/ns/besluit#Bestuurseenheid>
                PREFIX Agendapunt: <http://data.vlaanderen.be/ns/besluit#Agendapunt>
                PREFIX isGehoudenDoor: <http://data.vlaanderen.be/ns/besluit#isGehoudenDoor>
                PREFIX behandelt: <http://data.vlaanderen.be/ns/besluit#behandelt>
                PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
                PREFIX terms: <http://purl.org/dc/terms/>
                PREFIX title: <http://purl.org/dc/terms/title>
                PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
                PREFIX ext: <http://mu.semte.ch/vocabularies/ext/>
                PREFIX classificatie: <http://data.vlaanderen.be/ns/besluit#classificatie>
                PREFIX concept: <http://www.w3.org/2004/02/skos/core#Concept>
                
                SELECT DISTINCT ?geplandeStart ?location ?title_agenda ?description ?bestuursclassificatie ?bestuurseenheidnaam WHERE {
                  ?zitting a besluit:Zitting .
                  OPTIONAL { ?zitting <http://www.w3.org/ns/prov#startedAtTime> ?start }
                  OPTIONAL { ?zitting besluit:geplandeStart ?geplandeStart }
                  OPTIONAL { ?zitting <http://www.w3.org/ns/prov#atLocation> ?location}
                  
                  ?zitting besluit:behandelt ?agendapunt.
                  ?agendapunt a besluit:Agendapunt .
                  ?agendapunt terms:title ?title_agenda .
                   OPTIONAL { ?agendapunt terms:description ?description .
                       ?agendapunt besluit:geplandOpenbaar ?OpenbaarOfNiet .
                  BIND (IF(?openbaarOfNiet = 1, "Openbaar", "Openbaar niet") as ?geplandOpenbaar)
                 }
                  ?zitting besluit:isGehoudenDoor ?bo .
                  ?bo skos:prefLabel ?bestuursorgaan .
                  ?bo besluit:classificatie ?classificatie.
                  ?classificatie skos:prefLabel ?bestuursclassificatie .
                  ?bo besluit:bestuurt ?s .
                  ?s a besluit:Bestuurseenheid .
                  ?s besluit:werkingsgebied [rdfs:label ?bestuurseenheidnaam]
                  
                  FILTER (?geplandeStart > "2021-04-01"^^xsd:date)
                }
                ORDER BY DESC(?geplandeStart) ASC(?title_agenda)
              `;
              const results = []
              const queryDispatcher = new SPARQLQueryDispatcher( endpointUrl );
              const data_qa = await queryDispatcher.query( sparqlQuery ).then(results);
              const realdata = [];
              data_qa.results.bindings.forEach(e => {
                realdata.push({
                  bestuurseenheidnaam: e.bestuurseenheidnaam.value,
                  bestuursclassificatie: e.bestuursclassificatie.value,
                  geplandeStart: e.geplandeStart.value,
                  location: e.location,
                  title_agenda: e.title_agenda,
                  title_before_agendapunt: e.title_before_agendapunt,
                  description: e.description
                  })
              })  
              return {/* data, */ realdata};        
    }
}
