import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
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
export default class SwitchBarArchiefComponent extends Component {
  @service map;
  @tracked selected;
  @tracked eenheids;

  get getGemeente() {
      if (!this.map['gemeente'].name) {
      } else {
        this.selected = this.map['gemeente'].name;
        this.eenheids = null;
        // console.log(this.selected);
        return this.selected
      }
    }

  @action toggleClose() {
    // console.log("test clear", this.map.gemeente.name);
    d3.select(".archief").transition().style("visibility", "hidden")
    if(this.checked){
      return this.identifier = "bar-right", this.checked = false;
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

get archief(){
const endpointUrl = 'https://qa.centrale-vindplaats.lblod.info/sparql';
const aanwezigbijStart = `
PREFIX besluit: <http://data.vlaanderen.be/ns/besluit#>
PREFIX mandaat: <http://data.vlaanderen.be/ns/mandaat#>
PREFIX persoon: <http://data.vlaanderen.be/ns/persoon#>
PREFIX foaf: <http://xmlns.com/foaf/0.1/> 
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>

SELECT DISTINCT ?geplandeStart (GROUP_CONCAT(DISTINCT ?aanwezigen; separator = ", ") AS ?aanwezigenBijStart) (COUNT(distinct ?aanwezigen) as ?countBijStart) ?bestuursfunctie ?bestuursclassificatie WHERE {
?zitting a besluit:Zitting;
besluit:geplandeStart ?geplandeStart;
besluit:behandelt ?agendapunt .

?zitting besluit:heeftAanwezigeBijStart ?aanwezigenStart. 
?aanwezigenStart mandaat:isBestuurlijkeAliasVan ?person .
?person a <http://www.w3.org/ns/person#Person> .
?person persoon:gebruikteVoornaam ?firstName;
        foaf:familyName ?familyName .
?aanwezigenStart <http://www.w3.org/ns/org#holds> ?functie .
      ?functie <http://www.w3.org/ns/org#role> ?rol .
      ?rol <http://www.w3.org/2004/02/skos/core#prefLabel> ?bestuursfuncties.
      BIND(str(?bestuursfuncties) AS ?bestuursfunctie)

BIND(CONCAT(?firstName, " ", ?familyName) as ?aanwezigen) 
{ 
  ?zitting besluit:isGehoudenDoor ?bo .  
  ?bo besluit:classificatie ?classificatie.
  ?classificatie skos:prefLabel ?bestuursclassificatie .
  ?bo besluit:bestuurt ?s .
  ?s a besluit:Bestuurseenheid .
  ?s besluit:werkingsgebied [rdfs:label "${this.selected}"].
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
          ?s besluit:werkingsgebied [rdfs:label "${this.selected}"].
  }

  FILTER(?bestuursclassificatie = "Gemeenteraad" || ?bestuursclassificatie = "Raad voor Maatschappelijk Welzijn")
} 
GROUP BY ?geplandeStart ?bestuursfunctie ?bestuursclassificatie
ORDER BY DESC(?geplandeStart) ASC(?bestuursfunctie)`;
const sparqlQuery = `
PREFIX dct: <http://purl.org/dc/terms/>
PREFIX dc: <http://purl.org/dc/elements/1.1/>
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
    
SELECT DISTINCT ?geplandeStart ?location (GROUP_CONCAT(DISTINCT ?voorstanders; separator = ", ") AS ?voorstandersInfo) (GROUP_CONCAT(DISTINCT ?tegenstanders; separator = ", ") AS ?tegenstandersInfo) (GROUP_CONCAT(DISTINCT ?onthouders; separator = ", ") AS ?onthoudersInfo) ?nbPro ?nbAnti ?nbNoVote ?title ?description ?motivering ?bestuursclassificatie WHERE {
    
?zitting a besluit:Zitting ;
besluit:geplandeStart ?geplandeStart;
besluit:behandelt ?agendapunt .
?agendapunt a besluit:Agendapunt .
OPTIONAL { ?zitting prov:atLocation ?location }
  
?behandelingAgendapunt a besluit:BehandelingVanAgendapunt;
          terms:subject ?agendapunt;
          prov:generated ?decision.
?behandelingAgendapunt prov:generated ?decision.
?behandelingAgendapunt besluit:openbaar ?openbaar .
FILTER(?openbaar)
        ?decision ontology:title ?titles.

BIND(str(?titles) AS ?title)
OPTIONAL { ?decision ontology:description ?descriptions .
BIND(str(?descriptions) AS ?description)
}
OPTIONAL { ?decision besluit:motivering ?motivering. }   
OPTIONAL { ?behandelingVanAgendapunt terms:subject ?agendapunt ;

besluit:heeftStemming ?stemming.
?stemming besluit:aantalVoorstanders ?nbPro;
besluit:heeftVoorstander ?voorstander;
besluit:aantalTegenstanders ?nbAnti;
besluit:heeftTegenstander ?tegenstander;
besluit:aantalOnthouders ?nbNoVote;
besluit:heeftOnthouder ?onthouder.


?voorstander mandaat:isBestuurlijkeAliasVan ?voorstander_persoon.
?voorstander_persoon persoon:gebruikteVoornaam ?voorstander_voornaam .
?voorstander_persoon foaf:familyName ?voorstander_achternaam .
?tegenstander mandaat:isBestuurlijkeAliasVan ?tegenstander_persoon.
?tegenstander_persoon persoon:gebruikteVoornaam ?tegenstander_voornaam .
?tegenstander_persoon foaf:familyName ?tegenstander_achternaam .
?onthouder mandaat:isBestuurlijkeAliasVan ?onthouder_persoon.
?onthouder_persoon persoon:gebruikteVoornaam ?onthouder_voornaam .
?onthouder_persoon foaf:familyName ?onthouder_achternaam .

?voorstander <http://www.w3.org/ns/org#hasMembership> ?lid_voorstander .
?lid_voorstander <http://www.w3.org/ns/org#organisation> ?o_voorstander.
?o_voorstander a mandaat:Fractie .
?o_voorstander <https://www.w3.org/ns/regorg#legalName> ?fractie_voorstander.
?tegenstander <http://www.w3.org/ns/org#hasMembership> ?lid_tegenstander .
?lid_tegenstander <http://www.w3.org/ns/org#organisation> ?o_tegenstander.
?o_tegenstander a mandaat:Fractie .
?o_tegenstander <https://www.w3.org/ns/regorg#legalName> ?fractie_tegenstander.
?onthouder <http://www.w3.org/ns/org#hasMembership> ?lid_onthouder .
?lid_onthouder <http://www.w3.org/ns/org#organisation> ?o_onthouder.
?o_onthouder a mandaat:Fractie.
?o_onthouder <https://www.w3.org/ns/regorg#legalName> ?fractie_onthouder. 

BIND(CONCAT(?voorstander_voornaam, " ", ?voorstander_achternaam, " ( " ,?fractie_voorstander, " )" ) AS ?voorstanders)
BIND(CONCAT(?tegenstander_voornaam, " ", ?tegenstander_achternaam, " ( " ,?fractie_tegenstander, " )" ) AS ?tegenstanders)
BIND(CONCAT(?onthouder_voornaam, " ", ?onthouder_achternaam, " ( " ,?fractie_onthouder, " )" ) AS ?onthouders)
}
{ 
?zitting besluit:isGehoudenDoor ?bo .  
?bo besluit:classificatie ?classificatie.
?classificatie skos:prefLabel ?bestuursclassificatie .
?bo besluit:bestuurt ?s .
?s a besluit:Bestuurseenheid .
?s besluit:werkingsgebied [rdfs:label "${this.selected}"].
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
?s besluit:werkingsgebied [rdfs:label "${this.selected}"].
}
FILTER(?bestuursclassificatie = "Gemeenteraad" || ?bestuursclassificatie = "Raad voor Maatschappelijk Welzijn")
}
ORDER BY DESC(?geplandeStart) xsd:integer(?title) ASC(?title)`;

const queryDispatcher = new SPARQLQueryDispatcher( endpointUrl );
// get aanwezigbijstart
const result = [];
const getAanwezig = queryDispatcher.query( aanwezigbijStart ).then(result); 
// get data besluiten
const results = [];
const getData = queryDispatcher.query( sparqlQuery ).then(results)
// get 2 data query in one

// console.log(getData);
  getData.then( results => {
  const datastotal = []
  results.results.bindings.forEach(l => {
  const dataBijstart = []
  getAanwezig.then( results => {
  results.results.bindings.forEach(e => {    
  if(l.geplandeStart.value == e.geplandeStart.value){
  dataBijstart.push({
  aanwezigenBijStart: e.aanwezigenBijStart.value,
  countBijStart: e.countBijStart.value,
  bestuursclassificatieBijStart: e.bestuursclassificatie.value,
  bestuursfunctieBijStart: e.bestuursfunctie.value,
  })
  }
  })
  })
  const title = l.title.value.trim()
  const start_date = new Date(l.geplandeStart.value)
  const geplande_Month = start_date.getMonth();
  const geplande_Year = start_date.getFullYear();
  datastotal.push({
  bestuursclassificatie: l.bestuursclassificatie.value,
  geplandeStart: l.geplandeStart.value,
  geplande_Month: this.month[geplande_Month],
  geplande_Year: geplande_Year,
  location: l.location,
  // stemmerInfo: l.stemmerInfo.value,
  // count: l.count.value,
  title: title,
  description: l.description,
  motivering: l.motivering,
  nbPro: l.nbPro,
  nbAnti: l.nbAnti,
  nbNoVote: l.nbNoVote,
  voorstanders: l.voorstandersInfo,
  tegenstanders: l.tegenstandersInfo,
  onthouders: l.onthoudersInfo,
  dataBijstart
  })// end push datastotal
  })// end first binding
 
  // start group
  const stemming_years = [];
  const stemming_months = [];
  const groupStemming = [];
  //this for years
  const stemming_aanwezige_year = d3.group(datastotal, d => d.geplande_Year)
  const stemming_aanwezige_month = d3.group(datastotal, d => d.geplande_Month)
  for (const [key, value] of stemming_aanwezige_year) {
  stemming_years.push({ 
  geplande_Year: key, 
 // geplande_Month: value[0].geplande_Month 
  })}
  //this for months
  for (const [key, value] of stemming_aanwezige_month) {
  stemming_months.push({ 
  geplande_Month: key, 
  geplande_Year: value[0].geplande_Year
  })}
  const nameschepen = d3.group(datastotal, d => d.geplandeStart)
  for (const [key, value] of nameschepen) {
  const classificatie = d3.group(value, d => d.bestuursclassificatie)
  const classy = []
  for (const [key, value] of classificatie) { 
    classy.push({ bestuursclassificatie: key, details: value }) 
  }

  groupStemming.push({ 
  geplandeStart: key, 
  geplande_Year: value[0].geplande_Year,
  geplande_Month: value[0].geplande_Month, 
  location: value[0].location,
  aanwezigBijstart: value[0].dataBijstart, // for only datas total
  details_classificatie: classy
  })}

  this.eenheids = {stemming_years, stemming_months, groupStemming}
  // console.log(this.eenheids);
  return this.eenheids
});//end then
}

get month(){
  const month = new Array();
        month[0] = "Jan";
        month[1] = "Feb";
        month[2] = "Mar";
        month[3] = "Apr";
        month[4] = "Mei";
        month[5] = "Jun";
        month[6] = "Jul";
        month[7] = "Aug";
        month[8] = "Sep";
        month[9] = "Okt";
        month[10] = "Nov";
        month[11] = "Dec";
        return month
}
}
