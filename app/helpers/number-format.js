import { helper } from '@ember/component/helper';

export default helper(function numberFormat(params/*, hash*/) {
  const  [number]  = params;
  const test = new Intl.NumberFormat('de-DE').format(number); 
  return test
});
