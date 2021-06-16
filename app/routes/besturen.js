import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import d3 from 'd3';
export default class BesturenRoute extends Route {
  @service map;
  @tracked gemeente;
  @tracked population;

  /* @service store;

  queryParams = {
    municipalities: {
      refreshModel: true
    }
  };

  model(params) {
    param.query.municipalities
    fetch("data", municipalities.id){
      return "the data"
    }
  } */

  get getGemeente() {
    if (!this.map['gemeente'].name) {
      // console.log(this.map['gemeente'].name);
      this.gemeente = 'Roeselare'
      return this.gemeente
    } else {
      this.gemeente = this.map['gemeente'].name;
      return this.gemeente
    }
  }

  get getPopulation() {
    if (!this.map['gemeente'].population) {
      this.population = 'Roeselare'
      // console.log(this.map['gemeente'].name);
      return this.population.toLocaleString()
    } else {
      this.population = this.map['gemeente'].population;
      return this.population.toLocaleString()
    }
  }

 /*  setupController(controller, model) {
    super.setupController(controller, model);
    controller.gemeente = this.getName
    console.log(controller.gemeente);
  } */

  async model() {
    let response = await fetch('/api/mandaten.json');
    let data = await response.json();
    // console.log(data);
    return data
    if (this.getGemeente) {
      let bestuurseenheids = d3.group(data, d => d.bestuurseenheidLabel);
      let een_bestuurseenheid = []
      for (const [key] of bestuurseenheids) { een_bestuurseenheid.push(key) }
      let bestuurseenheid = bestuurseenheids.get(this.getGemeente);
      let bestuurfunctie = d3.group(bestuurseenheid, d => d.bestuursfunctieLabel);
      let formatTime = new Date();
      let today = formatTime.getTime()
      let bestuurperiod = new Date("1/1/2019")
      let period_Start = bestuurperiod.getTime()

      //  Burgemeester 
      let eenBurgemeester = [];
      let een_burgemeester = [];
      let burgemeester = bestuurfunctie.get('Burgemeester');

      if (!burgemeester) {
      } else {
        burgemeester.forEach(burgemeesters => {
          let start_date = new Date(burgemeesters.start)
          let bestuur_Start = start_date.getTime()
          let end_date = new Date(burgemeesters.eind)
          let bestuur_End = end_date.getTime()
          if (+period_Start <= +bestuur_Start && !(+bestuur_End <= +today)) {
            eenBurgemeester.push({
              voornaam: burgemeesters.voornaam, achternaam: burgemeesters.achternaam, functie: burgemeesters.bestuursfunctieLabel, fractie: burgemeesters.fractieNaam
            })
            return eenBurgemeester
          }// end condition 
        })
        let nameschepen = d3.group(eenBurgemeester, d => d.voornaam)
        for (const [key, value] of nameschepen) {
          een_burgemeester.push({ voornaam: key, achternaam: value[0].achternaam, functie: value[0].functie, fractie: value[0].fractie })
        }

        // Voorzitter van de gemeenteraad
        let voorZgr = [];
        let een_voorZgr = [];
        let vgrl = bestuurfunctie.get('Voorzitter van de gemeenteraad');
        if (!vgrl) {
        } else {
          vgrl.forEach(vgr => {
            let start_date = new Date(vgr.start)
            let bestuur_Start = start_date.getTime()
            let end_date = new Date(vgr.eind)
            let bestuur_End = end_date.getTime()
            if (+period_Start <= +bestuur_Start && !(+bestuur_End <= +today)) {
              voorZgr.push({ voornaam: vgr.voornaam, achternaam: vgr.achternaam, functie: vgr.bestuursfunctieLabel, fractie: vgr.fractieNaam })
              return voorZgr
            }// end condition 
          })
          let nameschepen = d3.group(voorZgr, d => d.voornaam)
          for (const [key, value] of nameschepen) {
            een_voorZgr.push({ voornaam: key, achternaam: value[0].achternaam, functie: value[0].functie, fractie: value[0].fractie })
          }
        }

        //  Schepenen
        let schepen = bestuurfunctie.get('Schepen');
        let co_schepen = []
        let een_schepenen = []

        if (!schepen) {
        } else {
          schepen.forEach(schepens => {
            let start_date = new Date(schepens.start)
            let bestuur_Start = start_date.getTime()
            let end_date = new Date(schepens.eind)
            let bestuur_End = end_date.getTime()
            if (+period_Start <= +bestuur_Start && !(+bestuur_End <= +today)) {
              co_schepen.push({
                voornaam: schepens.voornaam, achternaam: schepens.achternaam, functie: schepens.bestuursfunctieLabel, fractie: schepens.fractieNaam
              })
              return co_schepen
            }
          }) // end foreach 
          let nameschepen = d3.group(co_schepen, d => d.voornaam)
          for (const [key, value] of nameschepen) {
            een_schepenen.push({ voornaam: key, achternaam: value[0].achternaam, functie: value[0].functie, fractie: value[0].fractie })
          }
        }// end else

        // Toegevoegde schepen
        let tvsch = bestuurfunctie.get('Toegevoegde schepen');
        let co_tvschs = [];
        let een_tschepenen = []
        if (!tvsch) {
        } else {
          tvsch.forEach(tvschs => {
            let start_date = new Date(tvschs.start)
            let bestuur_Start = start_date.getTime()
            let end_date = new Date(tvschs.eind)
            let bestuur_End = end_date.getTime()
            if (+period_Start <= +bestuur_Start && !(+bestuur_End <= +today)) {
              co_tvschs.push({
                voornaam: tvschs.voornaam, achternaam: tvschs.achternaam, functie: tvschs.bestuursfunctieLabel, fractie: tvschs.fractieNaam
              })
              return co_tvschs
            }// end condition 
          })
          let nameschepen = d3.group(co_tvschs, d => d.voornaam)
          for (const [key, value] of nameschepen) {
            een_tschepenen.push({ voornaam: key, achternaam: value[0].achternaam, functie: value[0].functie, fractie: value[0].fractie })
          }
        }

        // Gemeenteraadsleden
        let grleden = [];
        let een_gr = [];
        let grl = bestuurfunctie.get('Gemeenteraadslid');
        if (!grl) {
        } else {
          grl.forEach(gr => {
            let start_date = new Date(gr.start)
            let bestuur_Start = start_date.getTime()
            let end_date = new Date(gr.eind)
            let bestuur_End = end_date.getTime()
            if (+period_Start <= +bestuur_Start && !(+bestuur_End <= +today)) {
              grleden.push({
                voornaam: gr.voornaam, achternaam: gr.achternaam, functie: gr.bestuursfunctieLabel, fractie: gr.fractieNaam
              })
              return grleden
            }// end condition
          })
          let nameschepen = d3.group(grleden, d => d.voornaam)
          for (const [key, value] of nameschepen) {
            een_gr.push({ voornaam: key, achternaam: value[0].achternaam, functie: value[0].functie, fractie: value[0].fractie })
          }
        }

        return { een_bestuurseenheid, een_burgemeester, een_schepenen, een_tschepenen, een_voorZgr, een_gr }
      }

    } //eind if
  }// end model 


