import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
export default class AgendaController extends Controller {
  @service map; // yes
  @tracked gemeente;

  get getGemeente() {
    if (!this.map['gemeente'].name) {
      this.gemeente = 'Roeselare'
      return this.gemeente
    } else {
      this.gemeente = this.map['gemeente'].name;
      d3.select(".agenda").transition().style("visibility", "visible");
      return this.gemeente
    }
  }
  /* 
      get getAgenda() {
        const bestuurseenheids = d3.group(this.model, d => d.bestuurseenheidnaam);     
        const een_bestuurseenheid = []
        for (const [key] of bestuurseenheids) {een_bestuurseenheid.push(key)}
        const bestuurseenheid = bestuurseenheids.get(this.gemeente);
        let detailsAgenda = [];
        let groupAgenda = [];
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
              bestuursclassificatie: bestuurseenheids.bestuursclassificatie,
              location: bestuurseenheids.location,
              title_before_agendapunt: bestuurseenheids.title_before_agendapunt,
              title_agenda: bestuurseenheids.title_agenda,
              description: bestuurseenheids.description
            })
            return detailsAgenda
          })
          let nameschepen = d3.group(detailsAgenda, d => d.geplandeStart)
          for (const [key, value] of nameschepen) {
            groupAgenda.push({ 
              geplandeStart: key, 
              geplande_Date: value[0].geplande_Date, 
              geplande_Time: value[0].geplande_Time, 
              bestuursclassificatie: value[0].bestuursclassificatie,
              details_Agenda: value,
              location: value[0].location
            })
          }
        }// end get bestuurseenheid
        return {groupAgenda}
      }// eind getAgenda

      get getAgendaSearch() {
      const bestuurseenheids = d3.group(this.model, d => d.bestuurseenheidnaam); 
      //  console.log(bestuurseenheids);    
      const een_bestuurseenheid = []
      for (const [key] of bestuurseenheids) {een_bestuurseenheid.push(key)}
      const bestuurseenheid = bestuurseenheids.get(this.gemeente_search);
      let detailsAgenda = [];
      let groupAgenda = [];
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
            bestuursclassificatie: bestuurseenheids.bestuursclassificatie,
            location: bestuurseenheids.location,
            title_before_agendapunt: bestuurseenheids.title_before_agendapunt,
            title_agenda: bestuurseenheids.title_agenda,
            description: bestuurseenheids.description
          })
          return detailsAgenda
        })
        let nameschepen = d3.group(detailsAgenda, d => d.geplandeStart)
        for (const [key, value] of nameschepen) {
          groupAgenda.push({ 
            geplandeStart: key, 
            geplande_Date: value[0].geplande_Date, 
            geplande_Time: value[0].geplande_Time, 
            bestuursclassificatie: value[0].bestuursclassificatie,
            details_Agenda: value,
            location: value[0].location
          })
        }
      }// end get bestuurseenheid
      return {groupAgenda}
    }// eind getAgendaSearch
 */
}
