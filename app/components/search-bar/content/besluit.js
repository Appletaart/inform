import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
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

export default class SearchBarContentBesluitComponent extends Component {
    @tracked selected;
    @tracked eenheids;
    @service searchBar;
  
    get get_Search(){
      if(!this.searchBar.gemeente_search){
      }else{
        this.selected = this.searchBar.gemeente_search;
        this.eenheids = null;

        return this.selected
      }
    }
  
    get besluit(){
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
  GROUP BY ?geplandeStart ?bestuursfunctie ?bestuursclassificatie
  ORDER BY DESC(?geplandeStart) ASC(?bestuursfunctie)`;
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
      
  SELECT DISTINCT ?geplandeStart ?location (GROUP_CONCAT(DISTINCT ?voorstanders; separator = ", ") AS ?voorstandersInfo) (GROUP_CONCAT(DISTINCT ?tegenstanders; separator = ", ") AS ?tegenstandersInfo) (GROUP_CONCAT(DISTINCT ?onthouders; separator = ", ") AS ?onthoudersInfo) ?nbPro ?nbAnti ?nbNoVote ?title ?description ?motivering ?bestuursclassificatie WHERE {
  ?zitting a besluit:Zitting ;
             besluit:geplandeStart ?geplandeStart;
             besluit:behandelt ?agendapunt .
  ?agendapunt a besluit:Agendapunt .
  OPTIONAL { ?zitting prov:atLocation ?location }
    
?behandelingAgendapunt a besluit:BehandelingVanAgendapunt;
            terms:subject ?agendapunt;
            prov:generated ?decision.
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
    datastotal.push({
    bestuursclassificatie: l.bestuursclassificatie.value,
    geplandeStart: l.geplandeStart.value,
    location: l.location,
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
    const groupStemming = [];
    const nameschepen = d3.group(datastotal, d => d.geplandeStart)
    for (const [key, value] of nameschepen) {
    const classificatie = d3.group(value, d => d.bestuursclassificatie)
    const classy = []
    for (const [key, value] of classificatie) { 
    classy.push({ bestuursclassificatie: key, details: value }) 
    }

    // console.log(nameschepen);
    // console.log(classificatie);
    groupStemming.push({ 
    geplandeStart: key, 
    location: value[0].location,
    aanwezigBijstart: value[0].dataBijstart, // for only datas total
    details_classificatie: classy
    })}

    this.eenheids = {groupStemming}
    //  console.log(this.eenheids);
    return this.eenheids
    });//end then
    }
}
