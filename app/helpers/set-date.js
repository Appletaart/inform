import { helper } from '@ember/component/helper';

export default helper(function setDate(params/*, hash*/) {
  const [date] = params
  const start_date = new Date(date);
  const geplande_Date = start_date.toDateString()

  return geplande_Date;
});
