import { helper } from '@ember/component/helper';

export default helper(function setTime(params/*, hash*/) {
  const [date] = params
  const start_date = new Date(date);
  const geplande_Time = start_date.toLocaleTimeString()
 
  return geplande_Time;
});
