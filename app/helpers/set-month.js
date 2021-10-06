import { helper } from '@ember/component/helper';

export default helper(function setMonth(params/*, hash*/) {
  const month = new Array();
  month[0] = "Jan";
  month[1] = "Feb";
  month[2] = "Mar";
  month[3] = "Apr";
  month[4] = "Mei";
  month[5] = "Jun";
  month[6] = "Jul";
  month[7] = "Aug";
  month[8] = "Sep";
  month[9] = "Okt";
  month[10] = "Nov";
  month[11] = "Dec"; 

const [date] = params
const start_date = new Date(date);
const geplandeMonth = start_date.getMonth();
const geplande_Month = month[geplandeMonth]
return geplande_Month;
});
