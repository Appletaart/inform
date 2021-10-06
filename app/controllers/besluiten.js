import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class BesluitenController extends Controller {
  @service map; // yes
  @tracked gemeente;

  get getGemeente() {
    if (!this.map['gemeente'].name) {
      this.gemeente = null;
      return this.gemeente
    } else {
      this.gemeente = this.map['gemeente'].name;
      // console.log('has value map click', this.gemeente );
      d3.select(".besluit").transition().style("visibility", "visible");
      // d3.select(".bp-map").transition().style("transform", "scale(.80)translate(-160px,0)")
      return this.gemeente

    }
  }

 /*  get getBesluiten() {
    const bestuurseenheids = d3.group(this.model, d => d.bestuurseenheidnaam);
    const een_bestuurseenheid = []
    for (const [key] of bestuurseenheids) {een_bestuurseenheid.push(key)}
    // get value from click event
    const bestuurseenheid = bestuurseenheids.get(this.gemeente);

    const groupStemming = [];
    if (!bestuurseenheid) {
    } else {
      const stemming_aanwezige = [];
      bestuurseenheid.forEach(bestuurseenheids => {
        let start_date = new Date(bestuurseenheids.geplandeStart)
        let geplande_Date = start_date.toDateString()
        let geplande_Time = start_date.toLocaleTimeString()
        stemming_aanwezige.push({
          geplandeStart: bestuurseenheids.geplandeStart,
          geplande_Date: geplande_Date,
          geplande_Time: geplande_Time,
          location: bestuurseenheids.location,
          aanwezigenInfo: bestuurseenheids.aanwezigenInfo,
          count: bestuurseenheids.count,
          bestuursclassificatie: bestuurseenheids.bestuursclassificatie,
          title: bestuurseenheids.title,
          description: bestuurseenheids.description,
          motivering: bestuurseenheids.motivering,
          nbPro: bestuurseenheids.nbPro,
          nbAnti: bestuurseenheids.nbAnti,
          nbNoVote: bestuurseenheids.nbNoVote
        })
         return stemming_aanwezige
      })
      let nameschepen = d3.group(stemming_aanwezige, d => d.geplandeStart)
      for (const [key, value] of nameschepen) {
          groupStemming.push({ 
          geplandeStart: key, 
          geplande_Date: value[0].geplande_Date, 
          geplande_Time: value[0].geplande_Time, 
          location: value[0].location,
          aanwezigenInfo: value[0].aanwezigenInfo,
          count: value[0].count,
          bestuursclassificatie: value[0].bestuursclassificatie,
          details: value
      })
      }
    }// end get bestuurseenheid
    // console.log(groupStemming);
     return groupStemming
  }// eind getBesluiten
*/

  }
