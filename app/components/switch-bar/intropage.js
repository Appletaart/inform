import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class SwitchBarIntropageComponent extends Component {
    @tracked selected;
    @service map;
    
    @action toggleClose() {
        d3.select(".intropage").transition().style("visibility", "hidden")
        if(this.checked){
          return this.identifier = "bar-right", this.checked = false;
        }
    }

    get getGemeente() {
        if (!this.map['gemeente'].name) {
          // return this.identify = "hidden";
        } else {
          this.selected = this.map['gemeente'].name;
          // d3.select(".intropage").transition().style("visibility", "visible")
          return  this.selected
        }
      }

      @tracked checked = false;
      @tracked identifier = "bar-right";
    
      @action
      onChange() {
        this.checked = !this.checked;
        if(!this.checked){
          // console.log("hello left", this.identifier = "bar-right");
          return this.identifier = "bar-right";
        }else{
          // console.log("hello right", this.identifier = "bar-left");
          return this.identifier = "bar-left";
        }
      }
}
