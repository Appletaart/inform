import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class BesluitenController extends Controller {
    @service map; // yes
    @tracked gemeente;
    @tracked population;
  
    @tracked toggleClick = true;
  
    @action toggleClose() {
      this.toggleClick = false;
      console.log("work? agenda");
    }
  
    @action clickToOpen() {
      this.toggleClick = true;
    }
  
    get getGemeente() {
      if (!this.map['gemeente'].name) {
        this.gemeente = 'Roeselare'
        // console.log(this.map['gemeente'].name);
        return this.gemeente
      } else {
        this.gemeente = this.map['gemeente'].name;
        return this.gemeente
      }
    }
  
    get getPopulation() {
      if (!this.map['gemeente'].population) {
        this.population = 'Roeselare'
        // console.log(this.map['gemeente'].name);
        return this.population.toLocaleString()
      } else {
        this.population = this.map['gemeente'].population;
        return this.population.toLocaleString()
      }
    }

    get getBesluiten() {
      const bestuurseenheids = d3.group(this.model.datas, d => d.bestuurseenheidnaam);
      const bestuurseenheids_qa = d3.group(this.model.datas_qa, d => d.bestuurseenheidnaam);
      const een_bestuurseenheid = []
      for (const [key] of bestuurseenheids) {een_bestuurseenheid.push(key)}
      
      // get value from click event
      const bestuurseenheid = bestuurseenheids.get(this.gemeente);
      const bestuurseenheid_qa = bestuurseenheids_qa.get(this.gemeente);
     
      const stemming_aanwezige = [];
      const groupStemming = [];
      if (!bestuurseenheid_qa) {
      } else {
        bestuurseenheid_qa.forEach(bestuurseenheids => {
          let start_date = new Date(bestuurseenheids.geplandeStart)
          let geplande_Date = start_date.toDateString()
          let geplande_Time = start_date.toLocaleTimeString()
          stemming_aanwezige.push({
            geplandeStart: bestuurseenheids.geplandeStart,
            geplande_Date: geplande_Date,
            geplande_Time: geplande_Time,
            location: bestuurseenheids.location,
            bestuursorgaan: bestuurseenheids.bestuursorgaan,
            title: bestuurseenheids.title,
            description: bestuurseenheids.description,
            motivering: bestuurseenheids.motivering,
            nbPro: bestuurseenheids.nbPro,
            nbAnti: bestuurseenheids.nbAnti,
            nbNoVote: bestuurseenheids.nbNoVote
          })
           return stemming_aanwezige
        })
        let nameschepen = d3.group(stemming_aanwezige, d => d.geplandeStart)
        
        for (const [key, value] of nameschepen) {
          groupStemming.push({ 
            geplandeStart: key, 
            geplande_Date: value[0].geplande_Date, 
            geplande_Time: value[0].geplande_Time, 
            location: value[0].location,
            bestuursorgaan: value[0].bestuursorgaan,
            details: value
            /* description: value[0].description,
            motivering: value[0].motivering,
            nbPro: value[0].nbPro,
            nbAnti: value[0].nbAnti,
            nbNoVote: value[0].nbNoVote */
          
          })
        }
      }// end get bestuurseenheid
      const zitting_aanwezige = [];
      const groupAanwezige = [];
      if (!bestuurseenheid) {
      } else {
        bestuurseenheid.forEach(bestuurseenheids => {
          let start_date = new Date(bestuurseenheids.geplandeStart)
          let geplande_Date = start_date.toDateString()
          let geplande_Time = start_date.toLocaleTimeString()
          zitting_aanwezige.push({
            geplandeStart: bestuurseenheids.geplandeStart,
            geplande_Date: geplande_Date,
            geplande_Time: geplande_Time,
            location: bestuurseenheids.location,
            agendapunt_aanwezige:bestuurseenheids.agendapunt_aanwezige
          })
          return zitting_aanwezige
        })
        let nameschepen = d3.group(zitting_aanwezige, d => d.geplandeStart)
        console.log(nameschepen);
        for (const [key, value] of nameschepen) {
          groupAanwezige.push({ 
            geplandeStart: key, 
            geplande_Date: value[0].geplande_Date, 
            geplande_Time: value[0].geplande_Time, 
            location: value[0].location,
            naam_aanwezige: value,

          })
        }
      }// end get bestuurseenheid
      console.log(groupStemming);
      // console.log(groupAanwezige);
       return {een_bestuurseenheid, groupAanwezige, groupStemming}
    }// eind getAgenda
  
}
