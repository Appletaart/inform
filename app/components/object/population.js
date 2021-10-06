import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import Helper from '@ember/component/helper';
import { decimalFormat } from 'ember-helper-locale-number/helpers/decimal-format';

export default class ObjectPopulationComponent extends Component {
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
    @tracked gemeente;
    @tracked inwoner;

}
