import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class SwitchBarSwitchbarBesluitenComponent extends Component {
  @service map
  @tracked checked = false;
  @tracked identifier = "bar-right";

  @action toggleClose() {
      console.log("work? besturen controller", this.map['gemeente'].name);
      this.map.empty; 
      d3.select(".indexpage").transition().style("visibility", "hidden")
      d3.select(".agenda").transition().style("visibility", "hidden")
      d3.select(".besluit").transition().style("visibility", "hidden")
      d3.select(".archieven").transition().style("visibility", "hidden")
      d3.select(".besturen").transition().style("visibility", "hidden")
      console.log("work? besturen controller", this.map['gemeente'].name);
    // d3.select(".bp-map").transition().style("transform", "scale(1)translate(0,0)")
  }

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
}
