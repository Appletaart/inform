import Model, {attr}  from '@ember-data/model';

export default class BesturenModel extends Model {
    @attr('string') bestuurseenheidnaam;
    @attr('string') fractie
    @attr('string') bestuursfunctie
    @attr('string') een_bestuurseenheid;
    @attr('string') een_burgemeester; 
    @attr('string') een_schepenen;
    @attr('string') een_tschepenen;
    @attr('string') een_voorZgr;
    @attr('string') een_gr;
}
