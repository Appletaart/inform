import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class ArchiefController extends Controller {
  @service map; // yes
  @tracked gemeente = null;

  get getGemeente() {
    if (!this.map['gemeente'].name) {
    } else {
      this.gemeente = this.map['gemeente'].name;
      console.log('has value map click', this.gemeente );
      d3.select(".archief").transition().style("visibility", "visible");
      return this.gemeente
    }
  }
  
/* 
  get getArchieven() {
  const stemming_years = [];
  const stemming_months = [];
  const groupStemming = [];
  if (!this.model) { //this.model.datas
  } else {
      const stemming_aanwezige = [];
      this.model.forEach(bestuurseenheids => {
      let start_date = new Date(bestuurseenheids.geplandeStart)
      let geplande_Date = start_date.toDateString()
      let geplande_Time = start_date.toLocaleTimeString()
      let geplande_Month = start_date.getMonth();
      let geplande_Year = start_date.getFullYear();
        stemming_aanwezige.push({
        geplandeStart: bestuurseenheids.geplandeStart,
        geplande_Date: geplande_Date,
        geplande_Time: geplande_Time,
        geplande_Month: this.month[geplande_Month],
        geplande_Year: geplande_Year,
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
      
    //dit for years
    let stemming_aanwezige_year = d3.group(stemming_aanwezige, d => d.geplande_Year)
    let stemming_aanwezige_month = d3.group(stemming_aanwezige, d => d.geplande_Month)
    for (const [key, value] of stemming_aanwezige_year) {
      stemming_years.push({ 
        geplande_Year: key, 
        geplande_Month: value[0].geplande_Month
       })
    }
    for (const [key, value] of stemming_aanwezige_month) {
      stemming_months.push({ 
        geplande_Month: key, 
        geplande_Year: value[0].geplande_Year
       })}
    let nameschepen = d3.group(stemming_aanwezige, d => d.geplandeStart)
    for (const [key, value] of nameschepen) {
        groupStemming.push({ 
        geplandeStart: key, 
        geplande_Date: value[0].geplande_Date, 
        geplande_Time: value[0].geplande_Time,
        geplande_Year: value[0].geplande_Year,
        geplande_Month: value[0].geplande_Month, 
        location: value[0].location,
        aanwezigenInfo: value[0].aanwezigenInfo,
        count: value[0].count,
        bestuursclassificatie: value[0].bestuursclassificatie,
        details: value
    })
    }
  
  }
  return {stemming_years, stemming_months, groupStemming}
  }// eind getArchieven

  get getArchievenSearch() {
   const stemming_years = [];
    const groupStemming = [];
    if (!this.model) { //bestuurseenheid
    } else {
        const stemming_aanwezige = [];
        this.model.forEach(bestuurseenheids => {
        let start_date = new Date(bestuurseenheids.geplandeStart)
        let geplande_Date = start_date.toDateString()
        let geplande_Time = start_date.toLocaleTimeString()
        let geplande_Month = start_date.getMonth();
        let geplande_Year = start_date.getFullYear();
          stemming_aanwezige.push({
          geplandeStart: bestuurseenheids.geplandeStart,
          geplande_Date: geplande_Date,
          geplande_Time: geplande_Time,
          geplande_Month: this.month[geplande_Month],
          geplande_Year: geplande_Year,
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
      //dit for years
      let stemming_aanwezige_year = d3.group(stemming_aanwezige, d => d.geplande_Year)
      for (const [key, value] of stemming_aanwezige_year) {
        stemming_years.push({ 
          geplande_Year: key, 
          geplande_Month: value[0].geplande_Month
         })
      }
      let nameschepen = d3.group(stemming_aanwezige, d => d.geplandeStart)
      for (const [key, value] of nameschepen) {
          groupStemming.push({ 
          geplandeStart: key, 
          geplande_Date: value[0].geplande_Date, 
          geplande_Time: value[0].geplande_Time,
          geplande_Year: value[0].geplande_Year,
          geplande_Month: value[0].geplande_Month, 
          location: value[0].location,
          aanwezigenInfo: value[0].aanwezigenInfo,
          count: value[0].count,
          bestuursclassificatie: value[0].bestuursclassificatie,
          details: value
      })
      }
    }
    // console.log(stemming_years);
    return {stemming_years, groupStemming}
    }// eind getArchievenSearch
   */  
}
