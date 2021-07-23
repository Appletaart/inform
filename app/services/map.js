import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
export default class MapService extends Service {
    @tracked gemeente = []

    addItem = (item) => {
         this.gemeente = {name: item.target.id/* , population: item.target.__data__.properties.population */}// ...this.itemList/ to make a list
        //   console.log(this.gemeente);
         return this.gemeente 
    }

    /* addItem(item){
        console.log(item);
        console.log(item.target.id);
        console.log(item.target.__data__.properties.population);
        this.gemeente = [item.target.id, item.target.__data__.properties.population]
        // console.log(this.gemeente);
    } */
}
