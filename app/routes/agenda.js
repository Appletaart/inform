import Route from '@ember/routing/route';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class AgendaRoute extends Route {
    @service map;
    @tracked gemeenteAgenda;

    get getGemeenteAgenda() {
      if (!this.map['gemeente'].name) {
        this.gemeenteAgenda = 'Roeselare'
          // console.log(this.map['gemeente'].name);
        return this.gemeenteAgenda
      } else {
        this.gemeenteAgenda = this.map['gemeente'].name;
        return this.gemeenteAgenda
      }
    }
    

    async model(){
                let response = await fetch('/api/agenda.json');
                let data = await response.json(); 
                let responses = await fetch('/api/agenda_april.json');
                let data_qa = await responses.json(); 
                const datas = [];
                data.results.bindings.forEach(e => {
                    datas.push({
                    bestuurseenheidnaam: e.bestuurseenheidnaam.value,
                    bestuursorgaan: e.bestuursorgaan.value,
                    geplandeStart: e.geplandeStart.value,
                    location: e.location.value,
                    title_agenda: e.title_agenda.value,
                    // make condition first cause some arg doesn't have value then got error
                    title_before_agendapunt: e.title_before_agendapunt,
                    description: e.description
                })
                })
                const datas_qa = [];
                data_qa.results.bindings.forEach(e => {
                  datas_qa.push({
                  bestuurseenheidnaam: e.bestuurseenheidnaam.value/* .replace('Gemeente','').trim() */,
                  bestuursorgaan: e.bestuursorgaan.value,
                  geplandeStart: e.geplandeStart.value,
                  // make condition first cause some arg doesn't have value then got error
                  location: e.location,
                  title_agenda: e.title_agenda.value,
                  title_before_agendapunt: e.title_before_agendapunt,
                  description: e.description
              })
              })
             
                return {datas, datas_qa}

                
            /* return  new Promise((resolve, reject) => {
                Comunica.newEngine().query(`
                PREFIX besluit: <http://data.vlaanderen.be/ns/besluit#> 
                PREFIX terms: <http://purl.org/dc/terms/> 
                PREFIX prov: <http://www.w3.org/ns/prov#> 
                PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
                
                SELECT ?geplandeStart ?location ?title_before_agendapunt ?title_agenda ?description ?bestuurseenheidnaam
                
                WHERE { 
                ?zitting a besluit:Zitting; 
                besluit:geplandeStart ?geplandeStart; 
                prov:endedAtTime ?endedAtTime; 
                besluit:behandelt ?agendapunt. 
                 
                
                OPTIONAL { ?agendapunt besluit:aangebrachtNa ?before_agendapunt .
                           ?before_agendapunt terms:title ?title_before_agendapunt . } 
                OPTIONAL { ?zitting <http://www.w3.org/ns/prov#atLocation> ?location}
                OPTIONAL { ?agendapunt terms:title ?title_agenda }
                OPTIONAL {?agendapunt <http://purl.org/dc/terms/description> ?description }
                
                OPTIONAL { ?agendapunt besluit:geplandOpenbaar ?OpenbaarOfNiet }
                
                OPTIONAL {?zitting besluit:isGehoudenDoor ?bo .
                              ?bo besluit:bestuurt ?s .
                              ?s a besluit:Bestuurseenheid .
                            ?s <http://www.w3.org/2004/02/skos/core#prefLabel> ?bestuurseenheidnaam .}
                  
                FILTER (?geplandeStart > "2021-02-01"^^xsd:date)
                
                } 
                
                ORDER BY ?geplandeStart 
            
             `, {
                sources: [
                {
                'type': 'sparql',
                'value': 'https://openbelgium-2021.lblod.info/sparql'
                }],
              }).then(function (result) {
                console.log(result);
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
            */
            
    }
}
