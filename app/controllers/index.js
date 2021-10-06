import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
export default class IndexController extends Controller {
  @service map; 
  @tracked gemeente = null;

 /*  resetController(controller, isExiting, transition) {
    if (isExiting) {
      // isExiting would be false if only the route's model was changing
      controller.set('gemeente', null);
      // controller.set('map', null);
      // controller.resetData();
    }
    if (transition) {
      // transition would be false if only the route's model was changing
      controller.set('gemeente', null);
      // controller.set('map', null);
      // controller.resetData();
    }
  } */

  get getGemeente() {
    if (!this.map['gemeente'].name) {
      this.gemeente = null;
      return this.gemeente
    } else {
      this.gemeente = this.map['gemeente'].name;
      // console.log('has value', this.gemeente);
      d3.select(".intropage").transition().style("visibility", "visible")
      // d3.select(".bp-map").transition().style("transform", "scale(.80)translate(-160px,0)")
      return this.gemeente
    }
  }

}