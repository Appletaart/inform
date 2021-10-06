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
export default class BesturenRoute extends Route {
    
  /*   async model(){
        const endpointUrl = 'https://centrale-vindplaats.lblod.info/sparql';
        const sparqlQuery = `
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        PREFIX mandaat: <http://data.vlaanderen.be/ns/mandaat#>
        PREFIX mandataris: <http://data.vlaanderen.be/ns/mandaat#Mandataris>
        PREFIX besluit: <http://data.vlaanderen.be/ns/besluit#>
        PREFIX bevat: <http://www.w3.org/ns/org#hasPost>
        PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
        PREFIX bestuurseenheid: <https://data.vlaanderen.be/ns/besluit#Bestuurseenheid>
        PREFIX bestuursorgaan: <http://data.vlaanderen.be/ns/besluit#Bestuursorgaan>
        PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
        
        SELECT DISTINCT ?start ?eind ?achternaam ?voornaam ?fractie ?bestuursfunctie ?bestuursclassificatie ?bestuurseenheidnaam WHERE {
            ?mandataris a mandaat:Mandataris .
            ?mandataris mandaat:start ?start.
            OPTIONAL {?mandataris mandaat:einde ?eind.}
            OPTIONAL {?mandataris <http://data.vlaanderen.be/ns/mandaat#rangorde> ?rangorde.}
            OPTIONAL {?mandataris <http://data.vlaanderen.be/ns/mandaat#beleidsdomein> ?beleid.
                        ?beleid skos:prefLabel ?beleidsdomein.}
            
            ?mandataris <http://data.vlaanderen.be/ns/mandaat#isBestuurlijkeAliasVan> ?person .
            ?person a <http://www.w3.org/ns/person#Person> .
            ?person <http://xmlns.com/foaf/0.1/familyName> ?achternaam .
            ?person <http://data.vlaanderen.be/ns/persoon#gebruikteVoornaam> ?voornaam.
            
            ?mandataris <http://www.w3.org/ns/org#holds> ?functie .
            ?functie <http://www.w3.org/ns/org#role> ?rol .
            ?rol <http://www.w3.org/2004/02/skos/core#prefLabel> ?bestuursfunctie .
            
            OPTIONAL {?mandataris <http://www.w3.org/ns/org#hasMembership> ?lid .
                ?lid <http://www.w3.org/ns/org#organisation> ?o.
                ?o a <http://data.vlaanderen.be/ns/mandaat#Fractie>.
                    ?o <https://www.w3.org/ns/regorg#legalName> ?fractie.}
            
            ?mandataris <http://www.w3.org/ns/org#holds> ?manda .
            ?manda a <http://data.vlaanderen.be/ns/mandaat#Mandaat> .
            ?specializationInTime <http://www.w3.org/ns/org#hasPost> ?manda.
            ?manda <http://www.w3.org/ns/org#role> ?bo .
            ?bo <http://www.w3.org/2004/02/skos/core#prefLabel> ?bestuursorgaanTijd .
            ?specializationInTime <http://data.vlaanderen.be/ns/mandaat#isTijdspecialisatieVan> ?boo  .
            ?boo <http://www.w3.org/2004/02/skos/core#prefLabel> ?bestuursorgaan .
            ?boo besluit:classificatie ?classificatie.
            ?classificatie skos:prefLabel ?bestuursclassificatie .
            ?boo besluit:bestuurt ?s .
            ?s a besluit:Bestuurseenheid .
            ?s besluit:werkingsgebied [rdfs:label ?bestuurseenheidnaam]
                
            FILTER (?eind >= xsd:date(NOW()) || NOT EXISTS {?mandataris mandaat:einde ?eind.} )
        }
        
        ORDER BY ASC(?bestuurseenheidnaam) ASC(?fractie) ASC(?voornaam)     
        `;
        const results = []
        const queryDispatcher = new SPARQLQueryDispatcher( endpointUrl );
        const data = await queryDispatcher.query( sparqlQuery ).then(results);
        const realdata = [];
        data.results.bindings.forEach(e => {
          realdata.push({
                start: e.start.value,
                eind: e.eind, 
                achternaam: e.achternaam.value, 
                voornaam: e.voornaam.value, 
                bestuursfunctie: e.bestuursfunctie.value, 
                fractie: e.fractie, 
                bestuurseenheidnaam: e.bestuurseenheidnaam.value
            })
        }) 
    
        return realdata;
        } */
}
