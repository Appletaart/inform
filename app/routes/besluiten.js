import Route from '@ember/routing/route';
class SPARQLQueryDispatcher {
  constructor( endpoint ) {
      this.endpoint = endpoint;
  }

  async query( sparqlQuery ) {
      const fullUrl = this.endpoint + '?query=' + encodeURIComponent( sparqlQuery );
      const headers = { 'Accept': 'application/sparql-results+json,*/*;q=0.9' };

      const body = await fetch(fullUrl, { headers });
    return await body.json();
  }
}
export default class BesluitenRoute extends Route {

  async model(){
    /* let response = await fetch('/api/besluiten_naam_aanwezige.json');
    let data = await response.json(); 
    const datas = [];
    data.results.bindings.forEach(e => {
        datas.push({
          bestuurseenheidnaam: e.bestuurseenheidnaam.value,
          geplandeStart: e.geplandeStart.value,
          location: e.location,
          agendapunt_aanwezige: e.agendapunt_aanwezige,
          }) 
    }) */
    const endpointUrl = 'https://openbelgium-2021.lblod.info/sparql';
    const endpointUrl1 = 'https://qa.centrale-vindplaats.lblod.info/sparql';
    const sparqlQuery1 = `
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
    PREFIX foaf: <http://xmlns.com/foaf/0.1/> 
    PREFIX terms: <http://purl.org/dc/terms/> 
    PREFIX isBestuurlijkeAliasVan: <http://data.vlaanderen.be/ns/mandaat#isBestuurlijkeAliasVan>
    PREFIX gebruikteVoornaam: <https://data.vlaanderen.be/ns/persoon#gebruikteVoornaam>
    PREFIX familyName: <http://xmlns.com/foaf/0.1/familyName>
    PREFIX classificatie: <http://data.vlaanderen.be/ns/besluit#classificatie>
    PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>

    SELECT DISTINCT (CONCAT(?firstName, " ", ?familyName) as ?agendapunt_aanwezige)?geplandeStart ?bestuurseenheidnaam WHERE {
    ?zitting a besluit:Zitting ;
          besluit:geplandeStart ?geplandeStart;
          besluit:behandelt ?agendapunt .
          ?agendapunt a besluit:Agendapunt .
          
    OPTIONAL { 	?zitting prov:atLocation ?location}   
              ?zitting besluit:isGehoudenDoor ?bo .
          ?bo besluit:bestuurt ?s .
          ?s a besluit:Bestuurseenheid .
          ?s <http://www.w3.org/2004/02/skos/core#prefLabel> ?bestuurseenheidnaam .

    ?behandelingAgendapunt a besluit:BehandelingVanAgendapunt; 
        terms:subject ?agendapunt;
        besluit:heeftAanwezige ?aanwezige . 

          ?aanwezige mandaat:isBestuurlijkeAliasVan ?person .
          ?person a <http://www.w3.org/ns/person#Person> .
          ?person persoon:gebruikteVoornaam ?firstName;
              foaf:familyName ?familyName .

    ?aanwezige <http://www.w3.org/ns/org#holds> ?bestuursfunctie .
    ?bestuursfunctie <http://www.w3.org/ns/org#role> ?rol .
    ?rol <http://www.w3.org/2004/02/skos/core#prefLabel> ?functie .

    FILTER (?geplandeStart > "2021-02-01"^^xsd:date)
    }
    ORDER BY ASC(?geplandeStart)
`;
  const results1 = []
  const queryDispatcher1 = new SPARQLQueryDispatcher( endpointUrl, endpointUrl1 );
  const getDataAw = await queryDispatcher1.query( sparqlQuery1 ).then(results1)
  const datas = []
    getDataAw.results.bindings.forEach(e => {
    datas.push({
      bestuurseenheidnaam: e.bestuurseenheidnaam.value,
      geplandeStart: e.geplandeStart.value,
      location: e.location,
      agendapunt_aanwezige: e.agendapunt_aanwezige,
    })
    })

    /* let responses = await fetch('/api/besluiten.json');
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
    }) */


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

  SELECT DISTINCT ?geplandeStart ?location ?nbPro ?nbAnti ?nbNoVote ?title ?description ?motivering ?bestuursclassificatie ?bestuurseenheidnaam WHERE {
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
          ?s besluit:werkingsgebied [rdfs:label ?bestuurseenheidnaam]
    
  OPTIONAL {  ?behandelingAgendapunt a besluit:BehandelingVanAgendapunt; 
          terms:subject ?agendapunt;
          besluit:heeftAanwezige ?aanwezige . 
          ?aanwezige mandaat:isBestuurlijkeAliasVan ?person .
          ?person a <http://www.w3.org/ns/person#Person> .
          ?person persoon:gebruikteVoornaam ?firstName;
              foaf:familyName ?familyName .
    }
    
  FILTER (?geplandeStart > "2021-02-01"^^xsd:date)
  }
  ORDER BY DESC(?geplandeStart) ASC(?title)`;
  const results = []
  const queryDispatcher = new SPARQLQueryDispatcher( endpointUrl, endpointUrl1 );
  const getData = await queryDispatcher.query( sparqlQuery ).then(results)
  const datas_qa = []
    getData.results.bindings.forEach(e => {
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
  return {datas, datas_qa}
}
}
