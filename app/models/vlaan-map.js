import Model, {attr} from '@ember-data/model';

export default class VlaanMapModel extends Model {
    @attr('number') nis;
    @attr('string') name_nl;
    @attr('number') population;

    get gemeente(){
        console.log(this.name_nl);
        return `${this.name_nl}`
    }
}
