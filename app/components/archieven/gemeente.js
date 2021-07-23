import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
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

export default class ArchievenGemeenteComponent extends Component {
    
    constructor(){
        super(...arguments);
        // met end-point
      const endpointUrl = 'https://qa.centrale-vindplaats.lblod.info/sparql';
      const sparqlQuery = `
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
      PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

      SELECT DISTINCT ?geplandeStart ?location (GROUP_CONCAT(DISTINCT ?aanwezigen; separator = " , ") AS ?aanwezigenInfo) (COUNT(distinct ?aanwezigen) as ?count) ?nbPro ?nbAnti ?nbNoVote ?title ?description ?motivering ?bestuursclassificatie ?bestuurseenheidnaam WHERE {
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
      ontology:description ?description .
      OPTIONAL {?decision besluit:motivering ?motivering .}


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
        ?bo besluit:classificatie ?classificatie.
        ?classificatie skos:prefLabel ?bestuursclassificatie .
        
        ?bo besluit:bestuurt ?s .
        ?s a besluit:Bestuurseenheid .
        ?s besluit:werkingsgebied [rdfs:label ?bestuurseenheidnaam] .

      OPTIONAL {  ?behandelingAgendapunt a besluit:BehandelingVanAgendapunt; 
      terms:subject ?agendapunt;
      besluit:heeftAanwezige ?aanwezige . 
        ?aanwezige mandaat:isBestuurlijkeAliasVan ?person .
        ?person a <http://www.w3.org/ns/person#Person> .
        ?person persoon:gebruikteVoornaam ?firstName;
              foaf:familyName ?familyName .
      }
      BIND(CONCAT(?firstName, " ", ?familyName) as ?aanwezigen) 

      FILTER (?geplandeStart > "2021-02-01"^^xsd:date)
      }
      GROUP BY ?geplandeStart ?location ?nbPro ?nbAnti ?nbNoVote ?title ?description ?motivering ?bestuursclassificatie ?bestuurseenheidnaam
      ORDER BY DESC(?geplandeStart) ASC(?title)`;
      const results = []
      const queryDispatcher = new SPARQLQueryDispatcher( endpointUrl);
      const getData = queryDispatcher.query( sparqlQuery ).then(results)
      getData.then( results => { const realdata = [];
      results.results.bindings.forEach(e => {
      realdata.push({
      bestuurseenheidnaam: e.bestuurseenheidnaam.value,
      bestuursclassificatie: e.bestuursclassificatie.value,
      geplandeStart: e.geplandeStart.value,
      location: e.location,
      aanwezigenInfo: e.aanwezigenInfo.value,
      count: e.count.value,
      title: e.title,
      description: e.description,
      motivering: e.motivering,
      nbPro: e.nbPro,
      nbAnti: e.nbAnti,
      nbNoVote: e.nbNoVote,
      details: e
      })
      })
      this.datas_bestemmen = realdata
      });
    } // constructor
    @tracked datas_bestemmen;


    @tracked opened = false;
    @tracked visible = "hidden";
    @tracked open = false;
    @tracked visibly = "hidden";
    @tracked active;
    @tracked month = [];
    @tracked year = [];
    @tracked bestuurseenheidnaam = this.args.bestuurseenheidnaam;
    @tracked month = this.args.month;

    @action toggleClose() {
        this.visible = "hidden";
        this.visibly = "hidden";
    }

    @action
    onclickBtn(){
      // this.opened = !this.opened;
      const btn = document.getElementById("topBtn");
      // When the user scrolls down 20px from the top of the document, show the button
      window.onscroll = function() {scrollFunction()};

      function scrollFunction() {
        if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
          mybutton.style.display = "block";
        } else {
          mybutton.style.display = "none";
        }
      }

      // When the user clicks on the button, scroll to the top of the document
      function topFunction() {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
      }
    }

    
  @action
  isOpen(newYear){
    this.opened = !this.opened;
    if(!this.opened){
      // console.log("hello left", this.visible = "hidden");
      return this.visible = "hidden";
    }else{
      this.year = newYear;
      console.log(this.year.target.innerText);
      // console.log("hello right", this.visible = "visible" );
      return this.visible = "visible";
    }
  }


}
