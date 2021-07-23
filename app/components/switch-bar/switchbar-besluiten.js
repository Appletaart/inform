import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class SwitchBarSwitchbarBesluitenComponent extends Component {
  @service map
  @tracked checked = false;
  @tracked identifier = "bar-right";
  // use for get data from route not from component gemeente
  @tracked opened = false;
  @tracked visible = "hidden";
  @tracked open = false;
  @tracked visibly = "hidden";
  @tracked active;
  /* @tracked month = ["JAN","FEB","MAR","APR","MEI","JUN","JUL","AUG","SEP","OCT","NOV","DEC"]
  @tracked year = ["2019","2020","2021"]  */

  @action toggleClose() {
      d3.select(".indexClick").transition().style("visibility", "hidden")
      d3.select(".agenda").transition().style("visibility", "hidden")
      d3.select(".besluit").transition().style("visibility", "hidden")
      d3.select(".archieven").transition().style("visibility", "hidden")
      d3.select(".besturen").transition().style("visibility", "hidden")
      this.visible = "hidden";
      this.visibly = "hidden";
    // d3.select(".bp-map").transition().style("transform", "scale(1)translate(0,0)")
  }

   // use for get data from route not from component gemeente
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

 /*  @action
  isOpen(){
    this.opened = !this.opened;
    if(!this.opened){
      // console.log("hello left", this.visible = "hidden");
      return this.visible = "hidden" ;
    }else{
      // console.log("hello right", this.visible = "visible" );
      return this.visible = "visible", this.active = "active";
    }
  }

  @action
  isOpening(){
    this.open = !this.open;
    if(!this.open){
      return this.visibly = "hidden";
    }else{
      return this.visibly = "visible";
    }
  } */

}
