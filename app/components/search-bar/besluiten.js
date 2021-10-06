import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class SearchBarBesluitenComponent extends Component {
  @service searchBar;
  @service hasbesluit;
  @tracked selected;
  @tracked identifier = "hidden"

  @action
  onChange(value) {
    this.selected = value;
    this.addToService(this.selected);
    // console.log("work searchbar component", this.identifier);
    if(!this.selected){
      // console.log("hello left", this.identifier = "hidden");
      return this.identifier = "hidden";
    }else{
      // console.log("hello right", this.identifier = "visible");
      return this.identifier = "visible";
    }
  }

  @action 
    toggleClose() {
      return this.identifier = "hidden";
    }

  @action
  addToService(item){
  this.searchBar.addItem(item)
  // console.log('action add to service', item); // in map hbs use  {{on "click" this.addToService}}
  } 

  get searchBesluit(){
    // console.log(this.hasbesluit.bestuurseenheid);
    return this.hasbesluit.bestuurseenheid
}
}