  /* async model(){ 
     let mandatenData = []
     let response = await fetch('/api/mandatenedit.csv')
     await response.text().then((data, error) => {
     if (error) {
     console.log(error);
     } else {
         const datas = data.split("\n")
         datas.forEach(datas => {
         const passData = datas.split(",");
         mandatenData.push(passData)
    })}})  // end response then

    // start,
    // eind,
    // voornaam,
    // achternaam,
    // bestuursfunctieLabel,
    // bestuurseenheidLabel,
    // fractieNaam
    
    // return mandatenData;
   if(this.getGemeente) {
     console.log(this.getGemeente);
    let bestuurseenheids = d3.group(mandatenData, d => d[19]);
    let bestuurseenheid = bestuurseenheids.get(this.getGemeente);
    let bestuurfunctie = d3.group(bestuurseenheid, d => d[12]);
    let formatTime = new Date();
    let today = formatTime.getTime()
    let bestuurperiod = new Date("1/1/2019")
    let period_Start = bestuurperiod.getTime()
 
    //  Burgemeester 
    let eenBurgemeester = [];
    let een_burgemeester = []; 
    let burgemeester = bestuurfunctie.get('Burgemeester'); 
    console.log(burgemeester);
    if(!burgemeester){
    }else{
    burgemeester.forEach(burgemeesters => {
    let start_date = new Date(burgemeesters[1])
    let bestuur_Start = start_date.getTime()
    let end_date = new Date(burgemeesters[2])
    let bestuur_End = end_date.getTime()
    if(+period_Start <= +bestuur_Start && !(+bestuur_End <= +today)){
      eenBurgemeester.push({
        voornaam: burgemeesters[7], achternaam: burgemeesters[8], functie: burgemeesters[12], fractie: burgemeesters[25]})
      return eenBurgemeester
    }// end condition 
    })
    let nameschepen = d3.group(eenBurgemeester, d => d.voornaam)
    for (const [key, value] of nameschepen){
        een_burgemeester.push({ voornaam:key , achternaam: value[0].achternaam, functie:value[0].functie, fractie: value[0].fractie})}
    }
 
    // Voorzitter van de gemeenteraad
    let voorZgr = [];
    let een_voorZgr = [];
    let vgrl = bestuurfunctie.get('Voorzitter van de gemeenteraad');   
    if(!vgrl){
    }else{
    vgrl.forEach(vgr => {
      let start_date = new Date(vgr[1])
      let bestuur_Start = start_date.getTime()
      let end_date = new Date(vgr[2])
      let bestuur_End = end_date.getTime()
      if(+period_Start <= +bestuur_Start && !(+bestuur_End <= +today)){
        voorZgr.push({ voornaam: vgr[7], achternaam: vgr[8],functie: vgr[12],fractie: vgr[25]})
        return voorZgr
    }// end condition 
    })
    let nameschepen = d3.group(voorZgr, d => d.voornaam)
    for (const [key, value] of nameschepen){
        een_voorZgr.push({ voornaam:key , achternaam: value[0].achternaam, functie:value[0].functie, fractie: value[0].fractie})}
    } 
 
    //  Schepenen
    let schepen = bestuurfunctie.get('Schepen');
 
    // Schepen
    let co_schepen = []
    let een_schepenen = []
    
    if(!schepen){
    }else{
    schepen.forEach(schepens => {   
    let start_date = new Date(schepens[1])
    let bestuur_Start = start_date.getTime()
    let end_date = new Date(schepens[2])
    let bestuur_End = end_date.getTime()
    if(+period_Start <= +bestuur_Start && !(+bestuur_End <= +today)){
        co_schepen.push({
            voornaam: schepens[7],achternaam: schepens[8],functie: schepens[12],fractie: schepens[25]})
        return co_schepen
    }
    }) // end foreach 
    let nameschepen = d3.group(co_schepen, d => d.voornaam)
    for (const [key, value] of nameschepen){
        een_schepenen.push({ voornaam:key , achternaam: value[0].achternaam, functie:value[0].functie, fractie: value[0].fractie})
    }
    }// end else
    
      // Toegevoegde schepen
      let tvsch = bestuurfunctie.get('Toegevoegde schepen');
      let co_tvschs = []; 
      let een_tschepenen = [] 
      if(!tvsch){
      }else{
      tvsch.forEach(tvschs => {
        let start_date = new Date(tvschs[1])
          let bestuur_Start = start_date.getTime()
          let end_date = new Date(tvschs[2])
          let bestuur_End = end_date.getTime()
          if(+period_Start <= +bestuur_Start && !(+bestuur_End <= +today)){
            co_tvschs.push({
              voornaam: tvschs[7], achternaam: tvschs[8],functie: tvschs[12], fractie: tvschs[25]})
              return co_tvschs
        }// end condition 
    })
    let nameschepen = d3.group(co_tvschs, d => d.voornaam)
    for (const [key, value] of nameschepen){
        een_tschepenen.push({ voornaam:key , achternaam: value[0].achternaam, functie:value[0].functie, fractie: value[0].fractie})}
    }
 
   // Gemeenteraadsleden
   let grleden = [];
   let een_gr = [];
   let grl = bestuurfunctie.get('Gemeenteraadslid');
   if(!grl){
    }else{
      grl.forEach(gr => {
      let start_date = new Date(gr[1])
      let bestuur_Start = start_date.getTime()
      let end_date = new Date(gr[2])
      let bestuur_End = end_date.getTime()
      if(+period_Start <= +bestuur_Start && !(+bestuur_End <= +today)){
          grleden.push({voornaam: gr[7], achternaam: gr[8], functie: gr[12], fractie: gr[25]})
      return grleden
      }// end condition
  })
  let nameschepen = d3.group(grleden, d => d.voornaam)
  for (const [key, value] of nameschepen){
      een_gr.push({ voornaam:key , achternaam: value[0].achternaam, functie:value[0].functie, fractie: value[0].fractie})}
    }
    
  let een_bestuurseenheid = this.getGemeente
    return {een_bestuurseenheid, een_burgemeester, een_schepenen, een_tschepenen, een_voorZgr, een_gr}  
  }

  } // end model */


}
