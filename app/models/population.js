import Model, {belongsTo} from '@ember-data/model';

export default class PopulationModel extends Model {
    @belongsTo('vlaanderen') gemeenten;
    @belongsTo('vlaanderen') inwoners;
    
    get inwonerPG(){
        return `${this.gemeenten} ${this.inwoners}`
    }
}
