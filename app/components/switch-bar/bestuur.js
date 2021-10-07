import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
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

export default class SwitchBarBestuurComponent extends Component {
    @tracked selected;
    @tracked mandataris;
    @service map;;
    
    @action toggleClose() {
        d3.select(".besturen").transition().style("visibility", "hidden")
        if(this.checked){
            return this.identifier = "bar-right", this.checked = false;
          }
    }

    get getGemeente() {
        if (!this.map['gemeente'].name) {
        } else {
          this.selected = this.map['gemeente'].name;
          this.mandataris = null;

          return this.selected
        }
      }
      @tracked checked = false;
      @tracked identifier = "bar-right";
      @tracked hidevisible = false; 
    
      @action
      onChange() {
        this.checked = !this.checked;
        if(!this.checked){
          console.log("hello left", this.identifier = "bar-right");
          return this.identifier = "bar-right";
        }else{
          console.log("hello right", this.identifier = "bar-left");
          return this.identifier = "bar-left";
        }
      }
      @action
      beleid(){
        this.hidevisible = !this.hidevisible;
      }


    get bestuur()
    /* constructor ()*/{
        // super(...arguments);
        const endpointUrl = 'https://qa.centrale-vindplaats.lblod.info/sparql';
        const sparqlQuery = `
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        PREFIX mandaat: <http://data.vlaanderen.be/ns/mandaat#>
        PREFIX besluit: <http://data.vlaanderen.be/ns/besluit#>
        PREFIX bevat: <http://www.w3.org/ns/org#hasPost>
        PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
        PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
        
        SELECT DISTINCT ?start ?eind ?achternaam ?voornaam ?fractie ?bestuursfunctie ?bestuursclassificatie (GROUP_CONCAT(DISTINCT ?beleidsdomein; separator = " , ") AS ?beleidsdomeins) WHERE {

            ?mandataris a mandaat:Mandataris .
            ?mandataris mandaat:start ?start.
            OPTIONAL {?mandataris mandaat:einde ?eind.}
            OPTIONAL {?mandataris mandaat:rangorde ?rangorde.}
            OPTIONAL {?mandataris mandaat:beleidsdomein ?beleid.
                        ?beleid skos:prefLabel ?beleidsdomein.}
            
            ?mandataris mandaat:isBestuurlijkeAliasVan ?person .
            ?person a <http://www.w3.org/ns/person#Person> .
            ?person <http://xmlns.com/foaf/0.1/familyName> ?achternaam .
            ?person <http://data.vlaanderen.be/ns/persoon#gebruikteVoornaam> ?voornaam.
            
            ?mandataris <http://www.w3.org/ns/org#holds> ?functie .
            ?functie <http://www.w3.org/ns/org#role> ?rol .
            ?rol <http://www.w3.org/2004/02/skos/core#prefLabel> ?bestuursfunctie .
            
            OPTIONAL {?mandataris <http://www.w3.org/ns/org#hasMembership> ?lid .
                ?lid <http://www.w3.org/ns/org#organisation> ?o.
                ?o a mandaat:Fractie .
                    ?o <https://www.w3.org/ns/regorg#legalName> ?fractie.}
            
            ?mandataris <http://www.w3.org/ns/org#holds> ?manda .
            ?manda a mandaat:Mandaat .
            ?specializationInTime <http://www.w3.org/ns/org#hasPost> ?manda.
            ?manda <http://www.w3.org/ns/org#role> ?bo .
            ?bo <http://www.w3.org/2004/02/skos/core#prefLabel> ?bestuursorgaanTijd .
            ?specializationInTime mandaat:isTijdspecialisatieVan ?boo  .
            ?boo <http://www.w3.org/2004/02/skos/core#prefLabel> ?bestuursorgaan .
            ?boo besluit:classificatie ?classificatie.
            ?classificatie skos:prefLabel ?bestuursclassificatie .
            ?boo besluit:bestuurt ?s .
            ?s a besluit:Bestuurseenheid .
            ?s besluit:werkingsgebied [rdfs:label "${this.selected}"]
                
            FILTER (?eind >= xsd:date(NOW()) || NOT EXISTS {?mandataris mandaat:einde ?eind.} )
        }
        
        ORDER BY ASC(?fractie) ASC(?voornaam)     
        `;
        const results = []
        const queryDispatcher = new SPARQLQueryDispatcher( endpointUrl );
        const data = queryDispatcher.query( sparqlQuery ).then(results);
        const realdata = [];  
        data.then( results => {
        results.results.bindings.forEach(e => {
        realdata.push({
            start: e.start.value,
            eind: e.eind, 
            achternaam: e.achternaam.value, 
            voornaam: e.voornaam.value, 
            bestuursfunctie: e.bestuursfunctie.value,
            fractie: e.fractie, 
            beleidsdomeins: e.beleidsdomeins.value,
            // bestuurseenheidnaam: e.bestuurseenheidnaam.value
        })
        })// end first binding
         
        // let bestuurseenheids = d3.group(realdata, d => d.bestuurseenheidnaam);
        // let een_bestuurseenheid = []
        // for (const [key] of bestuurseenheids) { een_bestuurseenheid.push(key) }
        // let bestuurseenheid = bestuurseenheids.get(this.selected);
        let bestuurfunctie = d3.group(realdata, d => d.bestuursfunctie);
        let formatTime = new Date();
        let today = formatTime.getTime()
        let bestuurperiod = new Date("1/1/2019")
        let period_Start = bestuurperiod.getTime()
        //  Burgemeester 
        let eenBurgemeester = [];
        let een_burgemeester = [];
        let burgemeester = bestuurfunctie.get('Burgemeester');
        if (!burgemeester) {
        } else {
        burgemeester.forEach(burgemeesters => {
        let start_date = new Date(burgemeesters.start)
        let bestuur_Start = start_date.getTime()
        let end_date = new Date(burgemeesters.eind)
        let bestuur_End = end_date.getTime()
        if (+period_Start <= +bestuur_Start && !(+bestuur_End <= +today)) {
            eenBurgemeester.push({ voornaam: burgemeesters.voornaam, achternaam: burgemeesters.achternaam, functie: burgemeesters.bestuursfunctie, fractie: burgemeesters.fractie, beleidsdomeins: burgemeesters.beleidsdomeins })
            return eenBurgemeester
        }// end condition 
        })
        let nameschepen = d3.group(eenBurgemeester, d => d.voornaam)
        for (const [key, value] of nameschepen) {
        een_burgemeester.push({ voornaam: key, achternaam: value[0].achternaam, functie: value[0].functie, fractie: value[0].fractie, beleidsdomeins: value[0].beleidsdomeins })
        }
        } // eind if burgemeester
        
        // Voorzitter van de gemeenteraad
        let voorZgr = [];
        let een_voorZgr = [];
        let vgrl = bestuurfunctie.get('Voorzitter van de gemeenteraad');
        if (!vgrl) {
        } else {
        vgrl.forEach(vgr => {
            let start_date = new Date(vgr.start)
            let bestuur_Start = start_date.getTime()
            let end_date = new Date(vgr.eind)
            let bestuur_End = end_date.getTime()
            if (+period_Start <= +bestuur_Start && !(+bestuur_End <= +today)) {
            voorZgr.push({ voornaam: vgr.voornaam, achternaam: vgr.achternaam, functie: vgr.bestuursfunctie, fractie: vgr.fractie, beleidsdomeins: vgr.beleidsdomeins })
            return voorZgr
            }// end condition 
        })
        let nameschepen = d3.group(voorZgr, d => d.voornaam)
        for (const [key, value] of nameschepen) {
            een_voorZgr.push({ voornaam: key, achternaam: value[0].achternaam, functie: value[0].functie, fractie: value[0].fractie, beleidsdomeins: value[0].beleidsdomeins })
        }
        }

        //  Schepenen
        let schepen = bestuurfunctie.get('Schepen');
        let co_schepen = []
        let een_schepenen = []
        if (!schepen) {
        } else {
        schepen.forEach(schepens => {
            let start_date = new Date(schepens.start)
            let bestuur_Start = start_date.getTime()
            let end_date = new Date(schepens.eind)
            let bestuur_End = end_date.getTime()
            if (+period_Start <= +bestuur_Start && !(+bestuur_End <= +today)) {
            co_schepen.push({
                voornaam: schepens.voornaam, achternaam: schepens.achternaam, functie: schepens.bestuursfunctie, fractie: schepens.fractie, beleidsdomeins: schepens.beleidsdomeins

            })
            return co_schepen
            }
        }) // end foreach 
        let nameschepen = d3.group(co_schepen, d => d.voornaam)
        for (const [key, value] of nameschepen) {
            een_schepenen.push({ voornaam: key, achternaam: value[0].achternaam, functie: value[0].functie, fractie: value[0].fractie, beleidsdomeins: value[0].beleidsdomeins })

        }
        }// end else

        // Toegevoegde schepen
        let tvsch = bestuurfunctie.get('Toegevoegde schepen');
        let co_tvschs = [];
        let een_tschepenen = []
        if (!tvsch) {
        } else {
        tvsch.forEach(tvschs => {
            let start_date = new Date(tvschs.start)
            let bestuur_Start = start_date.getTime()
            let end_date = new Date(tvschs.eind)
            let bestuur_End = end_date.getTime()
            if (+period_Start <= +bestuur_Start && !(+bestuur_End <= +today)) {
            co_tvschs.push({
                voornaam: tvschs.voornaam, achternaam: tvschs.achternaam, functie: tvschs.bestuursfunctie, fractie: tvschs.fractie, beleidsdomeins: tvschs.beleidsdomeins
            })
            return co_tvschs
            }// end condition 
        })
        let nameschepen = d3.group(co_tvschs, d => d.voornaam)
        for (const [key, value] of nameschepen) {
            een_tschepenen.push({ voornaam: key, achternaam: value[0].achternaam, functie: value[0].functie, fractie: value[0].fractie, beleidsdomeins: value[0].beleidsdomeins })
        }
        }

        // Gemeenteraadsleden
        let grleden = [];
        let een_gr = [];
        let grl = bestuurfunctie.get('Gemeenteraadslid');
        if (!grl) {
        } else {
        grl.forEach(gr => {
            let start_date = new Date(gr.start)
            let bestuur_Start = start_date.getTime()
            let end_date = new Date(gr.eind)
            let bestuur_End = end_date.getTime()
            if (+period_Start <= +bestuur_Start && !(+bestuur_End <= +today)) {
            grleden.push({
                voornaam: gr.voornaam, achternaam: gr.achternaam, functie: gr.bestuursfunctie, fractie: gr.fractie, beleidsdomeins: gr.beleidsdomeins
            })
            //console.log(grleden);
            return grleden
            }// end condition
        })
        let nameschepen = d3.group(grleden, d => d.voornaam)
        for (const [key, value] of nameschepen) {
            een_gr.push({ voornaam: key, achternaam: value[0].achternaam, functie: value[0].functie, fractie: value[0].fractie, beleidsdomeins: value[0].beleidsdomeins })
        }
        }

        // Voorzitter van het Vast bureau
        let vlvb = [];
        let een_vlvb = [];
        let vvb = bestuurfunctie.get('Voorzitter van het Vast bureau');
        if (!vvb) {
        } else {
            vvb.forEach(vvb => {
            let start_date = new Date(vvb.start)
            let bestuur_Start = start_date.getTime()
            let end_date = new Date(vvb.eind)
            let bestuur_End = end_date.getTime()
            if (+period_Start <= +bestuur_Start && !(+bestuur_End <= +today)) {
                vlvb.push({
                voornaam: vvb.voornaam, achternaam: vvb.achternaam, functie: vvb.bestuursfunctie, fractie: vvb.fractie, beleidsdomeins: vvb.beleidsdomeins
            })
            return vlvb
            }// end condition
        })
        let nameschepen = d3.group(vlvb, d => d.voornaam)
        for (const [key, value] of nameschepen) {
            een_vlvb.push({ voornaam: key, achternaam: value[0].achternaam, functie: value[0].functie, fractie: value[0].fractie, beleidsdomeins: value[0].beleidsdomeins })
        }
        }
        // Lid van het Vast Bureau
        let lvb = [];
        let een_lvb = [];
        let vb = bestuurfunctie.get('Lid van het Vast Bureau');
        if (!vb) {
        } else {
            vb.forEach(vb => {
            let start_date = new Date(vb.start)
            let bestuur_Start = start_date.getTime()
            let end_date = new Date(vb.eind)
            let bestuur_End = end_date.getTime()
            if (+period_Start <= +bestuur_Start && !(+bestuur_End <= +today)) {
                lvb.push({
                voornaam: vb.voornaam, achternaam: vb.achternaam, functie: vb.bestuursfunctie, fractie: vb.fractie, beleidsdomeins: vb.beleidsdomeins
            })
            return lvb
            }// end condition
        })
        let nameschepen = d3.group(lvb, d => d.voornaam)
        for (const [key, value] of nameschepen) {
            een_lvb.push({ voornaam: key, achternaam: value[0].achternaam, functie: value[0].functie, fractie: value[0].fractie, beleidsdomeins: value[0].beleidsdomeins })
        }
        }

        // Voorzitter van het Bijzonder Comité voor de Sociale Dienst
        let vbcsd = [];
        let een_vbcsd = [];
        let vcsd = bestuurfunctie.get('Voorzitter van het Bijzonder Comité voor de Sociale Dienst');
        if (!vcsd) {
        } else {
            vcsd.forEach(vcsd => {
            let start_date = new Date(vcsd.start)
            let bestuur_Start = start_date.getTime()
            let end_date = new Date(vcsd.eind)
            let bestuur_End = end_date.getTime()
            if (+period_Start <= +bestuur_Start && !(+bestuur_End <= +today)) {
                vbcsd.push({
                voornaam: vcsd.voornaam, achternaam: vcsd.achternaam, functie: vcsd.bestuursfunctie, fractie: vcsd.fractie, beleidsdomeins: vcsd.beleidsdomeins
            })
            return vbcsd
            }// end condition
        })
        let nameschepen = d3.group(vbcsd, d => d.voornaam)
        for (const [key, value] of nameschepen) {
            een_vbcsd.push({ voornaam: key, achternaam: value[0].achternaam, functie: value[0].functie, fractie: value[0].fractie, beleidsdomeins: value[0].beleidsdomeins })
        }
        }

        // Bijzonder Comité voor de Sociale Dienst
        let bcsd = [];
        let een_bcsd = [];
        let csd = bestuurfunctie.get('Lid van het Vast Bureau');
        if (!csd) {
        } else {
            csd.forEach(csd => {
            let start_date = new Date(csd.start)
            let bestuur_Start = start_date.getTime()
            let end_date = new Date(csd.eind)
            let bestuur_End = end_date.getTime()
            if (+period_Start <= +bestuur_Start && !(+bestuur_End <= +today)) {
                bcsd.push({
                voornaam: csd.voornaam, achternaam: csd.achternaam, functie: csd.bestuursfunctie, fractie: csd.fractie, beleidsdomeins: csd.beleidsdomeins
            })
            return bcsd
            }// end condition
        })
        let nameschepen = d3.group(bcsd, d => d.voornaam)
        for (const [key, value] of nameschepen) {
            een_bcsd.push({ voornaam: key, achternaam: value[0].achternaam, functie: value[0].functie, fractie: value[0].fractie, beleidsdomeins: value[0].beleidsdomeins })
        }
        }
        
        this.mandataris = {een_burgemeester, een_schepenen, een_tschepenen, een_voorZgr, een_gr, een_vlvb, een_lvb,een_vbcsd, een_bcsd } 
        return this.mandataris
        });//end then  
    }
}
