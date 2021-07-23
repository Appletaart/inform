import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
export default class SearchBarService extends Service {
    @tracked gemeente_search;
    
     addItem = (value) => {
          this.gemeente_search = value// ...this.itemList/ to make a list
        //   console.log('service', value);
          return this.gemeente_search
    }

}
