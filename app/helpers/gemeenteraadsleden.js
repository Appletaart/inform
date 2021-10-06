import { helper } from '@ember/component/helper';

export default helper(function gemeenteraadsleden(params/*, hash*/) {
  const [population] = params
  const leden = null;
  if(population < 1000){
    const leden = 7
    return leden;
  }if (population > 999 && population < 2000) {
    const leden = 9
    return leden;
  }if (population > 1999 && population < 3000 )  {
    const leden = 11
    return leden;
  }if (population > 2999 && population < 4000 )  {
    const leden = 13
    return leden;
  }if (population > 3999 && population < 5000 )  {
    const leden = 15
    return leden;
  }if (population > 4999 && population < 6000 )  {
    const leden = 17
    return leden;
  }if (population > 5999 && population < 9000)  {   
    const leden = 19
    return leden;
  }if (population > 8999 && population < 12000)  {   
    const leden = 21
    return leden;
  }if (population > 11999 && population < 15000)  {   
    const leden = 23
    return leden;
  }if (population > 14999 && population < 20000)  {   
    const leden = 25
    return leden;
  }if (population > 19999 && population < 25000)  {   
    const leden = 27
    return leden;
  }if (population > 24999 && population < 30000)  {   
    const leden = 29
    return leden;
  }if (population > 29999 && population < 35000)  {   
    const leden = 31
    return leden;
  }if (population > 34999 && population < 40000)  {   
    const leden = 33
    return leden;
  }if (population > 39999 && population < 50000)  {   
    const leden = 35
    return leden;
  }if (population > 49999 && population < 60000)  {   
    const leden = 37
    return leden;
  }if (population > 59999 && population < 70000)  {   
    const leden = 39
    return leden;
  }if (population > 69999 && population < 80000)  {   
    const leden = 41
    return leden;
  }if (population > 79999 && population < 90000)  {   
    const leden = 43
    return leden;
  }if (population > 89999 && population < 100000)  {   
    const leden = 45
    return leden;
  }if (population > 99999 && population < 150000)  {   
    const leden = 47
    return leden;
  }if (population > 149999 && population < 200000)  {   
    const leden = 49
    return leden;
  }if (population > 199999 && population < 250000)  {   
    const leden = 51
    return leden;
  }if (population > 249999 && population < 300000)  {   
    const leden = 53
    return leden;
  }if (population > 300000)  {   
    const leden = 55
    return leden;
  }
  return leden 
});
