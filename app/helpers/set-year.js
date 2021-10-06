import { helper } from '@ember/component/helper';

export default helper(function setYear(params/*, hash*/) {
  const [date] = params
  const start_date = new Date(date);
  const geplande_Year = start_date.getFullYear();

  return geplande_Year;
});
