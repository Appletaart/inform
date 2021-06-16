import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class AgendaController extends Controller {
    @service map; // yes
    @tracked gemeenteAgenda;
    @tracked population;
  
    @tracked toggleClick = true;
  
    @action toggleClose() {
      this.toggleClick = false;
      console.log("work? agenda");
    }
  
    @action clickToOpen() {
      this.toggleClick = true;
    }
  
    get getGemeenteAgenda() {
      if (!this.map['gemeente'].name) {
        this.gemeenteAgenda = 'Roeselare'
          // console.log(this.map['gemeente'].name);
        return this.gemeenteAgenda
      } else {
        this.gemeenteAgenda = this.map['gemeente'].name;
        return this.gemeenteAgenda
      }
    }
  
    get getPopulation() {
      if (!this.map['gemeente'].population) {
        this.population = 'Roeselare'
        return this.population.toLocaleString()
      } else {
        this.population = this.map['gemeente'].population;
        return this.population.toLocaleString()
      }
    }
  
    get getAgenda() {
      const bestuurseenheids = d3.group(this.model.datas, d => d.bestuurseenheidnaam);
      const bestuurseenheids_qa = d3.group(this.model.datas_qa, d => d.bestuurseenheidnaam);
      
      const een_bestuurseenheid = []
      for (const [key] of bestuurseenheids) {een_bestuurseenheid.push(key)}
      // get value from click event
      const bestuurseenheid = bestuurseenheids.get(this.gemeenteAgenda);
      const bestuurseenheid_qa = bestuurseenheids_qa.get(this.gemeenteAgenda);
     
      let detailsAgenda = [];
      let groupAgenda = [];

      if (!bestuurseenheid_qa) {
      } else {
        bestuurseenheid_qa.forEach(bestuurseenheids => {
          let start_date = new Date(bestuurseenheids.geplandeStart)
          let geplande_Date = start_date.toDateString()
          let geplande_Time = start_date.toLocaleTimeString()
          detailsAgenda.push({
            geplandeStart: bestuurseenheids.geplandeStart,
            geplande_Date: geplande_Date,
            geplande_Time: geplande_Time,
            bestuursorgaan: bestuurseenheids.bestuursorgaan,
            location: bestuurseenheids.location,
            title_before_agendapunt: bestuurseenheids.title_before_agendapunt,
            title_agenda: bestuurseenheids.title_agenda,
            description: bestuurseenheids. description
          })
          return detailsAgenda
        })
        let nameschepen = d3.group(detailsAgenda, d => d.geplandeStart)
        for (const [key, value] of nameschepen) {
            console.log(value);
          groupAgenda.push({ 
            geplandeStart: key, 
            geplande_Date: value[0].geplande_Date, 
            geplande_Time: value[0].geplande_Time, 
            bestuursorgaan: value[0].bestuursorgaan,
            details_Agenda: value,
            location: value[0].location
          })
        }
      }
      if (!bestuurseenheid) {
      } else {
        bestuurseenheid.forEach(bestuurseenheids => {
          let start_date = new Date(bestuurseenheids.geplandeStart)
          let geplande_Date = start_date.toDateString()
          let geplande_Time = start_date.toLocaleTimeString()
          detailsAgenda.push({
            geplandeStart: bestuurseenheids.geplandeStart,
            geplande_Date: geplande_Date,
            geplande_Time: geplande_Time,
            bestuursorgaan: bestuurseenheids.bestuursorgaan,
            location: bestuurseenheids.location,
            title_before_agendapunt: bestuurseenheids.title_before_agendapunt,
            title_agenda: bestuurseenheids.title_agenda,
            description: bestuurseenheids. description
          })
          return detailsAgenda
        })
        let nameschepen = d3.group(detailsAgenda, d => d.geplandeStart)
        for (const [key, value] of nameschepen) {
          //  console.log(value);
          groupAgenda.push({ 
            geplandeStart: key, 
            geplande_Date: value[0].geplande_Date, 
            geplande_Time: value[0].geplande_Time, 
            bestuursorgaan: value[0].bestuursorgaan,
            details_Agenda: value,
            location: value[0].location
          })
        }
      }// end get bestuurseenheid
      return {een_bestuurseenheid, groupAgenda}
    }// eind getAgenda

    


}
