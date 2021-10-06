import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
export default class ObjectParamsComponent extends Component {
    @tracked query = '';
    @tracked radio;
    @tracked checked;
    @tracked identifier;

    @action
    onChange(value, identifier) {
    // don't delete value cause if you delete then the function doesn't work anymore
    this.checked = !this.checked;
    if(this.checked){
        this.radio = identifier.target.id
        return this.radio
    }else{
        return this.radio = null;
    }
    
    }
}
