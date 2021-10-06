import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
export default class ObjectInfoComponent extends Component {
    constructor(){
        super(...arguments);
        fetch('assets/api/population2021.json').then(
        response => response.json().then((data,error) => {
        if(error){
        console.log(error)
        }else{
        this.population = data;
        }}));
        
    }

    @tracked population;
}
