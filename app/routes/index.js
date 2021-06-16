import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class IndexRoute extends Route {
    @service store;
    @service map; 
    
    async model() {
    // const {id} = params;

    let response = await fetch('/api/vlaanderens.json');
    let data = await response.json();
    // const data = await this.store.findAll('vlaanderen'/* , {
    // filter: { objects: 'provinces' }} */)
    // console.log(data);
    let provincesData = topojson.feature(data, data.objects.provinces).features;
    let gemeenteData = topojson.feature(data, data.objects.municipalities).features;
    let gemeente = [];

        gemeenteData.forEach(name => {
        let names = name.properties.name_nl;
        gemeente.push(names)
        });
    
    // const getge = gemeente.find(gemeente === id)

     return { gemeente, provincesData, gemeenteData };
    }// end model
   
    
}
