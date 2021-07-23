import Model, { attr} from '@ember-data/model';

export default class ArchievenModel extends Model {
    @attr('date') geplandeStart;
    @attr('string') location;
    @attr('string') title_agenda;
    @attr('string') description;
    @attr('string') bestuursorgaan;
    @attr('string') bestuurseenheidnaam;
}
