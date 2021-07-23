import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
export default class ArchievenController extends Controller {
    @service map;
    @service searchBar;
    @tracked gemeente;
    @tracked gemeente_search;

    get getGemeente() {
    if (!this.map['gemeente'].name) {
      this.gemeente = 'Roeselare'
      return this.gemeente
    } else {
      this.gemeente = this.map['gemeente'].name;
      console.log('has value', this.map['gemeente'].name);
      d3.select(".archieven").transition().style("visibility", "visible")
      return this.gemeente
    }
    }

    get get_Search(){
      if(!this.searchBar.gemeente_search){
        console.log('dont have value', this.searchBar.gemeente_search);
        this.gemeente_search = "Aalst"
        return this.gemeente_search 
      }else{
        this.gemeente_search = this.searchBar.gemeente_search;
        console.log('has value', this.searchBar.gemeente_search);
        // d3.select("#archievenSearch").transition().style("visibility", "visible")
        return this.gemeente_search
      }
    }

      get month(){
        const month = new Array();
              month[0] = "Jan";
              month[1] = "Feb";
              month[2] = "Mar";
              month[3] = "Apr";
              month[4] = "Mei";
              month[5] = "Jun";
              month[6] = "Jul";
              month[7] = "Aug";
              month[8] = "Sep";
              month[9] = "Okt";
              month[10] = "Nov";
              month[11] = "Dec";
              return month
      }

      get getArchieven() {
      const bestuurseenheids = d3.group(this.model.datas, d => d.bestuurseenheidnaam);
      const bestuurseenheid = bestuurseenheids.get(this.gemeente); //"Langemark-Poelkapelle"
      const stemming_years = [];
      const groupStemming = [];
      if (!bestuurseenheid) {
      } else {
          const stemming_aanwezige = [];
          bestuurseenheid.forEach(bestuurseenheids => {
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
      return {stemming_years, groupStemming}
      }// eind getArchieven
    
      get getArchievenSearch() {
        const bestuurseenheids = d3.group(this.model.datas, d => d.bestuurseenheidnaam);
        const bestuurseenheid = bestuurseenheids.get(this.gemeente_search); //"Langemark-Poelkapelle"
        const stemming_years = [];
        const groupStemming = [];
        if (!bestuurseenheid) {
        } else {
            const stemming_aanwezige = [];
            bestuurseenheid.forEach(bestuurseenheids => {
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
        console.log(stemming_years);
  
        return {stemming_years, groupStemming}
        
        }// eind getArchievenSearch
}
