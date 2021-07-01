import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class MainComponent extends Component {
    @service map; // yes
    @service searchBar;
    @tracked gemeente_search;
    @tracked gemeente;
    @tracked population;
    @tracked serviceItem

    @action
    clear(){     
      this.map.empty()
      console.log(" work? ");
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
          return this.gemeente_search
        }
      }
      
        get getGemeente() {
          if (!this.map['gemeente'].name) {
            this.gemeente = 'Roeselare'
            // console.log(this.map['gemeente'].name);
            return this.gemeente
          } else {
            this.gemeente = this.map['gemeente'].name;
            return this.gemeente
          }
        }
}
