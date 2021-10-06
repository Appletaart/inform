import Route from '@ember/routing/route';
/* class SPARQLQueryDispatcher {
  constructor( endpoint ) {
      this.endpoint = endpoint;
  }

  async query( sparqlQuery ) {
      const fullUrl = this.endpoint + '?query=' + encodeURIComponent( sparqlQuery );
      const headers = { 'Accept': 'application/sparql-results+json' };

      const body = await fetch(fullUrl, { headers });
    return await body.json();
  }
} */
export default class BesluitenRoute extends Route {

   /* async model(){
   let responses = await fetch('/api/besluiten.json');
      let data_qa = await responses.json();
      const datas_qa = [];
      data_qa.results.bindings.forEach(e => {
      datas_qa.push({
      bestuurseenheidnaam: e.bestuurseenheidnaam.value,
      bestuursclassificatie: e.bestuursclassificatie.value,
      geplandeStart: e.geplandeStart.value,
      location: e.location,
      title: e.title,
      description: e.description,
      motivering: e.motivering,
      nbPro: e.nbPro,
      nbAnti: e.nbAnti,
      nbNoVote: e.nbNoVote
  })
    }) 

      const endpointUrl = 'https://openbelgium-2021.lblod.info/sparql';
      const endpointUrl1 = 'https://qa.centrale-vindplaats.lblod.info/sparql';
    
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
          
      SELECT DISTINCT ?geplandeStart ?location (GROUP_CONCAT(DISTINCT ?aanwezigen; separator = " , ") AS ?aanwezigenInfo) (COUNT(distinct ?aanwezigen) as ?count) ?nbPro ?nbAnti ?nbNoVote ?title ?description ?motivering ?bestuursclassificatie ?bestuurseenheidnaam WHERE {
        
        ?zitting a besluit:Zitting ;
        besluit:geplandeStart ?geplandeStart;
        besluit:behandelt ?agendapunt .
        ?agendapunt a besluit:Agendapunt .
        OPTIONAL { ?zitting <http://www.w3.org/ns/prov#atLocation> ?location}
           
        ?behandelingAgendapunt a besluit:BehandelingVanAgendapunt;
          				terms:subject ?agendapunt;
						prov:generated ?decision.
         ?behandelingAgendapunt prov:generated ?decision.
  		   ?decision ontology:title ?titles.
         BIND(str(?titles) AS ?title)
         OPTIONAL { ?decision ontology:description ?descriptions .
           BIND(str(?descriptions) AS ?description)
           }
      OPTIONAL { ?decision besluit:motivering ?motivering. }
                
      OPTIONAL { ?behandelingVanAgendapunt terms:subject ?agendapunt ;
                                  besluit:heeftStemming ?stemming.
        ?stemming besluit:aantalVoorstanders ?nbPro;
                  besluit:aantalTegenstanders ?nbAnti;
                  besluit:aantalOnthouders ?nbNoVote.}
      
        ?zitting besluit:isGehoudenDoor ?bo .  
        ?bo besluit:classificatie ?classificatie.
        ?classificatie skos:prefLabel ?bestuursclassificatie .
      
        ?bo besluit:bestuurt ?s .
        ?s a besluit:Bestuurseenheid .
        ?s besluit:werkingsgebied [rdfs:label ?bestuurseenheidnaam].
      
        OPTIONAL {  ?behandelingAgendapunt a besluit:BehandelingVanAgendapunt; 
                                   terms:subject ?agendapunt;
                                   besluit:heeftAanwezige ?aanwezige . 
          ?aanwezige mandaat:isBestuurlijkeAliasVan ?person .
          ?person a <http://www.w3.org/ns/person#Person> .
          ?person persoon:gebruikteVoornaam ?firstName;
                  foaf:familyName ?familyName .
          ?aanwezige <http://www.w3.org/ns/org#holds> ?functie .
          ?functie <http://www.w3.org/ns/org#role> ?rol .
          ?rol <http://www.w3.org/2004/02/skos/core#prefLabel> ?bestuursfunctie.
          FILTER(?bestuursfunctie = "Gemeenteraadslid" || ?bestuursfunctie = "Lid van de Raad voor Maatschappelijk Welzijn").
        }
      
        BIND(CONCAT(?firstName, " ", ?familyName) as ?aanwezigen) 
        BIND(day(now()) AS ?day)
        BIND(IF(?day < 10, "-0", "-") AS ?day2)
        BIND(month(now()) - 3 AS ?month)
        BIND(IF(?month < 10, "-0", "-") AS ?month2) 
        BIND(year(now()) AS ?year)
        BIND(CONCAT(?year, ?month2, ?month, ?day2, ?day) as ?dayTofilter)
        BIND(xsd:date(now()) AS ?time)
        BIND(STRDT(?dayTofilter, xsd:date) AS ?filterDate)
        FILTER (?geplandeStart > ?filterDate)
      
      }
      ORDER BY DESC(?geplandeStart) ASC(?title)`;
      // FILTER (?geplandeStart > "2021-01-01"^^xsd:date)
    const results = []
    const queryDispatcher = new SPARQLQueryDispatcher( endpointUrl1 );
    const getData = await queryDispatcher.query( sparqlQuery ).then(results)
    const datas = []
    getData.results.bindings.forEach(e => {
    datas.push({
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
    nbNoVote: e.nbNoVote
    })
    })
  return datas
}*/
}
