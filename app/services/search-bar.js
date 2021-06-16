import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class SearchBarService extends Service {
    @tracked gemeente = []
    
     addItem = (value) => {
          this.gemeente = value// ...this.itemList/ to make a list
          console.log(value);
        //  return this.gemeente 
    }
}
