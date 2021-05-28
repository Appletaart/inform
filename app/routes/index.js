import Route from '@ember/routing/route';

export default class IndexRoute extends Route {
    async model() {
    let response = await fetch('/api/vlaanderen.json');
    let data = await response.json();
    //  console.log(data);
    let provincesData = topojson.feature(data, data.objects.provinces).features;
    let gemeenteData = topojson.feature(data, data.objects.municipalities).features;
    let gemeente = [];

        gemeenteData.forEach(name => {
        let names = name.properties.name_nl;
        gemeente.push(names)
        //console.log(names);
        });
    
    return { gemeente, provincesData, gemeenteData };
    }// end model
        
}
