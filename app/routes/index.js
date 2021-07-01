import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
export default class IndexRoute extends Route {
    @service map;


    model(){

    }
/*  async model() {
    // const {id} = params;
    let response = await fetch('/api/vlaanderens.json');
    let data = await response.json();
    // const data = await this.store.findAll('vlaanderen')
    // console.log(data);
    let provincesData = topojson.feature(data, data.objects.provinces).features;
    let gemeenteData = topojson.feature(data, data.objects.municipalities).features;
    let gemeente = [];
    gemeenteData.forEach(name => {
    let names = name.properties.name_nl;
    gemeente.push(names)
    });
    return { gemeente, provincesData, gemeenteData };
    }// end model */
   
   /*   async model() {
        let response = await fetch('/api/mandatendatabank.json');
        let {results} = await response.json();
        let test = results['bindings']
        const data = [];
        test.forEach(e => {
            data.push({
                start: e.start.value,
                eind: e.eind, 
                achternaam: e.achternaam.value, 
                voornaam: e.voornaam.value, 
                bestuursfunctie: e.bestuursfunctie.value, 
                fractie: e.fractie, 
                bestuurseenheidnaam: e.bestuurseenheidnaam.value
            })
        })   
        // console.log(data);     
        return data
        }// end model  */
  
}
