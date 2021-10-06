import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
export default class BesturenController extends Controller {
  @service map;
  @tracked gemeente;

  get getGemeente() {
      if (!this.map['gemeente'].name) {
        this.gemeente = 'Roeselare'
        return this.gemeente
      } else {
        this.gemeente = this.map['gemeente'].name;
        // console.log('has value', this.map['gemeente'].name);
        d3.select(".besturen").transition().style("visibility", "visible")
        // d3.select(".bp-map").transition().style("transform", "scale(.80)translate(-160px,0)")
        return this.gemeente
      }
    }

   /*  get getBestuur(){
      let bestuurseenheids = d3.group(this.model, d => d.bestuurseenheidnaam);
      let een_bestuurseenheid = []
      for (const [key] of bestuurseenheids) { een_bestuurseenheid.push(key) }
      let bestuurseenheid = bestuurseenheids.get(this.gemeente);
      let bestuurfunctie = d3.group(bestuurseenheid, d => d.bestuursfunctie);
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
            eenBurgemeester.push({ voornaam: burgemeesters.voornaam, achternaam: burgemeesters.achternaam, functie: burgemeesters.bestuursfunctie, fractie: burgemeesters.fractie })
            return eenBurgemeester
          }// end condition 
        })
        let nameschepen = d3.group(eenBurgemeester, d => d.voornaam)
        for (const [key, value] of nameschepen) {
          een_burgemeester.push({ voornaam: key, achternaam: value[0].achternaam, functie: value[0].functie, fractie: value[0].fractie })
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
              voorZgr.push({ voornaam: vgr.voornaam, achternaam: vgr.achternaam, functie: vgr.bestuursfunctie, fractie: vgr.fractie })
              return voorZgr
            }// end condition 
          })
          let nameschepen = d3.group(voorZgr, d => d.voornaam)
          for (const [key, value] of nameschepen) {
            een_voorZgr.push({ voornaam: key, achternaam: value[0].achternaam, functie: value[0].functie, fractie: value[0].fractie })
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
                voornaam: schepens.voornaam, achternaam: schepens.achternaam, functie: schepens.bestuursfunctie, fractie: schepens.fractie
              })
              return co_schepen
            }
          }) // end foreach 
          let nameschepen = d3.group(co_schepen, d => d.voornaam)
          for (const [key, value] of nameschepen) {
            een_schepenen.push({ voornaam: key, achternaam: value[0].achternaam, functie: value[0].functie, fractie: value[0].fractie })
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
                voornaam: tvschs.voornaam, achternaam: tvschs.achternaam, functie: tvschs.bestuursfunctie, fractie: tvschs.fractie
              })
              return co_tvschs
            }// end condition 
          })
          let nameschepen = d3.group(co_tvschs, d => d.voornaam)
          for (const [key, value] of nameschepen) {
            een_tschepenen.push({ voornaam: key, achternaam: value[0].achternaam, functie: value[0].functie, fractie: value[0].fractie })
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
                voornaam: gr.voornaam, achternaam: gr.achternaam, functie: gr.bestuursfunctie, fractie: gr.fractie
              })
              return grleden
            }// end condition
          })
          let nameschepen = d3.group(grleden, d => d.voornaam)
          for (const [key, value] of nameschepen) {
            een_gr.push({ voornaam: key, achternaam: value[0].achternaam, functie: value[0].functie, fractie: value[0].fractie })
          }
        }

        return {een_burgemeester, een_schepenen, een_tschepenen, een_voorZgr, een_gr } 
    } */
}
