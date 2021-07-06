import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
export default class ArchievenController extends Controller {
    @service map;
    @service searchBar;
    @tracked gemeente;
    @tracked gemeente_search;
    @tracked population;
  
    @action toggleClose() {
      console.log("work? archieven");
      d3.select("#archievenSearch").transition().style("visibility", "hidden")
      d3.select(".archieven").transition().style("visibility", "hidden")
    }

    get getGemeente() {
    if (!this.map['gemeente'].name) {
      this.gemeente = 'Roeselare'
      return this.gemeente
    } else {
      this.gemeente = this.map['gemeente'].name;
      console.log('has value', this.map['gemeente'].name);
      d3.select(".archieven").transition().style("visibility", "visible")
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

    get get_Search(){
      if(!this.searchBar.gemeente_search){
        console.log('dont have value', this.searchBar.gemeente_search);
        this.gemeente_search = "Aalst"
        return this.gemeente_search 
      }else{
        this.gemeente_search = this.searchBar.gemeente_search;
        console.log('has value', this.searchBar.gemeente_search);
        d3.select("#archievenSearch").transition().style("visibility", "visible")
        return this.gemeente_search
      }
    }
}
