import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class SwitchBarSwitchbarBesluitenComponent extends Component {
  @service map
  @tracked checked = false;
  @tracked identifier = "bar-right";

  @action toggleClose() {
      d3.select(".indexClick").transition().style("visibility", "hidden")
      d3.select(".agenda").transition().style("visibility", "hidden")
      d3.select(".besluit").transition().style("visibility", "hidden")
      d3.select(".besturen").transition().style("visibility", "hidden")
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

  @tracked isExpanded = false

  @action
  toggleAanweizig() {
    this.isExpanded = !this.isExpanded
  }
}
