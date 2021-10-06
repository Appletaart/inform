import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

export default class ObjectSearchComponent extends Component {
    @tracked eenheids;
    @tracked bestuursclassificatie;
    @tracked title;
    @tracked query = '';
    @tracked radio;

// make it per bestuursclassificatie
    get results() {

        let { eenheids, query, radio } = this.args;
        let selectquery = [];
        let querys = query.toUpperCase()

        if(query){
          eenheids = eenheids.filter((eenheids) => eenheids.details_classificatie.map(details => details.details.map(d => {
            let dd = d.title.toUpperCase();
           if(dd.includes(querys)){
             return selectquery.push({titile: d.title,
               bestuursclassificatie: d.bestuursclassificatie,                                                  
               geplandeStart: d.geplandeStart,
               geplande_Month: d.geplande_Month,
               geplande_Year: d.geplande_Year,
               location: d.location,
               title: d.title,
               description: d.description,  
               motivering: d.motivering,
               nbAnti: d.nbAnti,
               nbNoVote: d.nbNoVote,
               nbPro: d.nbPro,
               onthouders: d.onthouders,
               tegenstanders: d.tegenstanders,
               voorstanders: d.voorstanders
               })
           }})))
         }// end query
         
       /*  if (query || radio) {
          if(radio){
            eenheids = eenheids.filter((eenheids) => console.log("in filter",
            eenheids.details_classificatie.map(details => details.details.map(d => {
              if(d.bestuursclassificatie.includes(radio)){
                  selectquery.push({titile: d.title,
                  bestuursclassificatie: d.bestuursclassificatie,                                                  
                  geplandeStart: d.geplandeStart,
                  geplande_Month: d.geplande_Month,
                  geplande_Year: d.geplande_Year,
                  location: d.location,
                  title: d.title,
                  description: d.description,  
                  motivering: d.motivering,
                  nbAnti: d.nbAnti,
                  nbNoVote: d.nbNoVote,
                  nbPro: d.nbPro,
                  onthouders: d.onthouders,
                  tegenstanders: d.tegenstanders,
                  voorstanders: d.voorstanders
                  })

            }}))));
            console.log("radio", eenheids);
          } // end radio
          if(query){
           eenheids = eenheids.filter((eenheids) => console.log("in filter",
           eenheids.details_classificatie.map(details => details.details.map(d => {
            if(d.title.includes(query)){
              return selectquery.push({titile: d.title,
                bestuursclassificatie: d.bestuursclassificatie,                                                  
                geplandeStart: d.geplandeStart,
                geplande_Month: d.geplande_Month,
                geplande_Year: d.geplande_Year,
                location: d.location,
                title: d.title,
                description: d.description,  
                motivering: d.motivering,
                nbAnti: d.nbAnti,
                nbNoVote: d.nbNoVote,
                nbPro: d.nbPro,
                onthouders: d.onthouders,
                tegenstanders: d.tegenstanders,
                voorstanders: d.voorstanders
                })
            }}))))
          }// end query
        } */
        
        eenheids = selectquery
      //  console.log("then filter", eenheids.then(d => d))
        return eenheids/* , title */;
      }
}
