import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class IndexController extends Controller {
  @service map;
  @service searchBar;
  @tracked gemeente_search;
  @tracked gemeente;
  @tracked population;
  @tracked serviceItem

  @action toggleClose() {
    console.log("work? index controller");
    d3.select("#mandata").transition().style("visibility", "hidden")
    d3.select("#textgraph").transition().style("visibility", "hidden")
    d3.select(".bp-map").transition().style("transform", "scale(1)translate(0,0)")
  }



  get get_Search(){
    if(!this.searchBar.gemeente_search){
      d3.select("#mandata").transition().style("visibility", "hidden")
      console.log('dont have value', this.searchBar.gemeente_search);
      this.gemeente_search = "Gent"
      return this.gemeente_search 
    }else{
      this.gemeente_search = this.searchBar.gemeente_search;
      console.log('has value', this.searchBar.gemeente_search);
      d3.select("#mandata").transition().style("visibility", "visible")
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
      d3.select("#textgraph").transition().style("visibility", "visible")
      d3.select(".bp-map").transition().style("transform", "scale(.80)translate(-160px,0)")
      return this.gemeente
    }
  }

  get getPopulation() {
    if (!this.map['gemeente'].population) {
      this.population = ''
      return this.population.toLocaleString()
    } else {
      this.population = this.map['gemeente'].population;
      return this.population.toLocaleString()
    }
  }


}
