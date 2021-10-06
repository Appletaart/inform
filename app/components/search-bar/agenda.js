import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
export default class SearchBarAgendaComponent extends Component {
  @service searchBar;
  @service hasagenda;
  @tracked selected;
  @tracked identifier = "hidden"
  
  get searchAgenda(){
      // console.log(this.hasagenda.bestuurseenheid);
      const bname = []
      this.hasagenda.bestuurseenheid.forEach(element => {
        const start_date = new Date(element.geplandeStart);
        const geplande_Date = start_date.toDateString()
        bname.push({bestuurseenheidnaam:element.bestuurseenheidnaam, geplande_Date:geplande_Date })  
      });
    //  console.log(bname);
      return bname 
  }

  @action
  onChange(value) {
    this.selected = value.bestuurseenheidnaam;
    this.addToService(this.selected);
    if(!this.selected){
      return this.identifier = "hidden";
    }else{
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
  } 
}
