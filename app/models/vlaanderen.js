import Model, {attr} from '@ember-data/model';

export default class VlaanMapModel extends Model {
    @attr('string') objects;
    @attr('string') provinces;
    @attr('string') municipalities;
    @attr('string') geometries;
    @attr('string') properties;
    @attr('string') name_nl;
    @attr('number') population;
}
