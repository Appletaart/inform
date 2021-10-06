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

export default class ArchiefRoute extends Route {
/*   queryParams = {
    gemeente: {refreshModel: true}
  };
    async model(params){
        const { gemeente } = params;
        const endpointUrl1 = 'https://qa.centrale-vindplaats.lblod.info/sparql';
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
                         ?decision ontology:title ?titles.
              BIND(str(?titles) AS ?title)
              OPTIONAL { ?decision ontology:description ?descriptions .
                BIND(str(?descriptions) AS ?description)
                }
              OPTIONAL { ?decision prov:value ?value;
                                   besluit:motivering ?motivering. }
        
          OPTIONAL {?behandelingVanAgendapunt dcterms:subject ?agendapunt ;
                                  besluit:heeftStemming ?stemming.
          ?stemming besluit:aantalVoorstanders ?nbPro;
                    besluit:aantalTegenstanders ?nbAnti;
                    besluit:aantalOnthouders ?nbNoVote.}
          
          ?zitting besluit:isGehoudenDoor ?bo .  
          OPTIONAL {  ?bo a <http://www.w3.org/ns/org#classification> .
                      ?bo <http://www.w3.org/2004/02/skos/core#prefLabel> ?bestuursorgaan .}
          ?bo besluit:classificatie ?classificatie.
          ?classificatie skos:prefLabel ?bestuursclassificatie .
        
          ?bo besluit:bestuurt ?s .
          ?s a besluit:Bestuurseenheid .
          ?s besluit:werkingsgebied [rdfs:label "`+gemeente+`"].
        
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
        }
        
        ORDER BY DESC(?geplandeStart) ASC(?title)`;
          // FILTER (?geplandeStart > "2021-01-01"^^xsd:date)
        const results = []
        const queryDispatcher = new SPARQLQueryDispatcher( endpointUrl1 );
        const getData = await queryDispatcher.query( sparqlQuery ).then(results)
        const datas = []
        getData.results.bindings.forEach(e => {
        datas.push({
        // bestuurseenheidnaam: e.bestuurseenheidnaam.value,
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

        const stemming_years = [];
        const stemming_months = [];
        const groupStemming = [];
        const stemming_aanwezige = [];

        datas.forEach(bestuurseenheids => {
        let start_date = new Date(bestuurseenheids.geplandeStart)
        let geplande_Date = start_date.toDateString()
        let geplande_Time = start_date.toLocaleTimeString()
        let geplande_Month = start_date.getMonth();
        let geplande_Year = start_date.getFullYear();
          stemming_aanwezige.push({
          geplandeStart: bestuurseenheids.geplandeStart,
          geplande_Date: geplande_Date,
          geplande_Time: geplande_Time,
          geplande_Month: this.month[geplande_Month],
          geplande_Year: geplande_Year,
          location: bestuurseenheids.location,
          aanwezigenInfo: bestuurseenheids.aanwezigenInfo,
          count: bestuurseenheids.count,
          bestuursclassificatie: bestuurseenheids.bestuursclassificatie,
          title: bestuurseenheids.title,
          description: bestuurseenheids.description,
          motivering: bestuurseenheids.motivering,
          nbPro: bestuurseenheids.nbPro,
          nbAnti: bestuurseenheids.nbAnti,
          nbNoVote: bestuurseenheids.nbNoVote
        })
          return stemming_aanwezige
      })
        
      //dit for years
      let stemming_aanwezige_year = d3.group(stemming_aanwezige, d => d.geplande_Year)
      let stemming_aanwezige_month = d3.group(stemming_aanwezige, d => d.geplande_Month)
      for (const [key, value] of stemming_aanwezige_year) {
        stemming_years.push({ 
          geplande_Year: key, 
          geplande_Month: value[0].geplande_Month
          })
      }
      for (const [key, value] of stemming_aanwezige_month) {
        stemming_months.push({ 
          geplande_Month: key, 
          geplande_Year: value[0].geplande_Year
          })}
      let nameschepen = d3.group(stemming_aanwezige, d => d.geplandeStart)
      for (const [key, value] of nameschepen) {
          groupStemming.push({ 
          geplandeStart: key, 
          geplande_Date: value[0].geplande_Date, 
          geplande_Time: value[0].geplande_Time,
          geplande_Year: value[0].geplande_Year,
          geplande_Month: value[0].geplande_Month, 
          location: value[0].location,
          aanwezigenInfo: value[0].aanwezigenInfo,
          count: value[0].count,
          bestuursclassificatie: value[0].bestuursclassificatie,
          details: value
      })
      }
      return {stemming_years, stemming_months, groupStemming}
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
     */
}
