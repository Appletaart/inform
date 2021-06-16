import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class Agenda extends Model {
/* @attr agendaStatus;
  @attr agendaType;
  @attr renderedContent;

  @belongsTo('zitting', {inverse: null}) zitting;
  @belongsTo('published-resource') publishedResource;

  @hasMany('agendapunt', {inverse: null}) agendapunten;
  @hasMany('signed-resource') signedResources; */
  @attr('date') geplandeStart;
  @attr('string') location;
  @attr('string') title_before_agendapunt;
  @attr('string') title_agenda;
  @attr('string') description;
  @attr('string') bestuursorgaan;
  @attr('string') bestuurseenheidnaam;
}