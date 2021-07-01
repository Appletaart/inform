import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { computed, set } from '@ember/object';

class title_agenda{
  @tracked title_agenda;
  constructor(getAgenda){
    this.title_agenda = getAgenda.groupAgenda.title_agenda;
  }
}

class Person {
  constructor() {
    this.firstName = 'Betty';
    this.lastName = 'Jones';
  }

  @computed('firstName', 'lastName')
  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }
}
let client = new Person();

client.fullName; // 'Betty Jones'

set(client, 'lastName', 'Fuller');
console.log(client.fullName);;
export default class AgendaController extends Controller {
    @service map; // yes
    @service searchBar;
    @tracked gemeente_search;
    @tracked gemeente;
    @tracked population;
    @tracked serviceItem
    
    @tracked toggleClick = true;

    /*  
    @action toggleClose() {
      this.toggleClick = false;
      console.log("work? agenda");
    }
   */
    /*     @action
    remove(serviceItem) {
    serviceItem = this.map.remove(this.map['gemeente'].name) && this.searchBar.remove(this.searchBar.gemeente_search);
    return serviceItem
    } */

    @action 
    toggleClose() {
      console.log("work? Agenda "+ this.gemeente);
      this.toggleClick = false;
      d3.select("#agendapunt").transition().style("visibility", "hidden")
      d3.select("#agenda").transition().style("visibility", "hidden");
      d3.select(".bp-map").transition().style("transform", "scale(1)translate(0,0)")
      // this.remove(this.gemeente)
      console.log("work? Agenda "+ this.gemeente);
    }

    /* @action
    remove(gemeente) {
      this.map.remove(gemeente);
      console.log(gemeente);
    } */
    
    get get_Search(){
      if(!this.searchBar.gemeente_search){
        d3.select("#agendapunt").transition().style("visibility", "hidden")
        console.log('dont have value', this.searchBar.gemeente_search);
        this.gemeente_search = "Gent"
        return this.gemeente_search 
      }else{
        this.gemeente_search = this.searchBar.gemeente_search;
        console.log('has value', this.searchBar.gemeente_search);
        d3.select("#agendapunt").transition().style("visibility", "visible")
        d3.select(".bp-map").transition().style("transform", "scale(.80)translate(-160px,0)")
        return this.gemeente_search
      }
    }

    
    get getGemeente() {
      if (!this.map['gemeente'].name) {
        this.gemeente = 'Roeselare'
        return this.gemeente
      } else {
        this.gemeente = this.map['gemeente'].name;
        console.log('has value', this.map['gemeente'].name);
        d3.select("#agenda").transition().style("visibility", "visible");
        d3.select(".bp-map").transition().style("transform", "scale(.80)translate(-160px,0)")
         return this.gemeente
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
        const bestuurseenheids = d3.group(this.model.realdata, d => d.bestuurseenheidnaam);     
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
              // bestuursorgaan: bestuurseenheids.bestuursorgaan,
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
      const bestuurseenheids = d3.group(this.model.realdata, d => d.bestuurseenheidnaam); 
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
            // bestuursorgaan: bestuurseenheids.bestuursorgaan,
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

}
