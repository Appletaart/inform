import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class Agenda extends Model {
  @attr('date') geplandeStart;
  @attr('string') location;
  @attr('string') title_agenda;
  @attr('string') description;
  @attr('string') bestuursorgaan;
  @attr('string') bestuurseenheidnaam;
}