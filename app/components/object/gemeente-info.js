import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
export default class ObjectGemeenteInfoComponent extends Component {
    constructor(){
        super(...arguments);
        fetch('assets/api/info_gemeente.json').then(
        response => response.json().then((data,error) => {
        if(error){
        console.log(error)
        }else{
        this.info = data;
        }}));   
    }

    @tracked info;
}
