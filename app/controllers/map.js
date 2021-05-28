import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { computed, action } from '@ember/object';


export default class MapController extends Controller {
  
    @tracked province = this.model.provincesData.properties.name_nl; // set default > set the first one 
    
    singleselects = ['Barcelona', 'London', 'New York', 'Porto']
    singleselect = 'London'

    // get nameProvinces(){
    //    // return `/assets/images/beats-solo-${this.color}.png`;
    // //   return this.model.provincesData.properties.name_nl.find(({province})=>color === this.color).image;
    //    // this model meant model in routes/item.js columns colors/color->image see.json file
    // }

    // @action
    // onChangeColor(newColor){ // insert argument
    //     this.color = newColor;
    // }
}
