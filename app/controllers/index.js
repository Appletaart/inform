import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
export default class IndexController extends Controller {
  @service map;
  @service searchBar;
  @tracked gemeente;
  @tracked gemeente_search;

  get getGemeente() {
    if (!this.map['gemeente'].name) {
      this.gemeente = 'Roeselare'
      return this.gemeente
    } else {
      this.gemeente = this.map['gemeente'].name;
      console.log('has value', this.gemeente);
      // d3.select(".indexClick").transition().style("visibility", "visible")
      // d3.select(".bp-map").transition().style("transform", "scale(.80)translate(-160px,0)")
      return this.gemeente
    }
  }

  get get_Search() {
    if (!this.searchBar.gemeente_search) {
      this.gemeente_search = "Gent"
      return this.gemeente_search
    } else {
      this.gemeente_search = this.searchBar.gemeente_search;
      console.log('has value', this.gemeente_search);
      return this.gemeente_search
    }
  }

}