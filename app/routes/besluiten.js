import Route from '@ember/routing/route';
import { tracked } from '@glimmer/tracking';

export default class BesluitenRoute extends Route {
  async model(){
    let response = await fetch('/api/besluiten_naam_aanwezige.json');
    let data = await response.json(); 
    let responses = await fetch('/api/besluiten.json');
    let data_qa = await responses.json();
    const datas = [];
    data.results.bindings.forEach(e => {
        datas.push({
          bestuurseenheidnaam: e.bestuurseenheidnaam.value,
          geplandeStart: e.geplandeStart.value,
          location: e.location.value,
          agendapunt_aanwezige: e.agendapunt_aanwezige.value,
          }) 
    })
    const datas_qa = [];
    data_qa.results.bindings.forEach(e => {
      datas_qa.push({
      bestuurseenheidnaam: e.bestuurseenheidnaam.value,// .replace('Gemeente','').trim(),
      bestuursorgaan: e.bestuursorgaan.value,
      geplandeStart: e.geplandeStart.value,
      location: e.location,
      title: e.title.value,
      description: e.description,
      motivering: e.motivering,
      nbPro: e.nbPro,
      nbAnti: e.nbAnti,
      nbNoVote: e.nbNoVote
  })
  })
 
   return {datas, datas_qa}
}

   /*  async model() {
        return await new Promise((resolve, reject) => {
        Comunica.newEngine().query(`
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
        
        SELECT ?werkingsgebied (COUNT(?besluit) as ?count) WHERE {
          ?zitting a besluit:Zitting .
          ?zitting besluit:behandelt ?agendapunt .
          ?behandelingVanAgendapunt dcterms:subject ?agendapunt .
         
          ?besluit prov:wasGeneratedBy ?behandelingVanAgendapunt .
          
          ?zitting besluit:isGehoudenDoor ?bo .
          ?bo besluit:bestuurt ?s .
          ?s a besluit:Bestuurseenheid .
          ?s besluit:werkingsgebied [
              rdfs:label ?werkingsgebied
          ]
        }
        
        GROUP BY ?werkingsgebied
         `, {
            sources: [
            {
            'type': 'sparql',
            'value': 'https://openbelgium-2021.lblod.info/sparql'
            }],
          }).then(function (result) {
            let municipalities = [];
            // console.log(result);
            result.bindingsStream.on('data', function (data) {
                let tmp = {
                  "cityName": data.get('?werkingsgebied').value,
                "count": data.get('?count').value
              }
              // Each variable binding is an RDFJS term
              municipalities.push(tmp)
            });
            result.bindingsStream.on('end', function() {
                resolve(municipalities);
            })
          }).catch((e) => {
          console.log(e);
          reject(e);
          });
            });
        }
 */
    /* fetchDecisions(municipality) {
        
        return new Promise((resolve, reject) => {
            Comunica.newEngine().query(`
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
        PREFIX ontology: <http://data.europa.eu/eli/ontology#>
        
        SELECT ?nbPro ?nbAnti ?nbNoVote ?besluit ?title WHERE {
          ?zitting a besluit:Zitting .
          ?zitting besluit:behandelt ?agendapunt .
          ?behandelingVanAgendapunt dcterms:subject ?agendapunt ;
                                    besluit:heeftStemming ?stemming.
          ?stemming besluit:aantalVoorstanders ?nbPro;
                    besluit:aantalTegenstanders ?nbAnti;
                    besluit:aantalOnthouders ?nbNoVote.
         
          ?besluit prov:wasGeneratedBy ?behandelingVanAgendapunt ;
                   ontology:title ?title .
          
          ?zitting besluit:isGehoudenDoor ?bo .
          ?bo besluit:bestuurt ?s .
          ?s a besluit:Bestuurseenheid .
          ?s besluit:werkingsgebied [
              rdfs:label '${municipality}'
          ]
        }
        
         `, {
            sources: [
            {
            'type': 'sparql',
            'value': 'https://openbelgium-2021.lblod.info/sparql'
            }],
          }).then(function (result) {
            let decisions = [];
            result.bindingsStream.on('data', function (data) {
                let tmp = {
                  "url": data.get('?besluit').value,
                  "title": data.get('?title').value,
                "nbPro": data.get('?nbPro').value,
                "nbAnti": data.get('?nbAnti').value,
                "nbNoVote": data.get('?nbNoVote').value
              }
              // Each variable binding is an RDFJS term
              decisions.push(tmp)
            });
            result.bindingsStream.on('end', function() {
                resolve(decisions);
            })
          }).catch((e) => {
          console.log(e);
          reject(e);
          });
            });
        } */

}
